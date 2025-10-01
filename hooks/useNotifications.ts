import Constants from "expo-constants";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";
import { useLanguage } from "./useLanguage";

// Check if we're in Expo Go environment
const isExpoGo = Constants.executionEnvironment === "storeClient";

// Conditional import for expo-notifications
let Notifications: any = null;
let notificationSupported = false;

if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");
    notificationSupported = true;
    console.log("Notifications module loaded successfully", !!Notifications);
  } catch (error) {
    console.warn("expo-notifications not available in this environment:", error);
  }
} else {
  console.warn("⚠️ Expo Go detected: Notifications disabled. Use 'npx expo run:android' for full functionality.");
}

// تنظیمات پیش‌فرض notification
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export interface NotificationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}

export function useNotifications() {
  const { t } = useLanguage();
  const { notifications: notificationSettings } = useSettingsStore();
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    canAskAgain: true,
    status: Notifications?.PermissionStatus?.UNDETERMINED || "undetermined",
  });
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<any>(undefined);

  useEffect(() => {
    if (!Notifications) {
      console.warn("Notifications not available in useEffect");
      return;
    }

    // Check initial permissions
    checkPermission();

    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log("Notification response:", response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // درخواست permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    console.log(
      "requestPermission called, Notifications available:",
      !!Notifications
    );
    if (!Notifications) {
      console.warn("Notifications module not available");
      return { granted: false, canAskAgain: false, status: "denied" };
    }

    try {
      console.log("Requesting notification permissions...");
      const result = await Notifications.requestPermissionsAsync();
      console.log("Permission request result:", result);

      const { status, canAskAgain } = result;
      const granted = status === "granted";

      const permissionData = {
        granted,
        canAskAgain,
        status,
      };

      console.log("Final permission data:", permissionData);
      setPermission(permissionData);

      return permissionData;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return { granted: false, canAskAgain: false, status: "error" };
    }
  };

  // بررسی وضعیت permission
  const checkPermission = async (): Promise<NotificationPermission> => {
    console.log(
      "checkPermission called, Notifications available:",
      !!Notifications
    );
    if (!Notifications) {
      console.warn(
        "Notifications module not available for checking permissions"
      );
      return { granted: false, canAskAgain: false, status: "denied" };
    }

    try {
      console.log("Checking notification permissions...");
      const result = await Notifications.getPermissionsAsync();
      console.log("Permission check result:", result);

      const { status, canAskAgain } = result;
      const granted = status === "granted";

      const permissionData = {
        granted,
        canAskAgain,
        status,
      };

      console.log("Final permission check data:", permissionData);
      setPermission(permissionData);
      return permissionData;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return { granted: false, canAskAgain: false, status: "error" };
    }
  };

  // ارسال notification محلی
  const scheduleNotification = async (
    title: string,
    body: string,
    trigger?: any
  ) => {
    if (!Notifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        color: "#4CAF50",
        // آیکون از app.json استفاده می‌شود، نه اینجا
      },
      trigger: trigger || null, // فوری اگه trigger نداشته باشه
    });
  };

  // Schedule daily habit reminder
  const scheduleHabitReminder = async (
    title: string,
    body: string,
    time: { hour: number; minute: number },
    identifier?: string // برای شناسایی و کنسل کردن
  ) => {
    if (!Notifications) return null;

    try {
      // ابتدا نوتیفیکیشن قبلی با همین identifier را کنسل کنیم
      if (identifier) {
        await cancelNotification(identifier);
      }

      // محاسبه زمان بعدی برای trigger
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(time.hour, time.minute, 0, 0);

      // اگر زمان تنظیم شده قبل از الان است، برای فردا تنظیم کن
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      console.log(`Scheduling notification "${identifier}" for:`, scheduledTime.toLocaleString());

      // Create daily trigger with CalendarTriggerInput
      const trigger = {
        hour: time.hour,
        minute: time.minute,
        repeats: true, // روزانه تکرار شود
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          data: { identifier },
          color: "#4CAF50",
        },
        trigger,
        identifier, // استفاده از identifier برای کنسل آسان
      });

      console.log(`Notification "${identifier}" scheduled with ID:`, notificationId);
      return notificationId;
    } catch (error) {
      console.error(`Error scheduling notification "${identifier}":`, error);
      return null;
    }
  };

  // Cancel all notifications
  const cancelAllNotifications = async () => {
    if (!Notifications) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling all notifications:", error);
    }
  };

  // Cancel specific notification
  const cancelNotification = async (identifier: string) => {
    if (!Notifications) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`Notification "${identifier}" cancelled`);
    } catch (error) {
      console.error(`Error cancelling notification "${identifier}":`, error);
    }
  };

  // Get all scheduled notifications for debugging
  const getAllScheduledNotifications = async () => {
    if (!Notifications) return [];
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log("All scheduled notifications:", notifications);
      return notifications;
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  };

  return {
    permission,
    expoPushToken,
    requestPermission,
    checkPermission,
    scheduleNotification,
    scheduleHabitReminder,
    cancelAllNotifications,
    cancelNotification,
    getAllScheduledNotifications,
    isExpoGo,
    notificationSupported,
  };
}

// تابع کمکی برای دریافت push token
async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("Expo push token:", token);
    } catch (e) {
      console.log("Error getting push token:", e);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
