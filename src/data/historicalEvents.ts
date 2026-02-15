/**
 * EVENTOS HISTÓRICOS REAIS
 * Eventos que PODEM acontecer em anos específicos, dependendo das condições
 */

import type { Character } from '../types/game.types';

export interface HistoricalEvent {
  id: string;
  year: number;
  location: string;
  title: string;
  description: string;
  
  // Condições para o evento aparecer
  conditions?: {
    minAge?: number;
    maxAge?: number;
    gender?: 'male' | 'female';
    minMoney?: number;
    maxMoney?: number;
  };
  
  // Opções disponíveis
  options: {
    text: string;
    result: {
      message: string;
      healthChange?: number;
      sanityChange?: number;
      honorChange?: number;
      moneyChange?: number;
      foodChange?: number;
      death?: boolean;
    };
  }[];
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // =====================
  // INGLATERRA
  // =====================
  
  // 1666 - Grande Incêndio de Londres
  {
    id: 'great_fire_london',
    year: 1666,
    location: 'Inglaterra',
    title: '🔥 O Grande Incêndio de Londres',
    description: 'Um incêndio devastador começou na padaria de Thomas Farriner e está consumindo a cidade!',
    options: [
      {
        text: 'Fugir da cidade imediatamente',
        result: {
          message: 'Você escapou, mas perdeu todos os seus pertences.',
          moneyChange: -50,
          sanityChange: -15,
        },
      },
      {
        text: 'Tentar salvar sua casa',
        result: {
          message: 'Você conseguiu salvar alguns pertences, mas se feriu no processo.',
          healthChange: -20,
          moneyChange: -30,
        },
      },
    ],
  },

  // 1805 - Guerras Napoleônicas (Trafalgar)
  {
    id: 'napoleonic_wars',
    year: 1805,
    location: 'Inglaterra',
    title: '⚔️ Guerras Napoleônicas',
    description: 'A Marinha Real está recrutando para lutar contra Napoleão Bonaparte.',
    conditions: {
      minAge: 16,
      maxAge: 40,
      gender: 'male',
    },
    options: [
      {
        text: 'Alistar-se na Marinha',
        result: {
          message: 'Você serviu com honra na Batalha de Trafalgar. Nelson morreu, mas vencemos!',
          honorChange: 30,
          healthChange: -10,
          moneyChange: 20,
        },
      },
      {
        text: 'Pagar alguém para ir no seu lugar',
        result: {
          message: 'Você pagou um substituto e evitou a guerra.',
          moneyChange: -100,
          honorChange: -10,
        },
      },
      {
        text: 'Fugir para o interior',
        result: {
          message: 'Você é agora considerado desertor.',
          honorChange: -30,
          sanityChange: -10,
        },
      },
    ],
  },

  // 1914 - Primeira Guerra Mundial
  {
    id: 'wwi_england',
    year: 1914,
    location: 'Inglaterra',
    title: '💣 A Grande Guerra Começou',
    description: 'A Primeira Guerra Mundial estourou. O país está recrutando soldados.',
    conditions: {
      minAge: 18,
      maxAge: 41,
      gender: 'male',
    },
    options: [
      {
        text: 'Alistar-se voluntariamente',
        result: {
          message: 'Você foi para as trincheiras da França. Sobreviveu, mas ficou traumatizado.',
          healthChange: -30,
          sanityChange: -40,
          honorChange: 25,
        },
      },
      {
        text: 'Tentar objeção de consciência',
        result: {
          message: 'Você foi preso e humilhado publicamente como covarde.',
          honorChange: -50,
          sanityChange: -20,
        },
      },
    ],
  },

  // 1940 - Segunda Guerra Mundial (Blitz)
  {
    id: 'wwii_blitz',
    year: 1940,
    location: 'Inglaterra',
    title: '✈️ The Blitz - Bombardeios de Londres',
    description: 'A Luftwaffe alemã está bombardeando Londres todas as noites.',
    options: [
      {
        text: 'Refugiar-se no metrô',
        result: {
          message: 'Você passou meses dormindo nas estações do Underground.',
          sanityChange: -15,
          healthChange: -5,
        },
      },
      {
        text: 'Evacuar para o campo',
        result: {
          message: 'Você se mudou para o interior e ficou em segurança.',
          moneyChange: -20,
        },
      },
    ],
  },

  // =====================
  // AMÉRICA DO NORTE (EUA)
  // =====================

  // 1607-1620 - Fome Colonial
  {
    id: 'starving_time',
    year: 1609,
    location: 'América do Norte',
    title: '💀 O Tempo da Fome',
    description: 'O inverno de 1609-1610 é brutal. A colônia está morrendo de fome.',
    options: [
      {
        text: 'Racionamento extremo',
        result: {
          message: 'Você sobreviveu comendo raízes e cascas de árvore.',
          healthChange: -40,
          foodChange: -8,
        },
      },
      {
        text: 'Tentar caçar na floresta',
        result: {
          message: 'Você conseguiu alguma caça, mas quase congelou.',
          healthChange: -20,
          foodChange: 5,
        },
      },
    ],
  },

  // 1776 - Guerra da Independência
  {
    id: 'revolutionary_war',
    year: 1776,
    location: 'América do Norte',
    title: '🗽 Declaração de Independência',
    description: 'As Treze Colônias declararam independência! É guerra contra a Inglaterra.',
    conditions: {
      minAge: 16,
      maxAge: 45,
      gender: 'male',
    },
    options: [
      {
        text: 'Juntar-se ao Exército Continental',
        result: {
          message: 'Você lutou ao lado de George Washington. A liberdade foi conquistada!',
          honorChange: 40,
          healthChange: -25,
          moneyChange: 10,
        },
      },
      {
        text: 'Permanecer neutro',
        result: {
          message: 'Você evitou o conflito, mas perdeu respeito dos vizinhos.',
          honorChange: -15,
        },
      },
      {
        text: 'Apoiar a Coroa Britânica (Legalista)',
        result: {
          message: 'Você ficou do lado perdedor. Teve que fugir para o Canadá.',
          moneyChange: -80,
          honorChange: -30,
        },
      },
    ],
  },

  // 1861 - Guerra Civil
  {
    id: 'civil_war',
    year: 1861,
    location: 'América do Norte',
    title: '⚔️ Guerra Civil Americana',
    description: 'O país está dividido. Norte contra Sul. A guerra começou.',
    conditions: {
      minAge: 18,
      maxAge: 45,
      gender: 'male',
    },
    options: [
      {
        text: 'Lutar pela União (Norte)',
        result: {
          message: 'Você sobreviveu à guerra mais sangrenta da história americana.',
          healthChange: -35,
          sanityChange: -30,
          honorChange: 30,
        },
      },
      {
        text: 'Pagar substituto (draft dodging)',
        result: {
          message: 'Você pagou $300 para evitar o recrutamento.',
          moneyChange: -300,
          honorChange: -20,
        },
      },
    ],
  },

  // 1929 - Grande Depressão
  {
    id: 'great_depression',
    year: 1929,
    location: 'América do Norte',
    title: '📉 Quebra da Bolsa de Valores',
    description: 'A Bolsa de Nova York quebrou! Seus investimentos viraram pó.',
    conditions: {
      minMoney: 100,
    },
    options: [
      {
        text: 'Aceitar a perda',
        result: {
          message: 'Você perdeu 90% do seu dinheiro no banco.',
          moneyChange: -90, // Perde 90% em porcentagem
          sanityChange: -25,
        },
      },
    ],
  },

  // 1941 - Pearl Harbor
  {
    id: 'pearl_harbor',
    year: 1941,
    location: 'América do Norte',
    title: '💥 Ataque a Pearl Harbor',
    description: 'O Japão atacou Pearl Harbor! Os EUA entraram na Segunda Guerra.',
    conditions: {
      minAge: 18,
      maxAge: 45,
      gender: 'male',
    },
    options: [
      {
        text: 'Alistar-se imediatamente',
        result: {
          message: 'Você serviu no Pacífico. A guerra foi brutal.',
          healthChange: -30,
          sanityChange: -35,
          honorChange: 35,
        },
      },
      {
        text: 'Trabalhar na indústria de guerra',
        result: {
          message: 'Você contribuiu fabricando armas e equipamentos.',
          moneyChange: 50,
          honorChange: 10,
        },
      },
    ],
  },

  // 2001 - 11 de Setembro
  {
    id: 'sept_11',
    year: 2001,
    location: 'América do Norte',
    title: '🏢 Ataque às Torres Gêmeas',
    description: 'Terroristas atacaram o World Trade Center. O mundo mudou para sempre.',
    options: [
      {
        text: 'Continuar vivendo normalmente',
        result: {
          message: 'Você tenta seguir em frente, mas o medo permanece.',
          sanityChange: -10,
        },
      },
      {
        text: 'Alistar-se nas Forças Armadas',
        result: {
          message: 'Você serviu na Guerra ao Terror.',
          healthChange: -20,
          sanityChange: -25,
          honorChange: 20,
        },
      },
    ],
  },

  // =====================
  // AMBOS (PANDEMIA)
  // =====================

  // 2020 - COVID-19
  {
    id: 'covid_pandemic',
    year: 2020,
    location: 'Inglaterra',
    title: '🦠 Pandemia de COVID-19',
    description: 'Uma pandemia global começou. Lockdowns foram impostos.',
    options: [
      {
        text: 'Seguir as regras de quarentena',
        result: {
          message: 'Você ficou isolado por meses. Sobreviveu, mas a saúde mental sofreu.',
          sanityChange: -15,
          moneyChange: -10,
        },
      },
      {
        text: 'Ignorar as restrições',
        result: {
          message: 'Você pegou COVID e quase morreu.',
          healthChange: -40,
        },
      },
    ],
  },

  {
    id: 'covid_pandemic_usa',
    year: 2020,
    location: 'América do Norte',
    title: '🦠 Pandemia de COVID-19',
    description: 'Uma pandemia global começou. O país está dividido sobre como responder.',
    options: [
      {
        text: 'Seguir as regras de quarentena',
        result: {
          message: 'Você ficou isolado por meses. Trabalhou de casa.',
          sanityChange: -12,
          moneyChange: 5,
        },
      },
      {
        text: 'Continuar trabalhando presencialmente',
        result: {
          message: 'Você pegou COVID mas se recuperou.',
          healthChange: -30,
        },
      },
    ],
  },
];

/**
 * Verifica se há um evento histórico para o ano e localização atual
 */
export function checkHistoricalEvent(
  year: number,
  location: string,
  character: Character
): HistoricalEvent | null {
  const event = HISTORICAL_EVENTS.find(
    (e) => e.year === year && e.location === location
  );

  if (!event) return null;

  // Verifica se o personagem atende às condições
  if (event.conditions) {
    const { minAge, maxAge, gender, minMoney, maxMoney } = event.conditions;

    if (minAge && character.age < minAge) return null;
    if (maxAge && character.age > maxAge) return null;
    if (gender && character.gender !== gender) return null;
    if (minMoney && character.money < minMoney) return null;
    if (maxMoney && character.money > maxMoney) return null;
  }

  return event;
}
