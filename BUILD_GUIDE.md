# 📱 راهنمای Build و Deploy - اپ مسیر

این راهنما برای ساخت فایل APK و انتشار در F-Droid نوشته شده.

## 🚀 قدم اول: آماده‌سازی پروژه

### 1. بررسی وابستگی‌ها
```bash
npm install
# یا
yarn install
```

### 2. تست کردن پروژه
```bash
npm start
# یا
expo start
```

## 📦 ساخت APK برای تست شخصی (EAS Workflows - جدید)

### مرحله 1: پیش‌نیازها

#### 1. اکانت Expo (اگه نداری):
```bash
# ثبت نام در expo.dev
```

#### 2. Sync با EAS:
```bash
npx eas-cli@latest init
```

#### 3. ساخت eas.json:
```bash
touch eas.json && echo "{}" > eas.json
```

### مرحله 2: ساخت Workflow

#### 1. ساخت دایرکتوری:
```bash
mkdir -p .eas/workflows
```

#### 2. ساخت فایل workflow:
```bash
touch .eas/workflows/create-production-builds.yml
```

#### 3. محتوای فایل workflow:
```yaml
# .eas/workflows/create-production-builds.yml
name: Create Production Builds

jobs:
  build_android:
    type: build
    params:
      platform: android
```

### مرحله 3: اجرای Build

#### اجرای workflow:
```bash
npx eas-cli@latest workflow:run create-production-builds.yml
```

## 📦 روش سنتی EAS Build (اگه workflow کار نکرد)

#### نصب EAS CLI:
```bash
npm install -g @expo/eas-cli
```

#### لاگین به Expo:
```bash
eas login
```

#### پیکربندی EAS:
```bash
eas build:configure
```

#### ساخت APK:
```bash
# برای تست (development build)
eas build --platform android --profile development

# برای انتشار (production build)
eas build --platform android --profile production
```

## 🔧 تنظیمات مهم برای Production

### 1. بررسی app.json یا app.config.js:
```json
{
  "expo": {
    "name": "مسیر - ردیاب عادت",
    "slug": "masir-habit-tracker",
    "version": "1.0.0",
    "platforms": ["android"],
    "android": {
      "package": "com.yourname.masir",
      "versionCode": 1,
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "buildToolsVersion": "34.0.0"
    }
  }
}
```

### 2. حذف کدهای توسعه:
```typescript
// در app/(tabs)/index.tsx
// این خطوط رو کامنت کن یا حذف کن:
// import { clearTestData, loadTestData } from "@/utils/testData";

// و بخش test data buttons رو هم:
// {__DEV__ && (
//   <View style={styles.testDataControls}>
//     ...
//   </View>
// )}
```

## 🏪 آماده‌سازی برای F-Droid

### 1. تبدیل به Pure React Native:
F-Droid فقط open-source و بدون وابستگی به Google Services رو قبول می‌کنه.

#### بررسی وابستگی‌های مشکل‌ساز:
```bash
# چک کن ببین کدوم پکیج‌ها Google Services دارن
npm list | grep -i google
```

#### جایگزین‌های احتمالی:
- `expo-notifications` → استفاده از native notifications
- `expo-analytics` → حذف یا جایگزین open-source
- `expo-ads` → حذف کامل

### 2. ساخت Standalone APK:
```bash
# اول ejected کن
expo eject

# سپس با React Native CLI
cd android
./gradlew assembleRelease
```

### 3. آماده‌سازی metadata برای F-Droid:

#### ساخت فولدر metadata:
```
metadata/
├── fa/
│   ├── title.txt          # "مسیر - ردیاب عادت"
│   ├── short_description.txt
│   ├── full_description.txt
│   └── summary.txt
├── en/
│   ├── title.txt          # "Masir - Habit Tracker"
│   ├── short_description.txt
│   ├── full_description.txt
│   └── summary.txt
└── screenshots/
    ├── fa/
    └── en/
```

### 4. فایل fastlane (اختیاری):
```ruby
# fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Build APK for F-Droid"
  lane :fdroid do
    gradle(
      task: "assembleRelease",
      project_dir: "android/"
    )
  end
end
```

## 🔐 امضای APK

### 1. ساخت Keystore:
```bash
keytool -genkey -v -keystore masir-release-key.keystore -alias masir -keyalg RSA -keysize 2048 -validity 10000
```

### 2. تنظیم gradle.properties:
```properties
MYAPP_RELEASE_STORE_FILE=masir-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=masir
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

## 📋 چک‌لیست قبل از انتشار

- [ ] حذف console.log ها
- [ ] حذف test data و dev buttons
- [ ] بررسی permissions در AndroidManifest.xml
- [ ] تست کامل روی دستگاه فیزیکی
- [ ] بررسی عملکرد بدون اینترنت
- [ ] تست RTL/LTR switching
- [ ] بررسی تقویم جلالی/میلادی

## 🚀 انتشار در F-Droid

### 1. Fork کردن F-Droid Data Repository:
```bash
git clone https://gitlab.com/fdroid/fdroiddata.git
```

### 2. ساخت فایل metadata:
```yaml
# metadata/com.yourname.masir.yml
Categories:
  - Sports & Health
  - Time

License: GPL-3.0-or-later
SourceCode: https://github.com/yourusername/masir
IssueTracker: https://github.com/yourusername/masir/issues

AutoName: Masir
Summary: Persian habit tracker with Jalaali calendar

Description: |
    مسیر یک برنامه ردیابی عادت فارسی است که از تقویم جلالی پشتیبانی می‌کند.

    Features:
    * Persian/English language support
    * Jalaali calendar integration
    * Habit tracking with progress charts
    * Mood tracking and micro-journaling
    * RTL/LTR layout support

RepoType: git
Repo: https://github.com/yourusername/masir

Builds:
  - versionName: '1.0.0'
    versionCode: 1
    commit: v1.0.0
    subdir: android/app
    gradle:
      - yes
```

### 3. ارسال Merge Request:
```bash
# در fdroiddata repository
git checkout -b add-masir-app
git add metadata/com.yourname.masir.yml
git commit -m "Add Masir habit tracker app"
git push origin add-masir-app
```

## 🔧 نکات مهم

### برای F-Droid:
- کد باید 100% open-source باشه
- بدون Google Services
- بدون tracking یا analytics
- فقط از F-Droid approved libraries استفاده کن

### برای APK شخصی:
- می‌تونی همه features رو نگه داری
- EAS Build راحت‌تره
- کیفیت بالاتر داره

## 📞 کمک بیشتر

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [F-Droid Inclusion Guide](https://f-droid.org/docs/Inclusion_Policy/)
- [React Native Release Guide](https://reactnative.dev/docs/signed-apk-android)

---

**⚠️ نکته:** قبل از F-Droid، حتماً APK رو روی چند تا گوشی مختلف تست کن!