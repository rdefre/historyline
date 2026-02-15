/**
 * TIPOS DO HISTORY LINE
 * Definições de tipos para todo o jogo
 */

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

  // Rastreamento de eventos já mostrados (evita repetição)
  usedChildhoodEvents: string[];

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
  inventory: { id: string; name: string; type: string; value?: number; description?: string }[];

  // Emprego atual
  currentJob?: Job | null;

  // Contexto Histórico
  birthYear: number;       // Ano de nascimento
  currentYear: number;     // Ano atual
  era: Era;               // Era histórica
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
  relationship: number; // 0-100
}

// === RELACIONAMENTOS ===
export interface Relationship {
  name: string;
  type: 'father' | 'mother' | 'sibling' | 'spouse' | 'child' | 'friend' | 'enemy';
  relationship: number;    // 0-100 (quanto gosta de você)
  isAlive: boolean;
}

// === ERAS HISTÓRICAS ===
export type Era = 
  | 'tribal'           // 1500-1700
  | 'colonial'         // 1600-1800
  | 'industrial'       // 1800-1920
  | 'modern'           // 1920-2000
  | 'contemporary'     // 2000-2050
  | 'future';          // 2050-2100

// === EVENTOS SIMPLES (para modais) ===
export interface SimpleEventChoice {
  id: string;
  text: string;
  preview?: string;
  stats?: { [key: string]: number };
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
