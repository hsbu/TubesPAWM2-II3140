import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { getLessons, getPracticeProblems, submitPracticeAttempt, updateUserProgress, getUserProgress, Lesson, PracticeProblem } from '../lib/api';
import { Spacing, FontSizes, BorderRadius } from '../constants/colors';
import { useResponsive, getContainerStyle } from '../hooks/use-responsive';

// Lesson slug to ID mapping (for progress tracking)
const LESSON_SLUGS: Record<number, string> = {
    1: 'linear-equations',
    2: 'linear-inequalities',
    3: 'nonlinear-systems',
    4: 'calculus-applications',
};

export default function Practice() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { isMobile, isDesktop, containerMaxWidth, containerPadding } = useResponsive();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
    const [problems, setProblems] = useState<PracticeProblem[]>([]);
    const [currentProblem, setCurrentProblem] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const lessonProgressRef = useRef<Record<number, number>>({});

    useEffect(() => {
        getLessons()
            .then(res => { if (res.success) setLessons(res.data); })
            .catch(err => console.log('Lessons error:', err));

        // Load current progress for all lessons
        if (isAuthenticated) {
            getUserProgress()
                .then(res => {
                    if (res.success) {
                        res.data.forEach((p: any) => {
                            lessonProgressRef.current[p.lesson_id] = p.completion_percentage || 0;
                        });
                    }
                })
                .catch(err => console.log('Progress error:', err));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (selectedLesson && isAuthenticated) {
            getPracticeProblems(selectedLesson)
                .then(res => { if (res.success) setProblems(res.data); })
                .catch(err => console.log('Problems error:', err));
        }
    }, [selectedLesson, isAuthenticated]);

    const filteredProblems = problems.filter(p => p.difficulty === difficulty);
    const current = filteredProblems[currentProblem];

    const handleSubmit = async () => {
        if (!current || !userAnswer.trim() || !selectedLesson) return;

        try {
            const correct = userAnswer.trim().toLowerCase() === current.correct_answer.toLowerCase();
            setIsCorrect(correct);
            setShowResult(true);

            await submitPracticeAttempt({
                practiceId: current.practice_id,
                userAnswer: userAnswer.trim(),
                timeTaken: 30,
            });

            // If correct, add 10% to lesson progress
            if (correct) {
                const currentProgress = lessonProgressRef.current[selectedLesson] || 0;
                const newProgress = Math.min(currentProgress + 10, 100);
                const status = newProgress >= 100 ? 'completed' : 'in_progress';

                await updateUserProgress({
                    lessonId: selectedLesson,
                    status,
                    completionPercentage: newProgress,
                });

                lessonProgressRef.current[selectedLesson] = newProgress;
                console.log(`✅ Correct! ${LESSON_SLUGS[selectedLesson]} progress: ${newProgress}%`);
            }
        } catch (err) {
            console.log('Submit error:', err);
            Alert.alert('Error', 'Failed to submit answer');
        }
    };

    const handleNext = () => {
        setShowResult(false);
        setUserAnswer('');
        if (currentProblem < filteredProblems.length - 1) {
            setCurrentProblem(currentProblem + 1);
        } else {
            Alert.alert('Complete!', 'You completed all problems in this difficulty level!');
            setCurrentProblem(0);
        }
    };

    if (!isAuthenticated) {
        return (
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}
            >
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: BorderRadius.xl,
                    padding: Spacing.xxl,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    maxWidth: 400,
                    width: '100%',
                }}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Spacing.lg,
                    }}>
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#8b5cf6',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>✎</Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: FontSizes['2xl'],
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: Spacing.sm,
                        textAlign: 'center',
                    }}>
                        Start Practicing
                    </Text>
                    <Text style={{
                        fontSize: FontSizes.base,
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        marginBottom: Spacing.xl,
                        lineHeight: 24,
                    }}>
                        Sign in to access practice problems, test your knowledge, and track your progress through quiz.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/auth/signin')}
                        style={{
                            backgroundColor: '#8b5cf6',
                            paddingVertical: Spacing.md,
                            paddingHorizontal: Spacing.xxl,
                            borderRadius: BorderRadius.md,
                            width: '100%',
                            marginBottom: Spacing.md,
                        }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: FontSizes.lg }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.sm }}>
                            Don't have an account? <Text style={{ color: '#8b5cf6', fontWeight: '600' }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#0f0c29', '#302b63', '#24243e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{
                    ...getContainerStyle(containerMaxWidth, containerPadding),
                    paddingBottom: Spacing.xxl,
                }}>
                    {/* Header */}
                    <View style={{ marginBottom: Spacing.xl }}>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                            fontWeight: 'bold',
                            color: '#fff',
                        }}>
                            Practice
                        </Text>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: Spacing.xs,
                        }}>
                            Sharpen your skills with practice problems
                        </Text>
                    </View>

                    {/* Main Layout */}
                    <View style={{
                        flexDirection: isDesktop ? 'row' : 'column',
                        gap: Spacing.xl,
                        alignItems: isDesktop ? 'flex-start' : undefined,
                    }}>
                        {/* Left side: Selection controls */}
                        <View style={{ 
                            width: isDesktop ? 220 : '100%',
                            flexShrink: 0,
                            backgroundColor: isDesktop ? 'rgba(255,255,255,0.03)' : 'transparent',
                            borderRadius: isDesktop ? BorderRadius.xl : 0,
                            padding: isDesktop ? Spacing.lg : 0,
                            borderWidth: isDesktop ? 1 : 0,
                            borderColor: 'rgba(255,255,255,0.08)',
                        }}>
                            {/* Lesson Selection */}
                            <View style={{ marginBottom: Spacing.lg }}>
                                <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Select Lesson
                                </Text>
                                {isDesktop ? (
                                    <View style={{ gap: Spacing.xs }}>
                                        {lessons.map(lesson => (
                                            <TouchableOpacity
                                                key={lesson.lesson_id}
                                                onPress={() => { setSelectedLesson(lesson.lesson_id); setCurrentProblem(0); }}
                                                style={{
                                                    paddingVertical: Spacing.sm,
                                                    paddingHorizontal: Spacing.md,
                                                    backgroundColor: selectedLesson === lesson.lesson_id ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                                    borderRadius: BorderRadius.md,
                                                    borderWidth: 1,
                                                    borderColor: selectedLesson === lesson.lesson_id ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                <Text style={{ color: '#fff', fontSize: FontSizes.sm }}>
                                                    {lesson.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {lessons.map(lesson => (
                                            <TouchableOpacity
                                                key={lesson.lesson_id}
                                                onPress={() => { setSelectedLesson(lesson.lesson_id); setCurrentProblem(0); }}
                                                style={{
                                                    paddingVertical: Spacing.sm,
                                                    paddingHorizontal: Spacing.md,
                                                    backgroundColor: selectedLesson === lesson.lesson_id ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                                    borderRadius: BorderRadius.md,
                                                    marginRight: Spacing.xs,
                                                    borderWidth: 1,
                                                    borderColor: selectedLesson === lesson.lesson_id ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                <Text style={{ color: '#fff', fontSize: FontSizes.sm }}>
                                                    {lesson.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            {/* Difficulty Tabs */}
                            <View style={{ marginBottom: isDesktop ? 0 : Spacing.lg }}>
                                <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Difficulty
                                </Text>
                                <View style={{ 
                                    flexDirection: isDesktop ? 'column' : 'row', 
                                    gap: Spacing.xs,
                                }}>
                                    {(['easy', 'medium', 'hard'] as const).map(d => (
                                        <TouchableOpacity
                                            key={d}
                                            onPress={() => { setDifficulty(d); setCurrentProblem(0); setShowResult(false); }}
                                            style={{
                                                flex: isDesktop ? undefined : 1,
                                                paddingVertical: Spacing.sm,
                                                paddingHorizontal: Spacing.md,
                                                backgroundColor: difficulty === d ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                                borderRadius: BorderRadius.md,
                                                borderWidth: 1,
                                                borderColor: difficulty === d ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            <Text style={{
                                                textAlign: 'center',
                                                textTransform: 'capitalize',
                                                fontWeight: '500',
                                                color: difficulty === d ? '#fff' : 'rgba(255,255,255,0.8)',
                                                fontSize: FontSizes.sm,
                                            }}>
                                                {d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Right side: Problem Card */}
                        <View style={{ flex: 1, maxWidth: isDesktop ? 600 : '100%' }}>
                            {selectedLesson && current ? (
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: BorderRadius.xl,
                                    padding: Spacing.lg,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
                                        <Text style={{ fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.5)' }}>
                                            Problem {currentProblem + 1} of {filteredProblems.length}
                                        </Text>
                                        <View style={{
                                            backgroundColor: difficulty === 'easy' ? 'rgba(34,197,94,0.2)' : difficulty === 'medium' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                                            paddingVertical: 2,
                                            paddingHorizontal: Spacing.sm,
                                            borderRadius: BorderRadius.full,
                                        }}>
                                            <Text style={{
                                                fontSize: FontSizes.xs,
                                                color: difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#eab308' : '#ef4444',
                                                textTransform: 'capitalize',
                                                fontWeight: '500',
                                            }}>
                                                {difficulty}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{
                                        fontSize: FontSizes.lg,
                                        color: '#fff',
                                        marginBottom: Spacing.lg,
                                        fontWeight: '500',
                                        lineHeight: 26,
                                    }}>
                                        {current.question}
                                    </Text>

                                    {current.choices && current.choices.length > 0 ? (
                                        <View style={{
                                            marginBottom: Spacing.md,
                                            gap: Spacing.sm,
                                        }}>
                                            {current.choices.map((choice, idx) => (
                                                <TouchableOpacity
                                                    key={idx}
                                                    onPress={() => setUserAnswer(choice)}
                                                    style={{
                                                        width: '100%',
                                                        paddingVertical: Spacing.md,
                                                        paddingHorizontal: Spacing.md,
                                                        backgroundColor: userAnswer === choice ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                                                        borderRadius: BorderRadius.md,
                                                        borderWidth: 1,
                                                        borderColor: userAnswer === choice ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: Spacing.sm,
                                                    }}
                                                >
                                                    <View style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 12,
                                                        borderWidth: 2,
                                                        borderColor: userAnswer === choice ? '#8b5cf6' : 'rgba(255,255,255,0.3)',
                                                        backgroundColor: userAnswer === choice ? '#8b5cf6' : 'transparent',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        {userAnswer === choice && (
                                                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
                                                        )}
                                                    </View>
                                                    <Text style={{ 
                                                        color: '#fff', 
                                                        fontSize: FontSizes.base,
                                                        fontWeight: userAnswer === choice ? '500' : '400',
                                                        flex: 1,
                                                    }}>
                                                        {choice}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ) : (
                                        <TextInput
                                            value={userAnswer}
                                            onChangeText={setUserAnswer}
                                            placeholder="Your answer..."
                                            placeholderTextColor="rgba(255,255,255,0.4)"
                                            style={{
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: BorderRadius.md,
                                                padding: Spacing.md,
                                                marginBottom: Spacing.md,
                                                color: '#fff',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                fontSize: FontSizes.sm,
                                            }}
                                        />
                                    )}

                                    {showResult ? (
                                        <View>
                                            <View style={{
                                                padding: Spacing.md,
                                                backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                borderRadius: BorderRadius.md,
                                                marginBottom: Spacing.md,
                                                borderLeftWidth: 3,
                                                borderLeftColor: isCorrect ? '#22c55e' : '#ef4444',
                                            }}>
                                                <Text style={{ 
                                                    color: isCorrect ? '#22c55e' : '#ef4444', 
                                                    fontWeight: '600',
                                                    fontSize: FontSizes.base,
                                                }}>
                                                    {isCorrect ? '✓ Correct! (+10% progress)' : '✗ Incorrect'}
                                                </Text>
                                                {current.explanation && (
                                                    <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs, fontSize: FontSizes.sm, lineHeight: 20 }}>
                                                        {current.explanation}
                                                    </Text>
                                                )}
                                            </View>
                                            <TouchableOpacity
                                                onPress={handleNext}
                                                style={{
                                                    backgroundColor: '#8b5cf6',
                                                    paddingVertical: Spacing.md,
                                                    borderRadius: BorderRadius.md,
                                                }}
                                            >
                                                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: FontSizes.base }}>
                                                    Next Problem →
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            disabled={!userAnswer.trim()}
                                            style={{
                                                backgroundColor: userAnswer.trim() ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                                paddingVertical: Spacing.md,
                                                borderRadius: BorderRadius.md,
                                                opacity: userAnswer.trim() ? 1 : 0.6,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: FontSizes.base }}>
                                                Submit Answer
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    borderRadius: BorderRadius.xl,
                                    padding: Spacing.xl,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 250,
                                }}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: 'rgba(139,92,246,0.1)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: Spacing.md,
                                    }}>
                                        <Text style={{ fontSize: 24 }}>📝</Text>
                                    </View>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.base, textAlign: 'center', fontWeight: '500' }}>
                                        {selectedLesson ? 'No problems available' : 'Select a lesson'}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: FontSizes.sm, textAlign: 'center', marginTop: Spacing.xs }}>
                                        {selectedLesson ? 'Try a different difficulty level' : 'Choose a topic from the left to begin'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}