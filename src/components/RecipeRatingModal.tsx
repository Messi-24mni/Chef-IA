import { useState, type FormEvent } from "react";
import { Award, CheckCircle2, Sparkles, Star, X } from "lucide-react";
import type { CookedRecipeRating, Recipe } from "../types/academy";
import { SafeImage } from "./SafeImage";

interface RecipeRatingModalProps {
  recipe: Pick<Recipe, "id" | "title" | "image" | "country" | "mealType">;
  existingRating?: CookedRecipeRating;
  isFirstRecipeEver: boolean;
  skipBaseXp?: boolean;
  onSubmit: (stars: 1 | 2 | 3 | 4 | 5, note?: string) => void;
  onClose: () => void;
}

const STAR_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Me costó trabajo, ¡a seguir practicando!",
  2: "Salió regular, la próxima me queda mejor",
  3: "¡Quedó rica y aprendí bastante!",
  4: "¡Muy buena! Casi como todo un chef",
  5: "¡Espectacular! Obra maestra de CHEF IA",
};

export function RecipeRatingModal({
  recipe,
  existingRating,
  isFirstRecipeEver,
  skipBaseXp = false,
  onSubmit,
  onClose,
}: RecipeRatingModalProps) {
  const [stars, setStars] = useState<number>(existingRating?.stars ?? 0);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [note, setNote] = useState<string>(existingRating?.note ?? "");

  const displayStars = hoverStars || stars;
  const xpBonusLabel = existingRating
    ? "Actualiza tu puntuación"
    : isFirstRecipeEver
      ? skipBaseXp
        ? "+15 XP bono por tu primera receta"
        : "+50 XP (+35 XP + 15 XP bono de 1.ª receta)"
      : skipBaseXp
        ? "Guarda tu opinión"
        : "+35 XP por cocinar esta receta";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (stars < 1 || stars > 5) return;
    onSubmit(stars as 1 | 2 | 3 | 4 | 5, note.trim() || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white text-slate-950 border border-sky-200 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isFirstRecipeEver && !existingRating
              ? "bg-amber-50 border-amber-200"
              : "bg-sky-50 border-sky-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isFirstRecipeEver && !existingRating ? (
              <Award className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
            )}
            <span className="font-display font-bold text-sm text-slate-950">
              {existingRating
                ? "Editar puntuación de receta"
                : isFirstRecipeEver
                  ? "¡Felicidades por tu primera receta!"
                  : "¿Cómo te quedó este plato?"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar calificación"
            className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Recipe mini summary */}
          <div className="flex items-center gap-4 rounded-2xl bg-sky-50/70 border border-sky-200 p-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-sky-200">
              <SafeImage
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-sky-700">
                {recipe.mealType}
                {recipe.country ? ` · ${recipe.country}` : ""}
              </p>
              <h2 id="rating-modal-title" className="font-display text-base font-bold text-slate-950 line-clamp-2">
                {recipe.title}
              </h2>
            </div>
          </div>

          {/* 5-Star Selector */}
          <div className="text-center space-y-3 py-1">
            <p className="text-sm font-semibold text-slate-800">
              {isFirstRecipeEver && !existingRating
                ? "Califica tu primera receta de 1 a 5 estrellas:"
                : "Elige tu puntuación de 1 a 5 estrellas:"}
            </p>

            <div
              className="flex items-center justify-center gap-2 sm:gap-3"
              onMouseLeave={() => setHoverStars(0)}
            >
              {([1, 2, 3, 4, 5] as const).map((value) => {
                const active = value <= displayStars;
                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoverStars(value)}
                    onClick={() => setStars(value)}
                    aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={stars === value}
                    className={`min-h-[48px] min-w-[48px] rounded-2xl flex items-center justify-center transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      active ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-200 hover:border-amber-200"
                    }`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        active ? "text-amber-400 fill-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs sm:text-sm font-semibold min-h-[20px] text-amber-800 tabular-nums">
              {displayStars > 0
                ? `${displayStars}/5 estrellas · ${STAR_LABELS[displayStars as 1 | 2 | 3 | 4 | 5]}`
                : "Toca una estrella para puntuar"}
            </p>
          </div>

          {/* Optional note */}
          <div>
            <label htmlFor="rating-note" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nota rápida para recordar (opcional)
            </label>
            <input
              id="rating-note"
              type="text"
              maxLength={140}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Me quedó súper crujiente, le puse un poquito más de limón..."
              className="w-full rounded-xl bg-sky-50/60 border border-sky-200 px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white min-h-[44px]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sky-100">
            <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {xpBonusLabel}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-xs font-semibold text-slate-700 min-h-[44px]"
              >
                Ahora no
              </button>
              <button
                type="submit"
                disabled={stars < 1}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors min-h-[44px]"
              >
                <Star className="w-4 h-4 fill-current" />
                {existingRating ? "Actualizar calificación" : "Guardar calificación"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
