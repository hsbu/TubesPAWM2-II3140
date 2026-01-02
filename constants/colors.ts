// Colors matching web app globals.css dark mode theme
// Using dark theme as default (matching web app's .dark class)
export const Colors = {
    // Dark theme (primary - matching web app)
    background: '#0f172a',       // oklch(0.11 0 0) - dark slate
    foreground: '#e2e8f0',       // oklch(0.92 0 0) - light gray
    card: '#1e293b',             // oklch(0.15 0 0) - dark card
    cardForeground: '#e2e8f0',   // oklch(0.92 0 0)
    primary: '#6366f1',          // oklch(0.55 0.2 264) - indigo
    primaryForeground: '#e2e8f0', // oklch(0.92 0 0)
    secondary: '#334155',        // oklch(0.25 0 0) - dark secondary
    secondaryForeground: '#e2e8f0',
    muted: '#334155',            // oklch(0.25 0 0)
    mutedForeground: '#94a3b8',  // oklch(0.65 0 0)
    accent: '#6366f1',           // oklch(0.55 0.2 264) - same as primary
    accentForeground: '#e2e8f0',
    destructive: '#dc2626',      // oklch(0.55 0.2 25) - red
    destructiveForeground: '#e2e8f0',
    border: '#334155',           // oklch(0.22 0 0)
    input: '#1e293b',            // oklch(0.18 0 0)
    ring: '#6366f1',             // oklch(0.55 0.2 264)

    // Chart colors
    chart: {
        blue: '#3b82f6',
        green: '#22c55e',
        purple: '#8b5cf6',
        orange: '#f97316',
        red: '#ef4444',
    }
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const FontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};
