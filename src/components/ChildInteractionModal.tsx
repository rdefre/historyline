import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Child } from '../types/game.types';

interface ChildInteractionModalProps {
  child: Child | null;
  playerClass: string;
  onClose: () => void;
  onAction: (actionId: string, cost: number) => void;
}

export default function ChildInteractionModal({
  child,
  playerClass,
  onClose,
  onAction,
}: ChildInteractionModalProps) {
  if (!child) return null;

  const age = Number(child.age);
  const childEmoji = child.gender === 'Masculino' ? '👦' : '👧';
  const typeColor = child.type === 'Legítimo' ? '#c9a84c' : '#888';
  const destinySealed = !!child.profession;

  if (age >= 16) {
    return (
      <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>{childEmoji}</Text>
              <Text style={styles.headerName}>{child.name}</Text>
              <Text style={[styles.headerType, { color: typeColor }]}>{child.type}</Text>
              <Text style={styles.headerSub}>{age} anos • {child.gender}</Text>
            </View>
            <View style={styles.adultNotice}>
              <Text style={styles.adultNoticeText}>
                Este filho já é um adulto e segue sua própria vida.
              </Text>
              <Text style={styles.adultNoticeSubtext}>(Interações de adulto em breve)</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{childEmoji}</Text>
            <Text style={styles.headerName}>{child.name}</Text>
            <Text style={[styles.headerType, { color: typeColor }]}>{child.type}</Text>
            <Text style={styles.headerSub}>
              {age} {age === 1 ? 'ano' : 'anos'} • {child.gender}
              {child.profession ? ` • ${child.profession}` : ''}
              {child.isBaptized ? ' • ✝️ Batizado' : ''}
            </Text>
          </View>

          {/* Stat bars */}
          <View style={styles.statsCard}>
            <StatBar label="Saúde" value={child.health ?? 80} color="#e05555" />
            <StatBar label="Relacionamento" value={child.relationship ?? 50} color="#4aaf72" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.actionsScroll}>
            <View style={styles.actionsSection}>

              {/* ── Common (always visible for < 16) ── */}
              <ActionBtn
                label="🧸 Ninar / Brincar"
                sublabel="Grátis • Fortalece o vínculo"
                onPress={() => onAction('brincar', 0)}
              />
              <ActionBtn
                label="🩸 Chamar o Curandeiro"
                sublabel="15 💰 • Trata enfermidades"
                onPress={() => onAction('curar', 15)}
              />

              {/* ── Baby only (age < 7) ── */}
              {age < 7 && (
                <>
                  {!child.isBaptized && (
                    <ActionBtn
                      label="✝️ Batizar na Igreja"
                      sublabel="10 💰 • Benzido perante a Deus"
                      onPress={() => onAction('batizar', 10)}
                    />
                  )}
                  <ActionBtn
                    label="🧺 Abandonar na Roda"
                    sublabel="Grátis • Irreversível"
                    danger
                    onPress={() => onAction('abandonar', 0)}
                  />
                </>
              )}

              {/* ── Youth only (age >= 7) ── */}
              {age >= 7 && (
                <>
                  <ActionBtn
                    label="⛪ Enviar para o Mosteiro"
                    sublabel={destinySealed ? 'Destino já definido' : '15 💰 • Vida religiosa'}
                    disabled={destinySealed}
                    onPress={() => onAction('mosteiro', 15)}
                  />
                  {playerClass !== 'Nobre' && playerClass !== 'nobility' && playerClass !== 'gentry' && (
                    <ActionBtn
                      label="🔨 Pagar Aprendizado"
                      sublabel={destinySealed ? 'Destino já definido' : '30 💰 • Aprende um ofício'}
                      disabled={destinySealed}
                      onPress={() => onAction('aprendizado', 30)}
                    />
                  )}
                  {(playerClass === 'Nobre' || playerClass === 'nobility' || playerClass === 'gentry') && (
                    <ActionBtn
                      label="⚔️ Treinar na Corte"
                      sublabel={destinySealed ? 'Destino já definido' : '50 💰 • Treinamento militar'}
                      disabled={destinySealed}
                      onPress={() => onAction('corte', 50)}
                    />
                  )}
                </>
              )}

              {/* ── Always at bottom ── */}
              <ActionBtn
                label="👑 Assumir o Controle"
                sublabel="Premium • Em breve"
                muted
                onPress={() => onAction('herdeiro', 0)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min(100, Math.max(0, value))}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{value}</Text>
    </View>
  );
}

function ActionBtn({
  label,
  sublabel,
  danger,
  muted,
  disabled,
  onPress,
}: {
  label: string;
  sublabel: string;
  danger?: boolean;
  muted?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, danger && styles.actionBtnDanger, (muted || disabled) && styles.actionBtnMuted]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled}
    >
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
      <Text style={[styles.actionSublabel, danger && styles.actionSublabelDanger]}>{sublabel}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
    padding: 20,
    width: '88%',
    maxHeight: '80%',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 14,
    zIndex: 10,
  },
  closeBtnText: {
    color: '#888',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8d5a3',
  },
  headerType: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  headerSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: '#16162a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    color: '#aaa',
    fontSize: 12,
    width: 110,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barValue: {
    color: '#ccc',
    fontSize: 11,
    width: 28,
    textAlign: 'right',
  },
  actionsScroll: {
    flexGrow: 0,
  },
  actionsSection: {
    gap: 10,
  },
  adultNotice: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  adultNoticeText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  adultNoticeSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  actionBtnDanger: {
    borderColor: '#a13a2f',
    backgroundColor: 'rgba(161,58,47,0.15)',
  },
  actionBtnMuted: {
    opacity: 0.5,
  },
  actionLabel: {
    color: '#e8d5a3',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  actionLabelDanger: {
    color: '#ef4444',
  },
  actionSublabel: {
    color: '#888',
    fontSize: 12,
  },
  actionSublabelDanger: {
    color: '#a13a2f',
  },
});
