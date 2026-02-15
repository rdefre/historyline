export const BIRTH_EVENTS = {
  royalty: {
    id: 'royal_birth',
    title: '👑 Herdeiro Real?',
    description: 'Os sinos da catedral tocam. Sua mãe, a Rainha, deu à luz um bebê saudável.',
    choices: [{ label: 'Celebrar o nascimento', consequence: 'Você celebrou com a corte.', effect: { faith: 10 } }]
  },
  nobility: {
    id: 'noble_birth',
    title: '🏰 Linhagem Fortalecida',
    description: 'Sua mãe lhe apresentou seu novo irmãozinho no berçário.',
    choices: [{ label: 'Prometer proteger', consequence: 'Você jurou protegê-lo.', effect: { honor: 5 } }]
  },
  gentry: {
    id: 'gentry_birth',
    title: '🏠 Novo Membro',
    description: 'Sua mãe descansa após o parto. O bebê é saudável.',
    choices: [{ label: 'Conhecer o bebê', consequence: 'Você conheceu seu novo irmão.', effect: { faith: 5 } }]
  },
  artisan: {
    id: 'merchant_birth',
    title: '👶 A Família Cresceu',
    description: 'Seu pai sorri, mas já calcula o custo de mais uma criança.',
    choices: [{ label: 'Ajudar a cuidar', consequence: 'Você se ofereceu para ajudar.', effect: { faith: 5 } }]
  },
  peasant: {
    id: 'peasant_birth',
    title: '🍼 Mais uma Boca',
    description: 'Sua mãe está exausta. O bebê chora de fome, mas é forte.',
    choices: [{ label: 'Dividir sua comida', consequence: 'Você abriu mão de sua refeição.', effect: { vitality: -5, honor: 10 } }]
  }
};

export type BirthEvent = typeof BIRTH_EVENTS[keyof typeof BIRTH_EVENTS];
