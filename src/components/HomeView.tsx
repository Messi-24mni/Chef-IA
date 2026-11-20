import { useState } from "react";
import {
  ArrowRight,
  Award,
  Camera,
  CheckCircle2,
  ChefHat,
  Flame,
  Leaf,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { IMAGES } from "../data/curriculum";
import { CULINARY_MISSIONS, DAILY_CHALLENGES } from "../data/recipes";
import { useProgress } from "../context/ProgressContext";
import type { TabId } from "../types/academy";
import { SafeImage } from "./SafeImage";

interface HomeViewProps {
  onNavigate: (tab: TabId) => void;
}

const ZERO_WASTE_IMAGE = "/src/assets/images/zero_waste_kitchen_1795134321282.jpg";

export function HomeView({ onNavigate }: HomeViewProps) {
  const {
    state,
    rankTitle,
    overallPercent,
    completeChallenge,
  } = useProgress();

  const dailyChallenge = DAILY_CHALLENGES[0];
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const isDailyDone = state.completedChallengeIds.includes(dailyChallenge.id);
  const allChecklistChecked = dailyChallenge.checklist.every((_, idx) => checkedItems[idx]);

  const completedRetos = state.completedChallengeIds.length + state.completedMissionIds.length;
  const totalRetos = DAILY_CHALLENGES.length + CULINARY_MISSIONS.length;

  const toggleChecklist = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-sky-200 shadow-sm">
        <div className="grid lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6 bg-gradient-to-br from-white via-white to-sky-50">
            <div>
              <p className="text-xs font-semibold text-sky-700 tracking-wide">
                Cocina Sin Desperdicio · Chef Video AI · {rankTitle}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-950 leading-tight mt-2 text-balance max-w-xl">
                Hola, {state.studentName || "Chef"}. Hoy cocinamos sin desperdiciar nada.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl leading-relaxed">
                Toma foto a los ingredientes que tienes en casa para inventar recetas seguras, explora 1,028 platos del mundo con su nombre original y aprende con tu Profesor IA y Chef Video AI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate("sin-desperdicio")}
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px] whitespace-nowrap shrink-0"
              >
                <Camera className="w-4 h-4" />
                Escanear ingredientes (Sin desperdicio)
              </button>
              <button
                onClick={() => onNavigate("chef-ia")}
                className="px-5 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-200 text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px] whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-sky-700" />
                Preguntar al Profesor IA
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <SafeImage
              src={IMAGES.hero}
              alt="Estudio de cocina de CHEF ACADEMY Sin Desperdicio"
              className="w-full h-full object-cover"
            />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sky-50 to-transparent" />
          </div>
        </div>
      </section>

      {/* 4-Column Progress Metrics Strip */}
      <section aria-label="Resumen de progreso del estudiante" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-sky-200 p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Experiencia total</span>
            <Trophy className="w-4 h-4 text-sky-600" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-2 tabular-nums">
            {state.xp} XP
          </p>
          <p className="text-xs text-slate-500 mt-1">{rankTitle}</p>
        </div>

        <div className="rounded-2xl bg-white border border-sky-200 p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cocina sin desperdicio</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-2 tabular-nums">
            {state.zeroWasteCount ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">Recetas rescatadas</p>
        </div>

        <div className="rounded-2xl bg-white border border-sky-200 p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Retos y exámenes</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-2 tabular-nums">
            {completedRetos} / {totalRetos}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {overallPercent}% progreso · {state.unlockedBadgeIds.length} insignias
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-sky-200 p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Racha de aprendizaje</span>
            <Flame className="w-4 h-4 text-sky-600" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-2 tabular-nums">
            {state.streakDays} {state.streakDays === 1 ? "día" : "días"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Sigue cocinando hoy</p>
        </div>
      </section>

      {/* Zero Waste Feature Card & Daily Challenge Split */}
      <section className="grid lg:grid-cols-12 gap-6">
        {/* Sección Sin Desperdicio Destacada */}
        <div className="lg:col-span-6 rounded-2xl bg-white text-slate-950 p-6 flex flex-col justify-between border border-sky-200">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium">
              <span className="text-emerald-700 font-semibold">Nueva herramienta · Sin desperdicio</span>
              <span>Foto + IA + Video Tutorial</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                <SafeImage
                  src={ZERO_WASTE_IMAGE}
                  alt="Ingredientes listos para aprovechar sin desperdicio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-slate-950">
                  Aprovecha lo que ya tienes en casa
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Toma una foto a las verduras, frutas maduras, pan o sobras de tu nevera. Chef IA inventará una receta fácil para ti y te dará trucos para aprovechar tallos y cáscaras.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sky-100">
            <span className="text-xs font-semibold text-emerald-700 tabular-nums">
              Gana +40 XP por receta rescatada
            </span>
            <button
              onClick={() => onNavigate("sin-desperdicio")}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors min-h-[44px]"
            >
              Abrir escáner y trucos
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Desafío del Día */}
        <div className="lg:col-span-6 rounded-2xl bg-sky-50/90 border border-sky-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-sky-800 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                Desafío del día
              </span>
              <span className="tabular-nums text-sky-700">+{dailyChallenge.xpReward} XP</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-950 mt-2">
              {dailyChallenge.title}
            </h2>
            <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
              {dailyChallenge.description}
            </p>

            <ul className="mt-4 space-y-2">
              {dailyChallenge.checklist.map((item, idx) => {
                const isChecked = isDailyDone || !!checkedItems[idx];
                return (
                  <li key={item}>
                    <button
                      type="button"
                      disabled={isDailyDone}
                      onClick={() => toggleChecklist(idx)}
                      className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-colors min-h-[44px] ${
                        isChecked
                          ? "bg-sky-200/70 border-sky-400 text-slate-950 font-medium"
                          : "bg-white border-sky-200 text-slate-700 hover:bg-sky-100/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isChecked ? "text-sky-700" : "text-slate-400"
                        }`}
                      />
                      <span>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sky-200/80">
            <button
              onClick={() => onNavigate("desafios")}
              className="text-xs font-semibold text-sky-800 hover:text-sky-950 underline underline-offset-4"
            >
              Ver todos los exámenes y retos
            </button>
            <button
              disabled={isDailyDone || !allChecklistChecked}
              onClick={() => completeChallenge(dailyChallenge.id, dailyChallenge.xpReward)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
                isDailyDone
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default"
                  : allChecklistChecked
                  ? "bg-sky-600 hover:bg-sky-700 text-white"
                  : "bg-sky-200/60 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isDailyDone
                ? "Desafío completado hoy"
                : allChecklistChecked
                ? `Reclamar +${dailyChallenge.xpReward} XP`
                : "Marca la lista para completar"}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access to Academy Sections */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-semibold text-sky-700">Explora toda la plataforma</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            ¿Qué quieres hacer hoy?
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <button
            type="button"
            onClick={() => onNavigate("sin-desperdicio")}
            className="text-left rounded-2xl bg-white border border-sky-200 p-6 hover:-translate-y-0.5 transition-transform shadow-sm flex flex-col justify-between gap-4"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 mt-4">
                Sección Sin Desperdicio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Toma foto a tus ingredientes, genera una receta personalizada y aprende trucos para no tirar nada.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1">
              Tomar foto ahora <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("recetario")}
            className="text-left rounded-2xl bg-white border border-sky-200 p-6 hover:-translate-y-0.5 transition-transform shadow-sm flex flex-col justify-between gap-4"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-sky-700" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 mt-4">
                Recetario Internacional
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Más de 1,000 recetas con fotos, nombre original por país, explicación para 12+ y video tutorial IA.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1">
              Explorar recetas <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("desafios")}
            className="text-left rounded-2xl bg-white border border-sky-200 p-6 hover:-translate-y-0.5 transition-transform shadow-sm flex flex-col justify-between gap-4"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-sky-700" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 mt-4">
                Desafíos y Exámenes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Pon a prueba tus habilidades, gana XP, desbloquea medallas y obtén tus certificados oficiales.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1">
              Ir a desafíos <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="rounded-2xl bg-white border border-sky-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-950">
              Compromiso de Cocina Segura para Jóvenes (12+)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Todas nuestras recetas y guías señalan cuándo pedir apoyo a un adulto para cuchillos afilados, fuego, aceite caliente y horno, además de detallar los alérgenos de cada preparación.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("perfil")}
          className="px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-semibold whitespace-nowrap shrink-0 min-h-[44px]"
        >
          Configurar mis alergias
        </button>
      </section>
    </div>
  );
}
