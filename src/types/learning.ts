export type ConceptCategory =
  | "makro"
  | "marked"
  | "bank"
  | "personlig"
  | "metode";

export type RecallStatus = "Ny" | "Usikker" | "Kan det";

export interface Concept {
  id: string;
  term: string;
  english?: string;
  category: ConceptCategory;
  /** Én setning — det du skal kunne si høyt. */
  definition: string;
  /** Kort, kuratert forklaring (bokmål). */
  explanation: string;
  /** Valgfri huskeregel. */
  tip?: string;
  relatedIds?: string[];
}

export interface Lesson {
  id: string;
  pathId: string;
  title: string;
  order: number;
  /** Kort ingress. */
  summary: string;
  /** Avsnitt med læringsinnhold. */
  body: string[];
  conceptIds: string[];
  /** Enkel flervalgsspørsmål (valgfritt). */
  quiz?: {
    question: string;
    options: string[];
    /** Indeks i options. */
    answerIndex: number;
    explain: string;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  category: ConceptCategory;
  estimatedMinutes: number;
  lessonIds: string[];
}

export interface ConceptProgress {
  status: RecallStatus;
  lastReviewed?: string;
  dueOn?: string;
}

export interface PathProgress {
  completedLessonIds: string[];
  startedAt?: string;
  completedAt?: string;
}
