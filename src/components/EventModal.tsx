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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 2,
    borderColor: COLORS.accent.gold,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  choicesContainer: {
    gap: 10,
  },
  choiceButton: {
    backgroundColor: COLORS.accent.bronze,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  choicePreview: {
    fontSize: 11,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
