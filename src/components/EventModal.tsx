import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import COLORS from '../constants/colors';

interface EventChoice {
  id: string;
  text: string;
  preview?: string;
  stats?: { [key: string]: number };
}

interface GameEventData {
  title: string;
  description: string;
  choices: EventChoice[];
}

interface EventModalProps {
  isOpen: boolean;
  event?: GameEventData;
  onChoice: (choiceId: string) => void;
}

export function EventModal({ isOpen, event, onChoice }: EventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.choicesContainer}>
            {event.choices.map((choice) => (
              <TouchableOpacity
                key={choice.id}
                style={styles.choiceButton}
                onPress={() => onChoice(choice.id)}
              >
                <Text style={styles.choiceText}>{choice.text}</Text>
                {choice.preview && (
                  <Text style={styles.choicePreview}>{choice.preview}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.ui.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.highlight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 21,
  },
  choicesContainer: {
    gap: 10,
  },
  choiceButton: {
    backgroundColor: COLORS.accent.gold,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    shadowColor: COLORS.accent.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  choicePreview: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 3,
  },
});
