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

export default function NonlinearSystems() {
    // Track progress when lesson is opened
    useLessonProgress('nonlinear-systems');
    const { isDesktop, containerMaxWidth, containerPadding } = useResponsive();

    const sections = [
        {
            heading: "Introduction to Non-Linear Systems",
            content: "A non-linear system contains at least one equation that is not linear. These systems can involve quadratic equations, circles, ellipses, hyperbolas, or other curves. The solutions are the intersection points of these curves.",
            example: "Examples: x² + y² = 25 and y = x + 1 (circle and line), y = x² and y = 2x - 1 (parabola and line)",
        },
        {
            heading: "Types of Non-Linear Equations",
            content: "Common non-linear equations include: quadratic equations (y = ax² + bx + c), circles (x² + y² = r²), parabolas (y = ax²), hyperbolas (xy = k), and ellipses ((x²/a²) + (y²/b²) = 1).",
            example: "Circle: x² + y² = 16 (center at origin, radius 4)\nParabola: y = x² (opens upward)",
        },
        {
            heading: "Solving by Substitution",
            content: "The substitution method involves solving one equation for a variable and substituting into the other equation. This is especially useful when one equation is linear or easily solvable for a variable.",
            example: "Solve: x² + y² = 25 and y = x + 1\n\nSubstitute y = x + 1:\nx² + (x + 1)² = 25\n2x² + 2x - 24 = 0\nSolutions: x = 3 or x = -4",
        },
        {
            heading: "Solving by Elimination",
            content: "The elimination method can be used when both equations have similar terms. You may need to manipulate the equations to eliminate a variable. This method works well for systems with quadratic terms.",
            example: "Solve: x² + y² = 13 and x² - y² = 5\nAdd equations to eliminate y²: 2x² = 18, so x = ±3",
        },
        {
            heading: "Number of Solutions",
            content: "Non-linear systems can have 0, 1, 2, or more solutions depending on how the curves intersect. A line and circle can intersect at 0, 1, or 2 points. Two circles can intersect at 0, 1, or 2 points.",
            example: "No intersection: y = x² and y = -1 (parabola and line don't meet)\nTwo intersections: x² + y² = 25 and y = 0 (circle and x-axis)",
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
                        Non-Linear Systems
                    </Text>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                        color: ThemeColors.mutedForeground,
                        marginTop: Spacing.xs,
                    }}>
                        Explore systems involving quadratic equations, circles, and other non-linear curves
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
                                backgroundColor: 'rgba(168,85,247,0.1)',
                                borderWidth: 1,
                                borderColor: 'rgba(168,85,247,0.3)',
                                borderRadius: BorderRadius.md,
                                padding: Spacing.md,
                            }}>
                                <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: '#a855f7', marginBottom: Spacing.xs }}>
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
