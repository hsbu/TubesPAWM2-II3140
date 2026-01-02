import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Debug: Log the API URL being used
console.log('📡 Mobile API Base URL:', API_BASE_URL);

export class APIError extends Error {
    constructor(message: string, public status?: number, public details?: any) {
        super(message);
        this.name = 'APIError';
    }
}

export interface User {
    user_id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

export interface Lesson {
    lesson_id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    order_index: number;
    is_published: boolean;
    created_at: string;
}

export interface PracticeProblem {
    practice_id: number;
    lesson_id: number;
    question: string;
    choices: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    order_index: number;
}

export interface UserProgress {
    progress_id: number;
    user_id: string;
    lesson_id: number;
    status: 'not_started' | 'in_progress' | 'completed';
    completion_percentage: number;
    started_at?: string;
    completed_at?: string;
    last_accessed: string;
}

export interface PracticeAttempt {
    attempt_id: number;
    user_id: string;
    practice_id: number;
    user_answer: string;
    is_correct: boolean;
    time_taken: number;
    attempted_at: string;
}

export interface DashboardStats {
    stats: {
        completedLessons: number;
        totalLessons: number;
        totalProblems: number;
        accuracy: number;
        streak: number;
    };
    weeklyAccuracy: Array<{
        day: string;
        accuracy: number;
    }>;
    lessonProgress: Array<{
        name: string;
        slug: string;
        completed: number;
        status: string;
    }>;
    recentActivity: Array<{
        lesson: string;
        topic: string;
        score: string;
        status: string;
        attempted_at: string;
    }>;
}

export interface APIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: any;
        session: any;
    };
    message?: string;
}

class APIClient {
    private baseURL: string;
    private token: string | null = null;
    private tokenPromise: Promise<string | null> | null = null;

    constructor() {
        this.baseURL = API_BASE_URL;
        // Load token initially
        this.tokenPromise = AsyncStorage.getItem('auth_token').then(token => {
            this.token = token;
            return token;
        });
    }

    // Set authentication token
    async setAuthToken(token: string) {
        this.token = token;
        await AsyncStorage.setItem('auth_token', token);
    }

    // Clear authentication token
    async clearAuthToken() {
        this.token = null;
        await AsyncStorage.removeItem('auth_token');
    }

    private async getValidToken(): Promise<string | null> {
        if (this.token) return this.token;
        if (this.tokenPromise) return await this.tokenPromise;
        return await AsyncStorage.getItem('auth_token');
    }

    // Generic request method
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {})
        };

        const token = await this.getValidToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            console.log('API Request:', { url, method: options.method || 'GET', hasToken: !!token });

            const response = await fetch(url, {
                ...options,
                headers,
            });

            const contentType = response.headers.get('content-type');

            // Handle cases where response might not be JSON (e.g., 404 HTML page)
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response received:', {
                    url,
                    status: response.status,
                    contentType,
                    bodySnippet: text.substring(0, 100)
                });
                throw new APIError(
                    `Expected JSON but received ${contentType || 'no content-type'}`,
                    response.status
                );
            }

            const data = await response.json();

            if (!response.ok) {
                console.error('API Error Response:', {
                    url,
                    status: response.status,
                    data,
                });
                throw new APIError(
                    data.message || `Request failed with status ${response.status}`,
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            console.error('Network error:', error);
            throw new APIError(
                error instanceof Error ? error.message : 'Network error occurred'
            );
        }
    }

    // Health check
    async healthCheck(): Promise<APIResponse<{ message: string }>> {
        return this.request('/api/health');
    }

    // Authentication methods
    async signUp(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        return this.request('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async signIn(credentials: {
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        const response = await this.request<AuthResponse['data']>('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        // Handle token storage on successful signin
        // Note: The structure depends on what your backend returns. 
        // Usually it's session: { access_token: ... }
        if (response.success && response.data?.session?.access_token) {
            await this.setAuthToken(response.data.session.access_token);
        } else if (response.success && (response.data as any)?.token) {
            // fallback if structure is different
            await this.setAuthToken((response.data as any).token);
        }

        return response as AuthResponse;
    }

    async signOut(): Promise<APIResponse<any>> {
        // Just clear local token, no need to call backend
        await this.clearAuthToken();
        return { success: true, data: null, message: 'Signed out successfully' };
    }

    // Lesson methods
    async getLessons(): Promise<APIResponse<Lesson[]>> {
        return this.request<Lesson[]>('/api/lessons');
    }

    async getMe(): Promise<APIResponse<User>> {
        return this.request<User>('/api/me');
    }

    async getLessonBySlug(slug: string): Promise<APIResponse<Lesson>> {
        return this.request(`/api/lessons/${slug}`);
    }

    // Practice methods
    async getPracticeProblems(lessonId: number): Promise<APIResponse<PracticeProblem[]>> {
        return this.request<PracticeProblem[]>(`/api/practice/${lessonId}`);
    }

    async getPreviousAttempts(lessonId: number): Promise<APIResponse<Array<{
        practice_id: number;
        is_correct: boolean;
        user_answer: string;
        correct_answer: string;
        attempted_at: string;
    }>>> {
        return this.request(`/api/practice/attempts/${lessonId}`);
    }

    async submitPracticeAttempt(attemptData: {
        practiceId: number;
        userAnswer: string;
        timeTaken: number;
    }): Promise<APIResponse<PracticeAttempt>> {
        return this.request('/api/practice/attempt', {
            method: 'POST',
            body: JSON.stringify({
                practiceId: attemptData.practiceId,
                userAnswer: attemptData.userAnswer,
                timeTaken: attemptData.timeTaken
            })
        });
    }

    // Progress methods
    async getUserProgress(): Promise<APIResponse<UserProgress[]>> {
        return this.request('/api/user/progress');
    }

    async getDashboardStats(): Promise<APIResponse<DashboardStats>> {
        return this.request('/api/dashboard/stats');
    }

    async updateUserProgress(progressData: {
        lessonId: number;
        status: UserProgress['status'];
        completionPercentage: number;
    }): Promise<APIResponse<UserProgress>> {
        return this.request('/api/user/progress', {
            method: 'POST',
            body: JSON.stringify({
                lessonId: progressData.lessonId,
                status: progressData.status,
                completionPercentage: progressData.completionPercentage
            })
        });
    }

    // Settings methods
    async updateUserProfile(profileData: {
        name?: string;
        email?: string;
    }): Promise<APIResponse<User>> {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData: {
        currentPassword: string;
        newPassword: string;
    }): Promise<APIResponse<{ message: string }>> {
        return this.request('/api/user/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
    }

    async deleteAccount(password: string): Promise<APIResponse<{ message: string }>> {
        return this.request('/api/user/account', {
            method: 'DELETE',
            body: JSON.stringify({ password })
        });
    }
}

export const apiClient = new APIClient();

export const healthCheck = () => apiClient.healthCheck();
export const signUp = (userData: Parameters<APIClient['signUp']>[0]) => apiClient.signUp(userData);
export const signIn = (credentials: Parameters<APIClient['signIn']>[0]) => apiClient.signIn(credentials);
export const signOut = () => apiClient.signOut();
export const getMe = () => apiClient.getMe();
export const getLessons = () => apiClient.getLessons();
export const getLessonBySlug = (slug: string) => apiClient.getLessonBySlug(slug);
export const getPracticeProblems = (lessonId: number) => apiClient.getPracticeProblems(lessonId);
export const getPreviousAttempts = (lessonId: number) => apiClient.getPreviousAttempts(lessonId);
export const submitPracticeAttempt = (attemptData: Parameters<APIClient['submitPracticeAttempt']>[0]) =>
    apiClient.submitPracticeAttempt(attemptData);
export const getUserProgress = () => apiClient.getUserProgress();
export const getDashboardStats = () => apiClient.getDashboardStats();
export const updateUserProgress = (progressData: Parameters<APIClient['updateUserProgress']>[0]) =>
    apiClient.updateUserProgress(progressData);
export const updateUserProfile = (profileData: Parameters<APIClient['updateUserProfile']>[0]) =>
    apiClient.updateUserProfile(profileData);
export const changePassword = (passwordData: Parameters<APIClient['changePassword']>[0]) =>
    apiClient.changePassword(passwordData);
export const deleteAccount = (password: string) => apiClient.deleteAccount(password);

export default apiClient;
