import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Surface, Chip, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '@/store/habitStore';
import { router } from 'expo-router';

export default function JournalHistoryScreen() {
  const { t } = useTranslation();
  const { history } = useHabitStore();

  // Filter entries that have notes
  const entriesWithNotes = Object.entries(history || {})
    .filter(([_, entry]) => entry?.note && entry.note.trim().length > 0)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case 'good': return '😊';
      case 'ok': return '😐';
      case 'bad': return '😔';
      default: return '📝';
    }
  };

  const getMoodColor = (mood: string | null) => {
    switch (mood) {
      case 'good': return '#4CAF50';
      case 'ok': return '#FF9800';
      case 'bad': return '#9C27B0';
      default: return '#666';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <Surface style={[styles.header, styles.whiteCard]} elevation={4}>
          <Text variant="headlineMedium" style={styles.title}>
            📖 {t('journalHistory.title')}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {t('journalHistory.subtitle')}
          </Text>
        </Surface>

        {entriesWithNotes.length === 0 ? (
          <Card style={[styles.emptyCard, styles.whiteCard]} mode="elevated">
            <Card.Content style={styles.emptyContent}>
              <Text variant="headlineSmall" style={styles.emptyIcon}>📝</Text>
              <Text variant="titleLarge" style={styles.emptyTitle}>
                {t('journalHistory.noNotesYet')}
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {t('journalHistory.noNotesDescription')}
              </Text>
              <Button
                mode="contained"
                onPress={() => router.back()}
                style={styles.backButton}
              >
                {t('journalHistory.backToMain')}
              </Button>
            </Card.Content>
          </Card>
        ) : (
          entriesWithNotes.map(([date, entry]) => (
            <Card key={date} style={[styles.entryCard, styles.whiteCard]} mode="elevated">
              <Card.Content>
                <View style={styles.entryHeader}>
                  <View style={styles.dateSection}>
                    <Text variant="bodySmall" style={styles.dateText}>
                      {formatDate(date)}
                    </Text>
                    <Chip
                      icon={() => <Text>{getMoodEmoji(entry.mood)}</Text>}
                      style={[styles.moodChip, { backgroundColor: getMoodColor(entry.mood) + '20' }]}
                      textStyle={{ color: getMoodColor(entry.mood) }}
                    >
                      {entry.mood ? t(`mood.${entry.mood}`) : t('journalHistory.noMood')}
                    </Chip>
                  </View>
                </View>

                <Text variant="bodyLarge" style={styles.noteText}>
                  &ldquo;{entry.note}&rdquo;
                </Text>

                {entry.completedHabits && entry.completedHabits.length > 0 && (
                  <View style={styles.habitsSection}>
                    <Text variant="bodySmall" style={styles.habitsLabel}>
                      {t('journalHistory.completedHabits')}: {entry.completedHabits.length}
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyCard: {
    margin: 16,
    marginTop: 40,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 20,
  },
  entryCard: {
    margin: 16,
    marginTop: 0,
  },
  entryHeader: {
    marginBottom: 12,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    opacity: 0.7,
    fontSize: 13,
  },
  moodChip: {
    height: 28,
  },
  noteText: {
    lineHeight: 24,
    fontStyle: 'italic',
    color: '#2d3748',
    marginBottom: 12,
  },
  habitsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
  },
  habitsLabel: {
    opacity: 0.6,
    fontSize: 12,
  },
});