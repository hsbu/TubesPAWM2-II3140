import { View, Text, ScrollView } from 'react-native';
import { Spacing, FontSizes, BorderRadius } from '../../constants/colors';
import { useLessonProgress } from '../../hooks/use-lesson-progress';
import { useResponsive, getContainerStyle } from '../../hooks/use-responsive';
import { LinearGradient } from 'expo-linear-gradient';

const ThemeColors = {
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    foreground: '#fff',
    mutedForeground: 'rgba(255,255,255,0.6)',
    primary: '#8b5cf6',
};

export default function CalculusApplications() {
    // Track progress when lesson is opened
    useLessonProgress('calculus-applications');
    const { isDesktop, containerMaxWidth, containerPadding } = useResponsive();

    const sections = [
        {
            heading: "Introduction to Multivariable Calculus",
            content: "Calculus with two variables extends single-variable calculus concepts to functions of the form z = f(x, y). This allows us to analyze surfaces, optimize functions with constraints, and solve complex real-world problems.",
            example: "z = x² + y² represents a paraboloid (bowl shape) in 3D space",
        },
        {
            heading: "Partial Derivatives",
            content: "A partial derivative measures how a function changes with respect to one variable while keeping others constant. For z = f(x, y), ∂z/∂x is the rate of change in the x-direction, and ∂z/∂y is the rate of change in the y-direction.",
            example: "For z = x² + 3xy + y²:\n∂z/∂x = 2x + 3y\n∂z/∂y = 3x + 2y",
        },
        {
            heading: "Optimization Problems",
            content: "Finding maximum or minimum values of functions with two variables is crucial in many applications. Critical points occur where both partial derivatives equal zero. The second derivative test determines if a critical point is a maximum, minimum, or saddle point.",
            example: "Maximize profit P(x, y) = 100x + 80y - 2x² - y² - xy subject to production constraints",
        },
        {
            heading: "Constrained Optimization",
            content: "Many real-world problems involve optimizing a function subject to constraints. The method of Lagrange multipliers is used to find extrema of f(x, y) subject to a constraint g(x, y) = c.",
            example: "Minimize x² + y² subject to x + y = 10.\nThe minimum distance from origin to the line x + y = 10 occurs at (5, 5).",
        },
        {
            heading: "Rate of Change Applications",
            content: "Partial derivatives describe rates of change in multivariable contexts. Applications include heat flow, population dynamics, economic models, and physics problems involving multiple variables.",
            example: "Temperature T(x, y) = 100 - x² - y².\nThe rate of temperature change at (1, 2) in the x-direction is ∂T/∂x = -2x = -2.",
        },
    ];

    return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
            <View style={{
                ...getContainerStyle(containerMaxWidth, containerPadding),
                paddingBottom: Spacing.xxl,
            }}>
                {/* Header */}
                <View style={{ marginBottom: Spacing.xl }}>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                        fontWeight: 'bold',
                        color: ThemeColors.foreground,
                    }}>
                        Calculus Applications
                    </Text>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                        color: ThemeColors.mutedForeground,
                        marginTop: Spacing.xs,
                    }}>
                        Apply calculus concepts to solve real-world problems involving two variables
                    </Text>
                </View>

                {/* Desktop: Two column layout */}
                <View style={{
                    flexDirection: isDesktop ? 'row' : 'column',
                    flexWrap: 'wrap',
                    gap: Spacing.lg,
                }}>
                    {sections.map((section, index) => (
                        <View key={index} style={{
                            backgroundColor: ThemeColors.card,
                            borderRadius: BorderRadius.lg,
                            padding: isDesktop ? Spacing.xl : Spacing.lg,
                            borderWidth: 1,
                            borderColor: ThemeColors.border,
                            flex: isDesktop ? undefined : undefined,
                            width: isDesktop ? 'calc(50% - 8px)' as any : '100%',
                            minWidth: isDesktop ? 400 : undefined,
                        }}>
                            <Text style={{
                                fontSize: isDesktop ? FontSizes['2xl'] : FontSizes.xl,
                                fontWeight: '600',
                                color: ThemeColors.foreground,
                                marginBottom: Spacing.md,
                            }}>
                                {section.heading}
                            </Text>
                            <Text style={{
                                color: ThemeColors.foreground,
                                lineHeight: 24,
                                marginBottom: Spacing.md,
                                fontSize: isDesktop ? FontSizes.lg : FontSizes.base,
                            }}>
                                {section.content}
                            </Text>
                            <View style={{
                                backgroundColor: 'rgba(249,115,22,0.1)',
                                borderWidth: 1,
                                borderColor: 'rgba(249,115,22,0.3)',
                                borderRadius: BorderRadius.md,
                                padding: Spacing.md,
                            }}>
                                <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: '#f97316', marginBottom: Spacing.xs }}>
                                    Example:
                                </Text>
                                <Text style={{ color: ThemeColors.foreground, fontSize: FontSizes.sm }}>
                                    {section.example}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
        </LinearGradient>
    );
}
