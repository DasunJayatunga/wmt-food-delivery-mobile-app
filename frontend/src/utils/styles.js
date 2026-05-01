import { StyleSheet } from 'react-native';

// ---------- Color Palette ----------
export const Colors = {
  primary: '#4CAF50',       // green – success, completed steps
  danger: '#f44336',        // red – cancelled, errors
  background: '#ffffff',
  textDark: '#333333',
  textLight: '#888888',
  border: '#cccccc',
  white: '#ffffff',
};

// ---------- Typography ----------
export const Fonts = {
  sizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};

// ---------- Spacing ----------
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ---------- Reusable Style Objects ----------
export const CommonStyles = StyleSheet.create({
  // A full‑screen container with padding
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  // A bold title
  pageTitle: {
    fontSize: Fonts.sizes.xlarge,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  // A row with an icon and label (used for status steps)
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  // The small circle indicator
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  statusCircleCompleted: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  // The label text next to the circle
  statusLabel: {
    fontSize: Fonts.sizes.medium,
    color: Colors.textLight,
  },
  statusLabelActive: {
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  // Badge styles
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeText: {
    color: Colors.white,
    fontSize: Fonts.sizes.small,
    fontWeight: 'bold',
  },
  // A horizontal divider
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    marginVertical: Spacing.md,
  },
});
