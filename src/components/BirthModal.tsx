import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import COLORS from '../constants/colors';
import type { PendingPregnancy } from '../types/game.types';

interface BirthModalProps {
  pregnancy: PendingPregnancy | null;
  onNameChosen: (name: string) => void;
}

export default function BirthModal({ pregnancy, onNameChosen }: BirthModalProps) {
  const [name, setName] = useState('');

  if (!pregnancy) return null;

  const description =
    pregnancy.type === 'Legítimo'
      ? 'Este filho é fruto de um casamento legítimo perante a igreja. Ele carrega seu sangue e o direito de herdar suas terras e riquezas.'
      : 'Este filho nasceu fora do sagrado matrimônio. Sendo um bastardo, ele trará vergonha ao seu nome e poderá causar conflitos pela sua herança no futuro.';

  const handleSubmit = () => {
    const finalName = name.trim() || 'João';
    setName('');
    onNameChosen(finalName);
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>👶</Text>
          <Text style={styles.title}>Um bebê nasceu!</Text>
          <Text style={[styles.typeLabel, { color: pregnancy.type === 'Legítimo' ? COLORS.accent.gold : COLORS.text.secondary }]}>
            {pregnancy.type}
          </Text>
          <Text style={styles.description}>{description}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da criança..."
            placeholderTextColor={COLORS.text.disabled}
            value={name}
            onChangeText={setName}
            maxLength={30}
            autoFocus
          />
          <TouchableOpacity style={styles.btn} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.btnText}>⛪ Batizar criança</Text>
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
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.background.primary,
    color: COLORS.text.primary,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.background.tertiary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: COLORS.accent.gold,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.accent.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
