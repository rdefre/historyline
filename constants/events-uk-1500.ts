import type { InteractiveEvent } from './types';

export const eventsUk1500: InteractiveEvent[] = [
  {
    id: 'uk-1500-infancy-midwife-blessing',
    title: 'A parteira e a bencao',
    description:
      'Logo apos o nascimento, uma parteira experiente visita sua casa e oferece um pequeno amuleto e uma bencao para afastar "maus ares".',
    triggerConditions: {
      minAge: 0,
      maxAge: 1,
      region: 'UK',
    },
    choices: [
      {
        text: 'Pagar a parteira pelo amuleto e pela bencao.',
        effect: { money: -2, sanity: 1 },
      },
      {
        text: 'Agradecer, mas guardar o pouco dinheiro da familia.',
        effect: { honor: -1, money: 0 },
      },
      {
        text: 'Pedir uma bencao simples sem amuleto.',
        effect: { sanity: 0, honor: 1 },
      },
    ],
  },
  {
    id: 'uk-1501-infant-fever-night-sweats',
    title: 'Febre na noite fria',
    description:
      'Uma febre chega junto com o vento umido. Seu corpo pequeno luta contra calafrios e suor, e a familia teme o pior.',
    triggerConditions: {
      minAge: 1,
      maxAge: 2,
      region: 'UK',
    },
    choices: [
      {
        text: 'Comprar ervas e um tonico do boticario local.',
        effect: { money: -3, vitality: 1 },
      },
      {
        text: 'Descansar e suportar com compressas e agua morna.',
        effect: { vitality: -1, sanity: -1 },
      },
      {
        text: 'Chamar a curandeira do vilarejo (em troca de um favor).',
        effect: { honor: -1, vitality: 1 },
      },
    ],
  },
  {
    id: 'uk-1502-milk-shortage',
    title: 'Escassez de leite',
    description:
      'O inverno foi duro. A comida e racionada e o leite e pouco; cada refeicao conta para crescer forte.',
    triggerConditions: {
      minAge: 2,
      maxAge: 3,
      region: 'UK',
    },
    choices: [
      {
        text: 'Comprar um pouco de mingau extra no mercado.',
        effect: { money: -2, vitality: 1 },
      },
      {
        text: 'Dividir igualmente o que ha entre todos.',
        effect: { honor: 1, vitality: -1 },
      },
      {
        text: 'Aceitar a ajuda de um vizinho com comida.',
        effect: { honor: -1, vitality: 0, sanity: 1 },
      },
    ],
  },
  {
    id: 'uk-1503-neighbor-dispute-chickens',
    title: 'Galinha no quintal do vizinho',
    description:
      'Uma galinha da familia invade o quintal do vizinho e comeca uma briga pequena, mas barulhenta, entre adultos.',
    triggerConditions: {
      minAge: 3,
      maxAge: 4,
      region: 'UK',
    },
    choices: [
      {
        text: 'Levar a galinha de volta e pedir desculpas com respeito.',
        effect: { honor: 1, sanity: 0 },
      },
      {
        text: 'Ignorar e deixar os adultos resolverem como puderem.',
        effect: { honor: -1, sanity: 0 },
      },
      {
        text: 'Oferecer um ovo como compensacao.',
        effect: { money: -1, honor: 1 },
      },
    ],
  },
  {
    id: 'uk-1504-plague-rumor-market',
    title: 'Sussurros de peste no mercado',
    description:
      'No mercado, voce ouve historias de "peste" e casas marcadas em cidades proximas. O medo se espalha mais rapido que as noticias.',
    triggerConditions: {
      minAge: 4,
      maxAge: 5,
      region: 'UK',
    },
    choices: [
      {
        text: 'Evitar o mercado e ficar em casa por um tempo.',
        effect: { sanity: -1, vitality: 0 },
      },
      {
        text: 'Continuar indo ao mercado, mas com cuidado.',
        effect: { vitality: -1, money: 1 },
      },
      {
        text: 'Comprar vinagre e pano para "purificar o ar".',
        effect: { money: -2, sanity: 1 },
      },
    ],
  },
  {
    id: 'uk-1505-alehouse-lesson',
    title: 'Licao na taberna',
    description:
      'Voce acompanha um adulto ate a taberna. Entre historias e cancoes, aprende o peso das palavras e a reputacao do sobrenome.',
    triggerConditions: {
      minAge: 5,
      maxAge: 6,
      region: 'UK',
    },
    choices: [
      {
        text: 'Ouvir em silencio e observar tudo.',
        effect: { sanity: 1, honor: 0 },
      },
      {
        text: 'Repetir uma piada alta para impressionar.',
        effect: { honor: -1, sanity: -1 },
      },
      {
        text: 'Ajudar a carregar canecas e varrer o chao.',
        effect: { vitality: -1, money: 1, honor: 1 },
      },
    ],
  },
  {
    id: 'uk-1506-tithe-collector',
    title: 'O coletor e o dizimo',
    description:
      'Um coletor aparece cobrando taxas e dizimos. A casa fica tensa: pagar doi no bolso, mas recusar traz problemas.',
    triggerConditions: {
      minAge: 6,
      maxAge: 7,
      region: 'UK',
    },
    choices: [
      {
        text: 'Pagar em moedas para evitar confusao.',
        effect: { money: -4, honor: 1 },
      },
      {
        text: 'Negociar oferecendo trabalho e bens.',
        effect: { vitality: -1, money: -1, honor: 0 },
      },
      {
        text: 'Tentar esconder parte do pagamento.',
        effect: { money: 1, honor: -2, sanity: -1 },
      },
    ],
  },
  {
    id: 'uk-1507-apprentice-errands',
    title: 'Recados de aprendiz',
    description:
      'Um artesao local precisa de ajuda com recados. E uma chance de aprender um oficio, mas o trabalho cansa.',
    triggerConditions: {
      minAge: 7,
      maxAge: 8,
      region: 'UK',
      minVitality: 2,
    },
    choices: [
      {
        text: 'Aceitar e trabalhar duro por algumas moedas.',
        effect: { vitality: -2, money: 3, honor: 1 },
      },
      {
        text: 'Aceitar, mas pedir tarefas mais leves.',
        effect: { vitality: -1, money: 1, honor: 0 },
      },
      {
        text: 'Recusar para nao se desgastar.',
        effect: { sanity: 1, honor: -1 },
      },
    ],
  },
  {
    id: 'uk-1508-church-choir',
    title: 'Vozes na igreja',
    description:
      'A igreja procura criancas para o coro. Entre velas e pedra fria, voce sente a forca da comunidade e da tradicao.',
    triggerConditions: {
      minAge: 8,
      maxAge: 9,
      region: 'UK',
    },
    choices: [
      {
        text: 'Entrar no coro e ensaiar com disciplina.',
        effect: { honor: 2, sanity: 1, vitality: -1 },
      },
      {
        text: 'Assistir de longe e ajudar com pequenas tarefas.',
        effect: { honor: 1, money: 0 },
      },
      {
        text: 'Fugir do ensaio para brincar do lado de fora.',
        effect: { sanity: 1, honor: -1 },
      },
    ],
  },
  {
    id: 'uk-1509-henry-vii-dies',
    title: '1509: o rei morre',
    description:
      'As noticias chegam: Henrique VII morreu. Os adultos falam de sucessao, impostos e do futuro sob Henrique VIII, enquanto voce tenta entender o que muda.',
    triggerConditions: {
      minAge: 9,
      maxAge: 11,
      region: 'UK',
    },
    choices: [
      {
        text: 'Ouvir atentamente e guardar detalhes para o futuro.',
        effect: { sanity: 1, honor: 1 },
      },
      {
        text: 'Ajudar a familia a estocar provisoes "por precaucao".',
        effect: { money: -3, sanity: 0, honor: 1 },
      },
      {
        text: 'Ignorar e gastar energia brincando para aliviar a tensao.',
        effect: { vitality: -1, sanity: 1 },
      },
    ],
  },
];
