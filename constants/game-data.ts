export interface Stats {
  happiness: number;
  health: number;
  intelligence: number;
  reputation: number;
}

export interface Sibling {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  relationship: number;
  isAlive: boolean;
}

export interface Family {
  fatherName: string;
  fatherAge: number;
  fatherRelationship: number;
  fatherAlive: boolean;
  motherName: string;
  motherAge: number;
  motherRelationship: number;
  motherAlive: boolean;
  isAlive: boolean;
}

export interface Character {
  name: string;
  age: number;
  year: number;
  birthYear: number;
  location: string;
  alive: boolean;
  job: string | null;
  stats: Stats;
  socialClass: 'peasant' | 'artisan' | 'gentry' | 'nobility' | 'royalty';
  gender: 'male' | 'female';
  currentEvent: GameEvent | null;
  siblings?: Sibling[];
  family?: Family;
}

export interface GameEvent {
  emoji: string;
  text: string;
  age: number;
  year: number;
}

export interface YearResult {
  events: GameEvent[];
  newStats: Stats;
  newAge: number;
  newYear: number;
  died: boolean;
  deathMessage: string;
  job: string | null;
}

interface EventTemplate {
  emoji: string;
  text: string;
  minAge?: number;
  maxAge?: number;
  statChanges?: Partial<Stats>;
  fatal?: boolean;
  fatalChance?: number;
}

interface Milestone {
  age: number;
  emoji: string;
  text: string;
  statChanges?: Partial<Stats>;
}

interface HistoricalEvent {
  year: number;
  emoji: string;
  text: string;
  statChanges?: Partial<Stats>;
}

interface Era {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  location: string;
  firstNames: string[];
  lastNames: string[];
  jobs: string[];
  jobMinAge: number;
  milestones: Milestone[];
  randomEvents: EventTemplate[];
  dangers: EventTemplate[];
  historicalEvents: HistoricalEvent[];
}

// === Utilities ===

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyStats(stats: Stats, changes: Partial<Stats>) {
  if (changes.happiness) stats.happiness += changes.happiness;
  if (changes.health) stats.health += changes.health;
  if (changes.intelligence) stats.intelligence += changes.intelligence;
  if (changes.reputation) stats.reputation += changes.reputation;
}

function clampStats(stats: Stats) {
  stats.happiness = clamp(stats.happiness, 0, 100);
  stats.health = clamp(stats.health, 0, 100);
  stats.intelligence = clamp(stats.intelligence, 0, 100);
  stats.reputation = clamp(stats.reputation, 0, 100);
}

// === Universal Milestones ===

const UNIVERSAL_MILESTONES: Milestone[] = [
  { age: 1, emoji: '\u{1F476}', text: '{name} deu os primeiros passos.', statChanges: { happiness: 5 } },
  { age: 3, emoji: '\u{1F5E3}\u{FE0F}', text: '{name} comecou a falar e fazer perguntas sobre o mundo.', statChanges: { intelligence: 3 } },
  { age: 5, emoji: '\u{1F9D2}', text: '{name} agora brinca com outras criancas.', statChanges: { happiness: 5 } },
];

// === Eras ===

export const ERAS: Era[] = [
  {
    id: 'renaissance',
    name: 'Renascenca',
    yearStart: 1500,
    yearEnd: 1700,
    location: 'Inglaterra',
    firstNames: ['William', 'Thomas', 'John', 'Edward', 'Henry', 'Richard', 'Elizabeth', 'Mary', 'Anne', 'Catherine'],
    lastNames: ['Lancaster', 'Blackwood', 'Fletcher', 'Turner', 'Thorne', 'Ashworth', 'Cooper', 'Mason'],
    jobs: ['Campones', 'Ferreiro', 'Soldado', 'Mercador', 'Clerigo', 'Artesao', 'Bobo da Corte'],
    jobMinAge: 12,
    milestones: [
      { age: 7, emoji: '\u{1F4D6}', text: '{name} comecou a aprender a ler com o padre da vila.', statChanges: { intelligence: 8 } },
      { age: 10, emoji: '\u{1F3C3}', text: '{name} comecou a ajudar nos trabalhos do campo.', statChanges: { health: 3 } },
      { age: 14, emoji: '\u{2692}\u{FE0F}', text: '{name} iniciou como aprendiz na vila.', statChanges: { reputation: 5, intelligence: 3 } },
      { age: 20, emoji: '\u{1F3AD}', text: '{name} e agora reconhecido como adulto na comunidade.', statChanges: { reputation: 8 } },
      { age: 30, emoji: '\u{1F3E0}', text: '{name} construiu sua propria casa.', statChanges: { happiness: 10, reputation: 5 } },
      { age: 40, emoji: '\u{1F474}', text: '{name} e considerado um dos mais velhos da vila.', statChanges: { reputation: 10 } },
      { age: 50, emoji: '\u{1F56F}\u{FE0F}', text: '{name} sente o peso dos anos. Poucos vivem tanto.', statChanges: { health: -10 } },
    ],
    randomEvents: [
      { emoji: '\u{1F33E}', text: '{name} teve uma colheita abundante.', minAge: 10, statChanges: { happiness: 8, health: 3 } },
      { emoji: '\u{1F4B0}', text: '{name} encontrou moedas antigas no campo.', statChanges: { happiness: 10 } },
      { emoji: '\u{1F3AF}', text: '{name} venceu uma competicao de arco e flecha.', minAge: 12, statChanges: { happiness: 8, reputation: 5 } },
      { emoji: '\u{1F3F0}', text: '{name} foi convidado para um banquete no castelo.', minAge: 16, statChanges: { happiness: 12, reputation: 8 } },
      { emoji: '\u{1F4DA}', text: '{name} leu um manuscrito raro.', minAge: 8, statChanges: { intelligence: 10 } },
      { emoji: '\u{1F91D}', text: '{name} fez amizade com um viajante estrangeiro.', minAge: 10, statChanges: { intelligence: 5, happiness: 5 } },
      { emoji: '\u{26EA}', text: '{name} recebeu elogios do bispo.', minAge: 14, statChanges: { reputation: 8 } },
      { emoji: '\u{2694}\u{FE0F}', text: '{name} aprendeu a manejar uma espada.', minAge: 14, statChanges: { health: 3, reputation: 5 } },
      { emoji: '\u{1F3AA}', text: 'Artistas itinerantes visitaram a vila. {name} se divertiu muito.', statChanges: { happiness: 8 } },
      { emoji: '\u{1F327}\u{FE0F}', text: 'Uma tempestade destruiu parte da colheita de {name}.', minAge: 10, statChanges: { happiness: -8 } },
      { emoji: '\u{1F98A}', text: '{name} perdeu galinhas para uma raposa.', minAge: 8, statChanges: { happiness: -5 } },
      { emoji: '\u{1F4B8}', text: 'O cobrador de impostos levou as economias de {name}.', minAge: 16, statChanges: { happiness: -10 } },
      { emoji: '\u{1F40E}', text: '{name} caiu de um cavalo.', minAge: 8, statChanges: { health: -12 } },
      { emoji: '\u{2744}\u{FE0F}', text: 'O inverno foi rigoroso. {name} passou fome.', statChanges: { health: -8, happiness: -8 } },
    ],
    dangers: [
      { emoji: '\u{2620}\u{FE0F}', text: 'A Peste atingiu a regiao. {name} ficou gravemente doente.', statChanges: { health: -40 }, fatal: true, fatalChance: 0.35 },
      { emoji: '\u{2694}\u{FE0F}', text: '{name} foi convocado para a guerra.', minAge: 16, statChanges: { health: -30 }, fatal: true, fatalChance: 0.25 },
      { emoji: '\u{1F525}', text: '{name} foi acusado de bruxaria!', minAge: 14, statChanges: { health: -20, reputation: -30 }, fatal: true, fatalChance: 0.2 },
      { emoji: '\u{1F5E1}\u{FE0F}', text: '{name} se envolveu em um duelo de espadas.', minAge: 16, statChanges: { health: -25 }, fatal: true, fatalChance: 0.3 },
      { emoji: '\u{1F912}', text: '{name} contraiu uma infeccao grave.', statChanges: { health: -30 }, fatal: true, fatalChance: 0.2 },
    ],
    historicalEvents: [
      { year: 1509, emoji: '\u{1F451}', text: 'Henrique VIII subiu ao trono da Inglaterra.' },
      { year: 1517, emoji: '\u{1F4DC}', text: 'Martinho Lutero publicou suas 95 teses.' },
      { year: 1534, emoji: '\u{26EA}', text: 'Henrique VIII rompeu com Roma e fundou a Igreja Anglicana.' },
      { year: 1558, emoji: '\u{1F478}', text: 'Elizabeth I se tornou rainha da Inglaterra.' },
      { year: 1588, emoji: '\u{2693}', text: 'A Armada Espanhola foi derrotada!', statChanges: { happiness: 5 } },
      { year: 1605, emoji: '\u{1F4A5}', text: 'A Conspiracao da Polvora de Guy Fawkes foi descoberta!' },
      { year: 1642, emoji: '\u{2694}\u{FE0F}', text: 'A Guerra Civil Inglesa comecou.', statChanges: { happiness: -10 } },
      { year: 1665, emoji: '\u{2620}\u{FE0F}', text: 'A Grande Peste de Londres devastou a cidade.', statChanges: { health: -10 } },
      { year: 1666, emoji: '\u{1F525}', text: 'O Grande Incendio de Londres destruiu milhares de casas.' },
    ],
  },
  {
    id: 'enlightenment',
    name: 'Iluminismo',
    yearStart: 1700,
    yearEnd: 1800,
    location: 'Inglaterra',
    firstNames: ['George', 'Charles', 'James', 'Robert', 'Sarah', 'Jane', 'Martha', 'Emily'],
    lastNames: ['Pemberton', 'Hartwell', 'Whitmore', 'Caldwell', 'Stirling', 'Fairfax'],
    jobs: ['Comerciante', 'Marinheiro', 'Filosofo', 'Artista', 'Cientista', 'Politico', 'Medico'],
    jobMinAge: 14,
    milestones: [
      { age: 6, emoji: '\u{1F4D6}', text: '{name} comecou a frequentar a escola local.', statChanges: { intelligence: 8 } },
      { age: 12, emoji: '\u{1F52C}', text: '{name} demonstrou interesse por ciencias naturais.', statChanges: { intelligence: 5 } },
      { age: 16, emoji: '\u{1F393}', text: '{name} completou seus estudos basicos.', statChanges: { intelligence: 8, reputation: 3 } },
      { age: 22, emoji: '\u{1F48D}', text: '{name} se casou.', statChanges: { happiness: 15, reputation: 5 } },
      { age: 30, emoji: '\u{1F3E2}', text: '{name} estabeleceu seu proprio negocio.', statChanges: { reputation: 10, happiness: 8 } },
      { age: 45, emoji: '\u{1F3A9}', text: '{name} e agora uma figura respeitada na sociedade.', statChanges: { reputation: 12 } },
    ],
    randomEvents: [
      { emoji: '\u{1F4DA}', text: '{name} leu uma obra de John Locke.', minAge: 14, statChanges: { intelligence: 8 } },
      { emoji: '\u{2615}', text: '{name} frequentou um cafe onde intelectuais debatiam ideias.', minAge: 16, statChanges: { intelligence: 5, happiness: 5 } },
      { emoji: '\u{26F5}', text: '{name} investiu em uma expedicao maritima lucrativa.', minAge: 20, statChanges: { happiness: 10, reputation: 5 } },
      { emoji: '\u{1F3BB}', text: '{name} assistiu a um concerto de musica classica.', statChanges: { happiness: 8 } },
      { emoji: '\u{1F30D}', text: '{name} conheceu um explorador de terras distantes.', minAge: 12, statChanges: { intelligence: 5 } },
      { emoji: '\u{1F4F0}', text: '{name} publicou um artigo no jornal local.', minAge: 18, statChanges: { reputation: 8, intelligence: 3 } },
      { emoji: '\u{1F494}', text: '{name} perdeu um amigo proximo para a variola.', statChanges: { happiness: -12 } },
      { emoji: '\u{26C8}\u{FE0F}', text: 'Uma enchente causou prejuizos na regiao de {name}.', statChanges: { happiness: -8 } },
    ],
    dangers: [
      { emoji: '\u{1F922}', text: '{name} contraiu variola.', statChanges: { health: -35 }, fatal: true, fatalChance: 0.3 },
      { emoji: '\u{2693}', text: '{name} quase morreu em uma tempestade no mar.', minAge: 16, statChanges: { health: -25 }, fatal: true, fatalChance: 0.2 },
      { emoji: '\u{1F3F4}\u{200D}\u{2620}\u{FE0F}', text: 'O navio de {name} foi atacado por piratas!', minAge: 16, statChanges: { health: -20 }, fatal: true, fatalChance: 0.15 },
      { emoji: '\u{2694}\u{FE0F}', text: '{name} foi envolvido em um conflito violento.', minAge: 16, statChanges: { health: -25 }, fatal: true, fatalChance: 0.2 },
    ],
    historicalEvents: [
      { year: 1707, emoji: '\u{1F91D}', text: 'O Ato de Uniao unificou Escocia e Inglaterra.' },
      { year: 1760, emoji: '\u{2699}\u{FE0F}', text: 'A Revolucao Industrial comecou a transformar a Inglaterra.' },
      { year: 1776, emoji: '\u{1F5FD}', text: 'As colonias americanas declararam independencia!', statChanges: { happiness: -3 } },
      { year: 1789, emoji: '\u{1F1EB}\u{1F1F7}', text: 'A Revolucao Francesa abalou toda a Europa.', statChanges: { happiness: -5 } },
    ],
  },
  {
    id: 'industrial',
    name: 'Era Industrial',
    yearStart: 1800,
    yearEnd: 1920,
    location: 'Estados Unidos',
    firstNames: ['James', 'Arthur', 'Frederick', 'George', 'Eleanor', 'Florence', 'Victoria', 'Charlotte'],
    lastNames: ['Morrison', 'Campbell', 'Sullivan', 'Anderson', 'Crawford', 'Hamilton'],
    jobs: ['Operario', 'Maquinista', 'Inventor', 'Professor', 'Medico', 'Engenheiro', 'Barao do Carvao'],
    jobMinAge: 14,
    milestones: [
      { age: 6, emoji: '\u{1F3EB}', text: '{name} comecou a frequentar a escola publica.', statChanges: { intelligence: 8 } },
      { age: 12, emoji: '\u{1F3ED}', text: '{name} visitou uma fabrica pela primeira vez.', statChanges: { intelligence: 3 } },
      { age: 16, emoji: '\u{2699}\u{FE0F}', text: '{name} comecou a trabalhar na industria.', statChanges: { reputation: 5 } },
      { age: 25, emoji: '\u{1F48D}', text: '{name} se casou em uma cerimonia simples.', statChanges: { happiness: 12 } },
      { age: 35, emoji: '\u{1F3E0}', text: '{name} comprou sua primeira casa.', statChanges: { happiness: 10, reputation: 8 } },
      { age: 50, emoji: '\u{231B}', text: '{name} reflete sobre as mudancas que viu no mundo.', statChanges: { intelligence: 5 } },
    ],
    randomEvents: [
      { emoji: '\u{1F4AA}', text: '{name} recebeu um aumento no trabalho.', minAge: 16, statChanges: { happiness: 8, reputation: 3 } },
      { emoji: '\u{1F4A1}', text: '{name} teve uma ideia para melhorar uma maquina.', minAge: 14, statChanges: { intelligence: 8, reputation: 5 } },
      { emoji: '\u{1F682}', text: '{name} viajou de trem pela primeira vez!', minAge: 8, statChanges: { happiness: 10 } },
      { emoji: '\u{1F4D6}', text: '{name} leu sobre as teorias de Darwin.', minAge: 14, statChanges: { intelligence: 10 } },
      { emoji: '\u{1F4F8}', text: '{name} tirou sua primeira fotografia!', minAge: 10, statChanges: { happiness: 8 } },
      { emoji: '\u{1F4B0}', text: '{name} investiu em acoes de ferrovia.', minAge: 20, statChanges: { happiness: 5, reputation: 5 } },
      { emoji: '\u{1F3AD}', text: '{name} assistiu a uma peca de teatro.', minAge: 10, statChanges: { happiness: 8 } },
      { emoji: '\u{1F32B}\u{FE0F}', text: 'A poluicao da fabrica afetou a saude de {name}.', minAge: 14, statChanges: { health: -8 } },
      { emoji: '\u{1F4C9}', text: '{name} perdeu dinheiro em um investimento ruim.', minAge: 20, statChanges: { happiness: -10 } },
      { emoji: '\u{26A1}', text: '{name} viu eletricidade pela primeira vez!', statChanges: { happiness: 8, intelligence: 3 } },
      { emoji: '\u{1FAA7}', text: '{name} participou de uma greve por melhores condicoes.', minAge: 16, statChanges: { reputation: 5, happiness: -3 } },
      { emoji: '\u{1F4DE}', text: '{name} usou um telefone pela primeira vez!', minAge: 10, statChanges: { happiness: 5, intelligence: 3 } },
    ],
    dangers: [
      { emoji: '\u{1F3ED}', text: '{name} sofreu um acidente grave na fabrica.', minAge: 12, statChanges: { health: -35 }, fatal: true, fatalChance: 0.2 },
      { emoji: '\u{1F912}', text: '{name} contraiu tuberculose.', statChanges: { health: -40 }, fatal: true, fatalChance: 0.3 },
      { emoji: '\u{26CF}\u{FE0F}', text: '{name} ficou preso em um desabamento de mina.', minAge: 14, statChanges: { health: -30 }, fatal: true, fatalChance: 0.25 },
      { emoji: '\u{1F4A3}', text: '{name} foi convocado para a Primeira Guerra Mundial.', minAge: 18, maxAge: 45, statChanges: { health: -30 }, fatal: true, fatalChance: 0.3 },
      { emoji: '\u{1F525}', text: 'Um incendio devastou a fabrica onde {name} trabalhava.', minAge: 12, statChanges: { health: -25 }, fatal: true, fatalChance: 0.15 },
    ],
    historicalEvents: [
      { year: 1807, emoji: '\u{26D3}\u{FE0F}', text: 'O trafico de escravos foi abolido no Imperio Britanico.' },
      { year: 1837, emoji: '\u{1F451}', text: 'A Rainha Vitoria subiu ao trono.' },
      { year: 1859, emoji: '\u{1F412}', text: 'Darwin publicou "A Origem das Especies".', statChanges: { intelligence: 3 } },
      { year: 1861, emoji: '\u{2694}\u{FE0F}', text: 'A Guerra Civil Americana comecou.', statChanges: { happiness: -8 } },
      { year: 1865, emoji: '\u{1F54A}\u{FE0F}', text: 'A Guerra Civil terminou. A escravidao foi abolida nos EUA.' },
      { year: 1876, emoji: '\u{1F4DE}', text: 'Alexander Graham Bell inventou o telefone!' },
      { year: 1903, emoji: '\u{2708}\u{FE0F}', text: 'Os irmaos Wright realizaram o primeiro voo!' },
      { year: 1912, emoji: '\u{1F6A2}', text: 'O Titanic afundou em sua viagem inaugural.' },
      { year: 1914, emoji: '\u{1F4A3}', text: 'A Primeira Guerra Mundial comecou.', statChanges: { happiness: -15 } },
      { year: 1918, emoji: '\u{1F54A}\u{FE0F}', text: 'A Primeira Guerra Mundial terminou.' },
    ],
  },
  {
    id: 'worldwars',
    name: 'Entre Guerras',
    yearStart: 1920,
    yearEnd: 1950,
    location: 'Estados Unidos',
    firstNames: ['Robert', 'Frank', 'Harold', 'Dorothy', 'Margaret', 'Helen', 'Joseph', 'Walter'],
    lastNames: ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Taylor'],
    jobs: ['Soldado', 'Mecanico', 'Enfermeiro', 'Piloto', 'Jornalista', 'Operario', 'Musico'],
    jobMinAge: 16,
    milestones: [
      { age: 6, emoji: '\u{1F3EB}', text: '{name} comecou a escola.', statChanges: { intelligence: 8 } },
      { age: 14, emoji: '\u{1F4FB}', text: '{name} ouviu radio pela primeira vez.', statChanges: { happiness: 5, intelligence: 3 } },
      { age: 18, emoji: '\u{1F393}', text: '{name} se formou no colegial.', statChanges: { intelligence: 8, reputation: 5 } },
      { age: 25, emoji: '\u{1F48D}', text: '{name} se casou.', statChanges: { happiness: 12 } },
      { age: 35, emoji: '\u{1F476}', text: '{name} teve seu primeiro filho.', statChanges: { happiness: 15, reputation: 5 } },
    ],
    randomEvents: [
      { emoji: '\u{1F3B7}', text: '{name} curtiu uma noite de jazz.', minAge: 16, statChanges: { happiness: 10 } },
      { emoji: '\u{1F3AC}', text: '{name} assistiu a um filme no cinema.', minAge: 8, statChanges: { happiness: 8 } },
      { emoji: '\u{1F697}', text: '{name} aprendeu a dirigir!', minAge: 16, statChanges: { happiness: 8, intelligence: 3 } },
      { emoji: '\u{1F4F0}', text: '{name} leu sobre a crise economica no jornal.', minAge: 12, statChanges: { happiness: -5 } },
      { emoji: '\u{1F3C8}', text: '{name} assistiu a um jogo de futebol americano.', minAge: 8, statChanges: { happiness: 8 } },
      { emoji: '\u{1F494}', text: '{name} perdeu o emprego durante a recessao.', minAge: 18, statChanges: { happiness: -15, reputation: -5 } },
      { emoji: '\u{1F372}', text: '{name} enfrentou escassez de alimentos.', statChanges: { health: -5, happiness: -8 } },
      { emoji: '\u{1F396}\u{FE0F}', text: '{name} recebeu uma medalha por bravura.', minAge: 18, statChanges: { reputation: 15, happiness: 10 } },
    ],
    dangers: [
      { emoji: '\u{1F4A3}', text: '{name} foi enviado para a Segunda Guerra Mundial.', minAge: 18, maxAge: 45, statChanges: { health: -35 }, fatal: true, fatalChance: 0.3 },
      { emoji: '\u{2708}\u{FE0F}', text: '{name} sofreu um bombardeio aereo.', statChanges: { health: -30 }, fatal: true, fatalChance: 0.2 },
      { emoji: '\u{1F3DA}\u{FE0F}', text: '{name} nao aguentou a miseria da Grande Depressao.', minAge: 18, statChanges: { health: -20, happiness: -20 }, fatal: true, fatalChance: 0.1 },
      { emoji: '\u{1F912}', text: '{name} contraiu poliomielite.', statChanges: { health: -30 }, fatal: true, fatalChance: 0.15 },
    ],
    historicalEvents: [
      { year: 1920, emoji: '\u{1F5F3}\u{FE0F}', text: 'As mulheres conquistaram o direito ao voto nos EUA!' },
      { year: 1929, emoji: '\u{1F4C9}', text: 'A Bolsa quebrou! A Grande Depressao comecou.', statChanges: { happiness: -15 } },
      { year: 1939, emoji: '\u{2694}\u{FE0F}', text: 'A Segunda Guerra Mundial comecou.', statChanges: { happiness: -15 } },
      { year: 1945, emoji: '\u{2622}\u{FE0F}', text: 'Bombas atomicas foram lancadas. A guerra terminou.' },
    ],
  },
  {
    id: 'modern',
    name: 'Era Moderna',
    yearStart: 1950,
    yearEnd: 2030,
    location: 'Estados Unidos',
    firstNames: ['Jack', 'Oliver', 'James', 'Noah', 'Emma', 'Olivia', 'Sophia', 'Amelia', 'Michael', 'David'],
    lastNames: ['Mitchell', 'Parker', 'Collins', 'Brooks', 'Rivera', 'Chen', 'Murphy', 'Foster'],
    jobs: ['Programador', 'Influencer', 'Cientista', 'Corretor de Bolsa', 'Medico', 'Advogado', 'Engenheiro', 'Professor'],
    jobMinAge: 18,
    milestones: [
      { age: 6, emoji: '\u{1F3EB}', text: '{name} comecou o ensino fundamental.', statChanges: { intelligence: 8 } },
      { age: 13, emoji: '\u{1F4F1}', text: '{name} ganhou seu primeiro dispositivo eletronico.', statChanges: { happiness: 10, intelligence: 3 } },
      { age: 16, emoji: '\u{1F697}', text: '{name} tirou carteira de motorista.', statChanges: { happiness: 10 } },
      { age: 18, emoji: '\u{1F393}', text: '{name} se formou no ensino medio.', statChanges: { intelligence: 8, reputation: 5 } },
      { age: 22, emoji: '\u{1F393}', text: '{name} se formou na universidade.', statChanges: { intelligence: 15, reputation: 10 } },
      { age: 28, emoji: '\u{1F48D}', text: '{name} se casou.', statChanges: { happiness: 15 } },
      { age: 32, emoji: '\u{1F476}', text: '{name} teve um filho.', statChanges: { happiness: 12 } },
      { age: 40, emoji: '\u{1F3E0}', text: '{name} comprou a casa dos sonhos.', statChanges: { happiness: 10, reputation: 8 } },
      { age: 55, emoji: '\u{231B}', text: '{name} esta pensando em aposentadoria.', statChanges: { happiness: 5 } },
      { age: 65, emoji: '\u{1F382}', text: '{name} se aposentou.', statChanges: { happiness: 10, reputation: 5 } },
    ],
    randomEvents: [
      { emoji: '\u{1F4BC}', text: '{name} foi promovido no trabalho!', minAge: 20, statChanges: { happiness: 10, reputation: 8 } },
      { emoji: '\u{1F697}', text: '{name} comprou seu primeiro carro.', minAge: 18, statChanges: { happiness: 10 } },
      { emoji: '\u{1F30D}', text: '{name} viajou para o exterior.', minAge: 18, statChanges: { happiness: 12, intelligence: 5 } },
      { emoji: '\u{1F4C8}', text: '{name} fez um bom investimento na bolsa.', minAge: 22, statChanges: { happiness: 10, reputation: 5 } },
      { emoji: '\u{1F3C6}', text: '{name} ganhou um premio no trabalho.', minAge: 22, statChanges: { reputation: 10, happiness: 8 } },
      { emoji: '\u{1F415}', text: '{name} adotou um cachorro.', minAge: 8, statChanges: { happiness: 10 } },
      { emoji: '\u{1F4F1}', text: '{name} ficou viciado em redes sociais.', minAge: 13, statChanges: { happiness: -5, intelligence: -3 } },
      { emoji: '\u{1F630}', text: '{name} esta sofrendo com estresse do trabalho.', minAge: 22, statChanges: { health: -8, happiness: -8 } },
      { emoji: '\u{1F4C9}', text: '{name} perdeu dinheiro na bolsa.', minAge: 22, statChanges: { happiness: -12 } },
      { emoji: '\u{1F3B8}', text: '{name} comecou a aprender um instrumento musical.', minAge: 10, statChanges: { happiness: 8, intelligence: 3 } },
      { emoji: '\u{1F3CB}\u{FE0F}', text: '{name} comecou a fazer exercicios regularmente.', minAge: 14, statChanges: { health: 8, happiness: 5 } },
      { emoji: '\u{1F3AE}', text: '{name} passou o fim de semana jogando videogame.', minAge: 8, statChanges: { happiness: 5, health: -2 } },
      { emoji: '\u{1F4FA}', text: '{name} foi cancelado na internet!', minAge: 16, statChanges: { reputation: -15, happiness: -10 } },
      { emoji: '\u{1F933}', text: '{name} viralizou nas redes sociais!', minAge: 14, statChanges: { reputation: 12, happiness: 8 } },
    ],
    dangers: [
      { emoji: '\u{1F697}', text: '{name} sofreu um acidente de carro grave.', minAge: 16, statChanges: { health: -30 }, fatal: true, fatalChance: 0.15 },
      { emoji: '\u{1F494}', text: '{name} teve um ataque cardiaco.', minAge: 35, statChanges: { health: -40 }, fatal: true, fatalChance: 0.25 },
      { emoji: '\u{1F3E5}', text: '{name} foi diagnosticado com uma doenca grave.', minAge: 30, statChanges: { health: -35 }, fatal: true, fatalChance: 0.2 },
      { emoji: '\u{1F614}', text: '{name} entrou em depressao profunda.', minAge: 16, statChanges: { health: -15, happiness: -25 }, fatal: true, fatalChance: 0.05 },
      { emoji: '\u{1F32A}\u{FE0F}', text: '{name} foi atingido por um desastre natural.', statChanges: { health: -25 }, fatal: true, fatalChance: 0.1 },
    ],
    historicalEvents: [
      { year: 1954, emoji: '\u{1F4FA}', text: 'A televisao se tornou popular nos lares americanos.' },
      { year: 1963, emoji: '\u{1F622}', text: 'O presidente Kennedy foi assassinado.', statChanges: { happiness: -10 } },
      { year: 1969, emoji: '\u{1F319}', text: 'O homem pisou na Lua pela primeira vez!', statChanges: { happiness: 10 } },
      { year: 1989, emoji: '\u{1F9F1}', text: 'O Muro de Berlim caiu!', statChanges: { happiness: 8 } },
      { year: 1991, emoji: '\u{1F310}', text: 'A World Wide Web foi lancada ao publico!' },
      { year: 2001, emoji: '\u{1F494}', text: 'Os ataques de 11 de setembro chocaram o mundo.', statChanges: { happiness: -15 } },
      { year: 2007, emoji: '\u{1F4F1}', text: 'O primeiro iPhone foi lancado.' },
      { year: 2008, emoji: '\u{1F4C9}', text: 'A crise financeira global abalou a economia.', statChanges: { happiness: -10 } },
      { year: 2020, emoji: '\u{1F637}', text: 'Uma pandemia global mudou o mundo.', statChanges: { health: -5, happiness: -10 } },
    ],
  },
];

// === Functions ===

export function getCurrentEra(year: number): Era {
  for (let i = ERAS.length - 1; i >= 0; i--) {
    if (year >= ERAS[i].yearStart) return ERAS[i];
  }
  return ERAS[0];
}

export function createNewCharacter(
  startYear: number = 1500,
  socialClass: Character['socialClass'] = 'peasant',
  gender: Character['gender'] = 'male'
): Character {
  const era = getCurrentEra(startYear);
  const firstName = pickRandom(era.firstNames);
  const lastName = pickRandom(era.lastNames);
  return {
    name: `${firstName} ${lastName}`,
    age: 0,
    year: startYear,
    birthYear: startYear,
    location: era.location,
    alive: true,
    job: null,
    stats: { happiness: 60, health: 100, intelligence: 15, reputation: 5 },
    socialClass,
    gender,
    currentEvent: null,
    siblings: [],
    family: {
      fatherName: pickRandom(era.firstNames) + ' ' + lastName,
      fatherAge: 30,
      fatherRelationship: 75,
      fatherAlive: true,
      motherName: pickRandom(era.firstNames) + ' ' + lastName,
      motherAge: 28,
      motherRelationship: 85,
      motherAlive: true,
      isAlive: true,
    },
  };
}

export function processYear(character: Character): YearResult {
  const newAge = character.age + 1;
  const newYear = character.year + 1;
  const era = getCurrentEra(newYear);
  const firstName = character.name.split(' ')[0];
  const events: GameEvent[] = [];
  const stats = { ...character.stats };
  let died = false;
  let deathMessage = '';
  let job = character.job;

  const fmt = (text: string) => text.replace(/\{name\}/g, firstName);
  const pushEvent = (emoji: string, text: string) => {
    events.push({ emoji, text, age: newAge, year: newYear });
  };

  // 1. Universal milestones
  const uMilestone = UNIVERSAL_MILESTONES.find(m => m.age === newAge);
  if (uMilestone) {
    pushEvent(uMilestone.emoji, fmt(uMilestone.text));
    if (uMilestone.statChanges) applyStats(stats, uMilestone.statChanges);
  }

  // 2. Era milestones
  const eMilestone = era.milestones.find(m => m.age === newAge);
  if (eMilestone) {
    pushEvent(eMilestone.emoji, fmt(eMilestone.text));
    if (eMilestone.statChanges) applyStats(stats, eMilestone.statChanges);
  }

  // 3. Historical events
  const histEvent = era.historicalEvents.find(h => h.year === newYear);
  if (histEvent) {
    pushEvent(histEvent.emoji, histEvent.text);
    if (histEvent.statChanges) applyStats(stats, histEvent.statChanges);
  }

  // 4. Auto-assign job
  if (!job && newAge >= era.jobMinAge) {
    job = pickRandom(era.jobs);
    pushEvent('\u{1F4BC}', `${firstName} comecou a trabalhar como ${job}.`);
    applyStats(stats, { reputation: 5, happiness: 3 });
  }

  // 5. Random events (primary — 60-70% chance)
  const eventChance = newAge < 6 ? 0.3 : newAge < 13 ? 0.5 : 0.65;
  if (Math.random() < eventChance) {
    const eligible = era.randomEvents.filter(e =>
      (e.minAge === undefined || newAge >= e.minAge) &&
      (e.maxAge === undefined || newAge <= e.maxAge)
    );
    if (eligible.length > 0) {
      const ev = pickRandom(eligible);
      pushEvent(ev.emoji, fmt(ev.text));
      if (ev.statChanges) applyStats(stats, ev.statChanges);
    }
  }

  // 6. Second random event (25% chance, age 10+)
  if (Math.random() < 0.25 && newAge >= 10) {
    const eligible = era.randomEvents.filter(e =>
      (e.minAge === undefined || newAge >= e.minAge) &&
      (e.maxAge === undefined || newAge <= e.maxAge)
    );
    if (eligible.length > 0) {
      const ev = pickRandom(eligible);
      pushEvent(ev.emoji, fmt(ev.text));
      if (ev.statChanges) applyStats(stats, ev.statChanges);
    }
  }

  // 7. Danger check
  let dangerChance = 0.04;
  if (newAge > 40) dangerChance += 0.04;
  if (newAge > 60) dangerChance += 0.08;
  if (stats.health < 30) dangerChance += 0.06;

  if (Math.random() < dangerChance) {
    const eligible = era.dangers.filter(d =>
      (d.minAge === undefined || newAge >= d.minAge) &&
      (d.maxAge === undefined || newAge <= d.maxAge)
    );
    if (eligible.length > 0) {
      const danger = pickRandom(eligible);
      pushEvent(danger.emoji, fmt(danger.text));
      if (danger.statChanges) applyStats(stats, danger.statChanges);
      if (danger.fatal && Math.random() < (danger.fatalChance ?? 0.5)) {
        died = true;
        deathMessage = fmt(danger.text);
      }
    }
  }

  // 8. Natural stat drift
  stats.happiness += randomInt(-3, 3);
  if (newAge > 60) stats.health -= randomInt(2, 5);
  else if (newAge > 40) stats.health -= randomInt(1, 3);
  if (newAge < 20) stats.intelligence += randomInt(0, 2);
  if (job) stats.reputation += randomInt(0, 1);

  clampStats(stats);

  // 9. Death checks
  if (stats.health <= 0) {
    died = true;
    if (!deathMessage) deathMessage = `${firstName} faleceu por problemas de saude.`;
  }

  if (!died && newAge > 65) {
    const deathChance = newAge > 90 ? 0.45 : newAge > 80 ? 0.2 : newAge > 70 ? 0.1 : 0.05;
    if (Math.random() < deathChance) {
      died = true;
      deathMessage = `${firstName} faleceu de causas naturais aos ${newAge} anos.`;
    }
  }

  // 10. Quiet year fallback
  if (events.length === 0) {
    pushEvent('\u{1F4C5}', `Mais um ano se passou na vida de ${firstName}.`);
  }

  return { events, newStats: stats, newAge, newYear, died, deathMessage, job };
}
