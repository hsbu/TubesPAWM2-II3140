import { useEffect, useRef } from 'react';
import { updateUserProgress, getUserProgress } from '../lib/api';
import { useAuth } from '../context/auth-context';

// Lesson slug to ID mapping
const LESSON_IDS: Record<string, number> = {
    'linear-equations': 1,
    'linear-inequalities': 2,
    'nonlinear-systems': 3,
    'calculus-applications': 4,
};

/**
 * Hook to track lesson progress.
 * - Adds 50% when lesson is opened (one-time)
 * - Use addQuestionProgress() to add 10% per correct answer
 */
export function useLessonProgress(lessonSlug: string) {
    const { isAuthenticated } = useAuth();
    const hasTrackedOpen = useRef(false);
    const currentProgress = useRef(0);
    const lessonId = LESSON_IDS[lessonSlug];

    useEffect(() => {
        if (!isAuthenticated || !lessonId || hasTrackedOpen.current) return;

        const trackLessonOpen = async () => {
            try {
                // Get current progress first
                const progressRes = await getUserProgress();
                if (progressRes.success) {
                    const existingProgress = progressRes.data.find(
                        (p: any) => p.lesson_id === lessonId
                    );
                    currentProgress.current = existingProgress?.completion_percentage || 0;
                }

                // Only add 50% if user hasn't opened this lesson before (progress < 50)
                if (currentProgress.current < 50) {
                    const newProgress = 50;
                    await updateUserProgress({
                        lessonId,
                        status: 'in_progress',
                        completionPercentage: newProgress,
                    });
                    currentProgress.current = newProgress;
                    console.log(`📚 Lesson ${lessonSlug} opened: ${newProgress}% progress`);
                }

                hasTrackedOpen.current = true;
            } catch (error) {
                console.log('Failed to track lesson open:', error);
            }
        };

        trackLessonOpen();
    }, [isAuthenticated, lessonId, lessonSlug]);

    // Function to add 10% for correct answers
    const addQuestionProgress = async () => {
        if (!isAuthenticated || !lessonId) return;

        try {
            const newProgress = Math.min(currentProgress.current + 10, 100);
            const status = newProgress >= 100 ? 'completed' : 'in_progress';

            await updateUserProgress({
                lessonId,
                status,
                completionPercentage: newProgress,
            });

            currentProgress.current = newProgress;
            console.log(`✅ Question correct: ${newProgress}% progress (${status})`);
        } catch (error) {
            console.log('Failed to update question progress:', error);
        }
    };

    return { addQuestionProgress, lessonId };
}
