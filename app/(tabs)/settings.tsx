import { StyleSheet, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Surface, List, Divider, SegmentedButtons, Switch, Button, RadioButton } from 'react-native-paper';
import { useSettingsStore, type ThemeMode, type Language } from '@/store/settingsStore';
import { useState, useEffect } from 'react';
import { notificationService, type NotificationSound } from '@/services/notificationService';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, language, notifications, setTheme, setLanguage, setNotifications } = useSettingsStore();

  const [permissionStatus, setPermissionStatus] = useState<string>('');
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [showMoodTimePicker, setShowMoodTimePicker] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await notificationService.getPermissionStatus();
    setPermissionStatus(status);
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermissions();
    setPermissionStatus(granted ? 'granted' : 'denied');
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
      notificationService.scheduleDailyReminder(time, notifications.sound);
    } else {
      setNotifications({
        moodReminder: { ...notifications.moodReminder, time }
      });
      notificationService.scheduleMoodReminder(time, notifications.sound);
    }
  };

  const sendTestNotification = () => {
    notificationService.sendTestNotification(notifications.sound);
  };

  const soundOptions = [
    { value: 'default', label: t('notifications.sounds.default') },
    { value: 'gentle', label: t('notifications.sounds.gentle') },
    { value: 'chime', label: t('notifications.sounds.chime') },
    { value: 'bell', label: t('notifications.sounds.bell') },
    { value: 'none', label: t('notifications.sounds.none') },
  ];

  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: 'white-balance-sunny' },
    { value: 'dark', label: t('theme.dark'), icon: 'weather-night' },
    { value: 'system', label: t('theme.system'), icon: 'brightness-auto' },
  ];

  const languageOptions = [
    { value: 'fa', label: t('language.persian'), icon: 'translate' },
    { value: 'en', label: t('language.english'), icon: 'translate' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={[styles.header, styles.whiteCard]} elevation={4}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('settings.title')}
        </Text>
      </Surface>

      {/* Theme Selection */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.theme')}
          </Text>
          <SegmentedButtons
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeMode)}
            buttons={themeOptions}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#667eea',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
        </Card.Content>
      </Card>

      {/* Language Selection */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.language')}
          </Text>
          <SegmentedButtons
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
            buttons={languageOptions}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#667eea',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
        </Card.Content>
      </Card>

      {/* Notifications Section */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.notifications')}
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            {t('notifications.description')}
          </Text>

          {/* Permission Status */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text variant="bodyLarge">{t('notifications.permission')}</Text>
              <Text variant="bodySmall" style={styles.permissionDesc}>
                {permissionStatus === 'granted'
                  ? t('notifications.permissionGranted')
                  : t('notifications.permissionDenied')
                }
              </Text>
            </View>
            {permissionStatus !== 'granted' && (
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
              disabled={permissionStatus !== 'granted'}
            />
          </View>

          {notifications.enabled && permissionStatus === 'granted' && (
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
                    const newSound = value as NotificationSound;
                    setNotifications({ sound: newSound });
                    // تست فوری صدای جدید
                    notificationService.sendTestNotification(newSound);
                  }}
                  value={notifications.sound}
                >
                  {soundOptions.map((option) => (
                    <View key={option.value} style={styles.radioRow}>
                      <View style={styles.radioContent}>
                        <Text variant="bodyMedium">{option.label}</Text>
                      </View>
                      <RadioButton
                        value={option.value}
                        color="#667eea"
                      />
                    </View>
                  ))}
                </RadioButton.Group>
              </View>

              <Divider style={styles.divider} />

              {/* Daily Reminder */}
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text variant="bodyLarge">{t('notifications.dailyReminder')}</Text>
                  <Text variant="bodySmall" style={styles.switchDesc}>
                    {t('notifications.dailyReminderDesc')}
                  </Text>
                  {notifications.dailyReminder.enabled && (
                    <Text variant="bodySmall" style={styles.timeText}>
                      {`${notifications.dailyReminder.time.hour.toString().padStart(2, '0')}:${notifications.dailyReminder.time.minute.toString().padStart(2, '0')}`}
                    </Text>
                  )}
                </View>
                <Switch
                  value={notifications.dailyReminder.enabled}
                  onValueChange={(value) => {
                    setNotifications({
                      dailyReminder: { ...notifications.dailyReminder, enabled: value }
                    });
                    if (value) {
                      setShowDailyTimePicker(true);
                    }
                  }}
                />
              </View>

              {/* Mood Reminder */}
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text variant="bodyLarge">{t('notifications.moodReminder')}</Text>
                  <Text variant="bodySmall" style={styles.switchDesc}>
                    {t('notifications.moodReminderDesc')}
                  </Text>
                  {notifications.moodReminder.enabled && (
                    <Text variant="bodySmall" style={styles.timeText}>
                      {`${notifications.moodReminder.time.hour.toString().padStart(2, '0')}:${notifications.moodReminder.time.minute.toString().padStart(2, '0')}`}
                    </Text>
                  )}
                </View>
                <Switch
                  value={notifications.moodReminder.enabled}
                  onValueChange={(value) => {
                    setNotifications({
                      moodReminder: { ...notifications.moodReminder, enabled: value }
                    });
                    if (value) {
                      setShowMoodTimePicker(true);
                    }
                  }}
                />
              </View>

              {/* Habit Reminders */}
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text variant="bodyLarge">{t('notifications.habitReminders')}</Text>
                  <Text variant="bodySmall" style={styles.switchDesc}>
                    {t('notifications.habitRemindersDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.habitReminders}
                  onValueChange={(value) => handleNotificationToggle('habitReminders', value)}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Test Notification */}
              <Button
                mode="outlined"
                onPress={sendTestNotification}
                style={styles.testButton}
                icon="bell-ring"
              >
                {t('notifications.testNotification')}
              </Button>
            </>
          )}
        </Card.Content>
      </Card>


      {/* Data Section */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.data')}
          </Text>
          <List.Item
            title={t('backup.export')}
            description={t('backup.description')}
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Export data')}
            style={styles.listItem}
          />
          <List.Item
            title={t('backup.import')}
            left={(props) => <List.Icon {...props} icon="upload" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Import data')}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Time Pickers */}
      {showDailyTimePicker && (
        <DateTimePicker
          value={new Date(0, 0, 0, notifications.dailyReminder.time.hour, notifications.dailyReminder.time.minute)}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowDailyTimePicker(false);
            if (selectedTime) {
              handleTimeChange('daily', {
                hour: selectedTime.getHours(),
                minute: selectedTime.getMinutes()
              });
            }
          }}
        />
      )}

      {showMoodTimePicker && (
        <DateTimePicker
          value={new Date(0, 0, 0, notifications.moodReminder.time.hour, notifications.moodReminder.time.minute)}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowMoodTimePicker(false);
            if (selectedTime) {
              handleTimeChange('mood', {
                hour: selectedTime.getHours(),
                minute: selectedTime.getMinutes()
              });
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
  },
  permissionDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  permissionButton: {
    borderColor: '#667eea',
  },
  divider: {
    marginVertical: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  timeText: {
    color: '#667eea',
    marginTop: 4,
    fontWeight: '600',
  },
  testButton: {
    marginTop: 8,
    borderColor: '#667eea',
  },
  soundSection: {
    marginVertical: 8,
  },
  soundTitle: {
    marginBottom: 4,
  },
  soundDesc: {
    opacity: 0.7,
    marginBottom: 12,
  },
  soundButtons: {
    marginTop: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  radioContent: {
    flex: 1,
  },
});