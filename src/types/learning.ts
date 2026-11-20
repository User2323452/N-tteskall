export type ConceptCategory =
  | "makro"
  | "olje"
  | "marked"
  | "bank"
  | "personlig"
  | "metode";

export type RecallGrade = "Usikker" | "OK" | "Kan det" | "Sitter";

/** Rekkefølge på vurderingene, fra usikker til «dette sitter». */
export const recallGrades: RecallGrade[] = ["Usikker", "OK", "Kan det", "Sitter"];

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
  /** Ett hverdagseksempel. Vises i forklaringen. */
  example?: string;
  /** Hvorfor det angår deg. Vises i forklaringen. */
  forYou?: string;
  relatedIds?: string[];
  /** Satser som vises i «Tall som endres» på konseptsiden. */
  satsIds?: string[];
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
  /** Satser som vises i «Tall som endres» i leksjonen. */
  satsIds?: string[];
  /**
   * Når feltet er satt, viser leksjonen bare figuren til dette konseptet.
   * Eldre leksjoner lar feltet stå tomt og viser alle figurene.
   */
  figureConceptId?: string;
  /** Statisk figur i leksjonen. */
  visual?: "transmisjon";
  /** Enkel flervalgsspørsmål (valgfritt). */
  quiz?: {
    question: string;
    options: string[];
    /** Indeks i options. */
    answerIndex: number;
    explain: string;
    /** Én forklaring per alternativ. Tom streng på riktig svar. */
    whyWrong?: string[];
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

/** Teksten brukeren skrev på det åpne repetisjonskortet, før vurdering. */
export interface RecallAttempt {
  text: string;
  /** Satt når brukeren har sjekket svaret, eller valgt å vise fasiten. */
  revealed: boolean;
}

export interface ConceptProgress {
  status: RecallStatus;
  lastReviewed?: string;
  dueOn?: string;
  /** Lagt i repetisjon etter leksjon eller «Legg i Repeter». */
  introduced?: boolean;
  reviewCount?: number;
  /** Dager til neste visning. Vokser når konseptet sitter, settes til 1 ved usikker. */
  intervalDays?: number;
  /** Uferdig gjenkalling. Følger med i sikkerhetskopien av fremdrift, og fjernes ved vurdering. */
  recall?: RecallAttempt;
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

/** Én gang et konsept ble vurdert Sitter med 30 dagers intervall. */
export interface SitterNotice {
  conceptId: string;
  term: string;
  at: string;
}

/**
 * Dager på rad og Sitter-linjer som bare vises én gang.
 * Ligger i den lokale fremdriften og følger med i sikkerhetskopien.
 */
export interface ReturnProgress {
  /** Siste dag med minst én vurdering eller én fullført leksjon. YYYY-MM-DD. */
  lastActiveOn?: string;
  /** Antall dager på rad som slutter på lastActiveOn. */
  streak: number;
  /**
   * Kalenderdager med minst én vurdering eller én fullført leksjon.
   * YYYY-MM-DD. Dette er hvilke dager som er gjort, ikke en egen strek.
   */
  activeDays: string[];
  /** Sitter (30 dager) som ikke er vist på Hjem ennå. */
  sitterPending: SitterNotice[];
  /** `conceptId@at` for linjer som allerede er vist. */
  sitterSeen: string[];
}

export interface LearningBackup {
  conceptProgress: Record<string, ConceptProgress>;
  pathProgress: Record<string, PathProgress>;
  reviews: ReviewEntry[];
  activity: ActivityEntry[];
  /** Valgfritt i eldre sikkerhetskopier. */
  returnProgress?: ReturnProgress;
  /** Navnet i hilsenen. Tomt eller utelatt betyr ingen navn. */
  displayName?: string;
}
