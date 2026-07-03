import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../constants/colors';

interface PregnancyModalProps {
  isOpen: boolean;
  partnerName: string;
  partnerGender: string;
  playerGender: 'male' | 'female';
  onKeep: () => void;
  onDiscard: () => void;
}

export default function PregnancyModal({
  isOpen,
  partnerName,
  partnerGender,
  playerGender,
  onKeep,
  onDiscard,
}: PregnancyModalProps) {
  const description =
    playerGender === 'female'
      ? `Você está grávida de ${partnerName}, o que você vai fazer?`
      : `${partnerName} está grávida de um filho seu, o que você vai fazer?`;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>🤰</Text>
          <Text style={styles.title}>Gravidez</Text>
          <Text style={styles.description}>{description}</Text>

          <TouchableOpacity style={styles.keepBtn} onPress={onKeep} activeOpacity={0.8}>
            <Text style={styles.keepText}>👶 Manter o bebê</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.discardBtn} onPress={onDiscard} activeOpacity={0.8}>
            <Text style={styles.discardText}>❌ Não manter o bebê</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 26, 43, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 24,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    shadowColor: COLORS.ui.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  keepBtn: {
    backgroundColor: COLORS.ui.pillGreen,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.ui.pillGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  keepText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  discardBtn: {
    backgroundColor: COLORS.ui.tintRed,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  discardText: {
    color: COLORS.feedback.error,
    fontWeight: '700',
    fontSize: 15,
  },
});
