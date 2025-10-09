import { ThemedCard } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoolean } from "@/hooks/useBoolean";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsStore } from "@/store/settingsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Divider, Snackbar, Switch, Text } from "react-native-paper";

interface NotificationSectionProps {
  styles: any; // Import styles from parent
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  styles,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { notifications, setNotifications } = useSettingsStore();
  const {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleHabitReminder,
    cancelNotification,
    cancelAllNotifications,
    getAllScheduledNotifications,
  } = useNotifications();

  const dailyTimePicker = useBoolean(false, "dailyTimePicker");
  const moodTimePicker = useBoolean(false, "moodTimePicker");

  // Snackbar state for visual feedback
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Guard to prevent multiple simultaneous schedules
  const [isScheduling, setIsScheduling] = useState(false);

  // Schedule notifications based on settings
  const scheduleNotifications = useCallback(async () => {
    // Guard: prevent multiple simultaneous schedules
    if (isScheduling) {
      console.log("⏸️ Already scheduling, skipping...");
      return;
    }

    console.log("📋 scheduleNotifications called");
    setIsScheduling(true);

    try {
      if (!permission.granted) {
        console.log("❌ Permission not granted, skipping notification setup");
        return;
      }

      // اگر notifications غیرفعال باشد، همه را کنسل کن
      if (!notifications.enabled) {
        console.log("🔕 Notifications disabled, cancelling all");
        await cancelAllNotifications();
        setSnackbarMessage(t("notifications.disabled"));
        setSnackbarVisible(true);
        return;
      }

      console.log("⚙️ Processing notification settings...");

      // Schedule daily reminder
      if (notifications.dailyReminder.enabled) {
        console.log(
          "📅 Scheduling daily reminder for",
          notifications.dailyReminder.time
        );
        await scheduleHabitReminder(
          t("notifications.messages.dailyTitle"),
          t("notifications.messages.dailyBody"),
          notifications.dailyReminder.time,
          "daily-reminder"
        );
      } else {
        console.log("🗑️ Daily reminder disabled, cancelling");
        await cancelNotification("daily-reminder");
      }

      // Schedule mood reminder
      if (notifications.moodReminder.enabled) {
        console.log(
          "😊 Scheduling mood reminder for",
          notifications.moodReminder.time
        );
        await scheduleHabitReminder(
          t("notifications.messages.moodTitle"),
          t("notifications.messages.moodBody"),
          notifications.moodReminder.time,
          "mood-reminder"
        );
      } else {
        console.log("🗑️ Mood reminder disabled, cancelling");
        await cancelNotification("mood-reminder");
      }

      // Show success message
      if (
        notifications.dailyReminder.enabled ||
        notifications.moodReminder.enabled
      ) {
        setSnackbarMessage(t("notifications.scheduled"));
        setSnackbarVisible(true);
      }

      // Debug: Show all scheduled notifications
      console.log("📊 Getting all scheduled notifications...");
      await getAllScheduledNotifications();
    } finally {
      setIsScheduling(false);
    }
  }, [
    isScheduling,
    permission.granted,
    notifications.enabled,
    notifications.dailyReminder.enabled,
    notifications.dailyReminder.time,
    notifications.moodReminder.enabled,
    notifications.moodReminder.time,
    t,
    scheduleHabitReminder,
    cancelNotification,
    cancelAllNotifications,
    getAllScheduledNotifications,
  ]);

  // Run schedule whenever settings change with debounce
  useEffect(() => {
    // Debounce to prevent rapid re-scheduling
    const timeoutId = setTimeout(() => {
      scheduleNotifications();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [scheduleNotifications]);

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    console.log("🔐 Permission request result:", result);
    // Don't automatically schedule notifications here
    // They will be scheduled by useEffect when user enables them
  };

  const handleNotificationToggle = async (field: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [field]: value,
    });
    // scheduleNotifications will be called automatically via useEffect
  };

  const handleTimeChange = async (
    type: "daily" | "mood",
    time: { hour: number; minute: number }
  ) => {
    if (type === "daily") {
      setNotifications({
        dailyReminder: { ...notifications.dailyReminder, time },
      });
    } else {
      setNotifications({
        moodReminder: { ...notifications.moodReminder, time },
      });
    }
    // scheduleNotifications will be called automatically via useEffect
  };

  const sendTestNotification = () => {
    scheduleNotification(
      t("notifications.messages.testTitle"),
      t("notifications.messages.testBody")
    );
    setSnackbarMessage(t("notifications.testSent"));
    setSnackbarVisible(true);
  };

  const sendDelayedTestNotification = async () => {
    await scheduleNotification(
      t("notifications.messages.testDelayedTitle"),
      t("notifications.messages.testDelayedBody"),
      { seconds: 5 }
    );
    console.log("Delayed test notification scheduled for 5 seconds");
    setSnackbarMessage(t("notifications.testDelayed"));
    setSnackbarVisible(true);
  };

  return (
    <ThemedCard elevation={1}>
      <ThemedCard.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: colors.text.primary }]}
        >
          {t("settings.notifications")}
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.sectionDescription, { color: colors.text.secondary }]}
        >
          {t("notifications.description")}
        </Text>

        {/* Expo Go Warning */}
        {/* {isExpoGo && (
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              padding: 12,
              borderRadius: 8,
              marginVertical: 8,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <Text
              variant="bodySmall"
              style={{ color: colors.text.primary, fontWeight: "bold" }}
            >
              ⚠️ {t("notifications.expoGoWarning.title")}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: colors.text.secondary, marginTop: 4 }}
            >
              {t("notifications.expoGoWarning.description")}
            </Text>
          </View>
        )} */}

        {/* Permission Status */}
        <View style={styles.permissionRow}>
          <View style={styles.permissionInfo}>
            <Text variant="bodyLarge" style={{ color: colors.text.primary }}>
              {t("notifications.permission")}
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.permissionDesc, { color: colors.text.secondary }]}
            >
              {permission.granted
                ? t("notifications.permissionGranted")
                : permission.status === "undetermined"
                ? t("notifications.permissionDenied")
                : t("notifications.permissionDenied")}
            </Text>
          </View>
          {!permission.granted && (
            <Button
              mode="outlined"
              onPress={handleRequestPermission}
              style={styles.permissionButton}
            >
              {t("notifications.requestPermission")}
            </Button>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Enable Notifications */}
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text variant="bodyLarge">{t("notifications.enable")}</Text>
          </View>
          <Switch
            value={notifications.enabled}
            onValueChange={(value) =>
              handleNotificationToggle("enabled", value)
            }
            disabled={!permission.granted}
          />
        </View>

        {notifications.enabled && permission.granted && (
          <>
            {/* Daily Reminder */}
            <View style={styles.reminderSection}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderInfo}>
                  <Text variant="bodyLarge">
                    {t("notifications.dailyReminder")}
                  </Text>
                  <Text variant="bodySmall" style={styles.reminderDesc}>
                    {t("notifications.dailyReminderDesc")}
                  </Text>
                </View>
                <Switch
                  value={notifications.dailyReminder.enabled}
                  onValueChange={(value) =>
                    setNotifications({
                      dailyReminder: {
                        ...notifications.dailyReminder,
                        enabled: value,
                      },
                    })
                  }
                />
              </View>

              {notifications.dailyReminder.enabled && (
                <View style={styles.timePickerContainer}>
                  <Button
                    mode="outlined"
                    onPress={dailyTimePicker.setTrue}
                    style={styles.timeButton}
                  >
                    {String(notifications.dailyReminder.time.hour).padStart(
                      2,
                      "0"
                    )}
                    :
                    {String(notifications.dailyReminder.time.minute).padStart(
                      2,
                      "0"
                    )}
                  </Button>

                  {dailyTimePicker.value && (
                    <DateTimePicker
                      value={
                        new Date(
                          2024,
                          0,
                          1,
                          notifications.dailyReminder.time.hour,
                          notifications.dailyReminder.time.minute
                        )
                      }
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedTime) => {
                        dailyTimePicker.setFalse();
                        if (selectedTime) {
                          const time = {
                            hour: selectedTime.getHours(),
                            minute: selectedTime.getMinutes(),
                          };
                          handleTimeChange("daily", time);
                        }
                      }}
                    />
                  )}
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Mood Reminder */}
            <View style={styles.reminderSection}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderInfo}>
                  <Text variant="bodyLarge">
                    {t("notifications.moodReminder")}
                  </Text>
                  <Text variant="bodySmall" style={styles.reminderDesc}>
                    {t("notifications.moodReminderDesc")}
                  </Text>
                </View>
                <Switch
                  value={notifications.moodReminder.enabled}
                  onValueChange={(value) =>
                    setNotifications({
                      moodReminder: {
                        ...notifications.moodReminder,
                        enabled: value,
                      },
                    })
                  }
                />
              </View>

              {notifications.moodReminder.enabled && (
                <View style={styles.timePickerContainer}>
                  <Button
                    mode="outlined"
                    onPress={moodTimePicker.setTrue}
                    style={styles.timeButton}
                  >
                    {String(notifications.moodReminder.time.hour).padStart(
                      2,
                      "0"
                    )}
                    :
                    {String(notifications.moodReminder.time.minute).padStart(
                      2,
                      "0"
                    )}
                  </Button>

                  {moodTimePicker.value && (
                    <DateTimePicker
                      value={
                        new Date(
                          2024,
                          0,
                          1,
                          notifications.moodReminder.time.hour,
                          notifications.moodReminder.time.minute
                        )
                      }
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedTime) => {
                        moodTimePicker.setFalse();
                        if (selectedTime) {
                          const time = {
                            hour: selectedTime.getHours(),
                            minute: selectedTime.getMinutes(),
                          };
                          handleTimeChange("mood", time);
                        }
                      }}
                    />
                  )}
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Test Notification */}
            <View style={styles.testSection}>
              <Text variant="bodyLarge" style={styles.testTitle}>
                {t("notifications.test")}
              </Text>
              <Text variant="bodySmall" style={styles.testDesc}>
                {t("notifications.testDesc")}
              </Text>

              <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
                <Button
                  mode="outlined"
                  onPress={sendTestNotification}
                  style={[styles.testButton, { flex: 1 }]}
                  icon="bell-ring"
                >
                  {t("notifications.sendTest")}
                </Button>

                <Button
                  mode="outlined"
                  onPress={sendDelayedTestNotification}
                  style={[styles.testButton, { flex: 1 }]}
                  icon="clock"
                >
                  {t("notifications.sendTestDelayed")}
                </Button>
              </View>

              <Button
                mode="outlined"
                onPress={getAllScheduledNotifications}
                style={[styles.testButton, { marginTop: 8 }]}
                icon="calendar-clock"
              >
                Show Scheduled (Check Console)
              </Button>
            </View>
          </>
        )}
      </ThemedCard.Content>

      {/* Snackbar for visual feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: t("common.ok"),
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ThemedCard>
  );
};
