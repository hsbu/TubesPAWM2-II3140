import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Spacing, FontSizes, BorderRadius } from '../../constants/colors';
import { useResponsive, getContainerStyle } from '../../hooks/use-responsive';
import Svg, { Path } from 'react-native-svg';

const BookIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

const lessons: Array<{
    id: string;
    title: string;
    description: string;
    color: string;
    gradient: [string, string];
}> = [
    {
        id: 'linear-equations',
        title: 'Linear Equations',
        description: 'Master slope, intercepts, and standard forms of linear equations.',
        color: '#3b82f6',
        gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
        id: 'linear-inequalities',
        title: 'Linear Inequalities',
        description: 'Learn to graph solution regions and understand inequality symbols.',
        color: '#22c55e',
        gradient: ['#22c55e', '#16a34a'],
    },
    {
        id: 'nonlinear-systems',
        title: 'Non-Linear Systems',
        description: 'Explore quadratic equations, circles, and curve intersections.',
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
        id: 'calculus-applications',
        title: 'Calculus Applications',
        description: 'Apply calculus concepts to solve real-world problems.',
        color: '#f97316',
        gradient: ['#f97316', '#ea580c'],
    },
];

export default function LessonsIndex() {
    const router = useRouter();
    const { isDesktop, containerMaxWidth, containerPadding } = useResponsive();

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
                    <View style={{ marginBottom: Spacing.xl}}>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                            fontWeight: 'bold',
                            color: '#fff',
                        }}>
                            Lessons
                        </Text>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: Spacing.xs,
                        }}>
                            Master mathematical concepts step by step
                        </Text>
                    </View>

                    {/* Lesson Cards - Grid on desktop */}
                    <View style={{
                        flexDirection: isDesktop ? 'row' : 'column',
                        flexWrap: 'wrap',
                        gap: Spacing.md,
                    }}>
                        {lessons.map((lesson) => (
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
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: BorderRadius.lg,
                                        overflow: 'hidden',
                                        flexShrink: 0,
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
                                            marginBottom: 4,
                                        }}>
                                            {lesson.title}
                                        </Text>
                                        <Text style={{
                                            fontSize: FontSizes.sm,
                                            color: 'rgba(255,255,255,0.6)',
                                            lineHeight: 18,
                                        }}>
                                            {lesson.description}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: FontSizes['2xl'], color: 'rgba(255,255,255,0.4)', marginTop: -4 }}>›</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
