import { useEffect, useState } from "react";
import {
  Flame,
  Leaf,
  Medal,
  RotateCcw,
  ShieldAlert,
  Star,
  User,
} from "lucide-react";
import { BADGES } from "../data/recipes";
import { useProgress } from "../context/ProgressContext";
import { SafeImage } from "./SafeImage";

const COMMON_ALLERGIES = [
  "Gluten / Trigo",
  "Lácteos",
  "Huevo",
  "Frutos secos",
  "Cacahuate",
  "Soya",
  "Pescado / Mariscos",
];

export function ProfileView() {
  const {
    state,
    rankTitle,
    overallPercent,
    cookedRecipesCount,
    averageStarRating,
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
              <p className="text-xs text-slate-500">Cocinadas</p>
              <p className="font-display text-xl font-bold text-slate-950 tabular-nums">
                {cookedRecipesCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Insignias</p>
              <p className="font-display text-xl font-bold text-sky-600 tabular-nums">
                {overallPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-sky-100 grid sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="tabular-nums">
              {state.zeroWasteCount ?? 0} rescates sin desperdicio
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">
              {cookedRecipesCount} {cookedRecipesCount === 1 ? "receta cocinada" : "recetas cocinadas"}
              {cookedRecipesCount > 0 ? ` (${averageStarRating}/5 ★)` : ""}
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
                Nombre del estudiante
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


      {/* Mis recetas cocinadas y calificadas */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Mis Recetas Calificadas (5 Estrellas)
          </h2>
          {cookedRecipesCount > 0 && (
            <span className="text-xs font-semibold text-amber-800 tabular-nums">
              Promedio general: {averageStarRating} / 5 ★
            </span>
          )}
        </div>

        {cookedRecipesCount === 0 ? (
          <div className="rounded-2xl bg-white border border-sky-200 p-6 text-sm text-slate-600">
            Aún no has calificado ninguna receta. Prepara tu primer plato desde <strong>Sin desperdicio</strong> o el <strong>Recetario</strong> y presiona <strong>“¡Ya la cociné! (Puntuar ★)”</strong> para ganar tu insignia <strong>Primera Receta ★</strong>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(state.recipeRatings ?? {})
              .sort((a, b) => b.ratedAt.localeCompare(a.ratedAt))
              .map((entry) => (
                <article
                  key={entry.recipeId}
                  className="rounded-2xl bg-white border border-sky-200 p-4 flex items-start gap-3.5 shadow-sm"
                >
                  {entry.recipeImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-sky-100">
                      <SafeImage
                        src={entry.recipeImage}
                        alt={entry.recipeTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold text-slate-950 line-clamp-2">
                      {entry.recipeTitle}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {([1, 2, 3, 4, 5] as const).map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= entry.stars ? "text-amber-400 fill-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-800 ml-1.5 tabular-nums">
                        {entry.stars}/5
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 italic">
                        “{entry.note}”
                      </p>
                    )}
                  </div>
                </article>
              ))}
          </div>
        )}
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
