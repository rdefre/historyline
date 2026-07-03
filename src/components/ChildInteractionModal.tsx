import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/colors';
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
  const typeColor = child.type === 'Legítimo' ? COLORS.accent.gold : COLORS.text.secondary;
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
    backgroundColor: 'rgba(15, 26, 43, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 24,
    padding: 20,
    width: '88%',
    maxHeight: '80%',
    shadowColor: COLORS.ui.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 14,
    zIndex: 10,
  },
  closeBtnText: {
    color: COLORS.text.secondary,
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
    fontWeight: '800',
    color: COLORS.text.primary,
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
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 18,
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
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    width: 110,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  barValue: {
    color: COLORS.text.primary,
    fontSize: 11,
    fontWeight: '700',
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
    color: COLORS.text.highlight,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  adultNoticeSubtext: {
    color: COLORS.text.disabled,
    fontSize: 12,
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: COLORS.accent.bronze,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  actionBtnDanger: {
    backgroundColor: COLORS.ui.tintRed,
  },
  actionBtnMuted: {
    opacity: 0.5,
  },
  actionLabel: {
    color: COLORS.accent.gold,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'center',
  },
  actionLabelDanger: {
    color: COLORS.feedback.error,
  },
  actionSublabel: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionSublabelDanger: {
    color: COLORS.feedback.error,
  },
});
