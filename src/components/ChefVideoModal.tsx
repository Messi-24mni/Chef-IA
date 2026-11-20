import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  Captions,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Info,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  SkipForward,
  Sparkles,
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

export function ChefVideoModal({ recipe, onClose, onCached }: ChefVideoModalProps) {
  const { state, toggleSaveRecipe } = useProgress();
  const [durationOption, setDurationOption] = useState<VideoDurationOption>("3min");
  const [voiceGender, setVoiceGender] = useState<NarratorGender>("femenino");
  const [tutorial, setTutorial] = useState<ChefVideoTutorial | null>(null);
  const [serviceStatus, setServiceStatus] = useState<VideoServiceStatus | null>(null);
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
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadTutorial = useCallback(
    async (dur: VideoDurationOption, voice: NarratorGender, forceRegenerate = false) => {
      setLoading(true);
      setError(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      try {
        const res = await fetch("/api/chef-video/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setError(
          err instanceof Error ? err.message : "Ocurrió un error al preparar CHEF VIDEO AI."
        );
      } finally {
        setLoading(false);
      }
    },
    [onCached, recipe]
  );

  useEffect(() => {
    void loadTutorial("3min", "femenino", false);
  }, [loadTutorial]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        audioRef.current?.pause();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const activeScene = tutorial?.scenes[activeSceneIndex] ?? null;

  // Sync volume & playback rate with HTML5 audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackSpeed;
  }, [volume, isMuted, playbackSpeed, activeSceneIndex, tutorial]);

  // Trigger audio playback when activeScene changes while playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeScene) return;
    setCurrentTime(0);
    setAudioDuration(activeScene.estimatedSeconds || 25);

    if (activeScene.audioUrl) {
      audio.src = activeScene.audioUrl;
      audio.load();
      audio.playbackRate = playbackSpeed;
      audio.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        void audio.play().catch(() => setIsPlaying(false));
      }
    } else {
      audio.removeAttribute("src");
    }
    // Intentionally exclude playbackSpeed/isMuted/volume to avoid restarting clip on slider drag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene?.audioUrl, activeSceneIndex, tutorial?.cacheKey]);

  const handleTogglePlay = async () => {
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
        setIsPlaying(false);
      }
    }
  };

  const handleRestartTutorial = async () => {
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
        setIsPlaying(false);
      }
    }
  };

  const handleNextScene = () => {
    if (!tutorial) return;
    if (activeSceneIndex < tutorial.scenes.length - 1) {
      setActiveSceneIndex((prev) => prev + 1);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (nextSec: number) => {
    setCurrentTime(nextSec);
    if (audioRef.current && activeScene?.audioUrl) {
      audioRef.current.currentTime = nextSec;
    }
  };

  // Current subtitle line synced to audio progress
  const activeSubtitle = useMemo(() => {
    if (!activeScene) return "";
    const chunks = activeScene.subtitleChunks;
    if (!chunks || chunks.length === 0) return activeScene.narrationText;
    const total = audioDuration > 0 ? audioDuration : activeScene.estimatedSeconds || 25;
    const ratio = Math.min(0.999, Math.max(0, currentTime / Math.max(1, total)));
    const idx = Math.floor(ratio * chunks.length);
    return chunks[idx] ?? chunks[0];
  }, [activeScene, audioDuration, currentTime]);

  const formatTime = (secs: number) => {
    const clean = Math.max(0, Math.floor(secs));
    const m = Math.floor(clean / 60);
    const s = clean % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const isSaved = state.savedRecipeIds.includes(recipe.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chef-video-title"
    >
      <div className="w-full max-w-6xl max-h-[95vh] rounded-t-3xl sm:rounded-3xl bg-[#F4F9FF] text-slate-950 overflow-hidden flex flex-col shadow-2xl border border-sky-200">
        {/* Top Studio Bar */}
        <div className="bg-white px-5 sm:px-7 py-4 border-b border-sky-200 flex items-center justify-between gap-4 shrink-0">
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
            </div>
            <h2 id="chef-video-title" className="font-display text-lg sm:text-xl font-bold truncate mt-0.5">
              Tutorial: {recipe.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
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
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Transparent Google Video Service Status Notice */}
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                Estado del servicio de video IA ({serviceStatus?.videoServiceName ?? "Google Veo / Omni Flash"})
              </p>
              <p className="leading-relaxed">
                {serviceStatus?.statusMessage ??
                  "La generación de video MP4 con Google Veo / Omni Flash requiere seleccionar una clave de API con facturación habilitada. Para no simular videos falsos, estás utilizando la alternativa educativa real con guion inteligente de 6 escenas (Gemini), subtítulos sincronizados y voz real IA en español."}
              </p>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="rounded-2xl bg-white border border-sky-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
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

              <span className="text-xs font-semibold text-slate-600 px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200">
                Idioma: Español
              </span>
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

          {loading ? (
            <div className="rounded-3xl bg-white border border-sky-200 p-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-sky-600 animate-spin mx-auto" />
              <div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  Preparando tu tutorial con Profesor Chef IA...
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
                  Creando las 6 escenas educativas (Presentación, Ingredientes, Preparación, Cocción, Emplatado y Consejos) junto con la narración en español y subtítulos sincronizados.
                </p>
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
                    setIsPlaying(false);
                  }}
                />

                {/* Visual Tutorial Stage */}
                <div className="rounded-3xl overflow-hidden bg-slate-950 text-white border border-sky-200 shadow-lg relative">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <SafeImage
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/35" />

                    {/* Top Scene Header */}
                    <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-sky-600/95 text-white text-xs font-bold inline-flex items-center gap-2">
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>
                          Escena {activeScene.sceneNumber} de {tutorial.scenes.length} ·{" "}
                          {activeScene.title}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-semibold text-white tabular-nums">
                        {voiceGender === "masculino" ? "Profesor Chef" : "Profesora Chef"} ·{" "}
                        {playbackSpeed}x
                      </span>
                    </div>

                    {/* Center Scene Visual Cards */}
                    <div className="absolute inset-x-4 sm:inset-x-6 top-14 sm:top-16 bottom-20 flex flex-col justify-center">
                      <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-4 sm:p-5 max-w-2xl">
                        <h3 className="font-display text-lg sm:text-2xl font-bold text-white leading-snug">
                          {activeScene.headline}
                        </h3>
                        <ul className="mt-2.5 grid sm:grid-cols-2 gap-1.5 text-xs sm:text-sm text-sky-100">
                          {activeScene.visualHighlights.slice(0, 4).map((hl) => (
                            <li key={hl} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-sky-300 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Synchronized Subtitles */}
                    {showSubtitles && (
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 flex justify-center">
                        <div className="bg-slate-950/88 border border-white/15 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl text-center max-w-2xl shadow-lg">
                          {activeSubtitle}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio Missing Transparency Alert (if TTS quota failed for this scene) */}
                  {activeScene.audioError && !activeScene.audioUrl && (
                    <div className="bg-amber-950/90 border-t border-amber-700/50 px-4 py-2.5 text-xs text-amber-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>
                          Voz IA no disponible en esta escena ({activeScene.audioError}). Puedes leer la narración y subtítulos completos abajo.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => void loadTutorial(durationOption, voiceGender, false)}
                        className="px-2.5 py-1 rounded-lg bg-amber-300 text-amber-950 font-semibold hover:bg-amber-200 transition-colors shrink-0"
                      >
                        Reintentar voz IA
                      </button>
                    </div>
                  )}

                  {/* Player Controls Bar */}
                  <div className="bg-white text-slate-900 p-4 border-t border-sky-200 space-y-3">
                    {/* Scrubbable Progress Bar */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-600 tabular-nums w-10">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, Math.round(audioDuration || activeScene.estimatedSeconds))}
                        value={Math.min(
                          Math.round(currentTime),
                          Math.max(1, Math.round(audioDuration || activeScene.estimatedSeconds))
                        )}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        aria-label="Progreso de la escena"
                        className="flex-1 accent-sky-600 cursor-pointer h-2"
                      />
                      <span className="font-mono text-xs text-slate-600 tabular-nums w-10 text-right">
                        {formatTime(audioDuration || activeScene.estimatedSeconds)}
                      </span>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleTogglePlay()}
                          disabled={!activeScene.audioUrl}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px]"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-4 h-4" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Reproducir
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleRestartTutorial()}
                          aria-label="Volver a reproducir"
                          className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[42px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                          <span className="hidden sm:inline">Volver a reproducir</span>
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
                            className="w-16 accent-sky-600 cursor-pointer"
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
                          Subtítulos
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
                        Continuar con el siguiente paso
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chapters Strip (Escenas 1-6) */}
                <div className="rounded-2xl bg-white border border-sky-200 p-4">
                  <p className="text-xs font-bold text-slate-900 mb-2.5">
                    Capítulos del tutorial (6 etapas)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tutorial.scenes.map((sc, idx) => {
                      const active = idx === activeSceneIndex;
                      return (
                        <button
                          key={sc.sceneNumber}
                          type="button"
                          onClick={() => {
                            setActiveSceneIndex(idx);
                            setCurrentTime(0);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-colors min-h-[48px] ${
                            active
                              ? "bg-sky-600 text-white border-sky-600"
                              : "bg-sky-50/70 text-slate-800 border-sky-200 hover:bg-sky-100"
                          }`}
                        >
                          <p className={`text-[11px] font-bold ${active ? "text-sky-100" : "text-sky-700"}`}>
                            {SCENE_LABELS[idx] ?? `Escena ${sc.sceneNumber}`}
                          </p>
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

              {/* Right 4 Columns: Recipe Thumbnail, Ingredients Sidebar, Utensils & Steps */}
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
                        {recipe.prepTimeMinutes} min · {recipe.servingsBase} porciones
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
                </div>

                {/* Ingredients Checklist */}
                <div className="rounded-2xl bg-white border border-sky-200 p-4 space-y-3">
                  <h3 className="font-display font-bold text-sm text-slate-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    Ingredientes ({recipe.servingsBase} porc.)
                  </h3>
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
                              {ing.unit === "al gusto" ? "al gusto" : `${ing.amount} ${ing.unit}`}
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
