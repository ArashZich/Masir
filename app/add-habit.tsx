import { useHabitStore } from "@/store/habitStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBoolean } from "@/hooks/useBoolean";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Surface,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";

const HABIT_ICONS = [
  "water",
  "run",
  "book-open",
  "sleep",
  "food-apple",
  "heart",
  "walk",
  "bicycle",
  "music",
  "camera",
  "lightbulb",
  "leaf",
  "timer",
  "star",
  "trophy",
  "flag",
  "compass",
  "weather-sunny",
  "weather-night",
  "coffee",
  "pencil",
  "bell",
  "calendar",
  "shield",
];

const HABIT_COLORS = [
  "#667eea",
  "#52c41a",
  "#ff7043",
  "#e91e63",
  "#9c27b0",
  "#00bcd4",
  "#ffc107",
  "#ff5722",
  "#795548",
  "#607d8b",
  "#4caf50",
  "#2196f3",
  "#f44336",
  "#ff9800",
];

const HABIT_CATEGORIES = [
  "health",
  "fitness",
  "learning",
  "productivity",
  "mindfulness",
  "creativity",
];

export default function AddHabitScreen() {
  const { t } = useTranslation();
  const { addHabit, updateHabit, habits } = useHabitStore();
  const { edit } = useLocalSearchParams();

  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  // Category
  const [category, setCategory] = useState(HABIT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const showCustomCategory = useBoolean(false, 'CustomCategory');

  // Settings
  const [target, setTarget] = useState("1");
  const [frequency, setFrequency] = useState("daily");
  const [estimatedDuration, setEstimatedDuration] = useState("15");
  const isActive = useBoolean(true, 'IsActive');
  const reminderEnabled = useBoolean(false, 'ReminderEnabled');
  const [reminderTime, setReminderTime] = useState(new Date());
  const showTimePicker = useBoolean(false, 'TimePicker');

  // Reminder settings based on frequency
  const [dailyInterval, setDailyInterval] = useState(1); // هر چند روز
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1]); // روزهای هفته (0=یکشنبه)
  const [monthlyDay, setMonthlyDay] = useState(1); // روز ماه (1-31)
  const showErrorDialog = useBoolean(false, 'ErrorDialog');

  const isEditing = !!edit;
  const editingHabit = isEditing ? habits.find(h => h.id === edit) : null;

  // Load habit data when editing
  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || "");
      setSelectedIcon(editingHabit.icon);
      setSelectedColor(editingHabit.color);
      setTarget(editingHabit.target.toString());
      setFrequency(editingHabit.frequency);
      isActive.setValue(editingHabit.isActive);

      if (editingHabit.reminder) {
        reminderEnabled.setValue(editingHabit.reminder.enabled);
        const [hours, minutes] = editingHabit.reminder.time.split(':');
        const time = new Date();
        time.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        setReminderTime(time);

        if (editingHabit.reminder.dailyInterval) {
          setDailyInterval(editingHabit.reminder.dailyInterval);
        }
        if (editingHabit.reminder.weeklyDays) {
          setWeeklyDays(editingHabit.reminder.weeklyDays);
        }
        if (editingHabit.reminder.monthlyDay) {
          setMonthlyDay(editingHabit.reminder.monthlyDay);
        }
      }
    }
  }, [editingHabit]);

  const handleSave = async () => {
    if (!name.trim()) {
      showErrorDialog.setTrue();
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const finalCategory =
      showCustomCategory.value && customCategory.trim()
        ? customCategory.trim()
        : category;

    // Prepare reminder settings
    const reminderSettings = reminderEnabled.value
      ? {
          enabled: true,
          time: reminderTime.toTimeString().slice(0, 5), // HH:MM format
          ...(frequency === "daily" && { dailyInterval }),
          ...(frequency === "weekly" && { weeklyDays }),
          ...(frequency === "monthly" && { monthlyDay }),
        }
      : undefined;

    if (isEditing && editingHabit) {
      updateHabit(editingHabit.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        target: parseInt(target) || 1,
        frequency: frequency as "daily" | "weekly" | "monthly",
        isActive: isActive.value,
        reminder: reminderSettings,
      });
    } else {
      addHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        target: parseInt(target) || 1,
        frequency: frequency as "daily" | "weekly" | "monthly",
        isActive: isActive.value,
        reminder: reminderSettings,
      });
    }

    router.back();
  };

  const getTimeUnit = () => {
    switch (frequency) {
      case "daily":
        return t("habit.perDay");
      case "weekly":
        return t("habit.perWeek");
      case "monthly":
        return t("habit.perMonth");
      default:
        return t("habit.perDay");
    }
  };

  const getDurationUnit = () => {
    switch (frequency) {
      case "daily":
        return t("habit.minutesPerDay");
      case "weekly":
        return t("habit.minutesPerSession");
      case "monthly":
        return t("habit.minutesPerSession");
      default:
        return t("habit.minutesPerDay");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isEditing ? t("habit.editHabit") : t("habit.addNew"),
          headerShown: true,
          presentation: "modal",
          headerLeft: () => (
            <IconButton icon="close" onPress={() => router.back()} />
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Card */}
          <Card style={styles.previewCard} mode="elevated">
            <LinearGradient
              colors={[selectedColor, selectedColor + "90"]}
              style={styles.previewGradient}
            >
              <Avatar.Icon
                size={64}
                icon={selectedIcon}
                style={styles.previewIcon}
              />
              <Text variant="headlineSmall" style={styles.previewTitle}>
                {name || t("habit.enterName")}
              </Text>
              {description && (
                <Text variant="bodyMedium" style={styles.previewDescription}>
                  {description}
                </Text>
              )}
            </LinearGradient>
          </Card>

          {/* Basic Information */}
          <Card style={styles.sectionCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📝 {t("habit.basicInfo")}
              </Text>

              <TextInput
                label={t("habit.name")}
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
                placeholder={t("habit.namePlaceholder")}
                maxLength={50}
                dense
              />

              <TextInput
                label={t("habit.description")}
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                mode="outlined"
                placeholder={t("habit.descriptionPlaceholder")}
                multiline
                numberOfLines={3}
                maxLength={200}
                dense
              />
            </Card.Content>
          </Card>

          {/* Category */}
          <Card style={styles.sectionCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🏷️ {t("habit.category")}
              </Text>

              <View style={styles.categoryContainer}>
                {HABIT_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    selected={!showCustomCategory.value && category === cat}
                    onPress={() => {
                      console.log("Category selected:", cat);
                      setCategory(cat);
                      showCustomCategory.setFalse();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[
                      styles.categoryChip,
                      !showCustomCategory.value &&
                        category === cat && {
                          backgroundColor: selectedColor + "20",
                          borderColor: selectedColor,
                          borderWidth: 1,
                        },
                    ]}
                    showSelectedCheck={false}
                  >
                    {t(`habit.categories.${cat}`)}
                  </Chip>
                ))}

                <Chip
                  selected={showCustomCategory.value}
                  onPress={() => {
                    showCustomCategory.toggle();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  icon="plus"
                  style={[
                    styles.categoryChip,
                    showCustomCategory.value && {
                      backgroundColor: selectedColor + "20",
                      borderColor: selectedColor,
                      borderWidth: 1,
                    },
                  ]}
                  showSelectedCheck={false}
                >
                  {t("habit.customCategory")}
                </Chip>
              </View>

              {showCustomCategory.value && (
                <TextInput
                  label={t("habit.customCategoryName")}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  style={styles.input}
                  mode="outlined"
                  placeholder={t("habit.customCategoryPlaceholder")}
                  maxLength={30}
                  dense
                />
              )}
            </Card.Content>
          </Card>

          {/* Appearance */}
          <Card style={styles.sectionCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🎨 {t("habit.appearance")}
              </Text>

              <Text variant="bodyMedium" style={styles.subSectionTitle}>
                {t("habit.selectIcon")}
              </Text>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => {
                      setSelectedIcon(icon);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[
                      styles.iconItem,
                      selectedIcon === icon && {
                        backgroundColor: selectedColor + "20",
                        borderColor: selectedColor,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Avatar.Icon
                      size={28}
                      icon={icon}
                      style={[
                        styles.iconItemAvatar,
                        {
                          backgroundColor:
                            selectedIcon === icon ? selectedColor : "#e0e0e0",
                        },
                      ]}
                    />
                  </Pressable>
                ))}
              </View>

              <Text variant="bodyMedium" style={styles.subSectionTitle}>
                {t("habit.selectColor")}
              </Text>
              <View style={styles.colorGrid}>
                {HABIT_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => {
                      setSelectedColor(color);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                  />
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Settings */}
          <Card style={styles.sectionCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ⚙️ {t("habit.settings")}
              </Text>

              {/* Frequency */}
              <View style={styles.settingRow}>
                <Text variant="bodyLarge" style={styles.settingLabel}>
                  {t("habit.frequency")}
                </Text>
                <View style={styles.frequencyButtons}>
                  {[
                    { value: "daily", label: t("habit.daily"), icon: "📅" },
                    { value: "weekly", label: t("habit.weekly"), icon: "📊" },
                    { value: "monthly", label: t("habit.monthly"), icon: "📈" },
                  ].map((freq) => (
                    <Pressable
                      key={freq.value}
                      onPress={() => {
                        setFrequency(freq.value);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={[
                        styles.frequencyButton,
                        frequency === freq.value && {
                          backgroundColor: selectedColor + "20",
                          borderColor: selectedColor,
                        },
                      ]}
                    >
                      <Text style={styles.frequencyIcon}>{freq.icon}</Text>
                      <Text variant="bodySmall" style={styles.frequencyLabel}>
                        {freq.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Target */}
              <View style={styles.settingRow}>
                <Text variant="bodyLarge" style={styles.settingLabel}>
                  {t("habit.target")}
                </Text>
                <View style={styles.targetContainer}>
                  <TextInput
                    value={target}
                    onChangeText={setTarget}
                    style={styles.targetInput}
                    mode="outlined"
                    keyboardType="numeric"
                    maxLength={2}
                    dense
                  />
                  <Text variant="bodyMedium" style={styles.targetUnit}>
                    {getTimeUnit()}
                  </Text>
                </View>
              </View>

              {/* Duration */}
              <View style={styles.settingRow}>
                <Text variant="bodyLarge" style={styles.settingLabel}>
                  {t("habit.estimatedDuration")}
                </Text>
                <View style={styles.targetContainer}>
                  <TextInput
                    value={estimatedDuration}
                    onChangeText={setEstimatedDuration}
                    style={styles.targetInput}
                    mode="outlined"
                    keyboardType="numeric"
                    maxLength={3}
                    dense
                  />
                  <Text variant="bodyMedium" style={styles.targetUnit}>
                    {getDurationUnit()}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Advanced Settings */}
              <View style={styles.switchRow}>
                <Switch
                  value={reminderEnabled.value}
                  onValueChange={(value) => {
                    reminderEnabled.setValue(value);
                    if (value) {
                      // تنظیم زمان پیش‌فرض روی ساعت 9 صبح
                      const defaultTime = new Date();
                      defaultTime.setHours(9, 0, 0, 0);
                      setReminderTime(defaultTime);
                    }
                  }}
                />
                <View style={styles.switchLabelContainer}>
                  <Text variant="bodyLarge">
                    🔔 {t("habit.enableReminder")}
                  </Text>
                  <Text variant="bodySmall" style={styles.settingDescription}>
                    {t("habit.reminderDescription")}
                  </Text>
                </View>
              </View>

              {/* Time Picker for Reminder */}
              {reminderEnabled.value && (
                <View style={styles.timePickerContainer}>
                  <Text variant="bodyMedium" style={styles.timePickerLabel}>
                    ⏰ {t("habit.reminderTime")}
                  </Text>

                  <Pressable
                    onPress={() => showTimePicker.setTrue()}
                    style={[
                      styles.timePickerButton,
                      { borderColor: selectedColor },
                    ]}
                  >
                    <Text variant="bodyLarge" style={styles.timePickerText}>
                      {reminderTime.toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </Text>
                    <Avatar.Icon
                      size={24}
                      icon="clock-outline"
                      style={[
                        styles.timePickerIcon,
                        { backgroundColor: selectedColor },
                      ]}
                    />
                  </Pressable>

                  {/* Frequency-specific settings */}
                  {frequency === "daily" && (
                    <View style={styles.reminderSubSettings}>
                      <Text variant="bodyMedium" style={styles.subSettingLabel}>
                        📅 {t("habit.repeatEvery")}
                      </Text>
                      <View style={styles.intervalContainer}>
                        <TextInput
                          value={dailyInterval.toString()}
                          onChangeText={(value) =>
                            setDailyInterval(parseInt(value) || 1)
                          }
                          style={styles.intervalInput}
                          mode="outlined"
                          keyboardType="numeric"
                          maxLength={2}
                          dense
                        />
                        <Text variant="bodyMedium" style={styles.intervalUnit}>
                          {t("habit.days")}
                        </Text>
                      </View>
                      <Text
                        variant="bodySmall"
                        style={styles.reminderFrequencyText}
                      >
                        {dailyInterval === 1
                          ? t("habit.dailyReminder")
                          : t("habit.everyXDays", { days: dailyInterval })}
                      </Text>
                    </View>
                  )}

                  {frequency === "weekly" && (
                    <View style={styles.reminderSubSettings}>
                      <Text variant="bodyMedium" style={styles.subSettingLabel}>
                        📅 {t("habit.selectDaysOfWeek")}
                      </Text>
                      <View style={styles.daysOfWeekContainer}>
                        {[
                          { value: 0, label: t("habit.sunday"), short: "ی" },
                          { value: 1, label: t("habit.monday"), short: "د" },
                          { value: 2, label: t("habit.tuesday"), short: "س" },
                          { value: 3, label: t("habit.wednesday"), short: "چ" },
                          { value: 4, label: t("habit.thursday"), short: "پ" },
                          { value: 5, label: t("habit.friday"), short: "ج" },
                          { value: 6, label: t("habit.saturday"), short: "ش" },
                        ].map((day) => (
                          <Pressable
                            key={day.value}
                            onPress={() => {
                              if (weeklyDays.includes(day.value)) {
                                setWeeklyDays(
                                  weeklyDays.filter((d) => d !== day.value)
                                );
                              } else {
                                setWeeklyDays([...weeklyDays, day.value]);
                              }
                              Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                              );
                            }}
                            style={[
                              styles.dayButton,
                              weeklyDays.includes(day.value) && {
                                backgroundColor: selectedColor,
                                borderColor: selectedColor,
                              },
                            ]}
                          >
                            <Text
                              variant="bodyMedium"
                              style={[
                                styles.dayButtonText,
                                weeklyDays.includes(day.value) && {
                                  color: "#ffffff",
                                },
                              ]}
                            >
                              {day.short}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                      <Text
                        variant="bodySmall"
                        style={styles.reminderFrequencyText}
                      >
                        {t("habit.weeklyReminderOn", {
                          days:
                            weeklyDays.length === 7
                              ? t("habit.everyday")
                              : weeklyDays.length +
                                " " +
                                t("habit.daysSelected"),
                        })}
                      </Text>
                    </View>
                  )}

                  {frequency === "monthly" && (
                    <View style={styles.reminderSubSettings}>
                      <Text variant="bodyMedium" style={styles.subSettingLabel}>
                        📅 {t("habit.dayOfMonth")}
                      </Text>
                      <View style={styles.intervalContainer}>
                        <TextInput
                          value={monthlyDay.toString()}
                          onChangeText={(value) => {
                            const day = parseInt(value) || 1;
                            setMonthlyDay(Math.min(31, Math.max(1, day)));
                          }}
                          style={styles.intervalInput}
                          mode="outlined"
                          keyboardType="numeric"
                          maxLength={2}
                          dense
                        />
                        <Text variant="bodyMedium" style={styles.intervalUnit}>
                          {t("habit.ofMonth")}
                        </Text>
                      </View>
                      <Text
                        variant="bodySmall"
                        style={styles.reminderFrequencyText}
                      >
                        {t("habit.monthlyReminderOn", { day: monthlyDay })}
                      </Text>
                    </View>
                  )}

                  {showTimePicker.value && (
                    <DateTimePicker
                      value={reminderTime}
                      mode="time"
                      is24Hour={true}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(_: any, selectedTime: Date | undefined) => {
                        if (Platform.OS === "ios") {
                          // iOS keeps the picker open
                        } else {
                          showTimePicker.setFalse();
                        }
                        if (selectedTime) {
                          setReminderTime(selectedTime);
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                        }
                      }}
                    />
                  )}
                </View>
              )}

              <View style={styles.switchRow}>
                <Switch value={isActive.value} onValueChange={isActive.setValue} />
                <View style={styles.switchLabelContainer}>
                  <Text variant="bodyLarge">✅ {t("habit.activeHabit")}</Text>
                  <Text variant="bodySmall" style={styles.settingDescription}>
                    {t("habit.activeDescription")}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Save Button */}
        <Surface style={styles.saveButtonContainer} elevation={4}>
          <Pressable
            onPress={handleSave}
            disabled={!name.trim()}
            style={[
              styles.saveButton,
              { backgroundColor: name.trim() ? selectedColor : "#cccccc" },
            ]}
          >
            <LinearGradient
              colors={
                name.trim()
                  ? [selectedColor, selectedColor + "CC"]
                  : ["#cccccc", "#aaaaaa"]
              }
              style={styles.saveButtonGradient}
            >
              <Avatar.Icon
                size={32}
                icon="check-bold"
                style={styles.saveButtonIcon}
              />
              <Text variant="titleMedium" style={styles.saveButtonText}>
                ✨ {isEditing ? t("common.save") : t("habit.createHabit")}
              </Text>
            </LinearGradient>
          </Pressable>
        </Surface>
      </KeyboardAvoidingView>

      {/* Error Dialog */}
      <Portal>
        <Dialog visible={showErrorDialog.value} onDismiss={showErrorDialog.setFalse}>
          <Dialog.Title>{t("common.error")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t("habit.nameRequired")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Text onPress={showErrorDialog.setFalse}>{t("common.confirm")}</Text>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // فضا برای دکمه save
  },
  previewCard: {
    marginBottom: 16,
    overflow: "hidden",
  },
  previewGradient: {
    padding: 20,
    alignItems: "center",
  },
  previewIcon: {
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 12,
  },
  previewTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  previewDescription: {
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
    maxWidth: "90%",
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  subSectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconItem: {
    width: "15%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconItemAvatar: {
    margin: 0,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingRow: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  settingLabel: {
    fontWeight: "600",
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  frequencyIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  frequencyLabel: {
    fontWeight: "500",
  },
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  targetInput: {
    width: 80,
  },
  targetUnit: {
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  saveButtonIcon: {
    backgroundColor: "rgba(255,255,255,0.25)",
    margin: 0,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  timePickerContainer: {
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  timePickerLabel: {
    fontWeight: "600",
    marginBottom: 12,
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  timePickerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  timePickerIcon: {
    margin: 0,
  },
  reminderFrequencyText: {
    textAlign: "center",
    opacity: 0.7,
    fontStyle: "italic",
  },
  reminderSubSettings: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  subSettingLabel: {
    fontWeight: "600",
    marginBottom: 8,
  },
  intervalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  intervalInput: {
    width: 60,
  },
  intervalUnit: {
    opacity: 0.7,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 4,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonText: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
