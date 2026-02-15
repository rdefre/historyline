/**
 * SISTEMA DE AVATAR EVOLUTIVO
 * Emojis mudam conforme idade e gênero
 * Características físicas (cabelo, pele) são permanentes
 */

import type { Character } from '../types/game.types';

// Mapeamento de emojis por idade, gênero e características físicas
const AVATAR_EMOJIS = {
  // BEBÊ (0-2 anos)
  baby: {
    male: {
      loiro: { claro: '👶🏻', medio: '👶🏼', escuro: '👶🏽' },
      moreno: { claro: '👶🏼', medio: '👶🏽', escuro: '👶🏾' },
      ruivo: { claro: '👶🏻', medio: '👶🏼', escuro: '👶🏽' },
      preto: { claro: '👶🏽', medio: '👶🏾', escuro: '👶🏿' },
    },
    female: {
      loiro: { claro: '👶🏻', medio: '👶🏼', escuro: '👶🏽' },
      moreno: { claro: '👶🏼', medio: '👶🏽', escuro: '👶🏾' },
      ruivo: { claro: '👶🏻', medio: '👶🏼', escuro: '👶🏽' },
      preto: { claro: '👶🏽', medio: '👶🏾', escuro: '👶🏿' },
    },
  },
  
  // CRIANÇA PEQUENA (3-5 anos)
  toddler: {
    male: {
      loiro: { claro: '🧒🏻', medio: '🧒🏼', escuro: '🧒🏽' },
      moreno: { claro: '🧒🏼', medio: '🧒🏽', escuro: '🧒🏾' },
      ruivo: { claro: '🧒🏻', medio: '🧒🏼', escuro: '🧒🏽' },
      preto: { claro: '🧒🏽', medio: '🧒🏾', escuro: '🧒🏿' },
    },
    female: {
      loiro: { claro: '🧒🏻', medio: '🧒🏼', escuro: '🧒🏽' },
      moreno: { claro: '🧒🏼', medio: '🧒🏽', escuro: '🧒🏾' },
      ruivo: { claro: '🧒🏻', medio: '🧒🏼', escuro: '🧒🏽' },
      preto: { claro: '🧒🏽', medio: '🧒🏾', escuro: '🧒🏿' },
    },
  },
  
  // CRIANÇA (6-9 anos)
  child: {
    male: {
      loiro: { claro: '👦🏻', medio: '👦🏼', escuro: '👦🏽' },
      moreno: { claro: '👦🏼', medio: '👦🏽', escuro: '👦🏾' },
      ruivo: { claro: '👦🏻', medio: '👦🏼', escuro: '👦🏽' },
      preto: { claro: '👦🏽', medio: '👦🏾', escuro: '👦🏿' },
    },
    female: {
      loiro: { claro: '👧🏻', medio: '👧🏼', escuro: '👧🏽' },
      moreno: { claro: '👧🏼', medio: '👧🏽', escuro: '👧🏾' },
      ruivo: { claro: '👧🏻', medio: '👧🏼', escuro: '👧🏽' },
      preto: { claro: '👧🏽', medio: '👧🏾', escuro: '👧🏿' },
    },
  },
  
  // PRÉ-ADOLESCENTE (10-12 anos)
  preteen: {
    male: {
      loiro: { claro: '🧑🏻', medio: '🧑🏼', escuro: '🧑🏽' },
      moreno: { claro: '🧑🏼', medio: '🧑🏽', escuro: '🧑🏾' },
      ruivo: { claro: '🧑🏻', medio: '🧑🏼', escuro: '🧑🏽' },
      preto: { claro: '🧑🏽', medio: '🧑🏾', escuro: '🧑🏿' },
    },
    female: {
      loiro: { claro: '👧🏻', medio: '👧🏼', escuro: '👧🏽' },
      moreno: { claro: '👧🏼', medio: '👧🏽', escuro: '👧🏾' },
      ruivo: { claro: '👧🏻', medio: '👧🏼', escuro: '👧🏽' },
      preto: { claro: '👧🏽', medio: '👧🏾', escuro: '👧🏿' },
    },
  },
  
  // ADOLESCENTE (13-17 anos)
  teen: {
    male: {
      loiro: { claro: '👱🏻‍♂️', medio: '👱🏼‍♂️', escuro: '👱🏽‍♂️' },
      moreno: { claro: '👨🏼‍🦱', medio: '👨🏽‍🦱', escuro: '👨🏾‍🦱' },
      ruivo: { claro: '👨🏻‍🦰', medio: '👨🏼‍🦰', escuro: '👨🏽‍🦰' },
      preto: { claro: '👨🏽‍🦱', medio: '👨🏾‍🦱', escuro: '👨🏿‍🦱' },
    },
    female: {
      loiro: { claro: '👱🏻‍♀️', medio: '👱🏼‍♀️', escuro: '👱🏽‍♀️' },
      moreno: { claro: '👩🏼‍🦱', medio: '👩🏽‍🦱', escuro: '👩🏾‍🦱' },
      ruivo: { claro: '👩🏻‍🦰', medio: '👩🏼‍🦰', escuro: '👩🏽‍🦰' },
      preto: { claro: '👩🏽‍🦱', medio: '👩🏾‍🦱', escuro: '👩🏿‍🦱' },
    },
  },
  
  // ADULTO JOVEM (18-30 anos)
  youngAdult: {
    male: {
      loiro: { claro: '👱🏻‍♂️', medio: '👱🏼‍♂️', escuro: '👱🏽‍♂️' },
      moreno: { claro: '👨🏼', medio: '👨🏽', escuro: '👨🏾' },
      ruivo: { claro: '👨🏻‍🦰', medio: '👨🏼‍🦰', escuro: '👨🏽‍🦰' },
      preto: { claro: '👨🏽', medio: '👨🏾', escuro: '👨🏿' },
    },
    female: {
      loiro: { claro: '👱🏻‍♀️', medio: '👱🏼‍♀️', escuro: '👱🏽‍♀️' },
      moreno: { claro: '👩🏼', medio: '👩🏽', escuro: '👩🏾' },
      ruivo: { claro: '👩🏻‍🦰', medio: '👩🏼‍🦰', escuro: '👩🏽‍🦰' },
      preto: { claro: '👩🏽', medio: '👩🏾', escuro: '👩🏿' },
    },
  },
  
  // ADULTO (31-50 anos)
  adult: {
    male: {
      loiro: { claro: '👱🏻‍♂️', medio: '👱🏼‍♂️', escuro: '👱🏽‍♂️' },
      moreno: { claro: '🧔🏼', medio: '🧔🏽', escuro: '🧔🏾' },
      ruivo: { claro: '👨🏻‍🦰', medio: '👨🏼‍🦰', escuro: '👨🏽‍🦰' },
      preto: { claro: '🧔🏽', medio: '🧔🏾', escuro: '🧔🏿' },
    },
    female: {
      loiro: { claro: '👱🏻‍♀️', medio: '👱🏼‍♀️', escuro: '👱🏽‍♀️' },
      moreno: { claro: '👩🏼', medio: '👩🏽', escuro: '👩🏾' },
      ruivo: { claro: '👩🏻‍🦰', medio: '👩🏼‍🦰', escuro: '👩🏽‍🦰' },
      preto: { claro: '👩🏽', medio: '👩🏾', escuro: '👩🏿' },
    },
  },
  
  // IDOSO (51-70 anos)
  elder: {
    male: {
      loiro: { claro: '👴🏻', medio: '👴🏼', escuro: '👴🏽' },
      moreno: { claro: '👴🏼', medio: '👴🏽', escuro: '👴🏾' },
      ruivo: { claro: '👴🏻', medio: '👴🏼', escuro: '👴🏽' },
      preto: { claro: '👴🏽', medio: '👴🏾', escuro: '👴🏿' },
    },
    female: {
      loiro: { claro: '👵🏻', medio: '👵🏼', escuro: '👵🏽' },
      moreno: { claro: '👵🏼', medio: '👵🏽', escuro: '👵🏾' },
      ruivo: { claro: '👵🏻', medio: '👵🏼', escuro: '👵🏽' },
      preto: { claro: '👵🏽', medio: '👵🏾', escuro: '👵🏿' },
    },
  },
  
  // MUITO IDOSO (70+ anos)
  veryOld: {
    male: {
      loiro: { claro: '🧓🏻', medio: '🧓🏼', escuro: '🧓🏽' },
      moreno: { claro: '🧓🏼', medio: '🧓🏽', escuro: '🧓🏾' },
      ruivo: { claro: '🧓🏻', medio: '🧓🏼', escuro: '🧓🏽' },
      preto: { claro: '🧓🏽', medio: '🧓🏾', escuro: '🧓🏿' },
    },
    female: {
      loiro: { claro: '🧓🏻', medio: '🧓🏼', escuro: '🧓🏽' },
      moreno: { claro: '🧓🏼', medio: '🧓🏽', escuro: '🧓🏾' },
      ruivo: { claro: '🧓🏻', medio: '🧓🏼', escuro: '🧓🏽' },
      preto: { claro: '🧓🏽', medio: '🧓🏾', escuro: '🧓🏿' },
    },
  },
};

/**
 * Retorna o emoji do avatar baseado em idade, gênero e características físicas
 */
export function getAvatarEmoji(character: Character): string {
  const { age, gender, physicalTraits } = character;
  const { hairColor, skinTone } = physicalTraits;
  
  let ageGroup: keyof typeof AVATAR_EMOJIS;
  
  if (age <= 2) ageGroup = 'baby';
  else if (age <= 5) ageGroup = 'toddler';
  else if (age <= 9) ageGroup = 'child';
  else if (age <= 12) ageGroup = 'preteen';
  else if (age <= 17) ageGroup = 'teen';
  else if (age <= 30) ageGroup = 'youngAdult';
  else if (age <= 50) ageGroup = 'adult';
  else if (age <= 70) ageGroup = 'elder';
  else ageGroup = 'veryOld';
  
  return AVATAR_EMOJIS[ageGroup][gender][hairColor][skinTone];
}

/**
 * Gera características físicas aleatórias ao nascer
 */
export function generatePhysicalTraits(): Character['physicalTraits'] {
  // Probabilidades para Inglaterra Tudor (população majoritariamente branca)
  const hairColors: Array<{ color: Character['physicalTraits']['hairColor']; weight: number }> = [
    { color: 'loiro', weight: 25 },
    { color: 'moreno', weight: 45 },
    { color: 'ruivo', weight: 15 },
    { color: 'preto', weight: 15 },
  ];
  
  const skinTones: Array<{ tone: Character['physicalTraits']['skinTone']; weight: number }> = [
    { tone: 'claro', weight: 70 },
    { tone: 'medio', weight: 25 },
    { tone: 'escuro', weight: 5 },
  ];
  
  // Seleciona cor de cabelo baseada em peso
  const totalHairWeight = hairColors.reduce((sum, h) => sum + h.weight, 0);
  let randomHair = Math.random() * totalHairWeight;
  let selectedHair = hairColors[0].color;
  
  for (const hair of hairColors) {
    randomHair -= hair.weight;
    if (randomHair <= 0) {
      selectedHair = hair.color;
      break;
    }
  }
  
  // Seleciona tom de pele baseado em peso
  const totalSkinWeight = skinTones.reduce((sum, s) => sum + s.weight, 0);
  let randomSkin = Math.random() * totalSkinWeight;
  let selectedSkin = skinTones[0].tone;
  
  for (const skin of skinTones) {
    randomSkin -= skin.weight;
    if (randomSkin <= 0) {
      selectedSkin = skin.tone;
      break;
    }
  }
  
  return {
    hairColor: selectedHair,
    skinTone: selectedSkin,
  };
}

/**
 * Retorna descrição em português das características
 */
export function getPhysicalDescription(traits: Character['physicalTraits']): string {
  const hairDescriptions = {
    loiro: 'cabelo loiro',
    moreno: 'cabelo castanho',
    ruivo: 'cabelo ruivo',
    preto: 'cabelo preto',
  };
  
  const skinDescriptions = {
    claro: 'pele clara',
    medio: 'pele morena',
    escuro: 'pele escura',
  };
  
  return `${hairDescriptions[traits.hairColor]}, ${skinDescriptions[traits.skinTone]}`;
}

export function getAgeLabel(age: number): string {
  if (age === 0) return 'Recém-nascido';
  if (age === 1) return '1 ano';
  return `${age} anos`;
}
