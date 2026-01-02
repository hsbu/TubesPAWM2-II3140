import { useWindowDimensions, ViewStyle } from 'react-native';

// Breakpoints for responsive design
export const BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
};

// Hook for responsive values
export function useResponsive() {
    const { width, height } = useWindowDimensions();
    
    const isMobile = width < BREAKPOINTS.tablet;
    const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
    const isDesktop = width >= BREAKPOINTS.desktop;
    const isWide = width >= BREAKPOINTS.wide;
    
    // Container max widths for different screen sizes (number or undefined)
    const containerMaxWidth = isWide ? 1200 : isDesktop ? 1000 : undefined;
    
    // Responsive padding
    const containerPadding = isDesktop ? 32 : 24; // Spacing.xl : Spacing.lg
    
    return {
        // Screen info
        width,
        height,
        
        // Breakpoint flags
        isMobile,
        isTablet,
        isDesktop,
        isWide,
        
        // Layout helpers
        containerMaxWidth,
        containerPadding,
        
        // Grid columns helper
        getGridColumns: (mobileColumns: number, tabletColumns: number, desktopColumns: number) => {
            if (isMobile) return mobileColumns;
            if (isTablet) return tabletColumns;
            return desktopColumns;
        },
        
        // Responsive value helper
        responsive: <T,>(mobile: T, tablet: T, desktop: T): T => {
            if (isMobile) return mobile;
            if (isTablet) return tablet;
            return desktop;
        },
    };
}

// Container style helper - returns proper ViewStyle
export function getContainerStyle(containerMaxWidth: number | undefined, containerPadding: number): ViewStyle {
    return {
        padding: containerPadding,
        ...(containerMaxWidth ? { maxWidth: containerMaxWidth } : {}),
        alignSelf: 'center',
        width: '100%',
    };
}
