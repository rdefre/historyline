/**
 * EVENTOS ALEATÓRIOS POR ERA
 * Eventos que podem acontecer durante o gameplay normal
 */

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  chance: number; // 0-1 (ex: 0.15 = 15%)
  
  // Tags que devem estar presentes na era atual
  requiredTags: string[];
  
  // Condições opcionais
  conditions?: {
    minAge?: number;
    maxAge?: number;
    gender?: 'male' | 'female';
    minMoney?: number;
  };
  
  options: {
    text: string;
    result: {
      message: string;
      healthChange?: number;
      sanityChange?: number;
      honorChange?: number;
      intelligenceChange?: number;
      moneyChange?: number;
      foodChange?: number;
      death?: boolean;
    };
  }[];
}

export const RANDOM_EVENTS: RandomEvent[] = [
  // =====================
  // EVENTOS COLONIAIS
  // =====================
  
  {
    id: 'harsh_winter',
    title: '❄️ Inverno Rigoroso',
    description: 'O inverno foi brutal. Comida está escassa e o frio é mortal.',
    chance: 0.15,
    requiredTags: ['colonial', 'survival'],
    options: [
      {
        text: 'Racionar a comida',
        result: {
          message: 'Você sobreviveu, mas perdeu muito peso.',
          healthChange: -15,
          foodChange: -5,
        },
      },
      {
        text: 'Caçar na neve',
        result: {
          message: 'Você conseguiu alguma caça, mas quase congelou.',
          healthChange: -10,
          foodChange: 3,
        },
      },
    ],
  },

  {
    id: 'native_conflict',
    title: '🏹 Conflito com Nativos',
    description: 'Um grupo de nativos se aproxima da colônia. A tensão é alta.',
    chance: 0.1,
    requiredTags: ['colonial', 'natives'],
    options: [
      {
        text: 'Tentar negociar',
        result: {
          message: 'A negociação foi bem-sucedida. Vocês trocaram mercadorias.',
          foodChange: 2,
          honorChange: 5,
        },
      },
      {
        text: 'Atacar preventivamente',
        result: {
          message: 'Houve um confronto violento. Você foi ferido.',
          healthChange: -25,
          honorChange: -10,
        },
      },
      {
        text: 'Fugir para dentro da paliçada',
        result: {
          message: 'Você se escondeu. Os nativos foram embora.',
          honorChange: -5,
        },
      },
    ],
  },

  // =====================
  // EVENTOS MEDIEVAIS/TUDOR
  // =====================

  {
    id: 'plague_outbreak',
    title: '☠️ Surto de Peste',
    description: 'A peste negra chegou à sua cidade. Corpos se acumulam nas ruas.',
    chance: 0.08,
    requiredTags: ['plague', 'medieval'],
    options: [
      {
        text: 'Fugir da cidade',
        result: {
          message: 'Você fugiu para o campo e sobreviveu.',
          moneyChange: -20,
          healthChange: -5,
        },
      },
      {
        text: 'Ficar e arriscar',
        result: {
          message: 'Você pegou a doença, mas sobreviveu por milagre.',
          healthChange: -40,
          sanityChange: -20,
        },
      },
    ],
  },

  {
    id: 'heresy_accusation',
    title: '⛪ Acusação de Heresia',
    description: 'Alguém te acusou de heresia perante a Igreja!',
    chance: 0.05,
    requiredTags: ['religion', 'medieval'],
    options: [
      {
        text: 'Negar com veemência',
        result: {
          message: 'Você foi absolvido, mas sua reputação sofreu.',
          honorChange: -15,
        },
      },
      {
        text: 'Subornar o padre',
        result: {
          message: 'O caso foi arquivado discretamente.',
          moneyChange: -50,
        },
      },
      {
        text: 'Fugir da paróquia',
        result: {
          message: 'Você é agora considerado herege.',
          honorChange: -30,
          sanityChange: -10,
        },
      },
    ],
  },

  {
    id: 'duel_challenge',
    title: '⚔️ Desafio para Duelo',
    description: 'Um nobre o desafiou para um duelo de espadas!',
    chance: 0.06,
    requiredTags: ['medieval', 'monarchy'],
    conditions: {
      gender: 'male',
      minAge: 16,
      maxAge: 60,
    },
    options: [
      {
        text: 'Aceitar o duelo',
        result: {
          message: 'Você venceu o duelo! Sua honra foi restaurada.',
          honorChange: 25,
          healthChange: -15,
        },
      },
      {
        text: 'Recusar como covarde',
        result: {
          message: 'Você é agora considerado desonrado.',
          honorChange: -40,
        },
      },
      {
        text: 'Pedir desculpas publicamente',
        result: {
          message: 'Você evitou o duelo, mas perdeu respeito.',
          honorChange: -20,
        },
      },
    ],
  },

  // =====================
  // EVENTOS INDUSTRIAIS
  // =====================

  {
    id: 'factory_accident',
    title: '⚙️ Acidente na Fábrica',
    description: 'Você se distraiu e sua mão ficou presa na máquina!',
    chance: 0.12,
    requiredTags: ['industrial', 'factory'],
    conditions: { minAge: 10 },
    options: [
      {
        text: 'Ir ao médico (caro)',
        result: {
          message: 'Você pagou caro pelo tratamento, mas se recuperou.',
          moneyChange: -30,
          healthChange: -15,
        },
      },
      {
        text: 'Tratar em casa',
        result: {
          message: 'A ferida infeccionou. Você perdeu parte da mão.',
          healthChange: -35,
        },
      },
    ],
  },

  {
    id: 'labor_strike',
    title: '✊ Greve dos Trabalhadores',
    description: 'Os operários estão organizando uma greve. Você vai participar?',
    chance: 0.1,
    requiredTags: ['industrial', 'factory'],
    conditions: { minAge: 12 },
    options: [
      {
        text: 'Juntar-se à greve',
        result: {
          message: 'A greve foi reprimida violentamente. Você foi ferido.',
          healthChange: -20,
          honorChange: 15,
        },
      },
      {
        text: 'Continuar trabalhando',
        result: {
          message: 'Você foi chamado de fura-greve pelos colegas.',
          honorChange: -20,
          moneyChange: 10,
        },
      },
    ],
  },

  {
    id: 'tuberculosis',
    title: '🫁 Tuberculose',
    description: 'Você começou a tossir sangue. É tuberculose.',
    chance: 0.08,
    requiredTags: ['industrial', 'urbanization'],
    conditions: { minAge: 5 },
    options: [
      {
        text: 'Ir ao sanatório',
        result: {
          message: 'Você passou meses em tratamento e sobreviveu.',
          moneyChange: -60,
          healthChange: -25,
        },
      },
      {
        text: 'Continuar trabalhando',
        result: {
          message: 'A doença piorou drasticamente.',
          healthChange: -45,
          death: true,
        },
      },
    ],
  },

  // =====================
  // EVENTOS MODERNOS
  // =====================

  {
    id: 'car_accident',
    title: '🚗 Acidente de Carro',
    description: 'Você se distraiu no trânsito e bateu.',
    chance: 0.1,
    requiredTags: ['modern', 'contemporary'],
    conditions: { minAge: 16 },
    options: [
      {
        text: 'Ir ao hospital',
        result: {
          message: 'Você se machucou, mas vai se recuperar.',
          healthChange: -20,
          moneyChange: -40,
        },
      },
      {
        text: 'Ignorar os ferimentos',
        result: {
          message: 'Os ferimentos eram piores do que você pensava.',
          healthChange: -35,
        },
      },
    ],
  },

  {
    id: 'job_burnout',
    title: '😰 Burnout Profissional',
    description: 'Você está exausto. Trabalhou demais e não aguenta mais.',
    chance: 0.15,
    requiredTags: ['modern', 'contemporary'],
    conditions: { minAge: 16 },
    options: [
      {
        text: 'Tirar férias',
        result: {
          message: 'As férias ajudaram, mas o trabalho continua pesado.',
          sanityChange: 10,
          moneyChange: -15,
        },
      },
      {
        text: 'Continuar trabalhando',
        result: {
          message: 'Você teve um colapso nervoso.',
          sanityChange: -30,
          healthChange: -15,
        },
      },
      {
        text: 'Pedir demissão',
        result: {
          message: 'Você saiu do emprego. Agora precisa encontrar outro.',
          sanityChange: 15,
          moneyChange: -50,
        },
      },
    ],
  },

  {
    id: 'social_media_cancel',
    title: '📱 Cancelamento nas Redes',
    description: 'Você postou algo polêmico e agora está sendo "cancelado".',
    chance: 0.08,
    requiredTags: ['contemporary', 'digital'],
    conditions: { minAge: 13 },
    options: [
      {
        text: 'Pedir desculpas publicamente',
        result: {
          message: 'As desculpas não foram aceitas. Você perdeu seguidores e oportunidades.',
          honorChange: -25,
          sanityChange: -20,
        },
      },
      {
        text: 'Deletar as redes sociais',
        result: {
          message: 'Você desapareceu da internet. A paz voltou.',
          sanityChange: 10,
          honorChange: -10,
        },
      },
      {
        text: 'Dobrar a aposta',
        result: {
          message: 'Você ficou ainda mais odiado, mas ganhou seguidores controversos.',
          honorChange: -40,
          moneyChange: 20,
        },
      },
    ],
  },

  // =====================
  // EVENTOS NEUTROS (TODAS ERAS)
  // =====================

  {
    id: 'good_fortune',
    title: '✨ Boa Sorte',
    description: 'Algo bom aconteceu inesperadamente!',
    chance: 0.1,
    requiredTags: [], // Funciona em todas eras
    options: [
      {
        text: 'Aproveitar',
        result: {
          message: 'Você encontrou dinheiro esquecido / ganhou uma aposta / recebeu uma herança pequena.',
          moneyChange: 25,
        },
      },
    ],
  },

  {
    id: 'minor_illness',
    title: '🤒 Doença Leve',
    description: 'Você pegou uma gripe forte.',
    chance: 0.12,
    requiredTags: [], // Funciona em todas eras
    conditions: { minAge: 5 },
    options: [
      {
        text: 'Descansar',
        result: {
          message: 'Você se recuperou após alguns dias.',
          healthChange: -8,
        },
      },
      {
        text: 'Continuar trabalhando',
        result: {
          message: 'A gripe piorou por você não ter descansado.',
          healthChange: -15,
        },
      },
    ],
  },
];

// IDs de eventos que exigem ser adulto/trabalhador
const WORK_EVENT_IDS = new Set([
  'factory_accident', 'labor_strike', 'job_burnout', 'social_media_cancel',
  'car_accident', 'duel_challenge',
]);

// Palavras-chave em opções que indicam trabalho
const WORK_KEYWORDS = ['trabalh', 'greve', 'fábrica', 'emprego', 'demissão'];

/**
 * Verifica se um evento é válido para a idade do personagem
 */
export function isEventValidForAge(event: { id: string; conditions?: { minAge?: number; maxAge?: number } }, age: number): boolean {
  // Eventos com condições de idade explícitas
  if (event.conditions?.minAge && age < event.conditions.minAge) return false;
  if (event.conditions?.maxAge && age > event.conditions.maxAge) return false;

  // Eventos de trabalho exigem pelo menos 6 anos
  if (WORK_EVENT_IDS.has(event.id) && age < 6) return false;

  return true;
}

/**
 * Filtra opções de um evento removendo escolhas de trabalho para crianças pequenas
 */
export function filterChoicesForAge<T extends { text: string }>(options: T[], age: number): T[] {
  if (age >= 6) return options;

  const filtered = options.filter((opt) =>
    !WORK_KEYWORDS.some((kw) => opt.text.toLowerCase().includes(kw))
  );

  // Sempre manter pelo menos uma opção
  return filtered.length > 0 ? filtered : [options[0]];
}

/**
 * Retorna um evento aleatório apropriado para a era atual
 */
export function getRandomEvent(eraTags: string[], age?: number): RandomEvent | null {
  // Filtra eventos que podem acontecer nesta era
  const availableEvents = RANDOM_EVENTS.filter((event) => {
    // Filtro de idade
    if (age !== undefined && !isEventValidForAge(event, age)) return false;

    // Se o evento não tem tags específicas, pode acontecer em qualquer era
    if (event.requiredTags.length === 0) return true;

    // Verifica se pelo menos uma tag do evento está presente na era
    return event.requiredTags.some((tag) => eraTags.includes(tag));
  });

  if (availableEvents.length === 0) return null;

  // Rola o dado para cada evento
  for (const event of availableEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }

  return null;
}

// =====================================================
// EVENTOS ALEATÓRIOS SIMPLES (NOVA ESTRUTURA)
// =====================================================

import type { RandomGameEvent } from '../types/game.types';

export const SIMPLE_RANDOM_EVENTS: RandomGameEvent[] = [
  {
    id: 'wolf_encounter',
    title: '🐺 Encontro com um Lobo',
    description: 'Enquanto caminha pela floresta, você avista um lobo feroz se aproximando. Seus olhos vermelhos fixos em você.',
    choices: [
      { label: 'Lutar Corajosamente', consequence: 'Você enfrentou o lobo com bravura!', effect: { strength: 5, honor: 3, vitality: -8 } },
      { label: 'Fugir Rapidamente', consequence: 'Você correu para salvar sua vida.', effect: { vitality: -3, honor: -2 } },
      { label: 'Rezar a Deus', consequence: 'Você rezou fervorosamente e o lobo recuou.', effect: { faith: 4, honor: 2, vitality: -1 } },
    ],
    minAge: 6,
  },
  {
    id: 'beggar_encounter',
    title: '🤲 Um Mendigo Pede Ajuda',
    description: 'Um homem maltrapilho pede esmola na estrada. Seus olhos suplicam por comida.',
    choices: [
      { label: 'Dar Sua Comida', consequence: 'O mendigo agradeceu com lágrimas nos olhos.', effect: { faith: 3, honor: 4, vitality: -2 } },
      { label: 'Ignorar e Seguir', consequence: 'Você passou direto sem olhar para trás.', effect: { honor: -3, faith: -1 } },
      { label: 'Oferecer Trabalho', consequence: 'Você ofereceu trabalho e ganhou seu respeito.', effect: { honor: 5, faith: 2 } },
    ],
    minAge: 8,
  },
  {
    id: 'sudden_illness',
    title: '🤒 Uma Doença Repentina',
    description: 'Você acordou com febre alta e corpo dolorido. A doença se espalha pela vila.',
    choices: [
      { label: 'Descansar na Cama', consequence: 'Você se recuperou com repouso adequado.', effect: { vitality: 8, faith: 2 } },
      { label: 'Trabalhar Mesmo Doente', consequence: 'Você se forçou a trabalhar apesar da febre.', effect: { vitality: -15, strength: -5, honor: 3 } },
      { label: 'Procurar um Curandeiro', consequence: 'O curandeiro lhe deu um remédio amargo mas eficaz.', effect: { vitality: 5, faith: 3 } },
    ],
    minAge: 5,
  },
  {
    id: 'lost_child',
    title: '👶 Criança Perdida',
    description: 'Uma criança está chorando no meio da vila, claramente perdida.',
    choices: [
      { label: 'Ajudar a Encontrar os Pais', consequence: 'Você reuniu a criança com sua família. Eles ficaram muito gratos.', effect: { honor: 6, faith: 3 } },
      { label: 'Ignorar', consequence: 'Você seguiu seu caminho. O choro continuou.', effect: { honor: -4, faith: -2 } },
    ],
    minAge: 10,
  },
  {
    id: 'nobles_carriage',
    title: '🏇 Carruagem dos Nobres',
    description: 'Uma carruagem de nobres passa pela estrada. Você está no caminho.',
    choices: [
      { label: 'Sair do Caminho Respeitosamente', consequence: 'Você se curvou e saiu do caminho. Os nobres nem olharam.', effect: { honor: 1 } },
      { label: 'Ficar Parado', consequence: 'A carruagem parou bruscamente. O cocheiro te xingou.', effect: { honor: -2 } },
      { label: 'Tentar Pedir Esmola', consequence: 'Um nobre jogou uma moeda pela janela.', effect: { money: 5, honor: -3 } },
    ],
    socialClasses: ['peasant', 'artisan'],
    minAge: 5,
  },
  // === EVENTOS PARA BEBÊS E CRIANÇAS PEQUENAS (0-4) ===
  {
    id: 'baby_crying',
    title: '😢 Choro na Noite',
    description: 'Você chorou a noite toda. Sua mãe mal conseguiu dormir.',
    choices: [
      { label: 'Ser consolado', consequence: 'Sua mãe te embalou até dormir.', effect: { vitality: 2 } },
      { label: 'Continuar chorando', consequence: 'Você chorou até cansar e dormiu.', effect: { vitality: -1 } },
    ],
    maxAge: 2,
  },
  {
    id: 'baby_first_steps',
    title: '👣 Primeiros Passos',
    description: 'Você se levantou sozinho e deu seus primeiros passos!',
    choices: [
      { label: 'Andar até a mãe', consequence: 'Sua mãe ficou emocionada! Um momento especial.', effect: { vitality: 3, strength: 2 } },
      { label: 'Cair e tentar de novo', consequence: 'Você caiu, mas se levantou com determinação.', effect: { strength: 3 } },
    ],
    minAge: 1,
    maxAge: 2,
  },
  {
    id: 'toddler_playing',
    title: '🧸 Brincadeira Inocente',
    description: 'Você encontrou gravetos e pedras para brincar no chão de terra.',
    choices: [
      { label: 'Brincar sozinho', consequence: 'Você passou horas entretido com suas descobertas.', effect: { vitality: 1 } },
      { label: 'Brincar com irmãos', consequence: 'Vocês brincaram juntos e riram muito.', effect: { vitality: 2, honor: 1 } },
    ],
    maxAge: 4,
  },
  {
    id: 'toddler_sick',
    title: '🤧 Resfriado',
    description: 'Você pegou um resfriado. Seu nariz não para de escorrer.',
    choices: [
      { label: 'Descansar no colo da mãe', consequence: 'O calor do colo da mãe ajudou na recuperação.', effect: { vitality: 3, faith: 1 } },
      { label: 'Tentar brincar mesmo assim', consequence: 'O resfriado piorou um pouco.', effect: { vitality: -3 } },
    ],
    maxAge: 4,
  },
  {
    id: 'toddler_exploring',
    title: '🌿 Exploração Curiosa',
    description: 'O mundo ao redor é cheio de coisas novas para descobrir!',
    choices: [
      { label: 'Explorar o quintal', consequence: 'Você descobriu insetos e flores. Que fascinante!', effect: { vitality: 1, strength: 1 } },
      { label: 'Ficar perto da mãe', consequence: 'Você ficou seguro ao lado da sua mãe.', effect: { vitality: 2 } },
    ],
    minAge: 2,
    maxAge: 4,
  },
];

/**
 * Retorna um evento aleatório simples baseado na idade e classe social
 */
export function getSimpleRandomEvent(age: number, socialClass: string): RandomGameEvent | null {
  const availableEvents = SIMPLE_RANDOM_EVENTS.filter((event) => {
    if (event.minAge && age < event.minAge) return false;
    if (event.maxAge && age > event.maxAge) return false;
    if (event.socialClasses && !event.socialClasses.includes(socialClass)) return false;
    return true;
  });

  if (availableEvents.length === 0) return null;

  // 100% de chance de um evento acontecer (para teste)
  if (Math.random() > 1.0) return null;

  // Escolhe um evento aleatório
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}
