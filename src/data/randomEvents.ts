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
        triggersDuel: true,
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
export function getRandomEvent(eraTags: string[], age?: number, recentEventIds: string[] = []): RandomEvent | null {
  const recentSet = new Set(recentEventIds);

  // Filtra eventos que podem acontecer nesta era
  const availableEvents = RANDOM_EVENTS.filter((event) => {
    // Filtro de idade
    if (age !== undefined && !isEventValidForAge(event, age)) return false;

    // Exclui eventos vistos recentemente
    if (recentSet.has(event.id)) return false;

    // Se o evento não tem tags específicas, pode acontecer em qualquer era
    if (event.requiredTags.length === 0) return true;

    // Verifica se pelo menos uma tag do evento está presente na era
    return event.requiredTags.some((tag) => eraTags.includes(tag));
  });

  if (availableEvents.length === 0) return null;

  // Embaralha para eliminar viés de posição, depois rola o dado
  const shuffled = [...availableEvents].sort(() => Math.random() - 0.5);
  for (const event of shuffled) {
    if (Math.random() < event.chance) {
      return event;
    }
  }

  // Se nenhum evento passou na rolagem, escolhe um aleatório ao invés de retornar null
  return shuffled[Math.floor(Math.random() * shuffled.length)];
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

// =====================================================
// EVENTOS ADULTOS — CLASSE CAMPONESA (13+)
// =====================================================

export const PEASANT_ADULT_EVENTS: RandomGameEvent[] = [
  // --- CLIMA E NATUREZA ---
  {
    id: 'peasant_1',
    title: 'A Seca Implacável',
    description: 'O sol castigou a terra por semanas. O poço da vila está baixo e as plantações estão secando.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Racionar sua própria água', consequence: 'Você sobreviveu à seca com estoicismo. Sua honra cresceu perante os vizinhos.', effect: { vitality: -15, honor: 10 } },
      { label: 'Rezar por um milagre', consequence: 'Você rezou pelo povo e uma chuva fina chegou dias depois.', effect: { vitality: -5, faith: 15 } },
    ],
  },
  {
    id: 'peasant_2',
    title: 'Lobos no Inverno',
    description: 'Um inverno rigoroso trouxe lobos famintos para perto da vila. Eles estão rondando as casas à noite.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Ficar de guarda com um forcado', consequence: 'Você espantou os lobos e a vila dormin segura. Sua bravura foi reconhecida.', effect: { strength: 5, vitality: -10, honor: 15 } },
      { label: 'Trancar bem as portas e ignorar', consequence: 'Você ficou seguro, mas seus vizinhos notaram sua ausência.', effect: { honor: -5 } },
    ],
  },
  {
    id: 'peasant_3',
    title: 'Praga de Gafanhotos',
    description: 'Uma nuvem escura cobriu o céu. Gafanhotos desceram sobre os campos de trigo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Tentar espantá-los com fogo', consequence: 'O fogo afastou parte dos gafanhotos, mas custou caro em palha queimada.', effect: { vitality: -15, honor: 5, money: -5 } },
      { label: 'Aceitar o castigo divino', consequence: 'Você aceitou a vontade de Deus e rezou. A colheita foi perdida.', effect: { faith: 10, money: -15 } },
    ],
  },
  {
    id: 'peasant_4',
    title: 'Cogumelos Misteriosos',
    description: 'Enquanto buscava lenha, você encontrou cogumelos grandes e peculiares aos pés de um carvalho antigo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comer (arriscado, mas tentador)', consequence: 'Os cogumelos eram comestíveis e deliciosos. Que sorte!', effect: { vitality: 20, faith: -5 } },
      { label: 'Vender na feira', consequence: 'Um boticário pagou bem pelos cogumelos estranhos.', effect: { money: 10, honor: -5 } },
    ],
  },
  {
    id: 'peasant_5',
    title: 'O Javali Enfurecido',
    description: 'Um javali enorme invadiu sua horta e está destruindo as raízes que você plantou.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Enfrentar a fera', consequence: 'Você afugentou o javali após uma luta brutal. Herói da horta!', effect: { strength: 10, vitality: -20, honor: 15 } },
      { label: 'Fugir e deixar ele comer', consequence: 'O javali comeu tudo. A colheita foi perdida e os vizinhos riram.', effect: { honor: -10, money: -10 } },
    ],
  },
  // --- NOBREZA E IMPOSTOS ---
  {
    id: 'peasant_6',
    title: 'O Cobrador do Lorde',
    description: 'O cobrador de impostos chegou acompanhado de guardas armados. Ele exige mais moedas do que você tem.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar com as economias', consequence: 'Você pagou os impostos com amargura. As economias foram embora.', effect: { money: -20 } },
      { label: 'Implorar por mais prazo', consequence: 'O cobrador concedeu uma semana extra, mas humilhou você na frente de todos.', effect: { vitality: -5, honor: -15 } },
    ],
  },
  {
    id: 'peasant_7',
    title: 'Carruagem Atolada',
    description: 'A carruagem de um nobre atolou na lama perto da sua cabana. O cocheiro grita por ajuda.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Ajudar a empurrar', consequence: 'O nobre ficou satisfeito e jogou algumas moedas pela janela.', effect: { strength: 5, vitality: -10, honor: 10, money: 5 } },
      { label: 'Ignorar e voltar ao trabalho', consequence: 'O cocheiro xingou muito, mas você ficou seco.', effect: { honor: -5 } },
    ],
  },
  {
    id: 'peasant_8',
    title: 'A Caçada do Lorde',
    description: 'Cães de caça e nobres a cavalo pisotearam sua plantação perseguindo uma raposa.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Reclamar com o capataz', consequence: 'O capataz deu uma boa esbofeteada, mas prometeu compensação mínima.', effect: { vitality: -15, honor: 15 } },
      { label: 'Abaixar a cabeça e replantar', consequence: 'Você engoliu a raiva e replantou em silêncio.', effect: { vitality: -10, honor: -10 } },
    ],
  },
  {
    id: 'peasant_9',
    title: 'Recrutamento Forçado',
    description: 'O rei declarou guerra. Guardas estão na vila recrutando homens fortes para a infantaria.',
    minAge: 16,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Esconder-se na floresta', consequence: 'Você fugiu para a floresta e evitou o recrutamento, mas ganhou fama de covarde.', effect: { honor: -25 } },
      { label: 'Pagar suborno para não ir', consequence: 'O guarda aceitou o dinheiro sem fazer perguntas.', effect: { honor: -5, money: -30 } },
    ],
  },
  {
    id: 'peasant_10',
    title: 'Bolsa Perdida',
    description: 'Você encontrou uma bolsa de veludo caída na estrada de terra. Está pesada e cheia de moedas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Esconder e ficar com o ouro', consequence: 'Você ficou rico por um tempo, mas a culpa não te deixou dormir.', effect: { faith: -15, honor: -20, money: 40 } },
      { label: 'Entregar ao magistrado', consequence: 'O magistrado ficou surpreso com sua honestidade e deu uma recompensa.', effect: { faith: 5, honor: 20, money: 5 } },
    ],
  },
  // --- IGREJA E RELIGIÃO ---
  {
    id: 'peasant_11',
    title: 'O Monge Peregrino',
    description: 'Um monge descalço bate à sua porta, pedindo um prato de mingau e abrigo para a noite.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Dividir a pouca comida', consequence: 'O monge abençoou sua casa antes de partir ao amanhecer.', effect: { vitality: -5, faith: 20, honor: 10 } },
      { label: 'Mandar ele embora', consequence: 'O monge saiu em silêncio. Você sentiu um peso estranho no peito.', effect: { faith: -15, honor: -5 } },
    ],
  },
  {
    id: 'peasant_12',
    title: 'O Dízimo Atrasado',
    description: 'O padre lembrou toda a congregação que a ira de Deus cai sobre aqueles que não pagam o dízimo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Doar o último saco de grãos', consequence: 'O padre elogiou sua devoção diante de todos. Mas o estômago ficou vazio.', effect: { vitality: -10, faith: 15, honor: 5, money: -10 } },
      { label: 'Mentir que não tem nada', consequence: 'Você mentiu para o padre. A culpa ficou.', effect: { faith: -20, honor: -10 } },
    ],
  },
  {
    id: 'peasant_13',
    title: 'Rumores de Bruxaria',
    description: 'A velha curandeira da vila foi acusada de bruxaria porque a vaca do vizinho secou o leite.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Defender a velha senhora', consequence: 'Você defendeu a curandeira. Alguns te respeitaram, outros te xingaram.', effect: { vitality: -10, faith: -10, honor: 20 } },
      { label: 'Juntar-se à turba enfurecida', consequence: 'Você seguiu a multidão. A velha foi expulsa da vila.', effect: { faith: 10, honor: -15 } },
    ],
  },
  {
    id: 'peasant_14',
    title: 'O Falso Profeta',
    description: 'Um homem na praça diz que o fim do mundo chegará no inverno e vende amuletos de salvação.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar um amuleto', consequence: 'Você gastou suas moedas. O inverno passou sem apocalipse.', effect: { faith: 5, money: -15 } },
      { label: 'Zombar do charlatão', consequence: 'Você riu na cara do profeta. Alguns te acharam sensato.', effect: { faith: -5, honor: 5 } },
    ],
  },
  {
    id: 'peasant_15',
    title: 'O Sermão Aterrorizante',
    description: 'O padre fez um sermão tão assustador sobre o inferno que você não conseguiu dormir à noite.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Fazer penitência e doar', consequence: 'Você se sentiu mais leve após a confissão e doação.', effect: { vitality: -5, faith: 20, money: -5 } },
      { label: 'Ir beber para esquecer', consequence: 'O hidromel ajudou a esquecer o inferno por uma noite.', effect: { vitality: -10, faith: -10, honor: -5, money: -5 } },
    ],
  },
  // --- VIDA NA VILA E TAVERNA ---
  {
    id: 'peasant_16',
    title: 'A Feira de Outono',
    description: 'A vila organizou uma feira com música, dança e muito hidromel de procedência duvidosa.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Aproveitar e beber muito', consequence: 'Que noite! Você acordou com ressaca, sem dinheiro e com um sorriso no rosto.', effect: { vitality: 15, faith: -5, honor: -5, money: -10 } },
      { label: 'Ficar em casa e poupar', consequence: 'Você economizou e dormiu cedo. A vida responsável tem seu preço.', effect: {} },
    ],
  },
  {
    id: 'peasant_17',
    title: 'Briga de Vizinhos',
    description: 'Dois vizinhos estão saindo no soco por causa de uma cerca mal posicionada.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Entrar no meio para separar', consequence: 'Você levou um soco sem querer, mas a paz voltou à vila.', effect: { strength: 5, vitality: -15, honor: 15 } },
      { label: 'Ficar assistindo e rir', consequence: 'Você riu até doer a barriga. Os vizinhos ficaram ofendidos com seu descaso.', effect: { vitality: 5, honor: -10 } },
    ],
  },
  {
    id: 'peasant_18',
    title: 'O Bardo Desafinado',
    description: 'Um bardo terrível está tocando alaúde na taverna. Todos estão com dor de cabeça.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Jogar uma maçã podre nele', consequence: 'Acertou em cheio! A taverna explodiu em gargalhadas.', effect: { honor: -5 } },
      { label: 'Dar uma moeda por pena', consequence: 'O bardo ficou emocionado e tocou mais uma hora.', effect: { vitality: 5, faith: 5, honor: 5, money: -2 } },
    ],
  },
  {
    id: 'peasant_19',
    title: 'O Enforcamento Público',
    description: 'O lorde ordenou o enforcamento de um ladrão de galinhas na praça principal.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Assistir como entretenimento', consequence: 'A morte era assustadora, mas todo mundo estava lá.', effect: { honor: -10 } },
      { label: 'Desviar o olhar em respeito', consequence: 'Você honrou o morto com seu silêncio. O padre te notou favoravelmente.', effect: { faith: 5, honor: 10 } },
    ],
  },
  {
    id: 'peasant_20',
    title: 'Goteira no Telhado',
    description: 'O telhado de palha da sua cabana cedeu durante a tempestade e a água está arruinando tudo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Passar a noite consertando', consequence: 'Você consertou o telhado na chuva. Exausto, mas a cabana ficou seca.', effect: { strength: 5, vitality: -15, honor: 5 } },
      { label: 'Dormir na lama e arruinar amanhã', consequence: 'Você acordou encharcado, doente e com tudo molhado.', effect: { vitality: -20, honor: -5 } },
    ],
  },
  // --- SAÚDE E DOENÇAS ---
  {
    id: 'peasant_21',
    title: 'A Febre do Pântano',
    description: 'Você acordou suando frio e com a visão turva. A temida febre chegou à sua casa.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar poção da curandeira', consequence: 'A poção amarga funcionou. Você se recuperou em dias.', effect: { vitality: 15, faith: -5, money: -15 } },
      { label: 'Sangria caseira', consequence: 'A sangria enfraqueceu você ainda mais. Dias difíceis pela frente.', effect: { strength: -5, vitality: -20 } },
    ],
  },
  {
    id: 'peasant_22',
    title: 'O Dente Podre',
    description: 'Uma dor de dente infernal não te deixa trabalhar há dias. O rosto está inchado.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar o ferreiro para arrancar', consequence: 'O ferreiro arrancou na primeira tentativa. Doeu, mas passou.', effect: { strength: -5, vitality: -10, money: -5 } },
      { label: 'Amarrar num barbante e puxar', consequence: 'Você arrancou sozinho. Corajoso e teimoso.', effect: { strength: 5, vitality: -15, honor: 5 } },
    ],
  },
  {
    id: 'peasant_23',
    title: 'O Corte do Lenhador',
    description: 'Um machado mal afiado escorregou e cortou profundamente sua panturrilha.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Cauterizar com ferro quente', consequence: 'A dor foi insuportável, mas o ferimento fechou limpo.', effect: { strength: 10, vitality: -25, honor: 10 } },
      { label: 'Amarrar um pano sujo e rezar', consequence: 'Você rezou muito. A ferida inflamou um pouco, mas sobreviveu.', effect: { vitality: -15, faith: 10 } },
    ],
  },
  {
    id: 'peasant_24',
    title: 'Água Contaminada',
    description: 'Alguém jogou uma ovelha morta no poço da vila. A água está com um gosto horrível.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Ferver antes de beber', consequence: 'Trabalho extra, mas você ficou saudável enquanto outros adoeceram.', effect: { vitality: 5, money: -2 } },
      { label: 'Beber assim mesmo (sou forte)', consequence: 'Não era tão forte assim. Passou dias no banheiro.', effect: { vitality: -25 } },
    ],
  },
  {
    id: 'peasant_25',
    title: 'O Surto de Varíola',
    description: 'Um mercante de fora trouxe pintas vermelhas para a vila. O pânico está instaurado.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Trancar-se em casa', consequence: 'Você sobreviveu ao surto, mas perdeu dias de trabalho e renda.', effect: { vitality: -5, honor: -10, money: -15 } },
      { label: 'Ajudar a enterrar os mortos', consequence: 'Você arriscou sua vida para honrar os mortos. A vila não esqueceu.', effect: { vitality: -20, faith: 15, honor: 25 } },
    ],
  },
  // --- TRABALHO E SOBREVIVÊNCIA ---
  {
    id: 'peasant_26',
    title: 'Ferramenta Quebrada',
    description: 'Sua única enxada quebrou ao bater em uma pedra enorme no campo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar uma nova no ferreiro', consequence: 'O ferreiro cobrou caro, mas a enxada nova é boa.', effect: { money: -15 } },
      { label: 'Cavar com as mãos sangrando', consequence: 'Você cavou com as mãos até acabar o campo. Suas mãos são de aço agora.', effect: { strength: 10, vitality: -20, honor: 5 } },
    ],
  },
  {
    id: 'peasant_27',
    title: 'O Cão Fiel',
    description: 'Um cachorro sarnento começou a te seguir. Ele come muito, mas espanta os ratos.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Adotar e dar as sobras', consequence: 'O cão se tornou seu melhor guarda. Os ratos sumiram da horta.', effect: { vitality: 10, honor: 5, money: -5 } },
      { label: 'Enxotar com pedras', consequence: 'O cão sumiu. Os ratos voltaram.', effect: { vitality: -5, honor: -10 } },
    ],
  },
  {
    id: 'peasant_28',
    title: 'A Caravana de Mercadores',
    description: 'Mercadores exóticos passaram pela vila vendendo temperos coloridos e tecidos macios.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar um luxo raro', consequence: 'Você se presenteou. Foi caro, mas valeu cada moeda.', effect: { vitality: 15, honor: 5, money: -25 } },
      { label: 'Apenas olhar com inveja', consequence: 'Você ficou olhando até a caravana sumir. O coração pesou.', effect: { vitality: -5 } },
    ],
  },
  {
    id: 'peasant_29',
    title: 'O Celeiro em Chamas',
    description: 'Um raio atingiu o celeiro principal da vila. Toda a colheita do inverno está lá dentro!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Arriscar a vida para salvar sacos', consequence: 'Você entrou no celeiro em chamas e salvou metade da colheita. Herói!', effect: { strength: 5, vitality: -25, honor: 30, money: 10 } },
      { label: 'Ficar olhando queimar', consequence: 'Você assistiu ao desastre. A vila passou fome no inverno.', effect: { honor: -15 } },
    ],
  },
  {
    id: 'peasant_30',
    title: 'A Criança Perdida',
    description: 'Você encontrou o filho do moleiro chorando perdido na floresta ao anoitecer.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Guiá-lo de volta no escuro', consequence: 'O moleiro ficou aliviado e recompensou você generosamente.', effect: { vitality: -10, faith: 5, honor: 20, money: 15 } },
      { label: 'Apontar a direção e ir para casa', consequence: 'Você indicou o caminho e foi dormir. O moleiro ficou frio com você depois.', effect: { honor: -15 } },
    ],
  },

  // --- ANIMAIS E CRIAÇÃO ---
  {
    id: 'peasant_31',
    title: 'A Vaca Leiteira Doente',
    description: 'Sua única vaca, Mimosa, amanheceu tremendo e recusando pasto. Ela é vital para o sustento.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar a curandeira', consequence: 'A curandeira receitou um chá amargo e Mimosa se recuperou em dias.', effect: { money: -15 } },
      { label: 'Abater antes que a carne estrague', consequence: 'Você abateu Mimosa. A carne durou semanas, mas sente falta do leite.', effect: { vitality: 15, honor: -5, money: 5 } },
    ],
  },
  {
    id: 'peasant_32',
    title: 'A Ninhada de Leitões',
    description: 'Sua porca deu à luz uma ninhada excepcionalmente grande. O celeiro está barulhento e cheio de vida!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Engordar todos para o inverno', consequence: 'Você vai comer bem no inverno. Os leitões cresceram rápido.', effect: { vitality: 10, money: -5 } },
      { label: 'Vender os filhotes na feira', consequence: 'Os filhotes foram vendidos por bom preço na feira da vila.', effect: { money: 20 } },
    ],
  },
  {
    id: 'peasant_33',
    title: 'Raposa no Galinheiro',
    description: 'Você acordou no meio da noite com o cacarejo desesperado das galinhas. Uma raposa invadiu!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Sair correndo de cuecas com um pedaço de pau', consequence: 'Você espantou a raposa e salvou as galinhas. A vila vai falar nisso por semanas.', effect: { strength: 5, vitality: -5, honor: 5 } },
      { label: 'Voltar a dormir e aceitar a perda', consequence: 'A raposa comeu três galinhas. Elas eram as melhores poedeiras.', effect: { honor: -5, money: -10 } },
    ],
  },
  {
    id: 'peasant_34',
    title: 'O Urso da Floresta',
    description: 'Enquanto cortava lenha, você deu de cara com um urso pardo enorme devorando frutas silvestres.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Recuar lentamente em silêncio', consequence: 'O urso não te notou. Você voltou para casa com as pernas bambas.', effect: {} },
      { label: 'Gritar e tentar espantar a fera', consequence: 'O urso atacou. Você sobreviveu por milagre, mas saiu em frangalhos.', effect: { vitality: -30, honor: 15 } },
    ],
  },
  {
    id: 'peasant_35',
    title: 'Infestação de Ratos',
    description: 'Ratos descobriram seu esconderijo de grãos. Eles estão devorando suas reservas de inverno.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar um gato de rua', consequence: 'O gato era um caçador nato. Os ratos sumiram em uma semana.', effect: { money: -5 } },
      { label: 'Caçar os ratos com as próprias mãos', consequence: 'Você passou o dia inteiro matando ratos. Suas mãos ficaram fortes.', effect: { strength: 5, vitality: -10 } },
    ],
  },

  // --- ESTRADA E ENCONTROS ---
  {
    id: 'peasant_36',
    title: 'O Cavaleiro Ferido',
    description: 'Você encontrou um nobre cavaleiro sangrando na beira da estrada de terra após uma emboscada.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Carregar ele até o meistre', consequence: 'O cavaleiro sobreviveu. Sua família enviou uma recompensa generosa.', effect: { strength: -10, vitality: -10, faith: 5, honor: 25, money: 15 } },
      { label: 'Roubar a bolsa dele e fugir', consequence: 'Você ficou rico, mas a culpa e o medo de ser descoberto não te largam.', effect: { faith: -15, honor: -30, money: 40 } },
    ],
  },
  {
    id: 'peasant_37',
    title: 'O Acampamento Cigano',
    description: 'Uma trupe de viajantes montou acampamento perto da vila, oferecendo adivinhações e poções.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar para ler a sorte', consequence: 'A cigana leu sua mão e disse coisas inquietantes. Ficou na sua cabeça.', effect: { faith: -5, money: -5 } },
      { label: 'Denunciá-los ao padre', consequence: 'O padre agradeceu sua devoção. Os ciganos foram expulsos.', effect: { faith: 15, honor: -10 } },
    ],
  },
  {
    id: 'peasant_38',
    title: 'Mercador de Sementes Mágicas',
    description: 'Um mercador estrangeiro te oferece "sementes do oriente" que crescem mesmo na neve. Parece golpe.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Arriscar e comprar', consequence: 'As sementes não cresceram. Você foi enganado como um tolo.', effect: { money: -10 } },
      { label: 'Rir da cara dele e ir embora', consequence: 'Você reconheceu o golpe e saiu com a carteira intacta.', effect: { honor: 5 } },
    ],
  },
  {
    id: 'peasant_39',
    title: 'A Ponte Desabou',
    description: 'A velha ponte de madeira que liga a vila ao mercado da cidade desabou com as chuvas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Atravessar o rio a nado com as mercadorias', consequence: 'Você chegou encharcado mas vendeu tudo no mercado.', effect: { strength: 10, vitality: -20, honor: 5, money: 10 } },
      { label: 'Desistir do mercado e voltar para casa', consequence: 'Você perdeu o dia de feira. As mercadorias ficaram estragando em casa.', effect: { money: -15 } },
    ],
  },
  {
    id: 'peasant_40',
    title: 'Bandidos de Estrada',
    description: 'Dois homens armados com facas enferrujadas te pararam na floresta exigindo o seu dinheiro.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Entregar as moedas pacificamente', consequence: 'Você perdeu o dinheiro mas chegou em casa inteiro.', effect: { honor: -10, money: -20 } },
      { label: 'Puxar a foice e lutar', consequence: 'Você lutou como um leão. Saiu machucado mas os bandidos fugiram.', effect: { strength: 10, vitality: -25, honor: 20 } },
    ],
  },

  // --- TRABALHO PESADO ---
  {
    id: 'peasant_41',
    title: 'O Dia da Colheita',
    description: 'É a semana mais importante do ano. O senhor das terras exige que todos trabalhem do nascer ao pôr do sol.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Trabalhar até a exaustão total', consequence: 'Você foi o último a sair do campo. O feitor te notou com respeito.', effect: { strength: 10, vitality: -30, honor: 15, money: 15 } },
      { label: 'Fingir dor nas costas', consequence: 'Você descansou enquanto todos trabalhavam. O feitor não esqueceu.', effect: { strength: -5, vitality: 10, honor: -15, money: -10 } },
    ],
  },
  {
    id: 'peasant_42',
    title: 'Pedra no Arado',
    description: 'Enquanto lavrava o campo, seu arado prendeu em uma pedra gigantesca enterrada no solo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Passar o dia inteiro cavando para tirar', consequence: 'Você tirou a pedra sozinho. Suas costas agradecem que não.', effect: { strength: 15, vitality: -20, honor: 5 } },
      { label: 'Arar em volta e deixar a pedra lá', consequence: 'A pedra ficou. O campo produziu menos esse ano.', effect: { honor: -5, money: -5 } },
    ],
  },
  {
    id: 'peasant_43',
    title: 'O Feitor Cruel',
    description: 'O novo capataz do lorde tem prazer em chicotear os camponeses que descansam por um minuto.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Trabalhar dobrado para não apanhar', consequence: 'Você não apanhou, mas chegou em casa mal conseguindo andar.', effect: { strength: 5, vitality: -15, honor: -5 } },
      { label: 'Retrucar as ordens dele', consequence: 'Você levou uma bordoada mas a vila inteira te respeitou pela coragem.', effect: { vitality: -25, honor: 20 } },
    ],
  },
  {
    id: 'peasant_44',
    title: 'Árvore Ancestral',
    description: 'O feitor ordenou que você derrubasse o grande carvalho onde os aldeões antigos rezavam.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Derrubar (ordens são ordens)', consequence: 'Você derrubou a árvore sagrada. Os velhos da vila te olharam com desprezo.', effect: { strength: 10, vitality: -15, faith: -15, money: 5 } },
      { label: 'Recusar por respeito aos antepassados', consequence: 'Você se recusou e levou uma punição, mas os velhos te abençoaram.', effect: { vitality: -10, faith: 15, honor: 10, money: -5 } },
    ],
  },
  {
    id: 'peasant_45',
    title: 'O Celeiro com Goteiras',
    description: 'Começou a chover e você percebeu que o celeiro do lorde tem goteiras bem em cima do trigo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Subir no telhado liso para consertar', consequence: 'Você escorregou mas se segurou. O telhado ficou consertado e o lorde ficou satisfeito.', effect: { strength: 5, vitality: -15, honor: 15, money: 5 } },
      { label: 'Deixar molhar, o trigo não é seu', consequence: 'O feitor te culpou pela perda do trigo. Seu salário foi cortado.', effect: { honor: -10, money: -10 } },
    ],
  },

  // --- DESASTRES E CLIMA ---
  {
    id: 'peasant_46',
    title: 'O Inverno Rigoroso',
    description: 'A neve cobriu a vila até a altura das janelas. A lenha está acabando e o frio é congelante.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Enfrentar a nevasca para cortar lenha', consequence: 'Você voltou coberto de neve mas a lareira ficou acesa por semanas.', effect: { strength: 5, vitality: -20, honor: 10 } },
      { label: 'Queimar os móveis velhos de casa', consequence: 'Você sobreviveu ao frio, mas a casa ficou vazia de móveis.', effect: { honor: -5, money: -10 } },
    ],
  },
  {
    id: 'peasant_47',
    title: 'A Enchente de Primavera',
    description: 'O gelo derreteu rápido demais e o rio transbordou, invadindo os campos baixos.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Cavar valas no meio da lama', consequence: 'As valas desviaram a água. Você salvou boa parte da plantação.', effect: { strength: 10, vitality: -25, honor: 10 } },
      { label: 'Subir no telhado e rezar', consequence: 'A água baixou sozinha. A fé foi testada e a colheita foi perdida.', effect: { faith: 10, money: -15 } },
    ],
  },
  {
    id: 'peasant_48',
    title: 'O Vento Uivante',
    description: 'Uma tempestade de vento arrancou o teto do chiqueiro. Os porcos estão fugindo!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Correr na tempestade para agarrá-los', consequence: 'Você pegou todos os porcos na chuva. Levou horas, mas nenhum se perdeu.', effect: { strength: 5, vitality: -15, honor: 5 } },
      { label: 'Esconder-se e procurar depois', consequence: 'Dois porcos fugiram para a floresta e nunca voltaram.', effect: { honor: -5, money: -20 } },
    ],
  },
  {
    id: 'peasant_49',
    title: 'O Sol de Escaldar',
    description: 'O verão está tão quente que pássaros estão caindo mortos das árvores.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Trabalhar apenas à noite', consequence: 'Você trabalhou sob as estrelas. A produção caiu, mas você ficou vivo.', effect: { vitality: -5, honor: -5, money: -5 } },
      { label: 'Beber muita água do rio e ignorar o calor', consequence: 'Você aguentou o calor mas a água do rio te adoeceu um pouco.', effect: { strength: 5, vitality: -20, honor: 10 } },
    ],
  },
  {
    id: 'peasant_50',
    title: 'O Raio',
    description: 'Uma tempestade repentina caiu. Um raio atingiu uma árvore a dez passos de você!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Agradecer a Deus pela vida', consequence: 'Você caiu de joelhos e rezou. Deus poupou sua vida hoje.', effect: { vitality: -5, faith: 20 } },
      { label: 'Correr desesperado para casa', consequence: 'Você correu tanto que torceu o tornozelo e ficou dias sem trabalhar.', effect: { strength: -5, vitality: -10, honor: -5 } },
    ],
  },

  // --- SOBRENATURAL, SUPERSTIÇÕES E LEIS ---
  {
    id: 'peasant_51',
    title: 'O Eclipse Solar',
    description: 'No meio do dia, o sol começou a ser engolido pela escuridão. Os aldeões estão em pânico.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Cair de joelhos e rezar', consequence: 'O sol voltou. Você agradeceu a Deus pela misericórdia.', effect: { faith: 20 } },
      { label: 'Aproveitar o escuro para dormir', consequence: 'Você dormiu enquanto o mundo entrava em pânico. Que sono bom.', effect: { vitality: 10, faith: -10, honor: -5 } },
    ],
  },
  {
    id: 'peasant_52',
    title: 'Ossos no Campo',
    description: 'Enquanto arava, você desenterrou um esqueleto humano muito antigo com uma moeda de prata nos dentes.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pegar a moeda e enterrar de novo', consequence: 'Você ficou com a moeda. As pesadelos que se seguiram não tinham preço.', effect: { faith: -15, honor: -10, money: 25 } },
      { label: 'Chamar o padre para benzer', consequence: 'O padre abençoou o local e te elogiou pela devoção.', effect: { faith: 15, honor: 10 } },
    ],
  },
  {
    id: 'peasant_53',
    title: 'A Festa do Solstício',
    description: 'Os aldeões fizeram uma grande fogueira e estão dançando e bebendo em adoração à colheita.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Dançar e beber até cair', consequence: 'Que noite! Você dançou, bebeu e riu. O padre ficou desapontado.', effect: { vitality: 15, faith: -10, honor: -5, money: -5 } },
      { label: 'Ir dormir, é pecado festejar assim', consequence: 'Você ficou em casa rezando. O padre te parabenizou no domingo.', effect: { faith: 15, honor: 5 } },
    ],
  },
  {
    id: 'peasant_54',
    title: 'O Juiz da Comarca',
    description: 'O juiz real chegou à vila para resolver disputas locais. Um vizinho te acusou de roubar lenha.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Defender sua honra perante o juiz', consequence: 'O juiz te absolveu. Você saiu de cabeça erguida da corte.', effect: { honor: 15 } },
      { label: 'Pagar o vizinho para ele calar a boca', consequence: 'O vizinho ficou quieto. O assunto foi encerrado, mas custou caro.', effect: { honor: -5, money: -15 } },
    ],
  },
  {
    id: 'peasant_55',
    title: 'Fantasma no Moinho',
    description: 'Todos dizem que o moinho abandonado é assombrado, mas o moleiro oferece ouro para quem buscar a roda lá dentro.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Criar coragem e buscar', consequence: 'Você entrou no moinho escuro, pegou a roda e saiu correndo. Não havia fantasma, mas seu coração disparou.', effect: { strength: 5, vitality: -15, faith: -5, honor: 20, money: 30 } },
      { label: 'Dizer que ouro nenhum vale a alma', consequence: 'Você recusou. Sua fé ficou intacta e sua saúde também.', effect: { faith: 10, honor: -10 } },
    ],
  },
  {
    id: 'peasant_56',
    title: 'O Imposto do Casamento',
    description: 'Sua prima vai casar, e o lorde exige o "imposto de cama" para autorizar a união.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Ajudar a família a pagar', consequence: 'Você contribuiu para o casamento da prima. A família ficou em dívida com você.', effect: { honor: 15, money: -20 } },
      { label: 'Não é problema meu', consequence: 'Você se recusou a ajudar. A família não esqueceu.', effect: { honor: -20 } },
    ],
  },
  {
    id: 'peasant_57',
    title: 'Comida Estragada',
    description: 'A carne que você salgou no mês passado está com um cheiro horrível, mas você está com fome.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comer segurando a respiração', consequence: 'Você passou dias com dores horríveis no estômago. Valeu? Não.', effect: { vitality: -25 } },
      { label: 'Jogar fora e dormir com fome', consequence: 'Você dormiu com o estômago vazio mas acordou vivo.', effect: { strength: -10, vitality: -10 } },
    ],
  },
  {
    id: 'peasant_58',
    title: 'O Mendigo Louco',
    description: 'Um homem coberto de trapos e lama te agarrou na rua profetizando uma tragédia.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Empurrar ele no chão', consequence: 'Você se livrou dele. Os que viram ficaram desconfortáveis.', effect: { strength: 5, faith: -5, honor: -10 } },
      { label: 'Dar pão para ele se acalmar', consequence: 'O mendigo se acalmou, comeu e chorou de gratidão.', effect: { faith: 10, honor: 10, money: -2 } },
    ],
  },
  {
    id: 'peasant_59',
    title: 'Inspeção Real',
    description: 'Guardas do rei estão inspecionando celeiros em busca de grãos não declarados. Você guardou um pouco a mais.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Esconder rápido debaixo do chão', consequence: 'Os guardas não acharam nada. Você guardou os grãos e a carteira.', effect: { vitality: -10, honor: -15, money: 15 } },
      { label: 'Entregar o excesso aos guardas', consequence: 'Você foi honesto. O capitão dos guardas anotou seu nome favoravelmente.', effect: { honor: 15, money: -15 } },
    ],
  },
  {
    id: 'peasant_60',
    title: 'A Fonte Milagrosa',
    description: 'Surgiu um boato de que a água de uma fonte na floresta cura dores nas costas do trabalho no campo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Beber da fonte com fé', consequence: 'Você bebeu e suas costas pararam de doer por semanas. Milagre ou coincidência?', effect: { vitality: 20, faith: 15 } },
      { label: 'Chamar tudo isso de superstição idiota', consequence: 'Você foi cético. Suas costas continuaram doendo como sempre.', effect: { faith: -10, honor: 5 } },
    ],
  },

  // --- COTIDIANO E TRAGÉDIAS DA VILA ---
  {
    id: 'peasant_61',
    title: 'O Rio Secou',
    description: 'O pequeno rio que cruza a vila amanheceu com apenas um filete de lama. Os peixes estão morrendo nas margens.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pegar os peixes mortos para salgar', consequence: 'Você salgou os peixes. A carne era suspeita, mas encheu a barriga.', effect: { vitality: -15, honor: -5, money: 10 } },
      { label: 'Cavar o leito em busca de água limpa', consequence: 'Você cavou horas e encontrou um fio de água fria e limpa.', effect: { strength: 10, vitality: -20, honor: 5 } },
    ],
  },
  {
    id: 'peasant_62',
    title: 'O Porco Fujão',
    description: 'Seu porco mais gordo quebrou a cerca e fugiu para a floresta negra. Ele vale meses de trabalho.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Entrar na floresta escura para buscá-lo', consequence: 'Você o encontrou se banhando em uma poça. Trouxe ele de volta com orgulho.', effect: { strength: 5, vitality: -15, faith: -5, honor: 10, money: 20 } },
      { label: 'Dar o porco como perdido', consequence: 'O porco nunca voltou. Meses de criação perdidos.', effect: { honor: -10, money: -20 } },
    ],
  },
  {
    id: 'peasant_63',
    title: 'A Bota Furada',
    description: 'Sua única bota furou bem na sola. O inverno rigoroso está fazendo seus dedos congelarem no campo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar o sapateiro para remendar', consequence: 'O sapateiro fez um bom serviço. Seus pés agradeceram.', effect: { vitality: 10, money: -10 } },
      { label: 'Encher de palha e aguentar a dor', consequence: 'Você aguentou o inverno todo mancando. A palha ajudou pouco.', effect: { vitality: -15, money: 5 } },
    ],
  },
  {
    id: 'peasant_64',
    title: 'O Pregador Fanático',
    description: 'Um monge chegou gritando na praça que o banho atrai demônios. Vários aldeões pararam de se lavar.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Seguir o conselho e parar de tomar banho', consequence: 'Você parou de se banhar. Os vizinhos começaram a manter distância.', effect: { vitality: -20, faith: 15, honor: -5 } },
      { label: 'Tomar banho no rio escondido', consequence: 'Você se lavou às escondidas. Sentiu-se herege e limpo ao mesmo tempo.', effect: { vitality: 15, faith: -10, honor: 5 } },
    ],
  },
  {
    id: 'peasant_65',
    title: 'A Roda Quebrada',
    description: 'Sua carroça de mão quebrou a roda de madeira no meio da estrada, cheia de lenha pesada.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Carregar a lenha nas costas', consequence: 'Você carregou tudo nas costas. Sua espinha nunca mais foi a mesma.', effect: { strength: 15, vitality: -25, honor: 5 } },
      { label: 'Abandonar a lenha e levar só a carroça', consequence: 'Você abandonou a lenha. Outra pessoa a pegou antes de você voltar.', effect: { honor: -5, money: -10 } },
    ],
  },

  // --- OPORTUNIDADES E TENTAÇÕES ---
  {
    id: 'peasant_66',
    title: 'O Mel Selvagem',
    description: 'Você encontrou uma enorme colmeia cheia de mel no tronco de uma árvore podre.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Enfrentar as abelhas para pegar', consequence: 'Você saiu coberto de ferroadas mas com um pote enorme de mel.', effect: { vitality: -15, money: 20 } },
      { label: 'Não vale a pena ser picado', consequence: 'Você foi embora. O mel ficou para os ursos.', effect: { honor: -5 } },
    ],
  },
  {
    id: 'peasant_67',
    title: 'A Espada Enferrujada',
    description: 'Arando a terra, sua enxada bateu em algo de metal. É uma velha espada de cavaleiro, cheia de ferrugem.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Limpar e guardar como arma', consequence: 'Você passou dias limpando a lâmina. Ela nunca brilhou de verdade, mas cortava bem.', effect: { strength: 15, honor: 10 } },
      { label: 'Vender o ferro velho para o ferreiro', consequence: 'O ferreiro pagou pelo peso do metal. Simples e prático.', effect: { honor: -5, money: 15 } },
    ],
  },
  {
    id: 'peasant_68',
    title: 'O Festival da Cerveja',
    description: 'A colheita de cevada foi boa e o cervejeiro local liberou um barril de graça na praça.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Beber até esquecer o próprio nome', consequence: 'Que noite gloriosa. Que manhã horrível.', effect: { strength: -5, vitality: 15, faith: -10, honor: -15 } },
      { label: 'Beber só uma caneca e ir trabalhar', consequence: 'Você trabalhou com a barriga quente e o humor leve.', effect: { strength: 5, vitality: 5, faith: 5, honor: 10 } },
    ],
  },
  {
    id: 'peasant_69',
    title: 'A Moeda Falsa',
    description: 'Um mercador na cidade te deu o troco do trigo com uma moeda de prata que parece ser feita de chumbo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Passar a moeda para frente na taverna', consequence: 'O taverneiro não percebeu. Você lucrou, mas sabe o que fez.', effect: { faith: -15, honor: -20, money: 5 } },
      { label: 'Jogar no rio e aceitar o prejuízo', consequence: 'Você jogou a moeda no rio. Honesto e pobre.', effect: { faith: 10, honor: 15, money: -5 } },
    ],
  },
  {
    id: 'peasant_70',
    title: 'O Torneio no Castelo',
    description: 'Os nobres estão fazendo um torneio de justas. Plebeus podem assistir se pagarem uma pequena taxa.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Gastar moedas para ver os cavaleiros', consequence: 'Foi espetacular. Você voltou para casa com os olhos brilhando.', effect: { vitality: 20, honor: 5, money: -10 } },
      { label: 'Ficar no campo capinando', consequence: 'Você trabalhou enquanto todos festejavam. Produtivo e solitário.', effect: { strength: 5, vitality: -15, money: 5 } },
    ],
  },

  // --- LEI E ORDEM MEDIEVAL ---
  {
    id: 'peasant_71',
    title: 'A Visita do Bispo',
    description: 'O Bispo da capital está de passagem. Todos na vila foram obrigados a lavar as ruas e doar comida.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Trabalhar duro para impressionar a Igreja', consequence: 'O Bispo benzeu sua família pelo esforço. Valeu cada gota de suor.', effect: { strength: -5, vitality: -15, faith: 25, honor: 10, money: -5 } },
      { label: 'Esconder a melhor comida no porão', consequence: 'O Bispo passou sem te notar. Sua barriga ficou cheia, mas a alma ficou pesada.', effect: { faith: -20, honor: -15, money: 10 } },
    ],
  },
  {
    id: 'peasant_72',
    title: 'O Forasteiro Suspeito',
    description: 'Um homem coberto por um manto negro chegou à taverna fazendo perguntas estranhas sobre as patrulhas dos guardas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Avisar o capitão da guarda', consequence: 'O capitão prendeu o homem e te agradeceu com moedas.', effect: { honor: 20, money: 5 } },
      { label: 'Aceitar uma moeda para ficar calado', consequence: 'Você ficou calado. O homem desapareceu na manhã seguinte.', effect: { faith: -10, honor: -25, money: 15 } },
    ],
  },
  {
    id: 'peasant_73',
    title: 'Roubo no Varal',
    description: 'Você pendurou sua túnica lavada para secar e alguém a roubou. É a sua única roupa boa para os domingos.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Investigar e socar o vizinho suspeito', consequence: 'Era o vizinho mesmo. Você recuperou a túnica e fez um inimigo.', effect: { strength: 10, vitality: -10, honor: 5 } },
      { label: 'Comprar panos velhos e costurar outra', consequence: 'Você costurou uma nova roupa torta mas decente.', effect: { vitality: -5, honor: -5, money: -10 } },
    ],
  },
  {
    id: 'peasant_74',
    title: 'O Cobrador Corrupto',
    description: 'O cobrador de impostos sugeriu que, por algumas moedas extras no bolso dele, ele pode esquecer de registrar suas galinhas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pagar a propina', consequence: 'O cobrador anotou suas galinhas como invisíveis. Negócio feito.', effect: { faith: -10, honor: -20, money: -5 } },
      { label: 'Recusar e pagar o imposto total', consequence: 'Você pagou o imposto correto. O cobrador te olhou com desprezo mas o rei ficou satisfeito.', effect: { faith: 10, honor: 20, money: -15 } },
    ],
  },
  {
    id: 'peasant_75',
    title: 'A Árvore Caída',
    description: 'Uma árvore gigantesca caiu bloqueando a principal estrada de comércio. Os guardas ordenaram que os plebeus a tirem.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Pegar o machado e trabalhar horas a fio', consequence: 'Você abriu a estrada com suas próprias mãos. O capitão te nomeou pelo esforço.', effect: { strength: 15, vitality: -25, honor: 15 } },
      { label: 'Fingir doença e ficar na cama', consequence: 'Você descansou enquanto os outros quebraram as costas. Vizinhos notaram.', effect: { strength: -5, vitality: 10, honor: -15 } },
    ],
  },

  // --- NATUREZA E CLIMA (PARTE 2) ---
  {
    id: 'peasant_76',
    title: 'Neve Tardia',
    description: 'A primavera estava chegando, mas uma nevasca fora de época ameaça matar as sementes recém-plantadas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Passar a noite acendendo fogueiras no campo', consequence: 'As fogueiras salvaram as sementes. Você mal conseguia andar no dia seguinte.', effect: { strength: 5, vitality: -25, honor: 10, money: 5 } },
      { label: 'Ir dormir e rezar para resistirem', consequence: 'Metade das sementes morreu. A fé foi testada junto com a colheita.', effect: { faith: 10, honor: -10, money: -15 } },
    ],
  },
  {
    id: 'peasant_77',
    title: 'O Cão Raivoso',
    description: 'Um cachorro babando espuma branca está correndo pelas ruas da vila, mordendo quem passa.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Enfrentar o cão com uma pá', consequence: 'Você abateu o cão doente. A vila ficou em dívida com você.', effect: { strength: 10, vitality: -20, honor: 25 } },
      { label: 'Trancar a porta e esperar os guardas', consequence: 'Os guardas chegaram tarde. Três pessoas já tinham sido mordidas.', effect: { honor: -10 } },
    ],
  },
  {
    id: 'peasant_78',
    title: 'Fogo no Campo',
    description: 'O tempo seco e um raio distante iniciaram um incêndio na borda do campo de trigo.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Correr com baldes de água do poço', consequence: 'Você combateu as chamas por horas. Salvou a maior parte da colheita.', effect: { strength: 10, vitality: -30, honor: 20, money: 10 } },
      { label: 'Pegar suas coisas e fugir da fumaça', consequence: 'Você fugiu. O campo queimou. Os vizinhos não esquecem quem foge.', effect: { honor: -20, money: -20 } },
    ],
  },
  {
    id: 'peasant_79',
    title: 'A Relíquia Falsa',
    description: 'Um vendedor ambulante quer te vender um "osso de São Barnabé" que garante colheitas fartas.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar a relíquia com as poucas economias', consequence: 'Você comprou o osso com fé. A colheita foi mediana, mas o coração estava em paz.', effect: { vitality: 5, faith: 15, money: -15 } },
      { label: 'Jogar uma pedra no charlatão', consequence: 'Você afugentou o vendedor de lixo. Seus vizinhos aplaudiram.', effect: { faith: -5, honor: 5 } },
    ],
  },
  {
    id: 'peasant_80',
    title: 'A Raposa Astuta',
    description: 'A raposa que roubou seu galinheiro ano passado voltou, mas agora ela caiu na sua armadilha.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Esfolar e vender a pele no mercado', consequence: 'A pele de raposa valeu bom dinheiro no mercado.', effect: { strength: 5, money: 15 } },
      { label: 'Ficar com pena e soltar na floresta', consequence: 'Você soltou a raposa. Ela provavelmente voltará.', effect: { faith: 10, honor: -5, money: -5 } },
    ],
  },

  // --- SAÚDE E VIDA ---
  {
    id: 'peasant_81',
    title: 'A Frieira Constante',
    description: 'Trabalhar no pântano todos os dias deixou seus pés em carne viva e com muita dor.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Comprar unguento na cidade', consequence: 'O unguento funcionou. Seus pés voltaram ao normal em uma semana.', effect: { vitality: 20, money: -10 } },
      { label: 'Passar banha de porco e trabalhar mancando', consequence: 'A banha de porco ajudou um pouco. Você mancou pelo campo semanas.', effect: { strength: -5, vitality: -15, honor: 5 } },
    ],
  },
  {
    id: 'peasant_82',
    title: 'O Parto Difícil',
    description: 'A ovelha de um vizinho está com dificuldades no parto, e ele te pediu ajuda de madrugada.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Mergulhar as mãos na lama e ajudar', consequence: 'O cordeiro nasceu. O vizinho jurou lealdade eterna entre lágrimas.', effect: { vitality: -15, faith: 10, honor: 15 } },
      { label: 'Dizer que você não é parteiro e voltar a dormir', consequence: 'A ovelha morreu. O vizinho nunca mais te olhou nos olhos.', effect: { vitality: 5, honor: -15 } },
    ],
  },
  {
    id: 'peasant_83',
    title: 'A Enxada Enfeitiçada',
    description: 'A viúva da vila disse que amaldiçoou a sua enxada porque você cortou a grama do lado dela.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Ignorar, magia não existe', consequence: 'Nada aconteceu. Ou aconteceu e você não percebeu.', effect: { faith: -10, honor: 5 } },
      { label: 'Pagar o padre para benzer o ferro', consequence: 'O padre benzeu a enxada com seriedade. Você dormiu melhor.', effect: { faith: 15, money: -10 } },
    ],
  },
  {
    id: 'peasant_84',
    title: 'Sopa de Pedra',
    description: 'A despensa está vazia e a fome bate. Tudo que você tem são ervas amargas e água.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Fazer uma sopa rala e aceitar a miséria', consequence: 'Você sobreviveu com dignidade. A fome era real, mas a honra intacta.', effect: { strength: -10, vitality: -20, faith: 10, honor: 5 } },
      { label: 'Entrar furtivamente na horta do lorde', consequence: 'Você roubou cenouras. Estava delicioso. O medo foi o tempero.', effect: { vitality: 15, faith: -15, honor: -25 } },
    ],
  },
  {
    id: 'peasant_85',
    title: 'O Lobo Solitário',
    description: 'Buscando lenha longe da vila, um lobo solitário rosnou para você de trás dos arbustos.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Atirar o machado nele', consequence: 'Você acertou o machado perto o suficiente para assustá-lo. O lobo recuou.', effect: { strength: 15, vitality: -15, honor: 10 } },
      { label: 'Subir na árvore e esperar amanhecer', consequence: 'Você passou a noite na árvore. O lobo foi embora ao amanhecer.', effect: { vitality: -10, honor: -10 } },
    ],
  },
  {
    id: 'peasant_86',
    title: 'O Convite da Taverna',
    description: 'Depois de 14 horas de trabalho sob o sol, seus amigos camponeses chamam para tomar hidromel.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Gastar as poucas moedas para relaxar', consequence: 'Você bebeu, riu e esqueceu o campo por uma noite. Valeu.', effect: { vitality: 20, faith: -5, money: -5 } },
      { label: 'Ir dormir para guardar energia', consequence: 'Você foi dormir sóbrio. Acordou descansado mas solitário.', effect: { vitality: -5, honor: 5 } },
    ],
  },
  {
    id: 'peasant_87',
    title: 'Gota de Orvalho',
    description: 'Dizem que beber o orvalho matinal da primeira flor da primavera traz saúde divina.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Acordar cedo para procurar a flor', consequence: 'Você encontrou a flor ao amanhecer e bebeu o orvalho. Sentiu-se renovado.', effect: { vitality: 15, faith: 10 } },
      { label: 'Lenda idiota, eu quero é dormir', consequence: 'Você dormiu bem. Sua ceticismo te poupou de madrugar.', effect: { vitality: 5, faith: -10 } },
    ],
  },
  {
    id: 'peasant_88',
    title: 'O Gato Preto',
    description: 'Um gato preto cruzou seu caminho na estrada de terra durante a noite. Má sorte na certa!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Fazer o sinal da cruz e cuspir no chão', consequence: 'Você desfez o mau-olhado com devoção. Dormiu tranquilo.', effect: { faith: 10 } },
      { label: 'Adotar o gato', consequence: 'O gato virou seu companheiro. Não trouxe azar nenhum, só fome extra.', effect: { vitality: 5, faith: -15, money: -2 } },
    ],
  },
  {
    id: 'peasant_89',
    title: 'A Mordida de Rato',
    description: 'Um rato de esgoto mordeu seu tornozelo no celeiro. A ferida começou a latejar estranhamente.',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Queimar a ferida com ferro quente', consequence: 'Doeu como o inferno, mas a ferida cicatrizou limpa.', effect: { strength: 10, vitality: -20, honor: 15 } },
      { label: 'Lavar no rio e esquecer', consequence: 'A ferida infeccionou feio. Dias de febre alta se seguiram.', effect: { strength: -10, vitality: -30 } },
    ],
  },
  {
    id: 'peasant_90',
    title: 'Colheita Abundante',
    description: 'Foi um ano perfeito. Choveu na medida certa e o sol brilhou. Seus sacos de grãos estão transbordando!',
    minAge: 13,
    socialClasses: ['peasant'],
    choices: [
      { label: 'Vender o excesso no mercado distante', consequence: 'A viagem cansou, mas o mercado pagou muito bem pelo grão fresco.', effect: { strength: -5, vitality: -5, money: 35 } },
      { label: 'Dar uma festa de agradecimento na vila', consequence: 'A vila inteira comeu e bebeu por sua conta. Sua reputação nunca foi tão alta.', effect: { vitality: 20, faith: 15, honor: 25, money: -10 } },
    ],
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
