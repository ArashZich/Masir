// ابعاد و spacing های پروژه
export const DIMENSIONS = {
  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },

  // Border Radius
  RADIUS: {
    SM: 6,
    MD: 8,
    LG: 12,
    XL: 16,
    XXL: 20,
  },

  // Icon Sizes
  ICON: {
    XS: 16,
    SM: 20,
    MD: 24,
    LG: 32,
    XL: 40,
    XXL: 48,
    XXXL: 64,
  },

  // Avatar Sizes
  AVATAR: {
    SM: 32,
    MD: 40,
    LG: 48,
    XL: 64,
  },

  // Card Properties
  CARD: {
    MARGIN: 16,
    MARGIN_TOP: 0,
    PADDING: 16,
    ELEVATION: 4,
  },

  // Progress Bar
  PROGRESS: {
    HEIGHT_SM: 6,
    HEIGHT_MD: 8,
    HEIGHT_LG: 12,
  },

  // Button Heights
  BUTTON: {
    HEIGHT_SM: 32,
    HEIGHT_MD: 40,
    HEIGHT_LG: 48,
  },

  // Chart Dimensions
  CHART: {
    HEIGHT: 200,
    WIDTH_OFFSET: 32, // برای margin از هر طرف
  },

  // Modal
  MODAL: {
    WIDTH_PERCENTAGE: 95,
    HEIGHT_PERCENTAGE: 85,
    MAX_WIDTH: 450,
  },
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },

  LINE_HEIGHT: {
    XS: 16,
    SM: 20,
    MD: 22,
    LG: 24,
    XL: 28,
    XXL: 32,
    XXXL: 40,
  },

  FONT_WEIGHT: {
    NORMAL: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: 'bold' as const,
  },
} as const;