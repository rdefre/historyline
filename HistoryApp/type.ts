// Exemplo de estrutura que você deve pedir ao Claude
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  triggerConditions: {
    minAge: number;
    maxAge: number;
    region: 'UK' | 'USA'; // As tags que definimos no doc
    minVitality?: number; // Opcional
  };
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  effect: {
    vitality?: number;
    sanity?: number;
    honor?: number;
    money?: number;
  };
}
