import { View, Text, ScrollView } from 'react-native';
import { Spacing, FontSizes, BorderRadius } from '../../constants/colors';
import { useLessonProgress } from '../../hooks/use-lesson-progress';
import { useResponsive, getContainerStyle } from '../../hooks/use-responsive';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import Svg, { Line, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const ThemeColors = {
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    foreground: '#fff',
    mutedForeground: 'rgba(255,255,255,0.6)',
    primary: '#8b5cf6',
};

export default function LinearEquations() {
    // Track progress when lesson is opened
    useLessonProgress('linear-equations');
    const { isMobile, isDesktop, containerMaxWidth, containerPadding, width: screenWidth } = useResponsive();

    const [slope, setSlope] = useState(1);
    const [intercept, setIntercept] = useState(0);

    // SVG dimensions - responsive
    const width = isDesktop ? 400 : Math.min(screenWidth - containerPadding * 2 - Spacing.lg * 2, 300);
    const height = width;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Scale: -10 to 10 on both axes
    const scale = graphWidth / 20;
    const centerX = padding + graphWidth / 2;
    const centerY = padding + graphHeight / 2;

    // Calculate line points
    const x1 = -10;
    const y1 = slope * x1 + intercept;
    const x2 = 10;
    const y2 = slope * x2 + intercept;

    // Convert to SVG coordinates
    const svgX1 = centerX + x1 * scale;
    const svgY1 = centerY - y1 * scale;
    const svgX2 = centerX + x2 * scale;
    const svgY2 = centerY - y2 * scale;

    const sections = [
        {
            heading: "What is a Linear Equation?",
            content: "A linear equation is an equation that makes a straight line when graphed. The standard form is y = mx + b, where m is the slope and b is the y-intercept.",
            example: "y = 2x + 3 (slope = 2, y-intercept = 3)",
        },
        {
            heading: "Understanding Slope",
            content: "The slope (m) represents the steepness and direction of the line. A positive slope goes upward from left to right, while a negative slope goes downward. The slope is calculated as 'rise over run' or the change in y divided by the change in x.",
            example: "If a line goes up 2 units for every 1 unit to the right, the slope is 2/1 = 2",
        },
        {
            heading: "Y-Intercept",
            content: "The y-intercept (b) is where the line crosses the y-axis. At this point, x = 0. It represents the starting value when x is zero.",
            example: "In y = 2x + 3, the line crosses the y-axis at (0, 3)",
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
                        Linear Equations
                    </Text>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                        color: ThemeColors.mutedForeground,
                        marginTop: Spacing.xs,
                    }}>
                        Master slope, intercepts, and graphing linear equations
                    </Text>
                </View>

                {/* Desktop: Two column layout */}
                <View style={{
                    flexDirection: isDesktop ? 'row' : 'column',
                    gap: Spacing.lg,
                }}>
                    {/* Left: Content sections */}
                    <View style={{ flex: isDesktop ? 1 : undefined }}>
                        {sections.map((section, index) => (
                            <View key={index} style={{
                                backgroundColor: ThemeColors.card,
                                borderRadius: BorderRadius.lg,
                                padding: isDesktop ? Spacing.xl : Spacing.lg,
                                borderWidth: 1,
                                borderColor: ThemeColors.border,
                                marginBottom: Spacing.lg,
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
                                    backgroundColor: 'rgba(139,92,246,0.1)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(139,92,246,0.3)',
                                    borderRadius: BorderRadius.md,
                                    padding: Spacing.md,
                                }}>
                                    <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: '#8b5cf6', marginBottom: Spacing.xs }}>
                                        Example:
                                    </Text>
                                    <Text style={{ color: ThemeColors.foreground, fontSize: FontSizes.sm }}>
                                        {section.example}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Right: Interactive Graph */}
                    <View style={{
                        flex: isDesktop ? 1 : undefined,
                        maxWidth: isDesktop ? 500 : '100%',
                    }}>
                        <View style={{
                            backgroundColor: ThemeColors.card,
                            borderRadius: BorderRadius.lg,
                            padding: isDesktop ? Spacing.xl : Spacing.lg,
                            borderWidth: 1,
                            borderColor: ThemeColors.border,
                            marginBottom: Spacing.lg,
                            alignItems: 'center',
                            position: isDesktop ? 'sticky' as any : 'relative',
                            top: isDesktop ? Spacing.lg : 0,
                        }}>
                            <Text style={{
                                fontSize: isDesktop ? FontSizes['2xl'] : FontSizes.xl,
                                fontWeight: '600',
                                color: ThemeColors.foreground,
                                marginBottom: Spacing.md,
                            }}>
                                Interactive Graph
                            </Text>

                            <Svg width={width} height={height} style={{ backgroundColor: '#1a1a2e' }}>
                                {/* Grid background */}
                                <Rect x={padding} y={padding} width={graphWidth} height={graphHeight} fill="rgba(255,255,255,0.05)" />

                                {/* Axes */}
                                <Line x1={padding} y1={centerY} x2={width - padding} y2={centerY} stroke={ThemeColors.mutedForeground} strokeWidth="1" />
                                <Line x1={centerX} y1={padding} x2={centerX} y2={height - padding} stroke={ThemeColors.mutedForeground} strokeWidth="1" />

                                {/* Axis labels */}
                                <SvgText x={width - padding + 5} y={centerY + 4} fill={ThemeColors.foreground} fontSize="12">x</SvgText>
                                <SvgText x={centerX - 4} y={padding - 5} fill={ThemeColors.foreground} fontSize="12">y</SvgText>

                                {/* The line */}
                                <Line x1={svgX1} y1={svgY1} x2={svgX2} y2={svgY2} stroke={ThemeColors.primary} strokeWidth="3" />

                                {/* Y-intercept point */}
                                <Circle cx={centerX} cy={centerY - intercept * scale} r="6" fill="#22c55e" />
                            </Svg>

                            <Text style={{ color: ThemeColors.foreground, marginTop: Spacing.md, fontSize: FontSizes.lg, fontWeight: '600' }}>
                                y = {slope.toFixed(1)}x + {intercept.toFixed(1)}
                            </Text>

                            {/* Slope slider */}
                            <View style={{ width: '100%', marginTop: Spacing.lg }}>
                                <Text style={{ color: ThemeColors.foreground, marginBottom: Spacing.xs }}>Slope (m): {slope.toFixed(1)}</Text>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={-5}
                                    maximumValue={5}
                                    value={slope}
                                    onValueChange={setSlope}
                                    minimumTrackTintColor={ThemeColors.primary}
                                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                                    thumbTintColor={ThemeColors.primary}
                                />
                            </View>

                            {/* Intercept slider */}
                            <View style={{ width: '100%', marginTop: Spacing.sm }}>
                                <Text style={{ color: ThemeColors.foreground, marginBottom: Spacing.xs }}>Y-Intercept (b): {intercept.toFixed(1)}</Text>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={-10}
                                    maximumValue={10}
                                    value={intercept}
                                    onValueChange={setIntercept}
                                    minimumTrackTintColor="#22c55e"
                                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                                    thumbTintColor="#22c55e"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </LinearGradient>
    );
}
