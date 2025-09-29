import Constants from "expo-constants";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";

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

    // تعیین صدای نوتیفیکیشن بر اساس تنظیمات کاربر
    let sound = "default";
    if (notificationSettings.sound !== "default") {
      sound = `./assets/sounds/notification_${notificationSettings.sound}.wav`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound,
        color: "#4CAF50",
        // آیکون از app.json استفاده می‌شود، نه اینجا
      },
      trigger: trigger || null, // فوری اگه trigger نداشته باشه
    });
  };

  // ارسال notification روزانه برای یادآوری عادت
  const scheduleHabitReminder = async (
    habitName: string,
    time: { hour: number; minute: number },
    weekdays?: number[] // 0 = یکشنبه، 6 = شنبه
  ) => {
    if (!Notifications) return;

    // تعیین صدای نوتیفیکیشن بر اساس تنظیمات کاربر
    let sound = "default";
    if (notificationSettings.sound !== "default") {
      sound = `./assets/sounds/notification_${notificationSettings.sound}.wav`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 یادآوری عادت",
        body: `وقت انجام "${habitName}" رسیده!`,
        sound,
        data: { habitName },
        color: "#4CAF50",
        // آیکون از app.json استفاده می‌شود
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60, // یک دقیقه (برای تست)
        repeats: true,
      },
    });
  };

  // لغو همه notification ها
  const cancelAllNotifications = async () => {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // لغو notification خاص
  const cancelNotification = async (identifier: string) => {
    if (!Notifications) return;
    await Notifications.cancelScheduledNotificationAsync(identifier);
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
