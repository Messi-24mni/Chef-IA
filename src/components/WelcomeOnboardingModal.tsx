import { useState, type FormEvent } from "react";
import { ArrowRight, ChefHat, ShieldCheck } from "lucide-react";
import { IMAGES } from "../data/curriculum";
import { useProgress } from "../context/ProgressContext";
import { SafeImage } from "./SafeImage";

const CUISINE_OPTIONS = [
  "Cocina Sin Desperdicio",
  "Pastas y Comida Italiana",
  "Comida Mexicana",
  "Repostería y Postres",
  "Cocina Internacional",
];

export function WelcomeOnboardingModal() {
  const { completeOnboarding } = useProgress();
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState(CUISINE_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Escribe tu nombre (al menos 2 letras) para crear tu perfil.");
      return;
    }
    completeOnboarding(trimmed, cuisine);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-sky-200 overflow-hidden shadow-2xl grid md:grid-cols-12">
        {/* Left Visual Column */}
        <div className="md:col-span-5 relative min-h-[180px] md:min-h-full bg-sky-100">
          <SafeImage
            src={IMAGES.hero}
            alt="Cocina de CHEF IA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-950/35 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold">
              <ChefHat className="w-4 h-4 text-sky-300" />
              <span>CHEF IA · Sin Desperdicio</span>
            </div>
            <p className="text-xs text-white/95 mt-1 leading-relaxed">
              Toma foto a tus ingredientes para no desperdiciar nada, prepara 2,028 recetas y bebidas sin alcohol, y aprende con Chef Video AI.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-sky-700">Cocina juvenil 12+ · Sin desperdicio · Video IA</p>
              <h1 id="onboarding-title" className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
                Crea tu perfil de chef
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Dinos cómo te llamas para personalizar tus recetas, guardar tu progreso y calificar tus platos con 5 estrellas.
              </p>
            </div>

            <div>
              <label htmlFor="onboarding-name" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Tu nombre o apodo de chef
              </label>
              <input
                id="onboarding-name"
                type="text"
                autoFocus
                maxLength={40}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ej. Sofía, Mateo, Valentina..."
                className="w-full rounded-xl bg-sky-50/60 border border-sky-200 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white min-h-[44px]"
              />
              {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
            </div>

            <div>
              <p className="block text-xs font-semibold text-slate-800 mb-2">
                ¿Qué te emociona aprender primero?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CUISINE_OPTIONS.map((opt) => {
                  const active = cuisine === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCuisine(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? "bg-sky-200 border-sky-400 text-sky-950 font-semibold"
                          : "bg-sky-50 border-sky-100 text-slate-700 hover:bg-sky-100"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-sky-50 border border-sky-200 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Tu perfil, XP, insignias y alérgenos se guardan automáticamente en este dispositivo.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors min-h-[48px]"
            >
              <span>Guardar mi perfil y comenzar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
