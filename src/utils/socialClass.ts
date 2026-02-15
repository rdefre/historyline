/**
 * SISTEMA DE CLASSE SOCIAL E FAMÍLIA
 * Define a origem social do personagem ao nascer
 */

import type { Character } from '../types/game.types';

export type SocialClass = 'peasant' | 'artisan' | 'gentry' | 'nobility';

export interface FamilyBackground {
  socialClass: SocialClass;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherDescription: string;
  startingMoney: number;
  startingFood: number;
  housing: string;
  familyDescription: string;
}

// === NOMES POR CLASSE SOCIAL ===

const NAMES_BY_CLASS = {
  peasant: {
    male: ['John', 'William', 'Thomas', 'Robert', 'Richard', 'Henry', 'Peter', 'Simon'],
    female: ['Alice', 'Joan', 'Margaret', 'Agnes', 'Emma', 'Matilda', 'Beatrice', 'Ellen'],
    surnames: ['Smith', 'Brown', 'Green', 'Wood', 'Hill', 'Field', 'Stone', 'Miller'],
  },
  artisan: {
    male: ['Thomas', 'William', 'John', 'Robert', 'Edward', 'George', 'James', 'Richard'],
    female: ['Mary', 'Elizabeth', 'Anne', 'Margaret', 'Catherine', 'Dorothy', 'Jane', 'Alice'],
    surnames: ['Baker', 'Taylor', 'Cooper', 'Turner', 'Fletcher', 'Mason', 'Wright', 'Carter'],
  },
  gentry: {
    male: ['Edward', 'Henry', 'Charles', 'George', 'Francis', 'Anthony', 'Humphrey', 'Walter'],
    female: ['Catherine', 'Elizabeth', 'Anne', 'Margaret', 'Mary', 'Jane', 'Dorothy', 'Eleanor'],
    surnames: ['Hastings', 'Clifford', 'Neville', 'Berkeley', 'Stafford', 'Grey', 'Courtenay', 'Willoughby'],
  },
  nobility: {
    male: ['Henry', 'Edward', 'Thomas', 'Richard', 'George', 'Charles', 'William', 'Francis'],
    female: ['Elizabeth', 'Catherine', 'Anne', 'Mary', 'Margaret', 'Jane', 'Eleanor', 'Isabella'],
    surnames: ['Plantagenet', 'Tudor', 'Howard', 'Percy', 'Dudley', 'Seymour', 'Boleyn', 'Cavendish'],
  },
};

// === OCUPAÇÕES POR CLASSE ===

const OCCUPATIONS = {
  peasant: {
    father: ['camponês', 'lavrador', 'pastor', 'lenhador', 'carvoeiro', 'jornaleiro'],
    mother: 'camponesa',
  },
  artisan: {
    father: ['ferreiro', 'carpinteiro', 'padeiro', 'alfaiate', 'sapateiro', 'comerciante', 'cervejeiro', 'moleiro'],
    mother: 'esposa de artesão',
  },
  gentry: {
    father: ['cavaleiro', 'proprietário de terras', 'escudeiro', 'senhor de manor'],
    mother: 'dama',
  },
  nobility: {
    father: ['Lorde', 'Duque', 'Conde', 'Barão', 'Marquês'],
    mother: 'Lady',
  },
};

// === DESCRIÇÕES POR CLASSE ===

const CLASS_DESCRIPTIONS = {
  peasant: {
    housing: 'uma cabana de palha com chão de terra batida',
    description: 'Sua família mal tem o suficiente para comer. A vida é dura e o trabalho é árduo.',
  },
  artisan: {
    housing: 'uma casa de madeira na vila com oficina',
    description: 'Sua família possui um ofício respeitado. A vida não é fácil, mas vocês não passam fome.',
  },
  gentry: {
    housing: 'um manor (casa senhorial) com terras',
    description: 'Sua família possui terras e servos. Vocês vivem confortavelmente.',
  },
  nobility: {
    housing: 'um castelo ou palácio imponente',
    description: 'Você nasceu em berço de ouro. Sua família tem grande poder e influência no reino.',
  },
};

/**
 * Sorteia uma classe social baseada em probabilidades históricas
 */
export function generateSocialClass(): SocialClass {
  const random = Math.random() * 100;
  
  if (random < 60) return 'peasant';      // 60%
  if (random < 85) return 'artisan';      // 25%
  if (random < 95) return 'gentry';       // 10%
  return 'nobility';                      // 5%
}

/**
 * Gera o background familiar completo
 */
export function generateFamilyBackground(
  childGender: 'male' | 'female',
  childName: string,
  socialClass?: SocialClass
): FamilyBackground {
  // Se não especificado, sorteia
  const finalClass = socialClass || generateSocialClass();
  
  const names = NAMES_BY_CLASS[finalClass];
  const occupations = OCCUPATIONS[finalClass];
  const descriptions = CLASS_DESCRIPTIONS[finalClass];
  
  // Gera nomes dos pais
  const fatherName = names.male[Math.floor(Math.random() * names.male.length)];
  const motherName = names.female[Math.floor(Math.random() * names.female.length)];
  
  // Escolhe sobrenome (filho herda do pai)
  const surname = names.surnames[Math.floor(Math.random() * names.surnames.length)];
  
  // Escolhe ocupação do pai
  const fatherOccupation = Array.isArray(occupations.father)
    ? occupations.father[Math.floor(Math.random() * occupations.father.length)]
    : occupations.father;
  
  // Define recursos iniciais baseado na classe
  let startingMoney: number;
  let startingFood: number;
  
  switch (finalClass) {
    case 'peasant':
      startingMoney = Math.floor(Math.random() * 11); // 0-10
      startingFood = 5 + Math.floor(Math.random() * 6); // 5-10
      break;
    case 'artisan':
      startingMoney = 50 + Math.floor(Math.random() * 51); // 50-100
      startingFood = 15 + Math.floor(Math.random() * 6); // 15-20
      break;
    case 'gentry':
      startingMoney = 200 + Math.floor(Math.random() * 301); // 200-500
      startingFood = 30 + Math.floor(Math.random() * 21); // 30-50
      break;
    case 'nobility':
      startingMoney = 1000 + Math.floor(Math.random() * 2001); // 1000-3000
      startingFood = 50 + Math.floor(Math.random() * 51); // 50-100
      break;
  }
  
  return {
    socialClass: finalClass,
    fatherName: `${fatherName} ${surname}`,
    fatherOccupation,
    motherName: `${motherName} ${surname}`,
    motherDescription: occupations.mother,
    startingMoney,
    startingFood,
    housing: descriptions.housing,
    familyDescription: descriptions.description,
  };
}

/**
 * Gera nome apropriado para a classe social
 */
export function generateNameForClass(
  gender: 'male' | 'female',
  socialClass: SocialClass
): { firstName: string; surname: string } {
  const names = NAMES_BY_CLASS[socialClass];
  
  const firstName = names[gender][Math.floor(Math.random() * names[gender].length)];
  const surname = names.surnames[Math.floor(Math.random() * names.surnames.length)];
  
  return { firstName, surname };
}

/**
 * Retorna ícone da classe social
 */
export function getSocialClassIcon(socialClass: SocialClass): string {
  const icons = {
    peasant: '🌾',
    artisan: '⚒️',
    gentry: '🏰',
    nobility: '👑',
  };
  return icons[socialClass];
}

/**
 * Retorna nome traduzido da classe social
 */
export function getSocialClassName(socialClass: SocialClass): string {
  const names = {
    peasant: 'Camponês',
    artisan: 'Artesão',
    gentry: 'Pequena Nobreza',
    nobility: 'Alta Nobreza',
  };
  return names[socialClass];
}

/**
 * Verifica se um evento é apropriado para a classe social
 */
export function isEventAppropriateForClass(
  eventRequiredClasses: SocialClass[] | undefined,
  characterClass: SocialClass
): boolean {
  // Se o evento não especifica classes, está disponível para todos
  if (!eventRequiredClasses || eventRequiredClasses.length === 0) {
    return true;
  }
  
  // Verifica se a classe do personagem está na lista permitida
  return eventRequiredClasses.includes(characterClass);
}
