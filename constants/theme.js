// Design System - Theme Configuration
// Centralized theme tokens for consistent styling across the app

export const COLORS = {
  // Primary Colors
  primary: '#6366F1',        // Indigo
  primaryDark: '#4F46E5',    // Darker Indigo
  primaryLight: '#818CF8',   // Lighter Indigo
  
  // Secondary Colors
  secondary: '#8B5CF6',      // Purple
  secondaryDark: '#7C3AED',  // Darker Purple
  
  // Status Colors
  success: '#10B981',        // Green
  error: '#EF4444',          // Red
  warning: '#F59E0B',        // Amber
  info: '#3B82F6',           // Blue
  
  // Neutral Colors
  background: '#F9FAFB',     // Light Gray
  surface: '#FFFFFF',        // White
  card: '#FFFFFF',           // White
  
  // Text Colors
  textPrimary: '#111827',    // Almost Black
  textSecondary: '#6B7280',  // Gray
  textTertiary: '#9CA3AF',   // Light Gray
  textInverse: '#FFFFFF',    // White
  
  // Border Colors
  border: '#E5E7EB',         // Light Gray
  borderDark: '#D1D5DB',     // Medium Gray
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const GRADIENTS = {
  primary: ['#6366F1', '#8B5CF6'],      // Indigo to Purple
  primaryReverse: ['#8B5CF6', '#6366F1'], // Purple to Indigo
  success: ['#10B981', '#059669'],      // Green gradient
  header: ['#4F46E5', '#7C3AED'],       // Header gradient
  background: ['#F9FAFB', '#F3F4F6'],   // Subtle background
};

export const TYPOGRAPHY = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Helper function to create linear gradient style
export const createGradient = (colors) => ({
  colors: colors,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
});

export default {
  COLORS,
  GRADIENTS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATION,
  createGradient,
};
