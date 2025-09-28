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

#### **🌍 Design System (100%)**
- ✅ **Color scheme:** `#667eea` primary, `#52c41a` success, `#ffffff` background
- ✅ **Card pattern:** همه سفید، elevation 4، margin 16
- ✅ **Typography:** React Native Paper variants
- ✅ **Spacing:** یکسان در همه جا
- ✅ **Animations:** Reanimated + Haptics

---

## 🚀 پیشرفت اخیر (Dark Mode System)

### **🎨 ویژگی‌های جدید اضافه شده:**

1. **ThemeContext System:**
   - Context مدیریت تم با light/dark/system modes
   - Color palette کامل برای هر دو حالت
   - Automatic system theme detection
   - Settings persistence با Zustand

2. **Component Theming:**
   - همه کامپوننت‌ها با theme سازگار
   - ThemedCard component جدید
   - Calendar با پشتیبانی کامل از تم‌ها
   - Elevation levels برای dark theme

3. **App-wide Integration:**
   - همه صفحات با theme سازگار
   - Settings UI برای تغییر تم
   - Dynamic color updates
   - TypeScript type safety کامل

### **📦 New Files Created:**
```
/contexts/ThemeContext.tsx    # Theme management context
/components/ThemedCard.tsx    # Themed card component
```

### **📊 Charts System (قبلاً کامل شده):**
- ProgressChart Component با Line/Bar/Pie charts
- Analytics service و monthly insights
- Smart messages و mood distribution

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

## 📋 اولویت‌بندی کارهای بعدی

### **فاز A - Core Features (✅ کامل شد)**
1. ✅ **Export/Import** - JSON/CSV export + file operations
2. ✅ **Interactive Calendar** - tap functionality + modal
3. ✅ **Dark Mode** - theme system کامل

### **فاز B - Polish & Advanced (اختیاری)**
4. 🏷️ **Categories** - habit organization
5. 📱 **Widget** - home screen widget
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
✅ **Dark Mode System** کامل شد:
- ThemeContext با light/dark/system modes
- Color system کامل برای هر دو حالت
- Component theming سراسری
- Calendar theme integration
- Settings UI برای تغییر تم
- TypeScript type safety

### **🎯 گزینه‌های بعدی (اختیاری):**

#### **گزینه 1: Habit Categories 🏷️**
- **اولویت:** متوسط (organization feature)
- **زمان:** 2-3 روز
- **Dependencies:** فعلی کافی است

#### **گزینه 2: Home Screen Widget 📱**
- **اولویت:** پایین (nice to have)
- **زمان:** 3-4 روز
- **Dependencies:** expo-widgets (جدید)

---

## 🎯 Vision vs Reality

### **✅ ویژن‌های محقق شده:**
- 🧠 Mood-based system
- 📝 Micro-journal
- 🌱 Garden metaphor
- 🎨 Gentle UI/UX
- 💚 Soft philosophy

### **✅ تکمیل شده:**
- ✅ Export/Import System
- ✅ Interactive Calendar
- ✅ Dark Mode System

### **🔮 آینده:**
- 🏷️ Habit Categories
- ☁️ Cloud Sync
- 📱 Home Screen Widget
- 🧪 Unit Testing

---

**🎉 پروژه کاملاً تمام شد! 100% Core Features کامل و production-ready است.**

*آخرین commit: تکمیل Dark Mode System*
*وضعیت: همه فیچرهای اصلی تکمیل شده - آماده برای release!*

---

*بر اساس تجمیع TODO_CHECKLIST.md، PROGRESS.md، flow.md، gpt-flow.md، VISION_ANALYSIS.md*