export type ConceptCategory =
  | "makro"
  | "olje"
  | "marked"
  | "bank"
  | "personlig"
  | "metode";

export type RecallGrade = "Usikker" | "OK" | "Kan det";

export type RecallStatus = "Ny" | RecallGrade;

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
  /** Statisk figur i leksjonen. */
  visual?: "transmisjon";
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
  /** Lagt i repetisjon etter leksjon eller «Legg i Repeter». */
  introduced?: boolean;
  reviewCount?: number;
  /** Dager til neste visning. Vokser når begrepet sitter, settes til 1 ved usikker. */
  intervalDays?: number;
}

export interface PathProgress {
  completedLessonIds: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface ReviewEntry {
  conceptId: string;
  term: string;
  grade: RecallGrade;
  at: string;
  /** Intervallet som ble satt ved denne vurderingen. */
  intervalDays?: number;
}

export interface ActivityEntry {
  label: string;
  href: string;
  at: string;
}

export interface LearningBackup {
  conceptProgress: Record<string, ConceptProgress>;
  pathProgress: Record<string, PathProgress>;
  reviews: ReviewEntry[];
  activity: ActivityEntry[];
}
