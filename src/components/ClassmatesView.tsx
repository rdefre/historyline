import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import COLORS from '../constants/colors';
import type { Character } from '../types/game.types';
import { getClassmateTitle } from '../utils/classmates';

interface ClassmatesViewProps {
  character: Character;
  onInteraction: (classmateId: string, actionType: 'PLAY' | 'CHAT' | 'FIGHT') => void;
  onClose: () => void;
}

export default function ClassmatesView({
  character,
  onInteraction,
  onClose,
}: ClassmatesViewProps) {
  const [selectedClassmate, setSelectedClassmate] = useState<string | null>(null);

  const getRelationshipColor = (value: number): string => {
    if (value >= 70) return '#4ade80';
    if (value >= 40) return '#fbbf24';
    return '#ef4444';
  };

  const handleAction = (classmateId: string, action: 'PLAY' | 'CHAT' | 'FIGHT') => {
    onInteraction(classmateId, action);
    setSelectedClassmate(null);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{getClassmateTitle(character.socialClass)}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {(!character.classmates || character.classmates.length === 0) ? (
              <Text style={styles.emptyText}>
                Você ainda não conheceu nenhum companheiro.
                {'\n'}Continue trabalhando para fazer amigos!
              </Text>
            ) : (
              character.classmates.map((classmate) => (
                <View key={classmate.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardName}>{classmate.name}</Text>
                    <View style={styles.relationshipBadge}>
                      <View
                        style={[
                          styles.relationshipDot,
                          { backgroundColor: getRelationshipColor(classmate.relationship) },
                        ]}
                      />
                      <Text style={styles.relationshipText}>{classmate.relationship}%</Text>
                    </View>
                  </View>

                  <View style={styles.relationshipBar}>
                    <View
                      style={[
                        styles.relationshipFill,
                        {
                          width: `${classmate.relationship}%`,
                          backgroundColor: getRelationshipColor(classmate.relationship),
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleAction(classmate.id, 'PLAY')}
                    >
                      <Text style={styles.actionButtonText}>🎮 Brincar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleAction(classmate.id, 'CHAT')}
                    >
                      <Text style={styles.actionButtonText}>💬 Conversar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.fightButton]}
                      onPress={() => handleAction(classmate.id, 'FIGHT')}
                    >
                      <Text style={styles.actionButtonText}>⚔️ Lutar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.tertiary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  scrollView: {
    padding: 16,
  },
  emptyText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  relationshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relationshipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  relationshipText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  relationshipBar: {
    height: 6,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  relationshipFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.accent.bronze,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  fightButton: {
    backgroundColor: '#8b4513',
  },
  actionButtonText: {
    color: COLORS.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
