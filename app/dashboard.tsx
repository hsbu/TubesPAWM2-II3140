import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'expo-router';
import { getDashboardStats, DashboardStats } from '../lib/api';
import { useEffect, useState } from 'react';
import { Spacing, FontSizes, BorderRadius } from '../constants/colors';
import Svg, { Rect, Line, Circle, Text as SvgText, Path, G } from 'react-native-svg';
import { BookOpen, CheckCircle, TrendingUp, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Theme colors
const ThemeColors = {
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    foreground: '#fff',
    mutedForeground: 'rgba(255,255,255,0.6)',
    primary: '#8b5cf6',
    primaryForeground: '#fff',
    destructive: '#ef4444',
    chart: {
        blue: '#8b5cf6',
    },
};

// Breakpoints for responsive design
const BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
};

// Hook for responsive values
function useResponsive() {
    const { width } = useWindowDimensions();
    return {
        isMobile: width < BREAKPOINTS.tablet,
        isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop,
        isWide: width >= BREAKPOINTS.wide,
        width,
    };
}

const chartHeight = 200;

// Simple Bar Chart Component for Lesson Progress
function LessonProgressChart({ data, chartWidth }: { data: DashboardStats['lessonProgress']; chartWidth: number }) {
    const maxValue = 100;
    const totalBars = data.length;
    const availableWidth = chartWidth - 60; // Account for y-axis labels
    const barSpacing = Math.min(16, availableWidth / (totalBars * 3)); // Reduce spacing
    const barWidth = Math.min((availableWidth - (totalBars - 1) * barSpacing) / totalBars, 60); // Smaller bars for mobile

    return (
        <View style={{
            backgroundColor: ThemeColors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: ThemeColors.border,
            marginBottom: Spacing.lg,
        }}>
            <Text style={{ fontSize: FontSizes.lg, fontWeight: '600', color: ThemeColors.foreground, marginBottom: Spacing.xs }}>
                Lesson Progress
            </Text>
            <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground, marginBottom: Spacing.md }}>
                Completion percentage by lesson
            </Text>

            <Svg width={chartWidth} height={chartHeight + 50}>
                {/* Y-axis labels */}
                {[0, 20, 40, 60, 80].map((value, i) => (
                    <G key={`y-${i}`}>
                        <SvgText
                            x={20}
                            y={chartHeight - (value / maxValue) * (chartHeight - 20) + 5}
                            fontSize={10}
                            fill={ThemeColors.mutedForeground}
                            textAnchor="end"
                        >
                            {value}
                        </SvgText>
                        <Line
                            x1={30}
                            y1={chartHeight - (value / maxValue) * (chartHeight - 20)}
                            x2={chartWidth}
                            y2={chartHeight - (value / maxValue) * (chartHeight - 20)}
                            stroke={ThemeColors.border}
                            strokeWidth={1}
                            strokeDasharray="4,4"
                        />
                    </G>
                ))}

                {/* Bars */}
                {data.map((item, index) => {
                    const barHeight = (item.completed / maxValue) * (chartHeight - 20);
                    const totalBarWidth = data.length * barWidth + (data.length - 1) * barSpacing;
                    const startX = 40 + (chartWidth - 60 - totalBarWidth) / 2; // Center bars
                    const x = startX + index * (barWidth + barSpacing);
                    const y = chartHeight - barHeight;

                    return (
                        <G key={`bar-${index}-${item.name}`}>
                            <Rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={ThemeColors.chart.blue}
                                rx={4}
                            />
                            {/* Abbreviated labels */}
                            <SvgText
                                key={`label1-${index}`}
                                x={x + barWidth / 2}
                                y={chartHeight + 15}
                                fontSize={8}
                                fill={ThemeColors.mutedForeground}
                                textAnchor="middle"
                            >
                                {item.name.length > 12 ? item.name.substring(0, 10) + '..' : item.name.split(' ')[0]}
                            </SvgText>
                            {item.name.split(' ').length > 1 && (
                                <SvgText
                                    key={`label2-${index}`}
                                    x={x + barWidth / 2}
                                    y={chartHeight + 25}
                                    fontSize={8}
                                    fill={ThemeColors.mutedForeground}
                                    textAnchor="middle"
                                >
                                    {item.name.split(' ').slice(1).join(' ').substring(0, 10)}
                                </SvgText>
                            )}
                        </G>
                    );
                })}
            </Svg>

            {/* Legend */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: ThemeColors.chart.blue, borderRadius: 2, marginRight: Spacing.xs }} />
                    <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground }}>completed</Text>
                </View>
            </View>
        </View>
    );
}

// Simple Line Chart Component for Weekly Accuracy
function WeeklyAccuracyChart({ data, chartWidth }: { data: DashboardStats['weeklyAccuracy']; chartWidth: number }) {
    const maxValue = 100;
    const pointSpacing = (chartWidth - 60) / (data.length - 1 || 1);

    // Generate path for line
    const generatePath = () => {
        if (data.length === 0) return '';

        const points = data.map((item, index) => {
            const x = 40 + index * pointSpacing;
            const y = chartHeight - 20 - (item.accuracy / maxValue) * (chartHeight - 40);
            return { x, y };
        });

        let path = `M ${points[0].x} ${points[0].y}`;

        // Create smooth curve using quadratic bezier
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            path += ` Q ${cpX} ${prev.y} ${cpX} ${(prev.y + curr.y) / 2}`;
            path += ` Q ${cpX} ${curr.y} ${curr.x} ${curr.y}`;
        }

        return path;
    };

    return (
        <View style={{
            backgroundColor: ThemeColors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: ThemeColors.border,
            marginBottom: Spacing.lg,
        }}>
            <Text style={{ fontSize: FontSizes.lg, fontWeight: '600', color: ThemeColors.foreground, marginBottom: Spacing.xs }}>
                Weekly Accuracy
            </Text>
            <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground, marginBottom: Spacing.md }}>
                Your accuracy trend over the week
            </Text>

            <Svg width={chartWidth} height={chartHeight + 40}>
                {/* Y-axis labels and grid lines */}
                {[0, 25, 50, 75, 100].map((value, i) => (
                    <G key={`y-${i}`}>
                        <SvgText
                            x={25}
                            y={chartHeight - 20 - (value / maxValue) * (chartHeight - 40) + 4}
                            fontSize={10}
                            fill={ThemeColors.mutedForeground}
                            textAnchor="end"
                        >
                            {value}
                        </SvgText>
                        <Line
                            x1={30}
                            y1={chartHeight - 20 - (value / maxValue) * (chartHeight - 40)}
                            x2={chartWidth}
                            y2={chartHeight - 20 - (value / maxValue) * (chartHeight - 40)}
                            stroke={ThemeColors.border}
                            strokeWidth={1}
                            strokeDasharray="4,4"
                        />
                    </G>
                ))}

                {/* Line */}
                <Path
                    d={generatePath()}
                    stroke={ThemeColors.chart.blue}
                    strokeWidth={2}
                    fill="none"
                />

                {/* Data points and X labels */}
                {data.map((item, index) => {
                    const x = 40 + index * pointSpacing;
                    const y = chartHeight - 20 - (item.accuracy / maxValue) * (chartHeight - 40);

                    return (
                        <G key={`point-${index}`}>
                            <Circle
                                cx={x}
                                cy={y}
                                r={4}
                                fill={'#1a1a2e'}
                                stroke={ThemeColors.chart.blue}
                                strokeWidth={2}
                            />
                            <SvgText
                                x={x}
                                y={chartHeight + 5}
                                fontSize={10}
                                fill={ThemeColors.mutedForeground}
                                textAnchor="middle"
                            >
                                {item.day}
                            </SvgText>
                        </G>
                    );
                })}
            </Svg>

            {/* Legend */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 2, backgroundColor: ThemeColors.chart.blue, marginRight: Spacing.xs }} />
                    <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground }}>accuracy</Text>
                </View>
            </View>
        </View>
    );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, iconBgColor }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    iconBgColor: string;
}) {
    return (
        <View style={{
            backgroundColor: ThemeColors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            borderWidth: 1,
            borderColor: ThemeColors.border,
            height: 90,
            justifyContent: 'center',
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: Spacing.sm }}>
                    <Text style={{ fontSize: 12 , color: ThemeColors.mutedForeground, marginBottom: 4 }} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={{ fontSize: FontSizes.xl, fontWeight: 'bold', color: ThemeColors.foreground }}>
                        {value}
                    </Text>
                    {subtitle && (
                        <Text style={{ fontSize: FontSizes.xs, color: ThemeColors.mutedForeground, marginTop: 2 }}>
                            {subtitle}
                        </Text>
                    )}
                </View>
                <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: BorderRadius.md,
                    backgroundColor: iconBgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon size={18} color={ThemeColors.foreground} />
                </View>
            </View>
        </View>
    );
}

// Recent Activity Item
function ActivityItem({ lesson, topic, date, isCorrect }: {
    lesson: string;
    topic: string;
    date: string;
    isCorrect: boolean;
}) {
    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        } catch {
            return dateStr;
        }
    };

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: ThemeColors.border,
        }}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: FontSizes.base, fontWeight: '600', color: ThemeColors.foreground }}>
                    {lesson}
                </Text>
                <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground }}>
                    {topic} • {formatDate(date)}
                </Text>
            </View>
            <View style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.xs,
                borderRadius: BorderRadius.full,
                backgroundColor: isCorrect ? '#22c55e' : ThemeColors.destructive,
            }}>
                <Text style={{ fontSize: FontSizes.xs, fontWeight: '600', color: ThemeColors.foreground }}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                </Text>
            </View>
        </View>
    );
}

// Empty State Component
function EmptyState({ router }: { router: ReturnType<typeof useRouter> }) {
    return (
        <View style={{
            backgroundColor: ThemeColors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.xl,
            borderWidth: 1,
            borderColor: ThemeColors.border,
            alignItems: 'center',
        }}>
            <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: ThemeColors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Spacing.lg,
            }}>
                <BookOpen size={40} color={ThemeColors.primary} />
            </View>
            <Text style={{
                fontSize: FontSizes.xl,
                fontWeight: '600',
                color: ThemeColors.foreground,
                textAlign: 'center',
                marginBottom: Spacing.sm,
            }}>
                Start Your Learning Journey
            </Text>
            <Text style={{
                fontSize: FontSizes.base,
                color: ThemeColors.mutedForeground,
                textAlign: 'center',
                marginBottom: Spacing.lg,
            }}>
                Complete lessons and practice problems to see your progress here.
            </Text>
            <TouchableOpacity
                onPress={() => router.push('/lessons' as any)}
                style={{
                    backgroundColor: ThemeColors.primary,
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.xl,
                    borderRadius: BorderRadius.md,
                }}
            >
                <Text style={{ color: ThemeColors.primaryForeground, fontWeight: '600' }}>
                    Browse Lessons
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isMobile, isDesktop, isWide, width } = useResponsive();

    // Calculate responsive values
    const containerMaxWidth = isWide ? 1200 : isDesktop ? 1000 : '100%';
    const containerPadding = isDesktop ? Spacing.xl : Spacing.lg;
    const chartWidth = Math.min(
        width - containerPadding * 2 - Spacing.lg * 2,
        isDesktop ? 500 : 600
    );

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        setLoading(true);
        getDashboardStats()
            .then(res => {
                if (res.success) {
                    setStats(res.data);
                } else {
                    setError('Failed to load dashboard data');
                }
            })
            .catch(err => {
                console.log('Failed to get dashboard stats:', err);
                setError('Failed to load dashboard data');
            })
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    // Not authenticated state
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
                        <TrendingUp size={40} color="#8b5cf6" />
                    </View>
                    <Text style={{
                        fontSize: FontSizes['2xl'],
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: Spacing.sm,
                        textAlign: 'center',
                    }}>
                        Access Your Dashboard
                    </Text>
                    <Text style={{
                        fontSize: FontSizes.base,
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        marginBottom: Spacing.xl,
                        lineHeight: 24,
                    }}>
                        Sign in to track your learning progress, view statistics, and monitor your achievements.
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

    // Loading state
    if (loading) {
        return (
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={ThemeColors.primary} />
                <Text style={{ color: ThemeColors.mutedForeground, marginTop: Spacing.md }}>Loading dashboard...</Text>
            </LinearGradient>
        );
    }

    // Check if user has any meaningful data
    const hasData = stats && (
        stats.stats.completedLessons > 0 ||
        stats.stats.totalProblems > 0 ||
        stats.recentActivity.length > 0
    );

    return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
            <View style={{
                padding: containerPadding,
                paddingBottom: Spacing.xxl,
                maxWidth: containerMaxWidth,
                alignSelf: 'center',
                width: '100%',
            }}>
                {/* Header */}
                <View style={{ marginBottom: Spacing.xl }}>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                        fontWeight: 'bold',
                        color: ThemeColors.foreground,
                    }}>
                        Your Dashboard
                    </Text>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                        color: ThemeColors.mutedForeground,
                        marginTop: Spacing.xs,
                    }}>
                        Track your learning progress and achievements
                    </Text>
                </View>

                {/* Empty State */}
                {!hasData && <EmptyState router={router} />}

                {/* Stats Grid - 4 columns on desktop, 2 columns on mobile */}
                {hasData && stats && (
                    <>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: Spacing.sm,
                            marginBottom: Spacing.lg,
                        }}>
                            <View style={{ width: isMobile ? '48%' : isDesktop ? '23%' : '48%' }}>
                                <StatCard
                                    title="Lessons Completed"
                                    value={`${stats.stats.completedLessons}/${stats.stats.totalLessons}`}
                                    icon={BookOpen}
                                    iconBgColor={ThemeColors.chart.blue}
                                />
                            </View>
                            <View style={{ width: isMobile ? '48%' : isDesktop ? '23%' : '48%' }}>
                                <StatCard
                                    title="Problems Been Solved"
                                    value={stats.stats.totalProblems}
                                    icon={CheckCircle}
                                    iconBgColor="#22c55e"
                                />
                            </View>
                            <View style={{ width: isMobile ? '48%' : isDesktop ? '23%' : '48%' }}>
                                <StatCard
                                    title="Accuracy"
                                    value={`${stats.stats.accuracy}%`}
                                    icon={TrendingUp}       
                                    iconBgColor="#a855f7"
                                />
                            </View>
                            <View style={{ width: isMobile ? '48%' : isDesktop ? '23%' : '48%' }}>
                                <StatCard
                                    title="Current Streak"
                                    value={`${stats.stats.streak} day${stats.stats.streak !== 1 ? 's' : ''}`}
                                    icon={Flame}
                                    iconBgColor="#f97316"
                                />
                            </View>
                        </View>

                        {/* Charts Section - Side by side on desktop, stacked on mobile */}
                        <View style={{
                            flexDirection: isDesktop ? 'row' : 'column',
                            gap: Spacing.md,
                            marginBottom: Spacing.lg,
                        }}>
                            {stats.lessonProgress.length > 0 && (
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <LessonProgressChart
                                        data={stats.lessonProgress}
                                        chartWidth={isDesktop ? chartWidth : width - containerPadding * 2 - Spacing.lg * 2}
                                    />
                                </View>
                            )}
                            {stats.weeklyAccuracy.length > 0 && (
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <WeeklyAccuracyChart
                                        data={stats.weeklyAccuracy}
                                        chartWidth={isDesktop ? chartWidth : width - containerPadding * 2 - Spacing.lg * 2}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Recent Activity */}
                        {stats.recentActivity.length > 0 && (
                            <View style={{
                                backgroundColor: ThemeColors.card,
                                borderRadius: BorderRadius.lg,
                                padding: isDesktop ? Spacing.xl : Spacing.lg,
                                borderWidth: 1,
                                borderColor: ThemeColors.border,
                            }}>
                                <Text style={{
                                    fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                                    fontWeight: '600',
                                    color: ThemeColors.foreground,
                                    marginBottom: Spacing.xs,
                                }}>
                                    Recent Activity
                                </Text>
                                <Text style={{ fontSize: FontSizes.sm, color: ThemeColors.mutedForeground, marginBottom: Spacing.md }}>
                                    Your latest learning activities
                                </Text>

                                {stats.recentActivity.slice(0, isDesktop ? 10 : 5).map((activity, index) => (
                                    <ActivityItem
                                        key={index}
                                        lesson={activity.lesson}
                                        topic={activity.topic}
                                        date={activity.attempted_at}
                                        isCorrect={activity.status === 'Correct' || activity.score === 'Correct'}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}

                {/* Error State */}
                {error && !stats && (
                    <View style={{
                        backgroundColor: ThemeColors.card,
                        borderRadius: BorderRadius.lg,
                        padding: Spacing.xl,
                        borderWidth: 1,
                        borderColor: ThemeColors.destructive,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: ThemeColors.destructive, fontSize: FontSizes.lg, marginBottom: Spacing.md }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setError(null);
                                setLoading(true);
                                getDashboardStats()
                                    .then(res => { if (res.success) setStats(res.data); })
                                    .catch(() => setError('Failed to load dashboard data'))
                                    .finally(() => setLoading(false));
                            }}
                            style={{
                                backgroundColor: ThemeColors.primary,
                                paddingVertical: Spacing.sm,
                                paddingHorizontal: Spacing.lg,
                                borderRadius: BorderRadius.md,
                            }}
                        >
                            <Text style={{ color: ThemeColors.primaryForeground, fontWeight: '600' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
        </LinearGradient>
    );
}
