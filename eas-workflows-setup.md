# 🚀 راهنمای تنظیم Auto Build

## EAS Workflows (توصیه شده):

1. **فعال کردن:**
```bash
npx eas-cli@latest workflow:configure
```

2. **چک کردن وضعیت:**
```bash
npx eas-cli@latest workflow:list
```

3. **اجرای دستی (تست):**
```bash
npx eas-cli@latest workflow:run create-production-builds.yml
```

## GitHub Actions (آلترناتیو):

1. **تنظیم Secret:**
   - برو به GitHub repo > Settings > Secrets
   - اضافه کن: `EXPO_TOKEN` = expo token تو

2. **گرفتن Expo Token:**
```bash
expo login
expo whoami --token
```

## 🎯 نتیجه:
- هر push به main = auto build
- APK آماده در چند دقیقه
- لینک دانلود در نتایج build

## 📋 بررسی build:
- EAS: https://expo.dev/accounts/arashzich/projects/Masir/builds
- GitHub: Actions tab در repo