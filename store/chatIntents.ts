// chatIntents.ts

export interface ChatIntent {
  id: string;
  title: string;
  description: string;
  examples: string[];
  response: string;
}
