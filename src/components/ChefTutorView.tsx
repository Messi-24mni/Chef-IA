import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Clock,
  Loader2,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { useProgress } from "../context/ProgressContext";
import { getDishImageForText } from "../data/curriculum";
import type { Recipe } from "../types/academy";
import { ChefVideoModal } from "./ChefVideoModal";
import { SafeImage } from "./SafeImage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface GeneratedRecipe {
  title: string;
  prepTimeMinutes: number;
  difficulty: string;
  requiresAdultSupervision: boolean;
  safetyNote: string;
  allergens: string[];
  ingredientsUsed: string[];
  steps: string[];
  chefTip: string;
}

interface ChefTutorViewProps {
  initialPrompt?: string | null;
  onConsumeInitialPrompt?: () => void;
}

const QUICK_PROMPTS = [
  "¿Cómo evito que la pasta se pegue sin usar aceite?",
  "Explícame la técnica de picado seguro en garra",
  "¿Qué significa 'al dente' y 'Mise en Place'?",
  "Quiero hacer huevos revueltos cremosos, ¿cuál es el truco?",
];

const SUGGESTED_PANTRY = [
  "Huevos",
  "Arroz",
  "Tomate",
  "Pasta",
  "Pollo",
  "Queso",
  "Zanahoria",
  "Papa",
  "Ajo",
  "Limón",
  "Pan",
  "Espinaca",
];

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function toAcademyRecipe(rec: GeneratedRecipe): Recipe {
  const diff: Recipe["difficulty"] =
    rec.difficulty === "Avanzado" || rec.difficulty === "Intermedio" || rec.difficulty === "Básico"
      ? rec.difficulty
      : "Principiante";

  return {
    id: `ai-${slugifyTitle(rec.title) || "receta"}`,
    title: rec.title,
    category: "Saludable",
    mealType: "Almuerzo",
    country: "Chef Mentor IA",
    difficulty: diff,
    prepTimeMinutes: Math.max(5, Number(rec.prepTimeMinutes) || 20),
    servingsBase: 2,
    image: getDishImageForText(rec.title, undefined, "Almuerzo", rec.ingredientsUsed.join(" ")),
    description: `Receta personalizada creada por Profesor Virtual Chef Mentor para jóvenes de 12+ años.`,
    requiresAdultSupervision: rec.requiresAdultSupervision,
    safetyNote: rec.safetyNote,
    allergens: rec.allergens.length > 0 ? rec.allergens : ["Revisar ingredientes"],
    ingredients: rec.ingredientsUsed.map((line) => ({
      item: line,
      amount: 1,
      unit: "al gusto",
    })),
    utensils: ["Tabla de picar", "Cuchillo con supervisión si se requiere", "Sartén u olla mediana", "Espátula"],
    instructions: rec.steps,
    chefTip: rec.chefTip,
    source: "academia",
  };
}

function renderInlineFormatted(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-950">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <em key={idx} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <span key={idx}>{token}</span>;
  });
}

interface ParsedSection {
  heading: string | null;
  lines: string[];
}

function ChefMessageContent({ text }: { text: string }) {
  const rawLines = text.split(/\r?\n/);
  const sections: ParsedSection[] = [];
  let current: ParsedSection = { heading: null, lines: [] };

  for (const line of rawLines) {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      if (current.heading !== null || current.lines.length > 0) {
        sections.push(current);
      }
      current = { heading: headingMatch[1].replace(/\*\*/g, "").trim(), lines: [] };
    } else {
      current.lines.push(trimmed);
    }
  }
  if (current.heading !== null || current.lines.length > 0) {
    sections.push(current);
  }

  const renderLines = (lines: string[], keyPrefix: string) => {
    const elements: ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (!line) {
        i += 1;
        continue;
      }

      if (/^(\d+)[.)]\s+/.test(line)) {
        const items: Array<{ num: string; body: string }> = [];
        while (i < lines.length && /^(\d+)[.)]\s+/.test(lines[i])) {
          const m = lines[i].match(/^(\d+)[.)]\s+(.+)$/);
          if (m) items.push({ num: m[1], body: m[2] });
          i += 1;
        }
        elements.push(
          <ol key={`${keyPrefix}-ol-${i}`} className="space-y-2">
            {items.map((it, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-800">
                <span className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {it.num}
                </span>
                <span className="flex-1">{renderInlineFormatted(it.body)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      if (/^[-•*]\s+/.test(line)) {
        const bullets: string[] = [];
        while (i < lines.length && /^[-•*]\s+/.test(lines[i])) {
          bullets.push(lines[i].replace(/^[-•*]\s+/, ""));
          i += 1;
        }
        elements.push(
          <ul key={`${keyPrefix}-ul-${i}`} className="space-y-1.5">
            {bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-2" />
                <span className="flex-1">{renderInlineFormatted(b)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      elements.push(
        <p key={`${keyPrefix}-p-${i}`} className="text-sm leading-relaxed text-slate-800">
          {renderInlineFormatted(line)}
        </p>
      );
      i += 1;
    }

    return elements;
  };

  return (
    <div className="space-y-3">
      {sections.map((sec, sIdx) => {
        const cleanLines = sec.lines.filter((l, idx, arr) => l !== "" || (idx > 0 && arr[idx - 1] !== ""));
        if (!sec.heading) {
          return (
            <div key={`sec-${sIdx}`} className="space-y-2">
              {renderLines(cleanLines, `s-${sIdx}`)}
            </div>
          );
        }

        const lowerHeading = sec.heading.toLowerCase();
        const isSafety = /seguridad|alerg|precauci|cuidado|supervisi/.test(lowerHeading);
        const isTip = /truco|consejo|tip/.test(lowerHeading);

        if (isSafety) {
          return (
            <div
              key={`sec-${sIdx}`}
              className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 space-y-1.5"
            >
              <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {sec.heading}
              </p>
              <div className="space-y-1.5 text-amber-950">{renderLines(cleanLines, `s-${sIdx}`)}</div>
            </div>
          );
        }

        if (isTip) {
          return (
            <div
              key={`sec-${sIdx}`}
              className="rounded-xl bg-sky-50 border border-sky-200 px-3.5 py-2.5 space-y-1.5"
            >
              <p className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                {sec.heading}
              </p>
              <div className="space-y-1.5">{renderLines(cleanLines, `s-${sIdx}`)}</div>
            </div>
          );
        }

        return (
          <div key={`sec-${sIdx}`} className="pt-1 space-y-2 border-t border-sky-100 first:border-t-0 first:pt-0">
            <h4 className="text-xs font-bold uppercase tracking-wide text-sky-800">{sec.heading}</h4>
            <div className="space-y-2">{renderLines(cleanLines, `s-${sIdx}`)}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ChefTutorView({ initialPrompt, onConsumeInitialPrompt }: ChefTutorViewProps) {
  const { state, rankTitle } = useProgress();
  const [mode, setMode] = useState<"chat" | "ingredients">("chat");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `¡Hola ${state.studentName || "Chef"}! Soy **Chef Mentor**, tu profesor virtual de CHEF ACADEMY.\n\n### ¿Cómo te puedo ayudar hoy?\n- **Explicarte recetas paso a paso** en lenguaje fácil.\n- **Aclarar técnicas** (como picar seguro o cocer pasta al dente).\n- **Recomendar platos** según lo que tienes en tu cocina.\n\nEscribe tu duda abajo o elige una idea rápida para empezar.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Ingredients mode state
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(["Huevos", "Tomate", "Queso"]);
  const [customIng, setCustomIng] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [preparedScriptIds, setPreparedScriptIds] = useState<Set<string>>(new Set());
  const [videoRecipe, setVideoRecipe] = useState<Recipe | null>(null);
  const [ingLoading, setIngLoading] = useState(false);
  const [ingError, setIngError] = useState<string | null>(null);

  const handleVideoCached = useCallback((recipeId: string) => {
    setPreparedScriptIds((prev) => {
      if (prev.has(recipeId)) return prev;
      const next = new Set(prev);
      next.add(recipeId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setMode("chat");
      void sendChatMessage(initialPrompt);
      onConsumeInitialPrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  async function sendChatMessage(textToSend?: string) {
    const clean = (textToSend ?? input).trim();
    if (!clean || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: clean,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput("");
    setChatError(null);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chef-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          mode: "general",
          studentContext: {
            name: state.studentName,
            levelTitle: rankTitle,
            xp: state.xp,
            allergies: state.allergies,
          },
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error || "No se pudo obtener respuesta del Profesor IA.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: data.reply!,
        },
      ]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Error de conexión con Chef Mentor.");
    } finally {
      setChatLoading(false);
    }
  }

  function toggleIngredient(ing: string) {
    setSelectedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((item) => item !== ing) : [...prev, ing]
    );
  }

  function addCustomIngredient() {
    const clean = customIng.trim();
    if (!clean) return;
    if (!selectedIngredients.some((i) => i.toLowerCase() === clean.toLowerCase())) {
      setSelectedIngredients((prev) => [...prev, clean]);
    }
    setCustomIng("");
  }

  async function requestIngredientRecipes() {
    if (selectedIngredients.length === 0 || ingLoading) return;
    setIngError(null);
    setIngLoading(true);

    try {
      const res = await fetch("/api/chef-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          allergies: state.allergies,
          skillLevel: rankTitle,
        }),
      });
      const data = (await res.json()) as { recipes?: GeneratedRecipe[]; error?: string };
      if (!res.ok || !data.recipes) {
        throw new Error(data.error || "No pudimos generar recetas en este momento.");
      }
      setGeneratedRecipes(data.recipes);

      // Requirement 7: Automatically prepare the 6-scene tutorial script for newly generated recipes
      void Promise.all(
        data.recipes.map(async (rawRec) => {
          const mapped = toAcademyRecipe(rawRec);
          try {
            const preRes = await fetch("/api/chef-video/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipe: mapped,
                duration: "3min",
                voice: "femenino",
                scriptOnly: true,
              }),
            });
            if (preRes.ok) {
              handleVideoCached(mapped.id);
            }
          } catch {
            // background pre-warm failure will cleanly retry when the user opens the player
          }
        })
      );
    } catch (err) {
      setIngError(err instanceof Error ? err.message : "Error al consultar sugerencias.");
    } finally {
      setIngLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-sky-700">Tutor culinario inteligente · Adaptado para jóvenes 12+</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
            Profesor Virtual Chef Mentor
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
            Resuelve dudas, aprende técnicas paso a paso o descubre recetas seguras según los ingredientes que tienes en casa.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-sky-200 self-start">
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              mode === "chat" ? "bg-sky-600 text-white" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Conversar con el Chef
          </button>
          <button
            type="button"
            onClick={() => setMode("ingredients")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              mode === "ingredients" ? "bg-sky-600 text-white" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Recetas con mis ingredientes
          </button>
        </div>
      </div>

      {/* Safety Guardrail Bar */}
      <div className="rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-sky-950">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            Chef Mentor aplica filtros de cocina segura para menores, recuerda supervisión adulta en calor/corte y respeta tus alergias.
          </span>
        </div>
        {state.allergies.length > 0 && (
          <span className="text-sky-800 font-semibold">
            Alergias activas: {state.allergies.join(", ")}
          </span>
        )}
      </div>

      {mode === "chat" ? (
        <div className="rounded-3xl bg-white border border-sky-200 overflow-hidden flex flex-col min-h-[520px] max-h-[72vh] shadow-sm">
          {/* Quick Prompts */}
          <div className="px-4 sm:px-6 py-3 border-b border-sky-100 bg-sky-50/70 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-medium text-slate-500 shrink-0">Ideas rápidas:</span>
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={chatLoading}
                onClick={() => void sendChatMessage(q)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-100 border border-sky-200 text-xs text-slate-700 whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FBFF]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0 mt-0.5">
                      <ChefHat className="w-4 h-4 text-sky-700" />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-sky-600 text-white whitespace-pre-wrap"
                        : "bg-white text-slate-900 border border-sky-200 shadow-xs"
                    }`}
                  >
                    {isUser ? msg.text : <ChefMessageContent text={msg.text} />}
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                </div>
                <span>Chef Mentor está redactando tu explicación segura...</span>
              </div>
            )}

            {chatError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-xs sm:text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{chatError}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendChatMessage();
            }}
            className="p-3 sm:p-4 border-t border-sky-200 bg-white flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre una receta, técnica o sustituto de ingrediente..."
              className="flex-1 rounded-xl bg-sky-50/70 border border-sky-200 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white min-h-[44px]"
            />
            <button
              type="submit"
              disabled={chatLoading || !input.trim()}
              className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px] shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-sky-200 p-5 sm:p-7 space-y-5 shadow-sm">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">
                Selecciona los ingredientes que tienes disponibles
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Chef Mentor creará 2 recetas seguras adaptadas a tu nivel ({rankTitle}) y a tu despensa actual.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PANTRY.map((ing) => {
                const active = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[40px] ${
                      active
                        ? "bg-sky-600 border-sky-600 text-white"
                        : "bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100"
                    }`}
                  >
                    {ing}
                  </button>
                );
              })}
            </div>

            {/* Custom ingredient adder */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={customIng}
                onChange={(e) => setCustomIng(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomIngredient();
                  }
                }}
                placeholder="Otro ingrediente (ej. atún, calabacín, avena)..."
                className="flex-1 min-w-[200px] rounded-xl bg-sky-50/70 border border-sky-200 px-4 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 min-h-[44px]"
              />
              <button
                type="button"
                onClick={addCustomIngredient}
                className="px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {/* Selected list */}
            {selectedIngredients.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100">
                <span className="text-xs text-slate-500">Seleccionados:</span>
                {selectedIngredients.map((ing) => (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-950 text-xs font-medium hover:bg-sky-200"
                  >
                    <span>{ing}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={ingLoading || selectedIngredients.length === 0}
                onClick={() => void requestIngredientRecipes()}
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
              >
                {ingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando recomendaciones...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Recomendar recetas con IA
                  </>
                )}
              </button>
            </div>
          </div>

          {ingError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{ingError}</span>
            </div>
          )}

          {generatedRecipes.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {generatedRecipes.map((rec, idx) => (
                <article
                  key={`${rec.title}-${idx}`}
                  className="rounded-2xl bg-white text-slate-950 border border-sky-200 overflow-hidden flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-sky-100">
                      <SafeImage
                        src={getDishImageForText(rec.title, undefined, "Almuerzo", rec.ingredientsUsed.join(" "))}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="text-sky-700 font-semibold">{rec.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3.5 h-3.5" />
                          {rec.prepTimeMinutes} min
                        </span>
                        {rec.requiresAdultSupervision && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-semibold">Con adulto</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-950 mt-1.5">
                        {rec.title}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 space-y-1">
                      <p className="font-semibold">Seguridad: {rec.safetyNote}</p>
                      <p>Alérgenos: {rec.allergens.join(", ")}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-sky-600" />
                        Ingredientes sugeridos
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1">
                        {rec.ingredientsUsed.join(" · ")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900 mb-1.5">Pasos seguros</p>
                      <ol className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                        {rec.steps.map((s, sIdx) => (
                          <li key={s} className="flex gap-2">
                            <span className="font-mono font-bold text-sky-700">{sIdx + 1}.</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    </div>
                  </div>

                  <div className="mx-6 mb-6 space-y-3">
                    <div className="rounded-xl bg-sky-100 border border-sky-200 text-slate-900 p-3.5 text-xs">
                      <span className="font-bold text-sky-800">Consejo del Chef: </span>
                      <span>{rec.chefTip}</span>
                    </div>

                    {(() => {
                      const mapped = toAcademyRecipe(rec);
                      const isPrepared = preparedScriptIds.has(mapped.id);
                      return (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => setVideoRecipe(mapped)}
                            className="w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold tracking-wide inline-flex items-center justify-center gap-2 min-h-[42px] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            VER VIDEO TUTORIAL
                          </button>
                          {isPrepared && (
                            <p className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              Guion tutorial listo y guardado en biblioteca
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

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
