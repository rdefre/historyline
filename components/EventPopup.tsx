import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { HistoryLineTheme as T } from '@/constants/theme';
import type { EventChoice, QueuedEvent } from '@/constants/types';

interface EventPopupProps {
  visible: boolean;
  event: QueuedEvent | null;
  onChoiceSelected: (choice: EventChoice) => void;
  onDismiss: () => void;
}

export function EventPopup({ visible, event, onChoiceSelected, onDismiss }: EventPopupProps) {
  if (!event) return null;

  const { title, description } = event.event;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>{description}</Text>
          <View style={styles.choicesContainer}>
            {event.type === 'interactive' ? (
              event.event.choices.map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.choiceButton}
                  activeOpacity={0.8}
                  onPress={() => onChoiceSelected(choice)}
                >
                  <Text style={styles.choiceText}>{choice.text}</Text>
                  <Text style={styles.effectText}>
                    {formatEffects(choice.effect)}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.choiceButton}
                activeOpacity={0.8}
                onPress={onDismiss}
              >
                <Text style={styles.choiceText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function formatEffects(effect: EventChoice['effect']): string {
  const parts: string[] = [];

  if (effect.vitality !== undefined && effect.vitality !== 0) {
    parts.push(`Vitalidade ${effect.vitality > 0 ? '+' : ''}${effect.vitality}`);
  }
  if (effect.sanity !== undefined && effect.sanity !== 0) {
    parts.push(`Sanidade ${effect.sanity > 0 ? '+' : ''}${effect.sanity}`);
  }
  if (effect.honor !== undefined && effect.honor !== 0) {
    parts.push(`Honra ${effect.honor > 0 ? '+' : ''}${effect.honor}`);
  }
  if (effect.money !== undefined && effect.money !== 0) {
    parts.push(`Dinheiro ${effect.money > 0 ? '+' : ''}${effect.money}`);
  }

  return parts.length > 0 ? parts.join(' | ') : '';
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: T.blueRoyal,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: T.gold,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: T.goldLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: T.gold,
    opacity: 0.4,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: T.parchment,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  choicesContainer: {
    gap: 10,
  },
  choiceButton: {
    backgroundColor: T.navyDark,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: T.gold,
  },
  choiceText: {
    fontSize: 14,
    color: T.parchment,
    lineHeight: 20,
    marginBottom: 6,
  },
  effectText: {
    fontSize: 12,
    color: T.gold,
    fontWeight: '600',
  },
});
