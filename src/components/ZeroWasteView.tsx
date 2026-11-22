import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChefHat,
  Clock,
  Leaf,
  Loader2,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
  Utensils,
  Video,
  X,
} from "lucide-react";
import { getDishImageForText } from "../data/curriculum";
import { useProgress } from "../context/ProgressContext";
import type { Recipe, ZeroWasteAnalysisResult } from "../types/academy";
import { ChefVideoModal } from "./ChefVideoModal";
import { RecipeRatingModal } from "./RecipeRatingModal";
import { SafeImage } from "./SafeImage";

interface CapturedPhoto {
  id: string;
  previewUrl: string;
  mimeType: string;
  base64Data: string;
  label: string;
}

type TrickCategory =
  | "Todos"
  | "Verduras y tallos"
  | "Frutas maduras"
  | "Pan y granos"
  | "Nevera y sobras seguras";

interface ZeroWasteLibraryTrick {
  id: string;
  category: Exclude<TrickCategory, "Todos">;
  title: string;
  ingredient: string;
  action: string;
  safetyNote: string;
}

const ZERO_WASTE_HERO_IMAGE = "/src/assets/images/zero_waste_kitchen_1795134321282.jpg";

const ZERO_WASTE_LIBRARY: ZeroWasteLibraryTrick[] = [
  {
    id: "zw-1",
    category: "Verduras y tallos",
    title: "Caldo mágico con tallos y puntas",
    ingredient: "Tallos de cilantro, perejil, apio y puntas de zanahoria o cebolla",
    action:
      "Guarda esos restos limpios en una bolsa dentro del congelador. Cuando juntes dos tazas, hiérvelos 25 minutos en agua con una pizca de sal (con ayuda de un adulto) y tendrás un caldo natural para sopas o arroz.",
    safetyNote: "Lava bien las verduras antes de guardarlas y descarta partes podridas.",
  },
  {
    id: "zw-2",
    category: "Verduras y tallos",
    title: "Chips crujientes de cáscara de papa",
    ingredient: "Cáscaras de papa o zanahoria muy bien lavadas",
    action:
      "Seca las cáscaras con papel de cocina, mézclalas con 1 cucharadita de aceite y sal, y pide a un adulto hornearlas 12–15 minutos a 190 °C hasta que queden crujientes.",
    safetyNote: "Nunca uses cáscaras de papa con zonas verdes ni brotes; pídale a un adulto manejar el horno.",
  },
  {
    id: "zw-3",
    category: "Verduras y tallos",
    title: "Revive hojas marchitas con baño frío",
    ingredient: "Lechuga, espinaca o zanahorias blanditas",
    action:
      "Sumerge las hojas o zanahorias en un tazón con agua bien fría y unos cubitos de hielo durante 15 minutos: absorberán humedad y volverán a ponerse crujientes.",
    safetyNote: "Si las hojas están viscosas o huelen agrio, ya no son seguras y deben descartarse.",
  },
  {
    id: "zw-4",
    category: "Frutas maduras",
    title: "Helado exprés de plátano maduro",
    ingredient: "Plátanos o bananos con manchitas oscuras",
    action:
      "Pélalos, córtalos en rodajas y congélalos en un recipiente cerrado por 3 horas. Licúalos con 2 cucharadas de leche o yogur y tendrás helado cremoso sin azúcar añadida.",
    safetyNote: "Usa licuadora con tapa bien puesta y supervisión adulta.",
  },
  {
    id: "zw-5",
    category: "Frutas maduras",
    title: "Ralladura congelada de cítricos",
    ingredient: "Limón, naranja o lima antes de exprimir",
    action:
      "Antes de exprimir el jugo, ralla solo la parte de color de la cáscara (sin llegar a lo blanco amargo) y guárdala en un frasquito en el congelador para perfumar panqueques, arroz o galletas.",
    safetyNote: "Lava y seca muy bien el fruto con agua limpia antes de rallarlo.",
  },
  {
    id: "zw-6",
    category: "Frutas maduras",
    title: "Compota rápida para tostadas o avena",
    ingredient: "Manzanas, peras, fresas o duraznos blandos",
    action:
      "Corta las partes golpeadas, pica la fruta sana en cubitos y cocínala 8 minutos a fuego bajo con 2 cucharadas de agua y canela hasta que se deshaga como mermelada casera.",
    safetyNote: "Si ves moho blanco o verde (pelusa), desecha la fruta completa.",
  },
  {
    id: "zw-7",
    category: "Pan y granos",
    title: "Croûtons caseros con pan de ayer",
    ingredient: "Pan duro o rebanadas secas",
    action:
      "Córtalo en cubitos, mézclalo con 1 cucharada de aceite de oliva, ajo en polvo u orégano, y tuéstalo 8 minutos en sartén o en horno con un adulto hasta que quede dorado y crocante para ensaladas o sopas.",
    safetyNote: "Revisa que el pan no tenga manchas de moho antes de tostarlo.",
  },
  {
    id: "zw-8",
    category: "Pan y granos",
    title: "Chao Fan con arroz cocido de ayer",
    ingredient: "Arroz blanco sobrante guardado en nevera",
    action:
      "El arroz frío del día anterior está más seco y suelto: es el secreto real para saltearlo en sartén con huevo y verduritas picadas sin que quede batido ni pegajoso.",
    safetyNote: "El arroz cocido sobrante debe refrigerarse rápido (antes de 2 horas) y recalentarse muy bien.",
  },
  {
    id: "zw-9",
    category: "Pan y granos",
    title: "Pan rallado casero en 2 minutos",
    ingredient: "Extremos y cortezas secas de pan",
    action:
      "Seca las cortezas en sartén tibia o tostador y tritúralas con rodillo dentro de una bolsa limpia o en procesador (con adulto) para tener pan molido listo para gratinados o tortitas.",
    safetyNote: "Guarda el pan rallado en frasco bien seco y hermético.",
  },
  {
    id: "zw-10",
    category: "Nevera y sobras seguras",
    title: "Regla FIFO: lo más viejo adelante",
    ingredient: "Yogures, quesos, frutas y tuppers en el refrigerador",
    action:
      "Cada vez que lleguen compras nuevas, ponlas atrás y mueve adelante lo que ya estaba abierto. Así ves primero lo que debes usar hoy antes de que se eche a perder.",
    safetyNote: "Pega un papelito con la fecha del día en que abriste o guardaste sobras cocidas.",
  },
  {
    id: "zw-11",
    category: "Nevera y sobras seguras",
    title: "La regla de las 2 horas para sobras",
    ingredient: "Cualquier comida cocida que sobre después de comer",
    action:
      "Cuando termines de comer, no dejes ollas tibias afuera toda la tarde: espera a que deje de salir vapor y guárdalo en envases bajos y tapados dentro de la nevera antes de 2 horas.",
    safetyNote: "Recalienta las sobras hasta que humeen parejas y consúmelas dentro de 2 a 3 días.",
  },
  {
    id: "zw-12",
    category: "Nevera y sobras seguras",
    title: "Hierbas frescas en cubitos aromáticos",
    ingredient: "Cilantro, albahaca o perejil que empieza a doblarse",
    action:
      "Pica las hojas limpias, ponlas en una cubetera de hielo y cúbrelas con agua o un poco de aceite de oliva. Congela y usa un cubito directo al sartén cuando cocines pasta o guisos.",
    safetyNote: "Congelar en aceite o agua conserva sabor por semanas sin desperdiciar el manojo.",
  },
];

const TRICK_CATEGORIES: TrickCategory[] = [
  "Todos",
  "Verduras y tallos",
  "Frutas maduras",
  "Pan y granos",
  "Nevera y sobras seguras",
];

async function resizeImageFileToJpeg(file: File): Promise<CapturedPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Formato de imagen no compatible."));
      img.onload = () => {
        const maxDim = 1280;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la foto en el navegador."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64Data = dataUrl.split(",")[1] ?? "";
        resolve({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          previewUrl: dataUrl,
          mimeType: "image/jpeg",
          base64Data,
          label: file.name || "Foto de ingrediente",
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function ZeroWasteView() {
  const { state, rankTitle, cookedRecipesCount, recordZeroWasteRescue, rateCookedRecipe } = useProgress();
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [extraInput, setExtraInput] = useState("");
  const [extraIngredients, setExtraIngredients] = useState<string[]>([]);

  // Live camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ZeroWasteAnalysisResult | null>(null);
  const [rescueClaimed, setRescueClaimed] = useState(false);
  const [videoRecipe, setVideoRecipe] = useState<Recipe | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  // Tricks library filter
  const [trickCategory, setTrickCategory] = useState<TrickCategory>("Todos");

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startLiveCamera = async (mode: "environment" | "user" = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "Tu navegador o vista actual no permite abrir la cámara en vivo. Usa el botón 'Tomar o subir foto' de al lado."
      );
      setCameraOpen(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 40);
    } catch {
      setCameraOpen(false);
      setCameraError(
        "No pudimos acceder a la cámara en vivo (permiso bloqueado o sin cámara). Puedes usar 'Tomar o subir foto' para elegir una imagen o usar la cámara de tu dispositivo."
      );
    }
  };

  const captureFromLiveCamera = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    if (photos.length >= 3) {
      setCameraError("Puedes analizar hasta 3 fotos al mismo tiempo. Borra una para tomar otra.");
      return;
    }
    const maxDim = 1280;
    let width = video.videoWidth;
    let height = video.videoHeight;
    if (width > maxDim || height > maxDim) {
      if (width >= height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64Data = dataUrl.split(",")[1] ?? "";
    setPhotos((prev) => [
      ...prev,
      {
        id: `cam-${Date.now()}`,
        previewUrl: dataUrl,
        mimeType: "image/jpeg",
        base64Data,
        label: `Foto ${prev.length + 1}`,
      },
    ]);
    setError(null);
    stopCameraStream();
    setCameraOpen(false);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setCameraError(null);

    const remainingSlots = Math.max(0, 3 - photos.length);
    if (remainingSlots === 0) {
      setError("Ya cargaste el máximo de 3 fotos. Elimina una si quieres cambiarla.");
      return;
    }

    const picked = Array.from(files).slice(0, remainingSlots);
    try {
      const processed = await Promise.all(picked.map((f) => resizeImageFileToJpeg(f)));
      setPhotos((prev) => [...prev, ...processed].slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron procesar las fotos.");
    }
  };

  const addExtraIngredient = () => {
    const clean = extraInput.trim();
    if (!clean) return;
    if (!extraIngredients.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setExtraIngredients((prev) => [...prev, clean]);
    }
    setExtraInput("");
  };

  const handleGenerateRecipe = async () => {
    if (photos.length === 0 && extraIngredients.length === 0) {
      setError("Toma o sube una foto de tus ingredientes (o agrega ingredientes arriba) para comenzar.");
      return;
    }
    setLoading(true);
    setError(null);
    setRescueClaimed(false);

    try {
      const res = await fetch("/api/zero-waste-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: photos.map((p) => ({
            mimeType: p.mimeType,
            data: p.base64Data,
          })),
          extraIngredients,
          allergies: state.allergies,
          skillLevel: rankTitle,
        }),
      });
      const data = (await res.json()) as { result?: ZeroWasteAnalysisResult; error?: string };
      if (!res.ok || !data.result) {
        throw new Error(data.error || "No pudimos analizar los ingredientes en este momento.");
      }
      setAnalysis(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión al analizar las fotos.");
    } finally {
      setLoading(false);
    }
  };

  const generatedRecipeObj: Recipe | null = useMemo(() => {
    if (!analysis?.recipe) return null;
    const r = analysis.recipe;
    return {
      id: `zw-recipe-${r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
      title: r.title,
      mealType: r.mealType || "Almuerzo",
      category: "Saludable",
      source: "academia",
      country: r.country || "Cocina Sin Desperdicio",
      difficulty: r.difficulty || "Principiante",
      prepTimeMinutes: Number(r.prepTimeMinutes) || 20,
      servingsBase: Number(r.servingsBase) || 2,
      image: getDishImageForText(
        r.title,
        undefined,
        r.mealType,
        (r.ingredients ?? []).map((i) => i.item).join(" ")
      ),
      description: r.description,
      ingredients: r.ingredients ?? [],
      utensils: r.utensils ?? ["Sartén o tazón", "Tabla limpia"],
      instructions: r.instructions ?? [],
      chefTip: r.chefTip || "Aprovecha tallos y cáscaras limpias para dar más sabor.",
      allergens: r.allergens?.length ? r.allergens : ["Revisar ingredientes usados"],
      requiresAdultSupervision: Boolean(r.requiresAdultSupervision),
      safetyNote:
        r.safetyNote ||
        "Lava bien tus ingredientes, descarta cualquier parte con moho y cocina con un adulto si usas estufa o cuchillo.",
    };
  }, [analysis]);

  const filteredTricks = useMemo(() => {
    if (trickCategory === "Todos") return ZERO_WASTE_LIBRARY;
    return ZERO_WASTE_LIBRARY.filter((t) => t.category === trickCategory);
  }, [trickCategory]);

  return (
    <div className="space-y-9">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-white border border-sky-200 overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between gap-5 bg-gradient-to-br from-white via-white to-sky-50">
            <div>
              <p className="text-xs font-semibold text-sky-700 tracking-wide">
                Misión Cero Desperdicio · Rescates hechos:{" "}
                <span className="tabular-nums">{state.zeroWasteCount ?? 0}</span>
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-2 text-balance max-w-xl">
                Toma foto a lo que tienes y cocina sin desperdiciar nada
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl leading-relaxed">
                ¿Tienes verduras sueltas, fruta madura, pan de ayer o sobras en la nevera? Tómales una foto: nuestro Chef IA identifica los ingredientes, inventa una receta clara para ti y te enseña cómo aprovechar hasta las cáscaras y tallos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-sky-100">
              <span>1. Toma o sube foto</span>
              <span aria-hidden="true">·</span>
              <span>2. Recibe tu receta segura</span>
              <span aria-hidden="true">·</span>
              <span>3. Aplica trucos anti-desperdicio</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[210px] lg:min-h-full">
            <SafeImage
              src={ZERO_WASTE_HERO_IMAGE}
              alt="Ingredientes rescatados listos para cocinar sin desperdicio"
              className="w-full h-full object-cover"
            />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-sky-50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Photo Scanner & Input Workspace */}
      <section className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-3xl bg-white border border-sky-200 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">
                01. Foto de tus ingredientes disponibles
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Puedes tomar hasta 3 fotos de tu nevera, alacena o mesa con comida.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 tabular-nums">
              {photos.length} / 3 fotos
            </span>
          </div>

          {/* Camera & File Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => (cameraOpen ? (stopCameraStream(), setCameraOpen(false)) : startLiveCamera(facingMode))}
              disabled={photos.length >= 3 && !cameraOpen}
              className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
            >
              <Camera className="w-4 h-4" />
              {cameraOpen ? "Cerrar cámara" : "Abrir cámara en vivo"}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 3}
              className="px-4 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 disabled:bg-slate-100 disabled:text-slate-400 text-sky-950 border border-sky-200 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
            >
              <Upload className="w-4 h-4 text-sky-700" />
              Tomar o subir foto
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFilesSelected(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Live Camera Viewfinder */}
          {cameraOpen && (
            <div className="rounded-2xl overflow-hidden border border-sky-300 bg-slate-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-[320px] object-cover"
              />
              <div className="p-3 bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = facingMode === "environment" ? "user" : "environment";
                    setFacingMode(nextMode);
                    startLiveCamera(nextMode);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[40px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Cambiar cámara
                </button>
                <button
                  type="button"
                  onClick={captureFromLiveCamera}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
                >
                  <Camera className="w-4 h-4" />
                  Capturar foto ahora
                </button>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Photo Thumbnails */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative rounded-2xl overflow-hidden border border-sky-200 bg-sky-50 aspect-[4/3]"
                >
                  <img
                    src={photo.previewUrl}
                    alt={`Ingrediente capturado ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                    aria-label={`Quitar foto ${index + 1}`}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-slate-950/75 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/60 p-6 text-center space-y-2">
              <Camera className="w-7 h-7 text-sky-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-900">
                Aún no has tomado o subido ninguna foto
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Coloca tus ingredientes sobre la mesa con buena luz y tómales una foto. También puedes añadir ingredientes escritos a la derecha.
              </p>
            </div>
          )}
        </div>

        {/* Extra Notes, Allergies & Submit */}
        <div className="lg:col-span-5 rounded-3xl bg-sky-50/80 border border-sky-200 p-6 sm:p-7 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-950">
              02. Detalles opcionales y análisis
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Si hay algo guardado en la alacena que no salió en la foto (ej. arroz cocido de ayer o un huevo), escríbelo aquí.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExtraIngredient();
                }
              }}
              placeholder="Ej. pan duro, huevo, queso..."
              className="flex-1 rounded-xl bg-white border border-sky-200 px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 min-h-[44px]"
            />
            <button
              type="button"
              onClick={addExtraIngredient}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold inline-flex items-center gap-1 min-h-[44px] shrink-0"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {extraIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {extraIngredients.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => setExtraIngredients((prev) => prev.filter((item) => item !== ing))}
                  className="px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-medium text-slate-800 hover:border-rose-300 hover:text-rose-700 inline-flex items-center gap-1.5 min-h-[36px]"
                >
                  <span>{ing}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}

          {state.allergies.length > 0 && (
            <div className="rounded-xl bg-white border border-sky-200 px-3.5 py-2.5 text-xs text-slate-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <span>
                Alergias activas que evitaremos automáticamente:{" "}
                <strong className="text-slate-950">{state.allergies.join(", ")}</strong>.
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={loading || (photos.length === 0 && extraIngredients.length === 0)}
            onClick={handleGenerateRecipe}
            className="w-full py-3.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando foto y creando receta...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Crear receta sin desperdicio
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generated Recipe & Specific Tricks Result */}
      {analysis && generatedRecipeObj && (
        <section className="space-y-6">
          {/* Detected Ingredients & Food Freshness Alert */}
          <div className="rounded-3xl bg-white border border-sky-200 p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-700">
                  Ingredientes detectados en tu cocina
                </p>
                <p className="text-sm sm:text-base font-medium text-slate-900 mt-1">
                  {analysis.detectedIngredients.join(" · ")}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">{analysis.zeroWasteSummary}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{analysis.unusableOrCautionNote}</span>
            </div>
          </div>

          {/* Full Recipe Card */}
          <article className="rounded-3xl bg-white border border-sky-200 overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-12 items-stretch border-b border-sky-100">
              <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
                <SafeImage
                  src={generatedRecipeObj.image}
                  alt={generatedRecipeObj.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-sky-700 font-semibold">
                      {generatedRecipeObj.country}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{generatedRecipeObj.mealType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{generatedRecipeObj.difficulty}</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-2">
                    {generatedRecipeObj.title}
                  </h2>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {generatedRecipeObj.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-700 tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-600" />
                      {generatedRecipeObj.prepTimeMinutes} minutos
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sky-600" />
                      {generatedRecipeObj.servingsBase} porciones
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-sky-100">
                  <button
                    type="button"
                    onClick={() => setVideoRecipe(generatedRecipeObj)}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
                  >
                    <Video className="w-4 h-4" />
                    VER VIDEO TUTORIAL
                  </button>

                  <button
                    type="button"
                    disabled={rescueClaimed}
                    onClick={() => {
                      setRescueClaimed(true);
                      recordZeroWasteRescue(generatedRecipeObj.title, 40);
                      setRatingModalOpen(true);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px] ${
                      rescueClaimed
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default"
                        : "bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {rescueClaimed ? "¡Rescate registrado! (+40 XP)" : "¡Ya la cociné sin desperdicio! (+40 XP)"}
                  </button>

                  {state.recipeRatings?.[generatedRecipeObj.id] ? (
                    <button
                      type="button"
                      onClick={() => setRatingModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span className="tabular-nums">{state.recipeRatings[generatedRecipeObj.id].stars}/5 ★ (Editar)</span>
                    </button>
                  ) : (
                    rescueClaimed && (
                      <button
                        type="button"
                        onClick={() => setRatingModalOpen(true)}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[44px]"
                      >
                        <Star className="w-4 h-4 text-amber-500" />
                        Calificar con estrellas
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-950 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-sky-600" />
                    Ingredientes necesarios
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-800">
                    {generatedRecipeObj.ingredients.map((ing, idx) => (
                      <li
                        key={`${ing.item}-${idx}`}
                        className="flex items-baseline justify-between gap-2 pb-1.5 border-b border-sky-100"
                      >
                        <span>{ing.item}</span>
                        <span className="text-xs font-semibold text-sky-700 tabular-nums shrink-0">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-slate-950">Utensilios</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                    {generatedRecipeObj.utensils.join(" · ")}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 space-y-2 text-xs text-slate-700">
                  <p className="font-semibold text-slate-950">
                    Alérgenos: {generatedRecipeObj.allergens.join(", ")}
                  </p>
                  <p>{generatedRecipeObj.safetyNote}</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <h3 className="font-display text-lg font-bold text-slate-950">
                  Paso a paso explicado fácil (12+)
                </h3>
                <ol className="space-y-3">
                  {generatedRecipeObj.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 p-4 text-sm text-slate-800 leading-relaxed"
                    >
                      <span className="w-7 h-7 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
                  <ChefHat className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Truco de Chef</p>
                    <p className="mt-0.5 leading-relaxed">{generatedRecipeObj.chefTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Photo-Specific Zero Waste Tricks */}
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Trucos para no desperdiciar nada de tus ingredientes
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.zeroWasteTricks.map((trick, idx) => (
                <div
                  key={`${trick.ingredient}-${idx}`}
                  className="rounded-2xl bg-white border border-sky-200 p-5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">{trick.ingredient}</p>
                    <h3 className="font-display text-base font-bold text-slate-950 mt-1">
                      {trick.trickTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                      {trick.howToUseAll}
                    </p>
                  </div>
                  <p className="text-xs text-sky-900 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2">
                    <strong>Conservación:</strong> {trick.storageTip}
                  </p>
                </div>
              ))}
            </div>

            {analysis.bonusIdeas && analysis.bonusIdeas.length > 0 && (
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-5">
                <p className="text-xs font-bold text-sky-800">Ideas extra con sobras pequeñas</p>
                <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {analysis.bonusIdeas.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Always-Available Library of Zero-Waste Kitchen Tricks */}
      <section className="space-y-5 pt-4 border-t border-sky-200/80">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Guía práctica para casa</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              Trucos para no desperdiciar nada en la cocina
            </h2>
          </div>
        </div>

        {/* Category Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {TRICK_CATEGORIES.map((cat) => {
            const active = trickCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setTrickCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[40px] whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-sky-200 hover:bg-sky-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTricks.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white border border-sky-200 p-5 flex flex-col justify-between gap-3 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sky-700">{item.category}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-950 mt-1.5">{item.title}</h3>
                <p className="text-xs font-semibold text-emerald-700 mt-1">{item.ingredient}</p>
                <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed">{item.action}</p>
              </div>
              <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>{item.safetyNote}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {videoRecipe && (
        <ChefVideoModal recipe={videoRecipe} onClose={() => setVideoRecipe(null)} />
      )}

      {ratingModalOpen && generatedRecipeObj && (
        <RecipeRatingModal
          recipe={generatedRecipeObj}
          existingRating={state.recipeRatings?.[generatedRecipeObj.id]}
          isFirstRecipeEver={cookedRecipesCount === 0}
          skipBaseXp={rescueClaimed}
          onSubmit={(stars, note) => {
            rateCookedRecipe({
              recipeId: generatedRecipeObj.id,
              recipeTitle: generatedRecipeObj.title,
              recipeImage: generatedRecipeObj.image,
              stars,
              note,
              skipBaseXp: rescueClaimed,
            });
            setRatingModalOpen(false);
          }}
          onClose={() => setRatingModalOpen(false)}
        />
      )}
    </div>
  );
}
