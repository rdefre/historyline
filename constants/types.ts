export interface InteractiveEvent {
  id: string;
  title: string;
  description: string;
  triggerConditions: {
    minAge: number;
    maxAge: number;
    region: 'UK' | 'USA';
    minVitality?: number;
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

export interface InformationalEvent {
  type: 'informational';
  title: string;
  description: string;
}

export type QueuedEvent =
  | { type: 'interactive'; event: InteractiveEvent }
  | { type: 'informational'; event: InformationalEvent };
