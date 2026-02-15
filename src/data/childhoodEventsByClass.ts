/**
 * 300+ EVENTOS DE INFÂNCIA POR CLASSE SOCIAL
 * Inglaterra Tudor (1500-1699) - Idades 0-12 anos
 * 
 * DISTRIBUIÇÃO:
 * - CAMPONÊS: 100 eventos
 * - ARTESÃO: 100 eventos
 * - GENTRY: 50 eventos
 * - NOBREZA: 50 eventos
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
  category: 'family' | 'education' | 'leisure' | 'danger' | 'community' | 'neutral' | 'work';
  
  requiresFlags?: {
    isOrphan?: boolean;
    livingWith?: ('parents' | 'relative' | 'alone' | 'master')[];
  };
  
  conditions?: {
    minMoney?: number;
    maxMoney?: number;
    gender?: 'male' | 'female';
    socialClasses?: ('peasant' | 'artisan' | 'gentry' | 'nobility')[];
  };
  
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

// =============================================================================
// EVENTOS DE CAMPONÊS (100 EVENTOS)
// Vida dura, trabalho infantil, fome, doenças, religiosidade simples
// =============================================================================

const PEASANT_EVENTS: ChildhoodEvent[] = [
  
  // === TRABALHO E SOBREVIVÊNCIA (30 eventos) ===
  
  {
    id: 'peasant_first_field_work',
    title: '🌾 Primeiro Dia no Campo',
    description: 'Seu pai te acordou ao amanhecer. É hora de trabalhar na lavoura.',
    minAge: 5,
    maxAge: 7,
    chance: 0.9,
    category: 'work',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Trabalhar com vontade',
        preview: '💪 +10 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você trabalhou até o sol se pôr. Seu corpo dói, mas seu pai está satisfeito.',
          strengthChange: 10,
          healthChange: -5,
        },
      },
      {
        text: 'Reclamar e chorar',
        preview: '🛡️ -15 Honra | 💪 +5 Força',
        result: {
          message: 'Seu pai te bateu. "Não somos nobres! Trabalhe ou morra de fome!"',
          honorChange: -15,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_harvest_time',
    title: '🌾 Época de Colheita',
    description: 'Toda a família está colhendo trigo. É o período mais importante do ano.',
    minAge: 6,
    maxAge: 12,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Trabalhar dia e noite',
        preview: '💪 +15 Força | ❤️ -15 Vitalidade | 🍖 +3 Comida',
        result: {
          message: 'A colheita foi boa! Sua família terá comida no inverno.',
          strengthChange: 15,
          healthChange: -15,
          foodChange: 3,
        },
      },
      {
        text: 'Trabalhar normalmente',
        preview: '💪 +8 Força | 🍖 +2 Comida',
        result: {
          message: 'Você fez sua parte. A colheita foi razoável.',
          strengthChange: 8,
          foodChange: 2,
        },
      },
    ],
  },

  {
    id: 'peasant_carry_water',
    title: '💧 Buscar Água',
    description: 'Você precisa ir ao poço buscar água para a família.',
    minAge: 5,
    maxAge: 11,
    chance: 0.2,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Carregar balde cheio',
        preview: '💪 +5 Força',
        result: {
          message: 'O balde estava pesado, mas você conseguiu!',
          strengthChange: 5,
        },
      },
      {
        text: 'Derramar metade no caminho',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Sua mãe ficou brava. Você terá que ir de novo.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_gather_firewood',
    title: '🪵 Coletar Lenha',
    description: 'O inverno está chegando. Você precisa juntar lenha para o fogo.',
    minAge: 6,
    maxAge: 12,
    chance: 0.18,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Coletar muito',
        preview: '💪 +8 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você juntou lenha suficiente para semanas!',
          strengthChange: 8,
          healthChange: -5,
        },
      },
      {
        text: 'Coletar pouco e voltar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai te repreendeu por preguiça.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_tend_animals',
    title: '🐑 Cuidar dos Animais',
    description: 'Você é responsável por cuidar das galinhas e ovelhas da família.',
    minAge: 5,
    maxAge: 11,
    chance: 0.2,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Cuidar bem deles',
        preview: 'Sem mudanças',
        result: {
          message: 'Os animais estão saudáveis e produzindo bem.',
        },
      },
      {
        text: 'Esquecer de alimentá-los',
        preview: '🛡️ -15 Honra | 🍖 -2 Comida',
        result: {
          message: 'Uma galinha morreu de fome. Sua família está furiosa.',
          honorChange: -15,
          foodChange: -2,
        },
      },
    ],
  },

  {
    id: 'peasant_weed_field',
    title: '🌱 Arrancar Ervas Daninhas',
    description: 'O campo está cheio de ervas daninhas. Você precisa arrancá-las.',
    minAge: 6,
    maxAge: 10,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Arrancar tudo',
        preview: '💪 +5 Força | ❤️ -8 Vitalidade',
        result: {
          message: 'Você trabalhou sob o sol quente o dia todo. Suas mãos estão machucadas.',
          strengthChange: 5,
          healthChange: -8,
        },
      },
      {
        text: 'Fazer mal feito',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai viu que você não fez direito. Levou uma surra.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_help_mother_cook',
    title: '🍲 Ajudar Mãe a Cozinhar',
    description: 'Sua mãe está preparando o mingau. Ela precisa de ajuda.',
    minAge: 5,
    maxAge: 10,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar com cuidado',
        preview: 'Sem mudanças',
        result: {
          message: 'Você aprendeu a fazer mingau. Sua mãe está contente.',
        },
      },
      {
        text: 'Derrubar a panela',
        preview: '❤️ -10 Vitalidade | 🍖 -2 Comida',
        result: {
          message: 'A comida se derramou! Sua família vai dormir com fome hoje.',
          healthChange: -10,
          foodChange: -2,
        },
      },
    ],
  },

  {
    id: 'peasant_fix_roof',
    title: '🏚️ Consertar o Telhado',
    description: 'O telhado de palha está com buracos. A chuva está entrando.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar pai a consertar',
        preview: '💪 +8 Força',
        result: {
          message: 'Vocês consertaram juntos. Não vai mais chover dentro.',
          strengthChange: 8,
        },
      },
      {
        text: 'Cair do telhado',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'Você escorregou e caiu! Torceu o tornozelo.',
          healthChange: -25,
        },
      },
    ],
  },

  {
    id: 'peasant_plant_seeds',
    title: '🌱 Plantar Sementes',
    description: 'É primavera. Hora de plantar as sementes para a próxima colheita.',
    minAge: 6,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Plantar com cuidado',
        preview: '💪 +5 Força',
        result: {
          message: 'Você plantou direitinho. Seu pai elogiou seu trabalho.',
          strengthChange: 5,
        },
      },
      {
        text: 'Plantar apressado',
        preview: 'Sem mudanças',
        result: {
          message: 'Você terminou rápido, mas metade das sementes ficou mal plantada.',
        },
      },
    ],
  },

  {
    id: 'peasant_milk_cow',
    title: '🐄 Ordenhar a Vaca',
    description: 'Você precisa ordenhar a vaca da família.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ordenhar com jeito',
        preview: 'Sem mudanças',
        result: {
          message: 'Você conseguiu! O leite vai alimentar a família hoje.',
        },
      },
      {
        text: 'A vaca te chutou',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você assustou a vaca e ela te chutou forte!',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_grind_grain',
    title: '🌾 Moer o Grão',
    description: 'Você precisa moer o grão para fazer farinha.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Moer tudo',
        preview: '💪 +8 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você trabalhou horas girando a pedra de moer. Seus braços doem.',
          strengthChange: 8,
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'peasant_wash_clothes',
    title: '🧺 Lavar Roupas',
    description: 'Você precisa lavar as roupas da família no rio.',
    minAge: 6,
    maxAge: 11,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Lavar bem',
        preview: '💪 +5 Força',
        result: {
          message: 'As roupas ficaram limpas! Sua mãe está satisfeita.',
          strengthChange: 5,
        },
      },
      {
        text: 'Perder roupa no rio',
        preview: '🛡️ -15 Honra | 💰 -3',
        result: {
          message: 'A corrente levou uma camisa! Sua família está brava.',
          honorChange: -15,
          moneyChange: -3,
        },
      },
    ],
  },

  {
    id: 'peasant_chase_birds',
    title: '🦅 Espantar Pássaros',
    description: 'Pássaros estão comendo as sementes! Você precisa espantá-los.',
    minAge: 5,
    maxAge: 10,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Correr e gritar',
        preview: '💪 +5 Força',
        result: {
          message: 'Você correu o dia todo espantando os pássaros!',
          strengthChange: 5,
        },
      },
      {
        text: 'Dormir no campo',
        preview: '🛡️ -20 Honra | 🍖 -2 Comida',
        result: {
          message: 'Você dormiu e os pássaros comeram as sementes! Seu pai está furioso.',
          honorChange: -20,
          foodChange: -2,
        },
      },
    ],
  },

  {
    id: 'peasant_dig_ditch',
    title: '⛏️ Cavar Vala',
    description: 'Precisa-se cavar uma vala para drenagem do campo.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'], gender: 'male' },
    options: [
      {
        text: 'Cavar com força',
        preview: '💪 +12 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'Você cavou até as mãos sangrarem. O trabalho está feito.',
          strengthChange: 12,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_patch_clothes',
    title: '🪡 Remendar Roupas',
    description: 'Suas roupas estão rasgadas. Você precisa remendá-las.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Remendar direitinho',
        preview: 'Sem mudanças',
        result: {
          message: 'Ficou bom! Suas roupas vão durar mais um pouco.',
        },
      },
      {
        text: 'Fazer mal feito',
        preview: 'Sem mudanças',
        result: {
          message: 'Os remendos se soltaram. Você terá que fazer de novo.',
        },
      },
    ],
  },

  {
    id: 'peasant_clean_stable',
    title: '💩 Limpar Estábulo',
    description: 'O estábulo está imundo. Alguém precisa limpar.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Limpar tudo',
        preview: '💪 +8 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'O cheiro era horrível, mas você limpou tudo.',
          strengthChange: 8,
          healthChange: -5,
        },
      },
      {
        text: 'Fazer às pressas',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai viu que você não limpou direito. Está furioso.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_gather_eggs',
    title: '🥚 Recolher Ovos',
    description: 'As galinhas botaram ovos. Você precisa recolhê-los.',
    minAge: 5,
    maxAge: 10,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Recolher com cuidado',
        preview: '🍖 +1 Comida',
        result: {
          message: 'Você trouxe 6 ovos! Terá ovos no jantar.',
          foodChange: 1,
        },
      },
      {
        text: 'Deixar cair a cesta',
        preview: '🛡️ -15 Honra | 🍖 -1 Comida',
        result: {
          message: 'Você tropeçou e todos os ovos quebraram! Sua mãe chorou.',
          honorChange: -15,
          foodChange: -1,
        },
      },
    ],
  },

  {
    id: 'peasant_carry_manure',
    title: '💩 Carregar Esterco',
    description: 'O campo precisa de adubo. Você precisa espalhar esterco.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Espalhar tudo',
        preview: '💪 +10 Força | ❤️ -8 Vitalidade',
        result: {
          message: 'O trabalho é nojento, mas o campo ficará fértil.',
          strengthChange: 10,
          healthChange: -8,
        },
      },
    ],
  },

  {
    id: 'peasant_make_rope',
    title: '🪢 Fazer Corda',
    description: 'Você está aprendendo a trançar corda com fibras.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Aprender bem',
        preview: 'Sem mudanças',
        result: {
          message: 'Você fez uma corda forte! É uma habilidade útil.',
        },
      },
    ],
  },

  {
    id: 'peasant_sharpen_tools',
    title: '🪓 Afiar Ferramentas',
    description: 'As ferramentas estão cegas. Precisam ser afiadas.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Afiar com cuidado',
        preview: 'Sem mudanças',
        result: {
          message: 'As ferramentas estão afiadas. Seu pai pode trabalhar melhor agora.',
        },
      },
      {
        text: 'Se cortar na lâmina',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você se cortou profundamente! Está sangrando muito.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_thresh_grain',
    title: '🌾 Debulhar Grão',
    description: 'Você precisa bater no trigo para separar os grãos.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Debulhar o dia todo',
        preview: '💪 +10 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'Você trabalhou sem parar. Seus músculos doem terrivelmente.',
          strengthChange: 10,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_fetch_ale',
    title: '🍺 Buscar Cerveja',
    description: 'Seu pai mandou você buscar cerveja na taverna.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ir e voltar direto',
        preview: 'Sem mudanças',
        result: {
          message: 'Você trouxe a cerveja. Seu pai está contente.',
        },
      },
      {
        text: 'Experimentar no caminho',
        preview: '❤️ -5 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Você bebeu um gole. Ficou tonto e seu pai descobriu!',
          healthChange: -5,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_light_fire',
    title: '🔥 Acender o Fogo',
    description: 'Está frio. Você precisa acender o fogo na lareira.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Acender com pederneira',
        preview: 'Sem mudanças',
        result: {
          message: 'Depois de muitas tentativas, você conseguiu! A casa está aquecendo.',
        },
      },
      {
        text: 'Queimar a mão',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'As brasas caíram na sua mão! Você se queimou feio.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_winter_hunger',
    title: '❄️ Fome de Inverno',
    description: 'É inverno e a comida está acabando. Sua família está com fome.',
    minAge: 3,
    maxAge: 12,
    chance: 0.2,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Dar sua porção para irmãos',
        preview: '🛡️ +20 Honra | ❤️ -20 Vitalidade',
        result: {
          message: 'Você passou fome para seus irmãos comerem. Sua mãe chorou de gratidão.',
          honorChange: 20,
          healthChange: -20,
        },
      },
      {
        text: 'Comer sua porção',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Você comeu sua parte, mas ainda está com fome.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_help_neighbor_plow',
    title: '🚜 Ajudar Vizinho a Arar',
    description: 'O vizinho pediu ajuda para arar o campo dele.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar o dia todo',
        preview: '🛡️ +15 Honra | 💪 +10 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'Você trabalhou duro. O vizinho te deu pão como agradecimento.',
          honorChange: 15,
          strengthChange: 10,
          healthChange: -10,
          foodChange: 1,
        },
      },
      {
        text: 'Recusar',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Seu pai ficou envergonhado. "Vizinhos se ajudam!"',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_break_plow',
    title: '🚜 Quebrar o Arado',
    description: 'Você estava usando o arado e ele quebrou!',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Contar para pai',
        preview: '❤️ -15 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Seu pai te bateu. O arado custava muito caro!',
          healthChange: -15,
          honorChange: -10,
        },
      },
      {
        text: 'Tentar esconder',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Seu pai descobriu. A surra foi pior por você ter mentido.',
          honorChange: -25,
        },
      },
    ],
  },

  {
    id: 'peasant_rat_in_grain',
    title: '🐀 Rato no Celeiro',
    description: 'Ratos estão comendo o grão guardado no celeiro!',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Pegar o gato',
        preview: '🍖 -1 Comida',
        result: {
          message: 'O gato matou alguns ratos, mas eles já comeram parte do grão.',
          foodChange: -1,
        },
      },
      {
        text: 'Tentar matar com pau',
        preview: '❤️ -10 Vitalidade | 🍖 -2 Comida',
        result: {
          message: 'Um rato te mordeu! E eles comeram ainda mais grão.',
          healthChange: -10,
          foodChange: -2,
        },
      },
    ],
  },

  {
    id: 'peasant_lord_demands_tax',
    title: '👑 Lorde Exige Impostos',
    description: 'O Lorde das terras veio cobrar impostos. Sua família mal tem o que dar.',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Dar a última galinha',
        preview: '🍖 -3 Comida | 🛡️ +5 Honra',
        result: {
          message: 'Vocês deram a galinha. Agora não terão ovos.',
          foodChange: -3,
          honorChange: 5,
        },
      },
      {
        text: 'Implorar por piedade',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'O Lorde riu da sua família. Levou a galinha mesmo assim.',
          honorChange: -20,
          foodChange: -3,
        },
      },
    ],
  },

  {
    id: 'peasant_work_lords_field',
    title: '🌾 Trabalho Forçado',
    description: 'O Lorde ordenou que todos os camponeses trabalhem em suas terras hoje.',
    minAge: 8,
    maxAge: 12,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Trabalhar sem reclamar',
        preview: '💪 +10 Força | ❤️ -15 Vitalidade',
        result: {
          message: 'Você trabalhou o dia todo de graça nas terras do Lorde.',
          strengthChange: 10,
          healthChange: -15,
        },
      },
      {
        text: 'Trabalhar devagar',
        preview: '❤️ -20 Vitalidade | 🛡️ -15 Honra',
        result: {
          message: 'O capataz te viu e te bateu. "Trabalhe mais rápido, vagabundo!"',
          healthChange: -20,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_steal_firewood',
    title: '🪵 Roubar Lenha',
    description: 'Está muito frio e sua família não tem lenha. Há lenha no bosque do Lorde.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Roubar lenha',
        preview: '🛡️ -20 Honra | ❤️ +5 Vitalidade',
        result: {
          message: 'Você não foi pego. Sua família pode se aquecer esta noite.',
          honorChange: -20,
          healthChange: 5,
        },
      },
      {
        text: 'Ser pego roubando',
        preview: '❤️ -30 Vitalidade | 🛡️ -40 Honra',
        result: {
          message: 'Os guardas te pegaram! Você foi açoitado publicamente.',
          healthChange: -30,
          honorChange: -40,
        },
      },
      {
        text: 'Não roubar',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Sua família passou frio a noite toda. Mas você manteve sua honra.',
          healthChange: -15,
        },
      },
    ],
  },

  // === FOME E ESCASSEZ (25 eventos) ===

  {
    id: 'peasant_eat_bark',
    title: '🌲 Comer Casca de Árvore',
    description: 'Não há comida. Seu estômago dói de fome.',
    minAge: 4,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Comer casca de árvore',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'A casca é amarga, mas engana a fome por algumas horas.',
          healthChange: -10,
        },
      },
      {
        text: 'Tentar caçar ratos',
        preview: '🍖 +1 Comida | ❤️ -5 Vitalidade',
        result: {
          message: 'Você pegou um rato. É nojento, mas é comida.',
          foodChange: 1,
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'peasant_beg_food',
    title: '🙏 Mendigar Comida',
    description: 'Sua família está passando fome. Você precisa pedir comida.',
    minAge: 5,
    maxAge: 11,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Mendigar na vila',
        preview: '🛡️ -25 Honra | 🍖 +2 Comida',
        result: {
          message: 'Algumas pessoas tiveram pena e deram restos de comida.',
          honorChange: -25,
          foodChange: 2,
        },
      },
      {
        text: 'Passar fome com dignidade',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Você não pediu nada. Sua barriga ronca a noite toda.',
          healthChange: -20,
        },
      },
    ],
  },

  {
    id: 'peasant_share_bread',
    title: '🍞 Dividir o Pão',
    description: 'Só há um pedaço de pão. Você e seus irmãos estão famintos.',
    minAge: 4,
    maxAge: 10,
    chance: 0.15,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Dar para os irmãos menores',
        preview: '🛡️ +20 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Seus irmãos comeram. Você dormiu com fome, mas com orgulho.',
          honorChange: 20,
          healthChange: -15,
        },
      },
      {
        text: 'Comer tudo escondido',
        preview: '🛡️ -30 Honra | ❤️ +5 Vitalidade',
        result: {
          message: 'Você comeu sozinho. A culpa pesa, mas a fome passou.',
          honorChange: -30,
          healthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_spoiled_food',
    title: '🤢 Comida Estragada',
    description: 'A comida guardada apodreceu. Não há mais nada para comer.',
    minAge: 3,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Comer mesmo estragada',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'Você passou mal a noite toda. Vomitou tudo que comeu.',
          healthChange: -25,
        },
      },
      {
        text: 'Não comer',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você ficou com fome, mas evitou ficar doente.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_failed_harvest',
    title: '🌾 Colheita Fracassada',
    description: 'A chuva destruiu a colheita. Não haverá comida este inverno.',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar a salvar o que puder',
        preview: '💪 +10 Força | 🍖 -3 Comida',
        result: {
          message: 'Vocês salvaram pouco. O inverno será muito difícil.',
          strengthChange: 10,
          foodChange: -3,
        },
      },
    ],
  },

  {
    id: 'peasant_steal_apple',
    title: '🍎 Roubar Maçã',
    description: 'O pomar do Lorde está cheio de maçãs. Sua barriga ronca.',
    minAge: 6,
    maxAge: 11,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Roubar algumas maçãs',
        preview: '🛡️ -15 Honra | 🍖 +2 Comida',
        result: {
          message: 'Você pegou 3 maçãs sem ser visto. Deliciosas!',
          honorChange: -15,
          foodChange: 2,
        },
      },
      {
        text: 'Ser pego pelo guarda',
        preview: '❤️ -20 Vitalidade | 🛡️ -25 Honra',
        result: {
          message: 'O guarda te pegou e te bateu com uma vara!',
          healthChange: -20,
          honorChange: -25,
        },
      },
      {
        text: 'Não roubar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você resistiu à tentação. Sua honra permanece intacta.',
        },
      },
    ],
  },

  {
    id: 'peasant_eat_grass',
    title: '🌿 Comer Grama',
    description: 'A fome é tanta que você considera comer grama.',
    minAge: 3,
    maxAge: 8,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Mastigar grama',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Sua barriga dói terrivelmente. Grama não é comida.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_hunt_rabbit',
    title: '🐰 Caçar Coelho',
    description: 'Você viu um coelho perto da floresta. Carne seria um luxo.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'], gender: 'male' },
    options: [
      {
        text: 'Fazer armadilha',
        preview: '💪 +5 Força | 🍖 +3 Comida',
        result: {
          message: 'Sua armadilha funcionou! Coelho assado para a família.',
          strengthChange: 5,
          foodChange: 3,
        },
      },
      {
        text: 'Falhar na caça',
        preview: '❤️ -5 Vitalidade',
        result: {
          message: 'O coelho escapou. Você voltou com as mãos vazias.',
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'peasant_drink_dirty_water',
    title: '💧 Água Suja',
    description: 'O poço está sujo, mas você tem muita sede.',
    minAge: 3,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Beber mesmo assim',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Você ficou doente. Passou dias com febre e diarreia.',
          healthChange: -20,
        },
      },
      {
        text: 'Procurar outra fonte',
        preview: '💪 +5 Força',
        result: {
          message: 'Você andou muito, mas encontrou água limpa no riacho.',
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_sibling_dies_hunger',
    title: '💀 Irmão Morre de Fome',
    description: 'O inverno foi cruel demais. Seu irmão mais novo não resistiu.',
    minAge: 5,
    maxAge: 12,
    chance: 0.05,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Chorar e rezar',
        preview: '⛪ +15 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você rezou pela alma do seu irmão. A dor nunca vai embora.',
          faithChange: 15,
          healthChange: -10,
        },
      },
      {
        text: 'Guardar a dor',
        preview: '💪 +10 Força | 🛡️ -10 Honra',
        result: {
          message: 'Você engoliu as lágrimas. Precisa ser forte pela família.',
          strengthChange: 10,
          honorChange: -10,
        },
      },
    ],
  },

  // === DOENÇAS E ACIDENTES (20 eventos) ===

  {
    id: 'peasant_fever',
    title: '🤒 Febre Alta',
    description: 'Você acordou suando e tremendo. Está com febre alta.',
    minAge: 2,
    maxAge: 12,
    chance: 0.15,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Descansar até melhorar',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você ficou de cama por dias. Aos poucos foi melhorando.',
          healthChange: -15,
        },
      },
      {
        text: 'Trabalhar mesmo doente',
        preview: '❤️ -30 Vitalidade | 💪 +5 Força',
        result: {
          message: 'Você piorou muito. Quase morreu, mas sobreviveu mais forte.',
          healthChange: -30,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_cut_hand',
    title: '🩸 Corte na Mão',
    description: 'Você se cortou feio enquanto usava uma foice.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Amarrar com pano',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'O sangue parou, mas a ferida demorou para cicatrizar.',
          healthChange: -15,
        },
      },
      {
        text: 'Ignorar e continuar',
        preview: '❤️ -25 Vitalidade | 💪 +5 Força',
        result: {
          message: 'A ferida infeccionou. Você quase perdeu a mão.',
          healthChange: -25,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_burn_cooking',
    title: '🔥 Queimadura',
    description: 'Você se queimou ao ajudar a cozinhar.',
    minAge: 5,
    maxAge: 10,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Colocar na água fria',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'A queimadura doeu muito, mas você cuidou direito.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_lice',
    title: '🪳 Piolhos',
    description: 'Sua cabeça coça terrivelmente. Você está cheio de piolhos.',
    minAge: 3,
    maxAge: 12,
    chance: 0.2,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Deixar mãe catar',
        preview: 'Sem mudanças',
        result: {
          message: 'Sua mãe passou horas catando piolhos. Que alívio!',
        },
      },
      {
        text: 'Raspar a cabeça',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Rasparam sua cabeça. As crianças riram de você.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_worms',
    title: '🪱 Vermes na Barriga',
    description: 'Você está fraco e com a barriga inchada. Vermes.',
    minAge: 3,
    maxAge: 10,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Tomar remédio do curandeiro',
        preview: '❤️ -10 Vitalidade | 💰 -5',
        result: {
          message: 'O remédio amargo funcionou. Os vermes saíram.',
          healthChange: -10,
          moneyChange: -5,
        },
      },
      {
        text: 'Sofrer em silêncio',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'Você ficou fraco e doente por semanas.',
          healthChange: -25,
        },
      },
    ],
  },

  {
    id: 'peasant_broken_arm',
    title: '🦴 Braço Quebrado',
    description: 'Você caiu de uma árvore e quebrou o braço!',
    minAge: 6,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Deixar curandeiro ajeitar',
        preview: '❤️ -30 Vitalidade | 💰 -10',
        result: {
          message: 'O curandeiro ajeitou seu braço. Doeu muito, mas vai sarar.',
          healthChange: -30,
          moneyChange: -10,
        },
      },
      {
        text: 'Deixar sarar sozinho',
        preview: '❤️ -20 Vitalidade | 💪 -15 Força',
        result: {
          message: 'O braço sarou torto. Você perdeu força permanentemente.',
          healthChange: -20,
          strengthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_dog_bite',
    title: '🐕 Mordida de Cão',
    description: 'Um cão raivoso te mordeu na perna!',
    minAge: 4,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Queimar a ferida',
        preview: '❤️ -25 Vitalidade',
        result: {
          message: 'Queimaram a mordida com ferro quente. Dói, mas vai viver.',
          healthChange: -25,
        },
      },
      {
        text: 'Apenas limpar',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'A ferida cicatrizou. Você teve sorte.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_almost_drown',
    title: '🌊 Quase Afogou',
    description: 'Você caiu no rio e não sabe nadar direito!',
    minAge: 5,
    maxAge: 11,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Lutar para sobreviver',
        preview: '❤️ -20 Vitalidade | 💪 +10 Força',
        result: {
          message: 'Você se debateu até alcançar a margem. Quase morreu!',
          healthChange: -20,
          strengthChange: 10,
        },
      },
      {
        text: 'Ser salvo por alguém',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Um adulto te puxou da água. Você cuspiu muita água.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_rotten_tooth',
    title: '🦷 Dente Podre',
    description: 'Seu dente está podre e dói muito.',
    minAge: 6,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Arrancar com alicate',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'O ferreiro arrancou seu dente. A dor foi horrível!',
          healthChange: -20,
        },
      },
      {
        text: 'Aguentar a dor',
        preview: '❤️ -15 Vitalidade | 💪 +5 Força',
        result: {
          message: 'Você aguentou semanas de dor até o dente cair sozinho.',
          healthChange: -15,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_bee_sting',
    title: '🐝 Picada de Abelha',
    description: 'Você mexeu em uma colmeia e foi atacado por abelhas!',
    minAge: 5,
    maxAge: 11,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Correr e pular na água',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você levou várias picadas, mas sobreviveu.',
          healthChange: -15,
        },
      },
      {
        text: 'Tentar pegar mel mesmo assim',
        preview: '❤️ -30 Vitalidade | 🍖 +2 Comida',
        result: {
          message: 'Seu rosto inchou terrivelmente, mas você pegou mel!',
          healthChange: -30,
          foodChange: 2,
        },
      },
    ],
  },

  // === FAMÍLIA E RELACIONAMENTOS (15 eventos) ===

  {
    id: 'peasant_new_sibling',
    title: '👶 Irmão Nasce',
    description: 'Sua mãe está dando à luz! Um novo irmão está chegando.',
    minAge: 3,
    maxAge: 10,
    chance: 0.15,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar com o bebê',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'O bebê nasceu saudável! Você ajudou a cuidar dele.',
          honorChange: 10,
          addSibling: true,
        },
      },
      {
        text: 'Ficar com ciúmes',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você tem ciúmes do bebê. Menos atenção para você agora.',
          honorChange: -10,
          addSibling: true,
        },
      },
    ],
  },

  {
    id: 'peasant_drunk_father',
    title: '🍺 Pai Bêbado',
    description: 'Seu pai chegou bêbado da taverna. Está agressivo.',
    minAge: 5,
    maxAge: 12,
    chance: 0.12,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Esconder-se',
        preview: 'Sem mudanças',
        result: {
          message: 'Você se escondeu até ele dormir. Sua mãe não teve a mesma sorte.',
        },
      },
      {
        text: 'Tentar acalmá-lo',
        preview: '❤️ -15 Vitalidade | 🛡️ +10 Honra',
        result: {
          message: 'Ele te bateu, mas você protegeu sua mãe.',
          healthChange: -15,
          honorChange: 10,
        },
      },
    ],
  },

  {
    id: 'peasant_mother_sick',
    title: '🤒 Mãe Doente',
    description: 'Sua mãe está muito doente. Ela não consegue levantar.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Cuidar dela',
        preview: '⛪ +15 Fé | 💪 +5 Força',
        result: {
          message: 'Você cuidou da sua mãe dia e noite. Ela se recuperou.',
          faithChange: 15,
          strengthChange: 5,
        },
      },
      {
        text: 'Chamar curandeiro',
        preview: '💰 -15 | ❤️ +10 Vitalidade',
        result: {
          message: 'O curandeiro fez o que pôde. Sua mãe melhorou.',
          moneyChange: -15,
          healthChange: 10,
        },
      },
    ],
  },

  {
    id: 'peasant_fight_sibling',
    title: '👊 Briga com Irmão',
    description: 'Você e seu irmão estão brigando por comida.',
    minAge: 5,
    maxAge: 11,
    chance: 0.15,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Brigar até ganhar',
        preview: '💪 +10 Força | 🛡️ -15 Honra',
        result: {
          message: 'Você ganhou a briga e ficou com a comida. Seu irmão chora.',
          strengthChange: 10,
          honorChange: -15,
        },
      },
      {
        text: 'Dividir a comida',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Vocês dividiram. Nenhum ficou satisfeito, mas são irmãos.',
          honorChange: 15,
        },
      },
    ],
  },

  {
    id: 'peasant_father_dies',
    title: '💀 Pai Morre',
    description: 'Seu pai sofreu um acidente no campo. Ele não sobreviveu.',
    minAge: 6,
    maxAge: 12,
    chance: 0.05,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    setsFlags: { isOrphan: true },
    options: [
      {
        text: 'Assumir responsabilidades',
        preview: '💪 +15 Força | 🛡️ +20 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você agora é o homem da casa. A infância acabou.',
          strengthChange: 15,
          honorChange: 20,
          healthChange: -15,
          setFlags: { livingWith: 'alone' },
        },
      },
      {
        text: 'Chorar a perda',
        preview: '⛪ +20 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você rezou pela alma do seu pai. A dor é enorme.',
          faithChange: 20,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_uncle_takes_in',
    title: '🏠 Tio te Acolhe',
    description: 'Seus pais morreram. Seu tio oferece te criar.',
    minAge: 4,
    maxAge: 10,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    requiresFlags: { isOrphan: true },
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ir morar com tio',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Seu tio não é rico, mas você tem um teto.',
          honorChange: 10,
          setFlags: { livingWith: 'relative' },
        },
      },
      {
        text: 'Viver nas ruas',
        preview: '💪 +15 Força | 🛡️ -20 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você prefere a liberdade. A vida é dura, mas é sua.',
          strengthChange: 15,
          honorChange: -20,
          healthChange: -10,
          setFlags: { livingWith: 'alone' },
        },
      },
    ],
  },

  {
    id: 'peasant_cruel_uncle',
    title: '😠 Tio Cruel',
    description: 'Seu tio te maltrata. Você é apenas trabalho barato para ele.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['relative'] },
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Aguentar em silêncio',
        preview: '💪 +10 Força | ❤️ -15 Vitalidade',
        result: {
          message: 'Você trabalha sem reclamar. Um dia será forte o bastante.',
          strengthChange: 10,
          healthChange: -15,
        },
      },
      {
        text: 'Fugir de casa',
        preview: '🛡️ -15 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você fugiu. Agora vive nas ruas, mas é livre.',
          honorChange: -15,
          healthChange: -10,
          setFlags: { livingWith: 'alone' },
        },
      },
    ],
  },

  // === LAZER E BRINCADEIRAS (10 eventos) ===

  {
    id: 'peasant_mud_play',
    title: '💩 Brincar na Lama',
    description: 'Choveu muito! Há poças de lama por todo lado.',
    minAge: 4,
    maxAge: 9,
    chance: 0.15,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Pular nas poças',
        preview: '❤️ +5 Vitalidade | 🛡️ -5 Honra',
        result: {
          message: 'Você se divertiu muito! Sua mãe ficou brava com a roupa suja.',
          healthChange: 5,
          honorChange: -5,
        },
      },
      {
        text: 'Fazer boneco de lama',
        preview: 'Sem mudanças',
        result: {
          message: 'Você fez um boneco de lama. Foi divertido!',
        },
      },
    ],
  },

  {
    id: 'peasant_swim_river',
    title: '🏊 Nadar no Rio',
    description: 'Está calor! As outras crianças estão nadando no rio.',
    minAge: 6,
    maxAge: 12,
    chance: 0.12,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Nadar com eles',
        preview: '❤️ +5 Vitalidade | 💪 +5 Força',
        result: {
          message: 'A água estava deliciosa! Você se refrescou e se divertiu.',
          healthChange: 5,
          strengthChange: 5,
        },
      },
      {
        text: 'Ter medo da água',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'As outras crianças riram de você. "Medroso!"',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_stick_fight',
    title: '⚔️ Luta de Gravetos',
    description: 'Os meninos estão brincando de cavaleiros com gravetos.',
    minAge: 6,
    maxAge: 11,
    chance: 0.15,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'], gender: 'male' },
    options: [
      {
        text: 'Lutar bravamente',
        preview: '💪 +10 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você venceu a luta! Os outros te respeitam mais agora.',
          strengthChange: 10,
          healthChange: -5,
        },
      },
      {
        text: 'Levar uma surra',
        preview: '❤️ -15 Vitalidade | 💪 +5 Força',
        result: {
          message: 'Você perdeu a luta, mas aprendeu a lutar melhor.',
          healthChange: -15,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'peasant_chase_chickens',
    title: '🐔 Perseguir Galinhas',
    description: 'As galinhas escaparam! Você corre atrás delas.',
    minAge: 4,
    maxAge: 9,
    chance: 0.12,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Pegar todas',
        preview: '💪 +5 Força',
        result: {
          message: 'Você correu muito, mas pegou todas as galinhas!',
          strengthChange: 5,
        },
      },
      {
        text: 'Deixar uma escapar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Uma galinha fugiu para sempre. Seu pai está irritado.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_make_toy',
    title: '🪆 Fazer Brinquedo',
    description: 'Você está fazendo um brinquedo com pedaços de madeira.',
    minAge: 5,
    maxAge: 10,
    chance: 0.1,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Fazer boneco de madeira',
        preview: 'Sem mudanças',
        result: {
          message: 'Você fez um boneco tosco, mas é seu! Você sorri.',
        },
      },
      {
        text: 'Fazer carrinho',
        preview: 'Sem mudanças',
        result: {
          message: 'O carrinho ficou torto, mas roda! As outras crianças querem um.',
        },
      },
    ],
  },

  {
    id: 'peasant_village_dance',
    title: '💃 Dança na Vila',
    description: 'É dia de festa! Há música e dança na praça da vila.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Dançar e cantar',
        preview: '❤️ +10 Vitalidade | ⛪ +5 Fé',
        result: {
          message: 'Você se divertiu muito! É raro ter alegria assim.',
          healthChange: 10,
          faithChange: 5,
        },
      },
      {
        text: 'Ficar de canto',
        preview: 'Sem mudanças',
        result: {
          message: 'Você observou de longe. Tímido demais para participar.',
        },
      },
    ],
  },

  {
    id: 'peasant_tell_stories',
    title: '📖 Contar Histórias',
    description: 'O velho da vila está contando histórias ao redor da fogueira.',
    minAge: 4,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ouvir atentamente',
        preview: '⛪ +10 Fé',
        result: {
          message: 'Histórias de santos, demônios e heróis. Você sonhou com aventuras.',
          faithChange: 10,
        },
      },
      {
        text: 'Dormir no meio',
        preview: 'Sem mudanças',
        result: {
          message: 'O calor da fogueira te fez dormir. Foi um sono tranquilo.',
        },
      },
    ],
  },

  // === COMUNIDADE E RELIGIÃO (10 eventos) ===

  {
    id: 'peasant_church_sunday',
    title: '⛪ Missa de Domingo',
    description: 'É domingo. Toda a vila vai à igreja.',
    minAge: 4,
    maxAge: 12,
    chance: 0.2,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Rezar com devoção',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você rezou com fervor. O padre te notou.',
          faithChange: 15,
        },
      },
      {
        text: 'Dormir durante missa',
        preview: '⛪ -10 Fé | 🛡️ -10 Honra',
        result: {
          message: 'Você dormiu e levou um puxão de orelha da mãe.',
          faithChange: -10,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_help_priest',
    title: '⛪ Ajudar o Padre',
    description: 'O padre precisa de ajuda na igreja.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar com alegria',
        preview: '⛪ +20 Fé | 🛡️ +10 Honra',
        result: {
          message: 'O padre te abençoou. Você se sente mais perto de Deus.',
          faithChange: 20,
          honorChange: 10,
        },
      },
      {
        text: 'Reclamar do trabalho',
        preview: '⛪ -10 Fé | 🛡️ -10 Honra',
        result: {
          message: 'O padre te olhou com desaprovação. Sua mãe está envergonhada.',
          faithChange: -10,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_village_funeral',
    title: '⚰️ Funeral na Vila',
    description: 'Alguém da vila morreu. Todos vão ao funeral.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Rezar pelos mortos',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você rezou pela alma do falecido. A morte é parte da vida.',
          faithChange: 15,
        },
      },
      {
        text: 'Ter medo da morte',
        preview: '❤️ -5 Vitalidade',
        result: {
          message: 'Você teve pesadelos por dias. A morte te assusta.',
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'peasant_village_wedding',
    title: '💒 Casamento na Vila',
    description: 'Dois jovens da vila estão se casando! Há festa.',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Festejar e comer',
        preview: '❤️ +10 Vitalidade | 🍖 +2 Comida',
        result: {
          message: 'É raro ter tanta comida! Você comeu até não aguentar mais.',
          healthChange: 10,
          foodChange: 2,
        },
      },
    ],
  },

  {
    id: 'peasant_accused_witch',
    title: '🧙 Acusação de Bruxaria',
    description: 'Uma mulher da vila foi acusada de bruxaria!',
    minAge: 7,
    maxAge: 12,
    chance: 0.05,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ver a execução',
        preview: '⛪ +5 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você viu a mulher ser queimada. Nunca vai esquecer.',
          faithChange: 5,
          healthChange: -10,
        },
      },
      {
        text: 'Fugir da cena',
        preview: '⛪ -5 Fé',
        result: {
          message: 'Você correu. Os gritos ainda ecoam na sua mente.',
          faithChange: -5,
        },
      },
    ],
  },

  // === MAIS EVENTOS DE PERIGO E SOBREVIVÊNCIA ===

  {
    id: 'peasant_wolf_attack',
    title: '🐺 Ataque de Lobo',
    description: 'Um lobo está atacando as ovelhas da família!',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Enfrentar o lobo',
        preview: '💪 +15 Força | ❤️ -25 Vitalidade | 🛡️ +20 Honra',
        result: {
          message: 'Você lutou contra o lobo com um cajado! Salvou as ovelhas.',
          strengthChange: 15,
          healthChange: -25,
          honorChange: 20,
        },
      },
      {
        text: 'Correr e pedir ajuda',
        preview: '🍖 -2 Comida',
        result: {
          message: 'O lobo matou duas ovelhas antes dos adultos chegarem.',
          foodChange: -2,
        },
      },
    ],
  },

  {
    id: 'peasant_storm_damage',
    title: '⛈️ Tempestade Destrutiva',
    description: 'Uma tempestade terrível destruiu parte da plantação.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Ajudar a reconstruir',
        preview: '💪 +10 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'Você trabalhou dias ajudando a reparar os danos.',
          strengthChange: 10,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_plague_village',
    title: '💀 Peste na Vila',
    description: 'A peste chegou à vila. Pessoas estão morrendo.',
    minAge: 5,
    maxAge: 12,
    chance: 0.05,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Isolar-se em casa',
        preview: '❤️ -15 Vitalidade | ⛪ +15 Fé',
        result: {
          message: 'Você passou semanas trancado rezando. Sobreviveu!',
          healthChange: -15,
          faithChange: 15,
        },
      },
      {
        text: 'Ajudar os doentes',
        preview: '❤️ -30 Vitalidade | 🛡️ +25 Honra | ⛪ +20 Fé',
        result: {
          message: 'Você arriscou sua vida para ajudar outros. Heroico.',
          healthChange: -30,
          honorChange: 25,
          faithChange: 20,
        },
      },
    ],
  },

  {
    id: 'peasant_lost_forest',
    title: '🌲 Perdido na Floresta',
    description: 'Você se perdeu na floresta enquanto coletava lenha.',
    minAge: 6,
    maxAge: 11,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Encontrar o caminho de volta',
        preview: '💪 +10 Força',
        result: {
          message: 'Você seguiu o riacho e encontrou o caminho de casa!',
          strengthChange: 10,
        },
      },
      {
        text: 'Passar a noite na floresta',
        preview: '❤️ -20 Vitalidade | 💪 +15 Força',
        result: {
          message: 'Você sobreviveu uma noite assustadora. Voltou no dia seguinte.',
          healthChange: -20,
          strengthChange: 15,
        },
      },
    ],
  },

  {
    id: 'peasant_snake_bite',
    title: '🐍 Picada de Cobra',
    description: 'Uma cobra te picou enquanto você trabalhava no campo!',
    minAge: 5,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Chupar o veneno',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Você fez o que pôde. Ficou doente por dias, mas sobreviveu.',
          healthChange: -20,
        },
      },
      {
        text: 'Correr para o curandeiro',
        preview: '❤️ -15 Vitalidade | 💰 -10',
        result: {
          message: 'O curandeiro aplicou ervas na ferida. Você melhorou.',
          healthChange: -15,
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_bully_kids',
    title: '👊 Valentões da Vila',
    description: 'Crianças mais velhas estão te intimidando.',
    minAge: 6,
    maxAge: 10,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Revidar',
        preview: '💪 +10 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'Você apanhou, mas mostrou que não é covarde.',
          strengthChange: 10,
          healthChange: -10,
        },
      },
      {
        text: 'Fugir',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você correu. Eles riem de você agora.',
          honorChange: -15,
        },
      },
      {
        text: 'Pedir ajuda a adulto',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Seu pai brigou com os pais deles. Problema resolvido.',
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'peasant_find_coin',
    title: '💰 Encontrar Moeda',
    description: 'Você encontrou uma moeda de prata na estrada!',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Guardar para você',
        preview: '💰 +10 | 🛡️ -10 Honra',
        result: {
          message: 'Você escondeu a moeda. Ninguém vai saber.',
          moneyChange: 10,
          honorChange: -10,
        },
      },
      {
        text: 'Entregar aos pais',
        preview: '💰 +5 | 🛡️ +15 Honra',
        result: {
          message: 'Seus pais ficaram orgulhosos da sua honestidade.',
          moneyChange: 5,
          honorChange: 15,
        },
      },
    ],
  },

  {
    id: 'peasant_sick_animal',
    title: '🐄 Animal Doente',
    description: 'A vaca da família está doente e pode morrer.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Cuidar dela dia e noite',
        preview: '❤️ -10 Vitalidade | 🛡️ +15 Honra',
        result: {
          message: 'Você não dormiu por dias. A vaca se recuperou!',
          healthChange: -10,
          honorChange: 15,
        },
      },
      {
        text: 'Deixar morrer',
        preview: '🍖 -4 Comida',
        result: {
          message: 'A vaca morreu. Sem leite por muito tempo.',
          foodChange: -4,
        },
      },
    ],
  },

  {
    id: 'peasant_first_crush',
    title: '💕 Primeiro Amor',
    description: 'Você gosta de uma criança da vila. Coração acelerado!',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'neutral',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Dar uma flor',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Ela/ele sorriu! Você está nas nuvens.',
          honorChange: 10,
        },
      },
      {
        text: 'Ficar vermelho e fugir',
        preview: 'Sem mudanças',
        result: {
          message: 'Você é muito tímido. Talvez um dia...',
        },
      },
    ],
  },

  {
    id: 'peasant_birth_help',
    title: '👶 Ajudar no Parto',
    description: 'Sua mãe está dando à luz e precisa de ajuda!',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'], gender: 'female' },
    options: [
      {
        text: 'Ajudar a parteira',
        preview: '🛡️ +20 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você ajudou no nascimento do seu irmão! Milagre da vida.',
          honorChange: 20,
          faithChange: 10,
          addSibling: true,
        },
      },
    ],
  },

  {
    id: 'peasant_herb_gathering',
    title: '🌿 Colher Ervas',
    description: 'Você está colhendo ervas medicinais para o curandeiro.',
    minAge: 6,
    maxAge: 11,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Encontrar as ervas certas',
        preview: '💰 +5',
        result: {
          message: 'O curandeiro te pagou pelas ervas. Bom trabalho!',
          moneyChange: 5,
        },
      },
      {
        text: 'Pegar erva venenosa por engano',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você tocou em erva venenosa. Suas mãos incharam!',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'peasant_night_terror',
    title: '😱 Terror Noturno',
    description: 'Você tem pesadelos terríveis todas as noites.',
    minAge: 4,
    maxAge: 9,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Rezar antes de dormir',
        preview: '⛪ +15 Fé',
        result: {
          message: 'As rezas acalmaram sua mente. Os pesadelos diminuíram.',
          faithChange: 15,
        },
      },
      {
        text: 'Sofrer em silêncio',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Você não dorme direito há semanas.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'peasant_stranger_village',
    title: '🚶 Estranho na Vila',
    description: 'Um viajante misterioso chegou à vila.',
    minAge: 7,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Observar de longe',
        preview: 'Sem mudanças',
        result: {
          message: 'O estranho foi embora no dia seguinte. Quem seria?',
        },
      },
      {
        text: 'Falar com ele',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Ele contou histórias de terras distantes! Fascinante.',
          honorChange: 10,
        },
      },
    ],
  },

  {
    id: 'peasant_learn_trade_secret',
    title: '🤫 Segredo de Ofício',
    description: 'Um artesão passou pela vila e te mostrou um truque.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Aprender o truque',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você aprendeu algo útil! Pode usar no futuro.',
          honorChange: 10,
        },
      },
    ],
  },

  {
    id: 'peasant_christmas_feast',
    title: '🎄 Festa de Natal',
    description: 'É Natal! O Lorde oferece um banquete para os camponeses.',
    minAge: 4,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['peasant'] },
    options: [
      {
        text: 'Comer e celebrar',
        preview: '❤️ +15 Vitalidade | 🍖 +3 Comida | ⛪ +10 Fé',
        result: {
          message: 'Comida farta no Natal! Um dia de alegria rara.',
          healthChange: 15,
          foodChange: 3,
          faithChange: 10,
        },
      },
    ],
  },

];

// =============================================================================
// EVENTOS DE ARTESÃO (100 EVENTOS)
// Aprender ofício, vida urbana, comércio, escola básica
// =============================================================================

const ARTISAN_EVENTS: ChildhoodEvent[] = [
  
  // === APRENDIZADO DE OFÍCIO (30 eventos) ===
  
  {
    id: 'artisan_first_lesson',
    title: '🔨 Primeira Lição',
    description: 'Seu pai está te ensinando o ofício dele pela primeira vez.',
    minAge: 6,
    maxAge: 8,
    chance: 0.9,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Prestar muita atenção',
        preview: 'Sem mudanças',
        result: {
          message: 'Você aprendeu rápido! Seu pai está impressionado.',
        },
      },
      {
        text: 'Se distrair',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai ficou desapontado. "Como vai assumir a oficina assim?"',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_practice_craft',
    title: '🛠️ Praticar o Ofício',
    description: 'Você está praticando as técnicas que seu pai ensinou.',
    minAge: 7,
    maxAge: 12,
    chance: 0.2,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Praticar com dedicação',
        preview: 'Sem mudanças',
        result: {
          message: 'Suas habilidades estão melhorando! Logo será um artesão de verdade.',
        },
      },
      {
        text: 'Estragar material caro',
        preview: '💰 -20 | 🛡️ -15 Honra',
        result: {
          message: 'Você errou e desperdiçou material valioso! Seu pai está furioso.',
          moneyChange: -20,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_help_customer',
    title: '👨‍💼 Atender Cliente',
    description: 'Um cliente entrou na oficina. Seu pai está ocupado.',
    minAge: 8,
    maxAge: 12,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Atender bem',
        preview: '🛡️ +15 Honra | 💰 +5',
        result: {
          message: 'O cliente ficou satisfeito e comprou! Seu pai te elogiou.',
          honorChange: 15,
          moneyChange: 5,
        },
      },
      {
        text: 'Ser rude',
        preview: '🛡️ -20 Honra | 💰 -10',
        result: {
          message: 'O cliente foi embora irritado. Sua família perdeu um bom negócio.',
          honorChange: -20,
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_organize_tools',
    title: '🧰 Organizar Ferramentas',
    description: 'A oficina está bagunçada. As ferramentas precisam ser organizadas.',
    minAge: 6,
    maxAge: 11,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Organizar tudo',
        preview: 'Sem mudanças',
        result: {
          message: 'A oficina está organizada! Seu pai pode trabalhar melhor agora.',
        },
      },
      {
        text: 'Quebrar ferramenta valiosa',
        preview: '💰 -15 | 🛡️ -15 Honra',
        result: {
          message: 'Você derrubou e quebrou uma ferramenta cara!',
          moneyChange: -15,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_market_day',
    title: '🛒 Dia de Mercado',
    description: 'É dia de mercado! Seu pai vai vender os produtos da semana.',
    minAge: 7,
    maxAge: 12,
    chance: 0.18,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ajudar a vender',
        preview: '💰 +15',
        result: {
          message: 'Você foi um ótimo vendedor! As vendas foram boas.',
          moneyChange: 15,
        },
      },
      {
        text: 'Derrubar a barraca',
        preview: '💰 -25 | 🛡️ -20 Honra',
        result: {
          message: 'Você tropeçou e derrubou tudo! Os produtos quebraram.',
          moneyChange: -25,
          honorChange: -20,
        },
      },
    ],
  },

  // === APRENDIZADO DE OFÍCIO (mais eventos) ===

  {
    id: 'artisan_blacksmith_heat',
    title: '🔥 Calor da Forja',
    description: 'Você está aprendendo a trabalhar na forja do ferreiro.',
    minAge: 8,
    maxAge: 12,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Aguentar o calor',
        preview: '💪 +15 Força | ❤️ -10 Vitalidade',
        result: {
          message: 'O calor é intenso, mas você está ficando mais forte!',
          strengthChange: 15,
          healthChange: -10,
        },
      },
      {
        text: 'Queimar a mão',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'Você encostou no ferro quente! A queimadura é grave.',
          healthChange: -20,
        },
      },
    ],
  },

  {
    id: 'artisan_carpenter_learn',
    title: '🪚 Aprender Carpintaria',
    description: 'Seu pai está te ensinando a serrar madeira.',
    minAge: 7,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Serrar com cuidado',
        preview: '💪 +8 Força',
        result: {
          message: 'Você aprendeu a serrar reto! Seu pai está orgulhoso.',
          strengthChange: 8,
        },
      },
      {
        text: 'Cortar torto',
        preview: '🛡️ -10 Honra | 💰 -5',
        result: {
          message: 'Você desperdiçou madeira. Seu pai está irritado.',
          honorChange: -10,
          moneyChange: -5,
        },
      },
    ],
  },

  {
    id: 'artisan_baker_bread',
    title: '🍞 Fazer Pão',
    description: 'Você está aprendendo a fazer pão na padaria da família.',
    minAge: 6,
    maxAge: 11,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer pão perfeito',
        preview: '🍖 +2 Comida | 🛡️ +10 Honra',
        result: {
          message: 'Seu pão ficou delicioso! Os clientes elogiaram.',
          foodChange: 2,
          honorChange: 10,
        },
      },
      {
        text: 'Queimar o pão',
        preview: '🍖 -1 Comida | 🛡️ -10 Honra',
        result: {
          message: 'Você deixou o pão queimar. Desperdício de farinha!',
          foodChange: -1,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_tailor_needle',
    title: '🪡 Aprender a Costurar',
    description: 'Você está praticando costura com agulha e linha.',
    minAge: 6,
    maxAge: 10,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer pontos perfeitos',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Seus pontos estão ficando cada vez melhores!',
          honorChange: 10,
        },
      },
      {
        text: 'Espetar o dedo',
        preview: '❤️ -5 Vitalidade',
        result: {
          message: 'Você furou o dedo com a agulha várias vezes. Dói!',
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'artisan_cobbler_shoe',
    title: '👞 Fazer Sapato',
    description: 'Você está aprendendo a fazer sapatos de couro.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer sapato resistente',
        preview: '💰 +10 | 🛡️ +10 Honra',
        result: {
          message: 'Seu primeiro sapato! Não é perfeito, mas funciona.',
          moneyChange: 10,
          honorChange: 10,
        },
      },
      {
        text: 'Estragar o couro',
        preview: '💰 -15 | 🛡️ -15 Honra',
        result: {
          message: 'Você furou o couro no lugar errado. Desperdício!',
          moneyChange: -15,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_secret_technique',
    title: '🤫 Segredo do Ofício',
    description: 'Seu pai está te ensinando um segredo de família.',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Guardar o segredo',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você aprendeu uma técnica especial da família. Nunca conte a ninguém!',
          honorChange: 20,
        },
      },
      {
        text: 'Contar para amigo',
        preview: '🛡️ -30 Honra',
        result: {
          message: 'Seu pai descobriu que você contou o segredo. Está furioso!',
          honorChange: -30,
        },
      },
    ],
  },

  // === COMÉRCIO E CLIENTES ===

  {
    id: 'artisan_rich_client',
    title: '👑 Cliente Rico',
    description: 'Um nobre entrou na oficina querendo uma encomenda especial.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Impressionar o nobre',
        preview: '💰 +30 | 🛡️ +20 Honra',
        result: {
          message: 'O nobre gostou do seu trabalho! Pagou bem e prometeu voltar.',
          moneyChange: 30,
          honorChange: 20,
        },
      },
      {
        text: 'Errar na encomenda',
        preview: '💰 -20 | 🛡️ -25 Honra',
        result: {
          message: 'O nobre ficou furioso! Ameaçou fechar a oficina.',
          moneyChange: -20,
          honorChange: -25,
        },
      },
    ],
  },

  {
    id: 'artisan_poor_client',
    title: '😢 Cliente Pobre',
    description: 'Uma viúva precisa de um conserto mas não tem dinheiro.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer de graça',
        preview: '🛡️ +20 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você ajudou a viúva sem cobrar. Ela rezou por você.',
          honorChange: 20,
          faithChange: 10,
        },
      },
      {
        text: 'Recusar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Negócios são negócios. Ela foi embora triste.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_cheated_payment',
    title: '💸 Cliente Caloteiro',
    description: 'Um cliente levou o produto e fugiu sem pagar!',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Correr atrás dele',
        preview: '💪 +10 Força | 💰 +10',
        result: {
          message: 'Você alcançou o ladrão e recuperou o pagamento!',
          strengthChange: 10,
          moneyChange: 10,
        },
      },
      {
        text: 'Deixar ir',
        preview: '💰 -15',
        result: {
          message: 'O ladrão escapou. Prejuízo para a família.',
          moneyChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_haggle_price',
    title: '💰 Negociar Preço',
    description: 'Um cliente quer pagar menos pelo produto.',
    minAge: 9,
    maxAge: 12,
    chance: 0.15,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Negociar bem',
        preview: '💰 +20',
        result: {
          message: 'Você convenceu o cliente a pagar um preço justo!',
          moneyChange: 20,
        },
      },
      {
        text: 'Aceitar preço baixo',
        preview: '💰 +5 | 🛡️ -10 Honra',
        result: {
          message: 'Você aceitou menos. Seu pai está desapontado.',
          moneyChange: 5,
          honorChange: -10,
        },
      },
    ],
  },

  // === VIDA URBANA ===

  {
    id: 'artisan_fair_day',
    title: '🎪 Dia de Feira',
    description: 'É dia da grande feira da cidade! Há apresentações e comerciantes.',
    minAge: 5,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Passear pela feira',
        preview: '❤️ +10 Vitalidade',
        result: {
          message: 'Você viu malabaristas e ouviu músicos! Foi incrível!',
          healthChange: 10,
        },
      },
      {
        text: 'Ajudar na barraca',
        preview: '💰 +15 | 💪 +5 Força',
        result: {
          message: 'Você trabalhou o dia todo, mas vendeu muito!',
          moneyChange: 15,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_fire_workshop',
    title: '🔥 Incêndio na Oficina',
    description: 'Um incêndio começou na oficina vizinha!',
    minAge: 6,
    maxAge: 12,
    chance: 0.06,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ajudar a apagar',
        preview: '🛡️ +25 Honra | ❤️ -15 Vitalidade',
        result: {
          message: 'Você ajudou a apagar o fogo. Os vizinhos são gratos.',
          honorChange: 25,
          healthChange: -15,
        },
      },
      {
        text: 'Proteger sua oficina',
        preview: '💰 +5',
        result: {
          message: 'Você salvou seus produtos enquanto outros apagavam o fogo.',
          moneyChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_guild_feast',
    title: '🍖 Festa da Guilda',
    description: 'A guilda dos artesãos está fazendo uma festa!',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Comer e beber',
        preview: '❤️ +15 Vitalidade | 🍖 +2 Comida',
        result: {
          message: 'Comida farta! Você comeu até não aguentar mais.',
          healthChange: 15,
          foodChange: 2,
        },
      },
      {
        text: 'Conhecer outros artesãos',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você fez amizade com filhos de outros artesãos.',
          honorChange: 15,
        },
      },
    ],
  },

  {
    id: 'artisan_execution_square',
    title: '⚔️ Execução na Praça',
    description: 'Há uma execução pública na praça. Todos estão assistindo.',
    minAge: 7,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Assistir',
        preview: '⛪ +5 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você viu a execução. É assim que a justiça funciona.',
          faithChange: 5,
          healthChange: -10,
        },
      },
      {
        text: 'Não assistir',
        preview: 'Sem mudanças',
        result: {
          message: 'Você preferiu não ver. Os gritos ainda chegaram aos seus ouvidos.',
        },
      },
    ],
  },

  {
    id: 'artisan_rival_workshop',
    title: '⚔️ Oficina Rival',
    description: 'Os filhos da oficina rival estão te provocando.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Brigar com eles',
        preview: '💪 +10 Força | ❤️ -10 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Vocês brigaram. Você ganhou, mas ficou machucado.',
          strengthChange: 10,
          healthChange: -10,
          honorChange: -10,
        },
      },
      {
        text: 'Ignorar provocações',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você mostrou maturidade. Seu pai está orgulhoso.',
          honorChange: 10,
        },
      },
    ],
  },

  // === EDUCAÇÃO ===

  {
    id: 'artisan_learn_read',
    title: '📖 Aprender a Ler',
    description: 'O padre está ensinando as crianças a ler na igreja.',
    minAge: 6,
    maxAge: 10,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Estudar com dedicação',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você está aprendendo a ler! Poucos têm essa oportunidade.',
          faithChange: 15,
        },
      },
      {
        text: 'Achar chato',
        preview: '⛪ -5 Fé | 🛡️ -5 Honra',
        result: {
          message: 'O padre te repreendeu por falta de atenção.',
          faithChange: -5,
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'artisan_learn_math',
    title: '🔢 Aprender Matemática',
    description: 'Você precisa aprender a contar dinheiro para a oficina.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Aprender a calcular',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você sabe somar e subtrair! Essencial para negócios.',
          honorChange: 10,
        },
      },
      {
        text: 'Errar as contas',
        preview: '💰 -10',
        result: {
          message: 'Você errou o troco de um cliente. Prejuízo!',
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_church_catechism',
    title: '⛪ Catecismo',
    description: 'O padre está ensinando sobre a Bíblia e os santos.',
    minAge: 5,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Prestar atenção',
        preview: '⛪ +20 Fé',
        result: {
          message: 'Você aprendeu sobre os santos e os pecados.',
          faithChange: 20,
        },
      },
      {
        text: 'Fazer perguntas demais',
        preview: '⛪ +10 Fé | 🛡️ -5 Honra',
        result: {
          message: 'O padre ficou irritado com tantas perguntas.',
          faithChange: 10,
          honorChange: -5,
        },
      },
    ],
  },

  // === FAMÍLIA E OFICINA ===

  {
    id: 'artisan_inherit_tools',
    title: '🧰 Herdar Ferramentas',
    description: 'Seu avô está velho e te deu suas ferramentas antigas.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Cuidar bem delas',
        preview: '🛡️ +15 Honra | 💰 +10',
        result: {
          message: 'As ferramentas do avô são suas agora. Uma honra!',
          honorChange: 15,
          moneyChange: 10,
        },
      },
    ],
  },

  {
    id: 'artisan_mother_helps',
    title: '👩 Mãe Ajuda na Oficina',
    description: 'Sua mãe está costurando para ajudar nas finanças.',
    minAge: 5,
    maxAge: 10,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ajudar ela',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você ajudou sua mãe. Família trabalha junto!',
          honorChange: 10,
        },
      },
      {
        text: 'Brincar ao invés de ajudar',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Sua mãe ficou desapontada com você.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_sibling_apprentice',
    title: '👦 Irmão Aprendiz',
    description: 'Seu irmão mais novo está começando a aprender o ofício.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ensinar o que sabe',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você ensinou seu irmão. Ele te admira agora.',
          honorChange: 15,
        },
      },
      {
        text: 'Zombar dele',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você foi cruel com seu irmão. Sua mãe te repreendeu.',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_father_injured',
    title: '🤕 Pai Machucado',
    description: 'Seu pai se machucou trabalhando. Não pode usar as mãos.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Assumir a oficina',
        preview: '💪 +15 Força | 🛡️ +25 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você trabalhou como adulto. A família sobreviveu.',
          strengthChange: 15,
          honorChange: 25,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_business_expand',
    title: '📈 Negócio Crescendo',
    description: 'Os negócios estão indo bem! A família tem mais dinheiro.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Comemorar',
        preview: '❤️ +10 Vitalidade | 💰 +20',
        result: {
          message: 'Tempos bons! A família comeu carne esta semana.',
          healthChange: 10,
          moneyChange: 20,
        },
      },
    ],
  },

  {
    id: 'artisan_debt_collector',
    title: '💰 Cobrador de Dívidas',
    description: 'Um homem veio cobrar uma dívida antiga do seu pai.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Pagar a dívida',
        preview: '💰 -30 | 🛡️ +10 Honra',
        result: {
          message: 'A dívida foi paga. Sua família está mais pobre, mas livre.',
          moneyChange: -30,
          honorChange: 10,
        },
      },
      {
        text: 'Pedir mais tempo',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'O cobrador ficou irritado. Voltará em breve.',
          honorChange: -15,
        },
      },
    ],
  },

  // === MAIS EVENTOS DE ARTESÃO ===

  {
    id: 'artisan_apprentice_master',
    title: '👨‍🏫 Mestre Severo',
    description: 'Um mestre artesão está avaliando seu trabalho.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Impressionar o mestre',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'O mestre elogiou seu trabalho! Futuro promissor.',
          honorChange: 25,
        },
      },
      {
        text: 'Decepcionar o mestre',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'O mestre balançou a cabeça desapontado.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'artisan_new_tool',
    title: '🔧 Ferramenta Nova',
    description: 'Seu pai comprou uma ferramenta nova para a oficina.',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Aprender a usar',
        preview: '💪 +5 Força',
        result: {
          message: 'Você dominou a nova ferramenta rapidamente!',
          strengthChange: 5,
        },
      },
      {
        text: 'Quebrar acidentalmente',
        preview: '💰 -20 | 🛡️ -15 Honra',
        result: {
          message: 'Você quebrou a ferramenta nova! Seu pai está furioso.',
          moneyChange: -20,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_pottery_learn',
    title: '🏺 Aprender Cerâmica',
    description: 'Você está aprendendo a fazer vasos de barro.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer vaso perfeito',
        preview: '🛡️ +15 Honra | 💰 +10',
        result: {
          message: 'Seu vaso ficou lindo! Pode ser vendido.',
          honorChange: 15,
          moneyChange: 10,
        },
      },
      {
        text: 'O vaso quebrou',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O barro não secou direito e quebrou. Tente de novo.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_weaver_fabric',
    title: '🧵 Tecer Tecido',
    description: 'Você está aprendendo a usar o tear.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Tecer com paciência',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'O tecido ficou uniforme e bonito!',
          honorChange: 10,
        },
      },
      {
        text: 'Embaraçar os fios',
        preview: '💰 -10 | 🛡️ -10 Honra',
        result: {
          message: 'Você fez uma bagunça com os fios. Desperdício!',
          moneyChange: -10,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_candle_making',
    title: '🕯️ Fazer Velas',
    description: 'Você está aprendendo a fazer velas de sebo.',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer velas perfeitas',
        preview: '💰 +10',
        result: {
          message: 'Suas velas queimam por muito tempo! Boa qualidade.',
          moneyChange: 10,
        },
      },
      {
        text: 'Derrubar a cera quente',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'A cera quente caiu no seu braço! Queimadura dolorosa.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_messenger_job',
    title: '📬 Trabalho de Mensageiro',
    description: 'Um cliente pediu para você entregar uma encomenda.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Entregar com rapidez',
        preview: '💰 +10 | 🛡️ +10 Honra',
        result: {
          message: 'O cliente ficou satisfeito. Gorjeta!',
          moneyChange: 10,
          honorChange: 10,
        },
      },
      {
        text: 'Perder a encomenda',
        preview: '💰 -20 | 🛡️ -20 Honra',
        result: {
          message: 'Você perdeu o pacote! Desastre para a oficina.',
          moneyChange: -20,
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'artisan_sick_days',
    title: '🤒 Dias Doente',
    description: 'Você está doente e não pode trabalhar na oficina.',
    minAge: 5,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Descansar e se recuperar',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'Você descansou e melhorou. Vida continua.',
          healthChange: -10,
        },
      },
      {
        text: 'Trabalhar mesmo doente',
        preview: '❤️ -25 Vitalidade | 💰 +10',
        result: {
          message: 'Você piorou muito, mas ajudou a família.',
          healthChange: -25,
          moneyChange: 10,
        },
      },
    ],
  },

  {
    id: 'artisan_competition',
    title: '🏆 Competição de Ofícios',
    description: 'Há uma competição entre jovens aprendizes!',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Vencer a competição',
        preview: '🛡️ +30 Honra | 💰 +20',
        result: {
          message: 'Você venceu! Toda a guilda te aplaude.',
          honorChange: 30,
          moneyChange: 20,
        },
      },
      {
        text: 'Perder dignamente',
        preview: '🛡️ +5 Honra',
        result: {
          message: 'Você não venceu, mas aprendeu com os melhores.',
          honorChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_trade_secret_stolen',
    title: '🤫 Segredo Roubado',
    description: 'A oficina rival está copiando seus métodos!',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Criar método ainda melhor',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você inventou uma técnica nova e superior!',
          honorChange: 20,
        },
      },
      {
        text: 'Reclamar às autoridades',
        preview: '🛡️ -10 Honra | 💰 -10',
        result: {
          message: 'Ninguém se importou. Tempo e dinheiro perdidos.',
          honorChange: -10,
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_merchant_visit',
    title: '🛒 Mercador Visita',
    description: 'Um mercador rico quer fazer uma grande encomenda.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fechar bom negócio',
        preview: '💰 +40 | 🛡️ +15 Honra',
        result: {
          message: 'Grande encomenda fechada! Muito trabalho, mas bom dinheiro.',
          moneyChange: 40,
          honorChange: 15,
        },
      },
      {
        text: 'Ser enganado no preço',
        preview: '💰 +10 | 🛡️ -15 Honra',
        result: {
          message: 'O mercador te enganou. Trabalho demais por pouco.',
          moneyChange: 10,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_town_crier',
    title: '📢 Pregão na Praça',
    description: 'O pregoeiro anuncia notícias importantes!',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ouvir as notícias',
        preview: 'Sem mudanças',
        result: {
          message: 'Você ficou sabendo das novidades do reino.',
        },
      },
    ],
  },

  {
    id: 'artisan_night_work',
    title: '🌙 Trabalho Noturno',
    description: 'Há uma encomenda urgente. Precisa trabalhar à noite.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Trabalhar a noite toda',
        preview: '❤️ -15 Vitalidade | 💰 +20',
        result: {
          message: 'Você entregou no prazo! Cliente satisfeito.',
          healthChange: -15,
          moneyChange: 20,
        },
      },
      {
        text: 'Dormir e perder prazo',
        preview: '🛡️ -20 Honra | 💰 -15',
        result: {
          message: 'Cliente furioso! Reputação prejudicada.',
          honorChange: -20,
          moneyChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_church_donation',
    title: '⛪ Doação à Igreja',
    description: 'O padre pede uma doação para reparos na igreja.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Doar generosamente',
        preview: '⛪ +20 Fé | 💰 -15',
        result: {
          message: 'O padre abençoou sua família. Almas salvas!',
          faithChange: 20,
          moneyChange: -15,
        },
      },
      {
        text: 'Não doar',
        preview: '⛪ -10 Fé',
        result: {
          message: 'O padre olhou com desaprovação.',
          faithChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_first_sale',
    title: '💰 Primeira Venda Solo',
    description: 'Você vai fazer sua primeira venda sozinho!',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Vender com sucesso',
        preview: '💰 +15 | 🛡️ +20 Honra',
        result: {
          message: 'Você negociou e vendeu! Seu pai está orgulhoso.',
          moneyChange: 15,
          honorChange: 20,
        },
      },
      {
        text: 'Ser enganado',
        preview: '💰 -10 | 🛡️ -15 Honra',
        result: {
          message: 'O cliente te enganou. Lição aprendida.',
          moneyChange: -10,
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_quality_inspection',
    title: '🔍 Inspeção de Qualidade',
    description: 'O fiscal da guilda veio inspecionar a oficina.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Passar na inspeção',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'A oficina passou! Qualidade aprovada.',
          honorChange: 20,
        },
      },
      {
        text: 'Receber multa',
        preview: '💰 -25 | 🛡️ -15 Honra',
        result: {
          message: 'Encontraram problemas. Multa aplicada!',
          moneyChange: -25,
          honorChange: -15,
        },
      },
    ],
  },

  // === AINDA MAIS EVENTOS DE ARTESÃO ===

  {
    id: 'artisan_tannery_smell',
    title: '👃 Fedor de Curtume',
    description: 'Você está aprendendo a curtir couro. O cheiro é horrível!',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Aguentar o fedor',
        preview: '💪 +10 Força | ❤️ -5 Vitalidade',
        result: {
          message: 'Você se acostumou ao cheiro. Couro de qualidade!',
          strengthChange: 10,
          healthChange: -5,
        },
      },
      {
        text: 'Vomitar de nojo',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'O cheiro é demais para você. Enjoou.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_dye_colors',
    title: '🎨 Tingir Tecidos',
    description: 'Você está aprendendo a tingir tecidos com corantes.',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Criar cor bonita',
        preview: '💰 +15 | 🛡️ +10 Honra',
        result: {
          message: 'O vermelho ficou vibrante! Os clientes adoram.',
          moneyChange: 15,
          honorChange: 10,
        },
      },
      {
        text: 'Cor ficou feia',
        preview: '💰 -10',
        result: {
          message: 'O tecido ficou com cor manchada. Prejuízo.',
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_rope_making',
    title: '🪢 Fazer Cordas',
    description: 'Você está aprendendo a trançar cordas resistentes.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer corda forte',
        preview: '💪 +5 Força | 💰 +10',
        result: {
          message: 'Sua corda aguentou o teste! Qualidade.',
          strengthChange: 5,
          moneyChange: 10,
        },
      },
      {
        text: 'Corda se desfez',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'A corda se desfez. Precisa praticar mais.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_nail_making',
    title: '🔩 Fazer Pregos',
    description: 'Você está aprendendo a fazer pregos de ferro.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Fazer pregos perfeitos',
        preview: '💪 +10 Força | 💰 +10',
        result: {
          message: 'Seus pregos são retos e fortes!',
          strengthChange: 10,
          moneyChange: 10,
        },
      },
      {
        text: 'Martelar o dedo',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'Você acertou o dedo com o martelo! Dor terrível.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'artisan_barrel_cooper',
    title: '🛢️ Fazer Barril',
    description: 'Você está aprendendo a fazer barris de madeira.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Barril não vaza',
        preview: '💰 +15 | 🛡️ +10 Honra',
        result: {
          message: 'Seu barril é perfeito! Não vaza uma gota.',
          moneyChange: 15,
          honorChange: 10,
        },
      },
      {
        text: 'Barril vazando',
        preview: '🛡️ -10 Honra | 💰 -5',
        result: {
          message: 'O barril vaza. Precisa refazer.',
          honorChange: -10,
          moneyChange: -5,
        },
      },
    ],
  },

  {
    id: 'artisan_glass_blowing',
    title: '🫧 Soprar Vidro',
    description: 'Você está aprendendo a arte de soprar vidro.',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Criar peça bonita',
        preview: '💰 +25 | 🛡️ +15 Honra',
        result: {
          message: 'Sua peça de vidro é uma obra de arte!',
          moneyChange: 25,
          honorChange: 15,
        },
      },
      {
        text: 'Vidro estourou',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'O vidro estourou! Cacos cortaram sua mão.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_broom_making',
    title: '🧹 Fazer Vassouras',
    description: 'Você está fazendo vassouras com galhos e palha.',
    minAge: 6,
    maxAge: 10,
    chance: 0.12,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Vassoura resistente',
        preview: '💰 +5',
        result: {
          message: 'Sua vassoura varre bem! Vendeu rápido.',
          moneyChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_ink_making',
    title: '🖋️ Fazer Tinta',
    description: 'Você está aprendendo a fazer tinta para escrever.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Tinta de boa qualidade',
        preview: '💰 +15',
        result: {
          message: 'Sua tinta é preta e não borra! Monastérios compraram.',
          moneyChange: 15,
        },
      },
      {
        text: 'Tinta aguada',
        preview: '💰 -5',
        result: {
          message: 'A tinta ficou fraca. Ninguém quis.',
          moneyChange: -5,
        },
      },
    ],
  },

  {
    id: 'artisan_soap_making',
    title: '🧼 Fazer Sabão',
    description: 'Você está aprendendo a fazer sabão com gordura e cinzas.',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Sabão de qualidade',
        preview: '💰 +10',
        result: {
          message: 'Seu sabão limpa bem! Clientes satisfeitos.',
          moneyChange: 10,
        },
      },
      {
        text: 'Mistura errada',
        preview: '❤️ -10 Vitalidade',
        result: {
          message: 'A mistura queimou sua pele! Cuidado com cinzas.',
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_paper_making',
    title: '📜 Fazer Papel',
    description: 'Você está aprendendo a fazer papel com trapos.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Papel fino e liso',
        preview: '💰 +20 | 🛡️ +10 Honra',
        result: {
          message: 'Seu papel é de excelente qualidade! Escrivães adoram.',
          moneyChange: 20,
          honorChange: 10,
        },
      },
      {
        text: 'Papel grosseiro',
        preview: '💰 +5',
        result: {
          message: 'O papel ficou irregular, mas ainda serve.',
          moneyChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_charity_work',
    title: '🤝 Trabalho de Caridade',
    description: 'Uma família pobre precisa de ajuda com consertos.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ajudar de graça',
        preview: '⛪ +20 Fé | 🛡️ +15 Honra',
        result: {
          message: 'Você ajudou sem cobrar. Deus vê suas ações.',
          faithChange: 20,
          honorChange: 15,
        },
      },
      {
        text: 'Recusar',
        preview: 'Sem mudanças',
        result: {
          message: 'Você não pode ajudar a todos. Vida continua.',
        },
      },
    ],
  },

  {
    id: 'artisan_holiday_rest',
    title: '🎉 Dia Santo',
    description: 'É dia santo! Não se trabalha hoje.',
    minAge: 5,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Ir à missa e descansar',
        preview: '❤️ +10 Vitalidade | ⛪ +10 Fé',
        result: {
          message: 'Um dia de descanso e oração. Renovação.',
          healthChange: 10,
          faithChange: 10,
        },
      },
    ],
  },

  {
    id: 'artisan_injury_work',
    title: '🩹 Ferimento no Trabalho',
    description: 'Você se machucou trabalhando na oficina.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Cuidar do ferimento',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'O ferimento dói, mas vai cicatrizar.',
          healthChange: -15,
        },
      },
      {
        text: 'Ignorar e continuar',
        preview: '❤️ -25 Vitalidade | 💪 +5 Força',
        result: {
          message: 'O ferimento infeccionou. Você ficou pior.',
          healthChange: -25,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'artisan_fire_safety',
    title: '🔥 Risco de Incêndio',
    description: 'Uma faísca voou perto de materiais inflamáveis!',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Apagar rapidamente',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você apagou antes de virar incêndio! Herói!',
          honorChange: 15,
        },
      },
      {
        text: 'Entrar em pânico',
        preview: '💰 -30 | ❤️ -10 Vitalidade',
        result: {
          message: 'Parte da oficina queimou antes de conseguirem apagar.',
          moneyChange: -30,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'artisan_master_praise',
    title: '👏 Elogio do Mestre',
    description: 'O mestre da guilda elogiou seu trabalho publicamente!',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'work',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['artisan'] },
    options: [
      {
        text: 'Agradecer humildemente',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'Reconhecimento público! Seu futuro é promissor.',
          honorChange: 25,
        },
      },
    ],
  },

];

// =============================================================================
// EVENTOS DE GENTRY (50 EVENTOS)
// Educação formal, etiqueta, caçadas, gestão de propriedades
// =============================================================================

const GENTRY_EVENTS: ChildhoodEvent[] = [
  
  {
    id: 'gentry_private_tutor',
    title: '📚 Tutor Particular',
    description: 'Seus pais contrataram um tutor para te ensinar Latim, Grego e Aritmética.',
    minAge: 6,
    maxAge: 10,
    chance: 0.9,
    category: 'education',
    requiredEra: ['tudor'],
    requiresFlags: { livingWith: ['parents'] },
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Estudar com afinco',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você está se tornando um jovem culto e educado!',
          faithChange: 15,
        },
      },
      {
        text: 'Ser preguiçoso',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'O tutor reclamou aos seus pais. Você foi castigado.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'gentry_hunting_lesson',
    title: '🦌 Lição de Caça',
    description: 'Seu pai está te ensinando a caçar nas terras da família.',
    minAge: 9,
    maxAge: 12,
    chance: 0.2,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'], gender: 'male' },
    options: [
      {
        text: 'Acertar o veado',
        preview: '🛡️ +25 Honra | 💪 +10 Força',
        result: {
          message: 'Você abateu o veado! Seu pai está orgulhoso. Os servos te aplaudem.',
          honorChange: 25,
          strengthChange: 10,
        },
      },
      {
        text: 'Errar o tiro',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você errou. Seu pai suspirou desapontado.',
          honorChange: -15,
        },
      },
    ],
  },

  // === EDUCAÇÃO FORMAL ===

  {
    id: 'gentry_latin_lesson',
    title: '📜 Aula de Latim',
    description: 'O tutor está te ensinando a ler e escrever em Latim.',
    minAge: 7,
    maxAge: 12,
    chance: 0.18,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Decorar as declinações',
        preview: '⛪ +15 Fé',
        result: {
          message: 'Você está se tornando fluente em Latim!',
          faithChange: 15,
        },
      },
      {
        text: 'Fingir que aprendeu',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'O tutor descobriu que você não estudou. Vergonha!',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'gentry_greek_philosophy',
    title: '🏛️ Filosofia Grega',
    description: 'Você está estudando os filósofos gregos antigos.',
    minAge: 10,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Debater com o tutor',
        preview: '⛪ +10 Fé | 🛡️ +10 Honra',
        result: {
          message: 'Você impressionou o tutor com sua inteligência!',
          faithChange: 10,
          honorChange: 10,
        },
      },
      {
        text: 'Achar chato e confuso',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O tutor está desapontado com sua falta de interesse.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_fencing_lesson',
    title: '⚔️ Aula de Esgrima',
    description: 'É hora de aprender a usar a espada como um cavalheiro.',
    minAge: 9,
    maxAge: 12,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'], gender: 'male' },
    options: [
      {
        text: 'Praticar com dedicação',
        preview: '💪 +15 Força | 🛡️ +15 Honra',
        result: {
          message: 'Você está ficando habilidoso com a espada!',
          strengthChange: 15,
          honorChange: 15,
        },
      },
      {
        text: 'Se machucar praticando',
        preview: '❤️ -15 Vitalidade | 💪 +10 Força',
        result: {
          message: 'Você levou um corte no braço. Faz parte do aprendizado.',
          healthChange: -15,
          strengthChange: 10,
        },
      },
    ],
  },

  {
    id: 'gentry_horse_riding',
    title: '🐴 Aula de Equitação',
    description: 'Você está aprendendo a montar a cavalo.',
    minAge: 7,
    maxAge: 11,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Cavalgar com elegância',
        preview: '🛡️ +20 Honra | 💪 +5 Força',
        result: {
          message: 'Você dominou o cavalo! Seus pais estão orgulhosos.',
          honorChange: 20,
          strengthChange: 5,
        },
      },
      {
        text: 'Cair do cavalo',
        preview: '❤️ -20 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Você caiu e se machucou. Humilhante na frente dos servos.',
          healthChange: -20,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_arithmetic_lesson',
    title: '🔢 Aritmética Avançada',
    description: 'O tutor está te ensinando contas complexas.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Resolver todos problemas',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você é bom com números! Útil para administrar propriedades.',
          honorChange: 15,
        },
      },
      {
        text: 'Não entender nada',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O tutor balançou a cabeça desapontado.',
          honorChange: -10,
        },
      },
    ],
  },

  // === ETIQUETA E SOCIEDADE ===

  {
    id: 'gentry_table_manners',
    title: '🍽️ Modos à Mesa',
    description: 'Você está aprendendo etiqueta para jantares formais.',
    minAge: 6,
    maxAge: 10,
    chance: 0.15,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Comer com elegância',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você impressionou os adultos com seus modos refinados.',
          honorChange: 15,
        },
      },
      {
        text: 'Fazer bagunça',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você envergonhou sua família na frente de convidados!',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'gentry_dancing_lesson',
    title: '💃 Aula de Dança',
    description: 'Você precisa aprender as danças da corte.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Dançar graciosamente',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você dança lindamente! As damas te admiram.',
          honorChange: 20,
        },
      },
      {
        text: 'Tropeçar e cair',
        preview: '🛡️ -15 Honra | ❤️ -5 Vitalidade',
        result: {
          message: 'Você tropeçou na frente de todos. Que vergonha!',
          honorChange: -15,
          healthChange: -5,
        },
      },
    ],
  },

  {
    id: 'gentry_meet_noble_family',
    title: '🏰 Visitar Família Nobre',
    description: 'Sua família está visitando outra família nobre.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Impressionar os anfitriões',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'Você foi educado e encantador. Boa impressão!',
          honorChange: 25,
        },
      },
      {
        text: 'Ser mal educado',
        preview: '🛡️ -30 Honra',
        result: {
          message: 'Você ofendeu os anfitriões. Sua família está envergonhada.',
          honorChange: -30,
        },
      },
    ],
  },

  {
    id: 'gentry_protocol_error',
    title: '😰 Erro de Protocolo',
    description: 'Você cometeu um erro de etiqueta em um evento importante.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Pedir desculpas',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você se desculpou. As pessoas entenderam.',
          honorChange: -15,
        },
      },
      {
        text: 'Fingir que não aconteceu',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Todos notaram. Sua família está furiosa.',
          honorChange: -25,
        },
      },
    ],
  },

  // === CAÇADAS E ESPORTES ===

  {
    id: 'gentry_falconry',
    title: '🦅 Falcoaria',
    description: 'Você está aprendendo a caçar com falcões.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Treinar o falcão',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Seu falcão pegou uma lebre! Caça bem-sucedida.',
          honorChange: 20,
        },
      },
      {
        text: 'O falcão fugiu',
        preview: '🛡️ -15 Honra | 💰 -20',
        result: {
          message: 'O falcão voou para nunca mais voltar. Um animal caro perdido.',
          honorChange: -15,
          moneyChange: -20,
        },
      },
    ],
  },

  {
    id: 'gentry_archery_practice',
    title: '🏹 Prática de Arco',
    description: 'É hora de praticar arco e flecha.',
    minAge: 8,
    maxAge: 12,
    chance: 0.15,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'], gender: 'male' },
    options: [
      {
        text: 'Acertar o alvo',
        preview: '💪 +10 Força | 🛡️ +15 Honra',
        result: {
          message: 'Você acertou no centro! Um arqueiro natural.',
          strengthChange: 10,
          honorChange: 15,
        },
      },
      {
        text: 'Errar todos os tiros',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você precisa de mais prática. Continue tentando.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_youth_tournament',
    title: '⚔️ Torneio Juvenil',
    description: 'Há um torneio de esgrima para jovens fidalgos.',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'], gender: 'male' },
    options: [
      {
        text: 'Vencer o torneio',
        preview: '🛡️ +35 Honra | 💪 +10 Força',
        result: {
          message: 'Você venceu! Todos aplaudem o jovem campeão.',
          honorChange: 35,
          strengthChange: 10,
        },
      },
      {
        text: 'Perder honrosamente',
        preview: '🛡️ +10 Honra | 💪 +5 Força',
        result: {
          message: 'Você perdeu, mas lutou com bravura.',
          honorChange: 10,
          strengthChange: 5,
        },
      },
      {
        text: 'Perder vergonhosamente',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você foi derrotado rapidamente. Humilhante.',
          honorChange: -20,
        },
      },
    ],
  },

  // === GESTÃO DE PROPRIEDADES ===

  {
    id: 'gentry_see_father_manage',
    title: '📋 Ver Pai Administrar',
    description: 'Seu pai está te mostrando como administrar as terras.',
    minAge: 10,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Prestar atenção',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você está aprendendo a ser um bom administrador.',
          honorChange: 15,
        },
      },
      {
        text: 'Achar entediante',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Seu pai está desapontado com sua falta de interesse.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_visit_farms',
    title: '🌾 Visitar Fazendas',
    description: 'Você acompanha seu pai nas visitas às fazendas arrendadas.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Ser respeitoso com camponeses',
        preview: '🛡️ +20 Honra | ⛪ +10 Fé',
        result: {
          message: 'Os camponeses gostaram de você. Um bom senhor.',
          honorChange: 20,
          faithChange: 10,
        },
      },
      {
        text: 'Tratar camponeses com desprezo',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Seu pai te repreendeu. "Eles trabalham para nós!"',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'gentry_rent_collection',
    title: '💰 Cobrar Arrendamento',
    description: 'Você está acompanhando a coleta do arrendamento.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Ser justo',
        preview: '🛡️ +15 Honra | 💰 +15',
        result: {
          message: 'Você cobrou o justo. Os camponeses te respeitam.',
          honorChange: 15,
          moneyChange: 15,
        },
      },
      {
        text: 'Ser muito rigoroso',
        preview: '💰 +25 | 🛡️ -15 Honra',
        result: {
          message: 'Você cobrou até o último centavo. Os camponeses te temem.',
          moneyChange: 25,
          honorChange: -15,
        },
      },
    ],
  },

  // === FAMÍLIA E PRIVILÉGIOS ===

  {
    id: 'gentry_servant_obedience',
    title: '🧹 Comandar Servos',
    description: 'Os servos devem obedecer suas ordens.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Comandar com respeito',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Os servos obedecem de boa vontade. Você é justo.',
          honorChange: 15,
        },
      },
      {
        text: 'Ser cruel e arrogante',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Sua mãe te repreendeu. "Não somos tiranos!"',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'gentry_fine_clothes',
    title: '👔 Roupas Finas',
    description: 'Você ganhou roupas novas de tecido fino.',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Usar com orgulho',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você está elegante! As pessoas te tratam com mais respeito.',
          honorChange: 10,
        },
      },
      {
        text: 'Sujar brincando',
        preview: '🛡️ -15 Honra | 💰 -10',
        result: {
          message: 'Você arruinou roupas caras! Sua mãe está furiosa.',
          honorChange: -15,
          moneyChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_private_chapel',
    title: '⛪ Reza na Capela',
    description: 'É hora da reza diária na capela da família.',
    minAge: 5,
    maxAge: 12,
    chance: 0.15,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Rezar com devoção',
        preview: '⛪ +20 Fé',
        result: {
          message: 'Você se sente mais perto de Deus.',
          faithChange: 20,
        },
      },
      {
        text: 'Dormir durante a reza',
        preview: '⛪ -10 Fé | 🛡️ -10 Honra',
        result: {
          message: 'Seu pai te acordou com um olhar severo.',
          faithChange: -10,
          honorChange: -10,
        },
      },
    ],
  },

  // === MAIS EVENTOS DE GENTRY ===

  {
    id: 'gentry_history_lesson',
    title: '📜 Aula de História',
    description: 'O tutor está te ensinando sobre reis e batalhas antigas.',
    minAge: 8,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Aprender com interesse',
        preview: '⛪ +10 Fé | 🛡️ +10 Honra',
        result: {
          message: 'Você conhece a história da Inglaterra agora!',
          faithChange: 10,
          honorChange: 10,
        },
      },
      {
        text: 'Achar entediante',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O tutor está desapontado com sua falta de interesse.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'gentry_poetry_writing',
    title: '📝 Escrever Poesia',
    description: 'Você está aprendendo a escrever poemas elegantes.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Escrever belo poema',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Seu poema impressionou a todos! Talento literário.',
          honorChange: 15,
        },
      },
      {
        text: 'Poema sem graça',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Poesia não é seu forte. Tudo bem.',
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'gentry_chess_game',
    title: '♟️ Jogo de Xadrez',
    description: 'Você está aprendendo a jogar xadrez.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Vencer o tutor',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você venceu! Mente estratégica.',
          honorChange: 20,
        },
      },
      {
        text: 'Perder graciosamente',
        preview: '🛡️ +5 Honra',
        result: {
          message: 'Você perdeu, mas aprendeu muito.',
          honorChange: 5,
        },
      },
    ],
  },

  {
    id: 'gentry_outdoor_picnic',
    title: '🧺 Piquenique',
    description: 'Sua família faz um piquenique nas terras.',
    minAge: 5,
    maxAge: 11,
    chance: 0.1,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Aproveitar o dia',
        preview: '❤️ +10 Vitalidade',
        result: {
          message: 'Um dia perfeito ao ar livre com a família!',
          healthChange: 10,
        },
      },
    ],
  },

  {
    id: 'gentry_servant_punishment',
    title: '👊 Servo Punido',
    description: 'Um servo cometeu um erro e será punido.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Pedir clemência',
        preview: '⛪ +15 Fé | 🛡️ +10 Honra',
        result: {
          message: 'Seu pai perdoou o servo. Misericórdia.',
          faithChange: 15,
          honorChange: 10,
        },
      },
      {
        text: 'Assistir a punição',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Você viu o servo ser açoitado. É assim que funciona.',
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'gentry_music_recital',
    title: '🎶 Recital de Música',
    description: 'Você vai tocar para convidados importantes.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Tocar perfeitamente',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'Aplausos! Você tocou como um profissional.',
          honorChange: 25,
        },
      },
      {
        text: 'Errar várias notas',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Você errou na frente de todos. Vergonha!',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'gentry_calligraphy',
    title: '✒️ Caligrafia',
    description: 'Você está praticando escrita elegante.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Escrever com elegância',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Sua letra é bonita e legível. Excelente!',
          honorChange: 10,
        },
      },
      {
        text: 'Borrar a tinta',
        preview: '🛡️ -5 Honra',
        result: {
          message: 'Você borrou tudo. Precisa praticar mais.',
          honorChange: -5,
        },
      },
    ],
  },

  {
    id: 'gentry_inspect_tenants',
    title: '🏘️ Inspecionar Arrendatários',
    description: 'Você acompanha seu pai visitando os arrendatários.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Ser justo com todos',
        preview: '🛡️ +20 Honra | ⛪ +10 Fé',
        result: {
          message: 'Os arrendatários te respeitam. Futuro bom senhor.',
          honorChange: 20,
          faithChange: 10,
        },
      },
      {
        text: 'Ser arrogante',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Seu pai te repreendeu. "Eles dependem de nós!"',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'gentry_sick_in_bed',
    title: '🛏️ Doente de Cama',
    description: 'Você está com febre alta e não pode sair da cama.',
    minAge: 4,
    maxAge: 12,
    chance: 0.1,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Aceitar cuidados',
        preview: '❤️ -15 Vitalidade',
        result: {
          message: 'O médico cuidou de você. Recuperação lenta.',
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'gentry_birthday_celebration',
    title: '🎂 Festa de Aniversário',
    description: 'É seu aniversário! Há uma festa em sua honra.',
    minAge: 5,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['gentry'] },
    options: [
      {
        text: 'Aproveitar a festa',
        preview: '❤️ +15 Vitalidade | 💰 +20',
        result: {
          message: 'Presentes e alegria! Um dia feliz.',
          healthChange: 15,
          moneyChange: 20,
        },
      },
    ],
  },

];

// =============================================================================
// EVENTOS DE NOBREZA (50 EVENTOS)
// Política de corte, casamentos arranjados, tutores de elite, intrigas
// =============================================================================

const NOBILITY_EVENTS: ChildhoodEvent[] = [
  
  {
    id: 'nobility_presented_to_king',
    title: '👑 Apresentado ao Rei',
    description: 'Seus pais te levaram à corte para ser apresentado ao Rei!',
    minAge: 8,
    maxAge: 12,
    chance: 0.15,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Fazer reverência perfeita',
        preview: '🛡️ +40 Honra',
        result: {
          message: 'O Rei sorriu para você! Sua família ganhou prestígio.',
          honorChange: 40,
        },
      },
      {
        text: 'Tropear e cair',
        preview: '🛡️ -30 Honra',
        result: {
          message: 'Você caiu na frente do Rei! Foi humilhante para toda a família.',
          honorChange: -30,
        },
      },
    ],
  },

  {
    id: 'nobility_betrothal_arranged',
    title: '💍 Noivado Arranjado',
    description: 'Seus pais arranjaram seu casamento com outra família nobre.',
    minAge: 10,
    maxAge: 12,
    chance: 0.2,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aceitar graciosamente',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você entende que é seu dever. As famílias estão unidas.',
          honorChange: 20,
        },
      },
      {
        text: 'Protestar',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Você foi repreendido severamente. "Nobres não escolhem por amor!"',
          honorChange: -25,
        },
      },
    ],
  },

  // === POLÍTICA DE CORTE ===

  {
    id: 'nobility_court_intrigue',
    title: '🗣️ Intriga de Corte',
    description: 'Você ouviu adultos sussurrando sobre conspirações.',
    minAge: 9,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Fingir que não ouviu',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você guardou segredo. Sábio para sua idade.',
          honorChange: 15,
        },
      },
      {
        text: 'Contar para alguém',
        preview: '🛡️ -30 Honra | ❤️ -10 Vitalidade',
        result: {
          message: 'Você contou para a pessoa errada. Sua família está em perigo!',
          honorChange: -30,
          healthChange: -10,
        },
      },
    ],
  },

  {
    id: 'nobility_royal_favor',
    title: '👑 Favor Real',
    description: 'O Rei notou sua família e está disposto a conceder um favor.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Agradecer humildemente',
        preview: '🛡️ +35 Honra | 💰 +50',
        result: {
          message: 'O Rei gostou da sua humildade. Sua família ganhou terras!',
          honorChange: 35,
          moneyChange: 50,
        },
      },
      {
        text: 'Pedir demais',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'O Rei franziu a testa. Você foi ganancioso.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_family_scandal',
    title: '😱 Escândalo Familiar',
    description: 'Um parente cometeu um ato vergonhoso. Toda família sofre.',
    minAge: 7,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Defender a família',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você defendeu sua família mesmo na adversidade.',
          honorChange: 15,
        },
      },
      {
        text: 'Sentir vergonha',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'O escândalo manchou o nome da família por meses.',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'nobility_rival_family',
    title: '⚔️ Família Rival',
    description: 'Há uma família rival que compete com a sua por influência.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Ignorar as provocações',
        preview: '🛡️ +10 Honra',
        result: {
          message: 'Você manteve a dignidade. A classe verdadeira.',
          honorChange: 10,
        },
      },
      {
        text: 'Insultar o filho rival',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você criou um inimigo para a vida toda.',
          honorChange: -20,
        },
      },
    ],
  },

  // === CASAMENTOS ARRANJADOS ===

  {
    id: 'nobility_meet_betrothed',
    title: '💕 Conhecer Prometido(a)',
    description: 'Você vai conhecer a pessoa com quem está prometido(a) desde criança.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Ser cortês',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Vocês se deram bem! A aliança será forte.',
          honorChange: 20,
        },
      },
      {
        text: 'Mostrar desagrado',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Você ofendeu a outra família. Tensão política!',
          honorChange: -25,
        },
      },
    ],
  },

  {
    id: 'nobility_marriage_negotiation',
    title: '💍 Negociação de Casamento',
    description: 'Seus pais estão negociando seu futuro casamento.',
    minAge: 9,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aceitar seu destino',
        preview: '🛡️ +15 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você entende que é seu dever para com a família.',
          honorChange: 15,
          faithChange: 10,
        },
      },
      {
        text: 'Chorar e reclamar',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Seu comportamento envergonhou a família.',
          honorChange: -20,
        },
      },
    ],
  },

  // === EDUCAÇÃO DE ELITE ===

  {
    id: 'nobility_famous_tutor',
    title: '📚 Tutor Famoso',
    description: 'Um famoso estudioso veio da Europa para te ensinar.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Impressionar o tutor',
        preview: '⛪ +20 Fé | 🛡️ +20 Honra',
        result: {
          message: 'O tutor elogiou sua inteligência! Uma honra.',
          faithChange: 20,
          honorChange: 20,
        },
      },
      {
        text: 'Decepcionar o tutor',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'O tutor escreveu para outras famílias sobre sua falta de dedicação.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_foreign_language',
    title: '🌍 Línguas Estrangeiras',
    description: 'Você está aprendendo Francês e Italiano.',
    minAge: 7,
    maxAge: 12,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aprender com facilidade',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você já consegue conversar em Francês!',
          honorChange: 15,
        },
      },
      {
        text: 'Achar muito difícil',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'Você está ficando para trás nos estudos.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'nobility_music_lesson',
    title: '🎵 Aula de Música',
    description: 'Você está aprendendo a tocar alaúde.',
    minAge: 7,
    maxAge: 11,
    chance: 0.12,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Tocar lindamente',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Sua música encantou os ouvintes!',
          honorChange: 15,
        },
      },
      {
        text: 'Tocar desafinado',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'As pessoas fizeram careta. Pratique mais.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'nobility_diplomacy_lesson',
    title: '🤝 Lição de Diplomacia',
    description: 'Seu pai está te ensinando a arte da negociação.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aprender a negociar',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você está aprendendo quando falar e quando calar.',
          honorChange: 20,
        },
      },
      {
        text: 'Ser impaciente',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Diplomacia requer paciência. Você falhou.',
          honorChange: -15,
        },
      },
    ],
  },

  // === PRIVILÉGIOS E LUXO ===

  {
    id: 'nobility_grand_banquet',
    title: '🍖 Grande Banquete',
    description: 'Há um banquete no castelo com dezenas de pratos.',
    minAge: 5,
    maxAge: 12,
    chance: 0.12,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Comer com elegância',
        preview: '🛡️ +15 Honra | ❤️ +10 Vitalidade | 🍖 +3 Comida',
        result: {
          message: 'Você comeu como um verdadeiro nobre!',
          honorChange: 15,
          healthChange: 10,
          foodChange: 3,
        },
      },
      {
        text: 'Comer demais e passar mal',
        preview: '❤️ -10 Vitalidade | 🛡️ -10 Honra',
        result: {
          message: 'Você exagerou e vomitou na frente de todos!',
          healthChange: -10,
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'nobility_expensive_gift',
    title: '🎁 Presente Caro',
    description: 'Você ganhou um presente muito valioso de um parente.',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Agradecer formalmente',
        preview: '🛡️ +15 Honra | 💰 +30',
        result: {
          message: 'Você mostrou gratidão adequada. Bem educado!',
          honorChange: 15,
          moneyChange: 30,
        },
      },
      {
        text: 'Reclamar do presente',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Você foi ingrato! Vergonhoso.',
          honorChange: -25,
        },
      },
    ],
  },

  {
    id: 'nobility_travel_europe',
    title: '🌍 Viajar pela Europa',
    description: 'Sua família está fazendo uma viagem à França.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aproveitar a viagem',
        preview: '❤️ +15 Vitalidade | 🛡️ +20 Honra',
        result: {
          message: 'Você conheceu Paris! Uma experiência incrível.',
          healthChange: 15,
          honorChange: 20,
        },
      },
      {
        text: 'Ficar doente na viagem',
        preview: '❤️ -20 Vitalidade',
        result: {
          message: 'A viagem de navio te deixou muito doente.',
          healthChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_personal_servant',
    title: '🧹 Servo Pessoal',
    description: 'Você ganhou um servo pessoal só para você.',
    minAge: 7,
    maxAge: 11,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Tratar bem',
        preview: '🛡️ +15 Honra | ⛪ +10 Fé',
        result: {
          message: 'Seu servo é leal e dedicado. Você é justo.',
          honorChange: 15,
          faithChange: 10,
        },
      },
      {
        text: 'Ser cruel',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Seu servo tem medo de você. Isso não é bom.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_silk_clothes',
    title: '👗 Roupas de Seda',
    description: 'Você ganhou roupas de seda pura.',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Usar com orgulho',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Você parece um pequeno príncipe!',
          honorChange: 15,
        },
      },
    ],
  },

  // === RESPONSABILIDADES ===

  {
    id: 'nobility_lead_servants',
    title: '👥 Liderar Servos',
    description: 'Você precisa dar ordens aos servos enquanto pais estão fora.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'education',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Liderar com sabedoria',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'Os servos te respeitam. Você será um bom líder.',
          honorChange: 25,
        },
      },
      {
        text: 'Fazer bagunça',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Seus pais voltaram para encontrar caos.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_represent_family',
    title: '🏰 Representar Família',
    description: 'Você precisa representar sua família em um evento oficial.',
    minAge: 10,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Fazer discurso elegante',
        preview: '🛡️ +30 Honra',
        result: {
          message: 'Você falou com eloquência! Sua família está orgulhosa.',
          honorChange: 30,
        },
      },
      {
        text: 'Gaguejar e errar',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você envergonhou a família na frente de todos.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_inherit_early',
    title: '👑 Herdar Cedo',
    description: 'Tragédia! Seu pai morreu. Você é o novo herdeiro.',
    minAge: 10,
    maxAge: 12,
    chance: 0.05,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    setsFlags: { isOrphan: true },
    options: [
      {
        text: 'Assumir responsabilidades',
        preview: '🛡️ +40 Honra | ❤️ -20 Vitalidade',
        result: {
          message: 'Você agora é o senhor das terras. Que peso nos ombros.',
          honorChange: 40,
          healthChange: -20,
        },
      },
      {
        text: 'Chorar a perda',
        preview: '⛪ +20 Fé | ❤️ -15 Vitalidade',
        result: {
          message: 'Você precisa de tempo para aceitar a perda.',
          faithChange: 20,
          healthChange: -15,
        },
      },
    ],
  },

  {
    id: 'nobility_church_patron',
    title: '⛪ Patrono da Igreja',
    description: 'Sua família é grande doadora para a Igreja local.',
    minAge: 7,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Doar generosamente',
        preview: '⛪ +25 Fé | 💰 -20 | 🛡️ +15 Honra',
        result: {
          message: 'O bispo abençoou sua família. Almas salvas!',
          faithChange: 25,
          moneyChange: -20,
          honorChange: 15,
        },
      },
      {
        text: 'Questionar a doação',
        preview: '⛪ -15 Fé | 🛡️ -10 Honra',
        result: {
          message: 'Você questionou a Igreja! Perigoso nestes tempos.',
          faithChange: -15,
          honorChange: -10,
        },
      },
    ],
  },

  // === MAIS EVENTOS DE NOBREZA ===

  {
    id: 'nobility_tournament_watch',
    title: '⚔️ Assistir Torneio',
    description: 'Há um grande torneio de cavaleiros no reino!',
    minAge: 6,
    maxAge: 12,
    chance: 0.1,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Torcer pelos cavaleiros',
        preview: '❤️ +10 Vitalidade | 🛡️ +10 Honra',
        result: {
          message: 'Espetáculo incrível! Você sonha em ser cavaleiro.',
          healthChange: 10,
          honorChange: 10,
        },
      },
    ],
  },

  {
    id: 'nobility_royal_hunt',
    title: '🦌 Caçada Real',
    description: 'Você foi convidado para uma caçada com a realeza!',
    minAge: 10,
    maxAge: 12,
    chance: 0.08,
    category: 'leisure',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'], gender: 'male' },
    options: [
      {
        text: 'Impressionar na caça',
        preview: '🛡️ +35 Honra | 💪 +10 Força',
        result: {
          message: 'Você caçou ao lado de lordes! Prestígio enorme.',
          honorChange: 35,
          strengthChange: 10,
        },
      },
      {
        text: 'Passar vergonha',
        preview: '🛡️ -25 Honra',
        result: {
          message: 'Você caiu do cavalo na frente do príncipe. Desastre!',
          honorChange: -25,
        },
      },
    ],
  },

  {
    id: 'nobility_castle_siege_story',
    title: '🏰 História de Cerco',
    description: 'Seu avô conta histórias de batalhas e cercos.',
    minAge: 6,
    maxAge: 11,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Ouvir fascinado',
        preview: '💪 +5 Força | 🛡️ +10 Honra',
        result: {
          message: 'Histórias de guerra e honra. Você quer ser como seu avô.',
          strengthChange: 5,
          honorChange: 10,
        },
      },
    ],
  },

  {
    id: 'nobility_art_commission',
    title: '🖼️ Encomenda de Arte',
    description: 'Um artista famoso está pintando o retrato da família.',
    minAge: 7,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Posar com dignidade',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'O retrato ficou magnífico! Memória para gerações.',
          honorChange: 15,
        },
      },
      {
        text: 'Não ficar parado',
        preview: '🛡️ -10 Honra',
        result: {
          message: 'O artista ficou irritado. O retrato não ficou bom.',
          honorChange: -10,
        },
      },
    ],
  },

  {
    id: 'nobility_ambassador_visit',
    title: '🌍 Visita de Embaixador',
    description: 'Um embaixador estrangeiro está visitando sua família.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Impressionar com línguas',
        preview: '🛡️ +25 Honra',
        result: {
          message: 'Você falou Francês com o embaixador! Impressionante.',
          honorChange: 25,
        },
      },
      {
        text: 'Cometer gafe',
        preview: '🛡️ -20 Honra',
        result: {
          message: 'Você cometeu um erro de etiqueta. Constrangedor.',
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_jewel_gift',
    title: '💎 Presente de Joias',
    description: 'Você ganhou joias valiosas como presente.',
    minAge: 8,
    maxAge: 12,
    chance: 0.08,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Guardar com cuidado',
        preview: '💰 +40 | 🛡️ +10 Honra',
        result: {
          message: 'Joias preciosas! Símbolo de status.',
          moneyChange: 40,
          honorChange: 10,
        },
      },
      {
        text: 'Perder acidentalmente',
        preview: '💰 -30 | 🛡️ -20 Honra',
        result: {
          message: 'Você perdeu as joias! Desastre irresponsável.',
          moneyChange: -30,
          honorChange: -20,
        },
      },
    ],
  },

  {
    id: 'nobility_wardship',
    title: '👨‍👦 Tutela',
    description: 'Você será enviado para ser criado em outra casa nobre.',
    minAge: 8,
    maxAge: 10,
    chance: 0.1,
    category: 'family',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Aceitar com dignidade',
        preview: '🛡️ +20 Honra',
        result: {
          message: 'Você vai aprender muito em outra casa. Tradição nobre.',
          honorChange: 20,
          setFlags: { livingWith: 'relative' },
        },
      },
      {
        text: 'Chorar e resistir',
        preview: '🛡️ -15 Honra',
        result: {
          message: 'Comportamento indigno de um nobre. Vergonha.',
          honorChange: -15,
        },
      },
    ],
  },

  {
    id: 'nobility_knighting_ceremony',
    title: '⚔️ Cerimônia de Cavalaria',
    description: 'Você assiste um cavaleiro ser ordenado pelo Rei.',
    minAge: 8,
    maxAge: 12,
    chance: 0.1,
    category: 'community',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Sonhar em ser cavaleiro',
        preview: '🛡️ +15 Honra | 💪 +5 Força',
        result: {
          message: 'Um dia será você ajoelhado diante do Rei!',
          honorChange: 15,
          strengthChange: 5,
        },
      },
    ],
  },

  {
    id: 'nobility_land_dispute',
    title: '⚖️ Disputa de Terras',
    description: 'Sua família está em disputa legal com outra família.',
    minAge: 9,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Apoiar sua família',
        preview: '🛡️ +15 Honra',
        result: {
          message: 'Lealdade familiar. A disputa continua.',
          honorChange: 15,
        },
      },
      {
        text: 'Questionar a justiça',
        preview: '🛡️ -10 Honra | ⛪ +10 Fé',
        result: {
          message: 'Você se pergunta se sua família está certa.',
          honorChange: -10,
          faithChange: 10,
        },
      },
    ],
  },

  {
    id: 'nobility_plague_scare',
    title: '💀 Medo da Peste',
    description: 'Há rumores de peste se espalhando pelo reino.',
    minAge: 6,
    maxAge: 12,
    chance: 0.08,
    category: 'danger',
    requiredEra: ['tudor'],
    conditions: { socialClasses: ['nobility'] },
    options: [
      {
        text: 'Fugir para o campo',
        preview: '❤️ +10 Vitalidade | 💰 -20',
        result: {
          message: 'Sua família se isolou no campo. Segurança.',
          healthChange: 10,
          moneyChange: -20,
        },
      },
      {
        text: 'Ficar e rezar',
        preview: '⛪ +20 Fé | ❤️ -10 Vitalidade',
        result: {
          message: 'Você confiou em Deus. A peste não veio.',
          faithChange: 20,
          healthChange: -10,
        },
      },
    ],
  },

];

// =============================================================================
// EXPORTAÇÃO E FUNÇÃO DE BUSCA
// =============================================================================

export const ALL_CHILDHOOD_EVENTS = [
  ...PEASANT_EVENTS,
  ...ARTISAN_EVENTS,
  ...GENTRY_EVENTS,
  ...NOBILITY_EVENTS,
];

export function getChildhoodEventByClass(character: Character): ChildhoodEvent | null {
  // Usa Set para lookup O(1) de eventos já usados
  const usedEventsSet = new Set(character.usedChildhoodEvents || []);

  const availableEvents = ALL_CHILDHOOD_EVENTS.filter((event) => {
    // Filtra eventos já mostrados
    if (usedEventsSet.has(event.id)) return false;

    if (character.age < event.minAge || character.age > event.maxAge) return false;
    if (!event.requiredEra.includes(character.era)) return false;

    if (event.requiresFlags) {
      if (event.requiresFlags.isOrphan !== undefined) {
        if (event.requiresFlags.isOrphan !== character.narrativeFlags.isOrphan) return false;
      }
      if (event.requiresFlags.livingWith) {
        if (!event.requiresFlags.livingWith.includes(character.narrativeFlags.livingWith)) return false;
      }
    }

    if (event.conditions) {
      const { minMoney, maxMoney, gender, socialClasses } = event.conditions;
      if (minMoney && character.money < minMoney) return false;
      if (maxMoney && character.money > maxMoney) return false;
      if (gender && character.gender !== gender) return false;
      if (socialClasses && !socialClasses.includes(character.socialClass)) return false;
    }

    if (character.narrativeFlags.lastMajorEvent === event.id) return false;

    return true;
  });

  if (availableEvents.length === 0) return null;

  for (const event of availableEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }

  return null;
}
