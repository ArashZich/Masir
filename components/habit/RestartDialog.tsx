import React from 'react';
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

interface RestartDialogProps {
  visible: boolean;
  onRestart: () => void;
}

export const RestartDialog: React.FC<RestartDialogProps> = ({
  visible,
  onRestart,
}) => {
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false}>
        <Dialog.Icon icon="restart" />
        <Dialog.Title style={{ textAlign: 'center' }}>
          {t('restart.title')}
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
            {t('restart.message')}
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center' }}>
          <Button mode="contained" onPress={onRestart} icon="restart">
            {t('restart.confirm')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};