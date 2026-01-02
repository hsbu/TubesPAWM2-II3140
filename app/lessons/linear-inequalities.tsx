import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Spacing, FontSizes, BorderRadius } from '../../constants/colors';
import { useLessonProgress } from '../../hooks/use-lesson-progress';
import { useResponsive, getContainerStyle } from '../../hooks/use-responsive';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import Svg, { Line, Rect, Path, Text as SvgText, Defs, ClipPath } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const ThemeColors = {
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    foreground: '#fff',
    mutedForeground: 'rgba(255,255,255,0.6)',
    primary: '#8b5cf6',
};

export default function LinearInequalities() {
    // Track progress when lesson is opened
    useLessonProgress('linear-inequalities');
    const { isDesktop, containerMaxWidth, containerPadding, width: screenWidth } = useResponsive();

    const [slope, setSlope] = useState(1);
    const [intercept, setIntercept] = useState(0);
    const [inequalityType, setInequalityType] = useState<'<' | '>' | '≤' | '≥'>('>');

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

    // Calculate line points (in graph coordinates, not SVG)
    const x1 = -10;
    const y1 = slope * x1 + intercept;
    const x2 = 10;
    const y2 = slope * x2 + intercept;

    // Convert to SVG coordinates
    const svgX1 = centerX + x1 * scale;
    const svgY1 = centerY - y1 * scale;
    const svgX2 = centerX + x2 * scale;
    const svgY2 = centerY - y2 * scale;

    // Determine shading properties
    const isGreater = inequalityType === '>' || inequalityType === '≥';
    const isDashed = inequalityType === '<' || inequalityType === '>';

    // Build the shading path that covers the correct region within the graph bounds
    const getShadePath = () => {
        const left = padding;
        const right = width - padding;
        const top = padding;
        const bottom = height - padding;

        // Get y values at left and right edges
        const yAtLeft = centerY - (slope * (-10) + intercept) * scale;
        const yAtRight = centerY - (slope * 10 + intercept) * scale;

        if (isGreater) {
            // Shade above the line: start at left edge, follow line, then go around top
            return `M ${left} ${yAtLeft} L ${right} ${yAtRight} L ${right} ${top} L ${left} ${top} Z`;
        } else {
            // Shade below the line: start at left edge, follow line, then go around bottom
            return `M ${left} ${yAtLeft} L ${right} ${yAtRight} L ${right} ${bottom} L ${left} ${bottom} Z`;
        }
    };

    const sections = [
        {
            heading: "Understanding Linear Inequalities",
            content: "A linear inequality with two variables is similar to a linear equation, but instead of an equals sign, it uses inequality symbols: <, >, ≤, or ≥. The solution to a linear inequality is a region of the coordinate plane, not just a line.",
            example: "Examples: 2x + y < 5, x - 3y ≥ 6, y > 2x - 1",
        },
        {
            heading: "Graphing Linear Inequalities",
            content: "To graph a linear inequality: 1) Graph the boundary line (use dashed for < or >, solid for ≤ or ≥), 2) Choose a test point (usually the origin if it's not on the line), 3) Shade the region that contains solutions.",
            example: "Graph y > x + 1:\n1. Draw a dashed line for y = x + 1\n2. Test point (0,0): 0 > 0 + 1? False\n3. Shade the region above the line",
        },
        {
            heading: "Systems of Linear Inequalities",
            content: "A system of linear inequalities consists of two or more inequalities with the same variables. The solution is the region where all inequalities are satisfied simultaneously (the intersection of all solution regions).",
            example: "Graph: y ≥ x and y < -x + 4. Solution: region between the two lines",
        },
        {
            heading: "Applications",
            content: "Linear inequalities are used in real-world optimization problems, such as resource allocation, production planning, and budgeting. They help determine feasible regions for decision-making.",
            example: "A factory produces chairs (x) and tables (y). If 2x + 3y ≤ 600 (labor hours) and x + y ≤ 250 (materials), find the production region.",
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
                        Linear Inequalities
                    </Text>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                        color: ThemeColors.mutedForeground,
                        marginTop: Spacing.xs,
                    }}>
                        Master the concepts of linear inequalities and learn to graph solution regions
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
                                    backgroundColor: `${'#22c55e'}15`,
                                    borderWidth: 1,
                                    borderColor: `${'#22c55e'}30`,
                                    borderRadius: BorderRadius.md,
                                    padding: Spacing.md,
                                }}>
                                    <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: '#22c55e', marginBottom: Spacing.xs }}>
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
                        <Defs>
                            {/* Clip path to keep shading within graph bounds */}
                            <ClipPath id="graphClip">
                                <Rect x={padding} y={padding} width={graphWidth} height={graphHeight} />
                            </ClipPath>
                        </Defs>

                        {/* Graph background */}
                        <Rect x={padding} y={padding} width={graphWidth} height={graphHeight} fill="rgba(255,255,255,0.05)" />

                        {/* Shaded solution region - clipped to graph area */}
                        <Path
                            d={getShadePath()}
                            fill={'#22c55e'}
                            fillOpacity={0.3}
                            clipPath="url(#graphClip)"
                        />

                        {/* Axes */}
                        <Line x1={padding} y1={centerY} x2={width - padding} y2={centerY} stroke={ThemeColors.mutedForeground} strokeWidth="1" />
                        <Line x1={centerX} y1={padding} x2={centerX} y2={height - padding} stroke={ThemeColors.mutedForeground} strokeWidth="1" />

                        {/* Axis labels */}
                        <SvgText x={width - padding + 5} y={centerY + 4} fill={ThemeColors.foreground} fontSize="12">x</SvgText>
                        <SvgText x={centerX - 4} y={padding - 5} fill={ThemeColors.foreground} fontSize="12">y</SvgText>

                        {/* The boundary line */}
                        <Line
                            x1={svgX1}
                            y1={svgY1}
                            x2={svgX2}
                            y2={svgY2}
                            stroke={'#22c55e'}
                            strokeWidth="3"
                            strokeDasharray={isDashed ? "8,4" : undefined}
                        />
                    </Svg>

                    <Text style={{ color: ThemeColors.foreground, marginTop: Spacing.md, fontSize: FontSizes.lg, fontWeight: '600' }}>
                        y {inequalityType} {slope.toFixed(1)}x + {intercept.toFixed(1)}
                    </Text>

                    {/* Inequality Type Selector */}
                    <View style={{ flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.xs }}>
                        {(['<', '≤', '>', '≥'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setInequalityType(type)}
                                style={{
                                    paddingVertical: Spacing.sm,
                                    paddingHorizontal: Spacing.md,
                                    backgroundColor: inequalityType === type ? '#22c55e' : 'rgba(255,255,255,0.2)',
                                    borderRadius: BorderRadius.md,
                                }}
                            >
                                <Text style={{
                                    color: inequalityType === type ? '#fff' : ThemeColors.foreground,
                                    fontWeight: '600',
                                    fontSize: FontSizes.lg,
                                }}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Slope slider */}
                    <View style={{ width: '100%', marginTop: Spacing.lg }}>
                        <Text style={{ color: ThemeColors.foreground, marginBottom: Spacing.xs }}>Slope (m): {slope.toFixed(1)}</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={-5}
                            maximumValue={5}
                            value={slope}
                            onValueChange={setSlope}
                            minimumTrackTintColor={'#22c55e'}
                            maximumTrackTintColor={'rgba(255,255,255,0.2)'}
                            thumbTintColor={'#22c55e'}
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
                            minimumTrackTintColor={ThemeColors.primary}
                            maximumTrackTintColor={'rgba(255,255,255,0.2)'}
                            thumbTintColor={ThemeColors.primary}
                        />
                    </View>

                    {/* Legend */}
                    <View style={{ flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.lg }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 20, height: 3, backgroundColor: '#22c55e', marginRight: Spacing.xs }} />
                            <Text style={{ color: ThemeColors.mutedForeground, fontSize: FontSizes.sm }}>Solid (≤, ≥)</Text>
                        </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 20, height: 3, backgroundColor: '#22c55e', marginRight: Spacing.xs }} />
                                <Text style={{ color: ThemeColors.mutedForeground, fontSize: FontSizes.sm }}>Dashed ({'<'}, {'>'})</Text>
                            </View>
                        </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </LinearGradient>
    );
}
