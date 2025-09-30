import { ThemedCard } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoolean } from "@/hooks/useBoolean";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsStore } from "@/store/settingsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Divider, Switch, Text } from "react-native-paper";

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
    cancelNotification,
  } = useNotifications();

  const dailyTimePicker = useBoolean(false, "dailyTimePicker");
  const moodTimePicker = useBoolean(false, "moodTimePicker");

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleNotificationToggle = (field: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [field]: value,
    });
  };

  const handleTimeChange = async (
    type: "daily" | "mood",
    time: { hour: number; minute: number }
  ) => {
    // اول notification قبلی رو کنسل کن
    const identifier = type === "daily" ? "daily-reminder" : "mood-reminder";
    await cancelNotification(identifier);

    // بعد settings رو آپدیت کن (این باعث re-schedule میشه در _layout.tsx)
    if (type === "daily") {
      setNotifications({
        dailyReminder: { ...notifications.dailyReminder, time },
      });
    } else {
      setNotifications({
        moodReminder: { ...notifications.moodReminder, time },
      });
    }
  };

  const sendTestNotification = () => {
    scheduleNotification(
      t("notifications.messages.testTitle"),
      t("notifications.messages.testBody")
    );
  };

  const sendDelayedTestNotification = async () => {
    await scheduleNotification(
      t("notifications.messages.testDelayedTitle"),
      t("notifications.messages.testDelayedBody"),
      { seconds: 5 }
    );
    console.log("Delayed test notification scheduled for 5 seconds");
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
            </View>
          </>
        )}
      </ThemedCard.Content>
    </ThemedCard>
  );
};
