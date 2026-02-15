const CHAT_TOPICS = ['tempo', 'colheita', 'família', 'religião', 'sonhos'];

export function generateChatResult(npcName: string): {
  topic: string;
  text: string;
  relationshipChange: number;
} {
  const topic = CHAT_TOPICS[Math.floor(Math.random() * CHAT_TOPICS.length)];
  const change = Math.floor(Math.random() * 6) + 5; // +5 a +10
  return {
    topic,
    text: `Você conversou com ${npcName} sobre ${topic}. A relação de vocês melhorou.`,
    relationshipChange: change,
  };
}

export function generateMoneyResult(
  npcName: string,
  npcRelationship: number
): {
  text: string;
  moneyGained: number;
  relationshipChange: number;
} {
  if (npcRelationship < 30) {
    return {
      text: `${npcName} recusou lhe dar dinheiro.`,
      moneyGained: 0,
      relationshipChange: -5,
    };
  }
  const money = Math.floor(Math.random() * 20) + 5;
  return {
    text: `${npcName} lhe deu $${money}.`,
    moneyGained: money,
    relationshipChange: -3,
  };
}
