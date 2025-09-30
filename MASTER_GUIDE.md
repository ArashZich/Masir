# 🗺️ راهنمای جامع پروژه مسیر (Masir)

## 📅 آخرین بروزرسانی: ۱ اکتبر ۲۰۲۵
## 📦 نسخه: 1.0.0 (Production Ready)
## 👨‍💻 توسعه‌دهنده: آرش

---

## 🎯 فلسفه و ویژن پروژه

### **تحول از Habit Tracker به Life Companion**

**ویژن اصلی:**
- 💭 **تمرکز بر مسیر:** از "کامل/ناکامل" به "تجربه روزانه"
- 🧠 **Mood-based system:** روزانه mood ثبت کن (😊😐😔)
- 📝 **Micro-journal:** "چطور بود امروزت؟" - یک جمله کافیه
- 🌱 **Garden metaphor:** رشد مثل باغچه، نه تیک‌لیست
- 💚 **Gentle philosophy:** "مسیر همیشه بالا و پایین داره"

---

## 📊 وضعیت فعلی پروژه

### **✅ کارهای کامل شده**

#### **🏗️ Core Architecture (100%)**
- ✅ **React Native + Expo** با TypeScript کامل
- ✅ **Zustand** state management با persist
- ✅ **React Native Paper** Material Design 3
- ✅ **i18next** چندزبانگی فارسی/انگلیسی
- ✅ **AsyncStorage** برای ذخیره‌سازی
- ✅ **Expo Router** navigation مدرن

#### **🎨 UI Components (100%)**
- ✅ **MoodSelector:** انتخاب mood با gradient و ایموجی
- ✅ **MicroJournal:** یادداشت روزانه با UI دوستانه
- ✅ **GardenGrowth:** 5 مرحله رشد SVG (بذر → گل)
- ✅ **AnimatedHabitItem:** double-tap toggle + haptic feedback
- ✅ **ProgressChart:** Line/Bar/Pie charts با react-native-chart-kit
- ✅ **ThemedCard:** کامپوننت کارت با پشتیبانی کامل از تم

#### **📱 Pages (100%)**
- ✅ **Home (index.tsx):** mood + journal + garden + habits
- ✅ **Explore (explore.tsx):** calendar + charts + insights + streaks
- ✅ **Settings:** theme/language با SegmentedButtons
- ✅ **Add/Edit Habit:** فرم کامل با validation

#### **📊 Analytics & Charts (کامل شد)**
- ✅ **ProgressChart component:** Line/Bar/Pie charts
- ✅ **Analytics service:** streak calculation + insights
- ✅ **Monthly insights:** best/worst days + success rates
- ✅ **Mood distribution:** pie chart برای mood ها
- ✅ **Smart insights:** پیام‌های هوشمند بر اساس داده‌ها

#### **🔔 Notifications System (کامل شد)**
- ✅ **NotificationService:** class کامل با expo-notifications
- ✅ **Permission system:** request/check permissions
- ✅ **Daily reminders:** یادآوری روزانه عادت‌ها
- ✅ **Mood reminders:** یادآوری شبانه mood
- ✅ **Habit reminders:** یادآوری فردی برای هر عادت
- ✅ **Settings UI:** کنترل کامل در تنظیمات
- ✅ **TimePicker integration:** انتخاب زمان یادآوری‌ها
- ✅ **Test notifications:** قابلیت تست اعلان‌ها

#### **🎨 Dark Mode System (جدید کامل شد)**
- ✅ **ThemeContext:** مدیریت کامل تم با light/dark/system
- ✅ **Color system:** رنگ‌های کامل برای هر دو حالت
- ✅ **Component theming:** همه کامپوننت‌ها با theme سازگار
- ✅ **Calendar theming:** تقویم با پشتیبانی کامل از تم‌ها
- ✅ **Settings integration:** تنظیمات تم در صفحه Settings
- ✅ **Elevation levels:** سطوح elevation برای dark theme

#### **📅 Jalaali/Gregorian Calendar System (جدید کامل شد)**
- ✅ **useCalendar Hook:** مدیریت تقویم براساس زبان
- ✅ **JalaaliCalendar Component:** تقویم شمسی سفارشی
- ✅ **moment-jalaali Integration:** پشتیبانی کامل از تقویم جلالی
- ✅ **Smart Date Display:** نمایش تاریخ در صفحه اول براساس زبان
- ✅ **Calendar Modal:** مودال روزها با تاریخ صحیح
- ✅ **RTL Calendar Layout:** چیدمان درست روزها برای فارسی

#### **🔄 RTL/LTR Direction Management (کامل شد)**
- ✅ **useLanguage Hook Enhancement:** مدیریت جهت متن
- ✅ **Auto App Reload:** restart خودکار برای تغییر RTL/LTR
- ✅ **Directional Icons:** آیکون‌های smart براساس جهت
- ✅ **Calendar Navigation:** فلش‌های تقویم RTL-aware
- ✅ **I18nManager Integration:** استفاده صحیح از React Native I18nManager

#### **🔢 Number Localization (کامل شد)**
- ✅ **Persian/English Numbers:** تبدیل خودکار اعداد براساس زبان
- ✅ **ThemeContext formatNumber:** utility function برای همه جا
- ✅ **Charts Numbers:** اعداد فارسی در نمودارها
- ✅ **Stats Numbers:** اعداد فارسی در آمارها
- ✅ **Calendar Numbers:** اعداد فارسی در تقویم

#### **🌍 Design System (100%)**
- ✅ **Color scheme:** `#667eea` primary, `#52c41a` success, `#ffffff` background
- ✅ **Dark mode colors:** elevation levels + adaptive colors
- ✅ **Card pattern:** elevation-based با theme support
- ✅ **Typography:** React Native Paper variants
- ✅ **Spacing:** یکسان در همه جا
- ✅ **Animations:** Reanimated + Haptics

---

## 🚀 تغییرات نسخه 1.0.0

### **📦 Dependencies & Packages:**
```json
{
  "expo": "~54.0.10",
  "react-native-paper": "^5.14.5",
  "zustand": "^5.0.8",
  "i18next": "^25.5.2",
  "react-i18next": "^15.7.3",
  "dayjs": "^1.11.18",
  "jalaliday": "^3.1.1",
  "react-native-chart-kit": "^6.12.0",
  "react-native-modern-datepicker": "^1.0.0-beta.91",
  "expo-notifications": "~0.32.11",
  "expo-haptics": "~15.0.7",
  "react-native-reanimated": "~4.1.1"
}
```

### **📅 ویژگی‌های کلیدی نسخه 1.0.0:**

1. **Mood-Based System:**
   - انتخاب mood روزانه (😊😐😔)
   - Micro-journal برای ثبت تجربه
   - MoodSelector با gradient و haptics

2. **Garden Growth Visualization:**
   - 5 مرحله رشد: Seed → Sprout → Leaf → Bud → Flower
   - نمایش بصری پیشرفت
   - انیمیشن‌های smooth

3. **Smart Analytics:**
   - Line/Bar/Pie charts
   - Streak calculation
   - Monthly insights
   - Mood distribution
   - Best/worst days

4. **Jalaali/Gregorian Calendar:**
   - react-native-modern-datepicker
   - jalaliday plugin
   - تبدیل خودکار براساس زبان
   - RTL calendar layout

5. **Internationalization:**
   - فارسی/انگلیسی کامل
   - RTL/LTR switching
   - Persian/English numbers
   - Date localization

6. **Dark Mode:**
   - Light/Dark/System modes
   - Elevation-based colors
   - Complete theme system

7. **Notifications:**
   - Daily habit reminders
   - Mood reminders
   - Per-habit notifications
   - Custom time settings

8. **Data Management:**
   - JSON export/import
   - CSV export for Excel
   - Test data generator
   - AsyncStorage persistence

---

## ✅ فیچرهای اضافی کامل شده

### **💾 Export/Import Data (✅ کامل شد)**
- ✅ Export به JSON format
- ✅ Export به CSV برای Excel
- ✅ Import validation و error handling
- ✅ Backup/Restore در Settings

### **📅 Interactive Calendar (✅ کامل شد)**
- ✅ تاپ روی روزها برای جزئیات
- ✅ Modal نمایش جزئیات روز
- ✅ امکان edit mood/note از calendar
- ✅ Navigation بین ماه‌ها

### **🎯 Advanced Features (آینده)**
- ❌ Habit Categories و Templates
- ❌ Smart Suggestions
- ❌ Widget برای iOS/Android
- ❌ Cloud Sync

---

## 📋 وضعیت پروژه

### **✅ نسخه 1.0.0 (Production Ready)**
- ✅ همه فیچرهای اصلی کامل شدند
- ✅ Testing شده و آماده استفاده
- ✅ بدون bug های critical
- ✅ آماده برای release

### **🔮 فیچرهای احتمالی آینده:**
- 📱 **Home screen widget** - نمایش سریع عادت‌های امروز
- 🎓 **Onboarding screens** - راهنمای اولیه برای کاربران جدید
- 🏷️ **Habit categories** - دسته‌بندی عادت‌ها

---

## 🛠️ راهنمای توسعه

### **Commands مفید:**
```bash
# Development
npm start
npm run android
npm run ios

# Code Quality
npm run lint
expo lint

# Build
eas build --platform android
eas build --platform ios
```

### **Structure فایل‌ها:**
```
/app                 # Pages (Expo Router)
/components          # UI Components
/store              # Zustand stores
/utils              # Helper functions
/locales            # i18n translations
/assets             # Images, icons
```

### **Import Aliases:**
```typescript
import { Component } from '@/components/Component';
import { useStore } from '@/store/useStore';
import { helper } from '@/utils/helper';
```

---

## 🎨 Design System

### **Color Palette:**
```typescript
PRIMARY: '#667eea'      // آبی اصلی
SUCCESS: '#52c41a'      // سبز موفقیت
BACKGROUND: '#ffffff'   // پس‌زمینه سفید
TEXT: '#2d3748'        // متن اصلی
```

### **Component Patterns:**
```typescript
// Card Standard
<Card style={[styles.card, styles.whiteCard]} mode="elevated">

// Spacing Standard
margin: 16,
marginTop: 0,

// Typography
variant="titleLarge"
fontWeight: '600'
```

---

## 🔄 تغییرات اخیر

### **Charts Implementation (امروز):**
- ✅ نصب react-native-chart-kit
- ✅ ایجاد ProgressChart component
- ✅ اضافه کردن Analytics service
- ✅ بهبود explore page با charts
- ✅ حذف coming features section قدیمی

### **Store Evolution:**
```typescript
// تحول از boolean به mood-based
interface DayEntry {
  mood: 'good' | 'ok' | 'bad' | null;
  note?: string;
  completedHabits: string[];
}
```

---

## 🚀 آماده برای ادامه کار

### **📋 وضعیت امروز:**
✅ **Dark Mode System** کامل شد:
- ThemeContext با light/dark/system modes
- Color system کامل برای هر دو حالت
- Component theming سراسری
- Calendar theme integration
- Settings UI برای تغییر تم
- TypeScript type safety

### **🎯 اگر بخواهیم ادامه بدهیم:**

#### **Widget Development 📱**
- نمایش عادت‌های امروز در home screen
- نیاز به expo-widgets یا react-native-widget-kit
- تقریباً 3-4 روز کار

#### **Onboarding Screens 🎓**
- معرفی اپلیکیشن برای کاربران جدید
- استفاده از PagerView موجود
- تقریباً 2 روز کار

#### **Habit Categories 🏷️**
- دسته‌بندی عادت‌ها (سلامت، یادگیری، ...)
- فیلتر و سازماندهی بهتر
- تقریباً 2-3 روز کار

---

## 🎯 خلاصه

### **✅ ویژن‌های محقق شده:**
- 🧠 Mood-based system
- 📝 Micro-journal
- 🌱 Garden metaphor
- 🎨 Gentle UI/UX
- 💚 Soft philosophy
- 📊 Smart analytics
- 🌍 دوزبانه کامل (فارسی/انگلیسی)
- 🎨 Dark mode
- 🔔 Notifications

---

## ✅ نتیجه‌گیری

**پروژه مسیر (Masir) نسخه 1.0.0 کامل شد! 🎉**

- ✅ همه فیچرهای core پیاده‌سازی شدند
- ✅ Production ready و آماده استفاده
- ✅ تست شده و بدون bug های critical
- ✅ آماده برای release و استفاده عمومی

**وضعیت:** تکمیل شده - آماده برای انتشار

---

*آخرین بروزرسانی: ۱ اکتبر ۲۰۲۵*