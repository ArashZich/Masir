import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

// تنظیمات پیش‌فرض notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    canAskAgain: true,
    status: Notifications.PermissionStatus.UNDETERMINED,
  });
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // درخواست permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    const { status, canAskAgain } =
      await Notifications.requestPermissionsAsync();
    const granted = status === "granted";

    const permissionData = {
      granted,
      canAskAgain,
      status,
    };

    setPermission(permissionData);
    return permissionData;
  };

  // بررسی وضعیت permission
  const checkPermission = async (): Promise<NotificationPermission> => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    const granted = status === "granted";

    const permissionData = {
      granted,
      canAskAgain,
      status,
    };

    setPermission(permissionData);
    return permissionData;
  };

  // ارسال notification محلی
  const scheduleNotification = async (
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 یادآوری عادت",
        body: `وقت انجام "${habitName}" رسیده!`,
        sound: "default",
        data: { habitName },
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
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // لغو notification خاص
  const cancelNotification = async (identifier: string) => {
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
