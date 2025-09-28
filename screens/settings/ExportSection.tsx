import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, List, Divider } from 'react-native-paper';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { exportService } from '@/services/exportService';

interface ExportSectionProps {
  styles: any; // Import styles from parent
}

export const ExportSection: React.FC<ExportSectionProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const handleExportJSON = async () => {
    setExportLoading('json');
    try {
      const result = await exportService.exportToJSON();
      console.log(result.message);
    } catch (error) {
      console.error('Export JSON error:', error);
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportCSV = async () => {
    setExportLoading('csv');
    try {
      const result = await exportService.exportToCSV();
      console.log(result.message);
    } catch (error) {
      console.error('Export CSV error:', error);
    } finally {
      setExportLoading(null);
    }
  };

  const handleImport = async () => {
    setImportLoading(true);
    try {
      const result = await exportService.importFromJSON();
      console.log(result.message);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <ThemedCard elevation={1}>
      <ThemedCard.Content>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {t('backup.dataManagement')}
        </Text>
        <Text variant="bodyMedium" style={[styles.sectionDescription, { color: colors.text.secondary }]}>
          {t('backup.backupAndRestore')}
        </Text>

        {/* Export JSON */}
        <List.Item
          title={t('backup.exportJSON')}
          description={t('backup.exportJSONDesc')}
          left={(props) => <List.Icon {...props} icon="file-export" />}
          right={(props) =>
            exportLoading === 'json' ? (
              <List.Icon {...props} icon="loading" />
            ) : (
              <List.Icon {...props} icon="chevron-right" />
            )
          }
          onPress={handleExportJSON}
          disabled={exportLoading === 'json'}
          style={styles.listItem}
        />

        <Divider style={styles.listDivider} />

        {/* Export CSV */}
        <List.Item
          title={t('backup.exportCSV')}
          description={t('backup.exportCSVDesc')}
          left={(props) => <List.Icon {...props} icon="table" />}
          right={(props) =>
            exportLoading === 'csv' ? (
              <List.Icon {...props} icon="loading" />
            ) : (
              <List.Icon {...props} icon="chevron-right" />
            )
          }
          onPress={handleExportCSV}
          disabled={exportLoading === 'csv'}
          style={styles.listItem}
        />

        <Divider style={styles.listDivider} />

        {/* Import */}
        <List.Item
          title={t('backup.import')}
          description={t('backup.importDesc')}
          left={(props) => <List.Icon {...props} icon="file-import" />}
          right={(props) =>
            importLoading ? (
              <List.Icon {...props} icon="loading" />
            ) : (
              <List.Icon {...props} icon="chevron-right" />
            )
          }
          onPress={handleImport}
          disabled={importLoading}
          style={styles.listItem}
        />
      </ThemedCard.Content>
    </ThemedCard>
  );
};