import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useHabitStore } from '@/store/habitStore';
import { useSettingsStore } from '@/store/settingsStore';

export interface ExportData {
  version: string;
  exportDate: string;
  habits: any[];
  history: any;
  settings: any;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: ExportData;
}

class ExportService {
  private readonly EXPORT_VERSION = '1.0.0';

  // جمع‌آوری همه داده‌ها برای export
  private gatherExportData(): ExportData {
    const habitStore = useHabitStore.getState();
    const settingsStore = useSettingsStore.getState();

    return {
      version: this.EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      habits: habitStore.habits,
      history: habitStore.history,
      settings: {
        theme: settingsStore.theme,
        language: settingsStore.language,
        notifications: settingsStore.notifications,
      },
    };
  }

  // تولید نام فایل با تاریخ
  private generateFileName(format: 'json' | 'csv'): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    return `masir-backup-${dateStr}.${format}`;
  }

  // Export به JSON format
  async exportToJSON(): Promise<{ success: boolean; message: string }> {
    try {
      const data = this.gatherExportData();
      const jsonContent = JSON.stringify(data, null, 2);
      const fileName = this.generateFileName('json');

      // ایجاد فایل در cache directory
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      // اشتراک‌گذاری فایل
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Masir Data',
        });
        return { success: true, message: 'Data exported successfully' };
      } else {
        return { success: false, message: 'Sharing not available on this device' };
      }
    } catch (error) {
      console.error('Export JSON error:', error);
      return { success: false, message: 'Failed to export data' };
    }
  }

  // Export به CSV format (برای Excel)
  async exportToCSV(): Promise<{ success: boolean; message: string }> {
    try {
      const data = this.gatherExportData();
      let csvContent = '';

      // Header
      csvContent += 'Date,Habit Name,Category,Completed,Mood,Note\n';

      // داده‌های تاریخی
      Object.entries(data.history).forEach(([date, entry]: [string, any]) => {
        const mood = entry?.mood || '';
        const note = entry?.note || '';

        if (entry?.completedHabits) {
          entry.completedHabits.forEach((habitId: string) => {
            const habit = data.habits.find(h => h.id === habitId);
            if (habit) {
              csvContent += `${date},"${habit.name}","${habit.category}",Yes,"${mood}","${note.replace(/"/g, '""')}"\n`;
            }
          });
        }

        // عادت‌های انجام نشده
        data.habits.forEach(habit => {
          if (!entry?.completedHabits?.includes(habit.id)) {
            csvContent += `${date},"${habit.name}","${habit.category}",No,"${mood}","${note.replace(/"/g, '""')}"\n`;
          }
        });
      });

      const fileName = this.generateFileName('csv');
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Masir Data (CSV)',
        });
        return { success: true, message: 'CSV data exported successfully' };
      } else {
        return { success: false, message: 'Sharing not available on this device' };
      }
    } catch (error) {
      console.error('Export CSV error:', error);
      return { success: false, message: 'Failed to export CSV data' };
    }
  }

  // Import JSON data
  async importFromJSON(): Promise<ImportResult> {
    try {
      // انتخاب فایل
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return { success: false, message: 'Import cancelled' };
      }

      // خواندن فایل
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importData: ExportData = JSON.parse(fileContent);

      // اعتبارسنجی
      const validation = this.validateImportData(importData);
      if (!validation.success) {
        return validation;
      }

      // اعمال داده‌ها
      await this.applyImportData(importData);

      return {
        success: true,
        message: 'Data imported successfully',
        data: importData,
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: 'Failed to import data. Please check file format.',
      };
    }
  }

  // اعتبارسنجی داده‌های import
  private validateImportData(data: any): ImportResult {
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid file format' };
    }

    if (!data.version) {
      return { success: false, message: 'Missing version information' };
    }

    if (!data.habits || !Array.isArray(data.habits)) {
      return { success: false, message: 'Invalid habits data' };
    }

    if (!data.history || typeof data.history !== 'object') {
      return { success: false, message: 'Invalid history data' };
    }

    return { success: true, message: 'Validation passed' };
  }

  // اعمال داده‌های import شده
  private async applyImportData(data: ExportData): Promise<void> {
    const habitStore = useHabitStore.getState();
    const settingsStore = useSettingsStore.getState();

    // بازیابی عادت‌ها
    habitStore.habits.splice(0, habitStore.habits.length, ...data.habits);

    // بازیابی تاریخچه
    Object.keys(habitStore.history).forEach(key => {
      delete habitStore.history[key];
    });
    Object.assign(habitStore.history, data.history);

    // بازیابی تنظیمات (اختیاری)
    if (data.settings) {
      if (data.settings.theme) {
        settingsStore.setTheme(data.settings.theme);
      }
      if (data.settings.language) {
        settingsStore.setLanguage(data.settings.language);
      }
      if (data.settings.notifications) {
        settingsStore.setNotifications(data.settings.notifications);
      }
    }
  }

  // پاک کردن cache files
  async cleanupTempFiles(): Promise<void> {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        const files = await FileSystem.readDirectoryAsync(cacheDir);
        const backupFiles = files.filter(file => file.startsWith('masir-backup-'));

        for (const file of backupFiles) {
          await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export const exportService = new ExportService();
export default exportService;