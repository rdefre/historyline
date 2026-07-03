/**
 * TIPOS DO HISTORY LINE
 * Definições de tipos para todo o jogo
 */

// === GRAVIDEZ PENDENTE ===
export interface PendingPregnancy {
  partnerName: string;
  partnerGender: string;
  type: 'Legítimo' | 'Bastardo';
}

// === FILHOS ===
export interface Child {
  id: string;
  name: string;
  gender: 'Masculino' | 'Feminino';
  type: 'Legítimo' | 'Bastardo' | 'Adotivo';
  age: number;
  relationship: number;
  health: number;
  isBaptized: boolean;
  profession?: string;
  isDead?: boolean;
  deathAge?: number;
}

// === PERSONAGEM ===
export interface Character {
  // Informações Básicas
  name: string;
  surname: string;
  age: number;
  gender: 'male' | 'female';

  // Atributos Principais (variam por era)
  health: number;           // Vitalidade (0-100)
  sanity: number;          // Sanidade (0-100)
  honor: number;           // Honra/Reputação (0-100)
  intelligence: number;    // Inteligência (0-100)

  // Stats específicos de eras antigas
  faith?: number;          // Fé/Devoção (Era Tudor) (0-100)
  strength?: number;       // Força Física (Era Tudor) (0-100)

  // Recursos
  money: number;           // Dinheiro disponível
  food: number;            // Comida (apenas em eras antigas)
  partner?: {
    name: string;
    gender: 'Masculino' | 'Feminino';
    status: 'Pretendente' | 'Esposa' | 'Esposo';
    socialClass: string;
    age: number;
    occupation: string;
    relationship: number; // 0-100 (was relationshipLevel)
    stats: { vitality: number; strength: number; honor: number; wealth: number };
    isDead?: boolean;
    deathAge?: number;
  } | null; // Par romântico
  hasSyphilis?: boolean;
  birthControlActive?: boolean;
  pendingPregnancy?: PendingPregnancy | null;
  devForcePregnancy?: boolean;

  // Relacionamentos
  relationships: Relationship[];

  // Histórico
  traits: string[];        // Características (Gênio, Doentio, etc)
  profession?: string;     // Profissão atual
  location: string;        // Localização atual

  // Aparência Física (definida ao nascer, permanente)
  physicalTraits: {
    hairColor: 'loiro' | 'moreno' | 'ruivo' | 'preto';
    skinTone: 'claro' | 'medio' | 'escuro';
  };

  // Classe Social e Família
  socialClass: 'peasant' | 'artisan' | 'gentry' | 'nobility';
  family: {
    fatherName: string;
    fatherOccupation: string;
    fatherRelationship: number;
    fatherAge: number;
    fatherAlive: boolean;
    fatherStats?: { vitality: number; faith: number; strength: number; honor: number; money: number };
    motherName: string;
    motherDescription: string;
    motherRelationship: number;
    motherAge: number;
    motherAlive: boolean;
    motherStats?: { vitality: number; faith: number; strength: number; honor: number; money: number };
    isAlive: boolean; // Para eventos de orfandade (ambos mortos)
  };

  // Sistema de Narrative Flags (para nexo entre eventos)
  narrativeFlags: {
    isOrphan: boolean;           // Perdeu os pais
    hasApprentice: boolean;      // É aprendiz
    livingWith: 'parents' | 'relative' | 'alone' | 'master'; // Com quem mora
    lastMajorEvent?: string;     // Último evento importante (para evitar repetição)
  };

  // Filhos
  children: Child[];

  // Rastreamento de eventos já mostrados (evita repetição)
  usedChildhoodEvents: string[];
  recentEventIds: string[]; // sliding window — últimos N eventos aleatórios
  partnerActionsThisYear: string[]; // cooldown anual de interações com parceiro(a)
  childActionsThisYear?: string[]; // cooldown anual de interações com filhos

  // Irmãos
  siblings: {
    id: string;
    name: string;
    gender: 'male' | 'female';
    age: number;
    relationship: number; // 0-100
    stats?: { vitality: number; faith: number; strength: number; honor: number; money: number };
  }[];

  // Colegas/Companheiros
  classmates: {
    id: string;
    name: string;
    relationship: number;
    socialClass: string;
  }[];

  // Log de eventos por ano
  eventLog: {
    year: number;
    entries: {
      text: string;
      type: 'neutral' | 'success' | 'fail';
    }[];
  }[];

  // Histórico de interações com NPCs
  npcInteractionHistory: {
    year: number;
    npcId: string;
    actionType: string;
  }[];

  // Histórico de atividades (id -> ano em que foi feita)
  activityHistory: Record<string, number>;

  // Inventário de itens
  inventory: MarketItem[];
  flags?: Record<string, boolean>;
  maxInventorySlots: number;

  // Inimigos e aliados globais (persistem além do emprego)
  globalEnemies: GlobalEnemy[];

  // Emprego atual
  currentJob?: Job | null;

  // Contexto Histórico
  birthYear: number;       // Ano de nascimento
  currentYear: number;     // Ano atual
  era: Era;               // Era histórica
}

// === ITEM DE MERCADO / INVENTÁRIO ===
export interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: 'CONSUMABLE' | 'WEAPON' | 'ARMOR' | 'ASSET' | 'childhood' | 'food';
  description: string;
  allowedClasses: string[];
  statModifiers?: {
    health?: number;
    strength?: number;
    honor?: number;
    faith?: number;
    money?: number;
  };
  isEquipped?: boolean;
  upkeepCost?: number;
  income?: number;
  slotIncrease?: number;
  quantity?: number;
  durability?: number;
  maxDurability?: number;
}

// === EMPREGO ===
export interface Job {
  id: string;
  title: string;
  emoji: string;
  description: string;
  income: number;           // Annual income
  vitalityImpact: number;   // Annual vitality change
  strengthImpact?: number;  // Annual strength change
  honorImpact?: number;     // Annual honor change
  faithImpact?: number;     // Annual faith change
  coworkers?: Coworker[];   // Co-workers at this job
}

// === COLEGAS DE TRABALHO ===
export interface Coworker {
  id: string;
  name: string;
  role: string;  // e.g., "Mestre", "Aprendiz", "Supervisor"
  age: number;          // Current age; incremented each year
  emoji: string;        // Visual icon displayed in card and sheet header
  relationship: number; // 0-100
  loyaltyScore: number; // -100 to 100; persists across years
  strength?: number;    // 0-100; visible in sheet for duel risk evaluation
}

// === RELACIONAMENTOS ===
export interface Relationship {
  name: string;
  type: 'father' | 'mother' | 'sibling' | 'spouse' | 'child' | 'friend' | 'enemy';
  relationship: number;    // 0-100 (quanto gosta de você)
  isAlive: boolean;
}

// === INIMIGOS / ALIADOS GLOBAIS ===
export interface GlobalEnemy {
  id: string;
  name: string;
  type: 'ENEMY' | 'FRIEND' | 'FAMILY';
  age: number;
  emoji: string;
  strength: number;        // 0-100
  relationshipLevel: number; // 0-100 (0 = ódio absoluto, 100 = amor)
}

// === ERAS HISTÓRICAS ===
export type Era =
  | 'tudor'            // Inglaterra 1500-1699
  | 'georgian'         // Inglaterra 1700-1849
  | 'victorian'        // Inglaterra 1850-1919
  | 'colonial'         // América 1500-1699
  | 'independence'     // América 1700-1849
  | 'industrial'       // América 1850-1919
  | 'modern'           // 1920-1999
  | 'contemporary';    // 2000-2100

// === EVENTOS SIMPLES (para modais) ===
export interface SimpleEventChoice {
  id: string;
  text: string;
  preview?: string;
  stats?: { [key: string]: number };
  /** When true, selecting this choice launches the DuelModal instead of resolving immediately. */
  triggersDuel?: boolean;
  /** ID of the coworker who will be the duel opponent. Required when triggersDuel is true. */
  duelOpponentId?: string;
}

export interface SimpleEvent {
  title: string;
  description: string;
  choices: SimpleEventChoice[];
}

// === EVENTOS ALEATÓRIOS ===
export interface RandomEventChoice {
  label: string;
  consequence: string;
  effect: {
    vitality?: number;
    faith?: number;
    strength?: number;
    honor?: number;
    money?: number;
  };
}

export interface RandomGameEvent {
  id: string;
  title: string;
  description: string;
  choices: RandomEventChoice[];
  minAge?: number;
  maxAge?: number;
  socialClasses?: string[];
}

// === EVENTOS ===
export interface GameEvent {
  id: string;
  title: string;
  description: string;

  // Condições para aparecer
  minYear?: number;
  maxYear?: number;
  requiredAge?: number;
  requiredTags?: string[];

  // Opções disponíveis
  options: EventOption[];
}

export interface EventOption {
  text: string;

  // Custos
  moneyCost?: number;
  foodCost?: number;

  // Resultados
  successChance: number;   // 0-100
  successResult: EventResult;
  failureResult?: EventResult;

  // Requisitos
  requiredSkill?: {
    type: 'health' | 'sanity' | 'honor' | 'intelligence';
    minimum: number;
  };
}

export interface EventResult {
  message: string;

  // Mudanças nos atributos
  healthChange?: number;
  sanityChange?: number;
  honorChange?: number;
  intelligenceChange?: number;

  // Mudanças nos recursos
  moneyChange?: number;
  foodChange?: number;

  // Consequências especiais
  addTrait?: string;
  removeTrait?: string;
  death?: boolean;
  gameOver?: boolean;
}

// === POTENTIAL MATCH ===
export interface PotentialMatch {
  name: string;
  gender: string;
  age: number;
  socialClass: string;
  occupation: string;
  stats: {
    vitality: number;
    strength: number;
    honor: number;
    wealth: number;
  };
}

// === SAVE/LOAD ===
export interface GameState {
  character: Character;
  gameLog: string[];
  currentEvent?: GameEvent;
  familyTree: Character[];
  achievements: string[];
}

// === CONFIGURAÇÕES ===
export interface GameConfig {
  difficulty: 'easy' | 'normal' | 'hard' | 'realistic';
  startYear: number;
  startLocation: string;
  historicalEvents: boolean;
}
