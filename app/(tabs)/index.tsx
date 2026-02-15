import { eventsUk1500 } from '@/constants/events-uk-1500';
import {
  createNewCharacter,
  getCurrentEra,
  processYear,
  randomInt,
  type Character,
  type GameEvent,
} from '@/constants/game-data';
import { HistoryLineTheme as T } from '@/constants/theme';
import type { EventChoice, InteractiveEvent, QueuedEvent } from '@/constants/types';
import { EventPopup } from '@/components/EventPopup';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Configuracao dos 3 stats principais
const MAIN_STATS = [
  { key: 'health' as const, label: 'Vitalidade', color: T.red, icon: '\u2764\uFE0F' },
  { key: 'happiness' as const, label: 'Sanidade', color: T.green, icon: '\u{1F9E0}' },
  { key: 'reputation' as const, label: 'Honra', color: T.purple, icon: '\u{1F451}' },
];

// Idade minima para sucessao por parente
const SUCCESSION_AGE_THRESHOLD = 12;

// Regiao atual do jogo
const CURRENT_REGION = 'UK';

// Chance de evento interativo (60%)
const INTERACTIVE_EVENT_CHANCE = 0.6;

// Limiar de vitalidade baixa (efeito visual de fome)
const LOW_VITALITY_THRESHOLD = 30;

// Chance de evento de fome/inverno (15%)
const HUNGER_EVENT_CHANCE = 0.15;

// Interface para parentes na sucessao
interface Relative {
  name: string;
  relation: 'irmao' | 'irma' | 'primo' | 'prima';
  age: number;
}

function makeBirthEvent(char: Character): GameEvent {
  const era = getCurrentEra(char.year);
  const firstName = char.name.split(' ')[0];
  return {
    emoji: '\u{1F476}',
    text: `${firstName} nasceu em uma pequena vila na ${era.location}.`,
    age: 0,
    year: char.year,
  };
}

// Gera parentes para sucessao
function generateRelatives(lastName: string, currentYear: number): Relative[] {
  const era = getCurrentEra(currentYear);
  const maleNames = era.firstNames.filter((_, i) => i < 5);
  const femaleNames = era.firstNames.filter((_, i) => i >= 5);

  const relatives: Relative[] = [];

  // Irmao/Irma (mesma geracao, idade similar)
  if (Math.random() > 0.3) {
    const isMale = Math.random() > 0.5;
    const names = isMale ? maleNames : femaleNames;
    relatives.push({
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastName}`,
      relation: isMale ? 'irmao' : 'irma',
      age: randomInt(1, 10),
    });
  }

  // Primo/Prima (idade variada)
  if (Math.random() > 0.2) {
    const isMale = Math.random() > 0.5;
    const names = isMale ? maleNames : femaleNames;
    relatives.push({
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastName}`,
      relation: isMale ? 'primo' : 'prima',
      age: randomInt(3, 14),
    });
  }

  // Garantir pelo menos um parente
  if (relatives.length === 0) {
    relatives.push({
      name: `${maleNames[0]} ${lastName}`,
      relation: 'irmao',
      age: randomInt(2, 8),
    });
  }

  return relatives;
}

// Componente de barra de stat compacta
function StatBarCompact({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <View style={styles.statBarCompact}>
      <View style={styles.statIconContainer}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <View style={styles.statBarWrapper}>
        <View style={styles.statBarBg}>
          <View style={[styles.statBarFill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.statLabelCompact}>{label}</Text>
      </View>
      <Text style={styles.statValueCompact}>{value}</Text>
    </View>
  );
}

// Componente do item de evento no log
function EventLogItem({ emoji, text, age, year }: GameEvent) {
  return (
    <View style={styles.logItem}>
      <Text style={styles.logEmoji}>{emoji}</Text>
      <View style={styles.logTextContainer}>
        <Text style={styles.logText}>{text}</Text>
        <Text style={styles.logMeta}>Idade {age} {'\u2022'} Ano {year}</Text>
      </View>
    </View>
  );
}

// Popup de sucessao
function SuccessionPopup({
  visible,
  deceased,
  relatives,
  onSelectRelative,
  onNewLife,
}: {
  visible: boolean;
  deceased: Character | null;
  relatives: Relative[];
  onSelectRelative: (relative: Relative) => void;
  onNewLife: () => void;
}) {
  if (!deceased) return null;

  const firstName = deceased.name.split(' ')[0];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.successionOverlay}>
        <View style={styles.successionCard}>
          <Text style={styles.successionEmoji}>{'\u{1F56F}\uFE0F'}</Text>
          <Text style={styles.successionTitle}>Morte Prematura</Text>
          <Text style={styles.successionMessage}>
            {firstName} faleceu com apenas {deceased.age} anos.{'\n'}
            A linhagem pode continuar atraves de um parente.
          </Text>

          <View style={styles.successionDivider} />

          <Text style={styles.successionSubtitle}>Assumir como:</Text>

          {relatives.map((relative, index) => (
            <TouchableOpacity
              key={index}
              style={styles.relativeButton}
              activeOpacity={0.8}
              onPress={() => onSelectRelative(relative)}
            >
              <Text style={styles.relativeEmoji}>
                {relative.relation === 'irmao' || relative.relation === 'primo' ? '\u{1F466}' : '\u{1F467}'}
              </Text>
              <View style={styles.relativeInfo}>
                <Text style={styles.relativeName}>{relative.name}</Text>
                <Text style={styles.relativeDetails}>
                  {relative.relation.charAt(0).toUpperCase() + relative.relation.slice(1)}, {relative.age} anos
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.newLifeButtonAlt} activeOpacity={0.8} onPress={onNewLife}>
            <Text style={styles.newLifeButtonAltText}>{'\u{1F504}'} Nova Linhagem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const baseChar = createNewCharacter(1500);
const initialChar = {
  ...baseChar,
  eventLog: [{ year: 1500, entries: [{ text: `${baseChar.name.split(' ')[0]} nasceu.`, type: 'neutral' as const }] }],
  siblings: Array.from({ length: Math.floor(Math.random() * 3) }).map((_, i) => ({
    id: `init_sib_${i}_${Date.now()}`,
    name: ['William', 'John', 'Henry', 'Mary', 'Elizabeth', 'Anne'][Math.floor(Math.random() * 6)],
    gender: (Math.random() > 0.5 ? 'male' : 'female') as 'male' | 'female',
    age: 2 + (i * 2),
    relationship: 60 + Math.floor(Math.random() * 20),
    isAlive: true,
  })),
};

export default function HomeScreen() {
  const [character, setCharacter] = useState<Character>(initialChar);
  const [events, setEvents] = useState<GameEvent[]>([makeBirthEvent(initialChar)]);
  const [deathCause, setDeathCause] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Event queue system
  const [eventQueue, setEventQueue] = useState<QueuedEvent[]>([]);
  const [currentQueuedEvent, setCurrentQueuedEvent] = useState<QueuedEvent | null>(null);
  const pendingYearResult = useRef<ReturnType<typeof processYear> | null>(null);

  // Estado do pop-up de sucessao
  const [showSuccessionPopup, setShowSuccessionPopup] = useState(false);
  const [successionRelatives, setSuccessionRelatives] = useState<Relative[]>([]);

  // Ref para carregar dados de nascimento de irmão entre handleAgeUp e applyYearResult/handleEventChoice
  const pendingSiblingRef = useRef<{ sibling: any; birthEntry: { text: string; type: 'success' } } | null>(null);

  // Drain event queue one at a time
  useEffect(() => {
    console.log('QUEUE EFFECT - queueLen:', eventQueue.length, 'current:', currentQueuedEvent?.type ?? 'null', 'hasPending:', !!pendingYearResult.current);
    if (eventQueue.length > 0 && currentQueuedEvent === null) {
      const [next, ...rest] = eventQueue;
      console.log('QUEUE EFFECT - showing next:', next.type);
      setCurrentQueuedEvent(next);
      setEventQueue(rest);
    } else if (eventQueue.length === 0 && currentQueuedEvent === null && pendingYearResult.current) {
      console.log('QUEUE EFFECT - draining complete, applying year result');
      const result = pendingYearResult.current;
      pendingYearResult.current = null;
      applyYearResult(result);
    }
  }, [eventQueue, currentQueuedEvent]);

  const era = getCurrentEra(character.year);

  // Emoji do avatar baseado na idade
  const getAvatarEmoji = (age: number): string => {
    if (age < 3) return '\u{1F476}';
    if (age < 13) return '\u{1F466}';
    if (age < 20) return '\u{1F471}';
    if (age < 40) return '\u{1F468}';
    if (age < 60) return '\u{1F9D4}';
    return '\u{1F474}';
  };

  // Filtra eventos compativeis com idade e regiao
  const getEligibleEvents = (age: number, region: string): InteractiveEvent[] => {
    return eventsUk1500.filter((event) => {
      const { minAge, maxAge, region: eventRegion, minVitality } = event.triggerConditions;
      if (age < minAge || age > maxAge) return false;
      if (eventRegion !== region) return false;
      if (minVitality !== undefined && character.stats.health < minVitality * 10) return false;
      return true;
    });
  };

  const handleAgeUp = () => {
    console.log('character.alive:', character.alive);
    if (!character.alive) return;

    const result = processYear(character);
    const newAge = result.newAge;

    pendingYearResult.current = result;

    const queue: QueuedEvent[] = [];

    // === LÓGICA DE NASCIMENTO ===
    const mother = character.family;
    const momAge = mother?.motherAge || 30;
    const momAlive = mother?.motherAlive !== false;

    pendingSiblingRef.current = null;
    const actualMomAge = momAge + character.age;
    const siblingChance = momAlive && actualMomAge < 45;
    console.log('QUEUE DEBUG - siblingChance:', siblingChance, 'momAlive:', momAlive, 'actualMomAge:', actualMomAge);
    if (siblingChance && Math.random() < 0.40) {
      const isBoy = Math.random() > 0.5;
      const babyName = isBoy
        ? ['Edward', 'Thomas', 'Richard', 'Arthur', 'Henry'][Math.floor(Math.random() * 5)]
        : ['Jane', 'Margaret', 'Catherine', 'Alice', 'Mary'][Math.floor(Math.random() * 5)];

      pendingSiblingRef.current = {
        sibling: {
          id: `sib_${Date.now()}`,
          name: babyName,
          gender: (isBoy ? 'male' : 'female') as 'male' | 'female',
          age: 0,
          relationship: 50,
          isAlive: true,
        },
        birthEntry: { text: `Sua mãe deu à luz a um bebê saudável: ${babyName}!`, type: 'success' as const },
      };

      console.log('QUEUE DEBUG - Sibling birth queued:', babyName);
      queue.push({
        type: 'informational',
        event: {
          type: 'informational',
          title: 'Novo Irmão!',
          description: `Sua mãe deu à luz a um bebê saudável: ${babyName}!`,
        },
      });
    }

    // Verificar se um evento interativo deve acontecer
    if (Math.random() < INTERACTIVE_EVENT_CHANCE) {
      const eligibleEvents = getEligibleEvents(newAge, CURRENT_REGION);
      if (eligibleEvents.length > 0) {
        const randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
        queue.push({ type: 'interactive', event: randomEvent });
      }
    }

    console.log('QUEUE DEBUG - queue length:', queue.length, 'types:', queue.map(q => q.type));
    if (queue.length === 0) {
      pendingYearResult.current = null;
      applyYearResult(result);
    } else {
      setEventQueue(queue);
    }
  };

  const applyYearResult = (result: ReturnType<typeof processYear>) => {
    const modifiedStats = { ...result.newStats };
    const additionalEvents: GameEvent[] = [];

    // Chance de evento de fome/inverno rigoroso
    if (Math.random() < HUNGER_EVENT_CHANCE) {
      const hungerDamage = randomInt(8, 15);
      modifiedStats.health = Math.max(0, modifiedStats.health - hungerDamage);

      additionalEvents.push({
        emoji: '\u{2744}\uFE0F',
        text: 'O inverno foi rigoroso e voce esta enfraquecido.',
        age: result.newAge,
        year: result.newYear,
      });
    }

    // Merge tudo em um único setCharacter (inclui nascimento de irmão se houver)
    const siblingData = pendingSiblingRef.current;
    pendingSiblingRef.current = null;

    setCharacter(prev => {
      const updated: any = {
        ...prev,
        age: result.newAge,
        year: result.newYear,
        alive: !result.died && modifiedStats.health > 0,
        job: result.job,
        stats: modifiedStats,
      };

      if (siblingData) {
        updated.siblings = [...(prev.siblings || []), siblingData.sibling];
        const currentLog = prev.eventLog || [];
        const existing = currentLog.find((log: any) => log.year === result.newYear);
        updated.eventLog = existing
          ? currentLog.map((log: any) =>
              log.year === result.newYear
                ? { ...log, entries: [...log.entries, siblingData.birthEntry] }
                : log
            )
          : [...currentLog, { year: result.newYear, entries: [siblingData.birthEntry] }];
      }

      return updated;
    });

    // Verificar morte (por evento ou por fome)
    const diedFromHunger = !result.died && modifiedStats.health <= 0;
    const died = result.died || diedFromHunger;

    if (died) {
      const firstName = character.name.split(' ')[0];
      const deathMsg = diedFromHunger
        ? `${firstName} nao resistiu a fome e ao frio do inverno.`
        : result.deathMessage;

      setDeathCause(deathMsg);

      // Se morreu antes dos 12 anos, oferecer sucessao por parente
      if (result.newAge < SUCCESSION_AGE_THRESHOLD) {
        const lastName = character.name.split(' ').slice(1).join(' ');
        const relatives = generateRelatives(lastName, character.year);
        setSuccessionRelatives(relatives);
        setShowSuccessionPopup(true);
      }
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleEventChoice = (choice: EventChoice) => {
    if (!pendingYearResult.current || !currentQueuedEvent || currentQueuedEvent.type !== 'interactive') return;

    const result = pendingYearResult.current;
    const interactiveEvent = currentQueuedEvent.event;

    const modifiedStats = { ...result.newStats };

    if (choice.effect.vitality) {
      modifiedStats.health = Math.max(0, Math.min(100, modifiedStats.health + choice.effect.vitality * 5));
    }
    if (choice.effect.sanity) {
      modifiedStats.happiness = Math.max(0, Math.min(100, modifiedStats.happiness + choice.effect.sanity * 5));
    }
    if (choice.effect.honor) {
      modifiedStats.reputation = Math.max(0, Math.min(100, modifiedStats.reputation + choice.effect.honor * 5));
    }
    if (choice.effect.money) {
      modifiedStats.intelligence = Math.max(0, Math.min(100, modifiedStats.intelligence + choice.effect.money * 2));
    }

    // Store modified stats back into the pending result so applyYearResult uses them
    pendingYearResult.current = { ...result, newStats: modifiedStats };

    setCurrentQueuedEvent(null);
  };

  const handleEventDismiss = () => {
    setCurrentQueuedEvent(null);
  };

  const handleSelectRelative = (relative: Relative) => {
    const newChar: Character = {
      name: relative.name,
      age: relative.age,
      year: character.year,
      birthYear: character.year - relative.age,
      location: character.location,
      alive: true,
      job: null,
      stats: { happiness: 60, health: 80, intelligence: 20, reputation: 10 },
      socialClass: character.socialClass,
      gender: relative.relation === 'irmao' || relative.relation === 'primo' ? 'male' : 'female',
      currentEvent: null,
      siblings: [],
      family: {
        fatherName: 'Pai de ' + relative.name,
        fatherAge: 35 + relative.age,
        fatherRelationship: 75,
        fatherAlive: true,
        motherName: 'Mae de ' + relative.name,
        motherAge: 30 + relative.age,
        motherRelationship: 85,
        motherAlive: true,
        isAlive: true,
      },
    };

    const successionEvent: GameEvent = {
      emoji: '\u{1F91D}',
      text: `${relative.name} assumiu a linhagem como ${relative.relation} do falecido.`,
      age: relative.age,
      year: character.year,
    };

    setCharacter(newChar);
    setEvents(prev => [...prev, successionEvent]);
    setDeathCause('');
    setShowSuccessionPopup(false);
    setSuccessionRelatives([]);
  };

  const handleNewLife = () => {
    const nextYear = character.year + randomInt(5, 30);
    const newChar = createNewCharacter(nextYear);
    setCharacter(newChar);
    setEvents([makeBirthEvent(newChar)]);
    setDeathCause('');
    setShowSuccessionPopup(false);
    setSuccessionRelatives([]);
  };

  // Verificar se vitalidade esta baixa (efeito visual de fome)
  const isLowVitality = character.stats.health <= LOW_VITALITY_THRESHOLD && character.alive;

  return (
    <SafeAreaView style={styles.container}>
      {/* === CABEÇALHO DO PERSONAGEM === */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarEmoji}>{getAvatarEmoji(character.age)}</Text>
        </View>

        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.characterMeta}>
            {character.age} anos {'\u2022'} Ano {character.year}
          </Text>
          <Text style={styles.characterEra}>
            {era.name} {'\u2022'} {era.location}
            {character.job ? ` \u2022 ${character.job}` : ''}
          </Text>
        </View>
      </View>

      {/* === BOTÃO PRINCIPAL (CORRIGIDO) === */}
      <View style={styles.actionContainer}>
        {character.alive ? (
          <TouchableOpacity 
            style={styles.ageUpButton} 
            activeOpacity={0.8} 
            onPress={handleAgeUp}
          >
            <Text style={styles.ageUpButtonText}>+ Próximo Ano</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.deadContainer}>
            <Text style={styles.deathTitle}>Você Morreu</Text>
            <Text style={styles.deathMessage}>
              Sua jornada chegou ao fim aos {character.age} anos.
            </Text>
            <TouchableOpacity 
              style={styles.newLifeButton}
              onPress={handleNewLife}
            >
              <Text style={styles.newLifeButtonText}>↺ Nova Vida</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* === LOG DE EVENTOS (RODAPÉ) === */}
      <View style={styles.bottomSection}>
        <View style={styles.logHeader}>
          <Text style={styles.logHeaderText}>{'\u1F4DC'} Registro de Vida</Text>
        </View>
        <ScrollView 
          ref={scrollRef}
          style={styles.logScroll}
          contentContainerStyle={styles.logContent}
          showsVerticalScrollIndicator={false}
        >
          {character.eventLog.slice().reverse().map((yearLog, yIndex) => (
            <View key={yIndex} style={styles.yearBlock}>
              <Text style={styles.yearLabel}>Ano {yearLog.year}</Text>
              {yearLog.entries.map((entry, eIndex) => (
                <Text key={eIndex} style={[
                  styles.logEntry, 
                  entry.type === 'danger' && styles.logDanger,
                  entry.type === 'success' && styles.logSuccess,
                  entry.type === 'info' && styles.logInfo
                ]}>
                  {entry.emoji} {entry.text}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* EVENT POPUP (QUEUE SYSTEM) */}
      <EventPopup
        visible={currentQueuedEvent !== null}
        event={currentQueuedEvent}
        onChoiceSelected={handleEventChoice}
        onDismiss={handleEventDismiss}
      />

      {/* MODAL DE SUCESSÃO (SE HOUVER) */}
      {showSuccessionPopup && (
        <SuccessionPopup
          relatives={character.siblings || []}
          onSelect={handleSuccession}
          onNewLife={handleNewLife}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.navyDark,
  },

  // === EFEITO DE VITALIDADE BAIXA ===
  lowVitalityBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: 'rgba(192, 57, 43, 0.7)',
    zIndex: 100,
    borderRadius: 0,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },

  // === TOPO ===
  topSection: {
    backgroundColor: T.blueRoyal,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statBarCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.navyDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
  },
  statBarWrapper: {
    flex: 1,
  },
  statBarBg: {
    height: 16,
    backgroundColor: T.navyDark,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  statLabelCompact: {
    position: 'absolute',
    left: 8,
    top: 1,
    fontSize: 10,
    color: T.parchment,
    fontWeight: '600',
  },
  statValueCompact: {
    width: 32,
    fontSize: 14,
    fontWeight: '700',
    color: T.goldLight,
    textAlign: 'right',
  },

  // === CENTRO ===
  centerSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: T.navyDark,
    borderBottomWidth: 2,
    borderBottomColor: T.blueRoyal,
  },
  avatarFrame: {
    width: 140,
    height: 180,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: T.gold,
    backgroundColor: T.blueRoyal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 64,
  },
  characterInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  characterName: {
    fontSize: 22,
    fontWeight: '700',
    color: T.goldLight,
  },
  characterMeta: {
    fontSize: 14,
    color: T.parchment,
    marginTop: 4,
  },
  characterEra: {
    fontSize: 12,
    color: T.gold,
    marginTop: 2,
  },
  ageUpButton: {
    backgroundColor: T.gold,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  ageUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.navyDark,
  },

  // === BASE ===
  bottomSection: {
    flex: 1,
    backgroundColor: T.navyDark,
  },
  logHeader: {
    backgroundColor: T.blueRoyal,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.gold,
  },
  logScroll: {
    flex: 1,
  },
  logContent: {
    padding: 12,
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: T.blueRoyal,
    borderRadius: 8,
    padding: 10,
  },
  logEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  logTextContainer: {
    flex: 1,
  },
  logText: {
    fontSize: 13,
    color: T.parchment,
    lineHeight: 18,
  },
  logMeta: {
    fontSize: 11,
    color: T.gold,
    marginTop: 4,
  },

  // === DEATH OVERLAY ===
  deathOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deathCard: {
    backgroundColor: T.blueRoyal,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginHorizontal: 24,
    borderWidth: 2,
    borderColor: T.gold,
  },
  deathEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  deathTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: T.goldLight,
    marginBottom: 8,
  },
  deathMessage: {
    fontSize: 14,
    color: T.parchment,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  deathDivider: {
    width: '80%',
    height: 1,
    backgroundColor: T.gold,
    opacity: 0.3,
    marginBottom: 12,
  },
  deathInfo: {
    fontSize: 14,
    color: T.parchment,
    marginBottom: 4,
  },
  newLifeButton: {
    marginTop: 20,
    backgroundColor: T.gold,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  newLifeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.navyDark,
  },

  // === SUCCESSION POPUP ===
  successionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  successionCard: {
    backgroundColor: T.blueRoyal,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: T.gold,
    width: SCREEN_WIDTH - 40,
  },
  successionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  successionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: T.goldLight,
    marginBottom: 8,
  },
  successionMessage: {
    fontSize: 14,
    color: T.parchment,
    textAlign: 'center',
    lineHeight: 20,
  },
  successionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: T.gold,
    opacity: 0.3,
    marginVertical: 16,
  },
  successionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: T.gold,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  relativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.navyDark,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: T.gold,
  },
  relativeEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  relativeInfo: {
    flex: 1,
  },
  relativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: T.parchment,
  },
  relativeDetails: {
    fontSize: 12,
    color: T.gold,
    marginTop: 2,
  },
  newLifeButtonAlt: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  newLifeButtonAltText: {
    fontSize: 14,
    color: T.parchment,
    textDecorationLine: 'underline',
  },
});
