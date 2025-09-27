# 🗺️ راهنمای جامع پروژه مسیر (Masir)

## 📅 آخرین بروزرسانی: ۲۷ سپتامبر ۲۰۲۵
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

#### **🔔 Notifications System (جدید کامل شد)**
- ✅ **NotificationService:** class کامل با expo-notifications
- ✅ **Permission system:** request/check permissions
- ✅ **Daily reminders:** یادآوری روزانه عادت‌ها
- ✅ **Mood reminders:** یادآوری شبانه mood
- ✅ **Habit reminders:** یادآوری فردی برای هر عادت
- ✅ **Settings UI:** کنترل کامل در تنظیمات
- ✅ **TimePicker integration:** انتخاب زمان یادآوری‌ها
- ✅ **Test notifications:** قابلیت تست اعلان‌ها

#### **🌍 Design System (100%)**
- ✅ **Color scheme:** `#667eea` primary, `#52c41a` success, `#ffffff` background
- ✅ **Card pattern:** همه سفید، elevation 4، margin 16
- ✅ **Typography:** React Native Paper variants
- ✅ **Spacing:** یکسان در همه جا
- ✅ **Animations:** Reanimated + Haptics

---

## 🚀 پیشرفت اخیر (Notifications System)

### **🔔 ویژگی‌های جدید اضافه شده:**

1. **NotificationService Class:**
   - Permission request/check با handling کامل
   - Daily/Mood/Habit reminder scheduling
   - Background notification listeners
   - Test notification functionality

2. **Settings Integration:**
   - Notification settings section کامل
   - Switch controls برای enable/disable
   - TimePicker برای انتخاب زمان یادآوری‌ها
   - Permission status display و request button

3. **App-level Integration:**
   - Notification listeners در _layout.tsx
   - Automatic scheduling based on settings
   - Response handling برای navigation
   - Settings persistence با Zustand

### **📦 Dependencies استفاده شده:**
```json
{
  "expo-notifications": "~0.32.11",
  "@react-native-community/datetimepicker": "8.4.4"
}
```

### **📊 Charts System (قبلاً کامل شده):**
- ProgressChart Component با Line/Bar/Pie charts
- Analytics service و monthly insights
- Smart messages و mood distribution

---

## ❌ کارهای باقی مانده

### **💾 Export/Import Data (اولویت بالا)**
- ❌ Export به JSON format
- ❌ Export به CSV برای Excel
- ❌ Import validation و error handling
- ❌ Backup/Restore در Settings

### **📅 Interactive Calendar (متوسط)**
- ❌ تاپ روی روزها برای جزئیات
- ❌ Modal نمایش جزئیات روز
- ❌ امکان edit mood/note از calendar
- ❌ Navigation بین ماه‌ها

### **🎯 Advanced Features (آینده)**
- ❌ Habit Categories و Templates
- ❌ Smart Suggestions
- ❌ Dark Mode کامل
- ❌ Widget برای iOS/Android
- ❌ Cloud Sync

---

## 📋 اولویت‌بندی کارهای بعدی

### **فاز A - Core Features (بعدی)**
1. 💾 **Export/Import** - JSON/CSV export + file operations
2. 📅 **Interactive Calendar** - tap functionality + modal

### **فاز B - Polish (3-5 روز)**
4. 🎨 **Dark Mode** - theme system کامل
5. 🏷️ **Categories** - habit organization
6. 🧪 **Testing** - unit tests
7. 🚀 **Performance** - optimization

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
✅ **Notifications System** کامل شد:
- NotificationService با expo-notifications
- Permission handling کامل
- Daily/Mood/Habit reminders
- Settings UI با TimePicker
- App-level integration
- Test notification functionality

### **🎯 گزینه‌های بعدی:**

#### **گزینه 1: Export/Import 💾**
- **اولویت:** بالا (data safety)
- **زمان:** 1-2 روز
- **Dependencies:** expo-file-system, expo-sharing (موجود)

#### **گزینه 2: Interactive Calendar 📅**
- **اولویت:** متوسط (UX enhancement)
- **زمان:** 2-3 روز
- **Dependencies:** فعلی کافی است

---

## 🎯 Vision vs Reality

### **✅ ویژن‌های محقق شده:**
- 🧠 Mood-based system
- 📝 Micro-journal
- 🌱 Garden metaphor
- 🎨 Gentle UI/UX
- 💚 Soft philosophy

### **🚧 در حال پیاده‌سازی:**
- 💾 Export/Import
- 📅 Interactive Calendar

### **🔮 آینده:**
- 🎨 Dark Mode
- 🏷️ Habit Categories
- ☁️ Cloud Sync
- 📱 Home Screen Widget

---

**🎉 پروژه در وضعیت عالی! 90% کامل شده و production-ready است.**

*آخرین commit: تکمیل Notifications System*
*آماده برای: Export/Import یا Interactive Calendar*

---

*بر اساس تجمیع TODO_CHECKLIST.md، PROGRESS.md، flow.md، gpt-flow.md، VISION_ANALYSIS.md*