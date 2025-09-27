import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

interface MoodSelectorProps {
  selectedMood: 'good' | 'ok' | 'bad' | null;
  onMoodSelect: (mood: 'good' | 'ok' | 'bad' | null) => void;
  size?: 'small' | 'medium' | 'large';
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  size = 'medium'
}) => {
  const { t } = useTranslation();

  const moodOptions = [
    {
      id: 'good' as const,
      emoji: '😊',
      label: t('mood.good'),
      colors: ['#4CAF50', '#8BC34A'],
      borderColor: '#4CAF50',
    },
    {
      id: 'ok' as const,
      emoji: '😐',
      label: t('mood.ok'),
      colors: ['#FF9800', '#FFC107'],
      borderColor: '#FF9800',
    },
    {
      id: 'bad' as const,
      emoji: '😔',
      label: t('mood.bad'),
      colors: ['#9C27B0', '#E91E63'],
      borderColor: '#9C27B0',
    },
  ];

  const sizeConfig = {
    small: { container: 40, emoji: 16, text: 10 },
    medium: { container: 56, emoji: 24, text: 12 },
    large: { container: 72, emoji: 32, text: 14 },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View style={styles.moodContainer}>
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => {
                console.log('Mood selected:', mood.id);
                onMoodSelect(mood.id);
              }}
              style={[
                styles.moodButton,
                {
                  width: config.container,
                  height: config.container,
                  borderColor: isSelected ? mood.borderColor : 'transparent',
                  borderWidth: isSelected ? 3 : 0,
                  transform: [{ scale: isSelected ? 1.1 : 1 }],
                }
              ]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isSelected ? mood.colors : ['#f5f5f5', '#e0e0e0']}
                style={[styles.gradientBackground, { borderRadius: config.container / 2 }]}
              >
                <Text style={[styles.moodEmoji, { fontSize: config.emoji }]}>
                  {mood.emoji}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedMood && (
        <Text style={[styles.selectedMoodText, { fontSize: config.text + 2 }]}>
          {moodOptions.find(m => m.id === selectedMood)?.label}
        </Text>
      )}

      {selectedMood && (
        <TouchableOpacity
          onPress={() => onMoodSelect(null)}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>{t('mood.clear')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  moodButton: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    textAlign: 'center',
  },
  selectedMoodText: {
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default MoodSelector;