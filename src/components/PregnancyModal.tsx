import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 28,
    width: '85%',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e8d5a3',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  keepBtn: {
    backgroundColor: '#4aaf72',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  keepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  discardBtn: {
    backgroundColor: 'rgba(161,58,47,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a13a2f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  discardText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 15,
  },
});
