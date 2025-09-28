import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard, CardProps } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedCardProps extends Omit<CardProps, 'style'> {
  style?: ViewStyle | ViewStyle[];
  elevation?: keyof typeof elevationLevels;
}

// Create a compound component
interface ThemedCardCompound {
  (props: ThemedCardProps): React.JSX.Element;
  Content: typeof PaperCard.Content;
  Title: typeof PaperCard.Title;
  Cover: typeof PaperCard.Cover;
  Actions: typeof PaperCard.Actions;
}

const elevationLevels = {
  0: 'level0',
  1: 'level1',
  2: 'level2',
  3: 'level3',
  4: 'level4',
  5: 'level5',
} as const;

const ThemedCardComponent: React.FC<ThemedCardProps> = ({
  children,
  style,
  elevation = 1,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const elevationKey = elevationLevels[elevation] || 'level1';

  const themedStyle = [
    styles.card,
    {
      backgroundColor: colors.elevation[elevationKey],
      borderColor: colors.border,
      // In dark theme, add more visible shadow/border
      ...(isDark && {
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: elevation * 2, // Double elevation for dark theme
      }),
    },
    style,
  ];

  return (
    <PaperCard style={themedStyle} mode="elevated" {...props}>
      {children}
    </PaperCard>
  );
};

// Create compound component
export const ThemedCard = ThemedCardComponent as ThemedCardCompound;

// Add sub-components
ThemedCard.Content = PaperCard.Content;
ThemedCard.Title = PaperCard.Title;
ThemedCard.Cover = PaperCard.Cover;
ThemedCard.Actions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
    borderWidth: 0.5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});