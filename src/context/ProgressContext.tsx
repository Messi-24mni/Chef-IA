import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BADGES } from "../data/recipes";
import type { CookedRecipeRating, StudentProgressState } from "../types/academy";

const STORAGE_KEY = "chef_academy_progress_v1";

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_STATE: StudentProgressState = {
  studentName: "",
  hasCompletedOnboarding: false,
  favoriteCuisine: "Cocina Italiana y Mexicana",
  allergies: [],
  xp: 0,
  streakDays: 1,
  lastActiveDate: getTodayIso(),
  completedLessonIds: [],
  lastLessonId: null,
  passedExamLevels: [],
  examScores: {},
  completedChallengeIds: [],
  completedMissionIds: [],
  savedRecipeIds: ["rec-huevos-cremosos"],
  unlockedBadgeIds: [],
  zeroWasteCount: 0,
  recipeRatings: {},
};

export interface RewardToast {
  id: number;
  title: string;
  subtitle: string;
}

interface ProgressContextValue {
  state: StudentProgressState;
  rankTitle: string;
  overallPercent: number;
  cookedRecipesCount: number;
  averageStarRating: number;
  completeOnboarding: (studentName: string, favoriteCuisine?: string) => void;
  updateProfile: (updates: Partial<Pick<StudentProgressState, "studentName" | "favoriteCuisine" | "allergies">>) => void;
  recordZeroWasteRescue: (recipeTitle: string, xpReward?: number) => void;
  rateCookedRecipe: (params: {
    recipeId: string;
    recipeTitle: string;
    recipeImage?: string;
    stars: 1 | 2 | 3 | 4 | 5;
    note?: string;
    skipBaseXp?: boolean;
  }) => void;
  toggleSaveRecipe: (recipeId: string) => void;
  resetProgress: () => void;
  activeToast: RewardToast | null;
  dismissToast: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function computeRank(xp: number): string {
  if (xp >= 700) return "Chef de Academia";
  if (xp >= 450) return "Sous Chef";
  if (xp >= 240) return "Cocinero Junior";
  if (xp >= 90) return "Pinche de Cocina";
  return "Aprendiz de Cocina";
}

function evaluateBadges(next: StudentProgressState): string[] {
  const earned = new Set(next.unlockedBadgeIds);
  const ratedCount = Object.keys(next.recipeRatings ?? {}).length;
  const zeroWaste = next.zeroWasteCount ?? 0;
  if (zeroWaste >= 1 || ratedCount >= 1) {
    earned.add("badge-primer-paso");
  }
  if (ratedCount >= 1) {
    earned.add("badge-primera-receta");
  }
  if (next.allergies.length >= 1 || ratedCount + zeroWaste >= 2) {
    earned.add("badge-guardian-seguro");
  }
  if (zeroWaste >= 2) {
    earned.add("badge-racha-3");
  }
  if (next.savedRecipeIds.length >= 2) earned.add("badge-coleccionista");
  if (ratedCount >= 3) earned.add("badge-graduado-1");
  if (next.xp >= 250) earned.add("badge-graduado-2");
  if (ratedCount >= 5) earned.add("badge-graduado-3");
  if (next.xp >= 500) earned.add("badge-chef-oro");
  return Array.from(earned);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudentProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StudentProgressState>;
        const today = getTodayIso();
        let streakDays = parsed.streakDays ?? 1;
        if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
          const prevDate = new Date(parsed.lastActiveDate);
          const nowDate = new Date(today);
          const diffDays = Math.round((nowDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streakDays += 1;
          } else if (diffDays > 1) {
            streakDays = 1;
          }
        }
        const hasProgress =
          (parsed.xp ?? 0) > 0 ||
          Object.keys(parsed.recipeRatings ?? {}).length > 0 ||
          (parsed.zeroWasteCount ?? 0) > 0;
        const hasName = Boolean(parsed.studentName && parsed.studentName.trim().length > 0);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          hasCompletedOnboarding:
            parsed.hasCompletedOnboarding ?? (hasProgress && hasName),
          streakDays,
          lastActiveDate: today,
        };
      }
    } catch {
      // Ignore corrupt storage
    }
    return DEFAULT_STATE;
  });

  const [activeToast, setActiveToast] = useState<RewardToast | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = (title: string, subtitle: string) => {
    setActiveToast({ id: Date.now(), title, subtitle });
  };

  useEffect(() => {
    if (!activeToast) return;
    const timer = window.setTimeout(() => setActiveToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [activeToast]);

  const rankTitle = useMemo(() => computeRank(state.xp), [state.xp]);

  const { cookedRecipesCount, averageStarRating } = useMemo(() => {
    const ratings = Object.values(state.recipeRatings ?? {});
    if (ratings.length === 0) {
      return { cookedRecipesCount: 0, averageStarRating: 0 };
    }
    const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
    return {
      cookedRecipesCount: ratings.length,
      averageStarRating: Number((sum / ratings.length).toFixed(1)),
    };
  }, [state.recipeRatings]);

  const overallPercent = useMemo(() => {
    if (BADGES.length === 0) return 0;
    return Math.min(100, Math.round((state.unlockedBadgeIds.length / BADGES.length) * 100));
  }, [state.unlockedBadgeIds.length]);

  const applyWithBadgeCheck = (
    updater: (prev: StudentProgressState) => StudentProgressState,
    toastTitle: string,
    toastSubtitle: string
  ) => {
    setState((prev) => {
      const updated = updater(prev);
      const nextBadges = evaluateBadges(updated);
      const newlyUnlocked = nextBadges.filter((id) => !prev.unlockedBadgeIds.includes(id));
      const finalState = { ...updated, unlockedBadgeIds: nextBadges };
      if (newlyUnlocked.length > 0) {
        const badgeObj = BADGES.find((b) => b.id === newlyUnlocked[0]);
        showToast(
          `Insignia desbloqueada: ${badgeObj?.title ?? "Nuevo logro"}`,
          `${toastTitle} · ${toastSubtitle}`
        );
      } else {
        showToast(toastTitle, toastSubtitle);
      }
      return finalState;
    });
  };

  const completeOnboarding = (studentName: string, favoriteCuisine?: string) => {
    const cleanName = studentName.trim();
    if (!cleanName) return;
    setState((prev) => ({
      ...prev,
      studentName: cleanName,
      favoriteCuisine: favoriteCuisine?.trim() || prev.favoriteCuisine,
      hasCompletedOnboarding: true,
    }));
    showToast(`¡Bienvenido/a, ${cleanName}!`, "Tu perfil de estudiante fue guardado en CHEF IA.");
  };

  const updateProfile = (
    updates: Partial<Pick<StudentProgressState, "studentName" | "favoriteCuisine" | "allergies">>
  ) => {
    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        ...updates,
        hasCompletedOnboarding: true,
      }),
      "Perfil actualizado",
      "Tus preferencias y alérgenos han sido guardados."
    );
  };

  const recordZeroWasteRescue = (recipeTitle: string, xpReward = 40) => {
    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + xpReward,
        zeroWasteCount: (prev.zeroWasteCount ?? 0) + 1,
      }),
      `+${xpReward} XP Sin Desperdicio`,
      `Aprovechaste tus ingredientes con "${recipeTitle}"`
    );
  };

  const rateCookedRecipe = ({
    recipeId,
    recipeTitle,
    recipeImage,
    stars,
    note,
    skipBaseXp = false,
  }: {
    recipeId: string;
    recipeTitle: string;
    recipeImage?: string;
    stars: 1 | 2 | 3 | 4 | 5;
    note?: string;
    skipBaseXp?: boolean;
  }) => {
    const existingRatings = state.recipeRatings ?? {};
    const alreadyRatedThisRecipe = Boolean(existingRatings[recipeId]);
    const isVeryFirstRecipe = Object.keys(existingRatings).length === 0;
    const xpReward = alreadyRatedThisRecipe
      ? 0
      : (skipBaseXp ? 0 : 35) + (isVeryFirstRecipe ? 15 : 0);

    const entry: CookedRecipeRating = {
      recipeId,
      recipeTitle,
      recipeImage,
      stars,
      note: note?.trim() || undefined,
      ratedAt: new Date().toISOString(),
    };

    const toastTitle = alreadyRatedThisRecipe
      ? `Calificación actualizada (${stars} ★)`
      : isVeryFirstRecipe
        ? `¡Tu primera receta! +${xpReward} XP (${stars} ★)`
        : xpReward > 0
          ? `+${xpReward} XP · Calificada con ${stars} ★`
          : `¡Receta calificada con ${stars} ★!`;

    const toastSubtitle = alreadyRatedThisRecipe
      ? `Actualizaste tu puntuación para "${recipeTitle}"`
      : isVeryFirstRecipe
        ? `Celebramos tu primera receta cocinada: "${recipeTitle}"`
        : `"${recipeTitle}" guardada en tus recetas cocinadas`;

    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + xpReward,
        recipeRatings: {
          ...(prev.recipeRatings ?? {}),
          [recipeId]: entry,
        },
      }),
      toastTitle,
      toastSubtitle
    );
  };


  const toggleSaveRecipe = (recipeId: string) => {
    setState((prev) => {
      const exists = prev.savedRecipeIds.includes(recipeId);
      const nextSaved = exists
        ? prev.savedRecipeIds.filter((id) => id !== recipeId)
        : [...prev.savedRecipeIds, recipeId];
      const next = { ...prev, savedRecipeIds: nextSaved };
      return { ...next, unlockedBadgeIds: evaluateBadges(next) };
    });
  };

  const resetProgress = () => {
    setState({ ...DEFAULT_STATE, lastActiveDate: getTodayIso() });
    showToast("Progreso reiniciado", "Comienzas una nueva aventura desde Nivel 1.");
  };

  return (
    <ProgressContext.Provider
      value={{
        state,
        rankTitle,
        overallPercent,
        cookedRecipesCount,
        averageStarRating,
        completeOnboarding,
        updateProfile,
        recordZeroWasteRescue,
        rateCookedRecipe,
        toggleSaveRecipe,
        resetProgress,
        activeToast,
        dismissToast: () => setActiveToast(null),
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
