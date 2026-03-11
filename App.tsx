import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FooterMenu from './src/components/FooterMenu';
import OccupationView from './src/components/OccupationView';
import RelationshipsView from './src/components/RelationshipsView';
import COLORS from './src/constants/colors';
import { getChildhoodEventByClass, type ChildhoodEvent } from './src/data/childhoodEventsByClass';
import { didEraChange, getCurrentEra } from './src/data/eras';
import { checkHistoricalEvent, type HistoricalEvent } from './src/data/historicalEvents';
import { PEASANT_ADULT_EVENTS, SIMPLE_RANDOM_EVENTS, filterChoicesForAge, getRandomEvent, type RandomEvent } from './src/data/randomEvents';
import type { Character, Child, Era, GlobalEnemy, PendingPregnancy, RandomGameEvent } from './src/types/game.types';
import BirthModal from './src/components/BirthModal';
import { generatePhysicalTraits, getAgeLabel, getAvatarEmoji, getPhysicalDescription } from './src/utils/avatar';
import { generateFamilyBackground, generateNameForClass, getSocialClassIcon, getSocialClassName } from './src/utils/socialClass';

import { EventModal } from './src/components/EventModal';
import DuelModal from './src/components/DuelModal';
import PossesView from './src/components/PossesView';
import SheetHeader from './src/components/SheetHeader';
import { ViewProvider, useViewContext } from './src/context/ViewContext';
import type { MarketItem, PotentialMatch, SimpleEvent } from './src/types/game.types';
import { FIXED_MARKET_ITEMS, MASTER_MARKET_ITEMS } from './src/data/marketItems';
import { generateClassmates, generateNewClassmateName } from './src/utils/classmates';
import { calculateMoneyResult } from './src/utils/moneyInteractions';
import { generateChatResult } from './src/utils/npcInteractions';

// === LOCALIZAÇÃO FIXA: INGLATERRA (1500) ===
const STARTING_LOCATION = {
  name: 'Inglaterra',
  description: 'Reino da Inglaterra - Era Tudor',
  context: 'Você nasce durante o reinado da dinastia Tudor.',
};

// === NOMES ALEATÓRIOS INGLESES ===
const ENGLISH_NAMES = {
  male: ['William', 'John', 'Henry', 'Edward', 'Thomas', 'Richard', 'George', 'Robert', 'James', 'Charles'],
  female: ['Elizabeth', 'Mary', 'Catherine', 'Anne', 'Margaret', 'Jane', 'Alice', 'Dorothy', 'Joan', 'Agnes'],
  surnames: ['Smith', 'Taylor', 'Brown', 'Wilson', 'Moore', 'Clark', 'White', 'Hall', 'Wood', 'Baker'],
};

// === MINI-GAME: BATER CARTEIRA ===
function PickpocketGame({ difficulty, onFinish }: { difficulty: 'easy' | 'hard'; onFinish: (success: boolean) => void }) {
  const [cursorPos, setCursorPos] = useState(0);
  const [running, setRunning] = useState(true);
  const directionRef = useRef(1);
  const posRef = useRef(0);

  // Target zone: easy = 20% wide (40-60%), hard = 5% wide (47.5-52.5%)
  const targetStart = difficulty === 'easy' ? 40 : 47.5;
  const targetEnd = difficulty === 'easy' ? 60 : 52.5;
  const speed = difficulty === 'easy' ? 1.8 : 3;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      posRef.current += directionRef.current * speed;
      if (posRef.current >= 100) {
        posRef.current = 100;
        directionRef.current = -1;
      } else if (posRef.current <= 0) {
        posRef.current = 0;
        directionRef.current = 1;
      }
      setCursorPos(posRef.current);
    }, 16);
    return () => clearInterval(interval);
  }, [running]);

  const handleTap = () => {
    if (!running) return;
    setRunning(false);
    const hit = posRef.current >= targetStart && posRef.current <= targetEnd;
    setTimeout(() => onFinish(hit), 600);
  };

  return (
    <View style={miniStyles.overlay}>
      <View style={miniStyles.container}>
        <Text style={miniStyles.title}>🗡️ Bater Carteira</Text>
        <Text style={miniStyles.instruction}>
          {difficulty === 'easy' ? 'Alvo fácil — acerte a zona verde!' : 'Alvo difícil — precisão necessária!'}
        </Text>

        {/* Bar */}
        <View style={miniStyles.barOuter}>
          {/* Target zone */}
          <View style={[miniStyles.targetZone, { left: `${targetStart}%`, width: `${targetEnd - targetStart}%` }]} />
          {/* Cursor */}
          <View style={[miniStyles.cursor, { left: `${cursorPos}%` }]} />
        </View>

        {/* Result feedback */}
        {!running && (
          <Text style={[miniStyles.resultText, {
            color: (posRef.current >= targetStart && posRef.current <= targetEnd) ? '#4ade80' : '#ef4444',
          }]}>
            {(posRef.current >= targetStart && posRef.current <= targetEnd) ? 'SUCESSO!' : 'FALHOU!'}
          </Text>
        )}

        {/* Action button */}
        {running && (
          <TouchableOpacity style={miniStyles.tapButton} onPress={handleTap} activeOpacity={0.7}>
            <Text style={miniStyles.tapButtonText}>TENTAR AGORA!</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function PoachingGame({ onFinish }: { onFinish: (success: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState(0);
  const [holding, setHolding] = useState(false);
  const [finished, setFinished] = useState(false);
  const holdingRef = useRef(false);
  const progressRef = useRef(0);
  const alertRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (finishedRef.current) return;

      if (holdingRef.current) {
        progressRef.current = Math.min(100, progressRef.current + 0.5);
        alertRef.current = Math.min(100, alertRef.current + 1.5);
      } else {
        alertRef.current = Math.max(0, alertRef.current - 1.0);
      }

      setProgress(progressRef.current);
      setAlert(alertRef.current);

      if (alertRef.current >= 100) {
        finishedRef.current = true;
        setFinished(true);
        setTimeout(() => onFinish(false), 800);
      } else if (progressRef.current >= 100) {
        finishedRef.current = true;
        setFinished(true);
        setTimeout(() => onFinish(true), 800);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handlePressIn = () => {
    if (finishedRef.current) return;
    holdingRef.current = true;
    setHolding(true);
  };

  const handlePressOut = () => {
    holdingRef.current = false;
    setHolding(false);
  };

  const won = finished && progressRef.current >= 100;
  const lost = finished && alertRef.current >= 100;

  return (
    <View style={miniStyles.overlay}>
      <View style={miniStyles.container}>
        <Text style={miniStyles.title}>🦌 Caça Ilegal</Text>
        <Text style={miniStyles.instruction}>
          Segure o botão para esfolar. Solte quando o alerta subir!
        </Text>

        {/* Progress bar */}
        <Text style={poachStyles.barLabel}>🥩 Progresso</Text>
        <View style={poachStyles.barOuter}>
          <View style={[poachStyles.barFill, { width: `${progress}%`, backgroundColor: '#4ade80' }]} />
        </View>

        {/* Alert bar */}
        <Text style={poachStyles.barLabel}>🚨 Alerta do Guarda</Text>
        <View style={poachStyles.barOuter}>
          <View style={[poachStyles.barFill, { width: `${alert}%`, backgroundColor: alert > 70 ? '#ef4444' : '#fbbf24' }]} />
        </View>

        {/* Result feedback */}
        {finished && (
          <Text style={[miniStyles.resultText, { color: won ? '#4ade80' : '#ef4444' }]}>
            {won ? 'SUCESSO!' : 'PEGO!'}
          </Text>
        )}

        {/* Hold button */}
        {!finished && (
          <TouchableOpacity
            style={[miniStyles.tapButton, holding && poachStyles.buttonHolding]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={miniStyles.tapButtonText}>
              {holding ? 'ESFOLANDO...' : 'ESFOLAR'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const poachStyles = StyleSheet.create({
  barLabel: {
    fontSize: 12,
    color: '#aaa',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  barOuter: {
    width: '100%',
    height: 20,
    backgroundColor: '#2a2a3e',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  buttonHolding: {
    backgroundColor: '#e8b84c',
    transform: [{ scale: 0.95 }],
  },
});

const miniStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    width: '85%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c9a84c',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c9a84c',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 24,
    textAlign: 'center',
  },
  barOuter: {
    width: '100%',
    height: 40,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  targetZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#4ade80',
  },
  cursor: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    width: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    marginLeft: -2,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tapButton: {
    backgroundColor: '#c9a84c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  tapButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});

function AppContent() {
  // === VIEW CONTEXT ===
  const { currentView, setCurrentView } = useViewContext();

  // === ESTADO DO JOGO ===
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [eventModal, setEventModal] = useState<{ isOpen: boolean; event?: SimpleEvent }>({ isOpen: false });
  const [simpleEvent, setSimpleEvent] = useState<RandomGameEvent | null>(null);

  // === NPC REACTIVE EVENTS ===
  const [npcEvent, setNpcEvent] = useState<{ isOpen: boolean; coworkerId?: string; coworkerName?: string; eventType?: string; event?: SimpleEvent }>({ isOpen: false });
  const [duelModal, setDuelModal] = useState<{
    isVisible: boolean;
    coworkerId: string;
    opponentName: string;
    opponentStrength: number;
    /** 'coworker' duels update currentJob coworkers; 'enemy' duels update globalEnemies. */
    sourceType?: 'coworker' | 'enemy';
    /** Optional per-event callbacks; if absent, handleDuelEnd uses default coworker-duel consequences. */
    onWin?: () => void;
    onLose?: () => void;
  }>({ isVisible: false, coworkerId: '', opponentName: '', opponentStrength: 50 });

  // === MERCADO ===
  const [currentMarketItems, setCurrentMarketItems] = useState<MarketItem[]>([]);

  // === NASCIMENTO DE IRMÃO ===
  const [siblingBirthModal, setSiblingBirthModal] = useState<{ isOpen: boolean; name?: string; gender?: string }>({ isOpen: false });

  // === NASCIMENTO DE FILHO ===
  const [showBirthModal, setShowBirthModal] = useState(false);
  const pendingBirthCharRef = useRef<Character | null>(null);
  const pendingEventsCharRef = useRef<Character | null>(null);

  // === MINI-GAME ===
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameDifficulty, setMiniGameDifficulty] = useState<'easy' | 'hard'>('easy');
  const [showPoachingGame, setShowPoachingGame] = useState(false);
  const [crimeStrikeCount, setCrimeStrikeCount] = useState(0);
  const pendingCrimeAction = useRef<((success: boolean) => void) | null>(null);
  const pendingPoachingAction = useRef<((success: boolean) => void) | null>(null);

  // === AUTO-SCROLL LOG ===
  const scrollViewRef = useRef<ScrollView>(null);

  // === INICIALIZAR JOGO ===
  useEffect(() => {
    startNewLife();
  }, []);

  // === AUTO-SCROLL LOG QUANDO ATUALIZADO ===
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [gameLog]);

  // === HONOR MILESTONE POPUPS (one-time per generation) ===
  useEffect(() => {
    if (!character) return;

    if (character.honor >= 80 && !character.flags?.seenHighHonor) {
      setCharacter((prev) => prev ? { ...prev, flags: { ...prev.flags, seenHighHonor: true } } : prev);
      Alert.alert(
        '🌟 O Herói da Vila',
        'Sua fama o precede! O líder dos mercadores te cumprimentou. A partir de hoje, você terá 20% de desconto em todas as compras no mercado.'
      );
    } else if (character.honor <= 20 && !character.flags?.seenLowHonor) {
      setCharacter((prev) => prev ? { ...prev, flags: { ...prev.flags, seenLowHonor: true } } : prev);
      Alert.alert(
        '👀 A Escória',
        'Os mercadores cuspiram no chão quando você passou. Eles acham que você é um ladrão e, a partir de hoje, cobrarão 20% a mais por tudo.'
      );
    }
  }, [character?.honor]);

  // === GERAR STATS DE NPC ===
  const generateNPCStats = (socialClass: string) => {
    const randRange = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    let honor: number;
    let money: number;
    switch (socialClass) {
      case 'nobility':
        honor = randRange(70, 100);
        money = randRange(500, 1000);
        break;
      case 'gentry':
        honor = randRange(50, 80);
        money = randRange(100, 300);
        break;
      case 'artisan':
        honor = randRange(30, 60);
        money = randRange(50, 200);
        break;
      default: // peasant
        honor = randRange(10, 40);
        money = randRange(0, 25);
        break;
    }
    return {
      vitality: randRange(50, 100),
      faith: randRange(20, 100),
      strength: randRange(20, 80),
      honor,
      money,
    };
  };

  // === CRIAR NOVO PERSONAGEM ===
  // === GERAR ITENS DO MERCADO ===
  const generateMarketItems = (playerClass: string): MarketItem[] => {
    const filtered = MASTER_MARKET_ITEMS.filter((item) =>
      item.allowedClasses.includes(playerClass)
    );
    const count = 3 + Math.floor(Math.random() * 2); // 3 or 4
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const startNewLife = () => {
    // Inglaterra como localização fixa
    const location = STARTING_LOCATION;

    // Escolhe gênero
    const gender = Math.random() > 0.5 ? 'male' : 'female';

    // Gera características físicas permanentes
    const physicalTraits = generatePhysicalTraits();

    // Gera background familiar (determina classe social e recursos)
    const familyBg = generateFamilyBackground(gender, '');

    // Gera nome apropriado para a classe social
    const { firstName, surname } = generateNameForClass(gender, familyBg.socialClass);

    const era = getCurrentEra(location.name, 1500);

    const newCharacter: Character = {
      name: firstName,
      surname: surname,
      age: 0,
      gender: gender,
      health: 70 + Math.floor(Math.random() * 21),   // 70-90 (frágil)
      sanity: 100,
      honor: Math.floor(Math.random() * 11),          // 0-10 (neutro)
      intelligence: 0,
      faith: 0,                                        // aprendido depois
      strength: Math.floor(Math.random() * 6),         // 0-5 (fraco)
      money: 0,
      food: 0,
      relationships: [],
      traits: [],
      location: location.name,
      birthYear: 1500,
      currentYear: 1500,
      era: (era?.id as Era) || 'tudor',
      physicalTraits: physicalTraits,
      socialClass: familyBg.socialClass, // Classe social
      family: {
        fatherName: familyBg.fatherName,
        fatherOccupation: familyBg.fatherOccupation,
        fatherRelationship: 75,
        fatherAge: 25 + Math.floor(Math.random() * 10),
        fatherAlive: true,
        fatherStats: generateNPCStats(familyBg.socialClass),
        motherName: familyBg.motherName,
        motherDescription: familyBg.motherDescription,
        motherRelationship: 85,
        motherAge: 20 + Math.floor(Math.random() * 8),
        motherAlive: true,
        motherStats: generateNPCStats(familyBg.socialClass),
        isAlive: true,
      },
      narrativeFlags: {
        isOrphan: false,
        hasApprentice: false,
        livingWith: 'parents',
        lastMajorEvent: undefined,
      },
      usedChildhoodEvents: [],
      recentEventIds: [],
      partnerActionsThisYear: [],
      childActionsThisYear: [],
      children: [],
      siblings: [],
      classmates: [],
      eventLog: [{ year: 1500, entries: [] }],
      npcInteractionHistory: [],
      activityHistory: {},
      inventory: [],
      maxInventorySlots: 5,
      flags: {},
      partner: null,
      hasSyphilis: false,
      birthControlActive: false,
      pendingPregnancy: null,
      currentJob: null,
      globalEnemies: [],
    };

    setCharacter(newCharacter);
    setCurrentMarketItems(generateMarketItems(familyBg.socialClass));
    setGameLog([
      `Nasceu ${firstName} ${surname}, um(a) ${gender === 'male' ? 'menino' : 'menina'}.`,
      `👤 Aparência: ${getPhysicalDescription(physicalTraits)}`,
      ``,
      `${getSocialClassIcon(familyBg.socialClass)} Classe Social: ${getSocialClassName(familyBg.socialClass)}`,
      `👨 Seu pai: ${familyBg.fatherName}, ${familyBg.fatherOccupation}`,
      `👩 Sua mãe: ${familyBg.motherName}, ${familyBg.motherDescription}`,
      ``,
      `🏠 Sua família vive em ${familyBg.housing}.`,
      `${familyBg.familyDescription}`,
      ``,
      `📍 Ano: 1500 - ${location.description}`,
      `⚡ ${era?.name || 'Era Tudor'}`,
    ]);
    setCurrentEvent(null);
    setWaitingForChoice(false);
  };

  // === PROCESSAR ENVELHECIMENTO DE FAMÍLIA ===
  const processFamilyTurn = (char: Character) => {
    const randRange = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    const deathMessages: string[] = [];

    // === ATUALIZAR FAMÍLIA ===
    let updatedFamily = { ...char.family };

    // Pai
    if (updatedFamily.fatherAlive) {
      updatedFamily.fatherAge = (updatedFamily.fatherAge || 30) + 1;

      if (updatedFamily.fatherStats) {
        const stats = { ...updatedFamily.fatherStats };
        const age = updatedFamily.fatherAge;

        // Vitality: decreases with age
        const vitalityDecay = age > 50 ? randRange(5, 15) : randRange(0, 5);
        stats.vitality = Math.max(0, stats.vitality - vitalityDecay);

        // Strength: grows until 30, then declines
        if (age < 30) {
          stats.strength = Math.min(100, stats.strength + randRange(0, 5));
        } else if (age > 50) {
          stats.strength = Math.max(0, stats.strength - randRange(2, 8));
        }

        // Faith/Honor: small random fluctuation
        stats.faith = Math.max(0, Math.min(100, stats.faith + randRange(-2, 2)));
        stats.honor = Math.max(0, Math.min(100, stats.honor + randRange(-2, 2)));

        // Money: income if working age (13+)
        if (age >= 13) {
          const income = char.socialClass === 'nobility' ? 100
            : char.socialClass === 'gentry' ? 50
              : char.socialClass === 'artisan' ? 20
                : 5; // peasant
          stats.money += income;

          // Random expense chance (20%)
          if (Math.random() < 0.2) {
            const expense = randRange(5, 20);
            stats.money = Math.max(0, stats.money - expense);
          }
        }

        updatedFamily.fatherStats = stats;

        // Death check
        if (stats.vitality <= 0 || age > 100) {
          updatedFamily.fatherAlive = false;
          deathMessages.push(`💀 Tristeza! Seu pai ${updatedFamily.fatherName} faleceu de causas naturais aos ${age} anos.`);
        }
      }
    }

    // Mãe
    if (updatedFamily.motherAlive) {
      updatedFamily.motherAge = (updatedFamily.motherAge || 28) + 1;

      if (updatedFamily.motherStats) {
        const stats = { ...updatedFamily.motherStats };
        const age = updatedFamily.motherAge;

        // Vitality: decreases with age
        const vitalityDecay = age > 50 ? randRange(5, 15) : randRange(0, 5);
        stats.vitality = Math.max(0, stats.vitality - vitalityDecay);

        // Strength: grows until 30, then declines
        if (age < 30) {
          stats.strength = Math.min(100, stats.strength + randRange(0, 5));
        } else if (age > 50) {
          stats.strength = Math.max(0, stats.strength - randRange(2, 8));
        }

        // Faith/Honor: small random fluctuation
        stats.faith = Math.max(0, Math.min(100, stats.faith + randRange(-2, 2)));
        stats.honor = Math.max(0, Math.min(100, stats.honor + randRange(-2, 2)));

        // Money: income if working age (13+)
        if (age >= 13) {
          const income = char.socialClass === 'nobility' ? 100
            : char.socialClass === 'gentry' ? 50
              : char.socialClass === 'artisan' ? 20
                : 5; // peasant
          stats.money += income;

          // Random expense chance (20%)
          if (Math.random() < 0.2) {
            const expense = randRange(5, 20);
            stats.money = Math.max(0, stats.money - expense);
          }
        }

        updatedFamily.motherStats = stats;

        // Death check
        if (stats.vitality <= 0 || age > 100) {
          updatedFamily.motherAlive = false;
          deathMessages.push(`💀 Tristeza! Sua mãe ${updatedFamily.motherName} faleceu de causas naturais aos ${age} anos.`);
        }
      }
    }

    // Atualiza isAlive se ambos morreram
    if (!updatedFamily.fatherAlive && !updatedFamily.motherAlive) {
      updatedFamily.isAlive = false;
    }

    // === ATUALIZAR IRMÃOS ===
    const updatedSiblings = char.siblings.map((sibling) => {
      const newSibling = { ...sibling, age: sibling.age + 1 };

      if (newSibling.stats) {
        const stats = { ...newSibling.stats };
        const age = newSibling.age;

        // Vitality: decreases with age
        const vitalityDecay = age > 50 ? randRange(5, 15) : randRange(0, 5);
        stats.vitality = Math.max(0, stats.vitality - vitalityDecay);

        // Strength: grows until 30, then declines
        if (age < 30) {
          stats.strength = Math.min(100, stats.strength + randRange(0, 5));
        } else if (age > 50) {
          stats.strength = Math.max(0, stats.strength - randRange(2, 8));
        }

        // Faith/Honor: small random fluctuation
        stats.faith = Math.max(0, Math.min(100, stats.faith + randRange(-2, 2)));
        stats.honor = Math.max(0, Math.min(100, stats.honor + randRange(-2, 2)));

        // Money: income if working age (13+)
        if (age >= 13) {
          const income = char.socialClass === 'nobility' ? 100
            : char.socialClass === 'gentry' ? 50
              : char.socialClass === 'artisan' ? 20
                : 5; // peasant
          stats.money += income;

          // Random expense chance (20%)
          if (Math.random() < 0.2) {
            const expense = randRange(5, 20);
            stats.money = Math.max(0, stats.money - expense);
          }
        }

        newSibling.stats = stats;

        // Death check
        if (stats.vitality <= 0 || age > 100) {
          deathMessages.push(`💀 Tristeza! Seu irmão ${newSibling.name} faleceu de causas naturais aos ${age} anos.`);
          return null; // Mark for removal
        }
      }

      return newSibling;
    }).filter((s) => s !== null) as typeof char.siblings;

    return { updatedFamily, updatedSiblings, deathMessages };
  };

  // === HANDLER PARA ESCOLHAS DE EVENTOS NPC ===
  const handleNpcEventChoice = (choiceId: string) => {
    if (!npcEvent.coworkerId || !npcEvent.event) return;

    const choice = npcEvent.event.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // ── Duel intercept ──────────────────────────────────────────────────────
    // If the chosen option triggers a duel, dismiss the NPC modal and open
    // the DuelModal with event-specific win/lose callbacks instead of the
    // default coworker-duel consequences.
    if (choice.triggersDuel && choice.duelOpponentId) {
      const opponentId = choice.duelOpponentId;
      const opponent = character?.currentJob?.coworkers?.find(c => c.id === opponentId);
      if (!opponent) return;

      // Apply the relationship/loyalty stats of the confrontation choice immediately
      // (these fire regardless of duel outcome — the fight already started)
      const immediateStats = choice.stats || {};
      if (Object.keys(immediateStats).length > 0) {
        setCharacter(prev => {
          if (!prev?.currentJob?.coworkers) return prev;
          const updatedCoworkers = prev.currentJob.coworkers.map(c =>
            c.id === opponentId
              ? {
                  ...c,
                  relationship: Math.max(0, Math.min(100, c.relationship + (immediateStats.relationship ?? 0))),
                  loyaltyScore: Math.max(-100, Math.min(100, (c.loyaltyScore ?? 0) + (immediateStats.loyalty ?? 0))),
                }
              : c
          );
          return { ...prev, currentJob: { ...prev.currentJob!, coworkers: updatedCoworkers } };
        });
      }

      // Dismiss the NPC event modal
      setNpcEvent({ isOpen: false });

      // Build event-specific duel resolution callbacks based on the choice ID
      const buildDuelCallbacks = (cId: string): { onWin: () => void; onLose: () => void } => {
        if (cId === 'GRAIN_CONFRONT') {
          return {
            onWin: () => {
              setCharacter(prev => prev ? { ...prev, honor: Math.min(100, prev.honor + 15) } : prev);
              addLog(`⚔️ Você enfrentou ${opponent.name} em duelo e provou sua inocência diante do feitor! Sua honra cresceu. (+15 Honra)`);
              addToEventLog(`Venceu duelo contra ${opponent.name} — acusação de roubo`, 'success');
            },
            onLose: () => {
              setCharacter(prev => prev ? {
                ...prev,
                health: Math.max(0, prev.health - 10),
                honor: Math.max(0, prev.honor - 10),
              } : prev);
              addLog(`⚔️ Você foi derrotado por ${opponent.name}. O feitor ficou do lado dele. Você recuou humilhado. (-10 Vitalidade, -10 Honra)`);
              addToEventLog(`Perdeu duelo contra ${opponent.name} — acusação de roubo`, 'fail');
            },
          };
        }
        if (cId === 'MATERIALS_CONFRONT') {
          return {
            onWin: () => {
              setCharacter(prev => prev ? { ...prev, honor: Math.min(100, prev.honor + 20) } : prev);
              addLog(`⚔️ Você derrotou ${opponent.name} e calou as calúnias! O mercado voltou a confiar em você. (+20 Honra)`);
              addToEventLog(`Venceu duelo contra ${opponent.name} — calúnia no mercado`, 'success');
            },
            onLose: () => {
              setCharacter(prev => prev ? {
                ...prev,
                honor: Math.max(0, prev.honor - 15),
                money: Math.max(0, prev.money - 5),
              } : prev);
              addLog(`⚔️ ${opponent.name} te derrotou na frente dos clientes. Sua reputação sofreu e você pagou 5 moedas para encerrar a questão. (-15 Honra, -5 Moedas)`);
              addToEventLog(`Perdeu duelo contra ${opponent.name} — calúnia no mercado`, 'fail');
            },
          };
        }
        // CONFRONT (RUMOR_SLANDER) — default
        return {
          onWin: () => {
            setCharacter(prev => prev ? { ...prev, honor: Math.min(100, prev.honor + 15) } : prev);
            addLog(`⚔️ Você confrontou ${opponent.name} e os rumores foram silenciados pela força da sua lâmina! (+15 Honra)`);
            addToEventLog(`Venceu duelo contra ${opponent.name} — rumores maliciosos`, 'success');
          },
          onLose: () => {
            setCharacter(prev => prev ? { ...prev, honor: Math.max(0, prev.honor - 20) } : prev);
            addLog(`⚔️ ${opponent.name} te derrotou. Os rumores se espalharam ainda mais pela cidade. (-20 Honra)`);
            addToEventLog(`Perdeu duelo contra ${opponent.name} — rumores maliciosos`, 'fail');
          },
        };
      };

      const { onWin, onLose } = buildDuelCallbacks(choiceId);

      setCurrentView('DASHBOARD');
      setDuelModal({
        isVisible: true,
        coworkerId: opponentId,
        opponentName: opponent.name,
        opponentStrength: opponent.strength ?? Math.floor(Math.random() * 61) + 30,
        onWin,
        onLose,
      });

      return; // Skip the normal stat-apply flow below
    }
    // ── End duel intercept ──────────────────────────────────────────────────

    const stats = choice.stats || {};
    let logMessage = '';
    let logType: 'success' | 'fail' | 'neutral' = 'neutral';

    // Get current character from state
    const currentChar = character;

    // Process special cases
    if (choiceId === 'HELP_YES') {
      logMessage = `🤝 Você ajudou ${npcEvent.coworkerName} a terminar as tarefas. Vocês trabalharam lado a lado até tarde, e agora ${npcEvent.coworkerName} é mais leal a você.`;
      logType = 'success';
    } else if (choiceId === 'HELP_NO') {
      logMessage = `❌ Você recusou ajudar ${npcEvent.coworkerName}. Eles pareceram desapontados e continuaram trabalhando sozinhos.`;
      logType = 'neutral';
    } else if (choiceId === 'TAVERN_YES') {
      logMessage = `🍺 Você foi à taverna com ${npcEvent.coworkerName}. Beberam, riram e fortaleceram sua amizade. Na manhã seguinte, a ressaca lembrou você do preço da diversão.`;
      logType = 'success';
    } else if (choiceId === 'TAVERN_NO') {
      logMessage = `🏠 Você recusou o convite de ${npcEvent.coworkerName} e foi direto para casa. Eles pareceram um pouco chateados.`;
      logType = 'neutral';
    } else if (choiceId === 'IGNORE') {
      logMessage = `🙏 Você ignorou os rumores espalhados por ${npcEvent.coworkerName}, confiando que a verdade prevaleceria. Sua fé se fortaleceu, mas alguns ainda acreditam nas mentiras.`;
      logType = 'neutral';
    } else if (choiceId === 'LEND_MONEY') {
      if (currentChar && currentChar.money >= 5) {
        logMessage = `💰 Você emprestou 5 moedas para ${npcEvent.coworkerName}. Eles ficaram profundamente gratos e prometeram lembrar de sua bondade.`;
        logType = 'success';
      } else {
        logMessage = `💰 Você não tem moedas suficientes para emprestar a ${npcEvent.coworkerName}.`;
        logType = 'fail';
        // Close modal and continue flow without applying money changes
        stats.money = 0;
        stats.relationship = -5;
        stats.honor = 0;
      }
    } else if (choiceId === 'REFUSE_MONEY') {
      logMessage = `🚫 Você recusou emprestar dinheiro a ${npcEvent.coworkerName}. Eles pareceram desapontados e se afastaram em silêncio.`;
      logType = 'fail';
    }
    // === PEASANT NPC EVENTS ===
    else if (choiceId === 'FIELD_HELP_YES') {
      logMessage = `🌾 Você ajudou ${npcEvent.coworkerName} a terminar o sulco, mesmo com as mãos doendo. Vocês terminaram o trabalho juntos e você ganhou o respeito da vila.`;
      logType = 'success';
    } else if (choiceId === 'FIELD_HELP_NO') {
      logMessage = `❌ Você negou ajuda a ${npcEvent.coworkerName}. Ele teve que terminar o sulco sozinho, exausto, e não esquecerá isso.`;
      logType = 'fail';
    } else if (choiceId === 'ALE_DRINK_YES') {
      logMessage = `🍶 Você bebeu cidra com ${npcEvent.coworkerName} atrás do celeiro. Boas risadas foram compartilhadas, mas a ressaca da manhã seguinte foi cruel.`;
      logType = 'success';
    } else if (choiceId === 'ALE_DRINK_NO') {
      logMessage = `🚶 Você recusou a cidra de ${npcEvent.coworkerName} e foi para casa. Eles beberam sozinhos, um pouco decepcionados com sua ausência.`;
      logType = 'neutral';
    } else if (choiceId === 'GRAIN_IGNORE') {
      logMessage = `🙄 Você ignorou a acusação de ${npcEvent.coworkerName}. Os rumores persistiram pelo campo e sua honra sofreu perante os outros camponeses.`;
      logType = 'fail';
    } else if (choiceId === 'TITHE_GIVE') {
      if (currentChar && currentChar.money >= 3) {
        logMessage = `🪙 Você deu 3 moedas a ${npcEvent.coworkerName} para o dízimo da igreja. Sua generosidade foi notada pelos vizinhos e você ganhou o respeito da vila.`;
        logType = 'success';
      } else {
        logMessage = `🪙 Você quis ajudar ${npcEvent.coworkerName}, mas não tinha moedas suficientes. Ele saiu cabisbaixo.`;
        logType = 'fail';
        stats.money = 0;
        stats.relationship = -3;
        stats.honor = 0;
      }
    } else if (choiceId === 'TITHE_DENY') {
      logMessage = `🚫 Você negou as moedas a ${npcEvent.coworkerName}. Ele guardou rancor e o clima entre vocês ficou pesado nos dias seguintes.`;
      logType = 'fail';
    }
    // === ARTISAN NPC EVENTS ===
    else if (choiceId === 'APPRENTICE_HELP_YES') {
      logMessage = `🔨 Você ajudou ${npcEvent.coworkerName} a terminar o entalhe da encomenda real. O trabalho ficou impecável e sua reputação na oficina cresceu.`;
      logType = 'success';
    } else if (choiceId === 'APPRENTICE_HELP_NO') {
      logMessage = `❌ Você negou ajuda a ${npcEvent.coworkerName}. Ele teve que entregar o trabalho incompleto e não esquecerá sua recusa.`;
      logType = 'fail';
    } else if (choiceId === 'GUILD_ATTEND_YES') {
      logMessage = `🦁 Você participou da reunião secreta com ${npcEvent.coworkerName} na Taverna do Leão. Sua reputação na guilda aumentou após a reunião com ${npcEvent.coworkerName}.`;
      logType = 'success';
    } else if (choiceId === 'GUILD_ATTEND_NO') {
      logMessage = `🚪 Você recusou o convite de ${npcEvent.coworkerName} para a reunião da guilda. Sua ausência foi notada pelos membros.`;
      logType = 'neutral';
    } else if (choiceId === 'MATERIALS_IGNORE') {
      logMessage = `🙄 Você ignorou as calúnias de ${npcEvent.coworkerName}. Os rumores se espalharam pelo mercado e sua honra como artesão sofreu um golpe severo.`;
      logType = 'fail';
    } else if (choiceId === 'TOOLS_LEND_YES') {
      if (currentChar && currentChar.money >= 10) {
        logMessage = `💰 Você emprestou 10 moedas a ${npcEvent.coworkerName} para reparar a ferramenta. Ele não foi expulso da oficina e jurou lealdade a você.`;
        logType = 'success';
      } else {
        logMessage = `💰 Você quis ajudar ${npcEvent.coworkerName}, mas não tinha moedas suficientes. Ele foi expulso da oficina e culpou você pela recusa.`;
        logType = 'fail';
        stats.money = 0;
        stats.relationship = -5;
        stats.honor = 0;
      }
    } else if (choiceId === 'TOOLS_LEND_NO') {
      logMessage = `🚫 Você negou o empréstimo a ${npcEvent.coworkerName}. Ele foi expulso da oficina e guarda rancor profundo de você.`;
      logType = 'fail';
    }
    // === NEW EVENTS: WORK_ACCIDENT / GOSSIP / EXTRA_SHIFT ===
    else if (choiceId === 'ACCIDENT_HELP') {
      logMessage = `🩹 Você rasgou um pedaço da sua camisa e estancou o sangramento de ${npcEvent.coworkerName}. Ele ficará com a cicatriz, mas estará vivo. Toda a vila soube da sua coragem.`;
      logType = 'success';
    } else if (choiceId === 'ACCIDENT_IGNORE') {
      logMessage = `😶 Você fingiu não ver enquanto ${npcEvent.coworkerName} sangrava. A história correu pelo local e os colegas passaram a te ver com outros olhos.`;
      logType = 'fail';
    } else if (choiceId === 'GOSSIP_DENY') {
      logMessage = `📢 Você confrontou o feitor abertamente e desmentiu as acusações. O feitor ficou constrangido. Alguns te respeitam mais; outros ficaram resentidos.`;
      logType = 'success';
    } else if (choiceId === 'GOSSIP_BRIBE') {
      if (currentChar && currentChar.money >= 5) {
        logMessage = `🪙 Você pagou para ${npcEvent.coworkerName} ficar quieto. O boato morreu antes de se espalhar demais.`;
        logType = 'neutral';
      } else {
        logMessage = `🪙 Você não tinha moedas suficientes para silenciar ${npcEvent.coworkerName}. O boato continuou a se espalhar.`;
        logType = 'fail';
        stats.money = 0;
        stats.relationship = -10;
      }
    } else if (choiceId === 'GOSSIP_IGNORE') {
      logMessage = `🙄 Você deixou os rumores correm. Alguns colegas passaram a te olhar com desconfiança; sua reputação no trabalho ficou estremecida.`;
      logType = 'fail';
    } else if (choiceId === 'EXTRA_SHIFT_YES') {
      logMessage = `🕯️ Você trabalhou a noite toda ao lado de ${npcEvent.coworkerName}, à luz de velas tremeluzentes. A encomenda ficou pronta antes do amanhecer e o feitor elogiou seu esforço.`;
      logType = 'success';
    } else if (choiceId === 'EXTRA_SHIFT_NO') {
      logMessage = `🏠 Você recusou o turno extra e foi para casa. Seus colegas que ficaram resmungaram sobre você no dia seguinte.`;
      logType = 'neutral';
    }

    // Apply stat changes and get updated character
    let updatedChar: Character | null = null;

    setCharacter(prev => {
      if (!prev || !prev.currentJob || !prev.currentJob.coworkers) return prev;

      // Update coworker relationship and loyalty (loyalty persists across years)
      const updatedCoworkers = prev.currentJob.coworkers.map(c => {
        if (c.id === npcEvent.coworkerId) {
          return {
            ...c,
            relationship: Math.max(0, Math.min(100, c.relationship + (stats.relationship || 0))),
            loyaltyScore: Math.max(-100, Math.min(100, (c.loyaltyScore ?? 0) + (stats.loyalty || 0))),
          };
        }
        return c;
      });

      updatedChar = {
        ...prev,
        currentJob: { ...prev.currentJob, coworkers: updatedCoworkers },
        health: Math.max(0, Math.min(100, prev.health + (stats.health || 0))),
        honor: Math.max(0, Math.min(100, prev.honor + (stats.honor || 0))),
        money: Math.max(0, prev.money + (stats.money || 0)),
        faith: Math.max(0, Math.min(100, (prev.faith || 0) + (stats.faith || 0))),
      };

      return updatedChar;
    });

    // Add log
    addLog(`\n${logMessage}\n`);
    addToEventLog(logMessage, logType);

    // Close modal
    setNpcEvent({ isOpen: false });

    // Continue with rest of ageUp flow
    setTimeout(() => {
      if (updatedChar) {
        checkForEvents(updatedChar);
      }
    }, 100);
  };

  // === GERAR EVENTOS REATIVOS DE CAMPONÊS ===
  const generatePeasantCoworkerEvent = (coworker: any, loyaltyScore: number = 0): SimpleEvent | null => {
    // Weight event pool by loyalty: hostile NPCs trigger more conflict, loyal NPCs help more
    let pool: string[];
    if (loyaltyScore < -50) {
      pool = ['CONFLICT_GRAIN', 'CONFLICT_GRAIN', 'HELP_FIELD', 'MONEY_COINS'];
    } else if (loyaltyScore > 80) {
      pool = ['HELP_FIELD', 'HELP_FIELD', 'SOCIAL_ALE', 'MONEY_COINS'];
    } else {
      pool = ['HELP_FIELD', 'SOCIAL_ALE', 'CONFLICT_GRAIN', 'MONEY_COINS'];
    }
    const eventType = pool[Math.floor(Math.random() * pool.length)];

    switch (eventType) {
      case 'HELP_FIELD':
        return {
          title: '🌾 Sulco no Campo',
          description: `${coworker.name} está com as mãos sangrando de tanto arar o campo e pediu para você terminar o sulco dele.`,
          choices: [
            {
              id: 'FIELD_HELP_YES',
              text: '✅ Ajudar',
              preview: '-15 Vitalidade | +20 Relacionamento',
              stats: { health: -15, relationship: 20, loyalty: 20 }
            },
            {
              id: 'FIELD_HELP_NO',
              text: '❌ Negar',
              preview: '-10 Relacionamento',
              stats: { relationship: -10, loyalty: -20 }
            }
          ]
        };

      case 'SOCIAL_ALE':
        return {
          title: '🍶 Cidra Atrás do Celeiro',
          description: `${coworker.name} achou uma garrafa de cidra barata e te chamou para beber atrás do celeiro.`,
          choices: [
            {
              id: 'ALE_DRINK_YES',
              text: '🍶 Beber',
              preview: '+10 Felicidade | -5 Vitalidade (Ressaca) | +15 Relacionamento',
              stats: { health: -5, relationship: 15, loyalty: 10 }
            },
            {
              id: 'ALE_DRINK_NO',
              text: '🚶 Recusar',
              preview: '-8 Relacionamento',
              stats: { relationship: -8, loyalty: -10 }
            }
          ]
        };

      case 'CONFLICT_GRAIN':
        return {
          title: '⚠️ Acusação de Roubo',
          description: `${coworker.name} te acusou na frente do feitor de estar roubando punhados de trigo da colheita!`,
          choices: [
            {
              id: 'GRAIN_CONFRONT',
              text: '⚔️ Confrontar em Duelo',
              preview: 'Vitória: +15 Honra | Derrota: -10 Vitalidade, -10 Honra',
              stats: { relationship: -15, loyalty: -15 },
              triggersDuel: true,
              duelOpponentId: coworker.id,
            },
            {
              id: 'GRAIN_IGNORE',
              text: '🙄 Ignorar',
              preview: '-20 Honra',
              stats: { honor: -20, loyalty: -5 }
            }
          ]
        };

      case 'MONEY_COINS':
        return {
          title: '💰 Dízimo da Igreja',
          description: `${coworker.name} diz que não tem moedas suficientes para o dízimo da igreja e implora por 3 moedas.`,
          choices: [
            {
              id: 'TITHE_GIVE',
              text: '🪙 Dar 3 moedas',
              preview: '-3 💰 | +15 Relacionamento | +5 Honra',
              stats: { money: -3, relationship: 15, honor: 5, loyalty: 20 }
            },
            {
              id: 'TITHE_DENY',
              text: '🚫 Negar',
              preview: '-10 Relacionamento | +Rancor',
              stats: { relationship: -10, loyalty: -25 }
            }
          ]
        };

      default:
        return null;
    }
  };

  // === GERAR EVENTOS REATIVOS DE ARTESÃO ===
  const generateArtisanCoworkerEvent = (coworker: any, loyaltyScore: number = 0): SimpleEvent | null => {
    let pool: string[];
    if (loyaltyScore < -50) {
      pool = ['CONFLICT_MATERIALS', 'CONFLICT_MATERIALS', 'HELP_APPRENTICE', 'MONEY_TOOLS'];
    } else if (loyaltyScore > 80) {
      pool = ['HELP_APPRENTICE', 'HELP_APPRENTICE', 'SOCIAL_GUILD', 'MONEY_TOOLS'];
    } else {
      pool = ['HELP_APPRENTICE', 'SOCIAL_GUILD', 'CONFLICT_MATERIALS', 'MONEY_TOOLS'];
    }
    const eventType = pool[Math.floor(Math.random() * pool.length)];

    switch (eventType) {
      case 'HELP_APPRENTICE':
        return {
          title: '🔨 Encomenda Atrasada',
          description: `${coworker.name} está com uma encomenda real atrasada e o aprendiz dele fugiu. Ele implora que você ajude a terminar o entalhe.`,
          choices: [
            {
              id: 'APPRENTICE_HELP_YES',
              text: '✅ Ajudar',
              preview: '-10 Vitalidade | +25 Relacionamento | +10 Honra',
              stats: { health: -10, relationship: 25, honor: 10, loyalty: 20 }
            },
            {
              id: 'APPRENTICE_HELP_NO',
              text: '❌ Negar',
              preview: '-10 Relacionamento',
              stats: { relationship: -10, loyalty: -20 }
            }
          ]
        };

      case 'SOCIAL_GUILD':
        return {
          title: '🦁 Reunião Secreta da Guilda',
          description: `${coworker.name} te convidou para uma reunião secreta na Taverna do Leão para discutir os novos preços da guilda.`,
          choices: [
            {
              id: 'GUILD_ATTEND_YES',
              text: '🍺 Participar',
              preview: '-8 Moedas | +20 Relacionamento | +10 Honra',
              stats: { money: -8, relationship: 20, honor: 10, loyalty: 15 }
            },
            {
              id: 'GUILD_ATTEND_NO',
              text: '🚪 Recusar',
              preview: '-8 Relacionamento',
              stats: { relationship: -8, loyalty: -10 }
            }
          ]
        };

      case 'CONFLICT_MATERIALS':
        return {
          title: '😡 Calúnia no Mercado',
          description: `${coworker.name} espalhou pelo mercado que você está usando madeira podre e ferro barato em suas criações.`,
          choices: [
            {
              id: 'MATERIALS_CONFRONT',
              text: '⚔️ Confrontar em Duelo',
              preview: 'Vitória: +20 Honra | Derrota: -15 Honra, -5 Moedas',
              stats: { relationship: -15, loyalty: -15 },
              triggersDuel: true,
              duelOpponentId: coworker.id,
            },
            {
              id: 'MATERIALS_IGNORE',
              text: '🙄 Ignorar',
              preview: '-25 Honra',
              stats: { honor: -25, loyalty: -5 }
            }
          ]
        };

      case 'MONEY_TOOLS':
        return {
          title: '🔧 Ferramenta Quebrada',
          description: `${coworker.name} quebrou a principal ferramenta de trabalho e pede 10 moedas emprestadas para não ser expulso da oficina.`,
          choices: [
            {
              id: 'TOOLS_LEND_YES',
              text: '💰 Emprestar 10 moedas',
              preview: '-10 Moedas | +20 Relacionamento | +5 Honra',
              stats: { money: -10, relationship: 20, honor: 5, loyalty: 20 }
            },
            {
              id: 'TOOLS_LEND_NO',
              text: '🚫 Negar',
              preview: '-10 Relacionamento | +Rancor',
              stats: { relationship: -10, loyalty: -25 }
            }
          ]
        };

      default:
        return null;
    }
  };

  // === GERAR EVENTOS REATIVOS DE COLEGAS ===
  const generateCoworkerReactiveEvent = (coworker: any): SimpleEvent | null => {
    const eventTypes = [
      'HELP_REQUEST', 'SOCIAL_INVITE', 'RUMOR_SLANDER', 'MONEY_REQUEST',
      'WORK_ACCIDENT', 'GOSSIP', 'EXTRA_SHIFT',
    ];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    switch (eventType) {
      case 'HELP_REQUEST':
        return {
          title: '🤝 Pedido de Ajuda',
          description: `${coworker.name} se aproxima de você ao final do dia, parecendo exausto.\n\n"${character?.name}, estou sobrecarregado com as tarefas. Você poderia me ajudar a terminar isso antes do supervisor chegar?"`,
          choices: [
            {
              id: 'HELP_YES',
              text: '✅ Sim, vou ajudar',
              preview: '-10 Vitalidade | +15 Relacionamento',
              stats: { health: -10, relationship: 15 }
            },
            {
              id: 'HELP_NO',
              text: '❌ Não, termine você mesmo',
              preview: '-5 Relacionamento',
              stats: { relationship: -5 }
            }
          ]
        };

      case 'SOCIAL_INVITE':
        return {
          title: '🍺 Convite para a Taverna',
          description: `${coworker.name} te para no caminho de casa.\n\n"Ei, ${character?.name}! Vamos à taverna hoje? Uns tragos nos farão bem depois deste dia árduo."`,
          choices: [
            {
              id: 'TAVERN_YES',
              text: '🍺 Aceitar o convite',
              preview: '-3 💰 | +10 Relacionamento | -5 Vitalidade (ressaca)',
              stats: { money: -3, relationship: 10, health: -5 }
            },
            {
              id: 'TAVERN_NO',
              text: '🏠 Recusar e ir para casa',
              preview: '-2 Relacionamento',
              stats: { relationship: -2 }
            }
          ]
        };

      case 'RUMOR_SLANDER':
        return {
          title: '😠 Rumores Maliciosos',
          description: `Um colega de trabalho te puxa de lado, preocupado.\n\n"${character?.name}, você precisa saber... ${coworker.name} anda espalhando mentiras sobre sua família pela cidade. Dizem que sua linhagem é desonrada!"`,
          choices: [
            {
              id: 'CONFRONT',
              text: '⚔️ Confrontar em Duelo',
              preview: 'Vitória: +15 Honra, silencia os rumores | Derrota: -20 Honra',
              stats: { relationship: -20 },
              triggersDuel: true,
              duelOpponentId: coworker.id,
            },
            {
              id: 'IGNORE',
              text: '🙏 Ignorar e ter fé na verdade',
              preview: '+5 Fé | -10 Honra (rumores persistem)',
              stats: { faith: 5, honor: -10, relationship: -5 }
            }
          ]
        };

      case 'MONEY_REQUEST':
        return {
          title: '💸 Pedido de Empréstimo',
          description: `${coworker.name} se aproxima discretamente durante o intervalo.\n\n"${character?.name}, estou numa situação difícil... Minha família precisa de comida urgente. Você poderia emprestar 5 moedas? Prometo devolver no próximo mês!"`,
          choices: [
            {
              id: 'LEND_MONEY',
              text: '💰 Emprestar 5 moedas',
              preview: '-5 💰 | +20 Relacionamento | +5 Honra',
              stats: { money: -5, relationship: 20, honor: 5 }
            },
            {
              id: 'REFUSE_MONEY',
              text: '🚫 Recusar o pedido',
              preview: '-10 Relacionamento',
              stats: { relationship: -10 }
            }
          ]
        };

      case 'WORK_ACCIDENT':
        return {
          title: '🩸 Acidente de Trabalho',
          description: `Um grito atravessa o local de trabalho. ${coworker.name} cortou a mão com uma ferramenta e está sangrando muito. Os outros colegas se afastam, com medo de se complicar com o feitor.\n\n"Alguém me ajuda, pelo amor de Deus!"`,
          choices: [
            {
              id: 'ACCIDENT_HELP',
              text: '🩹 Ajudar e estancar o sangramento',
              preview: '-5 Vitalidade | +25 Relacionamento | +10 Honra',
              stats: { health: -5, relationship: 25, honor: 10, loyalty: 30 },
            },
            {
              id: 'ACCIDENT_IGNORE',
              text: '😶 Fingir que não viu',
              preview: '-15 Honra | -20 Relacionamento',
              stats: { honor: -15, relationship: -20, loyalty: -30 },
            },
          ],
        };

      case 'GOSSIP':
        return {
          title: '🗣️ Fofoca no Local de Trabalho',
          description: `${coworker.name} te puxa para um canto e sussurra:\n\n"Ouvi dizer que o feitor está planejando reduzir o pagamento de todos. E ainda dizem que foi ${character?.name || 'você'} quem sugeriu a ideia ao senhor para subir de posto..."\n\nAs palavras se espalharam. Os outros colegas te olham de lado.`,
          choices: [
            {
              id: 'GOSSIP_DENY',
              text: '📢 Desmentir publicamente e enfrentar o feitor',
              preview: '+15 Honra | -5 Vitalidade (estresse)',
              stats: { honor: 15, health: -5, loyalty: 10 },
            },
            {
              id: 'GOSSIP_BRIBE',
              text: '🪙 Pagar 5 moedas para ${coworker.name} silenciar',
              preview: '-5 💰 | +10 Relacionamento | boato abafado',
              stats: { money: -5, relationship: 10, loyalty: 5 },
            },
            {
              id: 'GOSSIP_IGNORE',
              text: '🙄 Ignorar e esperar que passe',
              preview: '-10 Honra | rumores persistem',
              stats: { honor: -10, relationship: -5 },
            },
          ],
        };

      case 'EXTRA_SHIFT':
        return {
          title: '🌑 Turno Extra Noturno',
          description: `O feitor chama a todos ainda antes do anoitecer:\n\n"O senhor precisa da encomenda pronta amanhã. Quem ficar esta noite ganha o dobro do dia — mas não terá descanso até o amanhecer."\n\n${coworker.name} já estendeu a mão para pegar a lanterna.`,
          choices: [
            {
              id: 'EXTRA_SHIFT_YES',
              text: '🕯️ Ficar e trabalhar a noite toda',
              preview: `-20 Vitalidade | +${Math.floor(Math.random() * 5) + 8} 💰 | +10 Honra (esforço reconhecido)`,
              stats: { health: -20, money: 10, honor: 10, loyalty: 10 },
            },
            {
              id: 'EXTRA_SHIFT_NO',
              text: '🏠 Recusar e ir para casa descansar',
              preview: '-8 Honra | -5 Relacionamento (visto como fraco)',
              stats: { honor: -8, relationship: -5, loyalty: -5 },
            },
          ],
        };

      default:
        return null;
    }
  };

  // === PROMOVER COLEGA A INIMIGO GLOBAL ===
  // Returns the same array reference if the coworker is already registered (no mutation).
  const promoteToEnemy = (
    current: GlobalEnemy[],
    id: string,
    coworker?: { name?: string; age?: number; emoji?: string; strength?: number } | null
  ): GlobalEnemy[] => {
    if (!coworker || current.some(e => e.id === id)) return current;
    return [
      ...current,
      {
        id,
        name: coworker.name ?? 'Desconhecido',
        type: 'ENEMY' as const,
        age: coworker.age ?? 30,
        emoji: coworker.emoji ?? '😡',
        strength: coworker.strength ?? 50,
        relationshipLevel: 0,
      },
    ];
  };

  // === AVANÇAR IDADE ===
  const ageUp = () => {
    if (!character || waitingForChoice) return;

    const newAge = character.age + 1;
    const newYear = character.currentYear + 1;

    // Verifica mudança de era
    const newEra = didEraChange(character.location, character.currentYear, newYear);
    if (newEra) {
      addLog(`\n⚡ ==== NOVA ERA ====`);
      addLog(`Você entrou na ${newEra.name}!`);
      addLog(`${newEra.description}`);
      addLog(`================\n`);
    }

    // Processar envelhecimento da família
    const { updatedFamily, updatedSiblings, deathMessages } = processFamilyTurn(character);

    // Atualiza ano, era, família e irmãos
    const updatedCharacter = {
      ...character,
      age: newAge,
      currentYear: newYear,
      era: (getCurrentEra(character.location, newYear)?.id as Era) || character.era,
      family: updatedFamily,
      siblings: updatedSiblings,
      partnerActionsThisYear: [], // reset do cooldown anual
      childActionsThisYear: [], // reset do cooldown anual de filhos
      children: (character.children ?? []).map(c => ({ ...c, age: c.age + 1 })),
    };

    // === ASSET UPKEEP & STAT BONUSES ===
    let charAfterUpkeep = { ...updatedCharacter };
    const survivingInventory: typeof updatedCharacter.inventory = [];
    for (const item of updatedCharacter.inventory) {
      if (item.type === 'ASSET') {
        // Apply upkeep cost first
        if (item.upkeepCost && item.upkeepCost > 0) {
          if (charAfterUpkeep.money < item.upkeepCost) {
            addLog(`⚠️ Você não conseguiu sustentar seu ${item.name} e o perdeu.`);
            continue; // drop item
          }
          charAfterUpkeep.money -= item.upkeepCost;
        }
        // Apply annual stat bonuses
        if (item.statModifiers) {
          const m = item.statModifiers;
          if (m.health)   charAfterUpkeep.health   = Math.min(100, charAfterUpkeep.health + m.health);
          if (m.strength) charAfterUpkeep.strength  = Math.min(100, (charAfterUpkeep.strength ?? 0) + m.strength);
          if (m.honor)    charAfterUpkeep.honor     = Math.min(100, charAfterUpkeep.honor + m.honor);
          if (m.faith)    charAfterUpkeep.faith     = Math.min(100, (charAfterUpkeep.faith ?? 0) + m.faith);
          if (m.money)    charAfterUpkeep.money     = Math.max(0, charAfterUpkeep.money + m.money);
        }
        // Apply passive income
        if (item.income && item.income > 0) {
          charAfterUpkeep.money += item.income;
          addLog(`💰 Seu(Sua) ${item.name} gerou ${item.income} moedas de lucro este ano.`);
        }
        survivingInventory.push(item);
      } else {
        survivingInventory.push(item);
      }
    }
    charAfterUpkeep.inventory = survivingInventory;

    setCharacter(charAfterUpkeep);
    setCurrentMarketItems(generateMarketItems(charAfterUpkeep.socialClass));
    addLog(`→ Idade: ${newAge} anos | Ano: ${newYear}`);

    // Mostrar mensagens de morte
    deathMessages.forEach((msg) => {
      addLog(msg);
    });

    // Gerar colegas quando atinge 6 anos
    if (newAge === 6 && (!character.classmates || character.classmates.length === 0)) {
      const newClassmates = generateClassmates(character.socialClass);
      setCharacter((prev) => {
        if (!prev) return prev;
        return { ...prev, classmates: newClassmates };
      });
      addLog(`🎓 Você começou a conhecer outras crianças!`);
    }

    // Transição para vida adulta aos 13 anos
    if (newAge === 13) {
      addLog(`\n⚔️ ==== MAIORIDADE ====`);
      addLog(`Sua infância acabou. É hora de assumir responsabilidades reais e sustentar sua linhagem.`);
      addLog(`Novos trabalhos adultos estão disponíveis na aba Ocupação.`);
      addLog(`==================\n`);
    }

    // === PROCESSAR EFEITOS DO EMPREGO ATUAL ===
    if (updatedCharacter.currentJob) {
      const job = updatedCharacter.currentJob;

      // Apply annual job effects
      let newHealth = updatedCharacter.health + job.vitalityImpact;
      const newMoney = updatedCharacter.money + job.income;
      const newStrength = (updatedCharacter.strength || 0) + (job.strengthImpact || 0);
      const newHonor = updatedCharacter.honor + (job.honorImpact || 0);
      const newFaith = (updatedCharacter.faith || 0) + (job.faithImpact || 0);

      // Check for death by exhaustion
      if (newHealth <= 0) {
        addLog(`\n💀 ==== EXAUSTÃO FATAL ====`);
        addLog(`O trabalho como ${job.title} drenou suas últimas forças.`);
        addLog(`Você morreu de exaustão por trabalho escravo aos ${newAge} anos.`);
        addLog(`========================\n`);

        setTimeout(() => {
          Alert.alert(
            '💀 Morte por Exaustão',
            `${updatedCharacter.name} ${updatedCharacter.surname} morreu de exaustão trabalhando como ${job.title} aos ${newAge} anos.\n\nO trabalho árduo cobrou seu preço final.`,
            [{ text: 'Recomeçar', onPress: () => startNewLife() }]
          );
        }, 100);

        setCharacter({
          ...updatedCharacter,
          health: 0,
        });
        return;
      }

      // Apply effects
      updatedCharacter.health = Math.max(0, Math.min(100, newHealth));
      updatedCharacter.money = Math.max(0, newMoney);
      updatedCharacter.strength = Math.max(0, Math.min(100, newStrength));
      updatedCharacter.honor = Math.max(0, Math.min(100, newHonor));
      updatedCharacter.faith = Math.max(0, Math.min(100, newFaith));

      // Log annual work effects
      addLog(`\n💼 Trabalho: ${job.emoji} ${job.title}`);

      // Build experience summary
      const experienceGains = [];
      if (job.strengthImpact) experienceGains.push(`${Math.abs(job.strengthImpact)} de Força`);
      if (job.honorImpact) experienceGains.push(`${Math.abs(job.honorImpact)} de Honra`);
      if (job.faithImpact) experienceGains.push(`${Math.abs(job.faithImpact)} de Fé`);

      const experienceText = experienceGains.length > 0 ? ` e ${experienceGains.join(', ')} de experiência` : '';
      addLog(`  📈 Seu trabalho como ${job.title} rendeu ${job.income} moedas${experienceText}.`);

      // Detailed breakdown
      if (job.income > 0) addLog(`  💰 Salário recebido: ${job.income} moedas.`);
      if (job.vitalityImpact !== 0) {
        addLog(`  ❤️ O trabalho ${job.vitalityImpact > 0 ? 'revigorou' : 'desgastou'} sua vitalidade em ${Math.abs(job.vitalityImpact)} pontos.`);
      }
      if (job.strengthImpact) {
        addLog(`  💪 Força ${job.strengthImpact > 0 ? 'aumentou' : 'diminuiu'} em ${Math.abs(job.strengthImpact)} pontos.`);
      }
      if (job.honorImpact) {
        addLog(`  🛡 Honra ${job.honorImpact > 0 ? 'aumentou' : 'diminuiu'} em ${Math.abs(job.honorImpact)} pontos.`);
      }
      if (job.faithImpact) {
        addLog(`  ⛪ Fé ${job.faithImpact > 0 ? 'fortaleceu' : 'enfraqueceu'} em ${Math.abs(job.faithImpact)} pontos.`);
      }

      // === COWORKER AGING & MORTALITY (inside job block, same setCharacter call) ===
      if (updatedCharacter.currentJob?.coworkers) {
        const agedCoworkers = updatedCharacter.currentJob.coworkers.map(c => ({
          ...c,
          age: (c.age || 30) + 1,
        }));

        const survivingCoworkers: typeof agedCoworkers = [];
        let replacementIndex = agedCoworkers.length;

        for (const cw of agedCoworkers) {
          // Growing mortality chance above 45 — 1500s life expectancy
          let deathChance = 0;
          if (cw.age > 65)      deathChance = 0.60;
          else if (cw.age > 55) deathChance = 0.20;
          else if (cw.age > 45) deathChance = 0.05;

          if (deathChance > 0 && Math.random() < deathChance) {
            const cause = cw.age > 55 ? 'faleceu de febre' : 'se aposentou por cansaço';
            addLog(`👴 Seu colega ${cw.name} ${cause} aos ${cw.age} anos.`);
            // Replace with a young newcomer so the workplace stays populated
            survivingCoworkers.push(
              generateSingleCoworker(updatedCharacter.socialClass, replacementIndex++, true)
            );
          } else {
            survivingCoworkers.push(cw);
          }
        }

        updatedCharacter.currentJob = {
          ...updatedCharacter.currentJob,
          coworkers: survivingCoworkers,
        };
      }

      setCharacter(updatedCharacter);
    }

    // === GLOBAL ENEMIES AGING & MORTALITY ===
    if ((updatedCharacter.globalEnemies ?? []).length > 0) {
      const ANGRY_EMOJIS = ['😡', '🗡️', '💀', '😤', '👿', '🔪'];
      const pickAngryEmoji = () => ANGRY_EMOJIS[Math.floor(Math.random() * ANGRY_EMOJIS.length)];

      const agedEnemies = updatedCharacter.globalEnemies.map(e => ({ ...e, age: e.age + 1 }));
      const survivingEnemies: typeof agedEnemies = [];

      for (const enemy of agedEnemies) {
        let deathChance = 0;
        if (enemy.age > 65)      deathChance = 0.60;
        else if (enemy.age > 55) deathChance = 0.20;
        else if (enemy.age > 45) deathChance = 0.05;

        if (deathChance > 0 && Math.random() < deathChance) {
          // 50% chance to spawn a vengeful heir (Generational Grudge)
          if (Math.random() < 0.5) {
            const heirRelation = Math.random() < 0.5 ? 'Filho' : 'Irmão';
            const heirName = `${heirRelation} de ${enemy.name}`;
            const heirAge = 16 + Math.floor(Math.random() * 15); // 16–30
            const heir: GlobalEnemy = {
              id: `heir_${enemy.id}_${Date.now()}`,
              name: heirName,
              type: 'ENEMY',
              age: heirAge,
              emoji: enemy.emoji || pickAngryEmoji(),
              strength: 30 + Math.floor(Math.random() * 51), // 30–80 (young and driven)
              relationshipLevel: 0,
            };
            survivingEnemies.push(heir);
            const grudgeMsg = `⚰️ Seu inimigo ${enemy.name} morreu aos ${enemy.age} anos, mas em seu leito de morte fez seu herdeiro jurar vingança contra você! ${heirName} agora é seu inimigo.`;
            addLog(grudgeMsg);
            addToEventLog(grudgeMsg, 'fail');
          } else {
            // Peaceful death — no heir
            const peaceMsg = `⚰️ Seu inimigo ${enemy.name} morreu de velhice aos ${enemy.age} anos. Você finalmente tem paz.`;
            addLog(peaceMsg);
            addToEventLog(peaceMsg, 'neutral');
          }
        } else {
          survivingEnemies.push(enemy);
        }
      }

      updatedCharacter.globalEnemies = survivingEnemies;
      setCharacter({ ...updatedCharacter });
    }

    // === NPC REACTIVE EVENTS (COWORKERS) ===
    // 20% chance for each coworker to trigger a reactive event
    if (updatedCharacter.currentJob && updatedCharacter.currentJob.coworkers && updatedCharacter.currentJob.coworkers.length > 0) {
      for (const coworker of updatedCharacter.currentJob.coworkers) {
        const loyalty = coworker.loyaltyScore ?? 0;
        // Hostile NPCs (loyalty < -50) have a 50% chance; normal is 20%
        const triggerChance = loyalty < -50 ? 0.50 : 0.20;
        if (Math.random() < triggerChance) {
          const reactiveEvent = updatedCharacter.socialClass === 'peasant'
            ? generatePeasantCoworkerEvent(coworker, loyalty)
            : updatedCharacter.socialClass === 'artisan'
              ? generateArtisanCoworkerEvent(coworker, loyalty)
              : generateCoworkerReactiveEvent(coworker);
          if (reactiveEvent) {
            // Store the event and coworker info
            setNpcEvent({
              isOpen: true,
              coworkerId: coworker.id,
              coworkerName: coworker.name,
              eventType: reactiveEvent.title,
              event: reactiveEvent
            });
            // Stop processing - only one event per turn
            return;
          }
        }
      }
    }

    // === PROMOÇÃO POR MESTRE/CHEFE ===
    // If a Mestre/Chefe has relationship > 90, they offer the player a better job
    if (updatedCharacter.currentJob?.coworkers && (updatedCharacter.socialClass === 'peasant' || updatedCharacter.socialClass === 'artisan')) {
      const masterRoles = ['Mestre', 'Mestre Artesão', 'Chefe'];
      const masterWithHighRelation = updatedCharacter.currentJob.coworkers.find(
        c => masterRoles.includes(c.role) && c.relationship > 90
      );

      if (masterWithHighRelation) {
        const promotionMap: Record<string, { id: string; title: string; emoji: string; income: number; vitalityImpact: number; strengthImpact?: number; honorImpact?: number; faithImpact?: number } | null> = {
          // Peasant progression
          shepherd:     { id: 'field_plower',   title: 'Lavrador de Campo',    emoji: '🌾', income: 5,  vitalityImpact: -10, strengthImpact: 2 },
          field_plower: null, // Top peasant tier
          // Artisan progression
          market_trader: { id: 'craft_officer', title: 'Oficial de Ofício',    emoji: '🔨', income: 12, vitalityImpact: -8,  honorImpact: 5 },
          craft_officer: null, // Top artisan tier
        };

        const nextJob = promotionMap[updatedCharacter.currentJob.id];
        if (nextJob) {
          // Check player meets requirements for next job
          const meetsReq = nextJob.id === 'field_plower'
            ? (updatedCharacter.strength ?? 0) >= 30
            : nextJob.id === 'craft_officer'
              ? updatedCharacter.honor >= 50
              : true;

          if (meetsReq) {
            const promotedCoworkers = generateCoworkers(nextJob.title, updatedCharacter.socialClass);
            const promotedJob = { ...nextJob, coworkers: promotedCoworkers };

            const charAfterPromotion = { ...updatedCharacter, currentJob: promotedJob };
            setCharacter(charAfterPromotion);

            addLog(`\n🌟 ==== PROMOÇÃO ====`);
            addLog(`Seu mestre ${masterWithHighRelation.name} está impressionado com sua lealdade e te ofereceu o cargo de ${nextJob.emoji} ${nextJob.title}!`);
            addLog(`Sua dedicação foi reconhecida. Você começa imediatamente no novo posto.`);
            addLog(`===================\n`);
            addToEventLog(`Promovido a ${nextJob.title} por ${masterWithHighRelation.name}`, 'success');

            // Continue event check with the updated character
            checkForEvents(charAfterPromotion);
            return;
          }
        }
      }
    }

    // === NASCIMENTO DE FILHO (gravidez pendente) ===
    if (updatedCharacter.pendingPregnancy) {
      setCharacter(updatedCharacter);
      pendingBirthCharRef.current = updatedCharacter;
      setShowBirthModal(true);
      return;
    }

    // === NASCIMENTO DE IRMÃO ===
    // Chance de 15% se mãe viva e fértil (< 45 anos)
    if (updatedFamily.motherAlive && updatedFamily.motherAge < 45 && Math.random() < 0.15) {
      const isBoy = Math.random() > 0.5;
      const siblingNames = isBoy ? ENGLISH_NAMES.male : ENGLISH_NAMES.female;
      const siblingName = siblingNames[Math.floor(Math.random() * siblingNames.length)];

      const newSibling = {
        id: `sibling_${Date.now()}`,
        name: siblingName,
        gender: isBoy ? 'male' as const : 'female' as const,
        age: 0,
        relationship: 50,
        stats: generateNPCStats(updatedCharacter.socialClass),
      };

      const charWithSibling = {
        ...updatedCharacter,
        siblings: [...updatedCharacter.siblings, newSibling],
      };

      setCharacter(charWithSibling);
      addLog(`👶 Sua mãe deu à luz a um bebê saudável: ${siblingName}!`);

      // Mostrar modal e adiar checkForEvents
      pendingEventsCharRef.current = charWithSibling;
      setSiblingBirthModal({ isOpen: true, name: siblingName, gender: isBoy ? 'male' : 'female' });
      return;
    }

    // Verifica eventos (ordem de prioridade)
    checkForEvents(updatedCharacter);
  };

  // === VERIFICAR EVENTOS ===
  const checkForEvents = (char: Character) => {
    // 1. PRIORIDADE: Eventos Históricos
    const historicalEvent = checkHistoricalEvent(char.currentYear, char.location, char);
    if (historicalEvent) {
      showEventModal(historicalEvent, 'historical');
      return;
    }

    // 2. EVENTOS DE INFÂNCIA (0-12 anos)
    if (char.age <= 12) {
      const childhoodEvent = getChildhoodEventByClass(char);
      if (childhoodEvent) {
        // Registra evento como usado para evitar repetição
        setCharacter((prev) => prev ? {
          ...prev,
          usedChildhoodEvents: [...prev.usedChildhoodEvents, childhoodEvent.id],
        } : prev);
        showEventModal(childhoodEvent, 'childhood');
        return;
      }
    }

    // 3. Eventos Aleatórios da Era (30% de chance de um evento temático da era)
    const era = getCurrentEra(char.location, char.currentYear);
    if (era && Math.random() < 0.30) {
      const randomEvent = getRandomEvent(era.tags, char.age, char.recentEventIds);
      if (randomEvent) {
        let passesConditions = true;
        if (randomEvent.conditions) {
          const { gender, minMoney } = randomEvent.conditions;
          if (gender && char.gender !== gender) passesConditions = false;
          if (minMoney && char.money < minMoney) passesConditions = false;
        }
        if (passesConditions) {
          const RECENT_MEMORY = 15;
          setCharacter((prev) => prev ? {
            ...prev,
            recentEventIds: [...prev.recentEventIds, randomEvent.id].slice(-RECENT_MEMORY),
          } : prev);
          const filteredEvent = {
            ...randomEvent,
            options: filterChoicesForAge(randomEvent.options, char.age),
          };
          showEventModal(filteredEvent, 'random');
          return;
        }
      }
    }

    // 4. Evento aleatório do pool principal (sempre executa se nada acima disparou)
    continueNormalYear();
  };

  // === ANO NORMAL (SEM EVENTOS) ===
  const continueNormalYear = () => {
    if (!character) {
      addLog(`Você passou mais um ano. A vida continua.`);
      return;
    }

    if (Math.random() < 1.0) {
      // Combina pool base com pool adulto de camponeses (quando aplicável)
      const isAdultPeasant = character.age >= 13 && character.socialClass === 'peasant';
      const eventPool = isAdultPeasant
        ? [...SIMPLE_RANDOM_EVENTS, ...PEASANT_ADULT_EVENTS]
        : SIMPLE_RANDOM_EVENTS;

      const RECENT_MEMORY = 15;
      const recentSet = new Set(character.recentEventIds);

      // Filtra eventos válidos para idade, classe e memória recente
      const availableEvents = eventPool.filter((event) => {
        if (event.minAge && character.age < event.minAge) return false;
        if (event.maxAge && character.age > event.maxAge) return false;
        if (event.socialClasses && !event.socialClasses.includes(character.socialClass)) return false;
        if (recentSet.has(event.id)) return false;
        return true;
      });

      const fallback: RandomGameEvent = character.age <= 4
        ? { id: 'baby_calm', title: '😴 Dia Tranquilo', description: 'Você passou o dia no colo da sua mãe.', choices: [{ label: 'Dormir', consequence: 'Você dormiu tranquilamente.', effect: { vitality: 1 } }] }
        : { id: 'fallback', title: '☀️ Um dia comum', description: 'Nada de especial aconteceu hoje.', choices: [{ label: 'Continuar', consequence: 'Você seguiu com sua vida.', effect: {} }] };

      const randomEvent = availableEvents.length > 0
        ? availableEvents[Math.floor(Math.random() * availableEvents.length)]
        : fallback;

      // Atualiza o sliding window (não registra o fallback)
      if (randomEvent.id !== 'baby_calm' && randomEvent.id !== 'fallback') {
        setCharacter((prev) => prev ? {
          ...prev,
          recentEventIds: [...prev.recentEventIds, randomEvent.id].slice(-RECENT_MEMORY),
        } : prev);
      }

      setSimpleEvent(randomEvent);
      setWaitingForChoice(true);
      addLog(`\n${randomEvent.title}`);
      addLog(randomEvent.description);
    } else {
      addLog('Ano tranquilo sem grandes acontecimentos.');
    }
  };

  // === MOSTRAR MODAL DE EVENTO ===
  const showEventModal = (event: HistoricalEvent | RandomEvent | ChildhoodEvent, type: 'historical' | 'random' | 'childhood') => {
    setCurrentEvent(event);
    setWaitingForChoice(true);
    addLog(`\n${event.title}`);
    addLog(event.description);
  };

  // === ESCOLHER OPÇÃO DO EVENTO ===
  const chooseOption = (option: any) => {
    if (!character) return;

    // Duel intercept — open DuelModal instead of resolving instantly
    if (option.triggersDuel) {
      setCurrentEvent(null);
      setWaitingForChoice(false);
      const opponentStrength = Math.floor(Math.random() * 51) + 30; // 30–80
      setDuelModal({ isVisible: true, opponentName: 'Desafiante', opponentStrength });
      return;
    }

    const { result } = option;
    addLog(`→ ${option.text}`);
    addLog(result.message);

    // Aplicar mudanças
    const updatedChar = { ...character };

    if (result.healthChange) {
      updatedChar.health = Math.max(0, Math.min(100, updatedChar.health + result.healthChange));
      if (result.healthChange > 0) addLog(`  ❤️ +${result.healthChange} Vitalidade`);
      else addLog(`  ❤️ ${result.healthChange} Vitalidade`);
    }

    if (result.sanityChange) {
      updatedChar.sanity = Math.max(0, Math.min(100, updatedChar.sanity + result.sanityChange));
      if (result.sanityChange > 0) addLog(`  🧠 +${result.sanityChange} Sanidade`);
      else addLog(`  🧠 ${result.sanityChange} Sanidade`);
    }

    if (result.honorChange) {
      updatedChar.honor = Math.max(0, Math.min(100, updatedChar.honor + result.honorChange));
      if (result.honorChange > 0) addLog(`  🛡 +${result.honorChange} Honra`);
      else addLog(`  🛡 ${result.honorChange} Honra`);
    }

    if (result.intelligenceChange) {
      updatedChar.intelligence = Math.max(0, Math.min(100, updatedChar.intelligence + result.intelligenceChange));
      if (result.intelligenceChange > 0) addLog(`  📖 +${result.intelligenceChange} Inteligência`);
      else addLog(`  📖 ${result.intelligenceChange} Inteligência`);
    }

    if (result.faithChange && updatedChar.faith !== undefined) {
      updatedChar.faith = Math.max(0, Math.min(100, updatedChar.faith + result.faithChange));
      if (result.faithChange > 0) addLog(`  ⛪ +${result.faithChange} Fé`);
      else addLog(`  ⛪ ${result.faithChange} Fé`);
    }

    if (result.strengthChange && updatedChar.strength !== undefined) {
      updatedChar.strength = Math.max(0, Math.min(100, updatedChar.strength + result.strengthChange));
      if (result.strengthChange > 0) addLog(`  💪 +${result.strengthChange} Força`);
      else addLog(`  💪 ${result.strengthChange} Força`);
    }

    if (result.moneyChange) {
      updatedChar.money = Math.max(0, updatedChar.money + result.moneyChange);
      if (result.moneyChange > 0) addLog(`  💰 +$${result.moneyChange}`);
      else addLog(`  💰 -$${Math.abs(result.moneyChange)}`);
    }

    if (result.foodChange) {
      updatedChar.food = Math.max(0, updatedChar.food + result.foodChange);
      if (result.foodChange > 0) addLog(`  🍖 +${result.foodChange} Comida`);
      else addLog(`  🍖 ${result.foodChange} Comida`);
    }

    if (result.addTrait) {
      updatedChar.traits.push(result.addTrait);
      addLog(`  ✨ Traço adquirido: ${result.addTrait}`);
    }

    // Aplicar narrative flags
    if (result.setFlags) {
      updatedChar.narrativeFlags = {
        ...updatedChar.narrativeFlags,
        ...result.setFlags,
      };

      // Salvar evento como lastMajorEvent se for importante
      if (currentEvent && (currentEvent as any).category === 'danger') {
        updatedChar.narrativeFlags.lastMajorEvent = (currentEvent as any).id;
      }
    }

    // Adicionar irmão se evento criar um
    if (result.addSibling) {
      const siblingGender = Math.random() > 0.5 ? 'male' : 'female';
      const siblingNames = siblingGender === 'male'
        ? ENGLISH_NAMES.male
        : ENGLISH_NAMES.female;
      const siblingName = siblingNames[Math.floor(Math.random() * siblingNames.length)];

      updatedChar.siblings = [
        ...updatedChar.siblings,
        {
          id: `sibling_${Date.now()}`,
          name: siblingName,
          gender: siblingGender,
          age: 0,
          relationship: 100,
        },
      ];
      addLog(`  👶 Novo irmão: ${siblingName}`);
    }

    setCharacter(updatedChar);
    setCurrentEvent(null);
    setWaitingForChoice(false);

    // Verifica morte
    if (result.death || updatedChar.health === 0) {
      handleDeath(updatedChar, result.message);
    }
  };

  // === MORTE ===
  const handleDeath = (char: Character, message: string) => {
    addLog(`\n💀 GAME OVER`);
    addLog(`${char.name} ${char.surname} faleceu aos ${char.age} anos.`);

    setTimeout(() => {
      Alert.alert(
        '💀 Game Over',
        `${char.name} ${char.surname} morreu aos ${char.age} anos em ${char.location}.\n\n${message}\n\nSistema de sucessão em desenvolvimento.`,
        [{ text: 'Recomeçar', onPress: () => startNewLife() }]
      );
    }, 100);
  };

  // === LOG ===
  const addLog = (message: string) => {
    setGameLog((prev) => [...prev, message]);
  };

  // === LOG DE EVENTOS POR ANO ===
  const addToEventLog = (text: string, type: 'neutral' | 'success' | 'fail') => {
    if (!character) return;
    setCharacter((prev) => {
      if (!prev) return prev;
      const existingLog = prev.eventLog.find((log) => log.year === prev.currentYear);
      if (existingLog) {
        return {
          ...prev,
          eventLog: prev.eventLog.map((log) =>
            log.year === prev.currentYear
              ? { ...log, entries: [...log.entries, { text, type }] }
              : log
          ),
        };
      } else {
        return {
          ...prev,
          eventLog: [...prev.eventLog, { year: prev.currentYear, entries: [{ text, type }] }],
        };
      }
    });
  };

  // === INTERAÇÃO COM NPCs ===
  const handleNPCInteraction = (npcId: string, actionType: 'CHAT' | 'MONEY' | 'HELP_WORK' | 'ASK_TOY' | 'TANTRUM') => {
    if (!character) return;

    // Verificar se já interagiu com esse NPC neste ano (apenas para CHAT)
    if (actionType === 'CHAT') {
      const alreadyInteracted = character.npcInteractionHistory.some(
        (h) => h.year === character.currentYear && h.npcId === npcId && h.actionType === 'CHAT'
      );

      if (alreadyInteracted) {
        addLog(`❌ Você já conversou com essa pessoa este ano.`);
        addToEventLog('Você já conversou com essa pessoa este ano.', 'fail');
        return;
      }
    }

    // Encontrar o NPC
    let npcName = '';
    let npcRelationship = 50;
    let npcRoleLabel = '';

    if (npcId === 'father') {
      npcName = character.family.fatherName;
      npcRelationship = 75;
      npcRoleLabel = 'seu pai';
    } else if (npcId === 'mother') {
      npcName = character.family.motherName;
      npcRelationship = 85;
      npcRoleLabel = 'sua mãe';
    } else {
      const sibling = character.siblings.find((s) => s.id === npcId);
      if (sibling) {
        npcName = sibling.name;
        npcRelationship = sibling.relationship;
        npcRoleLabel = sibling.gender === 'male' ? 'seu irmão' : 'sua irmã';
      }
    }

    if (!npcName) return;

    if (actionType === 'CHAT') {
      const result = generateChatResult(npcName);
      addLog(`💬 ${result.text}`);
      addToEventLog(result.text, 'success');

      // Atualizar relação e adicionar ao histórico
      setCharacter((prev) => {
        if (!prev) return prev;

        let updatedFamily = prev.family;
        if (npcId === 'father') {
          updatedFamily = {
            ...prev.family,
            fatherRelationship: Math.min(100, (prev.family.fatherRelationship || 50) + result.relationshipChange),
          };
        } else if (npcId === 'mother') {
          updatedFamily = {
            ...prev.family,
            motherRelationship: Math.min(100, (prev.family.motherRelationship || 50) + result.relationshipChange),
          };
        }

        const updatedSiblings =
          npcId !== 'father' && npcId !== 'mother'
            ? prev.siblings.map((s) =>
              s.id === npcId
                ? { ...s, relationship: Math.min(100, s.relationship + result.relationshipChange) }
                : s
            )
            : prev.siblings;

        return {
          ...prev,
          family: updatedFamily,
          siblings: updatedSiblings,
          npcInteractionHistory: [
            ...prev.npcInteractionHistory,
            { year: prev.currentYear, npcId, actionType: 'CHAT' },
          ],
        };
      });

      console.log('Relação PAI:', character.family.fatherRelationship);
      console.log('Relação MÃE:', character.family.motherRelationship);
    } else if (actionType === 'MONEY') {
      const result = calculateMoneyResult(character.socialClass, npcRelationship, character.age);

      addLog(`💰 ${result.message}`);
      addToEventLog(result.message, result.success ? 'success' : 'fail');

      if (result.success) {
        setCharacter((prev) => {
          if (!prev) return prev;
          return { ...prev, money: prev.money + result.amount };
        });
      }
    } else if (actionType === 'HELP_WORK') {
      // Ajudar no Trabalho — age >= 6, peasant/artisan only
      const logMsg = `⚒️ Você ajudou ${npcRoleLabel} no trabalho. Foi cansativo, mas ficou orgulhoso(a) de você!`;
      addLog(logMsg);
      addToEventLog(logMsg, 'success');

      setCharacter((prev) => {
        if (!prev) return prev;
        let updatedFamily = prev.family;
        if (npcId === 'father') {
          updatedFamily = { ...prev.family, fatherRelationship: Math.min(100, (prev.family.fatherRelationship || 50) + 10) };
        } else if (npcId === 'mother') {
          updatedFamily = { ...prev.family, motherRelationship: Math.min(100, (prev.family.motherRelationship || 50) + 10) };
        }
        return {
          ...prev,
          health: Math.max(0, prev.health - 2),
          family: updatedFamily,
        };
      });

      // Redirecionar para DASHBOARD
      setCurrentView('DASHBOARD');
    } else if (actionType === 'ASK_TOY') {
      // Pedir Brinquedo — 80% denial if peasant
      const denialChance = character.socialClass === 'peasant' ? 0.8 : 0.2;
      const denied = Math.random() < denialChance;

      if (denied) {
        const logMsg = `🪀 Você pediu um brinquedo para ${npcRoleLabel}, mas ${character.socialClass === 'peasant' ? 'não há dinheiro para isso' : 'não foi desta vez'}.`;
        addLog(logMsg);
        addToEventLog(logMsg, 'fail');

        // Relação com pai/mãe diminui
        setCharacter((prev) => {
          if (!prev) return prev;
          let updatedFamily = prev.family;
          if (npcId === 'father') {
            updatedFamily = { ...prev.family, fatherRelationship: Math.max(0, (prev.family.fatherRelationship || 50) - 10) };
          } else if (npcId === 'mother') {
            updatedFamily = { ...prev.family, motherRelationship: Math.max(0, (prev.family.motherRelationship || 50) - 10) };
          }
          return { ...prev, family: updatedFamily };
        });
      } else {
        const toys = [
          { name: 'Boneco de Madeira', id: 'wooden_doll' },
          { name: 'Bola de Couro', id: 'leather_ball' },
          { name: 'Cavalinho de Pau', id: 'stick_horse' },
          { name: 'Pião', id: 'spinning_top' },
          { name: 'Boneca de Pano', id: 'rag_doll' },
        ];
        const toy = toys[Math.floor(Math.random() * toys.length)];
        const capitalRole = npcRoleLabel.charAt(0).toUpperCase() + npcRoleLabel.slice(1);
        const logMsg = `🪀 ${capitalRole} te deu um(a) ${toy.name}! Que alegria!`;
        addLog(logMsg);
        addToEventLog(logMsg, 'success');

        setCharacter((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            inventory: [...prev.inventory, { id: `${toy.id}_${Date.now()}`, name: toy.name, emoji: '🧸', price: 0, type: 'childhood' as const, description: 'Brinquedo de infância.', allowedClasses: [] }],
          };
        });
      }

      // Redirecionar para DASHBOARD
      setCurrentView('DASHBOARD');
    } else if (actionType === 'TANTRUM') {
      // Fazer Birra — vitality -2, honor -2, parent relation -10
      const capitalRole = npcRoleLabel.charAt(0).toUpperCase() + npcRoleLabel.slice(1);
      const tantrumMessages = [
        `😤 Você fez uma birra enorme! Chorou e esperneou no chão.`,
        `😤 Você gritou e bateu os pés. ${capitalRole} ficou envergonhado(a).`,
        `😤 Você se jogou no chão e chorou até cansar.`,
      ];
      const logMsg = tantrumMessages[Math.floor(Math.random() * tantrumMessages.length)];
      addLog(logMsg);
      addToEventLog(logMsg, 'fail');

      setCharacter((prev) => {
        if (!prev) return prev;
        let updatedFamily = prev.family;
        if (npcId === 'father') {
          updatedFamily = { ...prev.family, fatherRelationship: Math.max(0, (prev.family.fatherRelationship || 50) - 10) };
        } else if (npcId === 'mother') {
          updatedFamily = { ...prev.family, motherRelationship: Math.max(0, (prev.family.motherRelationship || 50) - 10) };
        }
        return {
          ...prev,
          health: Math.max(0, prev.health - 2),
          honor: Math.max(0, prev.honor - 2),
          family: updatedFamily,
        };
      });

      // Redirecionar para DASHBOARD
      setCurrentView('DASHBOARD');
    }
  };

  // === GERAR COLEGAS DE TRABALHO ===

  // Shared name/role/emoji pools
  const COWORKER_NAMES = {
    male: ['Thomas', 'William', 'John', 'Richard', 'Henry', 'Robert', 'Edward', 'Walter', 'Geoffrey', 'Hugh'],
    female: ['Mary', 'Elizabeth', 'Anne', 'Margaret', 'Catherine', 'Alice', 'Agnes', 'Joan', 'Eleanor'],
    surnames: ['o Veterano', 'o Jovem', 'da Cidade', 'do Campo', 'o Sábio', 'o Forte', 'da Margem', 'o Calado', 'dos Montes'],
  };

  const COWORKER_ROLES: Record<string, string[]> = {
    peasant:   ['Mestre de Campo', 'Veterano', 'Aprendiz', 'Colhedor', 'Servente'],
    artisan:   ['Mestre Artesão', 'Supervisor', 'Companheiro', 'Aprendiz', 'Ajudante'],
    gentry:    ['Conselheiro Sênior', 'Colega Administrador', 'Assistente', 'Escriba'],
    nobility:  ['Nobre Veterano', 'Cortesão', 'Cavaleiro', 'Escudeiro', 'Conselheiro'],
  };

  const COWORKER_EMOJIS: Record<string, string[]> = {
    peasant:   ['👨‍🌾', '👩‍🌾', '🧑‍🌾', '👴', '👵', '🧑‍🦱'],
    artisan:   ['🧑‍🔧', '👩‍🍳', '🧑‍🏭', '👨‍🔧', '🧑‍🎨', '👩‍🔬'],
    gentry:    ['👔', '🧑‍💼', '👩‍💼', '📜', '🧑‍⚖️', '👨‍💼'],
    nobility:  ['💂‍♂️', '⚔️', '🎖️', '💂‍♀️', '🧑‍✈️', '👑'],
  };

  /** Create one fresh coworker — used both during hire and as a mortality replacement. */
  const generateSingleCoworker = (socialClass: string, index: number, young = false): any => {
    const isMan = Math.random() > 0.5;
    const firstName = isMan
      ? COWORKER_NAMES.male[Math.floor(Math.random() * COWORKER_NAMES.male.length)]
      : COWORKER_NAMES.female[Math.floor(Math.random() * COWORKER_NAMES.female.length)];
    const suffix = COWORKER_NAMES.surnames[Math.floor(Math.random() * COWORKER_NAMES.surnames.length)];
    const roles  = COWORKER_ROLES[socialClass]  || COWORKER_ROLES.peasant;
    const emojis = COWORKER_EMOJIS[socialClass] || COWORKER_EMOJIS.peasant;

    return {
      id: `coworker_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`,
      name: `${firstName} ${suffix}`,
      role: roles[index % roles.length],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      age: young
        ? Math.floor(Math.random() * 8) + 16   // 16-23 — fresh hire
        : Math.floor(Math.random() * 40) + 16,  // 16-55 — normal hire
      relationship: 50,
      loyaltyScore: 0,
      strength: Math.floor(Math.random() * 61) + 30,
    };
  };

  const generateCoworkers = (_jobTitle: string, socialClass: string): any[] => {
    // Crowded workplace: 4-7 coworkers
    const count = Math.floor(Math.random() * 4) + 4;
    return Array.from({ length: count }, (_, i) => generateSingleCoworker(socialClass, i));
  };

  // === ACEITAR EMPREGO ===
  const handleTakeJob = (job: any) => {
    if (!character) return;

    // Generate coworkers for this job
    const coworkers = generateCoworkers(job.title, character.socialClass);
    const jobWithCoworkers = { ...job, coworkers };

    // IMMEDIATELY update character state
    setCharacter((prev) => {
      if (!prev) return prev;
      return { ...prev, currentJob: jobWithCoworkers };
    });

    // Add comprehensive log entry
    addLog(`\n💼 ==== NOVO EMPREGO ====`);
    addLog(`Você iniciou sua carreira como ${job.emoji} ${job.title}!`);
    addLog(`${job.description}`);
    addLog(`\n📊 Você receberá anualmente:`);
    if (job.income > 0) addLog(`  💰 +${job.income} moedas`);
    if (job.vitalityImpact !== 0) addLog(`  ❤️ ${job.vitalityImpact > 0 ? '+' : ''}${job.vitalityImpact} vitalidade`);
    if (job.strengthImpact) addLog(`  💪 ${job.strengthImpact > 0 ? '+' : ''}${job.strengthImpact} força`);
    if (job.honorImpact) addLog(`  🛡 ${job.honorImpact > 0 ? '+' : ''}${job.honorImpact} honra`);
    if (job.faithImpact) addLog(`  ⛪ ${job.faithImpact > 0 ? '+' : ''}${job.faithImpact} fé`);
    addLog(`\n👥 Colegas de Trabalho:`);
    coworkers.forEach((coworker) => {
      addLog(`  • ${coworker.name} - ${coworker.role}`);
    });
    addLog(`====================\n`);
    addToEventLog(`Empregado como ${job.title}`, 'success');

    // Switch to dashboard to show log immediately
    setCurrentView('DASHBOARD');
  };

  // === PEDIR DEMISSÃO ===
  const handleResignJob = () => {
    if (!character || !character.currentJob) return;

    const jobTitle = character.currentJob.title;

    setCharacter((prev) => {
      if (!prev) return prev;
      return { ...prev, currentJob: null };
    });

    addLog(`\n🚪 Você pediu demissão do cargo de ${jobTitle}.`);
    addLog(`Você está desempregado novamente.\n`);
    addToEventLog(`Demitiu-se de ${jobTitle}`, 'neutral');
  };

  // === INTERAÇÃO COM COLEGAS DE TRABALHO ===
  const handleCoworkerInteraction = (coworkerId: string, actionType: string) => {
    if (!character || !character.currentJob || !character.currentJob.coworkers) return;

    const coworker = character.currentJob.coworkers.find(c => c.id === coworkerId);
    if (!coworker) return;

    let relationshipChange = 0;
    let healthChange = 0;
    let honorChange = 0;
    let moneyChange = 0;
    let logMessage = '';
    let logType: 'neutral' | 'success' | 'fail' = 'neutral';

    switch (actionType) {
      // 🤝 AMIGÁVEIS
      case 'COMPLIMENT':
        relationshipChange = 5;
        logMessage = `😊 Você elogiou ${coworker.name}. Eles apreciaram suas palavras gentis.`;
        logType = 'success';
        break;

      case 'TAVERN':
        if (character.money >= 5) {
          moneyChange = -5;
          relationshipChange = 10;
          healthChange = -5;
          logMessage = `🍺 Você foi à taverna com ${coworker.name}. Vocês beberam e conversaram até tarde. (Ressaca: -5 Vitalidade)`;
          logType = 'success';
        } else {
          logMessage = `💰 Você não tem moedas suficientes para ir à taverna.`;
          logType = 'fail';
          return;
        }
        break;

      case 'GIFT':
        if (character.inventory.length > 0) {
          const randomItem = character.inventory[Math.floor(Math.random() * character.inventory.length)];
          relationshipChange = 15;
          logMessage = `🎁 Você deu "${randomItem.name}" para ${coworker.name}. Eles ficaram muito felizes!`;
          logType = 'success';
          // Remove item from inventory
          setCharacter(prev => {
            if (!prev) return prev;
            return { ...prev, inventory: prev.inventory.filter(item => item.id !== randomItem.id) };
          });
        } else {
          logMessage = `📦 Você não tem itens para dar de presente.`;
          logType = 'fail';
          return;
        }
        break;

      case 'LOAN':
        if (coworker.relationship > 80) {
          const loanAmount = Math.floor(Math.random() * 41) + 10; // 10-50
          moneyChange = loanAmount;
          relationshipChange = -5;
          logMessage = `💸 ${coworker.name} emprestou ${loanAmount} moedas para você. Você promete devolver em breve.`;
          logType = 'success';
        } else {
          logMessage = `🚫 ${coworker.name} não confia em você o suficiente para emprestar dinheiro.`;
          logType = 'fail';
          return;
        }
        break;

      // 💼 PROFISSIONAIS
      case 'PLEASE':
        honorChange = 5;
        healthChange = -10;
        relationshipChange = 3;
        logMessage = `🙇 Você agradou ${coworker.name}, fazendo todo o trabalho sujo. Sua reputação melhorou, mas você está exausto.`;
        logType = 'neutral';
        break;

      case 'HELP':
        if (coworker.relationship > 60) {
          relationshipChange = -10;
          logMessage = `🤝 ${coworker.name} concordou em ajudá-lo. Seu próximo ano de trabalho será mais leve.`;
          logType = 'success';
          // TODO: Add flag to reduce vitality cost on next age up
        } else {
          logMessage = `🚫 ${coworker.name} não está disposto a ajudá-lo ainda.`;
          logType = 'fail';
          return;
        }
        break;

      case 'REPORT':
        honorChange = 10;
        relationshipChange = -100; // Sets to 0 (enemy)
        logMessage = `📋 Você denunciou ${coworker.name} ao supervisor. Sua honra aumentou, mas agora você tem um inimigo mortal.`;
        logType = 'fail';
        break;

      // 🗡️ HOSTIS
      case 'INSULT':
        relationshipChange = -20;
        const fightChance = Math.random();
        if (fightChance < 0.3) { // 30% chance of fight
          const playerStrength = character.strength || 50;
          const enemyStrength = Math.floor(Math.random() * 40) + 40;
          if (playerStrength > enemyStrength) {
            honorChange = 5;
            healthChange = -10;
            logMessage = `😠 Você insultou ${coworker.name}. Uma briga começou e você venceu! Mas saiu ferido.`;
            logType = 'success';
          } else {
            honorChange = -10;
            healthChange = -20;
            logMessage = `😠 Você insultou ${coworker.name}. Uma briga começou e você levou uma surra!`;
            logType = 'fail';
          }
        } else {
          logMessage = `😠 Você insultou ${coworker.name}. Agora eles te odeiam.`;
          logType = 'fail';
        }
        break;

      case 'SABOTAGE':
        const sabotageSuccess = Math.random() > 0.5;
        if (sabotageSuccess) {
          relationshipChange = -30;
          logMessage = `🔧 Você sabotou o trabalho de ${coworker.name} sem ser descoberto. A reputação deles caiu.`;
          logType = 'success';
        } else {
          honorChange = -15;
          moneyChange = -20;
          relationshipChange = -50;
          logMessage = `🔧 Você foi pego sabotando! Perdeu honra, foi multado em 20 moedas, e agora é odiado.`;
          logType = 'fail';
        }
        break;

      case 'HERESY':
        if (character.currentYear >= 1500 && character.currentYear <= 1700) {
          relationshipChange = -50;
          honorChange = -10;
          logMessage = `⚠️ Você espalhou rumores de heresia sobre ${coworker.name}. A Inquisição pode investigá-los. Que Deus tenha misericórdia de sua alma.`;
          logType = 'fail';
        } else {
          logMessage = `⚠️ Rumores de heresia não têm peso nesta era.`;
          logType = 'fail';
          return;
        }
        break;

      case 'DUEL': {
        // Close the sheet so its overlay doesn't sit above the DuelModal.
        setCurrentView('DASHBOARD');
        // Use the coworker's stored strength (set at hire time) for consistency
        // with what the player sees in the coworker sheet.
        const opponentStrength = coworker.strength ?? Math.floor(Math.random() * 61) + 30;
        setDuelModal({
          isVisible: true,
          coworkerId: coworkerId,
          opponentName: coworker.name,
          opponentStrength,
        });
        // Skip the normal stat-apply block – outcome handled by handleDuelEnd callback.
        return;
      }

      default:
        logMessage = `Ação desconhecida: ${actionType}`;
        break;
    }

    // Update character state
    setCharacter((prev) => {
      if (!prev || !prev.currentJob || !prev.currentJob.coworkers) return prev;

      const updatedCoworkers = prev.currentJob.coworkers.map(c => {
        if (c.id === coworkerId) {
          return {
            ...c,
            relationship: Math.max(0, Math.min(100, c.relationship + relationshipChange))
          };
        }
        return c;
      });

      // Promote coworker to global enemy if relationship dropped to 0
      const updatedCoworker = updatedCoworkers.find(c => c.id === coworkerId);
      let updatedGlobalEnemies = prev.globalEnemies ?? [];
      if (
        updatedCoworker &&
        updatedCoworker.relationship === 0 &&
        !updatedGlobalEnemies.some(e => e.id === coworkerId)
      ) {
        const newEnemy: GlobalEnemy = {
          id: coworkerId,
          name: updatedCoworker.name,
          type: 'ENEMY',
          age: updatedCoworker.age ?? 30,
          emoji: updatedCoworker.emoji ?? '😡',
          strength: updatedCoworker.strength ?? 50,
          relationshipLevel: 0,
        };
        updatedGlobalEnemies = [...updatedGlobalEnemies, newEnemy];
        // Log is added outside so we capture it post-render
      }

      return {
        ...prev,
        currentJob: { ...prev.currentJob, coworkers: updatedCoworkers },
        health: Math.max(0, Math.min(100, prev.health + healthChange)),
        honor: Math.max(0, Math.min(100, prev.honor + honorChange)),
        money: Math.max(0, prev.money + moneyChange),
        globalEnemies: updatedGlobalEnemies,
      };
    });

    // Check if this action created a new enemy (relationship would be 0)
    const currentCoworker = character.currentJob?.coworkers?.find(c => c.id === coworkerId);
    if (
      currentCoworker &&
      Math.max(0, currentCoworker.relationship + relationshipChange) === 0 &&
      !(character.globalEnemies ?? []).some(e => e.id === coworkerId)
    ) {
      const enemyMsg = `🩸 O ódio de ${currentCoworker.name} ferveu. Ele agora é seu inimigo declarado!`;
      addLog(enemyMsg);
      addToEventLog(enemyMsg, 'fail');
    }

    // Add log entry
    addLog(logMessage);
    addToEventLog(logMessage, logType);

    // Return to dashboard
    setCurrentView('DASHBOARD');
  };

  // === RESOLUÇÃO DO DUELO (callback do DuelModal) ===
  // === DURABILIDADE APÓS DUELO ===
  const applyDuelDurability = () => {
    setCharacter(prev => {
      if (!prev) return prev;
      let updated = { ...prev };
      const newInventory: typeof prev.inventory = [];

      for (const item of prev.inventory) {
        if ((item.type !== 'WEAPON' && item.type !== 'ARMOR') || !item.isEquipped) {
          newInventory.push(item);
          continue;
        }
        const newDur = (item.durability ?? 1) - 1;
        if (newDur <= 0) {
          // Revert stat modifiers
          const mods = item.statModifiers ?? {};
          if (mods.health)   updated.health   = Math.max(0, (updated.health ?? 0) - mods.health);
          if (mods.strength) updated.strength = Math.max(0, (updated.strength ?? 0) - mods.strength);
          if (mods.honor)    updated.honor    = Math.max(0, (updated.honor ?? 0) - mods.honor);
          if (mods.faith)    updated.faith    = Math.max(0, (updated.faith ?? 0) - mods.faith);
          addLog(`💥 Seu(Sua) ${item.name} quebrou após o duelo e foi perdido(a)!`);
          // Do not push — item is gone
        } else {
          newInventory.push({ ...item, durability: newDur });
        }
      }

      updated.inventory = newInventory;
      return updated;
    });
  };

  const handleDuelEnd = (result: 'win' | 'lose') => {
    if (!character) return;

    // Capture values immediately — avoids stale-closure reads after setDuelModal.
    const resolvedOpponentName = duelModal.opponentName;
    const resolvedCoworkerId = duelModal.coworkerId;
    const resolvedSourceType = duelModal.sourceType ?? 'coworker';
    const customOnWin = duelModal.onWin;
    const customOnLose = duelModal.onLose;

    setDuelModal(prev => ({ ...prev, isVisible: false, onWin: undefined, onLose: undefined }));

    // === ENEMY DUEL (from RelationsView) ===
    if (resolvedSourceType === 'enemy') {
      if (result === 'win') {
        const winMsg = `⚔️ Você venceu o duelo e derrotou seu inimigo ${resolvedOpponentName}! Ele foi humilhado e não mais o ameaça.`;
        addLog(winMsg);
        addToEventLog(winMsg, 'success');
        setCharacter(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            health: Math.max(0, Math.min(100, prev.health - 10)),
            honor: Math.max(0, Math.min(100, prev.honor + 25)),
            globalEnemies: (prev.globalEnemies ?? []).filter(e => e.id !== resolvedCoworkerId),
          };
        });
      } else {
        const loseMsg = `⚔️ Você perdeu o duelo contra ${resolvedOpponentName}. Sua derrota o encorajou. Sua honra despencou.`;
        addLog(loseMsg);
        addToEventLog(loseMsg, 'fail');
        setCharacter(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            health: Math.max(0, Math.min(100, prev.health - 35)),
            honor: Math.max(0, Math.min(100, prev.honor - 25)),
          };
        });
      }
      applyDuelDurability();
      setCurrentView('DASHBOARD');
      return;
    }

    // If the duel was triggered from an event with custom callbacks, use those.
    // They handle all stat changes and logging internally.
    if (customOnWin || customOnLose) {
      if (result === 'win' && customOnWin) customOnWin();
      if (result === 'lose' && customOnLose) customOnLose();
      // Still destroy the coworker relationship — a duel always strains it
      setCharacter(prev => {
        if (!prev?.currentJob?.coworkers) return prev;
        const coworkerObj = prev.currentJob!.coworkers.find(c => c.id === resolvedCoworkerId);
        const updatedGlobalEnemies = promoteToEnemy(prev.globalEnemies ?? [], resolvedCoworkerId, coworkerObj);
        if (updatedGlobalEnemies !== (prev.globalEnemies ?? [])) {
          const enemyMsg = `🩸 O ódio de ${coworkerObj?.name ?? resolvedOpponentName} ferveu após o duelo. Ele agora é seu inimigo declarado!`;
          addLog(enemyMsg);
          addToEventLog(enemyMsg, 'fail');
        }
        return {
          ...prev,
          currentJob: {
            ...prev.currentJob!,
            coworkers: prev.currentJob!.coworkers.map(c =>
              c.id === resolvedCoworkerId ? { ...c, relationship: 0 } : c
            ),
          },
          globalEnemies: updatedGlobalEnemies,
        };
      });
      applyDuelDurability();
      setCurrentView('DASHBOARD');
      return;
    }

    // ── Default coworker-duel consequences ──────────────────────────────────
    let honorChange = 0;
    let healthChange = 0;
    let logMessage = '';
    let logType: 'success' | 'fail' | 'neutral' = 'neutral';

    if (result === 'win') {
      honorChange = 20;
      healthChange = -15;
      logMessage = `⚔️ Você venceu o duelo contra ${resolvedOpponentName}! Sua honra cresceu, mas você saiu ferido.`;
      logType = 'success';
    } else {
      honorChange = -20;
      healthChange = -40;
      logMessage = `⚔️ Você perdeu o duelo contra ${resolvedOpponentName}. Sua honra foi manchada e você está gravemente ferido.`;
      logType = 'fail';
    }

    setCharacter(prev => {
      if (!prev) return prev;
      const coworkerObj = prev.currentJob?.coworkers?.find(c => c.id === resolvedCoworkerId);
      const updatedCoworkers = (prev.currentJob?.coworkers ?? []).map(c =>
        c.id === resolvedCoworkerId ? { ...c, relationship: 0 } : c
      );
      const updatedGlobalEnemies = promoteToEnemy(prev.globalEnemies ?? [], resolvedCoworkerId, coworkerObj);
      if (updatedGlobalEnemies !== (prev.globalEnemies ?? [])) {
        const enemyMsg = `🩸 O ódio de ${resolvedOpponentName} ferveu após o duelo. Ele agora é seu inimigo declarado!`;
        addLog(enemyMsg);
        addToEventLog(enemyMsg, 'fail');
      }
      return {
        ...prev,
        health: Math.max(0, Math.min(100, prev.health + healthChange)),
        honor: Math.max(0, Math.min(100, prev.honor + honorChange)),
        currentJob: prev.currentJob
          ? { ...prev.currentJob, coworkers: updatedCoworkers }
          : prev.currentJob,
        globalEnemies: updatedGlobalEnemies,
      };
    });

    addLog(logMessage);
    addToEventLog(logMessage, logType);

    // === DURABILITY DEPLETION (runs after every duel path) ===
    setCharacter(prev => {
      if (!prev) return prev;
      let updated = { ...prev };
      const newInventory = prev.inventory
        .map(item => {
          if ((item.type !== 'WEAPON' && item.type !== 'ARMOR') || !item.isEquipped) return item;
          const newDur = (item.durability ?? 1) - 1;
          if (newDur <= 0) return null; // mark for removal
          return { ...item, durability: newDur };
        })
        .filter((item): item is NonNullable<typeof item> => {
          if (item === null) return false;
          return true;
        });

      // Detect broken items and revert their stats
      prev.inventory.forEach(item => {
        if ((item.type !== 'WEAPON' && item.type !== 'ARMOR') || !item.isEquipped) return;
        const newDur = (item.durability ?? 1) - 1;
        if (newDur <= 0) {
          const mods = item.statModifiers ?? {};
          if (mods.health)   updated.health   = Math.max(0, (updated.health ?? 0) - mods.health);
          if (mods.strength) updated.strength = Math.max(0, (updated.strength ?? 0) - mods.strength);
          if (mods.honor)    updated.honor    = Math.max(0, (updated.honor ?? 0) - mods.honor);
          if (mods.faith)    updated.faith    = Math.max(0, (updated.faith ?? 0) - mods.faith);
          addLog(`💥 Seu(Sua) ${item.name} quebrou após o duelo e foi perdido(a)!`);
        }
      });

      updated.inventory = newInventory;
      return updated;
    });

    setCurrentView('DASHBOARD');
  };

  // === INTERAÇÃO COM INIMIGOS GLOBAIS ===
  const handleEnemyInteraction = (enemyId: string, actionType: 'INSULT' | 'DUEL') => {
    if (!character) return;
    const enemy = (character.globalEnemies ?? []).find(e => e.id === enemyId);
    if (!enemy) return;

    if (actionType === 'DUEL') {
      setCurrentView('DASHBOARD');
      setDuelModal({
        isVisible: true,
        coworkerId: enemyId,
        opponentName: enemy.name,
        opponentStrength: enemy.strength,
        sourceType: 'enemy',
      });
      return;
    }

    // INSULT
    const logMessage = `😠 Você insultou ${enemy.name} publicamente. Vocês se odeiam cada vez mais.`;
    addLog(logMessage);
    addToEventLog(logMessage, 'fail');
    // Insult has no mechanical effect beyond the narrative — relationship is already 0
  };

  // === TRABALHAR ===
  const handleWork = () => {
    if (!character || character.age < 6) return;

    const occupations: Record<string, { log: string; stats: { health?: number; strength?: number; faith?: number; honor?: number }; money: number }> = {
      nobility: {
        log: 'Você treinou esgrima com seu mestre de armas. Seus músculos doem, mas sua honra cresce.',
        stats: { strength: 2, honor: 1, health: -2 },
        money: 0,
      },
      gentry: {
        log: 'Seu tutor lhe ensinou a história dos seus ancestrais. Conhecimento é poder.',
        stats: { honor: 2, faith: 1, health: -1 },
        money: 0,
      },
      artisan: {
        log: 'Você ajudou na loja e aprendeu o valor de uma moeda.',
        stats: { honor: 1, health: -1 },
        money: Math.random() < 0.5 ? 1 : 0,
      },
      peasant: {
        log: 'Você capinou o terreno sob o sol forte. Deus vê seu esforço.',
        stats: { strength: 2, faith: 1, health: -3 },
        money: 0,
      },
    };

    const occ = occupations[character.socialClass] || occupations.peasant;

    addLog(`⚒️ ${occ.log}`);
    addToEventLog(occ.log, 'neutral');

    setCharacter((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        health: Math.max(0, Math.min(100, (prev.health || 100) + (occ.stats.health || 0))),
        strength: Math.max(0, Math.min(100, (prev.strength || 50) + (occ.stats.strength || 0))),
        faith: Math.max(0, Math.min(100, (prev.faith || 50) + (occ.stats.faith || 0))),
        honor: Math.max(0, Math.min(100, (prev.honor || 50) + (occ.stats.honor || 0))),
        money: prev.money + occ.money,
      };
    });

    // Mensagem de dinheiro ganho
    if (occ.money > 0) {
      addLog(`  💰 Você ganhou $${occ.money}!`);
    }

    // Chance de conhecer novo colega (10%)
    if (Math.random() < 0.1 && character.classmates && character.classmates.length > 0) {
      const newName = generateNewClassmateName(character.socialClass);
      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          classmates: [
            ...prev.classmates,
            {
              id: `classmate_new_${Date.now()}`,
              name: newName,
              relationship: 25,
              socialClass: prev.socialClass,
            },
          ],
        };
      });
      addLog(`  👋 Você conheceu ${newName}!`);
    }
  };

  // === INTERAÇÃO COM COLEGAS ===
  const handleClassmateInteraction = (classmateId: string, actionType: 'PLAY' | 'CHAT' | 'FIGHT') => {
    if (!character) return;

    const classmate = character.classmates?.find((c) => c.id === classmateId);
    if (!classmate) return;

    let relationshipChange = 0;
    let statsChange: { health?: number; honor?: number; strength?: number } = {};
    let logMessage = '';
    let toastType: 'success' | 'fail' | 'neutral' = 'neutral';

    if (actionType === 'PLAY') {
      relationshipChange = Math.floor(Math.random() * 6) + 5; // +5 a +10
      logMessage = `🎮 Você brincou com ${classmate.name}. Que divertido!`;
      toastType = 'success';
    } else if (actionType === 'CHAT') {
      relationshipChange = Math.floor(Math.random() * 3) + 2; // +2 a +4
      logMessage = `💬 Você conversou com ${classmate.name}.`;
      toastType = 'neutral';
    } else if (actionType === 'FIGHT') {
      const playerWins = (character.strength || 50) > Math.random() * 100;
      if (playerWins) {
        relationshipChange = -10;
        statsChange = { honor: 2 };
        logMessage = `⚔️ Você venceu ${classmate.name} na luta!`;
        toastType = 'success';
      } else {
        relationshipChange = -5;
        statsChange = { health: -5, honor: -2 };
        logMessage = `⚔️ ${classmate.name} te derrotou. Que humilhação!`;
        toastType = 'fail';
      }
    }

    addLog(logMessage);
    addToEventLog(logMessage, toastType);

    setCharacter((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        classmates: prev.classmates.map((c) =>
          c.id === classmateId
            ? { ...c, relationship: Math.max(0, Math.min(100, c.relationship + relationshipChange)) }
            : c
        ),
        health: Math.max(0, Math.min(100, prev.health + (statsChange.health || 0))),
        honor: Math.max(0, Math.min(100, prev.honor + (statsChange.honor || 0))),
        strength: Math.max(0, Math.min(100, (prev.strength || 50) + (statsChange.strength || 0))),
      };
    });
  };

  // === ESCOLHA DE EVENTO (MODAL) ===
  const handleEventChoice = (choiceId: string) => {
    if (!eventModal.event) return;

    const choice = eventModal.event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Aplicar stats se houver
    if (choice.stats) {
      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          health: Math.max(0, Math.min(100, prev.health + (choice.stats?.health || 0))),
          honor: Math.max(0, Math.min(100, prev.honor + (choice.stats?.honor || 0))),
          faith: Math.max(0, Math.min(100, (prev.faith || 50) + (choice.stats?.faith || 0))),
          strength: Math.max(0, Math.min(100, (prev.strength || 50) + (choice.stats?.strength || 0))),
          money: Math.max(0, prev.money + (choice.stats?.money || 0)),
        };
      });
    }

    addLog(`→ ${choice.text}`);
    setEventModal({ isOpen: false });
  };

  // === ESCOLHA DE EVENTO SIMPLES (RANDOM EVENTS) ===
  const handleSimpleEventChoice = (choiceIndex: number) => {
    if (!simpleEvent || !character) return;

    const choice = simpleEvent.choices[choiceIndex];
    if (!choice) return;

    addLog(`→ ${choice.label}`);
    addLog(choice.consequence);

    // Aplicar efeitos
    const effects = choice.effect;
    const updatedChar = { ...character };

    if (effects.vitality) {
      updatedChar.health = Math.max(0, Math.min(100, updatedChar.health + effects.vitality));
      if (effects.vitality > 0) addLog(`  ❤️ +${effects.vitality} Vitalidade`);
      else addLog(`  ❤️ ${effects.vitality} Vitalidade`);
    }

    if (effects.faith) {
      updatedChar.faith = Math.max(0, Math.min(100, (updatedChar.faith || 50) + effects.faith));
      if (effects.faith > 0) addLog(`  ⛪ +${effects.faith} Fé`);
      else addLog(`  ⛪ ${effects.faith} Fé`);
    }

    if (effects.strength) {
      updatedChar.strength = Math.max(0, Math.min(100, (updatedChar.strength || 50) + effects.strength));
      if (effects.strength > 0) addLog(`  💪 +${effects.strength} Força`);
      else addLog(`  💪 ${effects.strength} Força`);
    }

    if (effects.honor) {
      updatedChar.honor = Math.max(0, Math.min(100, updatedChar.honor + effects.honor));
      if (effects.honor > 0) addLog(`  🛡 +${effects.honor} Honra`);
      else addLog(`  🛡 ${effects.honor} Honra`);
    }

    if (effects.money) {
      updatedChar.money = Math.max(0, updatedChar.money + effects.money);
      if (effects.money > 0) addLog(`  💰 +$${effects.money}`);
      else addLog(`  💰 -$${Math.abs(effects.money)}`);
    }

    setCharacter(updatedChar);
    setSimpleEvent(null);
    setWaitingForChoice(false);

    // Verifica morte
    if (updatedChar.health <= 0) {
      handleDeath(updatedChar, choice.consequence);
    }
  };

  // === DISMISS NASCIMENTO DE IRMÃO ===
  // === NASCIMENTO DE FILHO — confirmar nome ===
  const handleBirthNameChosen = (chosenName: string) => {
    const baseChar = pendingBirthCharRef.current;
    if (!baseChar?.pendingPregnancy) return;

    const pregnancy = baseChar.pendingPregnancy;
    const gender: Child['gender'] = Math.random() > 0.5 ? 'Masculino' : 'Feminino';
    const newChild: Child = {
      id: Math.random().toString(36).slice(2),
      name: chosenName || (gender === 'Masculino' ? 'João' : 'Maria'),
      gender,
      type: pregnancy.type,
      age: 0,
      relationship: 50,
      health: 80,
      isBaptized: false,
    };
    const genderLabel = gender === 'Masculino' ? 'filho' : 'filha';

    const updatedChar: Character = {
      ...baseChar,
      children: [...(baseChar.children ?? []), newChild],
      pendingPregnancy: null,
      honor: pregnancy.type === 'Bastardo'
        ? Math.max(0, baseChar.honor - 15)
        : baseChar.honor,
    };

    setCharacter(updatedChar);
    setShowBirthModal(false);
    pendingBirthCharRef.current = null;

    addLog(`👶 Nasceu seu ${genderLabel} ${pregnancy.type}: ${newChild.name}!`);
    addToEventLog(`Nasceu ${newChild.name} (${pregnancy.type})`, 'success');

    checkForEvents(updatedChar);
  };

  const handleSiblingBirthDismiss = () => {
    setSiblingBirthModal({ isOpen: false });
    // Continuar com checkForEvents adiado
    if (pendingEventsCharRef.current) {
      const char = pendingEventsCharRef.current;
      pendingEventsCharRef.current = null;
      checkForEvents(char);
    }
  };

  // === ATIVIDADES: CORPO & ALMA (MICRO-EVENTS) ===
  const ACTIVITY_EVENTS = [
    {
      id: 'play_mud',
      label: '🏞️ Brincar na Lama',
      title: 'Chiqueiro Lamacento',
      description: 'Choveu muito e o quintal é pura lama.',
      choices: [
        { text: 'Brincar sozinho', effects: { strength: 2 }, preview: '+2 Força', logText: 'Brinquei sozinho na lama por várias horas. Foi divertido, mas um pouco solitário...' },
        { text: 'Guerra de lama com amigos', effects: { strength: 1, health: 1 }, preview: '+1 Força, +1 Vitalidade', logText: 'Fizemos uma guerra de lama! Voltei para casa sujo, mas feliz.' },
        { text: 'Desistir', effects: null, preview: '', logText: '' },
      ],
    },
    {
      id: 'listen_priest',
      label: '⛪ Ouvir o Padre',
      title: 'Sermão de Domingo',
      description: 'O padre fala sobre o fogo do inferno.',
      choices: [
        { text: 'Ouvir com temor', effects: { faith: 4 }, preview: '+4 Fé', logText: 'O sermão sobre o inferno me deu calafrios. Prometi ser uma criança melhor.' },
        { text: 'Ajudar no altar', effects: { faith: 2, honor: 2 }, preview: '+2 Fé, +2 Honra', logText: 'Limpei o altar em silêncio. O padre me deu um pedaço de pão bento.' },
        { text: 'Dormir', effects: null, preview: '', logText: '' },
      ],
    },
    {
      id: 'carry_wood',
      label: '🪵 Carregar Lenha',
      title: 'Estoque de Inverno',
      description: 'Seu pai precisa de ajuda com a lenha.',
      choices: [
        { text: 'Levar o tronco pesado', effects: { strength: 5 }, preview: '+5 Força', logText: 'Meus braços doem de carregar o tronco pesado, mas meu pai me elogiou.' },
        { text: 'Levar gravetos', effects: { strength: 2 }, preview: '+2 Força', logText: 'Carreguei apenas gravetos leves. O trabalho acabou rápido.' },
        { text: 'Fugir do trabalho', effects: null, preview: '', logText: '' },
      ],
    },
    {
      id: 'beg_food',
      label: '🧎 Suplicar por Comida',
      title: 'Carruagem Real',
      description: 'Nobres estão passando pela estrada.',
      choices: [
        { text: 'Suplicar por restos', effects: { health: 10, honor: -5 }, preview: '+10 Vitalidade, -5 Honra', logText: 'Me humilhei na estrada. Um nobre jogou restos de comida com nojo.' },
        { text: 'Dançar por moedas', effects: { health: 5, honor: -2 }, preview: '+5 Vitalidade, -2 Honra', logText: 'Dancei e pulei. Eles riram da minha desgraça, mas atiraram uma moeda.' },
        { text: 'Esconder-se', effects: null, preview: '', logText: '' },
      ],
    },
  ];

  // === CRIMES (PEASANT/ARTISAN) ===
  const CRIME_EVENTS = [
    {
      id: 'pickpocket_peasant',
      label: '💰 Bater Carteira',
      title: 'Mercado da Vila',
      description: 'O mercado da vila está movimentado hoje. Bolsas pesadas balançam nos cintos dos desatentos.',
      choices: [
        { text: 'Roubar Bêbado (Fácil)', effects: { money: 5 }, preview: 'Alvo fácil', logText: '' },
        { text: 'Roubar Mercador (Difícil)', effects: { money: 50 }, preview: 'Alto risco, alta recompensa', logText: '' },
        { text: 'Desistir', effects: null, preview: '', logText: '' },
      ],
    },
    {
      id: 'poach_peasant',
      label: '🦌 Caça Ilegal',
      title: 'Bosque Real',
      description: 'As terras de caça do senhor local estão repletas de cervos gordos. A fome aperta...',
      choices: [
        { text: 'Caçar Cervo', effects: { health: 20 }, preview: 'Carne e peles', logText: '' },
        { text: 'Desistir', effects: null, preview: '', logText: '' },
      ],
    },
  ];

  const [activeActivity, setActiveActivity] = useState<typeof ACTIVITY_EVENTS[number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [potentialMatch, setPotentialMatch] = useState<PotentialMatch | null>(null);


  const generateMatch = (playerAge: number, playerClass: string): PotentialMatch => {
    const maleNames = ['Afonso', 'Mateus', 'João', 'Henrique', 'Rodrigo', 'Diogo', 'Tomás', 'Filipe'];
    const femaleNames = ['Beatriz', 'Catarina', 'Leonor', 'Isabel', 'Inês', 'Margarida', 'Ana', 'Filipa'];
    const gender = Math.random() < 0.5 ? 'Masculino' : 'Feminino';
    const name = gender === 'Masculino'
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const age = Math.max(16, playerAge - 3 + Math.floor(Math.random() * 7));

    let matchClass: string;
    if (playerClass === 'peasant') {
      matchClass = Math.random() < 0.85 ? 'Camponês' : 'Artesão';
    } else if (playerClass === 'artisan') {
      matchClass = Math.random() < 0.7 ? 'Artesão' : 'Camponês';
    } else {
      matchClass = 'Nobreza';
    }

    const peasantOccupations = ['Trabalhador Rural', 'Lenhador', 'Criador de Porcos', 'Filho(a) do Moleiro'];
    const artisanOccupations = ['Aprendiz de Ferreiro', 'Tecelão(ã)', 'Filho(a) do Padeiro'];
    const nobleOccupations = ['Lorde', 'Lady', 'Herdeiro(a) do Feudo'];
    const occupationPool = matchClass === 'Nobreza' ? nobleOccupations
      : matchClass === 'Artesão' ? artisanOccupations
      : peasantOccupations;
    const occupation = occupationPool[Math.floor(Math.random() * occupationPool.length)];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const wealthBase = matchClass === 'Nobreza' ? 50 : matchClass === 'Artesão' ? 30 : 10;

    return {
      name, gender, age, socialClass: matchClass, occupation,
      stats: {
        vitality:  rand(10, 100),
        strength:  rand(10, 100),
        honor:     rand(10, 100),
        wealth:    Math.min(100, wealthBase + rand(0, 50)),
      },
    };
  };

  const handleActivityPress = (activity: typeof ACTIVITY_EVENTS[number]) => {
    if (!character) return;

    if (character.activityHistory[activity.id] === character.currentYear) {
      addLog(`❌ Você já fez isso este ano.`);
      return;
    }

    // Switch to dashboard first so the modal overlays the main view
    setSelectedCategory(null);
    setCurrentView('DASHBOARD');
    setActiveActivity(activity);
  };

  const handleActivityChoice = (choiceId: string) => {
    if (!activeActivity || !character) return;

    const choiceIndex = Number(choiceId);
    const choice = activeActivity.choices[choiceIndex];
    if (!choice) return;

    // Close modal first
    const activity = activeActivity;
    setActiveActivity(null);

    // Cancel choice — no stats, no mark as done
    if (!choice.effects) return;

    // === PICKPOCKET MINI-GAME INTERCEPT ===
    if (activity.id === 'pickpocket_peasant') {
      const difficulty: 'easy' | 'hard' = choiceIndex === 0 ? 'easy' : 'hard';
      setMiniGameDifficulty(difficulty);

      pendingCrimeAction.current = (success: boolean) => {
        if (success) {
          if (difficulty === 'easy') {
            setCharacter((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                money: Math.max(0, prev.money + 5),
                activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
              };
            });
            addLog(`→ O bêbado nem percebeu. Peguei algumas moedas de cobre da bolsa fedida.`);
          } else {
            const goldAmount = 40 + Math.floor(Math.random() * 31); // 40-70
            setCharacter((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                money: Math.max(0, prev.money + goldAmount),
                activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
              };
            });
            addLog(`→ Mãos de cirurgião! Cortei a bolsa de veludo e encontrei ${goldAmount} moedas de ouro! O risco valeu a pena.`);
          }
        } else {
          // Progressive punishment based on strike count
          setCrimeStrikeCount((prev) => prev + 1);
          const newStrike = crimeStrikeCount + 1;

          let healthPenalty = 0;
          let honorPenalty = 0;
          let logMsg = '';

          if (newStrike === 1) {
            healthPenalty = 10;
            honorPenalty = 5;
            logMsg = '→ Os guardas te deram uma surra de aviso.';
          } else if (newStrike === 2) {
            healthPenalty = 30;
            honorPenalty = 20;
            logMsg = '→ Reincidente! Você foi açoitado no tronco da praça.';
          } else {
            healthPenalty = 60;
            honorPenalty = 50;
            logMsg = '→ A marca da justiça! Cortaram parte da sua orelha como aviso eterno.';
          }

          setCharacter((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              health: Math.max(0, prev.health - healthPenalty),
              honor: Math.max(0, prev.honor - honorPenalty),
              activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
            };
          });
          addLog(logMsg);
        }
        // Switch to dashboard to display log
        setCurrentView('DASHBOARD');
      };

      setShowMiniGame(true);
      return;
    }

    // === POACHING MINI-GAME INTERCEPT ===
    if (activity.id === 'poach_peasant') {
      pendingPoachingAction.current = (success: boolean) => {
        if (success) {
          const meatItem: MarketItem = {
            id: `venison_${Date.now()}`,
            name: 'Carne de Veado',
            emoji: '🥩',
            price: 15,
            type: 'food',
            description: 'Carne fresca e nutritiva de caça ilegal.',
            allowedClasses: [],
          };
          setCharacter((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              inventory: [...prev.inventory, meatItem],
              activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
            };
          });
          addLog('→ Consegui esfolar o cervo e fugir sem ser visto. Carne para o inverno!');
        } else {
          setCharacter((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              health: Math.max(0, prev.health - 30),
              honor: Math.max(0, prev.honor - 20),
              activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
            };
          });
          addLog('→ O guarda me viu! Tentei correr mas fui pego. O preço foi alto.');
        }
        setCurrentView('DASHBOARD');
      };

      setShowPoachingGame(true);
      return;
    }

    // === NORMAL ACTIVITY FLOW ===
    const effects = choice.effects as Record<string, number> | null;
    setCharacter((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        health: Math.max(0, Math.min(100, prev.health + (effects?.health || 0))),
        strength: Math.max(0, Math.min(100, (prev.strength || 0) + (effects?.strength || 0))),
        faith: Math.max(0, Math.min(100, (prev.faith || 0) + (effects?.faith || 0))),
        honor: Math.max(0, Math.min(100, prev.honor + (effects?.honor || 0))),
        money: Math.max(0, prev.money + (effects?.money || 0)),
        activityHistory: { ...prev.activityHistory, [activity.id]: prev.currentYear },
      };
    });

    addLog(choice.logText ? `→ ${choice.logText}` : `→ ${activity.title}: ${choice.text}`);
  };

  // === MINI-GAME FINISH ===
  const handleMiniGameFinish = (success: boolean) => {
    setShowMiniGame(false);
    if (pendingCrimeAction.current) {
      pendingCrimeAction.current(success);
      pendingCrimeAction.current = null;
    }
  };

  const handlePoachingFinish = (success: boolean) => {
    setShowPoachingGame(false);
    if (pendingPoachingAction.current) {
      pendingPoachingAction.current(success);
      pendingPoachingAction.current = null;
    }
  };

  // === INVENTORY ACTIONS ===
  const handleInventoryAction = (itemId: string, action: 'eat' | 'sell') => {
    if (!character) return;
    const item = character.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (action === 'eat') {
      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          health: Math.min(100, prev.health + 30),
          inventory: prev.inventory.filter(i => i.id !== itemId),
        };
      });
      addLog('→ Você assou a carne e comeu até se fartar. Sentiu suas forças voltarem.');
    } else {
      const sellValue = item.value || 0;
      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          money: prev.money + sellValue,
          inventory: prev.inventory.filter(i => i.id !== itemId),
        };
      });
      addLog('→ Você vendeu a carne discretamente no mercado.');
    }
  };

  // === CONSUMIR ITEM DO INVENTÁRIO ===
  const consumeItem = (item: MarketItem, index: number) => {
    if (!character) return;
    setCharacter((prev) => {
      if (!prev) return prev;
      const mods = item.statModifiers ?? {};
      const updated = { ...prev };
      if (mods.health)     updated.health     = Math.min(100, prev.health + mods.health);
      if (mods.strength)   updated.strength   = Math.min(100, (prev.strength ?? 0) + mods.strength);
      if (mods.honor)      updated.honor      = Math.min(100, prev.honor + mods.honor);
      if (mods.faith)      updated.faith      = Math.min(100, (prev.faith ?? 0) + mods.faith);
      if (mods.money)      updated.money      = Math.max(0, prev.money + mods.money);
      if (item.slotIncrease) updated.maxInventorySlots = prev.maxInventorySlots + item.slotIncrease;
      // Decrement quantity; remove if reaches 0
      const newInventory = [...prev.inventory];
      const qty = newInventory[index].quantity ?? 1;
      if (qty <= 1) {
        newInventory.splice(index, 1);
      } else {
        newInventory[index] = { ...newInventory[index], quantity: qty - 1 };
      }
      updated.inventory = newInventory;
      return updated;
    });
    if (item.slotIncrease) {
      addLog(`→ Você usou ${item.name} e expandiu sua mochila em +${item.slotIncrease} espaços.`);
    } else {
      addLog(`→ Você usou ${item.name}.`);
    }
  };

  // === VENDER ITEM DO INVENTÁRIO ===
  const sellItem = (item: MarketItem, index: number) => {
    if (!character) return;
    const sellPrice = item.price > 0 ? Math.floor(item.price / 2) : 1;
    setCharacter((prev) => {
      if (!prev) return prev;
      const newInventory = [...prev.inventory];
      const qty = newInventory[index].quantity ?? 1;
      if (qty <= 1) {
        newInventory.splice(index, 1);
      } else {
        newInventory[index] = { ...newInventory[index], quantity: qty - 1 };
      }
      return { ...prev, money: prev.money + sellPrice, inventory: newInventory };
    });
    addLog(`→ Você vendeu 1x ${item.name} por ${sellPrice} moedas.`);
  };

  // === EQUIPAR/DESEQUIPAR ITEM (slots independentes: WEAPON e ARMOR) ===
  const equipItem = (index: number) => {
    const item = character?.inventory[index];
    if (item) {
      addLog(item.isEquipped
        ? `→ Você desequipou ${item.name}.`
        : `→ Você equipou ${item.name}.`
      );
    }
    setCharacter((prev) => {
      if (!prev) return prev;
      const item = prev.inventory[index];
      if (item.type !== 'WEAPON' && item.type !== 'ARMOR') return prev;

      const applyMods = (char: typeof prev, mods: MarketItem['statModifiers'], sign: 1 | -1) => {
        if (!mods) return char;
        return {
          ...char,
          health:   mods.health   ? Math.max(0, Math.min(100, char.health + mods.health * sign)) : char.health,
          strength: mods.strength ? Math.max(0, Math.min(100, (char.strength ?? 0) + mods.strength * sign)) : char.strength,
          honor:    mods.honor    ? Math.max(0, Math.min(100, char.honor + mods.honor * sign)) : char.honor,
          faith:    mods.faith    ? Math.max(0, Math.min(100, (char.faith ?? 0) + mods.faith * sign)) : char.faith,
        };
      };

      let updated = { ...prev };

      if (item.isEquipped) {
        // Toggle off — subtract this item's stats
        updated = applyMods(updated, item.statModifiers, -1);
        const newInventory = prev.inventory.map((it, i) =>
          i === index ? { ...it, isEquipped: false } : it
        );
        return { ...updated, inventory: newInventory };
      }

      // Equipping — find and unequip any existing item of the SAME type
      for (const other of prev.inventory) {
        if (other !== item && other.type === item.type && other.isEquipped) {
          updated = applyMods(updated, other.statModifiers, -1);
          break;
        }
      }

      // Add new item's stats
      updated = applyMods(updated, item.statModifiers, 1);

      // Update inventory: equip clicked, unequip same-slot others
      const newInventory = prev.inventory.map((it, i) => {
        if (it.type !== item.type) return it;
        return { ...it, isEquipped: i === index };
      });

      return { ...updated, inventory: newInventory };
    });
  };

  // === RENDERIZAR BARRA DE STATUS ===
  const renderStatusBar = (label: string, value: number, color: string) => {
    const barColor = value <= 30 ? COLORS.feedback.error : color;
    return (
      <View style={styles.statusBar}>
        <Text style={styles.statusLabel}>{label}</Text>
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: `${value}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.statusValue}>{value}%</Text>
      </View>
    );
  };

  const isSheetOpen = currentView !== 'DASHBOARD';
  const sheetTranslateY = useRef(new Animated.Value(0)).current;

  const closeSheet = () => {
    setSelectedCategory(null);
    setCurrentView('DASHBOARD');
  };

  const getSheetTitle = () => {
    switch (currentView) {
      case 'RELATIONSHIPS':
        return 'Relações';
      case 'OCCUPATION':
        return 'Ocupação';
      case 'ASSETS':
        return 'Posses';
      case 'ACTIVITIES':
        return selectedCategory === 'body_soul' ? 'Corpo & Alma'
          : selectedCategory === 'crime'      ? 'Crimes'
          : selectedCategory === 'love'       ? 'Amor & Dinastia'
          : selectedCategory === 'adoption'   ? 'Adoção'
          : selectedCategory === 'testament'  ? 'Testamento'
          : 'Atividades';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!isSheetOpen) {
      sheetTranslateY.setValue(0);
    }
  }, [isSheetOpen, sheetTranslateY]);

  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 4,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dy > 120 || gestureState.vy > 1;
        if (shouldClose) {
          Animated.timing(sheetTranslateY, {
            toValue: 520,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            closeSheet();
            sheetTranslateY.setValue(0);
          });
          return;
        }

        Animated.spring(sheetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 70,
          friction: 9,
        }).start();
      },
    })
  ).current;

  // === RENDER ===
  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const currentEra = getCurrentEra(character.location, character.currentYear);

  // === RENDERIZAR TELA PLACEHOLDER ===
  const renderPlaceholderScreen = (title: string, description: string) => (
    <View style={styles.placeholderScreen}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderText}>{description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, character.health <= 30 && styles.hungerBorder]}>
      <StatusBar style="light" />



      {/* DASHBOARD BASE VIEW */}
      <>
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <Text style={styles.headerName}>
              {character.name} {character.surname}
            </Text>
            <Text style={styles.headerInfo}>
              Idade: {character.age} anos | Ano: {character.currentYear}
            </Text>
            <Text style={styles.headerLocation}>
              📍 {character.location} | ⚡ {currentEra?.name || 'Era Desconhecida'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.headerMoney}>
                💰 ${character.money} | 🍖 {character.food}
              </Text>
              {__DEV__ && (
                <TouchableOpacity
                  onPress={() => setCharacter(prev => prev ? {
                    ...prev,
                    age: 20,
                    currentYear: prev.birthYear + 20,
                    health: 100,
                    strength: 100,
                    faith: 100,
                    honor: 100,
                    money: 999,
                    devForcePregnancy: true,
                  } : prev)}
                >
                  <Text style={{ fontSize: 10, color: COLORS.accent.gold, opacity: 0.5 }}>[ DEV: Age 20 + Stats ]</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* AVATAR */}
          <View style={styles.avatarArea}>
            <Text style={styles.avatarPlaceholder}>
              {getAvatarEmoji(character)}
            </Text>
            <Text style={styles.avatarAge}>
              {getAgeLabel(character.age)}
            </Text>
            <Text style={styles.avatarDescription}>
              {getPhysicalDescription(character.physicalTraits)}
            </Text>
          </View>

          {/* STATUS */}
          <View style={styles.statusSection}>
            {renderStatusBar('❤️ Vitalidade', character.health, COLORS.status.health)}
            {character.faith !== undefined && renderStatusBar('⛪ Fé', character.faith, COLORS.status.sanity)}
            {character.strength !== undefined && renderStatusBar('💪 Força', character.strength, '#f59e0b')}
            {renderStatusBar('🛡 Honra', character.honor, '#8b5cf6')}
            {character.faith === undefined && renderStatusBar('🧠 Sanidade', character.sanity, COLORS.status.sanity)}
          </View>

          {/* LOG */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.logSection}
            nestedScrollEnabled
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {gameLog.map((entry, index) => {
              if (entry.includes('Idade:') || entry.includes('Ano:')) {
                return (
                  <View key={index}>
                    <View style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 12, width: '100%' }} />
                    <Text style={[styles.logText, { fontWeight: 'bold', color: '#e8d5a3' }]}>{entry}</Text>
                  </View>
                );
              }
              return (
                <Text key={index} style={styles.logText}>
                  {entry}
                </Text>
              );
            })}
          </ScrollView>

      </>

      {/* FLOATING SHEET OVERLAY */}
      {isSheetOpen && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={[
              styles.sheetBackdrop,
              Platform.OS === 'web' ? ({ backdropFilter: 'blur(5px)' } as any) : null,
            ]}
            activeOpacity={1}
            onPress={closeSheet}
          />
          <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View {...sheetPanResponder.panHandlers}>
              <SheetHeader title={getSheetTitle()} onClose={closeSheet} onBack={closeSheet} />
            </View>
            <View style={styles.sheetBody}>

      {/* RELATIONSHIPS VIEW */}
      {currentView === 'RELATIONSHIPS' && (
        <RelationshipsView
          character={character}
          setCharacter={setCharacter}
          onAddToLog={addToEventLog}
          onAddLog={addLog}
          onSetCurrentEvent={setCurrentEvent}
          onNPCInteraction={handleNPCInteraction}
          onEnemyInteraction={handleEnemyInteraction}
        />
      )}

      {/* OCCUPATION VIEW */}
      {currentView === 'OCCUPATION' && (
        <OccupationView
          character={character}
          onWork={handleWork}
          onClassmateInteraction={handleClassmateInteraction}
          onTakeJob={handleTakeJob}
          onResignJob={handleResignJob}
          onCoworkerInteraction={handleCoworkerInteraction}
        />
      )}

      {/* ASSETS VIEW */}
      {currentView === 'ASSETS' && (
        <PossesView
          character={character}
          currentMarketItems={currentMarketItems}
          fixedMarketItems={FIXED_MARKET_ITEMS}
          onBuyItem={(item, adjustedPrice, isFixed) => {
            // Stacking: consumables with same id stack instead of taking a slot
            const existingIdx = item.type === 'CONSUMABLE'
              ? character.inventory.findIndex(i => i.id === item.id)
              : -1;

            if (existingIdx === -1 && character.inventory.length >= character.maxInventorySlots) {
              Alert.alert('Mochila cheia!', 'Sua mochila está cheia! Venda ou use algum item primeiro.');
              return;
            }

            setCharacter((prev) => {
              if (!prev) return prev;
              let newInventory: typeof prev.inventory;
              if (existingIdx !== -1) {
                // Increment quantity of existing stack
                newInventory = prev.inventory.map((i, idx) =>
                  idx === existingIdx ? { ...i, quantity: (i.quantity ?? 1) + 1 } : i
                );
              } else {
                // New slot: add item with quantity 1 (and its base durability)
                newInventory = [...prev.inventory, { ...item, quantity: 1 }];
              }
              return { ...prev, money: prev.money - adjustedPrice, inventory: newInventory };
            });

            // Build purchase log
            let purchaseLog = `🛒 Você comprou ${item.name} por ${adjustedPrice} moedas.`;
            if (item.maxDurability != null) {
              purchaseLog += ` (Sua durabilidade é de ${item.maxDurability} usos).`;
            }
            addLog(purchaseLog);

            if (!isFixed) {
              setCurrentMarketItems((prev) => prev.filter((i) => i.id !== item.id));
            }
          }}
          onConsumeItem={consumeItem}
          onSellItem={sellItem}
          onEquipItem={equipItem}
          onClose={() => setCurrentView('DASHBOARD')}
        />
      )}

      {/* ACTIVITIES VIEW */}
      {currentView === 'ACTIVITIES' && !selectedCategory && (
        <View style={styles.activitiesScreen}>
          <Text style={styles.activitiesTitle}>⚡ Atividades</Text>
          <View style={styles.activitiesGrid}>
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('body_soul')}
            >
              <Text style={styles.categoryLabel}>🙏 Corpo & Alma</Text>
              <Text style={styles.categoryChevron}>›</Text>
            </TouchableOpacity>

            {(character.socialClass === 'peasant' || character.socialClass === 'artisan') && (
              <TouchableOpacity
                style={[styles.categoryCard, character.age < 10 && styles.categoryCardDisabled]}
                activeOpacity={character.age < 10 ? 1 : 0.7}
                onPress={() => { if (character.age >= 10) setSelectedCategory('crime'); }}
              >
                <Text style={styles.categoryLabel}>
                  🗡️ Crimes{character.age < 10 ? ' (10+)' : ''}
                </Text>
                <Text style={styles.categoryChevron}>›</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('love')}
            >
              <Text style={styles.categoryLabel}>❤️ Amor & Dinastia</Text>
              <Text style={styles.categoryChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('adoption')}
            >
              <Text style={styles.categoryLabel}>👶 Adoção</Text>
              <Text style={styles.categoryChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('testament')}
            >
              <Text style={styles.categoryLabel}>📜 Testamento</Text>
              <Text style={styles.categoryChevron}>›</Text>
            </TouchableOpacity>

            {/* ── Divider ── */}
            <View style={styles.quitDivider} />

            {/* ── Desistir ── */}
            <TouchableOpacity
              style={styles.quitCard}
              activeOpacity={0.75}
              onPress={() =>
                Alert.alert(
                  '🚪 Desistir desta Vida',
                  `${character.name} ${character.surname} tem ${character.age} anos.\n\nAbandonar esta vida apagará todo o progresso atual. Tem certeza?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Desistir',
                      style: 'destructive',
                      onPress: () => {
                        setCurrentView('DASHBOARD');
                        startNewLife();
                      },
                    },
                  ]
                )
              }
            >
              <Text style={styles.quitLabel}>🚪 Desistir</Text>
              <Text style={styles.quitChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ACTIVITIES DETAIL: CORPO & ALMA */}
      {currentView === 'ACTIVITIES' && selectedCategory === 'body_soul' && (
        <View style={styles.activitiesScreen}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.activitiesTitle}>🙏 Corpo & Alma</Text>
          <Text style={styles.activitiesSubtitle}>Atividades para fortalecer corpo e espírito</Text>
          <View style={styles.activitiesGrid}>
            {ACTIVITY_EVENTS.map((act) => {
              const doneThisYear = character.activityHistory[act.id] === character.currentYear;
              return (
                <TouchableOpacity
                  key={act.id}
                  style={styles.activityCard}
                  activeOpacity={0.7}
                  onPress={() => handleActivityPress(act)}
                >
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityLabel}>{act.label}</Text>
                    {doneThisYear && <Text style={styles.activityCheck}>✓</Text>}
                  </View>
                  <Text style={styles.activityDesc}>{act.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ACTIVITIES DETAIL: CRIMES */}
      {currentView === 'ACTIVITIES' && selectedCategory === 'crime' && (
        <View style={styles.activitiesScreen}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.activitiesTitle}>🗡️ Crimes</Text>
          <Text style={styles.activitiesSubtitle}>Atividades ilícitas para os desesperados</Text>
          <View style={styles.activitiesGrid}>
            {CRIME_EVENTS.map((act) => {
              const doneThisYear = character.activityHistory[act.id] === character.currentYear;
              return (
                <TouchableOpacity
                  key={act.id}
                  style={styles.activityCard}
                  activeOpacity={0.7}
                  onPress={() => handleActivityPress(act as any)}
                >
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityLabel}>{act.label}</Text>
                    {doneThisYear && <Text style={styles.activityCheck}>✓</Text>}
                  </View>
                  <Text style={styles.activityDesc}>{act.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ACTIVITIES DETAIL: AMOR & DINASTIA */}
      {currentView === 'ACTIVITIES' && selectedCategory === 'love' && (
        <View style={styles.activitiesScreen}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.activitiesTitle}>❤️ Amor & Dinastia</Text>

          {/* Status badge */}
          <View style={styles.loveStatusBadge}>
            <Text style={styles.loveStatusText}>
              {character.partner ? `💑 ${character.partner.status}: ${character.partner.name}` : '🔓 Solteiro(a)'}
            </Text>
          </View>

          {/* ── Partnered message ─────────────────────────────────── */}
          {character.partner && (
            <View style={styles.lovePartnerBox}>
              <Text style={styles.lovePartnerText}>
                💑 Você já possui um compromisso com {character.partner.name}.{'\n'}Visite a aba <Text style={{ color: COLORS.accent.gold, fontWeight: '700' }}>Relações</Text> para interagir.
              </Text>
            </View>
          )}

          {/* ── Search buttons (only when single) ─────────────────── */}
          {!character.partner && (
            <View style={styles.activitiesGrid}>
              {/* ─── Camponês ─────────────────────────────────────── */}
              {character.socialClass === 'peasant' && (
                <>
                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (Math.random() < 0.3) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você procurou pela aldeia, mas não encontrou ninguém interessante.');
                        Alert.alert('💔 Sem sorte...', 'Você procurou, mas não encontrou ninguém interessante.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>🔍 Procurar pretendentes pela aldeia</Text>
                    </View>
                    <Text style={styles.activityDesc}>Grátis · 30% de chance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (character.money < 5) {
                        Alert.alert('💰 Moedas insuficientes', 'Você precisa de 5 💰 para ir à taverna.');
                        return;
                      }
                      setCharacter(prev => prev ? { ...prev, money: prev.money - 5 } : prev);
                      if (Math.random() < 0.7) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você gastou 5 moedas na taverna, mas voltou sozinho.');
                        Alert.alert('💔 Sem sorte...', 'Você gastou a noite na taverna mas não encontrou ninguém.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>🍻 Tentar a sorte cortejando na taverna</Text>
                    </View>
                    <Text style={styles.activityDesc}>5 💰 · 70% de chance</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ─── Artesão ──────────────────────────────────────── */}
              {character.socialClass === 'artisan' && (
                <>
                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (Math.random() < 0.3) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você consultou as famílias da Guilda, mas nenhuma apresentou candidatos.');
                        Alert.alert('💔 Sem sorte...', 'Nenhuma família da Guilda apresentou candidatos desta vez.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>👀 Buscar pretendentes nas famílias da Guilda</Text>
                    </View>
                    <Text style={styles.activityDesc}>Grátis · 30% de chance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (character.money < 15) {
                        Alert.alert('💰 Moedas insuficientes', 'Você precisa de 15 💰 para contratar a casamenteira.');
                        return;
                      }
                      setCharacter(prev => prev ? { ...prev, money: prev.money - 15 } : prev);
                      if (Math.random() < 0.75) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você pagou 15 moedas à casamenteira, mas ela não encontrou ninguém adequado.');
                        Alert.alert('💔 Sem sorte...', 'A casamenteira não encontrou ninguém adequado desta vez.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>👵 Pagar casamenteira para achar um bom partido</Text>
                    </View>
                    <Text style={styles.activityDesc}>15 💰 · 75% de chance</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ─── Nobreza ──────────────────────────────────────── */}
              {(character.socialClass === 'nobility' || character.socialClass === 'gentry') && (
                <>
                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (Math.random() < 0.3) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você sondou a Corte, mas não encontrou candidatos adequados ao seu status.');
                        Alert.alert('💔 Sem sorte...', 'Não há candidatos adequados ao seu status no momento.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>🏰 Sondar pretendentes solteiros na Corte</Text>
                    </View>
                    <Text style={styles.activityDesc}>Grátis · 30% de chance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (character.money < 300) {
                        Alert.alert('💰 Moedas insuficientes', 'Você precisa de 300 💰 para enviar diplomatas.');
                        return;
                      }
                      setCharacter(prev => prev ? { ...prev, money: prev.money - 300 } : prev);
                      if (Math.random() < 0.85) {
                        setPotentialMatch(generateMatch(character.age, character.socialClass));
                      } else {
                        addLog('💔 Você gastou 300 moedas em diplomatas, mas as negociações fracassaram.');
                        Alert.alert('💔 Negociação fracassou', 'As negociações não chegaram a um acordo favorável.');
                      }
                    }}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityLabel}>📜 Enviar diplomatas para negociar noivado</Text>
                    </View>
                    <Text style={styles.activityDesc}>300 💰 · 85% de chance</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      )}

      {/* POTENTIAL MATCH MODAL */}
      <Modal
        visible={!!potentialMatch}
        transparent
        animationType="fade"
        onRequestClose={() => setPotentialMatch(null)}
      >
        <View style={styles.matchOverlay}>
          {potentialMatch && (
            <View style={styles.matchCard}>
              <Text style={styles.matchHeader}>❤️ Interesse Amoroso</Text>

              {/* Info fields */}
              <View style={styles.matchInfoSection}>
                {[
                  ['Nome',          potentialMatch.name],
                  ['Gênero',        potentialMatch.gender],
                  ['Idade',         String(potentialMatch.age)],
                  ['Classe Social', potentialMatch.socialClass],
                  ['Ocupação',      potentialMatch.occupation],
                ].map(([label, value]) => (
                  <View key={label} style={styles.matchInfoRow}>
                    <Text style={styles.matchInfoLabel}>{label}</Text>
                    <Text style={styles.matchInfoValue}>{value}</Text>
                  </View>
                ))}
              </View>

              {/* Stats bars */}
              <View style={styles.matchStatsSection}>
                {([
                  ['Vitalidade', potentialMatch.stats.vitality,  '#e05555'],
                  ['Força',      potentialMatch.stats.strength,  '#e09a30'],
                  ['Honra',      potentialMatch.stats.honor,     '#4a7abf'],
                  ['Riqueza',    potentialMatch.stats.wealth,    '#4aaf72'],
                ] as [string, number, string][]).map(([label, value, color]) => (
                  <View key={label} style={styles.matchStatRow}>
                    <Text style={styles.matchStatLabel}>{label}</Text>
                    <View style={styles.matchStatBarBg}>
                      <View style={[styles.matchStatBarFill, { width: `${value}%` as any, backgroundColor: color }]} />
                    </View>
                  </View>
                ))}
              </View>

              {/* Action buttons */}
              <TouchableOpacity
                style={styles.matchBtnCourt}
                activeOpacity={0.8}
                onPress={() => {
                  setCharacter(prev => prev ? {
                    ...prev,
                    partner: {
                      name: potentialMatch.name,
                      gender: potentialMatch.gender as 'Masculino' | 'Feminino',
                      status: 'Pretendente',
                      socialClass: potentialMatch.socialClass,
                      age: potentialMatch.age,
                      occupation: potentialMatch.occupation,
                      relationship: 20,
                      stats: potentialMatch.stats,
                    },
                  } : prev);
                  addLog(`❤️ Você iniciou o cortejo com ${potentialMatch.name} (${potentialMatch.socialClass}).`);
                  setPotentialMatch(null);
                }}
              >
                <Text style={styles.matchBtnCourtText}>💑 Iniciar Cortejo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.matchBtnPass}
                activeOpacity={0.8}
                onPress={() => setPotentialMatch(null)}
              >
                <Text style={styles.matchBtnPassText}>Não faz meu tipo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* ACTIVITIES DETAIL: ADOÇÃO */}
      {currentView === 'ACTIVITIES' && selectedCategory === 'adoption' && (
        <View style={styles.activitiesScreen}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.activitiesTitle}>👶 Adoção</Text>
          <Text style={styles.activitiesSubtitle}>Sistema de Orfanatos e Adoção em construção...</Text>
        </View>
      )}

      {/* ACTIVITIES DETAIL: TESTAMENTO */}
      {currentView === 'ACTIVITIES' && selectedCategory === 'testament' && (
        <View style={styles.activitiesScreen}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.activitiesTitle}>📜 Testamento</Text>
          <Text style={styles.activitiesSubtitle}>Sistema de Herança e Legado em construção...</Text>
        </View>
      )}

            </View>
          </Animated.View>
        </View>
      )}

      {/* ACTIVITY MICRO-EVENT MODAL */}
      <EventModal
        isOpen={!!activeActivity}
        event={activeActivity ? {
          title: activeActivity.title,
          description: activeActivity.description,
          choices: activeActivity.choices.map((c, i) => ({
            id: String(i),
            text: c.text,
            preview: c.preview,
          })),
        } : undefined}
        onChoice={handleActivityChoice}
      />

      {/* EVENT MODAL - eventModal state */}
      <EventModal
        isOpen={eventModal.isOpen}
        event={eventModal.event}
        onChoice={handleEventChoice}
      />

      {/* EVENT MODAL - currentEvent (historical/random) */}
      <EventModal
        isOpen={!!currentEvent}
        event={currentEvent ? {
          title: currentEvent.title,
          description: currentEvent.description,
          choices: currentEvent.options?.map((option: any, index: number) => ({
            id: String(index),
            text: option.text,
            preview: option.preview || '',
          })) || [],
        } : undefined}
        onChoice={(id) => {
          if (currentEvent?.options) {
            const option = currentEvent.options[Number(id)];
            if (option) chooseOption(option);
          }
        }}
      />

      {/* SIMPLE EVENT MODAL */}
      <EventModal
        isOpen={!!simpleEvent}
        event={simpleEvent ? {
          title: simpleEvent.title,
          description: simpleEvent.description,
          choices: simpleEvent.choices.map((choice, index) => ({
            id: String(index),
            text: choice.label,
            preview: [
              choice.effect.vitality ? `Vitalidade: ${choice.effect.vitality > 0 ? '+' : ''}${choice.effect.vitality}` : '',
              choice.effect.faith ? `Fé: ${choice.effect.faith > 0 ? '+' : ''}${choice.effect.faith}` : '',
              choice.effect.strength ? `Força: ${choice.effect.strength > 0 ? '+' : ''}${choice.effect.strength}` : '',
              choice.effect.honor ? `Honra: ${choice.effect.honor > 0 ? '+' : ''}${choice.effect.honor}` : '',
              choice.effect.money ? `$${choice.effect.money > 0 ? '+' : ''}${choice.effect.money}` : '',
            ].filter(Boolean).join(' | '),
          })),
        } : undefined}
        onChoice={(id) => handleSimpleEventChoice(Number(id))}
      />

      {/* BIRTH MODAL */}
      <BirthModal
        pregnancy={showBirthModal ? (pendingBirthCharRef.current?.pendingPregnancy ?? null) : null}
        onNameChosen={handleBirthNameChosen}
      />

      {/* SIBLING BIRTH MODAL */}
      <EventModal
        isOpen={siblingBirthModal.isOpen}
        event={siblingBirthModal.isOpen ? {
          title: '👶 Novo Irmão!',
          description: `Sua mãe deu à luz a ${siblingBirthModal.gender === 'male' ? 'um menino' : 'uma menina'}: ${siblingBirthModal.name}!`,
          choices: [{ id: 'ok', text: 'OK' }],
        } : undefined}
        onChoice={() => handleSiblingBirthDismiss()}
      />

      {/* NPC REACTIVE EVENT MODAL */}
      <EventModal
        isOpen={npcEvent.isOpen}
        event={npcEvent.event}
        onChoice={handleNpcEventChoice}
      />

      {/* DUEL MINI-GAME MODAL — only mounted when active, mirroring EventModal pattern */}
      {character && duelModal.isVisible && (
        <DuelModal
          isVisible={duelModal.isVisible}
          onClose={() => setDuelModal(prev => ({ ...prev, isVisible: false }))}
          playerStrength={character.strength ?? 50}
          opponentStrength={duelModal.opponentStrength}
          opponentName={duelModal.opponentName}
          onDuelEnd={handleDuelEnd}
        />
      )}

      {/* MINI-GAME OVERLAY */}
      {showMiniGame && (
        <PickpocketGame
          difficulty={miniGameDifficulty}
          onFinish={handleMiniGameFinish}
        />
      )}

      {/* POACHING MINI-GAME OVERLAY */}
      {showPoachingGame && (
        <PoachingGame onFinish={handlePoachingFinish} />
      )}

      {/* FOOTER MENU */}
      <FooterMenu handleAgeUp={ageUp} />
    </View>
  );
}

// === APP WRAPPER COM PROVIDER ===
export default function App() {
  return (
    <ViewProvider>
      <AppContent />
    </ViewProvider>
  );
}

// === ESTILOS ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 80,
  },
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetContainer: {
    height: '88%',
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.background.tertiary,
  },
  sheetBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hungerBorder: {
    borderWidth: 3,
    borderColor: COLORS.feedback.error,
  },
  loadingText: {
    color: COLORS.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    marginBottom: 15,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    textAlign: 'center',
  },
  headerInfo: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 3,
  },
  headerLocation: {
    fontSize: 12,
    color: COLORS.text.highlight,
    textAlign: 'center',
    marginTop: 3,
  },
  headerMoney: {
    fontSize: 14,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginTop: 3,
  },
  avatarArea: {
    alignItems: 'center',
    marginVertical: 15,
    padding: 15,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
  },
  avatarPlaceholder: {
    fontSize: 60,
  },
  avatarAge: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  avatarDescription: {
    fontSize: 10,
    color: COLORS.text.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  statusSection: {
    marginBottom: 15,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    color: COLORS.text.primary,
    fontSize: 13,
    width: 100,
  },
  barContainer: {
    flex: 1,
    height: 18,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  statusValue: {
    color: COLORS.text.secondary,
    fontSize: 11,
    width: 35,
    textAlign: 'right',
  },
  logSection: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  logText: {
    color: COLORS.text.primary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
  },
  eventChoices: {
    marginBottom: 10,
  },
  choiceButton: {
    backgroundColor: COLORS.accent.bronze,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  choiceText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  choicePreview: {
    color: COLORS.text.secondary,
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ageButton: {
    backgroundColor: COLORS.accent.gold,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  ageButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background.primary,
  },
  hungerWarning: {
    backgroundColor: COLORS.feedback.error,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  hungerWarningText: {
    color: COLORS.text.primary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: COLORS.accent.gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.background.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // === ACTIVITIES ===
  activitiesScreen: {
    flex: 1,
  },
  activitiesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  activitiesSubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  activitiesGrid: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  activityCheck: {
    fontSize: 16,
    color: COLORS.feedback.success,
    fontWeight: 'bold',
  },
  activityDesc: {
    fontSize: 13,
    color: COLORS.accent.gold,
  },
  categoryCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  categoryChevron: {
    fontSize: 24,
    color: COLORS.accent.gold,
    fontWeight: 'bold',
  },
  quitDivider: {
    height: 1,
    backgroundColor: COLORS.background.tertiary,
    marginVertical: 4,
  },
  quitCard: {
    backgroundColor: 'rgba(161, 58, 47, 0.12)',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.feedback.error,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quitLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.feedback.error,
  },
  quitChevron: {
    fontSize: 24,
    color: COLORS.feedback.error,
    fontWeight: 'bold',
  },
  categoryBackButton: {
    marginBottom: 12,
  },
  categoryBackText: {
    fontSize: 14,
    color: COLORS.accent.gold,
    fontWeight: '600',
  },
  // === LOVE TAB ===
  loveStatusBadge: {
    alignSelf: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
    marginBottom: 20,
  },
  loveStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent.gold,
  },
  lovePartnerBox: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
    alignItems: 'center',
  },
  lovePartnerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // === LOVE SECTION ===
  loveSectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b89a5a',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lovePartnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lovePartnerEmoji: {
    fontSize: 22,
  },
  lovePartnerName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  lovePartnerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lovePartnerStatus: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  partnerCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.accent.bronze,
    marginTop: 8,
  },
  // === POTENTIAL MATCH MODAL ===
  matchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#b89a5a',
  },
  matchHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e8d5a3',
    textAlign: 'center',
    marginBottom: 18,
  },
  matchInfoSection: {
    marginBottom: 16,
    gap: 6,
  },
  matchInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  matchInfoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
  },
  matchInfoValue: {
    fontSize: 13,
    color: '#e8d5a3',
    fontWeight: '600',
  },
  matchStatsSection: {
    marginBottom: 20,
    gap: 10,
  },
  matchStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  matchStatLabel: {
    fontSize: 12,
    color: '#aaa',
    width: 68,
  },
  matchStatBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#2a2a3e',
    borderRadius: 5,
    overflow: 'hidden',
  },
  matchStatBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  matchBtnCourt: {
    backgroundColor: '#2a4a8a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a7abf',
  },
  matchBtnCourtText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  matchBtnPass: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  matchBtnPassText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  // === ASSETS ===
  assetsScreen: {
    flex: 1,
  },
  assetsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  assetsSubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  assetsEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetsEmptyText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  assetsScroll: {
    flex: 1,
  },
  assetsCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent.gold,
    marginBottom: 10,
    marginTop: 4,
  },
  assetCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  assetType: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  assetFoodCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  assetFoodInfo: {
    marginBottom: 10,
  },
  assetFoodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  assetActionBtn: {
    flex: 1,
    backgroundColor: '#4ade80',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  assetActionBtnSell: {
    flex: 1,
    backgroundColor: COLORS.accent.bronze,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  assetActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});
