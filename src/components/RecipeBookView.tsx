import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Cookie,
  FileDown,
  Globe,
  Moon,
  Play,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Users,
  Utensils,
  UtensilsCrossed,
  Video,
  X,
} from "lucide-react";
import { ALL_RECIPES, INTERNATIONAL_COUNTRIES } from "../data/internationalRecipes";
import { getRecipeReadySignal, getYouthGlossaryForRecipe } from "../data/youthRecipeGuide";
import { useProgress } from "../context/ProgressContext";
import type { MealType, Recipe } from "../types/academy";
import { ChefVideoModal } from "./ChefVideoModal";
import { SafeImage } from "./SafeImage";

interface RecipeBookViewProps {
  onAskTutor: (prompt: string) => void;
}

type MealFilter = "Todas" | MealType | "Guardadas";
type SourceFilter = "todas" | "academia" | "pdf";

const DIFFICULTIES = ["Todas", "Principiante", "Básico", "Intermedio", "Avanzado"] as const;
const PAGE_SIZE = 24;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MEAL_TABS: Array<{ id: MealFilter; label: string; icon: typeof Sun }> = [
  { id: "Todas", label: "Todas", icon: UtensilsCrossed },
  { id: "Desayuno", label: "Desayuno", icon: Coffee },
  { id: "Almuerzo", label: "Almuerzo", icon: Sun },
  { id: "Cena", label: "Cena", icon: Moon },
  { id: "Postre", label: "Postre", icon: Sparkles },
  { id: "Antojo", label: "Antojo", icon: Cookie },
  { id: "Guardadas", label: "Guardadas", icon: Bookmark },
];

export function RecipeBookView({ onAskTutor }: RecipeBookViewProps) {
  const { state, toggleSaveRecipe } = useProgress();
  const [search, setSearch] = useState("");
  const [mealFilter, setMealFilter] = useState<MealFilter>("Todas");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("todas");
  const [countryFilter, setCountryFilter] = useState<string>("Todos");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("Todas");
  const [page, setPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [videoRecipe, setVideoRecipe] = useState<Recipe | null>(null);
  const [cachedVideoIds, setCachedVideoIds] = useState<Set<string>>(new Set());
  const [servingMultiplier, setServingMultiplier] = useState<1 | 2 | 4>(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/chef-video/cached")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { cachedRecipeIds?: string[] } | null) => {
        if (active && data?.cachedRecipeIds) {
          setCachedVideoIds(new Set(data.cachedRecipeIds));
        }
      })
      .catch(() => {
        // silent fallback if cache endpoint unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  const handleVideoCached = useCallback((recipeId: string) => {
    setCachedVideoIds((prev) => {
      if (prev.has(recipeId)) return prev;
      const next = new Set(prev);
      next.add(recipeId);
      return next;
    });
  }, []);

  const mealCounts = useMemo(() => {
    const counts: Record<MealFilter, number> = {
      Todas: 0,
      Desayuno: 0,
      Almuerzo: 0,
      Cena: 0,
      Postre: 0,
      Antojo: 0,
      Guardadas: 0,
    };
    for (const r of ALL_RECIPES) {
      if (sourceFilter !== "todas" && r.source !== sourceFilter) continue;
      if (countryFilter !== "Todos" && r.country !== countryFilter) continue;
      if (difficulty !== "Todas" && r.difficulty !== difficulty) continue;
      counts.Todas += 1;
      counts[r.mealType] += 1;
      if (state.savedRecipeIds.includes(r.id)) {
        counts.Guardadas += 1;
      }
    }
    return counts;
  }, [countryFilter, difficulty, sourceFilter, state.savedRecipeIds]);

  const filteredRecipes = useMemo(() => {
    const rawQ = search.trim();
    const qNorm = normalizeText(rawQ.replace(/^#/, ""));
    return ALL_RECIPES.filter((r) => {
      if (sourceFilter !== "todas" && r.source !== sourceFilter) return false;
      if (countryFilter !== "Todos" && r.country !== countryFilter) return false;
      if (difficulty !== "Todas" && r.difficulty !== difficulty) return false;
      if (mealFilter === "Guardadas" && !state.savedRecipeIds.includes(r.id)) return false;
      if (mealFilter !== "Todas" && mealFilter !== "Guardadas" && r.mealType !== mealFilter) return false;
      if (!qNorm) return true;

      if (r.pdfNumber && String(r.pdfNumber) === qNorm) return true;
      const haystack = normalizeText(
        `${r.title} ${r.country ?? ""} ${r.family ?? ""} ${r.mealType} ${r.description} ${r.ingredients
          .map((i) => i.item)
          .join(" ")}`
      );
      return haystack.includes(qNorm);
    });
  }, [countryFilter, difficulty, mealFilter, search, sourceFilter, state.savedRecipeIds]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedRecipes = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRecipes.slice(start, start + PAGE_SIZE);
  }, [filteredRecipes, safePage]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setSearch("");
    setMealFilter("Todas");
    setSourceFilter("todas");
    setCountryFilter("Todos");
    setDifficulty("Todas");
    setPage(1);
  };

  const formatAmount = (amount: number, mult: number) => {
    const val = amount * mult;
    return Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.?0+$/, "");
  };

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            Biblioteca culinaria completa · {ALL_RECIPES.length.toLocaleString("es-ES")} recetas
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
            Recetario Internacional
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Explora las recetas paso a paso de la Academia junto con las 1,000 recetas de 10 cocinas del mundo, clasificadas por desayuno, almuerzo, cena, postre o antojo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar receta, ingrediente, país o #..."
              aria-label="Buscar recetas"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-sky-200 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 min-h-[44px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-sky-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <a
            href="/assets/aistudio/recetario_1000_recetas_internacionales_23fd3a56.pdf"
            download="Recetario_1000_Recetas_Internacionales.pdf"
            className="px-3.5 py-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-xs font-semibold text-sky-900 inline-flex items-center justify-center gap-2 min-h-[44px] shrink-0 transition-colors"
          >
            <FileDown className="w-4 h-4 text-sky-600" />
            PDF 1000 recetas
          </a>
        </div>
      </div>

      {/* Classification by Meal Time */}
      <div className="space-y-3" ref={gridTopRef}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {MEAL_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = mealFilter === tab.id;
            const count = mealCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMealFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[42px] inline-flex items-center gap-2 tabular-nums ${
                  active
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-sky-600"}`} />
                <span>{tab.label}</span>
                <span className={`text-[11px] ${active ? "text-sky-100" : "text-slate-400"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary filters: Collection, Country, Difficulty + Results count */}
        <div className="rounded-2xl bg-white border border-sky-200 p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-sky-50 border border-sky-200 p-1">
              {(
                [
                  { id: "todas", label: "Todas (1028)" },
                  { id: "academia", label: "Academia (28)" },
                  { id: "pdf", label: "1000 Mundiales" },
                ] as const
              ).map((src) => {
                const active = sourceFilter === src.id;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => {
                      setSourceFilter(src.id);
                      if (src.id === "academia") setCountryFilter("Todos");
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] ${
                      active ? "bg-sky-600 text-white" : "text-slate-700 hover:text-slate-950"
                    }`}
                  >
                    {src.label}
                  </button>
                );
              })}
            </div>

            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  if (e.target.value !== "Todos" && sourceFilter === "academia") {
                    setSourceFilter("todas");
                  }
                  setPage(1);
                }}
                aria-label="Filtrar por país"
                className="px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 min-h-[38px]"
              >
                <option value="Todos">Todos los países (10)</option>
                {INTERNATIONAL_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <span>Nivel:</span>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as (typeof DIFFICULTIES)[number]);
                  setPage(1);
                }}
                aria-label="Filtrar por dificultad"
                className="px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 min-h-[38px]"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === "Todas" ? "Cualquier dificultad" : d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-600 tabular-nums">
            <span>
              <strong className="text-slate-950">{filteredRecipes.length.toLocaleString("es-ES")}</strong>{" "}
              {filteredRecipes.length === 1 ? "receta encontrada" : "recetas encontradas"}
            </span>
            {(search ||
              mealFilter !== "Todas" ||
              sourceFilter !== "todas" ||
              countryFilter !== "Todos" ||
              difficulty !== "Todas") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="rounded-2xl bg-white border border-sky-200 p-10 text-center">
          <UtensilsCrossed className="w-8 h-8 text-sky-600 mx-auto mb-3" />
          <h2 className="font-display text-lg font-bold text-slate-950">
            No encontramos recetas con esa búsqueda
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Prueba quitando algún filtro, buscando otro ingrediente o preguntando al Profesor IA qué preparar hoy.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold min-h-[40px]"
          >
            Ver todas las recetas
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedRecipes.map((recipe) => {
              const isSaved = state.savedRecipeIds.includes(recipe.id);
              return (
                <article
                  key={recipe.id}
                  className="rounded-2xl bg-white text-slate-950 border border-sky-200 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SafeImage
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSaveRecipe(recipe.id)}
                        aria-label={isSaved ? "Quitar de guardadas" : "Guardar receta"}
                        className={`absolute top-3 right-3 min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center backdrop-blur-md transition-colors ${
                          isSaved
                            ? "bg-sky-600 text-white"
                            : "bg-white/85 text-slate-800 hover:bg-white"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="text-sky-700 font-semibold">{recipe.mealType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{recipe.country ?? recipe.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3.5 h-3.5" />
                          {recipe.prepTimeMinutes} min
                        </span>
                        {recipe.pdfNumber && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                              #{recipe.pdfNumber}
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="font-display text-lg font-bold text-slate-950 mt-2 line-clamp-2">
                        {recipe.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>

                      <p className="text-xs text-sky-900 bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1.5 mt-3 line-clamp-1">
                        Alérgenos: {recipe.allergens.join(", ")}
                      </p>

                      {cachedVideoIds.has(recipe.id) && (
                        <p className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1 mt-2">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          Tutorial guardado en biblioteca
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                        {recipe.requiresAdultSupervision ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            Con adulto
                          </>
                        ) : (
                          "Apta autónoma"
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setServingMultiplier(1);
                          setSelectedRecipe(recipe);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold transition-colors min-h-[40px]"
                      >
                        Ver receta
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoRecipe(recipe)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold tracking-wide transition-colors min-h-[42px] inline-flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      VER VIDEO TUTORIAL
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-sky-200">
              <p className="text-xs text-slate-600 tabular-nums">
                Mostrando {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filteredRecipes.length)} de{" "}
                {filteredRecipes.length.toLocaleString("es-ES")} recetas
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-slate-800 hover:bg-sky-50 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 min-h-[42px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums">
                  Página {safePage} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-slate-800 hover:bg-sky-50 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 min-h-[42px]"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-modal-title"
        >
          <div className="w-full max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl bg-white text-slate-950 overflow-hidden flex flex-col shadow-2xl border border-sky-200">
            <div className="bg-sky-100 text-slate-950 px-5 sm:px-7 py-4 flex items-center justify-between gap-4 border-b border-sky-200 shrink-0">
              <div className="min-w-0">
                <p className="text-xs text-sky-800 font-semibold">
                  {selectedRecipe.mealType} · {selectedRecipe.country ?? selectedRecipe.category} ·{" "}
                  {selectedRecipe.difficulty} · {selectedRecipe.prepTimeMinutes} min
                  {selectedRecipe.pdfNumber ? ` · Receta #${selectedRecipe.pdfNumber}` : ""}
                </p>
                <h2 id="recipe-modal-title" className="font-display text-lg sm:text-xl font-bold truncate mt-0.5">
                  {selectedRecipe.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-slate-700"
                aria-label="Cerrar receta"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-12 gap-5 items-stretch">
                <div className="sm:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-auto">
                  <SafeImage
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedRecipe.description}</p>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Seguridad y supervisión
                    </p>
                    <p>{selectedRecipe.safetyNote}</p>
                    <p className="pt-1 border-t border-amber-200">
                      <strong>Alérgenos:</strong> {selectedRecipe.allergens.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Servings Scaler + Ingredients */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-display font-bold text-slate-950 text-base flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sky-600" />
                      Ingredientes ({selectedRecipe.servingsBase * servingMultiplier} porc.)
                    </h3>
                    <div className="flex items-center gap-1 bg-sky-100 p-0.5 rounded-lg border border-sky-200">
                      {([1, 2, 4] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setServingMultiplier(m)}
                          className={`px-2 py-1 rounded-md text-xs font-semibold tabular-nums ${
                            servingMultiplier === m
                              ? "bg-sky-600 text-white"
                              : "text-slate-700 hover:text-slate-950"
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-800">
                    {selectedRecipe.ingredients.map((ing) => (
                      <li
                        key={ing.item}
                        className="flex items-baseline justify-between gap-2 border-b border-sky-200/60 pb-1.5 last:border-0"
                      >
                        <span>{ing.item}</span>
                        <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums shrink-0">
                          {ing.unit === "al gusto"
                            ? "al gusto"
                            : `${formatAmount(ing.amount, servingMultiplier)} ${ing.unit}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-sky-600" />
                      Utensilios
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {selectedRecipe.utensils.map((u) => (
                        <li key={u}>· {u}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-sky-100 border border-sky-200 text-slate-950 p-4">
                    <p className="text-xs font-bold text-sky-800">Consejo de Chef</p>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      {selectedRecipe.chefTip}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-slate-950 p-4">
                    <p className="text-xs font-bold text-emerald-800">¿Cómo sabes que ya está listo?</p>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      {getRecipeReadySignal(selectedRecipe)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Glossary for 12+ beginners */}
              {(() => {
                const glossary = getYouthGlossaryForRecipe(selectedRecipe);
                if (glossary.length === 0) return null;
                return (
                  <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-5">
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-950 mb-2.5">
                      Palabras de cocina explicadas fácil
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {glossary.map((item) => (
                        <div key={item.term} className="rounded-xl bg-white border border-sky-200/80 p-3">
                          <p className="text-xs font-bold text-sky-800">{item.term}</p>
                          <p className="text-xs text-slate-700 mt-1 leading-relaxed">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Instructions */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <h3 className="font-display text-lg font-bold text-slate-950">
                    Preparación paso a paso
                  </h3>
                  <span className="text-xs font-medium text-sky-700">
                    Explicado fácil para cocinar paso a paso
                  </span>
                </div>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li
                      key={`${selectedRecipe.id}-step-${i}`}
                      className="flex items-start gap-3.5 rounded-xl border border-sky-200 p-4 bg-white"
                    >
                      <span className="w-7 h-7 rounded-full bg-sky-200 text-sky-950 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-800 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="px-5 sm:px-7 py-4 bg-sky-50 border-t border-sky-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedRecipe;
                    setSelectedRecipe(null);
                    setVideoRecipe(target);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold tracking-wide inline-flex items-center gap-2 min-h-[44px]"
                >
                  <Video className="w-4 h-4" />
                  VER VIDEO TUTORIAL
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const title = selectedRecipe.title;
                    const country = selectedRecipe.country ? ` (${selectedRecipe.country})` : "";
                    setSelectedRecipe(null);
                    onAskTutor(
                      `Quiero preparar la receta "${title}"${country}. ¿Qué trucos o sustituciones seguras recomiendas?`
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-100 text-xs sm:text-sm font-semibold text-slate-900 inline-flex items-center gap-2 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Adaptar con Profesor IA
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleSaveRecipe(selectedRecipe.id)}
                className="px-4 py-2.5 rounded-xl border border-sky-300 bg-white hover:bg-sky-100 text-sky-900 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 min-h-[44px]"
              >
                <Bookmark className={`w-4 h-4 ${state.savedRecipeIds.includes(selectedRecipe.id) ? "fill-current text-sky-600" : "text-sky-600"}`} />
                {state.savedRecipeIds.includes(selectedRecipe.id) ? "Guardada en favoritos" : "Guardar receta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHEF VIDEO AI Tutorial Modal */}
      {videoRecipe && (
        <ChefVideoModal
          recipe={videoRecipe}
          onClose={() => setVideoRecipe(null)}
          onCached={handleVideoCached}
        />
      )}
    </div>
  );
}
