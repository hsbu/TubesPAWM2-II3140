import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'expo-router';
import { getDashboardStats, DashboardStats } from '../lib/api';
import { useEffect, useState } from 'react';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/colors';
import { useResponsive, getContainerStyle } from '../hooks/use-responsive';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

// Custom icon components
const PlayIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M8 5v14l11-7L8 5z" fill={color} />
    </Svg>
);

const BookIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const TrendingIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const TargetIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle key="outer" cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <Circle key="middle" cx="12" cy="12" r="6" stroke={color} strokeWidth="2"/>
        <Circle key="inner" cx="12" cy="12" r="2" fill={color}/>
    </Svg>
);

// Circular Progress Component
const CircularProgress = ({ progress, size = 60, strokeWidth = 6, color = '#8b5cf6' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
        <Svg width={size} height={size}>
            <Circle
                key="bg"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                key="progress"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </Svg>
    );
};

// Progress Bar Component
const ProgressBar = ({ progress, color = '#8b5cf6', height = 6 }: { progress: number; color?: string; height?: number }) => (
    <View style={{ 
        height, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: height / 2,
        overflow: 'hidden',
    }}>
        <View style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
            borderRadius: height / 2,
        }} />
    </View>
);

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const { isMobile, isDesktop, containerMaxWidth, containerPadding } = useResponsive();

    useEffect(() => {
        if (isAuthenticated) {
            getDashboardStats().then(res => {
                if (res.success) {
                    console.log('Home - Dashboard Stats:', JSON.stringify(res.data.lessonProgress, null, 2));
                    setStats(res.data);
                }
            }).catch(err => {
                console.log('Failed to get dashboard stats:', err);
            });
        }
    }, [isAuthenticated]);

    const lessons: Array<{
        id: string;
        title: string;
        desc: string;
        color: string;
        gradient: [string, string];
    }> = [
        { 
            id: 'linear-equations', 
            title: 'Linear Equations', 
            desc: 'Master slope, intercepts, and standard forms.', 
            color: '#3b82f6',
            gradient: ['#3b82f6', '#1d4ed8'],
        },
        { 
            id: 'linear-inequalities', 
            title: 'Linear Inequalities', 
            desc: 'Learn to graph solution regions.', 
            color: '#22c55e',
            gradient: ['#22c55e', '#16a34a'],
        },
        { 
            id: 'nonlinear-systems', 
            title: 'Non-Linear Systems', 
            desc: 'Explore parabolas, circles, and more.', 
            color: '#8b5cf6',
            gradient: ['#8b5cf6', '#7c3aed'],
        },
        { 
            id: 'calculus-applications', 
            title: 'Calculus Applications', 
            desc: 'Apply calculus to real-world problems.', 
            color: '#f97316',
            gradient: ['#f97316', '#ea580c'],
        },
    ];

    // Get progress for a lesson from stats (match by title)
    const getLessonProgress = (lessonTitle: string): number => {
        if (!stats || !stats.lessonProgress) return 0;
        const lessonData = stats.lessonProgress.find(l => l.name === lessonTitle);
        return lessonData ? lessonData.completed : 0;
    };

    // Get status for a lesson from stats
    const getLessonStatus = (lessonTitle: string): string => {
        if (!stats || !stats.lessonProgress) return 'not_started';
        const lessonData = stats.lessonProgress.find(l => l.name === lessonTitle);
        if (!lessonData) return 'not_started';
        if (lessonData.completed === 100) return 'completed';
        if (lessonData.completed > 0) return 'in_progress';
        return 'not_started';
    };

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
                    {/* Welcome Header */}
                    <View style={{ marginBottom: Spacing.xl }}>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                            fontWeight: 'bold',
                            color: '#fff',
                        }}>
                            {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0] || 'Student'}!` : 'Welcome to Webculus'}
                        </Text>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: Spacing.xs,
                        }}>
                            {isAuthenticated
                                ? "Ready to continue your calculus journey?"
                                : "Your web-based calculus friend, now on mobile!"}
                        </Text>
                    </View>

                    {/* Call to Action for Non-Authenticated Users */}
                    {!isAuthenticated && (
                        <View style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.15)',
                            borderRadius: BorderRadius.xl,
                            padding: isDesktop ? Spacing.xl : Spacing.lg,
                            borderWidth: 1,
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                            marginBottom: Spacing.xl,
                            maxWidth: isDesktop ? 1128   : '100%',
                        }}>
                            <Text style={{ fontSize: FontSizes.xl, fontWeight: '600', color: '#fff' }}>
                                Get Started
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs, marginBottom: Spacing.lg }}>
                                Sign in to track your progress and access all features.
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/auth/signin')}
                                style={{
                                    overflow: 'hidden',
                                    borderRadius: BorderRadius.md,
                                }}
                            >
                                <LinearGradient
                                    colors={['#8b5cf6', '#6366f1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        paddingVertical: Spacing.md,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                                        Sign In / Sign Up
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Stats Overview for Authenticated Users */}
                    {isAuthenticated && stats && (
                        <View style={{
                            flexDirection: isDesktop ? 'row' : 'column',
                            gap: Spacing.md,
                            marginBottom: Spacing.xl,
                        }}>
                            {/* My Progress Card */}
                            <View style={{
                                flex: isDesktop ? 1 : undefined,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: BorderRadius.xl,
                                padding: Spacing.lg,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.1)',
                            }}>
                                <Text style={{ 
                                    fontSize: FontSizes.lg, 
                                    fontWeight: '600', 
                                    color: '#fff',
                                    marginBottom: Spacing.md,
                                }}>
                                    My Progress
                                </Text>
                                
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ position: 'relative' }}>
                                            <CircularProgress 
                                                progress={(stats.stats.completedLessons / stats.stats.totalLessons) * 100} 
                                                size={80} 
                                                strokeWidth={8}
                                                color="#8b5cf6"
                                            />
                                            <View style={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                left: 0, 
                                                right: 0, 
                                                bottom: 0, 
                                                justifyContent: 'center', 
                                                alignItems: 'center' 
                                            }}>
                                                <Text style={{ fontSize: FontSizes.lg, fontWeight: 'bold', color: '#fff' }}>
                                                    {Math.round((stats.stats.completedLessons / stats.stats.totalLessons) * 100)}%
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.xs }}>
                                            Completed
                                        </Text>
                                    </View>
                                    
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm }}>Lessons</Text>
                                            <Text style={{ color: '#8b5cf6', fontWeight: '600' }}>
                                                {stats.stats.completedLessons}/{stats.stats.totalLessons}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm }}>Problems Solved</Text>
                                            <Text style={{ color: '#22c55e', fontWeight: '600' }}>
                                                {stats.stats.totalProblems}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm }}>Accuracy</Text>
                                            <Text style={{ color: '#f97316', fontWeight: '600' }}>
                                                {stats.stats.accuracy}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Streak Card */}
                            <View style={{
                                flex: isDesktop ? 0.5 : undefined,
                                minWidth: isDesktop ? 180 : undefined,
                                borderRadius: BorderRadius.xl,
                                overflow: 'hidden',
                            }}>
                                <LinearGradient
                                    colors={['#8b5cf6', '#6366f1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        padding: Spacing.lg,
                                        minHeight: isDesktop ? '100%' : 80,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View style={{ 
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: Spacing.md,
                                    }}>
                                        <View style={{ 
                                            width: 48, 
                                            height: 48, 
                                            borderRadius: 24, 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{ fontSize: 24 }}>🔥</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: FontSizes['3xl'], fontWeight: 'bold', color: '#fff' }}>
                                                {stats.stats.streak}
                                            </Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: FontSizes.sm }}>
                                                Day Streak
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>
                    )}

                    {/* Course Progress Section */}
                    <View style={{ marginBottom: Spacing.xl }}>
                        <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: Spacing.md,
                        }}>
                            <Text style={{
                                fontSize: isDesktop ? FontSizes['2xl'] : FontSizes.xl,
                                fontWeight: '600',
                                color: '#fff',
                            }}>
                                Courses
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/lessons')}>
                                <Text style={{ color: '#8b5cf6', fontSize: FontSizes.sm }}>View All →</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: isDesktop ? 'row' : 'column',
                            flexWrap: 'wrap',
                            gap: Spacing.lg,
                        }}>
                            {lessons.map((lesson) => {
                                const progress = getLessonProgress(lesson.title);
                                const status = getLessonStatus(lesson.title);
                                
                                return (
                                    <TouchableOpacity
                                        key={lesson.id}
                                        onPress={() => router.push(`/lessons/${lesson.id}` as any)}
                                        style={{
                                            width: isDesktop ? '48%' : '100%',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderRadius: BorderRadius.xl,
                                            padding: Spacing.lg,
                                            borderWidth: 1,
                                            borderColor: 'rgba(255,255,255,0.1)',
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                                            {/* Icon with gradient background */}
                                            <View style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: BorderRadius.lg,
                                                overflow: 'hidden',
                                            }}>
                                                <LinearGradient
                                                    colors={lesson.gradient}
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <BookIcon size={24} color="#fff" />
                                                </LinearGradient>
                                            </View>
                                            
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ 
                                                    fontSize: FontSizes.lg, 
                                                    fontWeight: '600', 
                                                    color: '#fff',
                                                    marginBottom: 2,
                                                }}>
                                                    {lesson.title}
                                                </Text>
                                                
                                                
                                                {/* Progress bar */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                                                    <View style={{ flex: 1 }}>
                                                        <ProgressBar progress={progress} color={lesson.color} />
                                                    </View>
                                                    <Text style={{ 
                                                        color: lesson.color, 
                                                        fontSize: FontSizes.sm,
                                                        fontWeight: '600',
                                                        minWidth: 40,
                                                    }}>
                                                        {progress}%
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            {/* Status badge */}
                                            <View style={{
                                                backgroundColor: status === 'not_started' 
                                                    ? 'rgba(255,255,255,0.1)' 
                                                    : status === 'completed' 
                                                        ? 'rgba(34, 197, 94, 0.2)'
                                                        : 'rgba(139, 92, 246, 0.2)',
                                                paddingHorizontal: Spacing.sm,
                                                paddingVertical: 4,
                                                borderRadius: BorderRadius.md,
                                            }}>
                                                <Text style={{ 
                                                    fontSize: FontSizes.xs, 
                                                    color: status === 'not_started' 
                                                        ? 'rgba(255,255,255,0.6)' 
                                                        : status === 'completed' 
                                                            ? '#22c55e'
                                                            : '#8b5cf6',
                                                    fontWeight: '500',
                                                }}>
                                                    {status === 'not_started' ? 'Not Started' : status === 'completed' ? 'Completed' : 'In Progress'}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['2xl'] : FontSizes.xl,
                            fontWeight: '600',
                            color: '#fff',
                            marginBottom: Spacing.md,
                        }}>
                            Quick Actions
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            gap: Spacing.md,
                            maxWidth: isDesktop ? 1126 : '100%',
                        }}>
                            <TouchableOpacity
                                onPress={() => router.push('/practice')}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: BorderRadius.xl,
                                    padding: Spacing.lg,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    overflow: 'hidden',
                                    marginBottom: Spacing.sm,
                                }}>
                                    <LinearGradient
                                        colors={['#3b82f6', '#1d4ed8']}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TargetIcon size={28} color="#fff" />
                                    </LinearGradient>
                                </View>
                                <Text style={{ fontWeight: '600', color: '#fff' }}>Practice</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/dashboard')}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: BorderRadius.xl,
                                    padding: Spacing.lg,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    overflow: 'hidden',
                                    marginBottom: Spacing.sm,
                                }}>
                                    <LinearGradient
                                        colors={['#8b5cf6', '#7c3aed']}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TrendingIcon size={28} color="#fff" />
                                    </LinearGradient>
                                </View>
                                <Text style={{ fontWeight: '600', color: '#fff' }}>Dashboard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
