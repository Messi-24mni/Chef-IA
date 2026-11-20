import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { COURSE_LEVELS } from "../data/curriculum";
import { BADGES, CULINARY_MISSIONS, DAILY_CHALLENGES } from "../data/recipes";
import type { LevelNumber, StudentProgressState } from "../types/academy";

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
  isLevelUnlocked: (level: LevelNumber) => boolean;
  getLevelProgress: (level: LevelNumber) => { completed: number; total: number; percent: number };
  isLevelCertified: (level: LevelNumber) => boolean;
  completeOnboarding: (studentName: string, favoriteCuisine?: string) => void;
  updateProfile: (updates: Partial<Pick<StudentProgressState, "studentName" | "favoriteCuisine" | "allergies">>) => void;
  setLastLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  completeChallenge: (challengeId: string, xpReward: number) => void;
  completeMission: (missionId: string, xpReward: number) => void;
  recordZeroWasteRescue: (recipeTitle: string, xpReward?: number) => void;
  recordExamResult: (level: LevelNumber, score: number, total: number, passScore: number, xpReward: number) => boolean;
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
  if (
    next.completedChallengeIds.length >= 1 ||
    next.completedMissionIds.length >= 1 ||
    (next.zeroWasteCount ?? 0) >= 1
  ) {
    earned.add("badge-primer-paso");
  }
  if (
    next.completedChallengeIds.includes("chal-mise-en-place") ||
    next.completedMissionIds.includes("mis-higiene-estacion")
  ) {
    earned.add("badge-guardian-seguro");
  }
  if (next.completedChallengeIds.length >= 1 || next.completedMissionIds.length >= 1) {
    earned.add("badge-racha-3");
  }
  if (next.savedRecipeIds.length >= 2) earned.add("badge-coleccionista");
  if (next.passedExamLevels.includes(1)) earned.add("badge-graduado-1");
  if (next.passedExamLevels.includes(2)) earned.add("badge-graduado-2");
  if (next.passedExamLevels.includes(3)) earned.add("badge-graduado-3");
  if (next.passedExamLevels.includes(4)) earned.add("badge-chef-oro");
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
          (parsed.completedChallengeIds?.length ?? 0) > 0 ||
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

  const overallPercent = useMemo(() => {
    const totalItems = COURSE_LEVELS.length + DAILY_CHALLENGES.length + CULINARY_MISSIONS.length;
    const doneItems =
      state.passedExamLevels.length +
      state.completedChallengeIds.length +
      state.completedMissionIds.length;
    return totalItems === 0 ? 0 : Math.min(100, Math.round((doneItems / totalItems) * 100));
  }, [
    state.completedChallengeIds.length,
    state.completedMissionIds.length,
    state.passedExamLevels.length,
  ]);

  const isLevelUnlocked = (level: LevelNumber): boolean => {
    if (level === 1) return true;
    const lvlInfo = COURSE_LEVELS.find((l) => l.levelNumber === level);
    if (!lvlInfo) return false;
    const prevLevel = (level - 1) as LevelNumber;
    return state.xp >= lvlInfo.requiredXp || state.passedExamLevels.includes(prevLevel);
  };

  const getLevelProgress = (level: LevelNumber) => {
    const missionsInLevel = CULINARY_MISSIONS.filter((m) => m.levelNumber === level);
    const completed = missionsInLevel.filter((m) => state.completedMissionIds.includes(m.id)).length;
    const total = missionsInLevel.length;
    const percent = total === 0 ? (state.passedExamLevels.includes(level) ? 100 : 0) : Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  const isLevelCertified = (level: LevelNumber) => {
    return state.passedExamLevels.includes(level);
  };

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
    showToast(`¡Bienvenido/a, ${cleanName}!`, "Tu perfil de estudiante fue guardado en CHEF ACADEMY.");
  };

  const updateProfile = (
    updates: Partial<Pick<StudentProgressState, "studentName" | "favoriteCuisine" | "allergies">>
  ) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      hasCompletedOnboarding: true,
    }));
    showToast("Perfil actualizado", "Tus preferencias y alérgenos han sido guardados.");
  };

  const setLastLesson = (lessonId: string) => {
    setState((prev) => (prev.lastLessonId === lessonId ? prev : { ...prev, lastLessonId: lessonId }));
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    if (state.completedLessonIds.includes(lessonId)) return;
    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + xpReward,
        lastLessonId: lessonId,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      }),
      `+${xpReward} XP ganados`,
      "Actividad completada"
    );
  };

  const completeChallenge = (challengeId: string, xpReward: number) => {
    if (state.completedChallengeIds.includes(challengeId)) {
      showToast("Desafío completado", "Ya registraste este desafío anteriormente.");
      return;
    }
    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + xpReward,
        completedChallengeIds: [...prev.completedChallengeIds, challengeId],
      }),
      `+${xpReward} XP ganados`,
      "Desafío del día superado"
    );
  };

  const completeMission = (missionId: string, xpReward: number) => {
    if (state.completedMissionIds.includes(missionId)) {
      showToast("Misión ya completada", "Sigue explorando nuevas misiones culinarias.");
      return;
    }
    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + xpReward,
        completedMissionIds: [...prev.completedMissionIds, missionId],
      }),
      `+${xpReward} XP ganados`,
      "Misión culinaria completada"
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

  const recordExamResult = (
    level: LevelNumber,
    score: number,
    total: number,
    passScore: number,
    xpReward: number
  ): boolean => {
    const passed = score >= passScore;
    const alreadyPassed = state.passedExamLevels.includes(level);
    const earnedXp = passed && !alreadyPassed ? xpReward : 0;

    applyWithBadgeCheck(
      (prev) => ({
        ...prev,
        xp: prev.xp + earnedXp,
        examScores: {
          ...prev.examScores,
          [level]: Math.max(prev.examScores[level] ?? 0, Math.round((score / total) * 100)),
        },
        passedExamLevels:
          passed && !prev.passedExamLevels.includes(level)
            ? [...prev.passedExamLevels, level]
            : prev.passedExamLevels,
      }),
      passed ? `¡Examen Nivel ${level} aprobado!` : `Resultado: ${score}/${total}`,
      passed
        ? earnedXp > 0
          ? `+${earnedXp} XP y certificado desbloqueado`
          : "Certificación confirmada"
        : `Necesitas ${passScore}/${total} para aprobar. Intenta de nuevo.`
    );
    return passed;
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
        isLevelUnlocked,
        getLevelProgress,
        isLevelCertified,
        completeOnboarding,
        updateProfile,
        setLastLesson,
        completeLesson,
        completeChallenge,
        completeMission,
        recordZeroWasteRescue,
        recordExamResult,
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
