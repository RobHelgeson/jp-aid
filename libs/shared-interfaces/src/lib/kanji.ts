export interface Kanji {
  id: string;
  meaning: string[];
  onReadings: string[];
  kunReadings: string[];
  strokeCount: number;
}

export interface ExampleWord {
  readonly kanji: string;
  readonly reading: string;
  readonly meaning: string;
}
