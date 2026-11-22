import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  Captions,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock,
  Info,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  Users,
  Utensils,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type {
  ChefVideoTutorial,
  NarratorGender,
  Recipe,
  VideoDurationOption,
  VideoServiceStatus,
} from "../types/academy";
import { useProgress } from "../context/ProgressContext";
import { SafeImage } from "./SafeImage";

interface ChefVideoModalProps {
  recipe: Recipe;
  onClose: () => void;
  onCached?: (recipeId: string) => void;
}

const SCENE_LABELS = [
  "1. Presentación",
  "2. Ingredientes",
  "3. Preparación",
  "4. Cocción",
  "5. Emplatado",
  "6. Consejos",
];

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
const SERVING_MULTIPLIERS = [1, 2, 4] as const;

function formatScaledAmount(amount: number, multiplier: number): string {
  const scaled = amount * multiplier;
  if (Number.isInteger(scaled)) return String(scaled);
  return String(Math.round(scaled * 10) / 10);
}

export function ChefVideoModal({ recipe, onClose, onCached }: ChefVideoModalProps) {
  const { state, toggleSaveRecipe, rateCookedRecipe } = useProgress();
  const [durationOption, setDurationOption] = useState<VideoDurationOption>("3min");
  const [voiceGender, setVoiceGender] = useState<NarratorGender>("femenino");
  const [tutorial, setTutorial] = useState<ChefVideoTutorial | null>(null);
  const [serviceStatus, setServiceStatus] = useState<VideoServiceStatus | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Progressive scene audio & sidebar UI state
  const [loadingAudioScenes, setLoadingAudioScenes] = useState<Record<number, boolean>>({});
  const [servingsMultiplier, setServingsMultiplier] = useState<(typeof SERVING_MULTIPLIERS)[number]>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generateAbortRef = useRef<AbortController | null>(null);
  const requestedSceneKeysRef = useRef<Set<string>>(new Set());
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  const loadTutorial = useCallback(
    async (dur: VideoDurationOption, voice: NarratorGender, forceRegenerate = false) => {
      generateAbortRef.current?.abort();
      const controller = new AbortController();
      generateAbortRef.current = controller;

      setLoading(true);
      setError(null);
      setIsPlaying(false);
      setLoadingAudioScenes({});
      requestedSceneKeysRef.current.clear();

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      try {
        const res = await fetch("/api/chef-video/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            recipe: {
              id: recipe.id,
              title: recipe.title,
              difficulty: recipe.difficulty,
              prepTimeMinutes: recipe.prepTimeMinutes,
              servingsBase: recipe.servingsBase,
              country: recipe.country,
              description: recipe.description,
              ingredients: recipe.ingredients,
              utensils: recipe.utensils,
              instructions: recipe.instructions,
              chefTip: recipe.chefTip,
              allergens: recipe.allergens,
              requiresAdultSupervision: recipe.requiresAdultSupervision,
              safetyNote: recipe.safetyNote,
            },
            duration: dur,
            voice,
            forceRegenerate,
          }),
        });

        const data = (await res.json()) as {
          tutorial?: ChefVideoTutorial;
          fromCache?: boolean;
          videoServiceStatus?: VideoServiceStatus;
          error?: string;
        };

        if (controller.signal.aborted) return;

        if (!res.ok || !data.tutorial) {
          throw new Error(data.error || "No se pudo preparar el tutorial audiovisual.");
        }

        setTutorial(data.tutorial);
        setFromCache(Boolean(data.fromCache));
        if (data.videoServiceStatus) setServiceStatus(data.videoServiceStatus);
        setActiveSceneIndex(0);
        setCurrentTime(0);
        onCached?.(recipe.id);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Ocurrió un error al preparar CHEF VIDEO AI."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [onCached, recipe]
  );

  useEffect(() => {
    void loadTutorial("3min", "femenino", false);
    return () => {
      generateAbortRef.current?.abort();
    };
  }, [loadTutorial]);

  // Fetch audio for a single scene (used by progressive background loader & per-scene retry)
  const fetchSceneAudio = useCallback(
    async (
      tut: ChefVideoTutorial,
      sceneNumber: number,
      narrationText: string,
      forceRetry = false
    ) => {
      const requestId = `${tut.cacheKey}__${sceneNumber}`;
      if (!forceRetry && requestedSceneKeysRef.current.has(requestId)) return;
      requestedSceneKeysRef.current.add(requestId);

      setLoadingAudioScenes((prev) => ({ ...prev, [sceneNumber]: true }));

      try {
        const res = await fetch("/api/chef-video/scene-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cacheKey: tut.cacheKey,
            sceneNumber,
            narrationText,
            voice: tut.narratorGender,
          }),
        });

        const data = (await res.json()) as {
          sceneNumber?: number;
          audioUrl?: string | null;
          audioError?: string | null;
          error?: string;
        };

        setTutorial((prev) => {
          if (!prev || prev.cacheKey !== tut.cacheKey) return prev;
          return {
            ...prev,
            scenes: prev.scenes.map((sc) =>
              sc.sceneNumber === sceneNumber
                ? {
                    ...sc,
                    audioUrl: res.ok ? (data.audioUrl ?? null) : null,
                    audioError: res.ok
                      ? (data.audioError ?? null)
                      : (data.error ?? "No se pudo cargar la voz IA."),
                  }
                : sc
            ),
          };
        });
      } catch {
        setTutorial((prev) => {
          if (!prev || prev.cacheKey !== tut.cacheKey) return prev;
          return {
            ...prev,
            scenes: prev.scenes.map((sc) =>
              sc.sceneNumber === sceneNumber
                ? {
                    ...sc,
                    audioError: "Error de conexión al cargar la voz IA.",
                  }
                : sc
            ),
          };
        });
      } finally {
        setLoadingAudioScenes((prev) => ({ ...prev, [sceneNumber]: false }));
      }
    },
    []
  );

  // Progressive audio loader: prioritizes active scene, then next scene, then remaining scenes
  useEffect(() => {
    if (!tutorial) return;
    let cancelled = false;

    const missingIndices: number[] = [];
    const total = tutorial.scenes.length;
    const priorityOrder = [
      activeSceneIndex,
      activeSceneIndex + 1,
      ...Array.from({ length: total }, (_, idx) => idx),
    ];

    for (const idx of priorityOrder) {
      if (idx < 0 || idx >= total || missingIndices.includes(idx)) continue;
      const sc = tutorial.scenes[idx];
      if (!sc.audioUrl && !sc.audioError) {
        missingIndices.push(idx);
      }
    }

    if (missingIndices.length === 0) return;

    void (async () => {
      for (const idx of missingIndices) {
        if (cancelled) break;
        const sc = tutorial.scenes[idx];
        await fetchSceneAudio(tutorial, sc.sceneNumber, sc.narrationText, false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSceneIndex, fetchSceneAudio, tutorial]);

  const activeScene = tutorial?.scenes[activeSceneIndex] ?? null;

  // Preload next scene WAV into browser cache for gapless transitions
  useEffect(() => {
    if (!tutorial) return;
    const nextScene = tutorial.scenes[activeSceneIndex + 1];
    if (nextScene?.audioUrl && !preloadedUrlsRef.current.has(nextScene.audioUrl)) {
      preloadedUrlsRef.current.add(nextScene.audioUrl);
      const preloader = new Audio();
      preloader.preload = "auto";
      preloader.src = nextScene.audioUrl;
    }
  }, [activeSceneIndex, tutorial]);

  // Sync volume & playback rate with HTML5 audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackSpeed;
  }, [volume, isMuted, playbackSpeed, activeSceneIndex, tutorial?.cacheKey]);

  // Load audio source when changing scene or when activeScene audioUrl finishes arriving
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeScene) return;

    const expectedDuration = activeScene.estimatedSeconds || 25;
    setAudioDuration(expectedDuration);

    if (activeScene.audioUrl) {
      const targetSrc = new URL(activeScene.audioUrl, window.location.origin).href;
      if (audio.src !== targetSrc) {
        audio.src = activeScene.audioUrl;
        audio.load();
      }
      audio.playbackRate = playbackSpeed;
      audio.volume = isMuted ? 0 : volume;
      if (isPlaying && currentTime < 4) {
        void audio.play().catch(() => {
          // Stay in visual reading mode if browser blocks autoplay
        });
      }
    } else {
      audio.removeAttribute("src");
    }
    // Intentionally exclude playbackSpeed/isMuted/volume/currentTime to avoid resetting mid-playback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene?.audioUrl, activeSceneIndex, tutorial?.cacheKey]);

  // Fallback visual reading timer when activeScene has no audioUrl yet or failed TTS
  useEffect(() => {
    if (!isPlaying || !activeScene || activeScene.audioUrl || !tutorial) return;

    const sceneDur = Math.max(6, activeScene.estimatedSeconds || 25);
    const tickMs = 150;
    const timer = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + (tickMs / 1000) * playbackSpeed;
        if (next >= sceneDur) {
          if (activeSceneIndex < tutorial.scenes.length - 1) {
            setActiveSceneIndex((idx) => idx + 1);
            return 0;
          }
          setIsPlaying(false);
          return sceneDur;
        }
        return next;
      });
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [activeScene, activeSceneIndex, isPlaying, playbackSpeed, tutorial]);

  const handleSelectScene = useCallback((idx: number) => {
    setActiveSceneIndex(idx);
    setCurrentTime(0);
  }, []);

  const handleTogglePlay = useCallback(async () => {
    if (!activeScene) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    if (audio && activeScene.audioUrl) {
      try {
        await audio.play();
      } catch {
        // Fallback timer can continue if autoplay blocked
      }
    }
  }, [activeScene, isPlaying]);

  const handleRestartTutorial = useCallback(async () => {
    setActiveSceneIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    const audio = audioRef.current;
    const firstScene = tutorial?.scenes[0];
    if (audio && firstScene?.audioUrl) {
      audio.src = firstScene.audioUrl;
      audio.currentTime = 0;
      try {
        await audio.play();
      } catch {
        // Visual timer handles fallback
      }
    }
  }, [tutorial]);

  const handleNextScene = useCallback(() => {
    if (!tutorial) return;
    if (activeSceneIndex < tutorial.scenes.length - 1) {
      setActiveSceneIndex((prev) => prev + 1);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
    }
  }, [activeSceneIndex, tutorial]);

  const handlePrevScene = useCallback(() => {
    if (activeSceneIndex > 0) {
      setActiveSceneIndex((prev) => prev - 1);
      setCurrentTime(0);
    } else {
      setCurrentTime(0);
      if (audioRef.current && activeScene?.audioUrl) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [activeScene?.audioUrl, activeSceneIndex]);

  const handleSeek = useCallback(
    (nextSec: number) => {
      const clamped = Math.max(0, Math.min(nextSec, Math.max(1, audioDuration || activeScene?.estimatedSeconds || 25)));
      setCurrentTime(clamped);
      if (audioRef.current && activeScene?.audioUrl) {
        audioRef.current.currentTime = clamped;
      }
    },
    [activeScene?.audioUrl, activeScene?.estimatedSeconds, audioDuration]
  );

  // Keyboard shortcuts for fast hands-free control
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        audioRef.current?.pause();
        onClose();
        return;
      }

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        void handleTogglePlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (e.shiftKey) handleNextScene();
        else handleSeek(currentTime + 5);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (e.shiftKey) handlePrevScene();
        else handleSeek(currentTime - 5);
      } else if (e.key.toLowerCase() === "m") {
        setIsMuted((m) => !m);
      } else if (e.key.toLowerCase() === "c") {
        setShowSubtitles((s) => !s);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentTime, handleNextScene, handlePrevScene, handleSeek, handleTogglePlay, onClose]);

  const effectiveSceneDuration = useMemo(() => {
    if (!activeScene) return 25;
    return audioDuration > 0 ? audioDuration : activeScene.estimatedSeconds || 25;
  }, [activeScene, audioDuration]);

  const sceneProgressRatio = useMemo(() => {
    return Math.min(0.999, Math.max(0, currentTime / Math.max(1, effectiveSceneDuration)));
  }, [currentTime, effectiveSceneDuration]);

  // Current subtitle line synced to progress
  const activeSubtitle = useMemo(() => {
    if (!activeScene) return "";
    const chunks = activeScene.subtitleChunks;
    if (!chunks || chunks.length === 0) return activeScene.narrationText;
    const idx = Math.floor(sceneProgressRatio * chunks.length);
    return chunks[idx] ?? chunks[0];
  }, [activeScene, sceneProgressRatio]);

  // Active highlighted bullet synced to narration progress
  const activeHighlightIndex = useMemo(() => {
    if (!activeScene || activeScene.visualHighlights.length === 0) return -1;
    const count = Math.min(4, activeScene.visualHighlights.length);
    return Math.min(count - 1, Math.floor(sceneProgressRatio * count));
  }, [activeScene, sceneProgressRatio]);

  // Overall tutorial elapsed & total seconds
  const { totalElapsedSeconds, totalDurationSeconds, readyAudioCount } = useMemo(() => {
    if (!tutorial) return { totalElapsedSeconds: 0, totalDurationSeconds: 0, readyAudioCount: 0 };
    let elapsed = 0;
    let total = 0;
    let readyCount = 0;
    tutorial.scenes.forEach((sc, idx) => {
      const dur = idx === activeSceneIndex ? effectiveSceneDuration : sc.estimatedSeconds || 25;
      total += dur;
      if (idx < activeSceneIndex) elapsed += dur;
      else if (idx === activeSceneIndex) elapsed += Math.min(currentTime, dur);
      if (sc.audioUrl) readyCount += 1;
    });
    return {
      totalElapsedSeconds: elapsed,
      totalDurationSeconds: total,
      readyAudioCount: readyCount,
    };
  }, [activeSceneIndex, currentTime, effectiveSceneDuration, tutorial]);

  const formatTime = (secs: number) => {
    const clean = Math.max(0, Math.floor(secs));
    const m = Math.floor(clean / 60);
    const s = clean % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const isSaved = state.savedRecipeIds.includes(recipe.id);
  const existingRating = state.recipeRatings?.[recipe.id];
  const isActiveAudioLoading = activeScene ? Boolean(loadingAudioScenes[activeScene.sceneNumber]) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chef-video-title"
    >
      <div className="w-full max-w-6xl max-h-[95vh] rounded-t-3xl sm:rounded-3xl bg-[#F4F9FF] text-slate-950 overflow-hidden flex flex-col shadow-2xl border border-sky-200">
        {/* Top Studio Bar */}
        <div className="bg-white px-5 sm:px-7 py-3.5 border-b border-sky-200 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-700">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                CHEF VIDEO AI
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{recipe.prepTimeMinutes} min</span>
              {fromCache && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Guardado en biblioteca
                  </span>
                </>
              )}
              {tutorial && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600 tabular-nums">
                    Voces listas: {readyAudioCount}/{tutorial.scenes.length}
                  </span>
                </>
              )}
            </div>
            <h2 id="chef-video-title" className="font-display text-lg sm:text-xl font-bold truncate mt-0.5">
              Tutorial: {recipe.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              generateAbortRef.current?.abort();
              audioRef.current?.pause();
              onClose();
            }}
            aria-label="Cerrar reproductor de tutorial"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center justify-center text-slate-700 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1">
          {/* Compact Controls + Expandable Service Status */}
          <div className="rounded-2xl bg-white border border-sky-200 p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Duración:
                  <select
                    value={durationOption}
                    onChange={(e) => {
                      const next = e.target.value as VideoDurationOption;
                      setDurationOption(next);
                      void loadTutorial(next, voiceGender, false);
                    }}
                    disabled={loading}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-slate-900 min-h-[38px]"
                  >
                    <option value="1min">Corta (1 min)</option>
                    <option value="3min">Normal (3 min)</option>
                    <option value="6min">Completa (5-8 min)</option>
                  </select>
                </label>

                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Narrador:
                  <select
                    value={voiceGender}
                    onChange={(e) => {
                      const next = e.target.value as NarratorGender;
                      setVoiceGender(next);
                      void loadTutorial(durationOption, next, false);
                    }}
                    disabled={loading}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-slate-900 min-h-[38px]"
                  >
                    <option value="femenino">Profesora Chef (Femenina)</option>
                    <option value="masculino">Profesor Chef (Masculino)</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => setShowServiceDetails((s) => !s)}
                  className="text-xs font-semibold text-sky-800 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 inline-flex items-center gap-1.5 min-h-[38px]"
                >
                  <Info className="w-3.5 h-3.5 text-sky-700" />
                  <span>Motor educativo IA</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showServiceDetails ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {tutorial && !loading && (
                <button
                  type="button"
                  onClick={() => void loadTutorial(durationOption, voiceGender, true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800 inline-flex items-center gap-1.5 min-h-[38px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerar con IA
                </button>
              )}
            </div>

            {showServiceDetails && (
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 mb-0.5">
                  Estado del servicio ({serviceStatus?.videoServiceName ?? "Google Veo / Omni Flash"})
                </p>
                <p>
                  {serviceStatus?.statusMessage ??
                    "La generación de video MP4 con Google Veo / Omni Flash requiere seleccionar una clave de API con facturación habilitada. Estás usando el tutorial educativo real con guion inteligente de 6 escenas (Gemini), subtítulos sincronizados y voz real IA en español."}
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white border border-sky-200 p-10 sm:p-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-sky-600 animate-spin mx-auto" />
              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-bold text-slate-950">
                  Preparando tu tutorial rápido con Profesor Chef IA...
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Escribiendo las 6 escenas educativas y generando primero la voz de la Escena 1 para que empieces a cocinar en segundos.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-sky-800 pt-1">
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 font-semibold">
                  Guion 6 etapas
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 font-semibold">
                  Voz real en español
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 font-semibold">
                  Carga progresiva sin esperas
                </span>
              </div>
            </div>
          ) : error || !tutorial || !activeScene ? (
            <div className="rounded-3xl bg-white border border-rose-200 p-8 text-center space-y-4">
              <AlertTriangle className="w-9 h-9 text-rose-600 mx-auto" />
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950">
                  No se pudo completar la generación del tutorial
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => void loadTutorial(durationOption, voiceGender, false)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold min-h-[44px]"
              >
                Reintentar generación
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-5 items-start">
              {/* Left 8 Columns: Player Stage, Controls, Chapters, Pedagogy */}
              <div className="lg:col-span-8 space-y-4">
                {/* Hidden Real Audio Element */}
                <audio
                  ref={audioRef}
                  preload="auto"
                  onLoadedMetadata={(e) => {
                    const dur = e.currentTarget.duration;
                    if (Number.isFinite(dur) && dur > 0) setAudioDuration(dur);
                  }}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime);
                  }}
                  onEnded={() => {
                    if (activeSceneIndex < tutorial.scenes.length - 1) {
                      setActiveSceneIndex((prev) => prev + 1);
                      setCurrentTime(0);
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                  onError={() => {
                    // Keep visual timer running smoothly if WAV fails to decode
                    if (activeScene.audioUrl) {
                      setTutorial((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          scenes: prev.scenes.map((sc) =>
                            sc.sceneNumber === activeScene.sceneNumber
                              ? { ...sc, audioUrl: null, audioError: "No se pudo cargar el archivo de audio." }
                              : sc
                          ),
                        };
                      });
                    }
                  }}
                />

                {/* Visual Tutorial Stage */}
                <div className="rounded-3xl overflow-hidden bg-slate-950 text-white border border-sky-200 shadow-lg relative">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <SafeImage
                      src={recipe.image}
                      alt={recipe.title}
                      className={`w-full h-full object-cover opacity-55 animate-ken-burns ${
                        isPlaying ? "" : "animate-ken-burns-paused"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/35" />

                    {/* Top Scene Header */}
                    <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-sky-600/95 text-white text-xs font-bold inline-flex items-center gap-2 shadow">
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>
                          Escena {activeScene.sceneNumber}/{tutorial.scenes.length} ·{" "}
                          {activeScene.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-[11px] font-semibold text-white inline-flex items-center gap-1.5">
                          {activeScene.audioUrl ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Voz IA lista
                            </>
                          ) : isActiveAudioLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-sky-300" />
                              Cargando voz IA...
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              Lectura sincronizada
                            </>
                          )}
                        </span>
                        <span className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-[11px] font-semibold text-white tabular-nums">
                          {voiceGender === "masculino" ? "Prof. Chef" : "Profa. Chef"} · {playbackSpeed}x
                        </span>
                      </div>
                    </div>

                    {/* Center Scene Visual Cards with dynamic focus */}
                    <div className="absolute inset-x-4 sm:inset-x-6 top-14 sm:top-16 bottom-20 flex flex-col justify-center">
                      <div className="rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 p-3.5 sm:p-5 max-w-2xl">
                        <h3 className="font-display text-base sm:text-xl font-bold text-white leading-snug">
                          {activeScene.headline}
                        </h3>
                        <ul className="mt-2.5 grid sm:grid-cols-2 gap-1.5 text-xs sm:text-sm">
                          {activeScene.visualHighlights.slice(0, 4).map((hl, hlIdx) => {
                            const isCurrentHighlight = isPlaying && hlIdx === activeHighlightIndex;
                            return (
                              <li
                                key={`${activeScene.sceneNumber}-${hlIdx}`}
                                className={`flex items-start gap-1.5 rounded-lg px-2 py-1 transition-colors ${
                                  isCurrentHighlight
                                    ? "bg-sky-500/35 border border-sky-300/60 text-white font-semibold"
                                    : "text-sky-100 border border-transparent"
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    isCurrentHighlight ? "text-white" : "text-sky-300"
                                  }`}
                                />
                                <span className="line-clamp-2">{hl}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Synchronized Subtitles */}
                    {showSubtitles && (
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 flex justify-center">
                        <div className="bg-slate-950/90 border border-white/15 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl text-center max-w-2xl shadow-lg">
                          {activeSubtitle}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Per-scene Audio Unavailable Alert with Instant Single-Scene Retry */}
                  {activeScene.audioError && !activeScene.audioUrl && !isActiveAudioLoading && (
                    <div className="bg-amber-950/90 border-t border-amber-700/50 px-4 py-2 text-xs text-amber-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>
                          Voz IA temporalmente no disponible en esta escena ({activeScene.audioError}). El modo lectura sincronizada sigue funcionando.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          void fetchSceneAudio(
                            tutorial,
                            activeScene.sceneNumber,
                            activeScene.narrationText,
                            true
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-amber-300 text-amber-950 font-semibold hover:bg-amber-200 transition-colors shrink-0"
                      >
                        Reintentar esta escena
                      </button>
                    </div>
                  )}

                  {/* Player Controls Bar */}
                  <div className="bg-white text-slate-900 p-4 border-t border-sky-200 space-y-3">
                    {/* Unified 6-Stage Chapter Indicator + Total Time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 tabular-nums">
                        <span>
                          Escena {activeScene.sceneNumber}: {formatTime(currentTime)} / {formatTime(effectiveSceneDuration)}
                        </span>
                        <span>
                          Tutorial total: {formatTime(totalElapsedSeconds)} / {formatTime(totalDurationSeconds)}
                        </span>
                      </div>

                      {/* Segmented 6-chapter clickable progress strip */}
                      <div className="grid grid-cols-6 gap-1" role="group" aria-label="Progreso por capítulos">
                        {tutorial.scenes.map((sc, idx) => {
                          const isDone = idx < activeSceneIndex;
                          const isCurrent = idx === activeSceneIndex;
                          const fillPct = isDone ? 100 : isCurrent ? Math.round(sceneProgressRatio * 100) : 0;
                          return (
                            <button
                              key={`seg-${sc.sceneNumber}`}
                              type="button"
                              onClick={() => handleSelectScene(idx)}
                              title={`Ir a ${SCENE_LABELS[idx] ?? `Escena ${sc.sceneNumber}`}`}
                              className="h-2 rounded-full bg-sky-100 overflow-hidden hover:ring-2 hover:ring-sky-300 transition-all block w-full"
                            >
                              <progress
                                value={fillPct}
                                max={100}
                                aria-label={SCENE_LABELS[idx] ?? `Escena ${sc.sceneNumber}`}
                                className={`w-full h-2 block appearance-none [&::-webkit-progress-bar]:bg-sky-100 ${
                                  isCurrent
                                    ? "[&::-webkit-progress-value]:bg-sky-600 [&::-moz-progress-bar]:bg-sky-600"
                                    : "[&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Scrubbable Active Scene Range */}
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, Math.round(effectiveSceneDuration))}
                        value={Math.min(
                          Math.round(currentTime),
                          Math.max(1, Math.round(effectiveSceneDuration))
                        )}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        aria-label="Deslizador de tiempo de la escena actual"
                        className="w-full accent-sky-600 cursor-pointer h-2"
                      />
                    </div>

                    {/* Buttons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrevScene}
                          aria-label="Escena anterior"
                          className="px-2.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-800 inline-flex items-center justify-center min-h-[42px]"
                        >
                          <SkipBack className="w-4 h-4 text-sky-700" />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleTogglePlay()}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px]"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-4 h-4" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              {activeScene.audioUrl ? "Reproducir" : "Reproducir lectura"}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleRestartTutorial()}
                          aria-label="Reiniciar tutorial"
                          className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                          <span className="hidden sm:inline">Reiniciar</span>
                        </button>

                        {/* Volume Control */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 min-h-[42px]">
                          <button
                            type="button"
                            onClick={() => setIsMuted((m) => !m)}
                            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                            className="text-sky-700 hover:text-sky-900"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              setIsMuted(false);
                              setVolume(Number(e.target.value));
                            }}
                            aria-label="Control de volumen"
                            className="w-14 accent-sky-600 cursor-pointer"
                          />
                        </div>

                        {/* Subtitles Toggle */}
                        <button
                          type="button"
                          onClick={() => setShowSubtitles((s) => !s)}
                          aria-label="Activar o desactivar subtítulos"
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px] ${
                            showSubtitles
                              ? "bg-sky-100 border-sky-300 text-sky-900"
                              : "bg-white border-sky-200 text-slate-600"
                          }`}
                        >
                          <Captions className="w-4 h-4" />
                          <span className="hidden sm:inline">Subtítulos</span>
                        </button>

                        {/* Speed Selector */}
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(Number(e.target.value) as (typeof SPEEDS)[number])}
                          aria-label="Velocidad de reproducción"
                          className="px-2.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-slate-900 min-h-[42px]"
                        >
                          {SPEEDS.map((sp) => (
                            <option key={sp} value={sp}>
                              {sp}x
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextScene}
                        disabled={activeSceneIndex >= tutorial.scenes.length - 1}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px]"
                      >
                        Siguiente escena
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="hidden md:block text-[11px] text-slate-500">
                      Atajos: Espacio (pausa/reproducir) · ←/→ (±5s) · Shift+←/→ (escena) · M (silenciar) · C (subtítulos)
                    </p>
                  </div>
                </div>

                {/* Chapters Strip (Escenas 1-6) */}
                <div className="rounded-2xl bg-white border border-sky-200 p-4">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <p className="text-xs font-bold text-slate-900">
                      Capítulos del tutorial (6 etapas)
                    </p>
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {readyAudioCount}/{tutorial.scenes.length} audios listos
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tutorial.scenes.map((sc, idx) => {
                      const active = idx === activeSceneIndex;
                      const isSceneLoading = Boolean(loadingAudioScenes[sc.sceneNumber]);
                      return (
                        <button
                          key={sc.sceneNumber}
                          type="button"
                          onClick={() => handleSelectScene(idx)}
                          className={`p-2.5 rounded-xl text-left border transition-colors min-h-[48px] ${
                            active
                              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                              : "bg-sky-50/70 text-slate-800 border-sky-200 hover:bg-sky-100"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-[11px] font-bold ${active ? "text-sky-100" : "text-sky-700"}`}>
                              {SCENE_LABELS[idx] ?? `Escena ${sc.sceneNumber}`}
                            </p>
                            {sc.audioUrl ? (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  active ? "bg-emerald-300" : "bg-emerald-500"
                                }`}
                                title="Voz IA lista"
                              />
                            ) : isSceneLoading ? (
                              <Loader2
                                className={`w-3 h-3 animate-spin shrink-0 ${
                                  active ? "text-sky-100" : "text-sky-600"
                                }`}
                              />
                            ) : null}
                          </div>
                          <p className="text-xs font-semibold truncate mt-0.5">{sc.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Virtual Chef Script, Why Technique Matters & Vocabulary */}
                <div className="rounded-2xl bg-white border border-sky-200 p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-sky-700">Narración del Profesor Virtual</p>
                    <p className="text-sm text-slate-800 mt-1.5 leading-relaxed">
                      {activeScene.narrationText}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-sky-50 border border-sky-200 p-3.5">
                      <p className="text-xs font-bold text-sky-800">¿Por qué se hace esta técnica?</p>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {activeScene.whyTechniqueMatters}
                      </p>
                    </div>
                    <div className="rounded-xl bg-sky-50 border border-sky-200 p-3.5">
                      <p className="text-xs font-bold text-sky-800 inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Vocabulario: {activeScene.culinaryTerm.term}
                      </p>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {activeScene.culinaryTerm.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Seguridad alimentaria y prevención
                    </p>
                    {activeScene.safetyAlert && <p>{activeScene.safetyAlert}</p>}
                    <p className="text-amber-900">{tutorial.foodSafetyReminder}</p>
                  </div>
                </div>
              </div>

              {/* Right 4 Columns: Recipe Card, Star Rating, Scaled Ingredients Checklist, Utensils & Steps */}
              <aside className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl bg-white border border-sky-200 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-sky-200">
                      <SafeImage
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-sky-700">
                        {recipe.mealType} · {recipe.country ?? recipe.category}
                      </p>
                      <p className="font-display font-bold text-sm text-slate-950 line-clamp-2">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 inline-flex items-center gap-1 tabular-nums">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTimeMinutes} min · {recipe.servingsBase * servingsMultiplier} porciones
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveRecipe(recipe.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 min-h-[42px] transition-colors ${
                      isSaved
                        ? "bg-sky-600 text-white"
                        : "bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-800"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Receta guardada en favoritos" : "Guardar receta"}
                  </button>

                  {/* Quick 5-Star Cooked Rating */}
                  <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 space-y-1.5">
                    <p className="text-xs font-bold text-slate-900">
                      {existingRating
                        ? `Tu puntuación: ${existingRating.stars}/5 estrellas`
                        : "¿Ya la preparaste? Puntúala:"}
                    </p>
                    <div className="flex items-center gap-1">
                      {([1, 2, 3, 4, 5] as const).map((star) => {
                        const active = (existingRating?.stars ?? 0) >= star;
                        return (
                          <button
                            key={`rate-${star}`}
                            type="button"
                            onClick={() =>
                              rateCookedRecipe({
                                recipeId: recipe.id,
                                recipeTitle: recipe.title,
                                recipeImage: recipe.image,
                                stars: star,
                              })
                            }
                            aria-label={`Puntuar con ${star} estrellas`}
                            className="p-1.5 rounded-lg hover:bg-sky-100 transition-colors"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                active ? "text-amber-500 fill-amber-400" : "text-slate-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Ingredients Checklist with 1x / 2x / 4x Servings Scaler */}
                <div className="rounded-2xl bg-white border border-sky-200 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-sm text-slate-950 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sky-600" />
                      Ingredientes ({recipe.servingsBase * servingsMultiplier} porc.)
                    </h3>
                    <div className="inline-flex rounded-lg bg-sky-50 border border-sky-200 p-0.5">
                      {SERVING_MULTIPLIERS.map((mult) => (
                        <button
                          key={mult}
                          type="button"
                          onClick={() => setServingsMultiplier(mult)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                            servingsMultiplier === mult
                              ? "bg-sky-600 text-white"
                              : "text-slate-700 hover:bg-sky-100"
                          }`}
                        >
                          {mult}x
                        </button>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {recipe.ingredients.map((ing) => {
                      const checked = Boolean(checkedIngredients[ing.item]);
                      return (
                        <li key={ing.item}>
                          <button
                            type="button"
                            onClick={() =>
                              setCheckedIngredients((prev) => ({
                                ...prev,
                                [ing.item]: !prev[ing.item],
                              }))
                            }
                            className={`w-full text-left px-2.5 py-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition-colors ${
                              checked
                                ? "bg-emerald-50 border-emerald-200 text-slate-500 line-through"
                                : "bg-sky-50/60 border-sky-200/80 text-slate-800 hover:bg-sky-50"
                            }`}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                  checked
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : "bg-white border-sky-300"
                                }`}
                              >
                                {checked && <Check className="w-3 h-3" />}
                              </span>
                              <span className="truncate">{ing.item}</span>
                            </span>
                            <span className="font-mono font-semibold text-sky-700 tabular-nums shrink-0">
                              {ing.unit === "al gusto"
                                ? "al gusto"
                                : `${formatScaledAmount(ing.amount, servingsMultiplier)} ${ing.unit}`}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="pt-2 border-t border-sky-100">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                      <Utensils className="w-3.5 h-3.5 text-sky-600" />
                      Utensilios
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {recipe.utensils.join(" · ")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-sky-50 border border-sky-200 p-2.5 text-[11px] text-sky-900">
                    <strong>Alérgenos:</strong> {recipe.allergens.join(", ")}
                  </div>
                </div>

                {/* Recipe Steps Quick List */}
                <div className="rounded-2xl bg-white border border-sky-200 p-4 space-y-2.5">
                  <h3 className="font-display font-bold text-sm text-slate-950">
                    Resumen de pasos
                  </h3>
                  <ol className="space-y-2">
                    {recipe.instructions.map((step, i) => (
                      <li key={`${recipe.id}-vstep-${i}`} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
                        <span className="font-mono font-bold text-sky-700 shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
