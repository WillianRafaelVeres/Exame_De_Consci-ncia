export type SinSourceType =
  | 'commandment'
  | 'capital_sin'
  | 'state_of_life'
  | 'manual';

export type SinStatus = 'active';

export interface SinRecord {
  id: string;
  date: string;
  sourceType: SinSourceType;
  sourceId: string;
  sourceTitle: string;
  text: string;
  count: number;
  fromQuestion: boolean;
  needsConfession: boolean;
  status: 'active';
  createdAt?: string;
  updatedAt?: string;
}

export type Sin = SinRecord;

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
