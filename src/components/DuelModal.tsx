import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DuelModalProps {
  isVisible: boolean;
  onClose: () => void;
  playerStrength: number;
  opponentStrength: number;
  opponentName: string;
  onDuelEnd: (result: 'win' | 'lose') => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const rollDice = (sides: number = 20): number =>
  Math.floor(Math.random() * sides) + 1;

const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];

// ─── Narrative pools ─────────────────────────────────────────────────────────

const BRUTAL_SUCCESS = [
  '💥 Com um grito de fúria, você desfere um golpe pesado!',
  '💥 Sua arma encontra uma brecha na defesa adversária!',
  '💥 O impacto do seu ataque joga o oponente na lama!',
  '💥 Você avança como uma tempestade e o inimigo recua!',
];

const BRUTAL_FAIL = [
  '💥 Seu ataque passa no vazio e você recebe um contra-ataque doloroso!',
  '💥 Você tropeça ao avançar e o inimigo te corta!',
  '💥 O oponente desvia e acerta o pomo da espada no seu rosto!',
  '💥 Um passo em falso — o inimigo explorou sua abertura!',
];

const DEFENSIVE_SUCCESS = [
  '🛡️ Você recua e apara os golpes com maestria.',
  '🛡️ O inimigo se cansa batendo contra a sua defesa.',
  '🛡️ Com sangue frio, você desvia da estocada.',
  '🛡️ Cada golpe deles quebra contra o seu escudo de ferro.',
];

const DEFENSIVE_FAIL = [
  '🛡️ A fúria do inimigo é avassaladora e quebra sua postura!',
  '🛡️ O impacto entorpece seu braço e você recua.',
  '🛡️ Uma finta te engana e a lâmina rasga seu ombro!',
  '🛡️ A pressão é demais — você cede terreno.',
];

/** Derive the starting progress with a strength advantage modifier. */
const calcStartingProgress = (playerStrength: number, opponentStrength: number): number => {
  const diff = playerStrength - opponentStrength;
  return clamp(50 + diff, 20, 80);
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function DuelModal({
  isVisible,
  onClose,
  playerStrength,
  opponentStrength,
  opponentName,
  onDuelEnd,
}: DuelModalProps) {
  const startingProgress = calcStartingProgress(playerStrength, opponentStrength);

  const [duelProgress, setDuelProgress] = useState<number>(startingProgress);
  const [combatLog, setCombatLog] = useState<string[]>([
    `⚔️ Os aços se chocam! Você enfrenta ${opponentName} em um duelo de honra.`,
  ]);
  const [resolved, setResolved] = useState<boolean>(false);

  const scrollRef = useRef<ScrollView>(null);

  // Scroll to top when new entries added (newest at top)
  useEffect(() => {
    if (combatLog.length > 0) {
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
    }
  }, [combatLog]);

  // Resolution check after each progress update
  useEffect(() => {
    if (resolved) return;

    if (duelProgress >= 100) {
      setResolved(true);
      addLog('🏆 Você derrubou ' + opponentName + ' no chão! Vitória absoluta!');
      setTimeout(() => onDuelEnd('win'), 900);
    } else if (duelProgress <= 0) {
      setResolved(true);
      addLog('💀 Você foi derrubado! ' + opponentName + ' triunfa sobre você.');
      setTimeout(() => onDuelEnd('lose'), 900);
    }
  }, [duelProgress]);

  const addLog = (message: string) => {
    // Prepend new entries (newest at top)
    setCombatLog(prev => [message, ...prev]);
  };

  // ── Helper: Render log entry with colored percentage changes ──
  const renderLogEntryWithColor = (entry: string) => {
    // Match (+X%) or (-X%)
    const percentRegex = /([+-]\d+%)/g;
    const parts = entry.split(percentRegex);

    return (
      <Text style={styles.logEntry}>
        {parts.map((part, idx) => {
          if (part?.startsWith('+')) {
            return (
              <Text key={idx} style={{ color: COLORS.feedback.success, fontWeight: '700' }}>
                {part}
              </Text>
            );
          }
          if (part?.startsWith('-')) {
            return (
              <Text key={idx} style={{ color: COLORS.feedback.error, fontWeight: '700' }}>
                {part}
              </Text>
            );
          }
          return (
            <Text key={idx} style={{ color: COLORS.text.secondary }}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleBrutalAttack = () => {
    if (resolved) return;

    const playerRoll = rollDice(20) + playerStrength;
    const opponentRoll = rollDice(20) + opponentStrength;

    if (playerRoll > opponentRoll) {
      const gain = 25;
      setDuelProgress(prev => clamp(prev + gain, 0, 100));
      addLog(`${pick(BRUTAL_SUCCESS)} (+${gain}%)`);
    } else {
      const loss = 20;
      setDuelProgress(prev => clamp(prev - loss, 0, 100));
      addLog(`${pick(BRUTAL_FAIL)} (-${loss}%)`);
    }
  };

  const handleDefensiveStance = () => {
    if (resolved) return;

    const playerRoll = rollDice(20) + Math.floor(playerStrength / 2);
    const opponentRoll = rollDice(20) + Math.floor(opponentStrength / 2);

    if (playerRoll >= opponentRoll) {
      const gain = 10;
      setDuelProgress(prev => clamp(prev + gain, 0, 100));
      addLog(`${pick(DEFENSIVE_SUCCESS)} (+${gain}%)`);
    } else {
      const loss = 5;
      setDuelProgress(prev => clamp(prev - loss, 0, 100));
      addLog(`${pick(DEFENSIVE_FAIL)} (-${loss}%)`);
    }
  };

  // ── Progress bar color ─────────────────────────────────────────────────────

  const getBarColor = (): string => '#2E7D32'; // Dark, immersive green

  const progressPct = `${duelProgress}%` as `${number}%`;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.title}>⚔️  Duelo</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* ── Combatant labels ── */}
          <View style={styles.combatantsRow}>
            <Text style={styles.playerLabel}>Você</Text>
            <Text style={styles.vsLabel}>vs</Text>
            <Text style={styles.opponentLabel}>{opponentName}</Text>
          </View>

          {/* ── Tug-of-War Progress Bar ── */}
          <View style={styles.progressWrapper}>
            {/* Background: red zone (opponent's side) */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progressPct, backgroundColor: getBarColor() }]} />
            </View>

            {/* Gradient labels on each extreme */}
            <View style={styles.progressLabels}>
              <Text style={styles.labelLose}>☠️ 0%</Text>
              <Text style={styles.progressPercent}>{duelProgress}%</Text>
              <Text style={styles.labelWin}>100% 🏆</Text>
            </View>

            {/* Midpoint marker */}
            <View style={styles.midpointMarker} />
          </View>

          {/* Strength info */}
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Sua Força: {playerStrength}</Text>
            <Text style={styles.statText}>Força Inimiga: {opponentStrength}</Text>
          </View>

          {/* ── Combat Log (newest at top) ── */}
          <ScrollView
            ref={scrollRef}
            style={styles.logScrollView}
            contentContainerStyle={styles.logContent}
            showsVerticalScrollIndicator={false}
          >
            {combatLog.map((entry, index) => (
              <View key={index} style={[index === 0 && styles.logEntryLatestWrapper]}>
                {renderLogEntryWithColor(entry)}
              </View>
            ))}
          </ScrollView>

          {/* ── Action Buttons ── */}
          {!resolved && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.brutalButton]}
                onPress={handleBrutalAttack}
                activeOpacity={0.75}
              >
                <Text style={styles.actionButtonEmoji}>💥</Text>
                <Text style={styles.actionButtonText}>Ataque{'\n'}Brutal</Text>
                <Text style={styles.actionButtonHint}>±25 / ±20</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.defensiveButton]}
                onPress={handleDefensiveStance}
                activeOpacity={0.75}
              >
                <Text style={styles.actionButtonEmoji}>🛡️</Text>
                <Text style={styles.actionButtonText}>Postura{'\n'}Defensiva</Text>
                <Text style={styles.actionButtonHint}>+10 / ±5</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Resolved State Banner ── */}
          {resolved && (
            <View style={[
              styles.resolvedBanner,
              duelProgress >= 100 ? styles.resolvedWin : styles.resolvedLose,
            ]}>
              <Text style={styles.resolvedText}>
                {duelProgress >= 100 ? '🏆  Vitória!' : '💀  Derrota!'}
              </Text>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  container: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 2,
    borderColor: COLORS.accent.gold,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },

  // ── Combatants ──────────────────────────────────────────────────────────────
  combatantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.feedback.success,
  },
  vsLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  opponentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.feedback.error,
  },

  // ── Progress Bar ────────────────────────────────────────────────────────────
  progressWrapper: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 20,
    backgroundColor: COLORS.feedback.error,   // Opponent (red) fills the track
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  labelLose: {
    fontSize: 11,
    color: COLORS.feedback.error,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  labelWin: {
    fontSize: 11,
    color: COLORS.feedback.success,
  },
  midpointMarker: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: 20,
    backgroundColor: COLORS.accent.gold,
    opacity: 0.6,
    transform: [{ translateX: -1 }],
  },

  // ── Stats Row ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 11,
    color: COLORS.text.secondary,
  },

  // ── Combat Log ──────────────────────────────────────────────────────────────
  logScrollView: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background.tertiary,
    height: 160,
    marginBottom: 16,
  },
  logContent: {
    padding: 10,
    gap: 6,
  },
  logEntry: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  logEntryLatestWrapper: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent.gold,
    borderRadius: 4,
    marginBottom: 2,
  },

  // ── Action Buttons ──────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  brutalButton: {
    backgroundColor: 'rgba(161, 58, 47, 0.25)',
    borderColor: COLORS.feedback.error,
  },
  defensiveButton: {
    backgroundColor: 'rgba(107, 142, 78, 0.2)',
    borderColor: COLORS.feedback.success,
  },
  actionButtonEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  actionButtonHint: {
    fontSize: 10,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },

  // ── Resolved Banner ─────────────────────────────────────────────────────────
  resolvedBanner: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  resolvedWin: {
    backgroundColor: 'rgba(107, 142, 78, 0.2)',
    borderColor: COLORS.feedback.success,
  },
  resolvedLose: {
    backgroundColor: 'rgba(161, 58, 47, 0.25)',
    borderColor: COLORS.feedback.error,
  },
  resolvedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    letterSpacing: 0.5,
  },
});
