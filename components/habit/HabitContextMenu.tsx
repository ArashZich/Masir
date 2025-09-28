import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Portal, Surface, IconButton, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface HabitContextMenuProps {
  visible: boolean;
  onDismiss: () => void;
  onToggle: () => void;
  onEdit: () => void;
  habitCompleted: boolean;
  position: { x: number; y: number };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const HabitContextMenu: React.FC<HabitContextMenuProps> = ({
  visible,
  onDismiss,
  onToggle,
  onEdit,
  habitCompleted,
  position,
}) => {
  const { t } = useTranslation();
  const overlayOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0);
  const menuOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(0.5, { duration: 200 });
      menuScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      menuOpacity.value = withTiming(1, { duration: 200 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 150 });
      menuScale.value = withSpring(0, { damping: 15, stiffness: 200 });
      menuOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
    opacity: menuOpacity.value,
  }));

  const handleToggle = async () => {
    console.log('HabitContextMenu handleToggle called');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
    onDismiss();
  };

  const handleEdit = async () => {
    console.log('HabitContextMenu handleEdit called');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
    onDismiss();
  };

  if (!visible) return null;

  // Calculate menu position
  const menuWidth = 200;
  const menuHeight = 120;
  let menuX = position.x - menuWidth / 2;
  let menuY = position.y - menuHeight - 10;

  // Keep menu within screen bounds
  if (menuX < 20) menuX = 20;
  if (menuX + menuWidth > screenWidth - 20) menuX = screenWidth - menuWidth - 20;
  if (menuY < 50) menuY = position.y + 50;

  return (
    <Portal>
      {/* Overlay */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss}>
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
      </Pressable>

      {/* Context Menu */}
      <Animated.View
        style={[
          styles.menu,
          menuAnimatedStyle,
          { left: menuX, top: menuY }
        ]}
      >
        <Surface style={styles.menuSurface} elevation={4}>
          {/* Edit Button - اول ادیت */}
          <Pressable style={styles.menuItem} onPress={handleEdit}>
            <IconButton
              icon="pencil"
              size={24}
              iconColor="#667eea"
            />
            <Text variant="bodyMedium" style={styles.menuText}>
              {t('habit.editHabit')}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Toggle Button - بعد تاگل */}
          <Pressable style={styles.menuItem} onPress={handleToggle}>
            <IconButton
              icon={habitCompleted ? "close-circle" : "check-circle"}
              size={24}
              iconColor={habitCompleted ? "#ff5722" : "#52c41a"}
            />
            <Text variant="bodyMedium" style={styles.menuText}>
              {habitCompleted ? t('habit.markIncomplete') : t('habit.markComplete')}
            </Text>
          </Pressable>
        </Surface>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  menu: {
    position: 'absolute',
    width: 200,
  },
  menuSurface: {
    borderRadius: 12,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 4,
    marginHorizontal: 12,
  },
});