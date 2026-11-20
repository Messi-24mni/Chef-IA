export type TabId = "inicio" | "sin-desperdicio" | "recetario" | "desafios" | "chef-ia" | "perfil";

export type LevelNumber = 1 | 2 | 3 | 4;

export type SafetyTag = "cuchillos" | "fuego" | "aceite_caliente" | "horno" | "higiene" | "alergias";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerSeconds?: number;
  safetyReminder?: string;
}

export interface Lesson {
  id: string;
  levelNumber: LevelNumber;
  order: number;
  title: string;
  durationMinutes: number;
  xpReward: number;
  image: string;
  summary: string;
  simpleExplanation: string;
  ingredients: string[];
  utensils: string[];
  steps: LessonStep[];
  chefTips: string[];
  commonMistakes: string[];
  safetyTags: SafetyTag[];
  requiresAdultSupervision: boolean;
  safetyWarning: string;
  allergensInfo: string;
  checkQuestions: QuizQuestion[];
}

export interface CourseLevel {
  levelNumber: LevelNumber;
  title: string;
  subtitle: string;
  description: string;
  requiredXp: number;
  image: string;
  certificateTitle: string;
  examQuestions: QuizQuestion[];
  examPassScore: number;
  examXpReward: number;
}

export type MealType = "Desayuno" | "Almuerzo" | "Cena" | "Postre" | "Antojo";

export interface Recipe {
  id: string;
  title: string;
  mealType: MealType;
  category: "Desayunos" | "Pastas y Salsas" | "Platos Fuertes" | "Internacional" | "Repostería" | "Saludable";
  source?: "academia" | "pdf";
  pdfNumber?: number;
  country?: string;
  countryFlavors?: string;
  family?: string;
  difficulty: "Principiante" | "Básico" | "Intermedio" | "Avanzado";
  prepTimeMinutes: number;
  servingsBase: number;
  image: string;
  description: string;
  ingredients: Array<{ item: string; amount: number; unit: string }>;
  utensils: string[];
  instructions: string[];
  chefTip: string;
  allergens: string[];
  requiresAdultSupervision: boolean;
  safetyNote: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  levelLabel: string;
  xpReward: number;
  checklist: string[];
  safetyReminder: string;
}

export interface CulinaryMission {
  id: string;
  title: string;
  levelNumber: LevelNumber;
  description: string;
  xpReward: number;
  stepsToVerify: string[];
  safetyReminder: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: "bronce" | "plata" | "oro";
  criteriaLabel: string;
}

export interface StudentProgressState {
  studentName: string;
  hasCompletedOnboarding: boolean;
  favoriteCuisine: string;
  allergies: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  lastLessonId: string | null;
  passedExamLevels: LevelNumber[];
  examScores: Partial<Record<LevelNumber, number>>;
  completedChallengeIds: string[];
  completedMissionIds: string[];
  savedRecipeIds: string[];
  unlockedBadgeIds: string[];
  zeroWasteCount?: number;
}

export type VideoDurationOption = "1min" | "3min" | "6min";
export type NarratorGender = "femenino" | "masculino";

export interface ChefVideoScene {
  sceneNumber: 1 | 2 | 3 | 4 | 5 | 6;
  sceneKey:
    | "presentacion"
    | "ingredientes"
    | "preparacion"
    | "coccion"
    | "emplatado"
    | "consejos";
  title: string;
  headline: string;
  narrationText: string;
  subtitleChunks: string[];
  whyTechniqueMatters: string;
  culinaryTerm: { term: string; meaning: string };
  visualHighlights: string[];
  safetyAlert?: string;
  estimatedSeconds: number;
  audioUrl?: string | null;
  audioError?: string | null;
}

export interface ChefVideoTutorial {
  cacheKey: string;
  recipeId: string;
  recipeTitle: string;
  durationOption: VideoDurationOption;
  narratorGender: NarratorGender;
  language: "es";
  createdAt: string;
  scriptModel: string;
  ttsModel: string;
  totalEstimatedSeconds: number;
  foodSafetyReminder: string;
  scenes: ChefVideoScene[];
}

export interface VideoServiceStatus {
  videoGenerationEnabled: boolean;
  videoServiceName: string;
  statusMessage: string;
  alternativeUsed: string;
}

export interface ZeroWastePhotoTrick {
  ingredient: string;
  trickTitle: string;
  howToUseAll: string;
  storageTip: string;
}

export interface ZeroWasteGeneratedRecipeData {
  title: string;
  country: string;
  mealType: MealType;
  difficulty: "Principiante" | "Básico" | "Intermedio";
  prepTimeMinutes: number;
  servingsBase: number;
  description: string;
  requiresAdultSupervision: boolean;
  safetyNote: string;
  allergens: string[];
  utensils: string[];
  ingredients: Array<{ item: string; amount: number; unit: string }>;
  instructions: string[];
  chefTip: string;
}

export interface ZeroWasteAnalysisResult {
  detectedIngredients: string[];
  zeroWasteSummary: string;
  unusableOrCautionNote: string;
  recipe: ZeroWasteGeneratedRecipeData;
  zeroWasteTricks: ZeroWastePhotoTrick[];
  bonusIdeas: string[];
}

