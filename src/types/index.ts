export type SinStatus = 'active' | 'confessed' | 'deleted';
export type SinSourceType = 'commandment' | 'capital_sin' | 'state_of_life' | 'manual';

export interface Sin {
  id: number;
  date: string;
  type?: SinSourceType;
  sourceId?: string | null;
  sourceTitle?: string | null;
  commandment: string | null;
  category: string | null;
  title: string;
  description: string | null;
  occasion?: string | null;
  nearOccasion: string | null;
  isRepeated: boolean;
  needsConfession: boolean;
  hasRepaired: boolean;
  concretePropose: string | null;
  status: SinStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DailyExam {
  id: number;
  date: string;
  completed: boolean;
  stepReached: number;
  notes: string | null;
  createdAt: string;
}

export interface Confession {
  id: number;
  date: string;
  notes: string | null;
  sinCount: number;
  keepPrivateHistory?: boolean;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface GuideItem {
  id: string;
  category: string;
  title: string;
  explanation: string;
  questions: string[];
  oppositeVirtue: string;
  suggestedPropose: string;
}

export interface Prayer {
  id: string;
  title: string;
  body: string;
  category: string;
}

export interface ExamStep {
  id: string;
  title: string;
  subtitle?: string;
  type: 'prayer' | 'reflection' | 'questions' | 'notes' | 'contrition';
  content?: string;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  commandment?: string;
  category?: string;
}
