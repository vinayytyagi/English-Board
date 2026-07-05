export type Intro = {
  id: string;
  context: string;
  short: string;
  medium: string;
  long: string;
  tags?: string[];
};

export type Situation = {
  id: string;
  title: string;
  lines: string[];
  dos?: string[];
  donts?: string[];
  tags?: string[];
};

export type Swap = { id: string; weak: string; strong: string; note?: string };
export type PowerWord = { id: string; word: string; meaning: string; example: string };
export type PhraseGroup = { id: string; fn: string; phrases: string[] };
