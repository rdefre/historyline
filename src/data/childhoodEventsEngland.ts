/**
 * 50+ EVENTOS DE INFÂNCIA - INGLATERRA TUDOR (1500-1699)
 * Eventos para crianças de 0-12 anos
 * 
 * DISTRIBUIÇÃO:
 * - 35% Neutros (apenas narrativa)
 * - 65% Com consequências
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
  category: 'family' | 'education' | 'leisure' | 'danger' | 'community' | 'neutral';
  
  // Verificações de narrative flags
  requiresFlags?: {
    isOrphan?: boolean;
    livingWith?: ('parents' | 'relative' | 'alone' | 'master')[];
  };
  
  conditions?: {
    minMoney?: number;
    maxMoney?: number;
    gender?: 'male' | 'female';
    socialClasses?: ('peasant' | 'artisan' | 'gentry' | 'nobility')[]; // Classes permitidas
  };
  
  // Flags que este evento define
  setsFlags?: Partial<Character['narrativeFlags']>;
  
  options: {
    text: string;
    preview: string;
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
      setFlags?: Partial<Character['narrativeFlags']>;
    };
  }[];
}

export const CHILDHOOD_EVENTS_ENGLAND: ChildhoodEvent[] = [
  
  // ==========================================
  // CATEGORIA: FAMÍLIA (15 eventos)
  // ==========================================

  // EVENTO 1: Nascimento de Irmão
  {
    id: 'sibling_birth',
    title: '👶 Novo Irmão',
    description: 'Sua mãe deu à luz! Você tem um novo irmãozinho.',
    minAge: 2,
    maxAge: 10,
    chance: 0.15,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ficar feliz',
        preview: 'Sem mudanças',
        result: {
          message: 'Você está animado com o novo membro da família!',
        },
      },
      {
        text: 'Sentir ciúmes',
        preview: 'Sem mudanças',
        result: {
          message: 'Você sente que seus pais não te dão mais atenção.',
        },
      },
    ],
  },

  // EVENTO 2: Viagem Familiar
  {
    id: 'family_trip',
    title: '🐴 Viagem para a Cidade',
    description: 'Seus pais vão à cidade vizinha para o mercado. Você pode ir?',
    minAge: 4,
    maxAge: 11,
    chance: 0.12,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ir animado',
        preview: 'Sem mudanças',
        result: {
          message: 'Você se divertiu vendo as barracas e pessoas diferentes!',
        },
      },
      {
        text: 'Fazer birra e não ir',
        preview: 'Sem mudanças',
        result: {
          message: 'Você ficou em casa emburrado enquanto seus pais saíram.',
        },
      },
      {
        text: 'Ir mas ficar entediado',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi chato. Você só viu adultos conversando.',
        },
      },
    ],
  },

  // EVENTO 3: Briga com Irmão
  {
    id: 'sibling_fight',
    title: '😠 Briga com Irmão',
    description: 'Seu irmão pegou seu brinquedo favorito sem pedir!',
    minAge: 4,
    maxAge: 10,
    chance: 0.18,
    category: 'family',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Bater nele',
        preview: '🛡️ -10 Honra | 💪 +5 Força',
        result: {
          message: 'Vocês brigaram. Seu pai te repreendeu por usar violência.',
          honorChange: -10,
          strengthChange: 5,
        },
      },
      {
        text: 'Contar para os pais',
        preview: '🛡️ +5 Honra',
        result: {
          message: 'Seus pais obrigaram ele a devolver.',
          honorChange: 5,
        },
      },
      {
        text: 'Deixar pra lá',
        preview: 'Sem mudanças',
        result: {
          message: 'Você decidiu ser a pessoa maior e ignorar.',
        },
      },
    ],
  },

  // EVENTO 4: Jantar em Família
  {
    id: 'family_dinner',
    title: '🍲 Jantar Especial',
    description: 'Sua mãe preparou um ensopado especial. Todos estão à mesa.',
    minAge: 3,
    maxAge: 12,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Comer tudo',
        preview: 'Sem mudanças',
        result: {
          message: 'Estava delicioso! Você limpou o prato.',
        },
      },
      {
        text: 'Reclamar da comida',
        preview: 'Sem mudanças',
        result: {
          message: 'Seu pai te repreendeu. "Seja grato pelo que tem!"',
        },
      },
    ],
  },

  // EVENTO 5: Orfandade
  {
    id: 'parents_die',
    title: '💀 Tragédia Familiar',
    description: 'Seus pais morreram de peste. Você está sozinho.',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ir morar com tio',
        preview: '🛡️ -10 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você foi acolhido por um tio distante. Ele te trata como servo.',
          honorChange: -10,
          healthChange: -10,
          setFlags: { isOrphan: true, livingWith: 'relative' },
        },
      },
      {
        text: 'Tentar sobreviver sozinho',
        preview: '🛡️ -30 Honra | 💪 +15 Força | ❤️ -20 Vitalidade',
        result: {
          message: 'Você vive nas ruas, roubando e mendigando.',
          honorChange: -30,
          strengthChange: 15,
          healthChange: -20,
          addTrait: 'Órfão das Ruas',
          setFlags: { isOrphan: true, livingWith: 'alone' },
        },
      },
    ],
  },

  // EVENTO 6: Pai Ensina Ofício
  {
    id: 'father_teaches',
    title: '🔨 Pai Te Ensina',
    description: 'Seu pai quer te ensinar o ofício dele.',
    minAge: 7,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { gender: 'male' },
    options: [
      {
        text: 'Aprender com atenção',
        preview: '💪 +10 Força',
        result: {
          message: 'Você aprendeu muito! Seu pai está orgulhoso.',
          strengthChange: 10,
        },
      },
      {
        text: 'Ficar desinteressado',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai ficou desapontado com você.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 7: Mãe Ensina Tarefas
  {
    id: 'mother_teaches',
    title: '🧵 Mãe Te Ensina',
    description: 'Sua mãe quer te ensinar a costurar e cozinhar.',
    minAge: 6,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { gender: 'female' },
    options: [
      {
        text: 'Aprender com dedicação',
        preview: 'Sem mudanças',
        result: {
          message: 'Você se tornou habilidosa! Sua mãe está orgulhosa.',
        },
      },
      {
        text: 'Preferir brincar lá fora',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Sua mãe te repreendeu. "Isso não é comportamento de menina!"',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 8: Visita de Parentes
  {
    id: 'relatives_visit',
    title: '👥 Visita de Parentes',
    description: 'Seus tios vieram visitar. A casa está cheia!',
    minAge: 3,
    maxAge: 12,
    chance: 0.12,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Brincar com os primos',
        preview: 'Sem mudanças',
        result: {
          message: 'Vocês se divertiram muito juntos!',
        },
      },
      {
        text: 'Ficar tímido e quieto',
        preview: 'Sem mudanças',
        result: {
          message: 'Você ficou no canto observando tudo.',
        },
      },
    ],
  },

  // EVENTO 9: Pai Bêbado
  {
    id: 'drunk_father',
    title: '🍺 Pai Bêbado',
    description: 'Seu pai voltou da taverna bêbado e violento.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { maxMoney: 50 },
    options: [
      {
        text: 'Esconder no quarto',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Você se escondeu até ele desmaiar. Sua mãe chorou a noite toda.',
          healthChange: -10,
        },
      },
      {
        text: 'Tentar acalmá-lo',
        preview: '❤️ -20 Vitalidade | 🛡️ +10 Honra',
        result: {
          message: 'Você tentou, mas ele te empurrou. Pelo menos sua mãe ficou grata.',
          healthChange: -20,
          honorChange: 10,
        },
      },
    ],
  },

  // EVENTO 10: Aniversário Simples
  {
    id: 'birthday_celebration',
    title: '🎂 Seu Aniversário',
    description: 'É seu aniversário! Sua família preparou uma pequena celebração.',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ficar muito feliz',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi um dia especial! Sua mãe fez um bolo.',
        },
      },
      {
        text: 'Ficar desapontado',
        preview: 'Sem mudanças',
        result: {
          message: 'Você esperava mais, mas sua família é pobre.',
        },
      },
    ],
  },

  // EVENTO 11: Mãe Doente
  {
    id: 'mother_sick',
    title: '🤒 Mãe Adoeceu',
    description: 'Sua mãe está muito doente. Você precisa cuidar da casa.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'family',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Cuidar dela com carinho',
        preview: '🛡️ +15 Honra | 💪 +5 Força',
        result: {
          message: 'Você fez tudo sozinho. Ela se recuperou e está orgulhosa.',
          honorChange: 15,
          strengthChange: 5,
        },
      },
      {
        text: 'Reclamar do trabalho',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você reclamou muito. Seu pai te repreendeu.',
          honorChange: -15,
        },
      },
    ],
  },

  // EVENTO 12: Herança Pequena
  {
    id: 'small_inheritance',
    title: '💰 Herança Inesperada',
    description: 'Um tio distante morreu e deixou algumas moedas para sua família.',
    minAge: 5,
    maxAge: 12,
    chance: 0.05,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ficar feliz',
        preview: '💰 +20',
        result: {
          message: 'Sua família está mais aliviada financeiramente!',
          moneyChange: 20,
        },
      },
    ],
  },

  // EVENTO 13: Casamento na Família
  {
    id: 'family_wedding',
    title: '💒 Casamento de Irmã',
    description: 'Sua irmã mais velha está se casando. Há uma festa!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Dançar e se divertir',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi uma festa maravilhosa! Você comeu bem e dançou.',
        },
      },
      {
        text: 'Ficar entediado',
        preview: 'Sem mudanças',
        result: {
          message: 'Você achou tudo muito chato e demorado.',
        },
      },
    ],
  },

  // EVENTO 14: Morte de Avô
  {
    id: 'grandparent_death',
    title: '⚰️ Morte do Avô',
    description: 'Seu avô faleceu. A família está de luto.',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Chorar muito',
        preview: '⛪ +10 Fé',
        result: {
          message: 'Você estava muito próximo dele. A dor é grande.',
          faithChange: 10,
        },
      },
      {
        text: 'Não sentir muito',
        preview: 'Sem mudanças',
        result: {
          message: 'Você mal conhecia ele. A vida continua.',
        },
      },
    ],
  },

  // EVENTO 15: Família Passa Fome
  {
    id: 'family_hunger',
    title: '🍖 Família com Fome',
    description: 'A colheita foi ruim. Sua família está passando fome.',
    minAge: 5,
    maxAge: 12,
    chance: 0.15,
    category: 'danger',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { maxMoney: 30 },
    options: [
      {
        text: 'Dar sua comida para irmãos',
        preview: '🛡️ +20 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você sacrificou sua porção. Seus pais ficaram comovidos.',
          honorChange: 20,
          healthChange: -15,
        },
      },
      {
        text: 'Comer escondido',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você escondeu comida para você. Sua mãe descobriu e chorou.',
          honorChange: -20,
        },
      },
    ],
  },

  // ==========================================
  // CATEGORIA: EDUCAÇÃO (10 eventos)
  // ==========================================

  // EVENTO 16: Aprender a Ler
  {
    id: 'learn_to_read',
    title: '📖 Primeiras Letras',
    description: 'O padre local está ensinando as crianças a ler.',
    minAge: 7,
    maxAge: 10,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ir às aulas',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você aprendeu o alfabeto! É um privilégio raro.',
          faithChange: 15,
        },
      },
      {
        text: 'Não ter interesse',
        preview: 'Sem mudanças',
        result: {
          message: 'Você preferiu brincar. A maioria das pessoas não sabe ler mesmo.',
        },
      },
    ],
  },

  // EVENTO 17: Primeira Missa
  {
    id: 'first_mass',
    title: '⛪ Primeira Missa',
    description: 'É a primeira vez que você vai à missa dominical sozinho.',
    minAge: 5,
    maxAge: 8,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Prestar atenção',
        preview: '⛪ +10 Fé',
        result: {
          message: 'Você ficou fascinado com o sermão do padre.',
          faithChange: 10,
        },
      },
      {
        text: 'Dormir no banco',
        preview: '⛪ -5 Fé',
        result: {
          message: 'Era muito chato e longo. Você cochilou.',
          faithChange: -5,
        },
      },
    ],
  },

  // EVENTO 18: Contar Histórias
  {
    id: 'storytelling',
    title: '📚 Histórias à Noite',
    description: 'Seu avô está contando histórias de cavaleiros e dragões.',
    minAge: 4,
    maxAge: 10,
    chance: 0.12,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Ouvir fascinado',
        preview: 'Sem mudanças',
        result: {
          message: 'Foram histórias incríveis! Você sonhou com aventuras.',
        },
      },
      {
        text: 'Adormecer no meio',
        preview: 'Sem mudanças',
        result: {
          message: 'Estava cansado demais para prestar atenção.',
        },
      },
    ],
  },

  // EVENTO 19: Aprender Números
  {
    id: 'learn_counting',
    title: '🔢 Contando',
    description: 'Seu pai está te ensinando a contar moedas.',
    minAge: 6,
    maxAge: 9,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Aprender rápido',
        preview: 'Sem mudanças',
        result: {
          message: 'Você aprendeu! Agora sabe contar até 20.',
        },
      },
      {
        text: 'Ter dificuldade',
        preview: 'Sem mudanças',
        result: {
          message: 'É muito confuso. Os números se misturam na sua cabeça.',
        },
      },
    ],
  },

  // EVENTO 20: Catecismo
  {
    id: 'catechism',
    title: '✝️ Aulas de Catecismo',
    description: 'O padre está ensinando os mandamentos e orações.',
    minAge: 7,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Decorar tudo',
        preview: '⛪ +20 Fé',
        result: {
          message: 'Você memorizou todas as orações perfeitamente!',
          faithChange: 20,
        },
      },
      {
        text: 'Apenas fingir',
        preview: '⛪ -10 Fé',
        result: {
          message: 'Você só mexia os lábios. Deus sabe.',
          faithChange: -10,
        },
      },
    ],
  },

  // EVENTO 21: Aprendendo Ofício do Vizinho
  {
    id: 'neighbor_craft',
    title: '🔧 Vizinho Te Ensina',
    description: 'O ferreiro vizinho ofereceu te ensinar algumas coisas.',
    minAge: 8,
    maxAge: 11,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { gender: 'male' },
    options: [
      {
        text: 'Aceitar animado',
        preview: '💪 +10 Força',
        result: {
          message: 'Você aprendeu a martelar e forjar!',
          strengthChange: 10,
        },
      },
      {
        text: 'Recusar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você não quis. O vizinho ficou desapontado.',
        },
      },
    ],
  },

  // EVENTO 22: Memorizar Salmo
  {
    id: 'memorize_psalm',
    title: '📿 Salmo 23',
    description: 'O padre pediu para você decorar o Salmo 23.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'education',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Decorar perfeitamente',
        preview: '⛪ +15 Fé | 🛡️ +10 Honra',
        result: {
          message: 'Você recitou na frente de todos! O padre te elogiou.',
          faithChange: 15,
          honorChange: 10,
        },
      },
      {
        text: 'Esquecer na hora',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você travou. Foi muito constrangedor.',
          honorChange: -15,
        },
      },
    ],
  },

  // EVENTO 23: Observar Artesão
  {
    id: 'watch_craftsman',
    title: '👀 Observando Mestre',
    description: 'Você passou o dia vendo um carpinteiro trabalhar.',
    minAge: 7,
    maxAge: 11,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Aprender observando',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi fascinante ver a madeira se transformar!',
        },
      },
      {
        text: 'Achar entediante',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi chato. Você preferiu ir brincar.',
        },
      },
    ],
  },

  // EVENTO 24: Primeira Confissão
  {
    id: 'first_confession',
    title: '🙏 Primeira Confissão',
    description: 'É hora da sua primeira confissão com o padre.',
    minAge: 7,
    maxAge: 9,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Confessar tudo',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você se sentiu aliviado após confessar seus pecados.',
          faithChange: 15,
        },
      },
      {
        text: 'Esconder alguns pecados',
        preview: '⛪ -10 Fé',
        result: {
          message: 'Você mentiu para Deus. Isso pesa na consciência.',
          faithChange: -10,
        },
      },
    ],
  },

  // EVENTO 25: Lição de Etiqueta
  {
    id: 'etiquette_lesson',
    title: '🎩 Boas Maneiras',
    description: 'Sua mãe está te ensinando como se comportar à mesa.',
    minAge: 6,
    maxAge: 10,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { minMoney: 50 },
    options: [
      {
        text: 'Aprender direitinho',
        preview: 'Sem mudanças',
        result: {
          message: 'Você aprendeu a comer como gente de bem.',
        },
      },
      {
        text: 'Achar besteira',
        preview: 'Sem mudanças',
        result: {
          message: 'Você continua comendo com as mãos como sempre.',
        },
      },
    ],
  },

  // ==========================================
  // CATEGORIA: LAZER (12 eventos)
  // ==========================================

  // EVENTO 26: Brincar com Amigos
  {
    id: 'play_with_friends',
    title: '⚽ Brincando na Rua',
    description: 'Você e seus amigos estão brincando de "pega-pega" na praça.',
    minAge: 5,
    maxAge: 11,
    chance: 0.2,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Se divertir muito',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi um dia ótimo! Vocês correram até cansar.',
        },
      },
      {
        text: 'Brigar com amigo',
        preview: 'Sem mudanças',
        result: {
          message: 'Você discutiu sobre as regras. Ficaram emburrados.',
        },
      },
    ],
  },

  // EVENTO 27: Feira da Vila
  {
    id: 'village_fair',
    title: '🎪 Feira Anual',
    description: 'É dia da feira anual! Há malabaristas, músicos e comida!',
    minAge: 4,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ver os malabaristas',
        preview: 'Sem mudanças',
        result: {
          message: 'Incrível! Eles jogavam facas no ar!',
        },
      },
      {
        text: 'Comer doces',
        preview: '💰 -2',
        result: {
          message: 'Você gastou suas moedas em doces deliciosos!',
          moneyChange: -2,
        },
      },
      {
        text: 'Só observar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você não tinha dinheiro, mas foi divertido ver.',
        },
      },
    ],
  },

  // EVENTO 28: Encontrar Animal
  {
    id: 'find_animal',
    title: '🐕 Cachorro Perdido',
    description: 'Você encontrou um cachorro magro e abandonado.',
    minAge: 5,
    maxAge: 11,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Levar para casa',
        preview: '🍖 -1 Comida',
        result: {
          message: 'Seus pais deixaram você ficar com ele! Terá que dividir comida.',
          foodChange: -1,
        },
      },
      {
        text: 'Dar comida e ir embora',
        preview: '🍖 -1 Comida | 🛡️ +5 Honra',
        result: {
          message: 'Você ajudou, mas não pode levá-lo.',
          foodChange: -1,
          honorChange: 5,
        },
      },
      {
        text: 'Ignorar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você seguiu seu caminho.',
        },
      },
    ],
  },

  // EVENTO 29: Competição Infantil
  {
    id: 'children_competition',
    title: '🏃 Corrida das Crianças',
    description: 'As crianças da vila estão fazendo uma corrida!',
    minAge: 6,
    maxAge: 11,
    chance: 0.12,
    category: 'leisure',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Participar e ganhar',
        preview: '🛡️ +15 Honra | 💪 +5 Força',
        result: {
          message: 'Você venceu! Todos te aplaudiram!',
          honorChange: 15,
          strengthChange: 5,
        },
      },
      {
        text: 'Participar e perder',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Você tentou, mas não foi rápido o suficiente.',
          honorChange: -5,
        },
      },
      {
        text: 'Não participar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você preferiu apenas assistir.',
        },
      },
    ],
  },

  // EVENTO 30: Nadar no Rio
  {
    id: 'swim_in_river',
    title: '🏊 Nadar no Rio',
    description: 'É um dia quente. Seus amigos querem nadar no rio.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'leisure',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Nadar e se divertir',
        preview: '💪 +5 Força',
        result: {
          message: 'A água estava refrescante! Vocês nadaram por horas.',
          strengthChange: 5,
        },
      },
      {
        text: 'Quase se afogar',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'A correnteza era forte! Você quase se afogou mas foi salvo.',
          healthChange: -20,
        },
      },
      {
        text: 'Ter medo e não ir',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seus amigos te chamaram de covarde.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 31: Festa de São João
  {
    id: 'saint_john_festival',
    title: '🔥 Festa de São João',
    description: 'É a Festa de São João! Há fogueira, música e dança!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Dançar ao redor da fogueira',
        preview: '⛪ +10 Fé',
        result: {
          message: 'Foi mágico! Você dançou até tarde.',
          faithChange: 10,
        },
      },
      {
        text: 'Comer e beber',
        preview: 'Sem mudanças',
        result: {
          message: 'A comida estava deliciosa!',
        },
      },
    ],
  },

  // EVENTO 32: Fazer Boneco de Palha
  {
    id: 'make_scarecrow',
    title: '🌾 Boneco de Palha',
    description: 'Você e seus irmãos estão fazendo um espantalho para o campo.',
    minAge: 6,
    maxAge: 11,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    options: [
      {
        text: 'Fazer com capricho',
        preview: 'Sem mudanças',
        result: {
          message: 'Ficou ótimo! Seu pai elogiou o trabalho.',
        },
      },
      {
        text: 'Fazer mal feito',
        preview: 'Sem mudanças',
        result: {
          message: 'Você não se esforçou muito. Caiu no primeiro vento.',
        },
      },
    ],
  },

  // EVENTO 33: Subir em Árvore
  {
    id: 'climb_tree',
    title: '🌳 Subir na Árvore',
    description: 'Seus amigos te desafiaram a subir na árvore mais alta.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'leisure',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Subir com sucesso',
        preview: '🛡️ +10 Honra | 💪 +5 Força',
        result: {
          message: 'Você subiu até o topo! A vista era incrível!',
          honorChange: 10,
          strengthChange: 5,
        },
      },
      {
        text: 'Cair e se machucar',
        preview: '❤️ -15 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Você escorregou e caiu! Torceu o tornozelo.',
          healthChange: -15,
          honorChange: -10,
        },
      },
      {
        text: 'Recusar o desafio',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você teve medo. Seus amigos riram.',
          honorChange: -15,
        },
      },
    ],
  },

  // EVENTO 34: Encontrar Moeda
  {
    id: 'find_coin',
    title: '💰 Moeda Perdida',
    description: 'Você encontrou uma moeda no chão!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ficar com ela',
        preview: '💰 +3',
        result: {
          message: 'É sua agora! Você guardou bem.',
          moneyChange: 3,
        },
      },
      {
        text: 'Procurar o dono',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você foi honesto. O dono te agradeceu.',
          honorChange: 10,
        },
      },
    ],
  },

  // EVENTO 35: Brincar de Cavaleiro
  {
    id: 'play_knight',
    title: '⚔️ Cavaleiros e Dragões',
    description: 'Você e seus amigos estão brincando de cavaleiros!',
    minAge: 5,
    maxAge: 10,
    chance: 0.15,
    category: 'neutral',
    requiredEra: ['tudor'],
    conditions: { gender: 'male' },
    options: [
      {
        text: 'Ser o cavaleiro',
        preview: 'Sem mudanças',
        result: {
          message: 'Você salvou a princesa do dragão!',
        },
      },
      {
        text: 'Ser o dragão',
        preview: 'Sem mudanças',
        result: {
          message: 'Você rugiu alto e assustou todos!',
        },
      },
    ],
  },

  // EVENTO 36: Procissão Religiosa
  {
    id: 'religious_procession',
    title: '⛪ Procissão',
    description: 'Há uma procissão religiosa passando pela vila!',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Participar devotamente',
        preview: '⛪ +10 Fé',
        result: {
          message: 'Você rezou com fervor. Foi emocionante.',
          faithChange: 10,
        },
      },
      {
        text: 'Apenas assistir',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi interessante ver toda a pompa.',
        },
      },
    ],
  },

  // EVENTO 37: Construir Fortaleza
  {
    id: 'build_fort',
    title: '🏰 Fortaleza de Madeira',
    description: 'Você e seus amigos estão construindo uma fortaleza!',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Liderar a construção',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você organizou tudo! Seus amigos te elegeram líder.',
          honorChange: 10,
        },
      },
      {
        text: 'Apenas ajudar',
        preview: 'Sem mudanças',
        result: {
          message: 'Vocês trabalharam juntos. Ficou legal!',
        },
      },
    ],
  },

  // ==========================================
  // CATEGORIA: PERIGOS (8 eventos)
  // ==========================================

  // EVENTO 38: Febre Alta
  {
    id: 'high_fever',
    title: '🤒 Febre Perigosa',
    description: 'Você está com febre alta e delirando.',
    minAge: 0,
    maxAge: 12,
    chance: 0.15,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Chamar curandeiro',
        preview: '❤️ -15 Vitalidade | 💰 -10',
        result: {
          message: 'O curandeiro fez sangrias. Você sobreviveu, mas está fraco.',
          healthChange: -15,
          moneyChange: -10,
        },
      },
      {
        text: 'Rezar e esperar',
        preview: '❤️ -10 Vitalidade | ⛪ +10 Fé',
        result: {
          message: 'A febre passou com orações. Foi um milagre.',
          healthChange: -10,
          faithChange: 10,
        },
      },
    ],
  },

  // EVENTO 39: Acidente com Fogo
  {
    id: 'fire_accident',
    title: '🔥 Queimadura',
    description: 'Você se queimou ao se aproximar da lareira!',
    minAge: 2,
    maxAge: 8,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Gritar por ajuda',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Sua mãe te socorreu rápido. Queimadura leve.',
          healthChange: -10,
        },
      },
      {
        text: 'Demorar para pedir ajuda',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'A queimadura foi séria. Ficará cicatriz.',
          healthChange: -25,
          addTrait: 'Cicatriz de Queimadura',
        },
      },
    ],
  },

  // EVENTO 40: Cair do Telhado
  {
    id: 'fall_from_roof',
    title: '🏠 Queda do Telhado',
    description: 'Você subiu no telhado e escorregou!',
    minAge: 6,
    maxAge: 11,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Cair e quebrar braço',
        preview: '❤️ -30 Vitalidade | 💪 -10 Força',
        result: {
          message: 'Você caiu e quebrou o braço! Doeu muito.',
          healthChange: -30,
          strengthChange: -10,
        },
      },
    ],
  },

  // EVENTO 41: Mordida de Cachorro
  {
    id: 'dog_bite',
    title: '🐕 Cachorro Raivoso',
    description: 'Um cachorro te mordeu!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Tratar o ferimento',
        preview: '❤️ -15 Vitalidade | 💰 -5',
        result: {
          message: 'Você lavou e enfaixou. Vai ficar bem.',
          healthChange: -15,
          moneyChange: -5,
        },
      },
      {
        text: 'Ignorar',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'O ferimento infeccionou. Foi pior.',
          healthChange: -25,
        },
      },
    ],
  },

  // EVENTO 42: Quase Se Afogar
  {
    id: 'almost_drown',
    title: '🌊 Afogamento',
    description: 'Você caiu no poço e está se afogando!',
    minAge: 3,
    maxAge: 9,
    chance: 0.06,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ser resgatado',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Alguém te puxou para fora! Você cuspiu muita água.',
          healthChange: -20,
        },
      },
    ],
  },

  // EVENTO 43: Corte Profundo
  {
    id: 'deep_cut',
    title: '🔪 Corte Grave',
    description: 'Você se cortou profundamente com uma faca!',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Cauterizar',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Doeu absurdamente, mas parou de sangrar.',
          healthChange: -20,
        },
      },
      {
        text: 'Apenas enfaixar',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você enfaixou apertado. Vai deixar cicatriz.',
          healthChange: -15,
        },
      },
    ],
  },

  // EVENTO 44: Pisar em Prego
  {
    id: 'step_on_nail',
    title: '📌 Prego Enferrujado',
    description: 'Você pisou em um prego enferrujado!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Lavar bem',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Doeu muito, mas você limpou direito.',
          healthChange: -10,
        },
      },
      {
        text: 'Não fazer nada',
        preview: '❤️ -25 Vitalidade | ☠️ Risco de tétano',
        result: {
          message: 'O ferimento infeccionou gravemente.',
          healthChange: -25,
        },
      },
    ],
  },

  // EVENTO 45: Intoxicação Alimentar
  {
    id: 'food_poisoning',
    title: '🤢 Comida Estragada',
    description: 'Você comeu algo estragado e está muito doente!',
    minAge: 3,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Vomitar tudo',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você vomitou por horas. Foi horrível.',
          healthChange: -15,
        },
      },
    ],
  },

  // ==========================================
  // CATEGORIA: COMUNIDADE (8 eventos)
  // ==========================================

  // EVENTO 46: Ajudar Vizinho
  {
    id: 'help_neighbor',
    title: '🤝 Vizinho Precisa de Ajuda',
    description: 'Seu vizinho idoso precisa de ajuda para carregar lenha.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ajudar com prazer',
        preview: '🛡️ +15 Honra | 💪 +5 Força',
        result: {
          message: 'Ele ficou muito grato! Te deu algumas moedas.',
          honorChange: 15,
          strengthChange: 5,
          moneyChange: 2,
        },
      },
      {
        text: 'Fingir não ver',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você passou direto. Ele ficou desapontado.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 47: Roubo na Vila
  {
    id: 'village_theft',
    title: '🕵️ Ladrão na Vila',
    description: 'Alguém roubou o pão do padeiro! Você sabe quem foi.',
    minAge: 7,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Denunciar',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'O ladrão foi punido. O padeiro te agradeceu.',
          honorChange: 10,
        },
      },
      {
        text: 'Ficar quieto',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você não quis se envolver.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 48: Mendigo Pede Esmola
  {
    id: 'beggar_asks',
    title: '🙏 Mendigo na Porta',
    description: 'Um mendigo está pedindo esmola na porta da igreja.',
    minAge: 6,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Dar suas moedas',
        preview: '💰 -2 | 🛡️ +10 Honra | ⛪ +10 Fé',
        result: {
          message: 'Ele te abençoou. Você fez uma boa ação.',
          moneyChange: -2,
          honorChange: 10,
          faithChange: 10,
        },
      },
      {
        text: 'Ignorar',
        preview: '⛪ -5 Fé',
        result: {
          message: 'Você passou direto.',
          faithChange: -5,
        },
      },
    ],
  },

  // EVENTO 49: Criança Nova na Vila
  {
    id: 'new_kid_village',
    title: '🆕 Criança Nova',
    description: 'Uma família nova chegou na vila. Há uma criança da sua idade.',
    minAge: 5,
    maxAge: 11,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Fazer amizade',
        preview: '🛡️ +5 Honra',
        result: {
          message: 'Você ganhou um novo amigo!',
          honorChange: 5,
        },
      },
      {
        text: 'Ser hostil',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você foi mal-educado. Todos te repreenderam.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 50: Trabalho Comunitário
  {
    id: 'community_work',
    title: '🏘️ Mutirão da Vila',
    description: 'A vila está organizando um mutirão para consertar a ponte.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Participar',
        preview: '🛡️ +15 Honra | 💪 +10 Força',
        result: {
          message: 'Você trabalhou duro! Todos reconheceram seu esforço.',
          honorChange: 15,
          strengthChange: 10,
        },
      },
      {
        text: 'Não ir',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você foi o único que não ajudou. Perdeu respeito.',
          honorChange: -15,
        },
      },
    ],
  },

  // EVENTO 51: Incêndio na Vila
  {
    id: 'village_fire',
    title: '🔥 Incêndio!',
    description: 'Uma casa está pegando fogo! Todos estão ajudando.',
    minAge: 9,
    maxAge: 12,
    chance: 0.06,
    category: 'community',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ajudar a apagar',
        preview: '🛡️ +20 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você foi corajoso! Ajudou a salvar a casa.',
          honorChange: 20,
          healthChange: -15,
        },
      },
      {
        text: 'Apenas observar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você ficou de fora enquanto outros arriscavam a vida.',
          honorChange: -10,
        },
      },
    ],
  },

  // EVENTO 52: Peregrino Passa
  {
    id: 'pilgrim_passes',
    title: '⛪ Peregrino',
    description: 'Um peregrino está passando pela vila contando histórias de Jerusalém.',
    minAge: 6,
    maxAge: 12,
    chance: 0.08,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Ouvir fascinado',
        preview: '⛪ +10 Fé',
        result: {
          message: 'As histórias da Terra Santa te encheram de fé!',
          faithChange: 10,
        },
      },
      {
        text: 'Não dar atenção',
        preview: 'Sem mudanças',
        result: {
          message: 'Você achou chato.',
        },
      },
    ],
  },

  // EVENTO 53: Festa de Colheita
  {
    id: 'harvest_festival',
    title: '🌾 Festa da Colheita',
    description: 'A colheita foi boa! A vila está celebrando!',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    options: [
      {
        text: 'Dançar e festejar',
        preview: 'Sem mudanças',
        result: {
          message: 'Foi uma noite maravilhosa! Houve muita comida.',
        },
      },
      {
        text: 'Comer até passar mal',
        preview: '❤️ -5 Vitalidade',
        result: {
          message: 'Você exagerou. Passou mal depois.',
          healthChange: -5,
        },
      },
    ],
  },
];

/**
 * Retorna um evento de infância apropriado
 * Agora com verificação de narrative flags para nexo
 */
export function getChildhoodEventEngland(character: Character): ChildhoodEvent | null {
  const availableEvents = CHILDHOOD_EVENTS_ENGLAND.filter((event) => {
    // Idade
    if (character.age < event.minAge || character.age > event.maxAge) return false;
    
    // Era
    if (!event.requiredEra.includes(character.era)) return false;
    
    // Narrative Flags
    if (event.requiresFlags) {
      if (event.requiresFlags.isOrphan !== undefined) {
        if (event.requiresFlags.isOrphan !== character.narrativeFlags.isOrphan) return false;
      }
      if (event.requiresFlags.livingWith) {
        if (!event.requiresFlags.livingWith.includes(character.narrativeFlags.livingWith)) return false;
      }
    }
    
    // Condições
    if (event.conditions) {
      const { minMoney, maxMoney, gender, socialClasses } = event.conditions;
      if (minMoney && character.money < minMoney) return false;
      if (maxMoney && character.money > maxMoney) return false;
      if (gender && character.gender !== gender) return false;
      if (socialClasses && !socialClasses.includes(character.socialClass)) return false;
    }
    
    // Evitar repetir o último evento importante
    if (character.narrativeFlags.lastMajorEvent === event.id) return false;
    
    return true;
  });

  if (availableEvents.length === 0) return null;

  // Rola o dado
  for (const event of availableEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }

  return null;
}
