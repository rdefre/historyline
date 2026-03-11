import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
          <Text style={[styles.typeLabel, { color: pregnancy.type === 'Legítimo' ? '#c9a84c' : '#aaa' }]}>
            {pregnancy.type}
          </Text>
          <Text style={styles.description}>{description}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da criança..."
            placeholderTextColor="#666"
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
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a2a3e',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c9a84c',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#c9a84c',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
