import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Switch, Button, RadioButton, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useBoolean } from '@/hooks/useBoolean';
import { useNotifications } from '@/hooks/useNotifications';
import { useSettingsStore } from '@/store/settingsStore';
import { NOTIFICATION_SOUNDS, DEFAULT_TIMES } from '@/constants/settings';

interface NotificationSectionProps {
  styles: any; // Import styles from parent
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { notifications, setNotifications } = useSettingsStore();
  const {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleHabitReminder,
    cancelAllNotifications
  } = useNotifications();

  const [debugInfo, setDebugInfo] = useState<any>(null);
  const showDebug = useBoolean(false, 'showDebug');
  const dailyTimePicker = useBoolean(false, 'dailyTimePicker');
  const moodTimePicker = useBoolean(false, 'moodTimePicker');

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleNotificationToggle = (field: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [field]: value
    });
  };

  const handleTimeChange = (type: 'daily' | 'mood', time: { hour: number; minute: number }) => {
    if (type === 'daily') {
      setNotifications({
        dailyReminder: { ...notifications.dailyReminder, time }
      });
      scheduleHabitReminder('یادآوری روزانه', time);
    } else {
      setNotifications({
        moodReminder: { ...notifications.moodReminder, time }
      });
      scheduleHabitReminder('یادآوری حالت', time);
    }
  };

  const sendTestNotification = () => {
    scheduleNotification('🔔 تست اعلان', 'این یک اعلان تستی است');
  };

  const sendDelayedTestNotification = async () => {
    await scheduleNotification(
      '⏰ تست اعلان با تاخیر',
      'این اعلان با 5 ثانیه تاخیر ارسال شد',
      { seconds: 5 }
    );
    console.log('Delayed test notification scheduled for 5 seconds');
  };

  const loadDebugInfo = async () => {
    const info = {
      permission: permission,
      notificationSettings: notifications,
      platform: 'React Native'
    };
    setDebugInfo(info);
    showDebug.setTrue();
  };

  const soundOptions = NOTIFICATION_SOUNDS.map(option => ({
    value: option.value,
    label: t(option.label),
  }));

  return (
    <ThemedCard elevation={1}>
      <ThemedCard.Content>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {t('settings.notifications')}
        </Text>
        <Text variant="bodyMedium" style={[styles.sectionDescription, { color: colors.text.secondary }]}>
          {t('notifications.description')}
        </Text>

        {/* Permission Status */}
        <View style={styles.permissionRow}>
          <View style={styles.permissionInfo}>
            <Text variant="bodyLarge" style={{ color: colors.text.primary }}>
              {t('notifications.permission')}
            </Text>
            <Text variant="bodySmall" style={[styles.permissionDesc, { color: colors.text.secondary }]}>
              {permission.granted
                ? t('notifications.permissionGranted')
                : permission.status === 'undetermined'
                ? t('notifications.permissionDenied')
                : t('notifications.permissionDenied')
              }
            </Text>
          </View>
          {!permission.granted && (
            <Button
              mode="outlined"
              onPress={handleRequestPermission}
              style={styles.permissionButton}
            >
              {t('notifications.requestPermission')}
            </Button>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Enable Notifications */}
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text variant="bodyLarge">{t('notifications.enable')}</Text>
          </View>
          <Switch
            value={notifications.enabled}
            onValueChange={(value) => handleNotificationToggle('enabled', value)}
            disabled={!permission.granted}
          />
        </View>

        {notifications.enabled && permission.granted && (
          <>
            {/* Sound Selection */}
            <View style={styles.soundSection}>
              <Text variant="bodyLarge" style={styles.soundTitle}>
                {t('notifications.sound')}
              </Text>
              <Text variant="bodySmall" style={styles.soundDesc}>
                {t('notifications.soundDesc')}
              </Text>

              <RadioButton.Group
                onValueChange={(value) => {
                  setNotifications({ sound: value });
                  sendTestNotification();
                }}
                value={notifications.sound}
              >
                {soundOptions.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    style={styles.radioItem}
                  />
                ))}
              </RadioButton.Group>
            </View>

            <Divider style={styles.divider} />

            {/* Daily Reminder */}
            <View style={styles.reminderSection}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderInfo}>
                  <Text variant="bodyLarge">{t('notifications.dailyReminder')}</Text>
                  <Text variant="bodySmall" style={styles.reminderDesc}>
                    {t('notifications.dailyReminderDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.dailyReminder.enabled}
                  onValueChange={(value) =>
                    setNotifications({
                      dailyReminder: { ...notifications.dailyReminder, enabled: value }
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
                    {String(notifications.dailyReminder.time.hour).padStart(2, '0')}:
                    {String(notifications.dailyReminder.time.minute).padStart(2, '0')}
                  </Button>

                  {dailyTimePicker.value && (
                    <DateTimePicker
                      value={new Date(2024, 0, 1, notifications.dailyReminder.time.hour, notifications.dailyReminder.time.minute)}
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
                          handleTimeChange('daily', time);
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
                  <Text variant="bodyLarge">{t('notifications.moodReminder')}</Text>
                  <Text variant="bodySmall" style={styles.reminderDesc}>
                    {t('notifications.moodReminderDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.moodReminder.enabled}
                  onValueChange={(value) =>
                    setNotifications({
                      moodReminder: { ...notifications.moodReminder, enabled: value }
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
                    {String(notifications.moodReminder.time.hour).padStart(2, '0')}:
                    {String(notifications.moodReminder.time.minute).padStart(2, '0')}
                  </Button>

                  {moodTimePicker.value && (
                    <DateTimePicker
                      value={new Date(2024, 0, 1, notifications.moodReminder.time.hour, notifications.moodReminder.time.minute)}
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
                          handleTimeChange('mood', time);
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
                {t('notifications.test')}
              </Text>
              <Text variant="bodySmall" style={styles.testDesc}>
                {t('notifications.testDesc')}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
                <Button
                  mode="outlined"
                  onPress={sendTestNotification}
                  style={[styles.testButton, { flex: 1 }]}
                  icon="bell-ring"
                >
                  {t('notifications.sendTest')}
                </Button>

                <Button
                  mode="outlined"
                  onPress={sendDelayedTestNotification}
                  style={[styles.testButton, { flex: 1 }]}
                  icon="clock"
                >
                  Test (5s)
                </Button>
              </View>

              <Button
                mode="text"
                onPress={loadDebugInfo}
                icon="bug"
                compact
              >
                Debug Info
              </Button>

              {showDebug.value && debugInfo && (
                <View style={{
                  backgroundColor: colors.surface,
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8
                }}>
                  <Text variant="bodySmall" style={{ fontFamily: 'monospace' }}>
                    {JSON.stringify(debugInfo, null, 2)}
                  </Text>
                  <Button
                    mode="text"
                    onPress={showDebug.setFalse}
                    compact
                  >
                    Hide
                  </Button>
                </View>
              )}
            </View>
          </>
        )}
      </ThemedCard.Content>
    </ThemedCard>
  );
};