import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  Flame,
  Medal,
  RotateCcw,
  ShieldAlert,
  Trophy,
  User,
} from "lucide-react";
import { COURSE_LEVELS } from "../data/curriculum";
import { BADGES, CULINARY_MISSIONS, DAILY_CHALLENGES } from "../data/recipes";
import { useProgress } from "../context/ProgressContext";
import type { LevelNumber } from "../types/academy";

interface ProfileViewProps {
  onOpenCertificate: (level: LevelNumber) => void;
}

const COMMON_ALLERGIES = [
  "Gluten / Trigo",
  "Lácteos",
  "Huevo",
  "Frutos secos",
  "Cacahuate",
  "Soya",
  "Pescado / Mariscos",
];

export function ProfileView({ onOpenCertificate }: ProfileViewProps) {
  const {
    state,
    rankTitle,
    overallPercent,
    isLevelCertified,
    updateProfile,
    resetProgress,
  } = useProgress();

  const [nameInput, setNameInput] = useState(state.studentName);
  const [cuisineInput, setCuisineInput] = useState(state.favoriteCuisine);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setNameInput(state.studentName);
    setCuisineInput(state.favoriteCuisine);
  }, [state.studentName, state.favoriteCuisine]);

  const toggleAllergy = (allergy: string) => {
    const exists = state.allergies.includes(allergy);
    const next = exists
      ? state.allergies.filter((a) => a !== allergy)
      : [...state.allergies, allergy];
    updateProfile({ allergies: next });
  };

  const completedRetosCount =
    state.completedChallengeIds.length + state.completedMissionIds.length;
  const totalRetosCount = DAILY_CHALLENGES.length + CULINARY_MISSIONS.length;

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <section className="rounded-3xl bg-white border border-sky-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-200 to-sky-400 text-sky-950 font-display text-2xl font-extrabold flex items-center justify-center shrink-0">
              {(state.studentName || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-700">{rankTitle}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
                {state.studentName || "Estudiante"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Interés favorito: {state.favoriteCuisine}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center sm:text-right">
            <div>
              <p className="text-xs text-slate-500">Experiencia</p>
              <p className="font-display text-xl font-bold text-slate-950 tabular-nums">{state.xp} XP</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Exámenes</p>
              <p className="font-display text-xl font-bold text-slate-950 tabular-nums">
                {state.passedExamLevels.length}/4
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Progreso</p>
              <p className="font-display text-xl font-bold text-sky-600 tabular-nums">
                {overallPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-sky-100 grid sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-sky-600" />
            <span className="tabular-nums">
              {completedRetosCount} de {totalRetosCount} retos y misiones · {state.zeroWasteCount ?? 0} sin desperdicio
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-sky-600" />
            <span className="tabular-nums">
              {state.unlockedBadgeIds.length} de {BADGES.length} insignias obtenidas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-sky-600" />
            <span className="tabular-nums">Racha activa: {state.streakDays} día(s)</span>
          </div>
        </div>
      </section>

      {/* Edit Student Details & Allergies */}
      <div className="grid lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 rounded-2xl bg-white text-slate-950 border border-sky-200 p-6 space-y-5">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            Datos del estudiante
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({
                studentName: nameInput.trim() || "Estudiante",
                favoriteCuisine: cuisineInput.trim() || "Cocina Variada",
              });
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="student-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del estudiante (aparece en tus certificados)
              </label>
              <input
                id="student-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-xl bg-sky-50/60 border border-sky-200 px-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-sky-500 focus:bg-white min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="favorite-cuisine" className="block text-xs font-semibold text-slate-700 mb-1">
                Cocina o especialidad favorita
              </label>
              <input
                id="favorite-cuisine"
                type="text"
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                className="w-full rounded-xl bg-sky-50/60 border border-sky-200 px-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-sky-500 focus:bg-white min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors min-h-[44px]"
            >
              Guardar perfil
            </button>
          </form>
        </section>

        <section className="lg:col-span-6 rounded-2xl bg-sky-50/90 border border-sky-200 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-700" />
            Mis alergias alimentarias
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Marca cualquier alergia o intolerancia para que el Profesor IA la respete automáticamente en cada recomendación.
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map((allergy) => {
              const active = state.allergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleAllergy(allergy)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[40px] ${
                    active
                      ? "bg-sky-600 border-sky-600 text-white"
                      : "bg-white border-sky-200 text-slate-700 hover:bg-sky-100"
                  }`}
                >
                  {allergy}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Insignias y Medallas */}
      <section className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
          Insignias y Medallas
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = state.unlockedBadgeIds.includes(badge.id);
            const tierStyle =
              badge.tier === "oro"
                ? "text-amber-600 border-amber-300 bg-amber-50/60"
                : badge.tier === "plata"
                ? "text-sky-700 border-sky-300 bg-sky-50"
                : "text-sky-600 border-sky-200 bg-white";

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-colors ${
                  unlocked ? tierStyle : "bg-slate-50 border-slate-200 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Medal className={`w-6 h-6 ${unlocked ? tierStyle.split(" ")[0] : "text-slate-400"}`} />
                  <span className="text-[11px] font-medium text-slate-500 capitalize">
                    Medalla {badge.tier}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-950 mt-3">{badge.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{badge.description}</p>
                <p className="text-[11px] font-semibold text-sky-700 mt-3">
                  {unlocked ? "Obtenida" : `Requisito: ${badge.criteriaLabel}`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificados Oficiales */}
      <section className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
          Certificados Oficiales
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSE_LEVELS.map((lvl) => {
            const certified = isLevelCertified(lvl.levelNumber);
            const passedExam = state.passedExamLevels.includes(lvl.levelNumber);

            return (
              <div
                key={lvl.levelNumber}
                className="rounded-2xl bg-white border border-sky-200 p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-sky-700">Nivel {lvl.levelNumber}</span>
                    <span className="tabular-nums">
                      {passedExam ? `${state.examScores[lvl.levelNumber] ?? 100}%` : "Pendiente"}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-950 mt-1.5">
                    {lvl.certificateTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5">
                    {certified
                      ? "Listo para imprimir o guardar"
                      : `Aprueba el Examen Nivel ${lvl.levelNumber} en Desafíos para obtenerlo.`}
                  </p>
                </div>

                {certified ? (
                  <button
                    type="button"
                    onClick={() => onOpenCertificate(lvl.levelNumber)}
                    className="w-full py-2.5 rounded-xl bg-sky-200 hover:bg-sky-300 text-sky-950 text-xs font-bold inline-flex items-center justify-center gap-1.5 min-h-[40px]"
                  >
                    <Award className="w-4 h-4" />
                    Abrir certificado
                  </button>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2 border-t border-sky-100">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span>Pendiente examen</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Reset progress control */}
      <section className="rounded-2xl bg-white border border-sky-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-bold text-slate-950">Reiniciar progreso de aprendizaje</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Útil si quieres volver a comenzar tu aventura culinaria desde cero en este dispositivo.
          </p>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar progreso
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold min-h-[40px]"
            >
              Confirmar reinicio
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold min-h-[40px]"
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
