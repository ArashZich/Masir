# 🗺️ مسیر (Masir) - همراه مهربان در مسیر خودسازی

> نه یک habit tracker، بلکه یک life companion 💚

## 🎯 فلسفه و هدف

**مسیر** برنامه‌ای است که با شما در سفر خودسازی همراه می‌شود. برخلاف habit tracker های معمولی که فوکوس روی "موفقیت و شکست" دارند، مسیر بر **تجربه روزانه** تمرکز می‌کند.

### 💭 تفاوت ما:
- **به جای** "آیا عادتت رو انجام دادی؟" ✅❌
- **می‌پرسیم** "چطور بود امروزت؟" 😊😐😔

### 🌱 فلسفه کلیدی:
- **مسیر همیشه بالا و پایین داره** - شکست وجود نداره
- **رشد مثل باغچه** - تدریجی و طبیعی
- **mood اول، عادت دوم** - حالت روحی مهم‌تر از تیک‌لیست
- **یک جمله کافیه** - micro-journal برای ثبت تجربه

## ✨ ویژگی‌های منحصر به فرد

### 🧠 **Mood-Based System**
- روزانه mood خود را ثبت کنید (😊 خوب / 😐 متوسط / 😔 نه چندان)
- یک جمله کوتاه از روزتان بنویسید
- تجربه انسانی‌تر به جای binary thinking

### 🌱 **Garden Growth Metaphor**
- هر عادت مثل یک گیاه در باغچه شما
- 5 مرحله رشد: بذر → جوانه → برگ → غنچه → گل
- نمایش بصری پیشرفت به جای numbers

### 📊 **Smart Analytics**
- نمودارهای Line/Bar/Pie برای روند پیشرفت
- Streak calculation و success rate
- Monthly insights و بهترین/بدترین روزها
- پیام‌های هوشمند و تشویقی

### 📅 **Jalaali/Gregorian Calendar**
- تقویم هوشمند براساس زبان (جلالی برای فارسی، میلادی برای انگلیسی)
- نمایش تاریخ‌های صحیح در تمام بخش‌ها
- پشتیبانی کامل از RTL/LTR direction
- تقویم جلالی سفارشی با `moment-jalaali`

### 🎨 **Gentle UI/UX**
- رنگ‌های ملایم و دوستانه
- انیمیشن‌های نرم با haptic feedback
- پیام‌های تشویقی به جای قضاوت
- Material Design 3 consistency

## 🛠️ تکنولوژی‌ها

- **Framework:** React Native (Expo ~54)
- **UI Library:** React Native Paper 5.14 (Material Design 3)
- **State Management:** Zustand 5.0 با persist
- **Storage:** AsyncStorage 2.2
- **Internationalization:** i18next 25.5 + react-i18next 15.7
- **Charts:** react-native-chart-kit 6.12
- **Calendar:** react-native-modern-datepicker 1.0 + jalaliday 3.1
- **Date Management:** dayjs 1.11 با jalaliday plugin
- **Direction:** RTL/LTR با I18nManager
- **Animations:** React Native Reanimated 4.1
- **Notifications:** expo-notifications 0.32
- **Haptics:** expo-haptics 15.0

## 🚀 نصب و راه‌اندازی

```bash
# کلون کردن پروژه
git clone https://github.com/ArashZich/Masir.git
cd Masir

# نصب dependencies
npm install

# اجرای پروژه
npm start
```

## 📱 صفحات اصلی

### 🏠 **صفحه اصلی (مسیر امروز)**
- انتخاب mood روزانه
- نوشتن micro-journal
- نمایش باغچه عادت‌ها
- progress overview

### 📊 **صفحه آمار (نمای کلی)**
- Calendar با نمایش mood و پیشرفت
- نمودارهای تحلیلی (هفتگی/ماهانه)
- Monthly insights و آمار
- Streak analytics

### ⚙️ **تنظیمات**
- تغییر زبان (فارسی/انگلیسی)
- تغییر theme (روشن/تاریک/سیستم)
- Export/Import داده‌ها (آینده)

## 🌟 ویژگی‌های نسخه 1.0.0 (100% کامل)

### ✅ **Core Features:**
- [x] Core architecture با TypeScript
- [x] Mood-based system کامل
- [x] Garden growth visualization (5 stages)
- [x] Smart charts و analytics
- [x] دوزبانه کامل فارسی/انگلیسی (RTL/LTR)
- [x] Material Design 3 consistency
- [x] Smooth animations + haptics
- [x] Dark mode کامل (light/dark/system)

### ✅ **Advanced Features:**
- [x] Notifications system (daily/mood/habit reminders)
- [x] Export/Import داده‌ها (JSON/CSV)
- [x] Interactive Jalaali/Gregorian calendar
- [x] Monthly insights و streak analytics
- [x] Mood distribution charts
- [x] Test data generator برای development

### 🔮 **آینده:**
- [ ] Home screen widget
- [ ] Onboarding screens
- [ ] Habit categories

## 🎨 طراحی و رنگ‌بندی

```typescript
// Color Palette
PRIMARY: '#667eea'      // آبی اصلی
SUCCESS: '#52c41a'      // سبز موفقیت
BACKGROUND: '#ffffff'   // پس‌زمینه سفید
MOOD_GOOD: '#4CAF50'    // سبز ملایم
MOOD_OK: '#FF9800'      // نارنجی گرم
MOOD_BAD: '#9C27B0'     // بنفش نرم
```

## 🔄 Development Commands

```bash
# Development
npm start              # شروع development server
npm run android        # اجرا روی اندروید
npm run ios           # اجرا روی iOS

# Code Quality
npm run lint          # بررسی کد
expo lint            # لینت expo

# Build
eas build --platform android
eas build --platform ios
```

## 📂 ساختار پروژه

```
/app                    # صفحات (Expo Router)
├── /(tabs)/
│   ├── index.tsx       # صفحه اصلی
│   ├── analytics.tsx   # آمار و تحلیل
│   └── settings.tsx    # تنظیمات
/components             # UI Components (مرتب شده)
├── /ui/                # کامپوننت‌های عمومی
├── /habit/             # مربوط به عادت‌ها
├── /mood/              # انتخاب mood و journal
├── /charts/            # نمودارها
└── /garden/            # نمایش رشد باغچه
/screens               # بخش‌های پیچیده صفحات
├── /analytics/        # کامپوننت‌های صفحه آمار
└── /settings/         # کامپوننت‌های تنظیمات
/constants             # ثابت‌های پروژه
├── colors.ts          # رنگ‌ها
├── dimensions.ts      # اندازه‌ها
└── settings.ts        # گزینه‌های تنظیمات
/styles                # فایل‌های استایل جدا
/store                 # Zustand stores
├── habitStore.ts      # مدیریت عادت‌ها
└── settingsStore.ts   # تنظیمات
/utils                 # Helper functions
└── analytics.ts       # تحلیل داده‌ها
/locales               # ترجمه‌ها
├── fa.json            # فارسی
└── en.json            # انگلیسی
```

## 🤝 مشارکت در پروژه

این پروژه open-source است و از مشارکت شما استقبال می‌کنیم:

1. **Fork** کنید
2. **Feature branch** بسازید
3. **Commit** کنید با پیام واضح
4. **Pull Request** ارسال کنید

### 🎯 Areas برای مشارکت:
- [ ] Widget development
- [ ] Onboarding screens
- [ ] Habit categories
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Unit testing

## 📈 Vision & Roadmap

### **✅ نسخه 1.0.0 (Production Ready):**
- ✅ Mood-based system
- ✅ Garden growth visualization
- ✅ Smart analytics & charts
- ✅ Jalaali/Gregorian calendar
- ✅ Dark mode complete
- ✅ Notifications
- ✅ Export/Import

### **🔮 آینده:**
- 📱 Home screen widget
- 🎓 Onboarding screens
- 🏷️ Habit categories

## 💚 Philosophy in Action

> "هر روز، یک قدم. هر قدم، یک تجربه. هر تجربه، بخشی از مسیر."

مسیر تنها یک اپلیکیشن نیست، بلکه **همراهی مهربان** در سفر خودسازی شماست.

---

**ساخته شده توسط [آرش](https://github.com/ArashZich)**

*"مسیر همیشه بالا و پایین داره - مهم اینه که راه رو ادامه بدی"* 🌱