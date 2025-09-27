import { Platform } from 'react-native';
import i18next from 'i18next';
import Constants from 'expo-constants';

// بررسی محیط اجرا
console.log('Constants.executionEnvironment:', Constants.executionEnvironment);
const isExpoGo = Constants.executionEnvironment === 'storeClient';
// TEMPORARY: Force enable for testing on emulator
const isNotificationSupported = __DEV__ ? true : !isExpoGo;
console.log('isExpoGo:', isExpoGo, 'isNotificationSupported:', isNotificationSupported);

// Import conditional برای expo-notifications - فقط در production build
let Notifications: any = null;

// تابع برای lazy loading notifications
const loadNotifications = () => {
  if (!isNotificationSupported || Notifications !== null) {
    return;
  }

  try {
    Notifications = require('expo-notifications');

    // تنظیمات پیش‌فرض notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn('expo-notifications not available:', error);
    Notifications = null;
  }
};

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
  // بررسی پشتیبانی notifications
  private isSupported(): boolean {
    return isNotificationSupported && Notifications !== null;
  }

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
    if (!this.isSupported()) {
      console.warn('Notifications not supported in Expo Go environment');
      return false;
    }

    loadNotifications();
    if (!Notifications) {
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === 'android' && Notifications?.AndroidImportance) {
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
    if (!this.isSupported()) {
      return 'unsupported';
    }

    loadNotifications();
    if (!Notifications) {
      return 'unsupported';
    }

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting permission status:', error);
      return 'error';
    }
  }

  // ایجاد یادآوری روزانه
  async scheduleDailyReminder(time: { hour: number; minute: number }, soundType: NotificationSound = 'default') {
    if (!this.isSupported()) {
      console.warn('Notifications not supported - daily reminder not scheduled');
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
    }
  }

  // ایجاد یادآوری mood
  async scheduleMoodReminder(time: { hour: number; minute: number }, soundType: NotificationSound = 'default') {
    if (!this.isSupported()) {
      console.warn('Notifications not supported - mood reminder not scheduled');
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error scheduling mood reminder:', error);
    }
  }

  // ایجاد یادآوری برای عادت خاص
  async scheduleHabitReminder(
    habitId: string,
    habitName: string,
    time: { hour: number; minute: number },
    soundType: NotificationSound = 'default'
  ) {
    if (!this.isSupported()) {
      console.warn('Notifications not supported - habit reminder not scheduled');
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error scheduling habit reminder:', error);
    }
  }

  // لغو notification خاص
  async cancelNotification(identifier: string) {
    if (!this.isSupported()) {
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // لغو همه notifications
  async cancelAllNotifications() {
    if (!this.isSupported()) {
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // دریافت لیست notifications
  async getScheduledNotifications() {
    if (!this.isSupported()) {
      return [];
    }

    loadNotifications();
    if (!Notifications) {
      return [];
    }

    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // ایجاد notification فوری (برای تست)
  async sendTestNotification(soundType: NotificationSound = 'default') {
    if (!this.isSupported()) {
      console.warn('Notifications not supported - test notification not sent');
      return;
    }

    loadNotifications();
    if (!Notifications) {
      return;
    }

    try {
      const soundConfig = this.getSoundConfig(soundType);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18next.t('notifications.messages.testTitle'),
          body: i18next.t('notifications.messages.testBody'),
          ...soundConfig,
        },
        trigger: null, // فوری
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  // listener برای handle کردن notification ها
  addNotificationReceivedListener(callback: (notification: any) => void) {
    if (!this.isSupported()) {
      return { remove: () => {} };
    }

    loadNotifications();
    if (!Notifications) {
      return { remove: () => {} };
    }

    try {
      return Notifications.addNotificationReceivedListener(callback);
    } catch (error) {
      console.error('Error adding notification listener:', error);
      return { remove: () => {} };
    }
  }

  // listener برای زمانی که کاربر روی notification کلیک کند
  addNotificationResponseReceivedListener(callback: (response: any) => void) {
    if (!this.isSupported()) {
      return { remove: () => {} };
    }

    loadNotifications();
    if (!Notifications) {
      return { remove: () => {} };
    }

    try {
      return Notifications.addNotificationResponseReceivedListener(callback);
    } catch (error) {
      console.error('Error adding notification response listener:', error);
      return { remove: () => {} };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;