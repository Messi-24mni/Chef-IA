import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const CHEF_MENTOR_SYSTEM_INSTRUCTION = `Eres "Chef Mentor", el profesor virtual oficial de CHEF ACADEMY, una plataforma juvenil de cocina segura, aprovechamiento sin desperdicio y videotutoriales con IA diseñada especialmente para jóvenes desde los 12 años hasta nivel avanzado.

REGLAS OBLIGATORIAS DE SEGURIDAD PARA MENORES:
1. Nunca recomiendes prácticas peligrosas sin supervisión adulta: fritura profunda con mucho aceite, flambear con alcohol, usar mandolinas sin protector, manipular cuchillos grandes de chef sin supervisión, dejar sartenes u hornos sin vigilancia, o usar ollas a presión sin un adulto.
2. Cuando una técnica o receta requiera cuchillos afilados, fuego, aceite caliente o el horno, incluye SIEMPRE un aviso claro de seguridad y recomienda contar con la supervisión de un adulto responsable.
3. Incluye siempre recordatorios sobre alergias alimentarias frecuentes (gluten, lácteos, huevo, frutos secos, pescado, mariscos, soja) cuando sugieras ingredientes.
4. Si el estudiante pide algo peligroso, inseguro o inapropiado para la cocina juvenil, recházalo amablemente y ofrece una alternativa segura y educativa.

ESTILO PEDAGÓGICO PARA ESTUDIANTES DE 12 AÑOS:
- Habla en español cercano, amable y súper claro, pensado para un estudiante de 12 años que está aprendiendo desde cero.
- Nunca uses palabras técnicas de cocina (como sofreír, emulsionar, tamizar, saltear, reducir, al dente, cremar o precalentar) sin explicar qué significan en palabras simples entre paréntesis.
- Explica cada paso con detalles concretos: cuánto tiempo tarda, qué tamaño debe tener el corte y cómo se ve o huele la comida cuando está lista.
- Adapta tus explicaciones al nivel actual del estudiante cuando se te proporcione.

FORMATO DE LECTURA FÁCIL (MUY IMPORTANTE PARA NO CANSAR AL LEER):
- Prohibido escribir bloques o párrafos largos de texto continuo.
- Máximo 2 líneas por párrafo y máximo 1 idea por viñeta o paso.
- Usa exactamente esta estructura visual con encabezados cortos "###":
  1. Empieza con 1 o 2 frases directas respondiendo la duda al grano (sin introducciones largas).
  2. Usa secciones cortas según aplique:
     ### Qué necesitas (lista corta con viñetas "-")
     ### Paso a paso (pasos numerados "1.", "2.", "3..." breves y claros, con negrita en tiempos/palabras clave)
     ### Truco de Chef (1 consejo corto de 1-2 líneas)
     ### Seguridad y alergias (aviso breve de 1-2 líneas con supervisión adulta y alérgenos si aplica)
- Mantén tus respuestas concisas, ordenadas y ligeras a la vista. Si un tema es largo, da primero lo esencial y ofrece ampliar si el estudiante quiere más detalle.`;

function mapGeminiError(error: unknown): { status: number; message: string } {
  if (error instanceof Error && error.message === "MISSING_API_KEY") {
    return {
      status: 500,
      message:
        "No se encontró la clave de Gemini en el servidor. Configura GEMINI_API_KEY en el panel de Secrets.",
    };
  }
  const errObj = error as { status?: number; message?: string };
  const rawMessage = errObj?.message || "Error inesperado al consultar al Profesor IA.";
  if (rawMessage.includes("403") || rawMessage.includes("PERMISSION_DENIED") || rawMessage.includes("API_KEY_INVALID")) {
    return {
      status: 403,
      message:
        "La clave de Gemini no es válida o no tiene permisos. Verifica la configuración en Settings > Secrets.",
    };
  }
  if (rawMessage.includes("429") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Se alcanzó el límite temporal de consultas del Profesor IA. Espera unos segundos e intenta de nuevo.",
    };
  }
  return {
    status: 500,
    message: "No pudimos conectar con Chef Mentor en este momento. Intenta de nuevo en unos segundos.",
  };
}

const VIDEO_CACHE_DIR = path.resolve(__dirname, ".chef_video_cache");
if (!fs.existsSync(VIDEO_CACHE_DIR)) {
  fs.mkdirSync(VIDEO_CACHE_DIR, { recursive: true });
}

const VIDEO_SERVICE_STATUS = {
  videoGenerationEnabled: false,
  videoServiceName: "Google Veo / Omni Flash Video",
  statusMessage:
    "La generación de video MP4 con Google Veo / Omni Flash requiere seleccionar una clave de API con facturación habilitada. Para no simular videos falsos, se activó la alternativa educativa real con guion de 6 escenas (Gemini), subtítulos sincronizados y narración de voz real con IA.",
  alternativeUsed:
    "Guion educativo 6 escenas (gemini-4-hydrogen) + Narración de voz real en español (gemini-3.8-flash-lite-tts)",
};

function sanitizeCacheSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
}

function splitNarrationToSubtitles(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  for (const s of sentences) {
    if (s.length <= 105) {
      chunks.push(s);
    } else {
      const words = s.split(/\s+/);
      let current = "";
      for (const w of words) {
        if ((current + " " + w).trim().length > 95) {
          if (current.trim()) chunks.push(current.trim());
          current = w;
        } else {
          current = (current + " " + w).trim();
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }
  }
  return chunks.length > 0 ? chunks : [text];
}

async function synthesizeSceneNarration(
  ai: GoogleGenAI,
  text: string,
  voiceGender: "femenino" | "masculino",
  wavPath: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const voiceName = voiceGender === "masculino" ? "Charon" : "Kore";
    const style =
      voiceGender === "masculino"
        ? "Amigable profesor de cocina hablando en español claro, cercano, entusiasta y fácil de entender para un estudiante de 12 años."
        : "Amigable profesora de cocina hablando en español claro, cercano, entusiasta y fácil de entender para un estudiante de 12 años.";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const audioPart = parts.find((p) => p.inlineData?.data);
    const base64Audio = audioPart?.inlineData?.data;
    if (!base64Audio) {
      return { ok: false, error: "El servicio de voz IA no devolvió audio para esta escena." };
    }
    fs.writeFileSync(wavPath, Buffer.from(base64Audio, "base64"));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: mapGeminiError(err).message };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "chef-academy-api" });
  });

  app.post("/api/chef-tutor", async (req, res) => {
    try {
      const { messages, mode, studentContext } = req.body as {
        messages: Array<{ role: "user" | "assistant"; text: string }>;
        mode?: string;
        studentContext?: {
          name?: string;
          levelTitle?: string;
          xp?: number;
          allergies?: string[];
        };
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Envía una pregunta o mensaje para el Profesor Chef." });
        return;
      }

      const ai = getGeminiClient();

      const contextLines: string[] = [];
      if (studentContext?.name) contextLines.push(`Estudiante: ${studentContext.name}`);
      if (studentContext?.levelTitle) contextLines.push(`Nivel actual: ${studentContext.levelTitle}`);
      if (typeof studentContext?.xp === "number") contextLines.push(`XP acumulada: ${studentContext.xp}`);
      if (studentContext?.allergies && studentContext.allergies.length > 0) {
        contextLines.push(`Alergias declaradas: ${studentContext.allergies.join(", ")} (NUNCA sugieras estos ingredientes)`);
      }
      if (mode) contextLines.push(`Modo de consulta: ${mode}`);

      const conversationHistory = messages
        .slice(-10)
        .map((m) => `${m.role === "user" ? "Estudiante" : "Chef Mentor"}: ${m.text}`)
        .join("\n\n");

      const prompt = `${contextLines.length > 0 ? `CONTEXTO DEL ESTUDIANTE:\n${contextLines.join("\n")}\n\n` : ""}CONVERSACIÓN:\n${conversationHistory}\n\nResponde como Chef Mentor al último mensaje del estudiante de forma educativa, segura y súper fácil de leer: usa párrafos muy cortos (máximo 2 líneas), viñetas o pasos numerados breves con ### encabezados, sin bloques largos que cansen la vista.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction: CHEF_MENTOR_SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: "Chef Mentor no generó una respuesta. Intenta reformular tu duda." });
        return;
      }

      res.json({ reply });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post("/api/chef-ingredients", async (req, res) => {
    try {
      const { ingredients, allergies, skillLevel } = req.body as {
        ingredients: string[];
        allergies?: string[];
        skillLevel?: string;
      };

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        res.status(400).json({ error: "Agrega al menos un ingrediente disponible." });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `El estudiante tiene disponibles estos ingredientes: ${ingredients.join(", ")}.
Nivel culinario: ${skillLevel || "Principiante"}.
${allergies && allergies.length > 0 ? `Alergias a evitar estrictamente: ${allergies.join(", ")}.` : "Sin alergias declaradas, pero indica posibles alérgenos comunes."}

Crea 2 propuestas de recetas seguras, deliciosas y muy bien explicadas para un estudiante de 12 años que está aprendiendo a cocinar, usando principalmente esos ingredientes (puedes asumir básicos de despensa como agua, sal, aceite de oliva o pimienta). Si el plato pertenece a una cocina internacional, usa el nombre original tradicional del plato según su país (por ejemplo: Risotto, Shakshuka, Omelette, Pad Thai, Miso Shiru, Gallo Pinto, Quesadilla, etc.) acompañado de una breve aclaración si ayuda. En cada paso explica exactamente cómo hacerlo, cuánto tiempo toma, qué significa cualquier palabra de cocina y cómo saber visualmente que ya está listo.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction: CHEF_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Nombre original del plato según su país y cocina de origen.",
                },
                prepTimeMinutes: { type: Type.INTEGER, description: "Tiempo estimado en minutos." },
                difficulty: { type: Type.STRING, description: "Principiante, Básico o Intermedio." },
                requiresAdultSupervision: {
                  type: Type.BOOLEAN,
                  description: "True si usa cuchillo de chef, fuego, horno o aceite caliente.",
                },
                safetyNote: {
                  type: Type.STRING,
                  description: "Advertencia concreta de seguridad en cocina para jóvenes.",
                },
                allergens: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Lista de alérgenos presentes o 'Libre de alérgenos comunes'.",
                },
                ingredientsUsed: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "4 a 6 pasos claros y seguros.",
                },
                chefTip: { type: Type.STRING, description: "Un consejo breve de chef para mejorar el resultado." },
              },
              required: [
                "title",
                "prepTimeMinutes",
                "difficulty",
                "requiresAdultSupervision",
                "safetyNote",
                "allergens",
                "ingredientsUsed",
                "steps",
                "chefTip",
              ],
            },
          },
        },
      });

      const raw = (response.text ?? "[]").trim();
      const recipes = JSON.parse(raw);
      res.json({ recipes });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post("/api/zero-waste-recipe", async (req, res) => {
    try {
      const { images, extraIngredients, allergies, skillLevel } = req.body as {
        images?: Array<{ mimeType?: string; data?: string }>;
        extraIngredients?: string[];
        allergies?: string[];
        skillLevel?: string;
      };

      const validImages = (Array.isArray(images) ? images : [])
        .slice(0, 3)
        .map((img) => {
          const rawData = typeof img?.data === "string" ? img.data.trim() : "";
          const base64Clean = rawData.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
          const mimeType =
            typeof img?.mimeType === "string" && img.mimeType.startsWith("image/")
              ? img.mimeType
              : "image/jpeg";
          return { mimeType, data: base64Clean };
        })
        .filter((img) => img.data.length > 32);

      const cleanExtras = (Array.isArray(extraIngredients) ? extraIngredients : [])
        .map((s) => String(s).trim())
        .filter(Boolean)
        .slice(0, 15);

      if (validImages.length === 0 && cleanExtras.length === 0) {
        res.status(400).json({
          error: "Toma o sube al menos una foto de tus ingredientes (o escribe qué ingredientes tienes).",
        });
        return;
      }

      const ai = getGeminiClient();

      const promptText = `Eres Chef Mentor de CHEF ACADEMY ayudando a un estudiante de 12 años en su misión CERO DESPERDICIO.
Analiza con cuidado ${validImages.length > 0 ? "las fotos adjuntas de ingredientes disponibles en casa" : "los ingredientes descritos"}${cleanExtras.length > 0 ? ` junto con estos ingredientes extra que indicó el estudiante: ${cleanExtras.join(", ")}` : ""}.

Nivel culinario del estudiante: ${skillLevel || "Principiante"}.
${allergies && allergies.length > 0 ? `ALERGIAS OBLIGATORIAS A EVITAR ESTRICTAMENTE: ${allergies.join(", ")}. No uses ninguno de estos alimentos ni derivados.` : "No hay alergias marcadas, pero lista los alérgenos presentes con claridad."}

TAREAS OBLIGATORIAS:
1. Identifica todos los ingredientes comestibles visibles en las fotos (y suma los ingredientes extra si el estudiante escribió alguno). Si no ves comida clara en la imagen, indícalo honestamente en detectedIngredients y crea la receta más cercana con lo que sí haya o básicos simples.
2. Crea UNA receta deliciosa, segura y completa aprovechando al máximo esos ingredientes para no tirar nada (puedes asumir básicos muy comunes como agua, sal, aceite de oliva o pimienta).
3. Usa el NOMBRE ORIGINAL TRADICIONAL del plato según su país cuando corresponda (por ejemplo: Chao Fan, Frittata, Gazpacho, Chilaquiles, Torrijas, Shakshuka, Bubble & Squeak, Crêpes, Minestrone, Pasta al Pomodoro, etc.) y pon ese país en "country".
4. Explica los pasos pensando en un chico o chica de 12 años: máximo claridad, sin palabras complicadas sin explicar entre paréntesis, tiempos exactos y cómo se ve la comida cuando está lista.
5. Incluye un aviso de seguridad alimentaria claro: revisar siempre que frutas, verduras o sobras no tengan moho, mal olor o textura viscosa antes de usarlas, y pedir supervisión adulta para cuchillos o estufa.
6. Crea 3 a 5 TRUCOS PRÁCTICOS SIN DESPERDICIO específicos para los ingredientes detectados (cómo aprovechar cáscaras, tallos, semillas, pan duro, fruta muy madura o cómo conservar lo que sobre).`;

      const parts = [
        ...validImages.map((img) => ({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        })),
        { text: promptText },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: { parts },
        config: {
          systemInstruction: CHEF_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista clara en español de los ingredientes detectados en la foto y notas.",
              },
              zeroWasteSummary: {
                type: Type.STRING,
                description: "Resumen motivador de 1-2 líneas sobre cómo esta receta evita tirar comida.",
              },
              unusableOrCautionNote: {
                type: Type.STRING,
                description:
                  "Nota breve de seguridad alimentaria (descartar partes con moho o mal olor, lavar bien cáscaras).",
              },
              recipe: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Nombre original del plato según su país de origen.",
                  },
                  country: { type: Type.STRING },
                  mealType: {
                    type: Type.STRING,
                    description: "Uno de: Desayuno, Almuerzo, Cena, Postre, Antojo.",
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: "Uno de: Principiante, Básico, Intermedio.",
                  },
                  prepTimeMinutes: { type: Type.INTEGER },
                  servingsBase: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  requiresAdultSupervision: { type: Type.BOOLEAN },
                  safetyNote: { type: Type.STRING },
                  allergens: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  utensils: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        unit: { type: Type.STRING },
                      },
                      required: ["item", "amount", "unit"],
                    },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "4 a 6 pasos claros para jóvenes de 12 años.",
                  },
                  chefTip: { type: Type.STRING },
                },
                required: [
                  "title",
                  "country",
                  "mealType",
                  "difficulty",
                  "prepTimeMinutes",
                  "servingsBase",
                  "description",
                  "requiresAdultSupervision",
                  "safetyNote",
                  "allergens",
                  "utensils",
                  "ingredients",
                  "instructions",
                  "chefTip",
                ],
              },
              zeroWasteTricks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ingredient: { type: Type.STRING },
                    trickTitle: { type: Type.STRING },
                    howToUseAll: {
                      type: Type.STRING,
                      description: "Forma práctica y segura de aprovechar cáscaras, tallos, semillas o sobras.",
                    },
                    storageTip: {
                      type: Type.STRING,
                      description: "Cómo guardarlo en nevera o congelador para que dure más.",
                    },
                  },
                  required: ["ingredient", "trickTitle", "howToUseAll", "storageTip"],
                },
              },
              bonusIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 ideas rápidas extra para aprovechar restos pequeños.",
              },
            },
            required: [
              "detectedIngredients",
              "zeroWasteSummary",
              "unusableOrCautionNote",
              "recipe",
              "zeroWasteTricks",
              "bonusIdeas",
            ],
          },
        },
      });

      const raw = (response.text ?? "{}").trim();
      const result = JSON.parse(raw);
      res.json({ result });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.get("/api/chef-video/status", (_req, res) => {
    res.json(VIDEO_SERVICE_STATUS);
  });

  app.get("/api/chef-video/cached", (_req, res) => {
    try {
      const files = fs.readdirSync(VIDEO_CACHE_DIR).filter((f) => f.endsWith(".json"));
      const recipeIds = new Set<string>();
      for (const file of files) {
        try {
          const parsed = JSON.parse(
            fs.readFileSync(path.join(VIDEO_CACHE_DIR, file), "utf-8")
          ) as { recipeId?: string };
          if (parsed.recipeId) recipeIds.add(parsed.recipeId);
        } catch {
          // ignore malformed cache files
        }
      }
      res.json({
        cachedRecipeIds: Array.from(recipeIds),
        totalCachedTutorials: files.length,
        videoServiceStatus: VIDEO_SERVICE_STATUS,
      });
    } catch {
      res.json({
        cachedRecipeIds: [],
        totalCachedTutorials: 0,
        videoServiceStatus: VIDEO_SERVICE_STATUS,
      });
    }
  });

  app.get("/api/chef-video/audio/:filename", (req, res) => {
    const filename = req.params.filename;
    if (!/^[a-zA-Z0-9_-]+\.wav$/.test(filename)) {
      res.status(400).json({ error: "Nombre de archivo de audio no válido." });
      return;
    }
    const filePath = path.join(VIDEO_CACHE_DIR, filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Audio no encontrado en caché." });
      return;
    }
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    fs.createReadStream(filePath).pipe(res);
  });

  app.post("/api/chef-video/generate", async (req, res) => {
    try {
      const { recipe, duration = "3min", voice = "femenino", scriptOnly = false, forceRegenerate = false } =
        req.body as {
          recipe?: {
            id: string;
            title: string;
            difficulty?: string;
            prepTimeMinutes?: number;
            servingsBase?: number;
            country?: string;
            description?: string;
            ingredients?: Array<{ item: string; amount: number; unit: string }>;
            utensils?: string[];
            instructions?: string[];
            chefTip?: string;
            allergens?: string[];
            requiresAdultSupervision?: boolean;
            safetyNote?: string;
          };
          duration?: "1min" | "3min" | "6min";
          voice?: "femenino" | "masculino";
          scriptOnly?: boolean;
          forceRegenerate?: boolean;
        };

      if (!recipe || !recipe.id || !recipe.title) {
        res.status(400).json({ error: "Se requiere información válida de la receta." });
        return;
      }

      const safeDuration: "1min" | "3min" | "6min" =
        duration === "1min" || duration === "6min" ? duration : "3min";
      const safeVoice: "femenino" | "masculino" = voice === "masculino" ? "masculino" : "femenino";
      const cacheKey = `${sanitizeCacheSegment(recipe.id)}__${safeDuration}__${safeVoice}`;
      const jsonPath = path.join(VIDEO_CACHE_DIR, `${cacheKey}.json`);

      const ai = getGeminiClient();

      // Check existing cache first
      if (!forceRegenerate && fs.existsSync(jsonPath)) {
        const cached = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as {
          scenes: Array<{
            sceneNumber: number;
            narrationText: string;
            audioUrl?: string | null;
            audioError?: string | null;
          }>;
          [key: string]: unknown;
        };

        // If full mode requested and some scenes lack WAV audio yet, generate only missing WAV clips
        if (!scriptOnly) {
          const missingAudioScenes = cached.scenes.filter((s) => {
            if (!s.audioUrl) return true;
            const wavName = path.basename(s.audioUrl);
            return !fs.existsSync(path.join(VIDEO_CACHE_DIR, wavName));
          });

          if (missingAudioScenes.length > 0) {
            for (let idx = 0; idx < missingAudioScenes.length; idx += 2) {
              const batch = missingAudioScenes.slice(idx, idx + 2);
              await Promise.all(
                batch.map(async (scene) => {
                  const wavFile = `${cacheKey}__scene_${scene.sceneNumber}.wav`;
                  const wavPath = path.join(VIDEO_CACHE_DIR, wavFile);
                  const ttsResult = await synthesizeSceneNarration(
                    ai,
                    scene.narrationText,
                    safeVoice,
                    wavPath
                  );
                  if (ttsResult.ok) {
                    scene.audioUrl = `/api/chef-video/audio/${wavFile}`;
                    scene.audioError = null;
                  } else {
                    scene.audioUrl = null;
                    scene.audioError = ttsResult.error ?? "No se pudo generar el audio.";
                  }
                })
              );
            }
            fs.writeFileSync(jsonPath, JSON.stringify(cached, null, 2), "utf-8");
          }
        }

        res.json({
          tutorial: cached,
          fromCache: true,
          videoServiceStatus: VIDEO_SERVICE_STATUS,
        });
        return;
      }

      const durationTarget =
        safeDuration === "1min"
          ? "Duración corta (1 minuto en total, ~10 segundos por escena; narración ágil de 20 a 30 palabras por escena)"
          : safeDuration === "6min"
            ? "Duración completa (5 a 8 minutos en total, ~55-75 segundos por escena; explicación detallada paso a paso de 95 a 130 palabras por escena)"
            : "Duración normal (3 minutos en total, ~30 segundos por escena; narración clara de 50 a 70 palabras por escena)";

      const ingredientsFormatted = (recipe.ingredients ?? [])
        .map((i) => `- ${i.amount} ${i.unit === "al gusto" ? "al gusto de" : i.unit} ${i.item}`)
        .join("\n");

      const scriptPrompt = `Crea el guion completo de un tutorial culinario audiovisual dividido EXACTAMENTE en las 6 escenas obligatorias para la receta "${recipe.title}".

DATOS VERIFICADOS DE LA RECETA (respeta estas cantidades, ingredientes, temperaturas y tiempos sin inventar datos contradictorios):
- Dificultad: ${recipe.difficulty ?? "Principiante"}
- Tiempo de preparación estimado: ${recipe.prepTimeMinutes ?? 20} minutos
- Porciones: ${recipe.servingsBase ?? 2}
- País / Cocina: ${recipe.country ?? "Academia Chef"}
- Ingredientes exactos:
${ingredientsFormatted || "- Según descripción"}
- Utensilios: ${(recipe.utensils ?? []).join(", ") || "Básicos de cocina"}
- Pasos base:
${(recipe.instructions ?? []).map((st, idx) => `${idx + 1}. ${st}`).join("\n")}
- Consejo base: ${recipe.chefTip ?? "Prepara todo antes de encender la estufa."}
- Alérgenos declarados: ${(recipe.allergens ?? []).join(", ") || "Revisar ingredientes"}
- Seguridad: ${recipe.safetyNote ?? "Cocinar bajo supervisión de un adulto responsable."}

CONFIGURACIÓN DEL TUTORIAL:
- Público: Estudiante de 12 años principiante. Usa español sencillo, cercano, educativo y motivador.
- Narrador: ${safeVoice === "masculino" ? "Profesor Chef masculino (habla en primera persona como tu profesor)" : "Profesora Chef femenina (habla en primera persona como tu profesora)"}.
- Objetivo de extensión: ${durationTarget}.

REGLAS OBLIGATORIAS DE SEGURIDAD Y CALIDAD:
1. En las 6 escenas respeta el orden exacto:
   1) Presentación (nombre de la receta, dificultad, tiempo estimado y qué vamos a lograr)
   2) Ingredientes (menciona las cantidades exactas y los utensilios)
   3) Preparación (cómo lavar, cortar o mezclar cada ingrediente con técnica segura y movimiento exacto)
   4) Cocción (proceso de cocción o refrigeración/armado, tiempos y temperaturas exactas si aplica, advertencias claras de cuchillos/fuego/horno/aceite caliente y supervisión adulta)
   5) Emplatado (cómo presentar el plato bonito, cómo se ve el resultado final y consejos de decoración)
   6) Consejos del Chef (errores comunes a evitar, trucos culinarios y motivación para principiantes)
2. NUNCA presentes los tiempos de cocción como garantía única de seguridad alimentaria: aclara siempre que además del tiempo hay que comprobar visualmente o con termómetro que carnes, pollo o huevo estén completamente cocidos.
3. En cada escena explica POR QUÉ se realiza esa técnica y enseña 1 término de vocabulario gastronómico explicado fácil para un chico o chica de 12 años.`;

      const scriptResponse = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: scriptPrompt,
        config: {
          systemInstruction: CHEF_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodSafetyReminder: {
                type: Type.STRING,
                description:
                  "Recordatorio general de seguridad alimentaria aclarando que los tiempos son guía y hay que verificar cocción completa e higiene.",
              },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.INTEGER },
                    sceneKey: { type: Type.STRING },
                    title: { type: Type.STRING },
                    headline: {
                      type: Type.STRING,
                      description: "Titular corto de la escena (ej. Escena 1 · Presentación).",
                    },
                    narrationText: {
                      type: Type.STRING,
                      description: "Texto hablado natural en español para el profesor virtual.",
                    },
                    whyTechniqueMatters: {
                      type: Type.STRING,
                      description: "Explicación breve de por qué se hace esta técnica o paso.",
                    },
                    culinaryTerm: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                      },
                      required: ["term", "meaning"],
                    },
                    visualHighlights: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3 a 5 puntos clave visuales en pantalla (cantidades, utensilios, temperaturas).",
                    },
                    safetyAlert: {
                      type: Type.STRING,
                      description: "Advertencia de seguridad y supervisión adulta cuando aplique.",
                    },
                    estimatedSeconds: { type: Type.INTEGER },
                  },
                  required: [
                    "sceneNumber",
                    "sceneKey",
                    "title",
                    "headline",
                    "narrationText",
                    "whyTechniqueMatters",
                    "culinaryTerm",
                    "visualHighlights",
                    "estimatedSeconds",
                  ],
                },
              },
            },
            required: ["foodSafetyReminder", "scenes"],
          },
        },
      });

      const parsedScript = JSON.parse((scriptResponse.text ?? "{}").trim()) as {
        foodSafetyReminder?: string;
        scenes?: Array<{
          sceneNumber: 1 | 2 | 3 | 4 | 5 | 6;
          sceneKey: "presentacion" | "ingredientes" | "preparacion" | "coccion" | "emplatado" | "consejos";
          title: string;
          headline: string;
          narrationText: string;
          whyTechniqueMatters: string;
          culinaryTerm: { term: string; meaning: string };
          visualHighlights: string[];
          safetyAlert?: string;
          estimatedSeconds: number;
        }>;
      };

      const rawScenes = (parsedScript.scenes ?? []).slice(0, 6);
      if (rawScenes.length === 0) {
        res.status(502).json({ error: "No se pudo generar el guion del tutorial. Intenta de nuevo." });
        return;
      }

      const sceneKeys: Array<
        "presentacion" | "ingredientes" | "preparacion" | "coccion" | "emplatado" | "consejos"
      > = ["presentacion", "ingredientes", "preparacion", "coccion", "emplatado", "consejos"];

      const scenesWithMeta = rawScenes.map((sc, idx) => ({
        ...sc,
        sceneNumber: ((idx + 1) as 1 | 2 | 3 | 4 | 5 | 6),
        sceneKey: sceneKeys[idx] ?? "presentacion",
        subtitleChunks: splitNarrationToSubtitles(sc.narrationText),
        estimatedSeconds: Math.max(8, Number(sc.estimatedSeconds) || 25),
        audioUrl: null as string | null,
        audioError: null as string | null,
      }));

      // Generate real Spanish AI voice WAV per scene unless scriptOnly pre-warm
      if (!scriptOnly) {
        for (let idx = 0; idx < scenesWithMeta.length; idx += 2) {
          const batch = scenesWithMeta.slice(idx, idx + 2);
          await Promise.all(
            batch.map(async (scene) => {
              const wavFile = `${cacheKey}__scene_${scene.sceneNumber}.wav`;
              const wavPath = path.join(VIDEO_CACHE_DIR, wavFile);
              const ttsResult = await synthesizeSceneNarration(
                ai,
                scene.narrationText,
                safeVoice,
                wavPath
              );
              if (ttsResult.ok) {
                scene.audioUrl = `/api/chef-video/audio/${wavFile}`;
                scene.audioError = null;
              } else {
                scene.audioUrl = null;
                scene.audioError = ttsResult.error ?? "No se pudo sintetizar la voz.";
              }
            })
          );
        }
      }

      const tutorial = {
        cacheKey,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        durationOption: safeDuration,
        narratorGender: safeVoice,
        language: "es" as const,
        createdAt: new Date().toISOString(),
        scriptModel: "gemini-4-hydrogen",
        ttsModel: "gemini-3.8-flash-lite-tts",
        totalEstimatedSeconds: scenesWithMeta.reduce((acc, s) => acc + s.estimatedSeconds, 0),
        foodSafetyReminder:
          parsedScript.foodSafetyReminder ||
          "Los tiempos indicados son una guía: comprueba siempre la cocción completa antes de servir y cocina junto a un adulto.",
        scenes: scenesWithMeta,
      };

      fs.writeFileSync(jsonPath, JSON.stringify(tutorial, null, 2), "utf-8");

      res.json({
        tutorial,
        fromCache: false,
        videoServiceStatus: VIDEO_SERVICE_STATUS,
      });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CHEF ACADEMY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
