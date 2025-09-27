import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18next from 'i18next';

// تنظیمات پیش‌فرض notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type NotificationSound = 'default' | 'gentle' | 'chime' | 'bell' | 'none';

export interface NotificationSettings {
  enabled: boolean;
  sound: NotificationSound;
  dailyReminder: {
    enabled: boolean;
    time: { hour: number; minute: number };
  };
  moodReminder: {
    enabled: boolean;
    time: { hour: number; minute: number };
  };
  habitReminders: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  sound: 'default',
  dailyReminder: {
    enabled: true,
    time: { hour: 9, minute: 0 },
  },
  moodReminder: {
    enabled: true,
    time: { hour: 21, minute: 0 },
  },
  habitReminders: true,
};

class NotificationService {
  // Helper برای تعیین صدا
  private getSoundConfig(soundType: NotificationSound) {
    switch (soundType) {
      case 'none':
        return { sound: false };
      case 'default':
        return { sound: true };
      case 'gentle':
        return { sound: 'notification_gentle.wav' };
      case 'chime':
        return { sound: 'notification_chime.wav' };
      case 'bell':
        return { sound: 'notification_bell.wav' };
      default:
        return { sound: true };
    }
  }

  // درخواست مجوز notifications
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: i18next.t('notifications.messages.channelName'),
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#667eea',
        });
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // بررسی وضعیت مجوز
  async getPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  // ایجاد یادآوری روزانه
  async scheduleDailyReminder(time: { hour: number; minute: number }, soundType: NotificationSound = 'default') {
    await this.cancelNotification('daily-reminder');

    const soundConfig = this.getSoundConfig(soundType);

    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-reminder',
      content: {
        title: i18next.t('notifications.messages.dailyTitle'),
        body: i18next.t('notifications.messages.dailyBody'),
        ...soundConfig,
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }

  // ایجاد یادآوری mood
  async scheduleMoodReminder(time: { hour: number; minute: number }, soundType: NotificationSound = 'default') {
    await this.cancelNotification('mood-reminder');

    const soundConfig = this.getSoundConfig(soundType);

    await Notifications.scheduleNotificationAsync({
      identifier: 'mood-reminder',
      content: {
        title: i18next.t('notifications.messages.moodTitle'),
        body: i18next.t('notifications.messages.moodBody'),
        ...soundConfig,
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }

  // ایجاد یادآوری برای عادت خاص
  async scheduleHabitReminder(
    habitId: string,
    habitName: string,
    time: { hour: number; minute: number },
    soundType: NotificationSound = 'default'
  ) {
    const identifier = `habit-${habitId}`;
    await this.cancelNotification(identifier);

    const soundConfig = this.getSoundConfig(soundType);

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: `📅 ${habitName}`,
        body: i18next.t('notifications.messages.habitBody'),
        ...soundConfig,
        data: { habitId, type: 'habit' },
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }

  // لغو notification خاص
  async cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  // لغو همه notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // دریافت لیست notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // ایجاد notification فوری (برای تست)
  async sendTestNotification(soundType: NotificationSound = 'default') {
    const soundConfig = this.getSoundConfig(soundType);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18next.t('notifications.messages.testTitle'),
        body: i18next.t('notifications.messages.testBody'),
        ...soundConfig,
      },
      trigger: null, // فوری
    });
  }

  // listener برای handle کردن notification ها
  addNotificationReceivedListener(callback: (notification: any) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // listener برای زمانی که کاربر روی notification کلیک کند
  addNotificationResponseReceivedListener(callback: (response: any) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export const notificationService = new NotificationService();
export default notificationService;