import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, IconButton, Surface, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

interface AnimatedHabitItemProps {
  habit: {
    id: string;
    name: string;
    icon: string;
    color: string;
    completed: boolean;
  };
  onComplete: (habitId: string) => void;
  onEdit?: (habitId: string) => void;
}

export const AnimatedHabitItem: React.FC<AnimatedHabitItemProps> = ({
  habit,
  onComplete,
  onEdit,
}) => {
  const scale = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const itemRef = useRef<View>(null);
  const [lastTap, setLastTap] = React.useState<number>(0);
  const [isDoublePress, setIsDoublePress] = React.useState<boolean>(false);

  useEffect(() => {
    if (habit.completed) {
      checkmarkScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      checkmarkOpacity.value = withSpring(1);
    } else {
      checkmarkScale.value = withSpring(0);
      checkmarkOpacity.value = withSpring(0);
    }
  }, [habit.completed]);

  const handlePress = async () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      // دو بار تاپ شده - toggle می‌کنیم
      console.log("Double tap detected for habit:", habit.id);
      setIsDoublePress(true);

      scale.value = withSequence(
        withSpring(0.9, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );

      if (!habit.completed) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      onComplete(habit.id);

      // Reset after a delay
      setTimeout(() => {
        setIsDoublePress(false);
      }, 500);
    } else {
      // اولین تاپ - فقط انیمیشن
      scale.value = withSequence(
        withSpring(0.95, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }

    setLastTap(now);
  };

  const handleLongPress = async () => {
    // اگه دو بار tap شده، long press رو ignore کن
    if (isDoublePress) {
      console.log("Long press ignored due to double tap");
      return;
    }

    console.log("Long press detected for habit:", habit.id);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (onEdit) {
      onEdit(habit.id);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkOpacity.value,
  }));

  return (
    <>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={600}
      >
        <Animated.View style={animatedStyle} ref={itemRef}>
          <Surface
            style={[styles.habitItem, habit.completed && styles.habitCompleted]}
            elevation={habit.completed ? 0 : 1}
          >
            <View style={styles.habitIconContainer}>
              <Avatar.Icon
                size={40}
                icon={habit.icon}
                style={[styles.habitIcon, { backgroundColor: habit.color }]}
              />
              <Animated.View
                style={[styles.checkmarkContainer, checkmarkAnimatedStyle]}
              >
                <IconButton
                  icon="check"
                  size={16}
                  iconColor="#ffffff"
                  style={styles.checkmark}
                />
              </Animated.View>
            </View>

            <Text variant="labelMedium" style={styles.habitName}>
              {habit.name}
            </Text>
          </Surface>
        </Animated.View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
    minWidth: 100,
    marginBottom: 12,
  },
  habitCompleted: {
    backgroundColor: "rgba(82, 196, 26, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(82, 196, 26, 0.2)",
  },
  habitIconContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 8,
  },
  habitIcon: {
    marginBottom: 0,
  },
  checkmarkContainer: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#52c41a",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    margin: 0,
    width: 24,
    height: 24,
  },
  habitName: {
    textAlign: "center",
    fontWeight: "500",
  },
});
