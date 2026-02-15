/**
 * EVENTOS DE INFÂNCIA - ERA TUDOR/COLONIAL (1500-1699)
 * Eventos para crianças de 0-12 anos
 * 
 * Stats da era: ❤️ Vitalidade, 🛡️ Honra, ⛪ Fé, 💪 Força
 */

import type { Character } from '../types/game.types';

export interface ChildhoodEvent {
  id: string;
  title: string;
  description: string;
  minAge: number;
  maxAge: number;
  chance: number;
  requiredEra: string[];
  conditions?: {
    minMoney?: number;
    maxMoney?: number;
    gender?: 'male' | 'female';
  };
  options: {
    text: string;
    preview: string; // Preview das consequências
    result: {
      message: string;
      healthChange?: number;
      honorChange?: number;
      faithChange?: number;
      strengthChange?: number;
      moneyChange?: number;
      foodChange?: number;
      death?: boolean;
      addTrait?: string;
    };
  }[];
}

export const CHILDHOOD_EVENTS: ChildhoodEvent[] = [
  // =============================================
  // FASE 1: BEBÊ (0-4 anos) - O FILTRO DA MORTALIDADE
  // =============================================

  {
    id: 'infant_fever',
    title: '🤒 Febre Infantil',
    description: 'Você está com febre alta e não para de chorar. Sua mãe está desesperada.',
    minAge: 0,
    maxAge: 2,
    chance: 0.25,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Chamar o curandeiro',
        preview: '❤️ -15 Vitalidade | 💰 -$10',
        result: {
          message: 'O curandeiro fez sangrias e rezou. Você se recuperou, mas ficou fraco.',
          healthChange: -15,
          moneyChange: -10,
        },
      },
      {
        text: 'Rezar em casa',
        preview: '❤️ -5 Vitalidade | ⛪ +10 Fé',
        result: {
          message: 'Sua mãe rezou noite e dia. A febre passou por milagre.',
          healthChange: -5,
          faithChange: 10,
        },
      },
      {
        text: 'Não fazer nada',
        preview: '❤️ -30 Vitalidade | ☠️ Risco de morte',
        result: {
          message: 'A febre piorou drasticamente. Você quase morreu.',
          healthChange: -30,
          death: false, // Sobrevive por pouco
        },
      },
    ],
  },

  {
    id: 'starvation_baby',
    title: '🍼 Fome de Bebê',
    description: 'Sua mãe está doente e não consegue amamentar. Você está passando fome.',
    minAge: 0,
    maxAge: 1,
    chance: 0.2,
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      maxMoney: 50, // Só acontece se pobre
    },
    options: [
      {
        text: 'Dar leite de cabra',
        preview: '❤️ -10 Vitalidade | 🍖 -2 Comida',
        result: {
          message: 'Seu pai conseguiu leite de cabra. Você sobreviveu, mas seu estômago sofreu.',
          healthChange: -10,
          foodChange: -2,
        },
      },
      {
        text: 'Pedir ajuda aos vizinhos',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Os vizinhos ajudaram, mas agora sua família tem uma dívida de honra.',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'smallpox',
    title: '☠️ Varíola',
    description: 'Você pegou varíola. Seu corpo está coberto de feridas purulentas.',
    minAge: 1,
    maxAge: 4,
    chance: 0.15,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Isolar em casa',
        preview: '❤️ -25 Vitalidade | 💰 -5',
        result: {
          message: 'Você sobreviveu, mas ficou com cicatrizes permanentes no rosto.',
          healthChange: -25,
          moneyChange: -5,
          addTrait: 'Cicatrizes de Varíola',
        },
      },
      {
        text: 'Levar ao padre para bênção',
        preview: '⛪ +15 Fé | ❤️ -20 Vitalidade',
        result: {
          message: 'O padre rezou por você. Você sobreviveu e sua fé aumentou.',
          faithChange: 15,
          healthChange: -20,
        },
      },
      {
        text: 'Tentar remédios de ervas',
        preview: '❤️ -35 Vitalidade | ☠️ Alto risco',
        result: {
          message: 'As ervas não funcionaram. Você quase morreu.',
          healthChange: -35,
        },
      },
    ],
  },

  {
    id: 'domestic_accident',
    title: '🔥 Acidente Doméstico',
    description: 'Você se aproximou demais da lareira e suas roupas pegaram fogo!',
    minAge: 2,
    maxAge: 4,
    chance: 0.12,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Mãe te salva rapidamente',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Sua mãe te salvou! Você teve queimaduras leves.',
          healthChange: -10,
        },
      },
      {
        text: 'Demora para apagar',
        preview: '❤️ -30 Vitalidade | 💪 -10 Força',
        result: {
          message: 'As queimaduras foram graves. Você ficará marcado para sempre.',
          healthChange: -30,
          strengthChange: -10,
          addTrait: 'Queimaduras Graves',
        },
      },
    ],
  },

  // =============================================
  // FASE 2: CRIANÇA (5-8 anos) - TRABALHO OU PRIVILÉGIO
  // =============================================

  {
    id: 'first_work_day',
    title: '👨‍🌾 Primeiro Dia de Trabalho',
    description: 'Seu pai te levou para o campo. Você é criança, mas precisa ajudar a família.',
    minAge: 5,
    maxAge: 6,
    chance: 0.8, // Muito comum para pobres
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      maxMoney: 50,
    },
    options: [
      {
        text: 'Trabalhar duro',
        preview: '💪 +15 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você trabalhou o dia todo. Seus músculos doem, mas você está ficando forte.',
          strengthChange: 15,
          healthChange: -5,
        },
      },
      {
        text: 'Tentar fugir',
        preview: '🛡️ -20 Honra | 💪 -5 Força',
        result: {
          message: 'Seu pai te pegou e te bateu na frente de todos. Você foi humilhado.',
          honorChange: -20,
          strengthChange: -5,
        },
      },
      {
        text: 'Chorar e reclamar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você chorou, mas teve que trabalhar mesmo assim. Os outros riram de você.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'first_tutor',
    title: '📚 Primeiro Tutor',
    description: 'Seus pais contrataram um tutor para ensinar Latim e a Bíblia.',
    minAge: 5,
    maxAge: 7,
    chance: 0.8, // Muito comum para ricos
    requiredEra: ['tudor'],
    conditions: {
      minMoney: 100,
    },
    options: [
      {
        text: 'Estudar com dedicação',
        preview: '⛪ +20 Fé | 💪 -10 Força',
        result: {
          message: 'Você aprendeu a ler latim e a Bíblia. Mas passa o dia sentado.',
          faithChange: 20,
          strengthChange: -10,
        },
      },
      {
        text: 'Ser rebelde',
        preview: '🛡️ -15 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'O tutor te bateu com a palmatória. Você foi humilhado.',
          honorChange: -15,
          healthChange: -10,
        },
      },
      {
        text: 'Fingir prestar atenção',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Você não aprendeu quase nada, mas evitou punições.',
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'child_labor_accident',
    title: '🔨 Acidente de Trabalho Infantil',
    description: 'Você se cortou profundamente com a foice enquanto trabalhava no campo!',
    minAge: 6,
    maxAge: 8,
    chance: 0.15,
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      maxMoney: 50,
    },
    options: [
      {
        text: 'Enfaixar e continuar',
        preview: '❤️ -20 Vitalidade | 💪 +5 Força',
        result: {
          message: 'Você enfaixou e continuou trabalhando. Seu pai ficou orgulhoso.',
          healthChange: -20,
          strengthChange: 5,
        },
      },
      {
        text: 'Parar e ir para casa',
        preview: '❤️ -10 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Você foi chamado de fraco. O ferimento curou melhor.',
          healthChange: -10,
          honorChange: -10,
        },
      },
      {
        text: 'Gritar e chorar',
        preview: '🛡️ -20 Honra | ❤️ -5 Vitalidade',
        result: {
          message: 'Você foi humilhado publicamente. Todos riram da sua fraqueza.',
          honorChange: -20,
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'steal_to_survive',
    title: '🍞 Roubar para Sobreviver',
    description: 'Sua família está passando fome. Você vê pão na janela do padeiro.',
    minAge: 7,
    maxAge: 9,
    chance: 0.18,
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      maxMoney: 20,
    },
    options: [
      {
        text: 'Roubar o pão',
        preview: '🍖 +3 Comida | 🛡️ -15 Honra | ☠️ Risco de punição',
        result: {
          message: 'Você roubou e não foi pego. Sua família comeu hoje.',
          foodChange: 3,
          honorChange: -15,
        },
      },
      {
        text: 'Mendigar ao padeiro',
        preview: '🛡️ -10 Honra | 🍖 +1 Comida',
        result: {
          message: 'O padeiro te deu restos. Você foi humilhado, mas comeu.',
          honorChange: -10,
          foodChange: 1,
        },
      },
      {
        text: 'Passar fome com dignidade',
        preview: '🛡️ +10 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você manteve sua honra, mas passou fome terrível.',
          honorChange: 10,
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'street_bullying',
    title: '👊 Violência de Rua',
    description: 'Crianças mais velhas te cercaram e começaram a te bater e zombar de você.',
    minAge: 6,
    maxAge: 10,
    chance: 0.2,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Lutar de volta',
        preview: '🛡️ +15 Honra | ❤️ -20 Vitalidade',
        result: {
          message: 'Você apanhou, mas lutou com bravura. Ganharam seu respeito.',
          honorChange: 15,
          healthChange: -20,
        },
      },
      {
        text: 'Fugir correndo',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Você fugiu como um covarde. Agora todos te chamam de medroso.',
          honorChange: -25,
        },
      },
      {
        text: 'Implorar por piedade',
        preview: '🛡️ -30 Honra | ❤️ -5 Vitalidade',
        result: {
          message: 'Você implorou de joelhos. Eles riram e cuspiram em você antes de ir embora.',
          honorChange: -30,
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'noble_etiquette',
    title: '👑 Etiqueta Nobre',
    description: 'Você cometeu um erro de etiqueta na frente de um Lorde importante!',
    minAge: 7,
    maxAge: 10,
    chance: 0.15,
    requiredEra: ['tudor'],
    conditions: {
      minMoney: 100,
    },
    options: [
      {
        text: 'Pedir desculpas formalmente',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O Lorde aceitou suas desculpas, mas você envergonhou sua família.',
          honorChange: -10,
        },
      },
      {
        text: 'Fingir que não foi você',
        preview: '🛡️ -20 Honra | ⛪ -10 Fé',
        result: {
          message: 'Você mentiu descaradamente. Deus viu e sua família sabe.',
          honorChange: -20,
          faithChange: -10,
        },
      },
      {
        text: 'Chorar de vergonha',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você chorou publicamente. Todos ficaram constrangidos.',
          honorChange: -15,
        },
      },
    ],
  },

  // =============================================
  // FASE 3: PRÉ-ADOLESCENTE (9-12 anos) - DESTINO SE DEFINE
  // =============================================

  {
    id: 'first_death',
    title: '💀 Primeira Morte Próxima',
    description: 'Seu irmão mais novo morreu de febre. Você viu o corpo sendo enterrado.',
    minAge: 9,
    maxAge: 12,
    chance: 0.25,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Chorar e rezar',
        preview: '⛪ +20 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você rezou pela alma dele. Sua fé aumentou, mas o trauma permanece.',
          faithChange: 20,
          healthChange: -10,
        },
      },
      {
        text: 'Ficar em silêncio',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você não conseguiu processar. O trauma te acompanhará.',
          healthChange: -15,
        },
      },
      {
        text: 'Questionar Deus',
        preview: '⛪ -25 Fé',
        result: {
          message: 'Você começou a duvidar da existência de um Deus bondoso.',
          faithChange: -25,
        },
      },
    ],
  },

  {
    id: 'apprentice_start',
    title: '🔨 Aprendiz',
    description: 'Seu pai te enviou para ser aprendiz de um ferreiro. Você morará com ele por 7 anos.',
    minAge: 10,
    maxAge: 12,
    chance: 0.4,
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      maxMoney: 80,
      gender: 'male',
    },
    options: [
      {
        text: 'Aceitar com entusiasmo',
        preview: '💪 +20 Força | 🛡️ +10 Honra',
        result: {
          message: 'Você começou a aprender um ofício honrado. O trabalho é duro.',
          strengthChange: 20,
          honorChange: 10,
        },
      },
      {
        text: 'Ir relutante',
        preview: '💪 +10 Força | 🛡️ -5 Honra',
        result: {
          message: 'Você foi, mas sem vontade. O mestre percebeu.',
          strengthChange: 10,
          honorChange: -5,
        },
      },
      {
        text: 'Recusar e fugir',
        preview: '🛡️ -30 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você fugiu de casa. Agora vive nas ruas e sua família te deserdou.',
          honorChange: -30,
          healthChange: -10,
          addTrait: 'Fugitivo',
        },
      },
    ],
  },

  {
    id: 'grammar_school',
    title: '📖 Escola de Gramática',
    description: 'Você foi aceito na Grammar School. Aprenderá Latim, Grego e Retórica.',
    minAge: 10,
    maxAge: 12,
    chance: 0.5,
    requiredEra: ['tudor'],
    conditions: {
      minMoney: 100,
    },
    options: [
      {
        text: 'Estudar com afinco',
        preview: '⛪ +15 Fé | 💪 -10 Força',
        result: {
          message: 'Você se tornou um aluno brilhante, mas seu corpo ficou fraco.',
          faithChange: 15,
          strengthChange: -10,
        },
      },
      {
        text: 'Ser mediano',
        preview: '⛪ +5 Fé | 💪 -5 Força',
        result: {
          message: 'Você passou sem se destacar.',
          faithChange: 5,
          strengthChange: -5,
        },
      },
      {
        text: 'Fazer amizades influentes',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você focou em fazer amigos nobres. Conexões importam mais que conhecimento.',
          honorChange: 20,
        },
      },
    ],
  },

  {
    id: 'first_love',
    title: '💕 Primeiro Amor',
    description: 'Você se apaixonou por uma criança da vizinhança. Seu coração acelera quando a vê.',
    minAge: 11,
    maxAge: 12,
    chance: 0.3,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Declarar seus sentimentos',
        preview: '🛡️ +10 Honra | ❤️ +5 Vitalidade',
        result: {
          message: 'Ela sorriu para você! Seu primeiro amor é correspondido.',
          honorChange: 10,
          healthChange: 5,
        },
      },
      {
        text: 'Guardar segredo',
        preview: 'Sem mudanças',
        result: {
          message: 'Você guardou o sentimento. Talvez um dia...',
        },
      },
      {
        text: 'Ser rejeitado',
        preview: '🛡️ -15 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Ela riu de você na frente de todos. Seu coração está partido.',
          honorChange: -15,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'military_recruitment',
    title: '⚔️ Recrutamento Militar',
    description: 'Soldados estão recrutando meninos para servir como mensageiros na guerra.',
    minAge: 11,
    maxAge: 12,
    chance: 0.15,
    requiredEra: ['tudor', 'colonial'],
    conditions: {
      gender: 'male',
    },
    options: [
      {
        text: 'Alistar-se voluntariamente',
        preview: '🛡️ +25 Honra | ❤️ -15 Vitalidade | ☠️ Risco',
        result: {
          message: 'Você foi para a guerra como mensageiro. Viu horrores, mas sobreviveu.',
          honorChange: 25,
          healthChange: -15,
        },
      },
      {
        text: 'Esconder-se',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você se escondeu enquanto outros iam lutar. Você é chamado de covarde.',
          honorChange: -20,
        },
      },
      {
        text: 'Pais pagam para te livrar',
        preview: '💰 -50 | 🛡️ -10 Honra',
        result: {
          message: 'Seus pais pagaram para você não ir. Você foi poupado, mas perdeu respeito.',
          moneyChange: -50,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'noble_hunt',
    title: '🦌 Caçada Nobre',
    description: 'Seu pai te levou para a caçada de veados com outros nobres.',
    minAge: 11,
    maxAge: 12,
    chance: 0.2,
    requiredEra: ['tudor'],
    conditions: {
      minMoney: 150,
      gender: 'male',
    },
    options: [
      {
        text: 'Abater o veado',
        preview: '🛡️ +30 Honra | 💪 +10 Força',
        result: {
          message: 'Você matou o veado! Os nobres te elogiaram. Seu pai está orgulhoso.',
          honorChange: 30,
          strengthChange: 10,
        },
      },
      {
        text: 'Errar o tiro',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você errou vergonhosamente. Os nobres riram de você.',
          honorChange: -15,
        },
      },
      {
        text: 'Recusar atirar',
        preview: '🛡️ -25 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você se recusou a matar. Os nobres te chamaram de fraco, mas sua consciência está limpa.',
          honorChange: -25,
          faithChange: 10,
        },
      },
    ],
  },

  // =============================================
  // EVENTOS ESPECIAIS (RAROS)
  // =============================================

  {
    id: 'orphaned',
    title: '👥 Orfandade',
    description: 'Seus pais morreram de peste. Você está sozinho no mundo.',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Ir morar com parentes',
        preview: '🛡️ -10 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você foi acolhido por um tio distante. Ele te trata como servo.',
          honorChange: -10,
          healthChange: -10,
        },
      },
      {
        text: 'Viver nas ruas',
        preview: '🛡️ -30 Honra | 💪 +15 Força | ❤️ -20 Vitalidade',
        result: {
          message: 'Você sobrevive roubando e mendigando. É uma vida dura.',
          honorChange: -30,
          strengthChange: 15,
          healthChange: -20,
          addTrait: 'Órfão das Ruas',
        },
      },
    ],
  },

  {
    id: 'witchcraft_accusation',
    title: '🔥 Acusação de Bruxaria',
    description: 'Alguém te acusou de bruxaria! Você tem uma marca de nascença suspeita.',
    minAge: 8,
    maxAge: 12,
    chance: 0.05,
    requiredEra: ['tudor'],
    conditions: {
      gender: 'female',
    },
    options: [
      {
        text: 'Família prova inocência',
        preview: '💰 -100 | ⛪ +20 Fé',
        result: {
          message: 'Sua família pagou ao padre para provar sua inocência. Você foi poupada.',
          moneyChange: -100,
          faithChange: 20,
        },
      },
      {
        text: 'Fugir da cidade',
        preview: '🛡️ -40 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você fugiu na calada da noite. Agora é uma fugitiva.',
          honorChange: -40,
          healthChange: -15,
          addTrait: 'Acusada de Bruxaria',
        },
      },
      {
        text: 'Enfrentar o julgamento',
        preview: '☠️ MORTE',
        result: {
          message: 'Você foi julgada e queimada na fogueira.',
          death: true,
        },
      },
    ],
  },

  {
    id: 'public_execution',
    title: '⚰️ Execução Pública',
    description: 'Seus pais te levaram para ver um enforcamento na praça. Era um ladrão.',
    minAge: 8,
    maxAge: 12,
    chance: 0.2,
    requiredEra: ['tudor', 'colonial'],
    options: [
      {
        text: 'Assistir tudo',
        preview: '❤️ -15 Vitalidade | 🛡️ +5 Honra',
        result: {
          message: 'Você viu o homem se debater até morrer. Essa imagem nunca te deixará.',
          healthChange: -15,
          honorChange: 5,
        },
      },
      {
        text: 'Fechar os olhos',
        preview: '❤️ -5 Vitalidade',
        result: {
          message: 'Você fechou os olhos, mas ouviu os gritos. O trauma permanece.',
          healthChange: -5,
        },
      },
      {
        text: 'Sentir pena do condenado',
        preview: '⛪ +10 Fé | 🛡️ -10 Honra',
        result: {
          message: 'Você sentiu compaixão. Seu pai te repreendeu por ser fraco.',
          faithChange: 10,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'royal_encounter',
    title: '👑 Encontro com a Realeza',
    description: 'A comitiva real passou pela sua vila! Você viu o Rei Henry VIII / Rainha Elizabeth!',
    minAge: 6,
    maxAge: 12,
    chance: 0.01, // Muito raro!
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ajoelhar e reverenciar',
        preview: '🛡️ +20 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você se ajoelhou respeitosamente. O rei acenou para você! Que honra!',
          honorChange: 20,
          faithChange: 10,
        },
      },
      {
        text: 'Tentar se aproximar',
        preview: '🛡️ +30 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você foi barrado pelos guardas, mas sua ousadia impressionou.',
          honorChange: 30,
          healthChange: -10,
        },
      },
      {
        text: 'Apenas observar',
        preview: '🛡️ +5 Honra',
        result: {
          message: 'Você viu a realeza de longe. Uma história para contar aos netos.',
          honorChange: 5,
        },
      },
    ],
  },
];

/**
 * Retorna um evento de infância apropriado para idade e condições
 */
export function getChildhoodEvent(character: Character): ChildhoodEvent | null {
  // Filtra eventos disponíveis
  const availableEvents = CHILDHOOD_EVENTS.filter((event) => {
    // Verifica idade
    if (character.age < event.minAge || character.age > event.maxAge) return false;
    
    // Verifica era
    if (!event.requiredEra.includes(character.era)) return false;
    
    // Verifica condições
    if (event.conditions) {
      const { minMoney, maxMoney, gender } = event.conditions;
      if (minMoney && character.money < minMoney) return false;
      if (maxMoney && character.money > maxMoney) return false;
      if (gender && character.gender !== gender) return false;
    }
    
    return true;
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
