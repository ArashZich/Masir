import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { useBoolean } from "@/hooks/useBoolean";

interface MicroJournalProps {
  note: string;
  onNoteChange: (note: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export const MicroJournal: React.FC<MicroJournalProps> = ({
  note,
  onNoteChange,
  placeholder,
  compact = false,
}) => {
  const { t } = useTranslation();
  const isFocused = useBoolean(false, 'journalFocus');

  const defaultPlaceholder = t("journal.placeholder");

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {!compact && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>💭 {t("journal.title")}</Text>
              <Text style={styles.subtitle}>{t("journal.subtitle")}</Text>
            </View>
            <IconButton
              icon="history"
              size={20}
              onPress={() => router.push("/journal-history")}
              style={styles.historyButton}
            />
          </View>
        </View>
      )}

      <TextInput
        mode="outlined"
        label={t("journal.placeholder")}
        value={note}
        onChangeText={(text) => {
          console.log("TextInput onChange:", text);
          onNoteChange(text);
        }}
        multiline
        numberOfLines={compact ? 2 : 3}
        style={styles.textInput}
        contentStyle={styles.textInputContent}
        onFocus={isFocused.setTrue}
        onBlur={isFocused.setFalse}
        maxLength={150}
        theme={{
          colors: {
            primary: "#667eea",
            onSurfaceVariant: "#999",
          },
        }}
      />

      {!compact && (
        <Text style={styles.characterCount}>
          {note.length}/150 {t("journal.characterCount")}
        </Text>
      )}
      {compact && (
        <View style={styles.compactFooter}>
          <Text style={styles.compactCount}>{note.length}/150</Text>
          <IconButton
            icon="history"
            size={16}
            onPress={() => router.push("/journal-history")}
            style={styles.compactHistoryButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // حذف background و border - الان Card خودش اینکارو می‌کنه
  },
  compactContainer: {
    // برای compact mode
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  historyButton: {
    margin: 0,
    marginTop: -8,
  },
  subtitle: {
    fontSize: 13,
    color: "#718096",
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 14,
    marginBottom: 8,
  },
  textInputContent: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  characterCount: {
    fontSize: 11,
    color: "#a0aec0",
    textAlign: "left",
    alignSelf: "flex-end",
  },
  compactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  compactCount: {
    fontSize: 10,
    color: "#a0aec0",
  },
  compactHistoryButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
});

export default MicroJournal;
