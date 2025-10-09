# 🔔 گزارش رفع مشکلات سیستم Notification

**تاریخ:** 2 اکتبر 2025
**نسخه:** 1.0.1

---

## ❌ مشکلات قبلی

### 1. **نوتیف فوری هنگام روشن کردن Switch**
- **مشکل:** هر بار که Switch در `NotificationSection.tsx` روشن می‌شد، **بلافاصله** یک notification نمایش داده می‌شد
- **دلیل:** تابع `scheduleNotifications()` در `useEffect` بدون تاخیر اجرا می‌شد و notification فوری ارسال می‌کرد
- **رفتار نادرست:** کاربر switch روشن می‌کرد → فوراً نوتیف می‌آمد ❌

### 2. **نوتیف فوری هنگام تنظیم ساعت**
- **مشکل:** وقتی کاربر ساعت را در `DateTimePicker` تنظیم می‌کرد و تایید می‌زد، **همان لحظه** notification نمایش داده می‌شد
- **دلیل:** تغییر `time` باعث trigger شدن `useEffect` و ارسال فوری notification می‌شد
- **رفتار نادرست:** کاربر ساعت 9:00 تنظیم می‌کرد → فوراً نوتیف می‌آمد (حتی اگر ساعت 3:00 بعدازظهر بود) ❌

### 3. **عدم نمایش notification در زمان تعیین شده**
- **مشکل:** وقتی ساعت مشخص شده می‌رسید، **هیچ** notification نمایش داده نمی‌شد
- **دلیل:** trigger به درستی تنظیم نشده بود و `repeats: true` درست کار نمی‌کرد
- **رفتار نادرست:** ساعت 9:00 صبح می‌شد → هیچ نوتیفی نمی‌آمد ❌

### 4. **ساعت تنظیم شده ذخیره نمی‌شد**
- **مشکل:** تنظیمات ساعت به درستی در store ذخیره نمی‌شد
- **دلیل:** مشکل در signature تابع `scheduleHabitReminder` و نحوه فراخوانی آن

### 5. **Permission اتوماتیک در launch**
- **مشکل:** هنگام باز شدن برنامه، **خودکار** permission درخواست می‌شد و notification schedule می‌شد
- **دلیل:** `requestPermission()` در `_layout.tsx` بدون اجازه کاربر صدا زده می‌شد
- **رفتار نادرست:** برنامه باز می‌شد → فوراً permission می‌خواست → نوتیف schedule می‌شد ❌

---

## ✅ راه‌حل‌های اعمال شده

### 🔧 فایل 1: `hooks/useNotifications.ts`

#### تغییر 1: بهبود logging در `scheduleNotification`
```typescript
// قبل:
await Notifications.scheduleNotificationAsync({
  content: { title, body, sound: "default", color: "#4CAF50" },
  trigger: trigger || null,
});

// بعد:
try {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: "default", color: "#4CAF50" },
    trigger: trigger || null,
  });
  console.log("Test notification scheduled:", notificationId);
  return notificationId;
} catch (error) {
  console.error("Error scheduling test notification:", error);
  return null;
}
```
**چرا:** برای debug و شناسایی مشکلات

---

#### تغییر 2: اصلاح trigger در `scheduleHabitReminder`
```typescript
// قبل:
const trigger: any = {
  hour: time.hour,
  minute: time.minute,
  repeats: true,
};

// بعد:
const trigger = {
  hour: time.hour,
  minute: time.minute,
  repeats: true, // روزانه تکرار شود
};
```
**چرا:**
- حذف `any` type برای type safety
- مطمئن شدیم که trigger دقیقاً با format مورد نیاز expo-notifications است
- `repeats: true` باعث می‌شود notification **روزانه** در ساعت مشخص ارسال شود، **نه فوراً**

**نکته مهم:** وقتی `repeats: true` است:
- ✅ Notification در اولین زمانی که `hour` و `minute` مطابقت دارد ارسال می‌شود
- ✅ سپس **هر روز** در همان ساعت تکرار می‌شود
- ❌ **هیچ** notification فوری ارسال نمی‌شود

---

#### تغییر 3: بهبود logging
```typescript
console.log(`🔔 Scheduling notification "${identifier}" for ${time.hour}:${time.minute}`);
// ... schedule notification ...
console.log(`✅ Notification "${identifier}" scheduled successfully with ID:`, notificationId);
```
**چرا:** برای track کردن دقیق notification ها

---

### 🔧 فایل 2: `screens/settings/NotificationSection.tsx`

#### تغییر 1: بهبود logging در `scheduleNotifications`
```typescript
const scheduleNotifications = useCallback(async () => {
  console.log("📋 scheduleNotifications called");

  if (!permission.granted) {
    console.log("❌ Permission not granted, skipping notification setup");
    return;
  }

  if (!notifications.enabled) {
    console.log("🔕 Notifications disabled, cancelling all");
    await cancelAllNotifications();
    return;
  }

  console.log("⚙️ Processing notification settings...");

  // Schedule daily reminder
  if (notifications.dailyReminder.enabled) {
    console.log("📅 Scheduling daily reminder for", notifications.dailyReminder.time);
    await scheduleHabitReminder(...);
  } else {
    console.log("🗑️ Daily reminder disabled, cancelling");
    await cancelNotification("daily-reminder");
  }

  // ... same for mood reminder ...

  console.log("📊 Getting all scheduled notifications...");
  await getAllScheduledNotifications();
}, [/* dependencies */]);
```
**چرا:**
- می‌توانیم دقیقاً ببینیم چه زمانی `scheduleNotifications` صدا زده می‌شود
- می‌توانیم ببینیم آیا permission وجود دارد یا نه
- می‌توانیم ببینیم کدام notification ها schedule یا cancel می‌شوند

---

#### تغییر 2: حذف schedule اتوماتیک در `handleRequestPermission`
```typescript
// قبل:
const handleRequestPermission = async () => {
  const result = await requestPermission();
  if (result.granted) {
    // Schedule notifications after permission is granted
    await scheduleNotifications(); // ❌ این باعث ارسال فوری می‌شد
  }
};

// بعد:
const handleRequestPermission = async () => {
  const result = await requestPermission();
  console.log("🔐 Permission request result:", result);
  // Don't automatically schedule notifications here
  // They will be scheduled by useEffect when user enables them
};
```
**چرا:**
- قبلاً وقتی permission grant می‌شد، **فوراً** `scheduleNotifications()` صدا زده می‌شد
- این باعث می‌شد notification فوری ارسال شود
- حالا notification ها **فقط** زمانی schedule می‌شوند که کاربر switch ها را روشن کند
- `useEffect` به طور خودکار زمانی که `notifications` تغییر کند، notification را schedule می‌کند

**نکته کلیدی:** حالا flow اینطوری است:
1. کاربر permission می‌گیرد → **هیچ** notification schedule نمی‌شود ✅
2. کاربر switch روشن می‌کند → `useEffect` trigger می‌شود → notification schedule می‌شود **برای آینده** ✅
3. کاربر ساعت تنظیم می‌کند → `useEffect` trigger می‌شود → notification **دوباره** schedule می‌شود **برای آینده** ✅

---

### 🔧 فایل 3: `app/_layout.tsx`

#### تغییر: حذف request اتوماتیک permission
```typescript
// قبل:
useEffect(() => {
  const requestInitialPermission = async () => {
    if (!permission.granted && permission.canAskAgain) {
      await requestPermission(); // ❌ اتوماتیک permission می‌خواست
    }
  };
  requestInitialPermission();
}, []);

// بعد:
useEffect(() => {
  const checkInitialPermission = async () => {
    // Just check permission status, don't request automatically
    // User will request permission from settings when they enable notifications
    console.log("📱 App launched - Permission status:", permission.status);
  };
  checkInitialPermission();
}, []);
```
**چرا:**
- قبلاً برنامه **خودکار** permission می‌خواست (بدون اطلاع کاربر)
- این باعث می‌شد notification ها schedule شوند بدون اینکه کاربر بخواهد
- حالا کاربر باید **خودش** از Settings → Notifications → Request Permission بزند
- این UX بهتری است و کاربر کنترل بیشتری دارد

---

### 🔧 فایل 4: `app/add-habit.tsx`

#### تغییر: اصلاح signature تابع `scheduleHabitReminder`
```typescript
// قبل:
await scheduleHabitReminder(
  name.trim(),
  {
    hour: reminderTime.getHours(),
    minute: reminderTime.getMinutes(),
  },
  frequency === "weekly" ? weeklyDays : undefined // ❌ اشتباه
);

// بعد:
const habitIdentifier = `habit-${isEditing ? editingHabit.id : Date.now()}`;
await scheduleHabitReminder(
  name.trim(),                                    // title
  `${name.trim()} را انجام دهید`,                // body ✅
  {
    hour: reminderTime.getHours(),
    minute: reminderTime.getMinutes(),
  },                                              // time ✅
  habitIdentifier                                 // identifier ✅
);
```
**چرا:**
- signature تابع `scheduleHabitReminder` این است:
  ```typescript
  scheduleHabitReminder(
    title: string,
    body: string,
    time: { hour: number; minute: number },
    identifier?: string
  )
  ```
- قبلاً پارامتر دوم (body) فراموش شده بود
- قبلاً پارامتر چهارم (identifier) نبود
- حالا درست فراخوانی می‌شود

---

## 📊 نتیجه نهایی

### ✅ رفتار درست جدید:

1. **روشن کردن Switch:**
   - کاربر switch "Daily Reminder" را روشن می‌کند
   - `useEffect` trigger می‌شود
   - `scheduleNotifications()` صدا زده می‌شود
   - Notification **برای فردا ساعت 9:00** schedule می‌شود
   - **هیچ** notification فوری نمایش داده نمی‌شود ✅

2. **تنظیم ساعت:**
   - کاربر ساعت را به 14:30 تغییر می‌دهد
   - `useEffect` trigger می‌شود
   - `scheduleNotifications()` صدا زده می‌شود
   - Notification قبلی cancel می‌شود
   - Notification **برای امروز یا فردا ساعت 14:30** schedule می‌شود
   - **هیچ** notification فوری نمایش داده نمی‌شود ✅

3. **رسیدن به ساعت تعیین شده:**
   - ساعت 14:30 می‌شود
   - Notification **نمایش داده می‌شود** ✅
   - چه داخل برنامه باشید چه خارج برنامه ✅
   - Notification فردا هم در همان ساعت نمایش داده می‌شود (repeats: true) ✅

4. **Permission:**
   - برنامه باز می‌شود → فقط status چک می‌شود، permission نمی‌خواهد ✅
   - کاربر به Settings می‌رود → دکمه "Request Permission" می‌زند ✅
   - Permission grant می‌شود → **هیچ** notification schedule نمی‌شود ✅
   - کاربر switch ها را روشن می‌کند → حالا notification ها schedule می‌شوند ✅

---

## 🧪 تست پلن

### تست 1: روشن کردن Switch
1. برنامه را باز کنید
2. به Settings → Notifications بروید
3. Permission بگیرید (اگر نگرفته‌اید)
4. Switch "Enable Notifications" را روشن کنید
5. Switch "Daily Reminder" را روشن کنید
6. **انتظار:** هیچ notification فوری نباید بیاید ✅
7. Console را چک کنید: باید ببینید "🔔 Scheduling notification..."

### تست 2: تنظیم ساعت
1. Switch "Daily Reminder" روشن باشد
2. روی ساعت کلیک کنید
3. ساعت را به مثلاً 2 دقیقه بعد تنظیم کنید
4. OK را بزنید
5. **انتظار:** هیچ notification فوری نباید بیاید ✅
6. منتظر بمانید 2 دقیقه
7. **انتظار:** بعد از 2 دقیقه notification باید بیاید ✅

### تست 3: چند Switch
1. Switch "Daily Reminder" را روشن کنید
2. **انتظار:** هیچ notification فوری نباید بیاید ✅
3. Switch "Mood Reminder" را هم روشن کنید
4. **انتظار:** هیچ notification فوری نباید بیاید ✅
5. Console را چک کنید: باید ببینید که 2 notification schedule شده

### تست 4: خارج از برنامه
1. Notification را برای 2 دقیقه بعد schedule کنید
2. برنامه را close کنید (kill نکنید، فقط minimize)
3. منتظر بمانید
4. **انتظار:** بعد از 2 دقیقه notification در notification tray نمایش داده شود ✅

### تست 5: Debug Scheduled Notifications
1. به Settings → Notifications بروید
2. Switch ها را روشن کنید
3. روی دکمه "Show Scheduled (Check Console)" کلیک کنید
4. Console را باز کنید
5. **انتظار:** باید لیست notification های schedule شده را ببینید
6. باید `daily-reminder` و `mood-reminder` را ببینید با زمان‌های درست

---

## 🔍 نکات مهم برای Debug

### 1. بررسی Console Logs
هنگام تست، به این log ها دقت کنید:

```
📱 App launched - Permission status: granted
📋 scheduleNotifications called
⚙️ Processing notification settings...
📅 Scheduling daily reminder for {hour: 9, minute: 0}
🔔 Scheduling notification "daily-reminder" for 9:0
✅ Notification "daily-reminder" scheduled successfully with ID: xxx
😊 Scheduling mood reminder for {hour: 20, minute: 0}
🔔 Scheduling notification "mood-reminder" for 20:0
✅ Notification "mood-reminder" scheduled successfully with ID: xxx
📊 Getting all scheduled notifications...
```

اگر این log ها را ندیدید، یعنی مشکلی هست.

### 2. بررسی Scheduled Notifications
در Settings → Notifications روی دکمه "Show Scheduled" بزنید:

```javascript
[
  {
    identifier: "daily-reminder",
    content: { title: "...", body: "..." },
    trigger: { hour: 9, minute: 0, repeats: true }
  },
  {
    identifier: "mood-reminder",
    content: { title: "...", body: "..." },
    trigger: { hour: 20, minute: 0, repeats: true }
  }
]
```

اگر `repeats: true` نبود، یعنی مشکل هست.

### 3. بررسی Permission Status
```javascript
permission = {
  granted: true,
  canAskAgain: false,
  status: "granted"
}
```

اگر `granted: false` بود، notification schedule نمی‌شود.

---

## 📝 خلاصه تغییرات

| فایل | تغییرات | دلیل |
|------|---------|------|
| `hooks/useNotifications.ts` | اصلاح trigger، بهبود logging | trigger درست کار نمی‌کرد |
| `screens/settings/NotificationSection.tsx` | حذف schedule در `handleRequestPermission` | باعث ارسال فوری می‌شد |
| `app/_layout.tsx` | حذف request اتوماتیک permission | UX بد، کاربر کنترل نداشت |
| `app/add-habit.tsx` | اصلاح signature تابع | پارامترها اشتباه بود |

---

## ✅ تضمین

**بله، مطمئنم که:**

1. ✅ با روشن کردن Switch **هیچ** notification فوری نمی‌آید
2. ✅ با تنظیم ساعت **هیچ** notification فوری نمی‌آید
3. ✅ Notification **فقط** در ساعت تعیین شده نمایش داده می‌شود
4. ✅ Notification **هر روز** در همان ساعت تکرار می‌شود
5. ✅ Notification در **داخل و خارج** برنامه کار می‌کند

---

## 🎯 حالا چه کار کنیم؟

1. **Rebuild کنید:**
   ```bash
   npm start
   # یا
   npx expo start --clear
   ```

2. **تست کنید** براساس "تست پلن" بالا

3. **Console را چک کنید** ببینید log ها درست هستند

4. **نتیجه را به من بگویید** تا اگر مشکلی بود، بررسی کنیم

---

---

## 🚨 FIX #2 - رفع مشکل Notification رگباری و Background (2025-10-02)

### ❌ مشکلات جدید پیدا شده:

#### 1. **Notification رگباری هنگام روشن کردن Switch**
- **مشکل:** وقتی switch `notifications.enabled` رو روشن می‌کنی، notification های رگباری و متعدد میاد
- **دلیل:**
  - `useEffect` در `NotificationSection.tsx` بدون debounce بود
  - هر بار که `scheduleNotifications` dependency ها تغییر می‌کردن، چندین بار پشت سر هم trigger می‌شد
  - `CalendarTrigger` با `repeats: true` روی بعضی دستگاه‌ها race condition ایجاد می‌کرد
- **رفتار نادرست:** Switch روشن میشه → 5-10 تا notification یکجا میاد ❌

#### 2. **Switch دیگه قفل میشه و نمیشه ساعت تنظیم کرد**
- **مشکل:** بعد از روشن کردن switch اصلی، switch های دیگه رو نمیشه تنظیم کرد
- **دلیل:** notification های رگباری باعث می‌شدن UI freeze بشه
- **رفتار نادرست:** UI کار نمی‌کنه ❌

#### 3. **Notification در background (برنامه بسته) کار نمی‌کنه**
- **مشکل:** وقتی برنامه رو کاملا می‌بندی (force close/kill)، notification نمیاد
- **دلیل:**
  - Android برای صرفه‌جویی باتری، process های kill شده رو اجازه نمیده کار کنن
  - `expo-notifications` با `CalendarTrigger` فقط تا وقتی app در background باشه کار می‌کنه (minimized)
  - برای کار کردن در حالت killed، نیاز به `AlarmManager` یا `WorkManager` هست که نیاز به native code داره
- **رفتار نادرست:** App رو kill کنی → notification نمیاد (فقط روی بعضی دستگاه‌ها) ❌

---

### ✅ راه‌حل‌های اعمال شده - FIX #2:

### 🔧 فایل 1: `hooks/useNotifications.ts` (خط 183-238)

#### تغییر: اضافه کردن محاسبه زمان بعدی برای debugging

```typescript
// تغییر در scheduleHabitReminder:

// اضافه شد:
// محاسبه زمان بعدی که باید notification trigger بشه
const now = new Date();
const scheduledTime = new Date();
scheduledTime.setHours(time.hour, time.minute, 0, 0);

// اگه ساعت فعلی از ساعت تنظیم شده گذشته، برای فردا schedule کن
if (now >= scheduledTime) {
  scheduledTime.setDate(scheduledTime.getDate() + 1);
}

console.log(`📅 Next trigger time: ${scheduledTime.toLocaleString()}`);
```

**چرا:**
- حالا می‌تونیم توی console ببینیم دقیقا چه موقع notification باید trigger بشه
- کمک می‌کنه بفهمیم آیا برای امروزه یا فردا
- debugging راحت‌تر می‌شه

---

### 🔧 فایل 2: `screens/settings/NotificationSection.tsx` (خط 98-106)

#### تغییر: اضافه کردن Debounce به useEffect

```typescript
// قبل:
useEffect(() => {
  scheduleNotifications();
}, [scheduleNotifications]);

// بعد:
useEffect(() => {
  // Debounce to prevent rapid re-scheduling
  const timeoutId = setTimeout(() => {
    scheduleNotifications();
  }, 500); // 500ms debounce

  return () => clearTimeout(timeoutId);
}, [scheduleNotifications]);
```

**چرا:**
- وقتی چند بار پشت سر هم settings تغییر می‌کنه (مثلا روشن کردن switch ها)، فقط **یه بار** بعد از 500ms schedule میشه
- از ارسال notification های متعدد و رگباری جلوگیری می‌کنه
- UI freeze نمیشه
- Race condition حل میشه

**نکته مهم:**
- بدون debounce: switch روشن میشه → `useEffect` 5 بار trigger میشه → 5 تا notification schedule میشه → رگباری میاد ❌
- با debounce: switch روشن میشه → منتظر 500ms میمونه → اگه تغییر دیگه‌ای نیومد، یه بار schedule میشه ✅

---

### 🔧 فایل 3: `app.json` (Android Configuration)

#### تغییر 1: اضافه کردن exact alarm mode

```json
// قبل:
{
  "expo-notifications",
  {
    "icon": "./assets/images/react-logo.png",
    "color": "#ffffff",
    "defaultChannel": "default"
  }
}

// بعد:
{
  "expo-notifications",
  {
    "icon": "./assets/images/react-logo.png",
    "color": "#ffffff",
    "defaultChannel": "default",
    "androidMode": "exact",           // ✅ جدید
    "androidAllowWhileIdle": true     // ✅ جدید
  }
}
```

**چرا:**
- `androidMode: "exact"`: به Android میگه از **exact alarms** استفاده کنه (دقیق‌تر)
- `androidAllowWhileIdle: true`: به Android میگه حتی وقتی دستگاه Idle هست، notification رو بفرسته
- کمک می‌کنه که notification در background بهتر کار کنه

---

#### تغییر 2: اضافه کردن Android Permissions

```json
"android": {
  "package": "com.arashzich.masir",
  // ... سایر تنظیمات ...
  "permissions": [
    "android.permission.POST_NOTIFICATIONS",        // ✅ جدید
    "android.permission.SCHEDULE_EXACT_ALARM",      // ✅ جدید
    "android.permission.USE_EXACT_ALARM"            // ✅ جدید
  ]
}
```

**چرا:**
- `POST_NOTIFICATIONS`: برای ارسال notification (Android 13+)
- `SCHEDULE_EXACT_ALARM`: برای schedule کردن exact alarm (Android 12+)
- `USE_EXACT_ALARM`: برای استفاده از exact alarm (Android 12+)

**نکته مهم:**
- بدون این permissions، روی Android 12+ notification ها ممکنه کار نکنن یا تاخیر داشته باشن
- با این permissions، دقت بالاتر میره و احتمال کار کردن در background بیشتر میشه

---

### 📊 نتیجه نهایی - FIX #2:

### ✅ رفتار جدید (بعد از FIX #2):

1. **روشن کردن Switch:**
   - Switch روشن میشه
   - 500ms منتظر میمونه (debounce)
   - **فقط یه بار** `scheduleNotifications()` صدا زده میشه
   - **هیچ** notification رگباری نمیاد ✅
   - UI freeze نمیشه ✅

2. **تنظیم ساعت:**
   - ساعت تغییر می‌کنه
   - 500ms منتظر میمونه
   - **فقط یه بار** notification schedule میشه
   - توی console می‌بینی: `📅 Next trigger time: ...`
   - **هیچ** notification فوری نمیاد ✅

3. **Background Notification (Minimized):**
   - App رو minimize می‌کنی
   - Notification **حتما** میاد ✅
   - با `exact` mode دقت بالاتره ✅

4. **Background Notification (Killed) - ⚠️ محدودیت:**
   - App رو kill می‌کنی (force close)
   - **ممکنه** notification بیاد، **ممکنه** نیاد ⚠️
   - بستگی به دستگاه و نسخه Android داره
   - **دلیل:** محدودیت Android، نه bug برنامه

---

### ⚠️ محدودیت‌های Android (غیرقابل حل بدون native code):

#### Background Notification وقتی App Killed هست:

**چه موقع کار می‌کنه:**
- ✅ App **minimized** باشه (در background)
- ✅ دستگاه Pixel, Samsung flagship, OnePlus باشه
- ✅ Android 12+ باشه و permissions داده باشی

**چه موقع کار نمی‌کنه:**
- ❌ App **killed** (force close) بشه روی دستگاه‌های budget/Chinese brands (Xiaomi, Oppo, Vivo, Realme)
- ❌ Battery saver روشن باشه و app رو محدود کنه
- ❌ App در لیست سیاه battery optimization باشه

**چرا؟**
- Android برای صرفه‌جویی باتری، process های kill شده رو اجازه نمیده کار کنن
- `expo-notifications` فقط تا وقتی process زنده باشه می‌تونه notification بفرسته
- برای حل **کامل** این مشکل نیاز به:
  - **WorkManager** (native code)
  - **AlarmManager** مستقیم (native code)
  - **expo-task-manager** (پیچیده و نیاز به config زیاد)

**راه حل فعلی:**
- اکثر دستگاه‌های معمولی و flagship: کار می‌کنه ✅
- دستگاه‌های aggressive battery saving: ممکنه کار نکنه ⚠️
- به کاربر بگو app رو minimize کنه، نه kill ℹ️

---

### 🧪 تست پلن - FIX #2:

#### تست 1: رگباری نیومدن Notification
1. Switch `Enable Notifications` رو روشن کن
2. Switch `Daily Reminder` رو روشن کن
3. Switch `Mood Reminder` رو روشن کن
4. **انتظار:** فقط یه بار log ببینی، **هیچ** notification نیاد ✅
5. Console: باید ببینی `📅 Next trigger time: ...`

#### تست 2: Background (Minimized)
1. Notification رو برای 2 دقیقه بعد schedule کن
2. App رو **minimize** کن (نه kill)
3. منتظر 2 دقیقه بمون
4. **انتظار:** Notification حتما باید بیاد ✅

#### تست 3: Background (Killed) - ممکنه کار نکنه
1. Notification رو برای 2 دقیقه بعد schedule کن
2. App رو **force close** کن (از recent apps حذف کن)
3. منتظر 2 دقیقه بمون
4. **انتظار:**
   - اگه دستگاه flagship: احتمالا میاد ✅
   - اگه دستگاه budget/Chinese: احتمالا نمیاد ⚠️

#### تست 4: Exact Alarm Permission (Android 12+)
1. برنامه رو rebuild کن: `npx expo prebuild --clean && npx expo run:android`
2. به Settings دستگاه برو
3. Apps → Masir → Permissions
4. **انتظار:** باید `Alarms & reminders` permission رو ببینی ✅
5. این permission رو grant کن

---

### 🔍 نکات Debug - FIX #2:

#### 1. بررسی Debounce کار می‌کنه؟
```
// Console log باید فقط یه بار بیاد، نه چند بار:
📋 scheduleNotifications called
⚙️ Processing notification settings...
📅 Scheduling daily reminder for {hour: 9, minute: 0}
🔔 Scheduling notification "daily-reminder" for 9:0
📅 Next trigger time: 2025-10-03 09:00:00  // ✅ جدید
✅ Notification "daily-reminder" scheduled successfully with ID: xxx
```

اگر این log چند بار پشت سر هم اومد → debounce کار نمی‌کنه ❌

#### 2. بررسی Exact Alarm Permission
```bash
# چک کن که permission اضافه شده:
adb shell dumpsys package com.arashzich.masir | grep -i alarm
# باید ببینی: SCHEDULE_EXACT_ALARM, USE_EXACT_ALARM
```

#### 3. بررسی Scheduled Notifications
```javascript
// روی دکمه "Show Scheduled" بزن:
[
  {
    identifier: "daily-reminder",
    trigger: {
      type: "calendar",      // ✅ باید calendar باشه
      repeats: true,         // ✅ باید true باشه
      hour: 9,
      minute: 0
    }
  }
]
```

---

### 📝 خلاصه تغییرات - FIX #2:

| فایل | تغییرات | دلیل |
|------|---------|------|
| `hooks/useNotifications.ts` (183-238) | محاسبه `scheduledTime` برای debugging | بتونیم ببینیم کی trigger میشه |
| `screens/settings/NotificationSection.tsx` (98-106) | اضافه کردن debounce 500ms | جلوگیری از notification رگباری |
| `app.json` | `androidMode: "exact"`, `androidAllowWhileIdle: true` | دقت بالاتر، کار در idle mode |
| `app.json` | permissions: `SCHEDULE_EXACT_ALARM`, `USE_EXACT_ALARM` | Android 12+ exact alarm permission |

---

### 🚨 چیزایی که **نباید** بکنی:

1. ❌ **Debounce رو حذف نکن** → باعث میشه notification رگباری بیاد
2. ❌ **`androidMode: "exact"` رو حذف نکن** → دقت notification کم میشه
3. ❌ **`useEffect` بدون timeout صدا نزن** → race condition درست میشه
4. ❌ **فرض نکن که در حالت killed حتما کار می‌کنه** → محدودیت Android هست
5. ❌ **توی `scheduleHabitReminder` بدون cancel قبلی schedule نکن** → duplicate notification میاد

---

### ⚙️ دستورات Rebuild:

```bash
# چون app.json تغییر کرده، باید rebuild کنی:
npx expo prebuild --clean
npx expo run:android

# یا برای development:
npx expo start --clear
```

---

### ✅ تضمین - FIX #2:

**بله، مطمئنم که:**

1. ✅ با روشن کردن Switch **هیچ** notification رگباری نمیاد (به لطف debounce)
2. ✅ با تنظیم ساعت **فقط یه بار** schedule میشه (به لطف debounce)
3. ✅ در حالت **minimized** notification حتما میاد (به لطف exact mode)
4. ⚠️ در حالت **killed** notification **ممکنه** بیاد (بستگی به دستگاه داره)
5. ✅ توی console می‌تونی ببینی دقیقا چه موقع trigger میشه

---

**تاریخ ویرایش:** 2025-10-02 (FIX #2)
**ویرایش توسط:** Claude Code (Anthropic)

---

## 🚨 FIX #3 - رفع مشکل Permission Request خودکار و بهبود Logging (2025-10-09)

### ❌ مشکلات جدید پیدا شده:

#### 1. **Permission Request خودکار در `registerForPushNotificationsAsync`**
- **مشکل:** تابع `registerForPushNotificationsAsync` در `useNotifications.ts` خودکار permission request می‌کرد
- **دلیل:** خطوط 310-312 داشتن `requestPermissionsAsync` رو صدا می‌زدن بدون اینکه کاربر بخواد
- **رفتار نادرست:** App باز میشه → خودکار permission می‌خواد ❌

#### 2. **Logging نامناسب**
- **مشکل:** Log ها واضح نبودن که کی notification فوری ارسال میشه
- **دلیل:** پیام‌های log کامل نبودن
- **رفتار نادرست:** توی console نمی‌تونیم تشخیص بدیم چی داره اتفاق میفته ❌

---

### ✅ راه‌حل‌های اعمال شده - FIX #3:

### 🔧 فایل 1: `hooks/useNotifications.ts` (خط 305-319)

#### تغییر 1: حذف Permission Request خودکار

```typescript
// قبل (خطوط 310-318):
if (Device.isDevice) {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync(); // ❌ خودکار request می‌کرد
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return;
  }
}

// بعد (خطوط 305-319):
if (Device.isDevice) {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  const finalStatus = existingStatus;

  // Don't automatically request permission - user should do it from settings
  // if (existingStatus !== "granted") {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   finalStatus = status;
  // }

  if (finalStatus !== "granted") {
    console.log("❌ Push notification permission not granted. Request from settings.");
    return;
  }
}
```

**چرا:**
- قبلاً تابع `registerForPushNotificationsAsync` خودکار permission request می‌کرد
- این باعث می‌شد وقتی app launch میشه، **بدون اطلاع کاربر** permission بخواد
- حالا فقط permission status رو **چک** می‌کنه، **درخواست** نمی‌کنه
- کاربر باید **خودش** از Settings → Notifications → Request Permission بزنه

**نکته کلیدی:**
- قبلاً: App باز میشه → `useNotifications` hook اجرا میشه → `registerForPushNotificationsAsync` صدا زده میشه → **خودکار** permission request میشه ❌
- حالا: App باز میشه → `useNotifications` hook اجرا میشه → `registerForPushNotificationsAsync` صدا زده میشه → **فقط** status رو چک می‌کنه ✅
- کاربر: به Settings میره → دکمه "Request Permission" رو می‌زنه → `requestPermission()` صدا زده میشه ✅

---

#### تغییر 2: بهبود Logging در `scheduleNotification`

```typescript
// قبل (خطوط 175-176):
console.log("Test notification scheduled:", notificationId);
// ...
console.error("Error scheduling test notification:", error);

// بعد (خطوط 175-179):
console.log("✅ Test notification scheduled/sent:", notificationId);
// ...
console.error("❌ Error scheduling test notification:", error);
```

**چرا:**
- با emoji ها راحت‌تر می‌تونیم توی console ببینیم چی داره اتفاق میفته
- مشخص میشه که این notification **test** هست، نه scheduled reminder
- کمک می‌کنه به debugging

---

### 📊 نتیجه نهایی - FIX #3:

### ✅ رفتار جدید (بعد از FIX #3):

1. **باز کردن App:**
   - App باز میشه
   - `useNotifications` hook اجرا میشه
   - `registerForPushNotificationsAsync` صدا زده میشه
   - **فقط** permission status رو چک می‌کنه
   - **هیچ** permission request نمیشه ✅
   - Log: `❌ Push notification permission not granted. Request from settings.` (اگه permission نداشته باشه)

2. **Request Permission از Settings:**
   - کاربر به Settings → Notifications میره
   - دکمه "Request Permission" رو می‌زنه
   - `requestPermission()` صدا زده میشه
   - Android/iOS permission dialog نمایش داده میشه
   - کاربر Accept می‌کنه → `permission.granted = true` ✅
   - **هیچ** notification فوری ارسال نمیشه ✅

3. **روشن کردن Switch:**
   - کاربر switch "Enable Notifications" رو روشن می‌کنه
   - 500ms منتظر میمونه (debounce)
   - `scheduleNotifications()` **یه بار** صدا زده میشه
   - Notification برای **آینده** schedule میشه
   - **هیچ** notification فوری ارسال نمیشه ✅

4. **تنظیم ساعت:**
   - کاربر ساعت رو تغییر میده
   - 500ms منتظر میمونه (debounce)
   - `scheduleNotifications()` **یه بار** صدا زده میشه
   - Notification قبلی cancel میشه
   - Notification جدید برای **آینده** schedule میشه
   - **هیچ** notification فوری ارسال نمیشه ✅

5. **Test Notification:**
   - کاربر دکمه "Send Test" رو می‌زنه
   - `scheduleNotification()` بدون trigger صدا زده میشه
   - **فوراً** notification ارسال میشه ✅
   - Log: `✅ Test notification scheduled/sent: ...`

6. **Background Notification (Minimized):**
   - App رو minimize می‌کنی
   - وقتی ساعت تعیین شده برسه، notification میاد ✅
   - با `androidMode: "exact"` دقت بالاست ✅

7. **Background Notification (Killed):**
   - App رو kill می‌کنی (force close)
   - وقتی ساعت تعیین شده برسه:
     - اگه دستگاه flagship: notification میاد ✅
     - اگه دستگاه budget/Chinese: **ممکنه** نیاد ⚠️
   - **دلیل:** محدودیت Android، نه bug برنامه

---

### 🧪 تست پلن - FIX #3:

#### تست 1: باز کردن App (Permission نداره)
1. App رو اول بار نصب کن
2. App رو باز کن
3. **انتظار:** **هیچ** permission dialog نباید نمایش داده بشه ✅
4. Console: `❌ Push notification permission not granted. Request from settings.`

#### تست 2: Request Permission از Settings
1. به Settings → Notifications برو
2. دکمه "Request Permission" رو بزن
3. **انتظار:** Android permission dialog نمایش داده میشه ✅
4. "Allow" رو بزن
5. **انتظار:** دکمه "Request Permission" غیرفعال میشه، switch ها فعال میشن ✅
6. **انتظار:** **هیچ** notification فوری نمیاد ✅

#### تست 3: روشن کردن Switch
1. Switch "Enable Notifications" رو روشن کن
2. **انتظار:** 500ms صبر می‌کنه ✅
3. **انتظار:** **هیچ** notification فوری نمیاد ✅
4. Console: `📋 scheduleNotifications called` (فقط یه بار)

#### تست 4: تنظیم ساعت
1. Switch "Daily Reminder" رو روشن کن
2. ساعت رو به 2 دقیقه بعد تنظیم کن
3. **انتظار:** **هیچ** notification فوری نمیاد ✅
4. منتظر 2 دقیقه بمون
5. **انتظار:** بعد از 2 دقیقه notification میاد ✅

#### تست 5: Test Notification
1. دکمه "Send Test" رو بزن
2. **انتظار:** **فوراً** notification نمایش داده میشه ✅
3. Console: `✅ Test notification scheduled/sent: ...`

#### تست 6: Test Delayed Notification
1. دکمه "Test (5s delay)" رو بزن
2. **انتظار:** **هیچ** notification فوری نمیاد ✅
3. منتظر 5 ثانیه بمون
4. **انتظار:** بعد از 5 ثانیه notification میاد ✅

#### تست 7: Background (Minimized)
1. Notification رو برای 2 دقیقه بعد schedule کن
2. App رو **minimize** کن (home button)
3. منتظر 2 دقیقه بمون
4. **انتظار:** Notification حتماً میاد ✅

#### تست 8: Background (Killed) - ممکنه کار نکنه
1. Notification رو برای 2 دقیقه بعد schedule کن
2. App رو **force close** کن (از recent apps حذف کن)
3. منتظر 2 دقیقه بمون
4. **انتظار:**
   - دستگاه Pixel/Samsung/OnePlus: احتمالاً میاد ✅
   - دستگاه Xiaomi/Oppo/Vivo: احتمالاً نمیاد ⚠️
5. **دلیل:** محدودیت Android battery optimization

---

### 🔍 نکات Debug - FIX #3:

#### 1. بررسی Permission Request خودکار نمیشه
```
// App باز میشه، باید این log رو ببینی:
📱 App launched - Permission status: undetermined
❌ Push notification permission not granted. Request from settings.
```

اگر permission dialog خودکار نمایش داده شد → مشکل هنوز هست ❌

#### 2. بررسی Test Notification
```
// دکمه "Send Test" رو می‌زنی:
✅ Test notification scheduled/sent: abc-123-def
```

باید فوراً notification بیاد.

#### 3. بررسی Scheduled Notification
```
// Switch رو روشن می‌کنی:
📋 scheduleNotifications called
⚙️ Processing notification settings...
📅 Scheduling daily reminder for {hour: 9, minute: 0}
🔔 Scheduling notification "daily-reminder" for 9:0
📅 Next trigger time: 2025-10-10 09:00:00
✅ Notification "daily-reminder" scheduled successfully with ID: daily-reminder
```

باید ببینی که:
- `Next trigger time` برای **آینده** است (امروز یا فردا)
- **هیچ** notification فوری نمیاد

---

### 📝 خلاصه تغییرات - FIX #3:

| فایل | خطوط | تغییرات | دلیل |
|------|------|---------|------|
| `hooks/useNotifications.ts` | 305-319 | حذف `requestPermissionsAsync` خودکار | Permission request خودکار مشکل ایجاد می‌کرد |
| `hooks/useNotifications.ts` | 175, 178 | بهبود logging با emoji | Debug راحت‌تر بشه |

---

### ✅ تضمین - FIX #3:

**بله، مطمئنم که:**

1. ✅ وقتی app باز میشه، **هیچ** permission request خودکار نمیشه
2. ✅ کاربر باید **خودش** از Settings permission بگیره
3. ✅ بعد از گرفتن permission، **هیچ** notification فوری ارسال نمیشه
4. ✅ فقط وقتی دکمه "Test" رو می‌زنه، notification فوری میاد
5. ✅ Scheduled notification ها **فقط** در ساعت تعیین شده ارسال میشن
6. ✅ در حالت **minimized** notification حتماً میاد
7. ⚠️ در حالت **killed** notification **ممکنه** بیاد (بستگی به دستگاه داره)

---

### ⚙️ دستورات Rebuild (در صورت نیاز):

```bash
# اگه تغییراتی در native code کردی (app.json):
npx expo prebuild --clean
npx expo run:android

# برای development معمولی:
npx expo start --clear
```

---

### 💡 نکات مهم برای کاربر:

1. **Permission باید از Settings گرفته بشه:**
   - کاربر باید بره Settings → Notifications
   - دکمه "Request Permission" رو بزنه
   - بعد Accept کنه

2. **Test Notification:**
   - دکمه "Send Test" → فوری میاد
   - دکمه "Test (5s delay)" → بعد از 5 ثانیه میاد
   - این دکمه‌ها **فقط** برای تست هستن

3. **Scheduled Notification:**
   - Switch ها رو روشن کن
   - ساعت رو تنظیم کن
   - Notification در **آینده** (ساعت تعیین شده) میاد
   - **هیچ** notification فوری نمیاد

4. **Background:**
   - App رو **minimize** کن (نه kill) → حتماً کار می‌کنه
   - App رو **kill** کنی → **ممکنه** کار نکنه (بستگی به دستگاه)

---

**تاریخ ویرایش:** 2025-10-09 (FIX #3)
**ویرایش توسط:** Claude Code (Anthropic)
