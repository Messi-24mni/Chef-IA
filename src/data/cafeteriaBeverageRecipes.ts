import type { Recipe } from "../types/academy";
import { BEVERAGE_PHOTO, type BeveragePhotoKey } from "./beverageImages";

export const CAFETERIA_CATEGORIES = [
  "Cafés calientes",
  "Cafés fríos",
  "Bebidas de chocolate",
  "Tés y chai de cafetería",
  "Frappés y bebidas mezcladas",
  "Lattes de sabores",
  "Limonadas y refrescos de cafetería",
  "Smoothies de cafetería",
  "Malteadas y bebidas cremosas",
  "Bebidas especiales y de temporada",
] as const;

export type CafeteriaCategory = (typeof CAFETERIA_CATEGORIES)[number];

interface CafeteriaBaseSpec {
  name: string;
  baseIngredientsText: string;
  photo: BeveragePhotoKey;
  ingredients: Array<{ item: string; amount: number; unit: string }>;
  containsCaffeine?: boolean;
}

interface CafeteriaVariationSpec {
  suffix: string;
  ingredientText: string;
  ingredient?: { item: string; amount: number; unit: string };
  overridePhoto?: (base: CafeteriaBaseSpec) => BeveragePhotoKey | null;
}

interface CafeteriaCategorySpec {
  category: CafeteriaCategory;
  prepMinutes: number;
  difficulty: "Principiante" | "Básico";
  requiresBlender?: boolean;
  isHot?: boolean;
  isSparkling?: boolean;
  usesCoffeeMachine?: boolean;
  bases: CafeteriaBaseSpec[];
  variations: CafeteriaVariationSpec[];
}

const CAFETERIA_SPECS: CafeteriaCategorySpec[] = [
  {
    category: "Cafés calientes",
    prepMinutes: 8,
    difficulty: "Básico",
    isHot: true,
    usesCoffeeMachine: true,
    bases: [
      {
        name: "Espresso",
        baseIngredientsText: "café espresso",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [{ item: "Café espresso recién hecho (o descafeinado)", amount: 60, unit: "ml" }],
      },
      {
        name: "Espresso doble",
        baseIngredientsText: "doble porción de café espresso",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [{ item: "Doble carga de café espresso (o descafeinado)", amount: 120, unit: "ml" }],
      },
      {
        name: "Americano",
        baseIngredientsText: "espresso y agua caliente",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Agua caliente", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Café filtrado",
        baseIngredientsText: "café molido y agua caliente",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [
          { item: "Café molido medio (o descafeinado)", amount: 2, unit: "cdas" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Café de prensa francesa",
        baseIngredientsText: "café molido y agua",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [
          { item: "Café molido grueso (o descafeinado)", amount: 2.5, unit: "cdas" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Café de olla",
        baseIngredientsText: "café, canela y agua",
        photo: "espressoAmericano",
        containsCaffeine: true,
        ingredients: [
          { item: "Café molido (o descafeinado)", amount: 2, unit: "cdas" },
          { item: "Rama de canela", amount: 1, unit: "unidad" },
          { item: "Agua", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Café con leche",
        baseIngredientsText: "café y leche caliente",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café preparado (o descafeinado)", amount: 1, unit: "taza" },
          { item: "Leche caliente", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Cappuccino",
        baseIngredientsText: "espresso, leche vaporizada y espuma",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche vaporizada y espuma espesa", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte",
        baseIngredientsText: "espresso y abundante leche vaporizada",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche vaporizada cremosa", amount: 1.75, unit: "tazas" },
        ],
      },
      {
        name: "Flat white",
        baseIngredientsText: "espresso doble y leche microespumada",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Doble espresso (o descafeinado)", amount: 90, unit: "ml" },
          { item: "Leche microespumada fina", amount: 1.25, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "clásico", ingredientText: "clásico" },
      { suffix: "con vainilla", ingredientText: "con vainilla", ingredient: { item: "Extracto o sirope de vainilla", amount: 1, unit: "cdita" } },
      { suffix: "con canela", ingredientText: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con caramelo", ingredientText: "con caramelo", ingredient: { item: "Salsa o sirope de caramelo", amount: 1, unit: "cda" } },
      { suffix: "con chocolate", ingredientText: "con chocolate", ingredient: { item: "Salsa de chocolate o cacao", amount: 1, unit: "cda" } },
    ],
  },
  {
    category: "Cafés fríos",
    prepMinutes: 8,
    difficulty: "Principiante",
    usesCoffeeMachine: true,
    bases: [
      {
        name: "Iced coffee",
        baseIngredientsText: "café preparado y hielo",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café preparado frío (o descafeinado)", amount: 1.5, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Cold brew",
        baseIngredientsText: "café infusionado en agua fría",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Concentrado de café en frío (o descafeinado)", amount: 1, unit: "taza" },
          { item: "Agua fría y hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Iced americano",
        baseIngredientsText: "espresso, agua fría y hielo",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Agua fría y hielo", amount: 1.75, unit: "tazas" },
        ],
      },
      {
        name: "Iced latte",
        baseIngredientsText: "espresso, leche fría y hielo",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Iced cappuccino",
        baseIngredientsText: "espresso, leche fría y espuma",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche fría con espuma batida", amount: 1.5, unit: "tazas" },
          { item: "Hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Café shakerato sin alcohol",
        baseIngredientsText: "espresso agitado con hielo",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso doble (o descafeinado)", amount: 90, unit: "ml" },
          { item: "Hielo en cubos para agitar", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Café con leche frío",
        baseIngredientsText: "café y leche fría",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café frío (o descafeinado)", amount: 1, unit: "taza" },
          { item: "Leche fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Café tonic sin alcohol",
        baseIngredientsText: "espresso y agua tónica sin alcohol",
        photo: "icedLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Agua tónica sin alcohol fría", amount: 1.5, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Café frappé",
        baseIngredientsText: "café frío y hielo triturado",
        photo: "frappeCrema",
        containsCaffeine: true,
        ingredients: [
          { item: "Café frío (o descafeinado)", amount: 1, unit: "taza" },
          { item: "Hielo triturado", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Café helado cremoso",
        baseIngredientsText: "café, leche y hielo",
        photo: "frappeCrema",
        containsCaffeine: true,
        ingredients: [
          { item: "Café frío (o descafeinado)", amount: 0.75, unit: "taza" },
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Cubos de hielo", amount: 1.25, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con vainilla", ingredientText: "con vainilla", ingredient: { item: "Extracto o sirope de vainilla", amount: 1, unit: "cdita" } },
      { suffix: "con caramelo", ingredientText: "con caramelo", ingredient: { item: "Sirope de caramelo", amount: 1, unit: "cda" } },
      { suffix: "con canela", ingredientText: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con chocolate", ingredientText: "con chocolate", ingredient: { item: "Salsa de chocolate", amount: 1, unit: "cda" } },
      {
        suffix: "con crema batida",
        ingredientText: "con crema batida",
        ingredient: { item: "Crema batida fresca", amount: 3, unit: "cdas" },
        overridePhoto: () => "frappeCrema",
      },
    ],
  },
  {
    category: "Bebidas de chocolate",
    prepMinutes: 10,
    difficulty: "Principiante",
    isHot: true,
    bases: [
      {
        name: "Chocolate caliente",
        baseIngredientsText: "leche y chocolate",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Chocolate troceado", amount: 45, unit: "g" },
        ],
      },
      {
        name: "Chocolate blanco caliente",
        baseIngredientsText: "leche y chocolate blanco",
        photo: "chocolateBlanco",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Chocolate blanco troceado", amount: 40, unit: "g" },
        ],
      },
      {
        name: "Cacao caliente",
        baseIngredientsText: "leche y cacao",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cacao puro en polvo", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Moca",
        baseIngredientsText: "espresso, leche y chocolate",
        photo: "chocolateCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche caliente", amount: 1.5, unit: "tazas" },
          { item: "Chocolate troceado o salsa", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Moca blanco",
        baseIngredientsText: "espresso, leche y chocolate blanco",
        photo: "chocolateBlanco",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche caliente", amount: 1.5, unit: "tazas" },
          { item: "Chocolate blanco", amount: 30, unit: "g" },
        ],
      },
      {
        name: "Chocolate frío",
        baseIngredientsText: "leche fría y chocolate",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Chocolate o cacao disuelto", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Chocolate frappé",
        baseIngredientsText: "chocolate, leche y hielo",
        photo: "frappeCrema",
        ingredients: [
          { item: "Salsa de chocolate o cacao", amount: 2.5, unit: "cdas" },
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Hielo en cubos", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Chocolate con menta",
        baseIngredientsText: "leche, chocolate y menta",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Chocolate troceado", amount: 40, unit: "g" },
          { item: "Hojas o gotas de menta culinaria", amount: 4, unit: "hojas" },
        ],
      },
      {
        name: "Chocolate con avellana",
        baseIngredientsText: "leche y crema de avellana",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Crema de avellana y cacao", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Chocolate especiado",
        baseIngredientsText: "leche, cacao y canela",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cacao en polvo", amount: 1.5, unit: "cdas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
    ],
    variations: [
      { suffix: "con vainilla", ingredientText: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con canela", ingredientText: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con crema batida", ingredientText: "con crema batida", ingredient: { item: "Crema batida", amount: 3, unit: "cdas" } },
      { suffix: "con malvaviscos", ingredientText: "con malvaviscos", ingredient: { item: "Mini malvaviscos", amount: 0.25, unit: "taza" } },
      { suffix: "con chispas de chocolate", ingredientText: "con chispas de chocolate", ingredient: { item: "Chispas de chocolate", amount: 1.5, unit: "cdas" } },
    ],
  },
  {
    category: "Tés y chai de cafetería",
    prepMinutes: 8,
    difficulty: "Principiante",
    isHot: true,
    bases: [
      {
        name: "Té negro",
        baseIngredientsText: "té negro y agua caliente",
        photo: "infusionCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Hebras o bolsita de té negro (o desteinado)", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Té verde",
        baseIngredientsText: "té verde y agua caliente",
        photo: "infusionCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Hebras o bolsita de té verde", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Té de jazmín",
        baseIngredientsText: "té de jazmín y agua",
        photo: "infusionCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Té o flores de jazmín", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Earl Grey",
        baseIngredientsText: "té negro y bergamota",
        photo: "infusionCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Té negro Earl Grey con bergamota", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Chai latte",
        baseIngredientsText: "té chai y leche",
        photo: "chaiLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Infusión concentrada de té chai especiado", amount: 0.75, unit: "taza" },
          { item: "Leche vaporizada", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Dirty chai sin cafeína",
        baseIngredientsText: "chai sin cafeína y leche",
        photo: "chaiLatte",
        ingredients: [
          { item: "Chai especiado sin cafeína", amount: 0.75, unit: "taza" },
          { item: "Leche vaporizada", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Matcha latte",
        baseIngredientsText: "matcha y leche",
        photo: "matchaCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Té verde matcha culinario", amount: 1, unit: "cdita" },
          { item: "Leche vaporizada", amount: 1.75, unit: "tazas" },
        ],
      },
      {
        name: "Matcha frío",
        baseIngredientsText: "matcha, leche fría y hielo",
        photo: "matchaFrio",
        containsCaffeine: true,
        ingredients: [
          { item: "Matcha disuelto en 2 cdas de agua", amount: 1, unit: "cdita" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "London fog",
        baseIngredientsText: "Earl Grey, leche y vainilla",
        photo: "chaiLatte",
        containsCaffeine: true,
        ingredients: [
          { item: "Infusión fuerte de Earl Grey", amount: 0.75, unit: "taza" },
          { item: "Leche espumada", amount: 1.25, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Rooibos latte",
        baseIngredientsText: "rooibos y leche",
        photo: "chaiLatte",
        ingredients: [
          { item: "Infusión concentrada de rooibos sin cafeína", amount: 0.75, unit: "taza" },
          { item: "Leche vaporizada", amount: 1.25, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con vainilla", ingredientText: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con miel", ingredientText: "con miel", ingredient: { item: "Miel de abeja", amount: 1, unit: "cdita" } },
      { suffix: "con canela", ingredientText: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      {
        suffix: "frío con hielo",
        ingredientText: "frío con hielo",
        ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" },
        overridePhoto: (base) => {
          if (base.name.toLowerCase().includes("matcha")) return "matchaFrio";
          if (base.photo === "chaiLatte") return "icedLatte";
          return "aguaLimon";
        },
      },
      { suffix: "con espuma de leche", ingredientText: "con espuma de leche", ingredient: { item: "Espuma de leche", amount: 0.35, unit: "taza" } },
    ],
  },
  {
    category: "Frappés y bebidas mezcladas",
    prepMinutes: 8,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Frappé de café",
        baseIngredientsText: "café, leche y hielo",
        photo: "frappeCrema",
        containsCaffeine: true,
        ingredients: [
          { item: "Café frío (o descafeinado)", amount: 0.75, unit: "taza" },
          { item: "Leche fría", amount: 0.75, unit: "taza" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de vainilla",
        baseIngredientsText: "leche, vainilla y hielo",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 1, unit: "cdita" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de caramelo",
        baseIngredientsText: "leche, caramelo y hielo",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Salsa de caramelo", amount: 2, unit: "cdas" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de moca",
        baseIngredientsText: "café, chocolate, leche y hielo",
        photo: "frappeCrema",
        containsCaffeine: true,
        ingredients: [
          { item: "Café frío (o descafeinado)", amount: 0.5, unit: "taza" },
          { item: "Salsa de chocolate", amount: 2, unit: "cdas" },
          { item: "Leche fría y hielo", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de chocolate",
        baseIngredientsText: "chocolate, leche y hielo",
        photo: "frappeCrema",
        ingredients: [
          { item: "Salsa de chocolate o cacao", amount: 2.5, unit: "cdas" },
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de fresa",
        baseIngredientsText: "fresas, leche y hielo",
        photo: "batidoFrutos",
        ingredients: [
          { item: "Fresas limpias", amount: 1, unit: "taza" },
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Cubos de hielo", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de mango",
        baseIngredientsText: "mango, yogur y hielo",
        photo: "mangoLassi",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1, unit: "taza" },
          { item: "Yogur natural", amount: 0.75, unit: "taza" },
          { item: "Cubos de hielo", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de galleta",
        baseIngredientsText: "leche, galletas y hielo",
        photo: "malteadaCremosa",
        ingredients: [
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Galletas", amount: 4, unit: "unidades" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de matcha",
        baseIngredientsText: "matcha, leche y hielo",
        photo: "matchaFrio",
        containsCaffeine: true,
        ingredients: [
          { item: "Té matcha en polvo", amount: 1.5, unit: "cditas" },
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Frappé de canela",
        baseIngredientsText: "leche, canela y hielo",
        photo: "licuadoCremoso",
        ingredients: [
          { item: "Leche fría", amount: 1.25, unit: "tazas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
          { item: "Cubos de hielo", amount: 1.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con crema batida", ingredientText: "con crema batida", ingredient: { item: "Crema batida", amount: 3, unit: "cdas" } },
      { suffix: "con salsa de chocolate", ingredientText: "con salsa de chocolate", ingredient: { item: "Salsa de chocolate", amount: 1.5, unit: "cdas" } },
      { suffix: "con caramelo", ingredientText: "con caramelo", ingredient: { item: "Salsa de caramelo", amount: 1.5, unit: "cdas" } },
      { suffix: "con galleta triturada", ingredientText: "con galleta triturada", ingredient: { item: "Galleta triturada", amount: 2, unit: "cdas" } },
      { suffix: "con virutas de chocolate", ingredientText: "con virutas de chocolate", ingredient: { item: "Virutas de chocolate", amount: 1.5, unit: "cdas" } },
    ],
  },
  {
    category: "Lattes de sabores",
    prepMinutes: 8,
    difficulty: "Básico",
    isHot: true,
    usesCoffeeMachine: true,
    bases: [
      {
        name: "Latte de vainilla",
        baseIngredientsText: "espresso y leche con vainilla",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche con vainilla", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte de caramelo",
        baseIngredientsText: "espresso y leche con caramelo",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche con salsa de caramelo", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte de avellana",
        baseIngredientsText: "espresso y leche con avellana",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche con esencia o crema de avellana", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte de canela",
        baseIngredientsText: "espresso y leche con canela",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche infusionada con canela", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte de miel",
        baseIngredientsText: "espresso, leche y miel",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche caliente", amount: 1.5, unit: "tazas" },
          { item: "Miel de abeja", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Latte de coco",
        baseIngredientsText: "espresso y leche de coco",
        photo: "chocolateBlanco",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Bebida o leche de coco", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Latte de lavanda",
        baseIngredientsText: "espresso, leche y lavanda culinaria",
        photo: "chocolateBlanco",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
          { item: "Sirope o infusión de lavanda culinaria", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Latte de maple",
        baseIngredientsText: "espresso, leche y sirope de maple",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
          { item: "Sirope de maple", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Latte de dulce de leche",
        baseIngredientsText: "espresso, leche y dulce de leche",
        photo: "latteArt",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
          { item: "Dulce de leche", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Latte de pistacho",
        baseIngredientsText: "espresso y leche con pistacho",
        photo: "matchaCaliente",
        containsCaffeine: true,
        ingredients: [
          { item: "Café espresso (o descafeinado)", amount: 60, unit: "ml" },
          { item: "Leche con crema o sirope de pistacho", amount: 1.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "caliente", ingredientText: "caliente" },
      {
        suffix: "frío con hielo",
        ingredientText: "frío con hielo",
        ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" },
        overridePhoto: (base) => (base.photo === "matchaCaliente" ? "matchaFrio" : "icedLatte"),
      },
      { suffix: "con espuma extra", ingredientText: "con espuma extra", ingredient: { item: "Espuma cremosa de leche", amount: 0.5, unit: "taza" } },
      { suffix: "con canela espolvoreada", ingredientText: "con canela espolvoreada", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con un toque de vainilla", ingredientText: "con un toque de vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
    ],
  },
  {
    category: "Limonadas y refrescos de cafetería",
    prepMinutes: 7,
    difficulty: "Principiante",
    isSparkling: true,
    bases: [
      {
        name: "Limonada clásica",
        baseIngredientsText: "limón, agua y hielo",
        photo: "aguaLimon",
        ingredients: [
          { item: "Jugo de limón fresco", amount: 3, unit: "cdas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Limonada de fresa",
        baseIngredientsText: "fresas, limón y agua",
        photo: "aguaRoja",
        ingredients: [
          { item: "Fresas frescas machacadas", amount: 0.5, unit: "taza" },
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Limonada de mora",
        baseIngredientsText: "moras, limón y agua",
        photo: "sodaItaliana",
        ingredients: [
          { item: "Moras frescas machacadas", amount: 0.5, unit: "taza" },
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Limonada de hierbabuena",
        baseIngredientsText: "limón, menta y agua",
        photo: "aguaLimon",
        ingredients: [
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Hojas frescas de menta o hierbabuena", amount: 8, unit: "hojas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Limonada de pepino",
        baseIngredientsText: "pepino, limón y agua",
        photo: "aguaLimon",
        ingredients: [
          { item: "Pepino en rodajas finas", amount: 0.5, unit: "taza" },
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Limonada de coco",
        baseIngredientsText: "limón, leche de coco y agua",
        photo: "aguaLimon",
        ingredients: [
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Leche de coco", amount: 0.75, unit: "taza" },
          { item: "Agua fría", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Naranjada",
        baseIngredientsText: "naranja, agua y hielo",
        photo: "jugoDorado",
        ingredients: [
          { item: "Jugo natural de naranja", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 1, unit: "taza" },
          { item: "Cubos de hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Naranjada con gas",
        baseIngredientsText: "naranja y agua con gas",
        photo: "jugoDorado",
        ingredients: [
          { item: "Jugo natural de naranja", amount: 1, unit: "taza" },
          { item: "Agua con gas fría", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Soda italiana de fresa",
        baseIngredientsText: "sirope de fresa y agua con gas",
        photo: "sodaItaliana",
        ingredients: [
          { item: "Sirope natural de fresa", amount: 2.5, unit: "cdas" },
          { item: "Agua con gas bien fría", amount: 1.75, unit: "tazas" },
        ],
      },
      {
        name: "Soda italiana de vainilla",
        baseIngredientsText: "sirope de vainilla y agua con gas",
        photo: "sodaItaliana",
        ingredients: [
          { item: "Sirope natural de vainilla", amount: 2, unit: "cdas" },
          { item: "Agua con gas bien fría", amount: 1.75, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con hielo triturado", ingredientText: "con hielo triturado", ingredient: { item: "Hielo triturado", amount: 1, unit: "taza" } },
      { suffix: "con rodajas de cítricos", ingredientText: "con rodajas de cítricos", ingredient: { item: "Rodajas de limón y naranja", amount: 4, unit: "rodajas" } },
      { suffix: "con hierbabuena", ingredientText: "con hierbabuena", ingredient: { item: "Hojas de hierbabuena", amount: 6, unit: "hojas" } },
      {
        suffix: "con frutos rojos",
        ingredientText: "con frutos rojos",
        ingredient: { item: "Frutos rojos frescos", amount: 0.35, unit: "taza" },
        overridePhoto: () => "sodaItaliana",
      },
      {
        suffix: "con agua con gas",
        ingredientText: "con agua con gas",
        ingredient: { item: "Agua con gas fría", amount: 0.5, unit: "taza" },
        overridePhoto: (base) => (base.photo === "jugoDorado" ? "jugoDorado" : "sodaItaliana"),
      },
    ],
  },
  {
    category: "Smoothies de cafetería",
    prepMinutes: 8,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Smoothie de fresa",
        baseIngredientsText: "fresas y yogur",
        photo: "batidoFrutos",
        ingredients: [
          { item: "Fresas limpias", amount: 1.5, unit: "tazas" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Smoothie de mango",
        baseIngredientsText: "mango y yogur",
        photo: "mangoLassi",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Smoothie de frutos rojos",
        baseIngredientsText: "fresas, moras y arándanos",
        photo: "batidoFrutos",
        ingredients: [
          { item: "Fresas, moras y arándanos", amount: 1.5, unit: "tazas" },
          { item: "Yogur o bebida base", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Smoothie tropical",
        baseIngredientsText: "piña, mango y banano",
        photo: "jugoDorado",
        ingredients: [
          { item: "Piña y mango en cubos", amount: 1.5, unit: "tazas" },
          { item: "Banano maduro", amount: 1, unit: "unidad" },
        ],
      },
      {
        name: "Smoothie verde",
        baseIngredientsText: "manzana, espinaca y banano",
        photo: "jugoVerde",
        ingredients: [
          { item: "Manzana verde en trozos", amount: 1, unit: "unidad" },
          { item: "Hojas de espinaca lavadas", amount: 1, unit: "taza" },
          { item: "Banano maduro", amount: 1, unit: "unidad" },
        ],
      },
      {
        name: "Smoothie de piña",
        baseIngredientsText: "piña y yogur",
        photo: "jugoDorado",
        ingredients: [
          { item: "Piña dulce en cubos", amount: 1.5, unit: "tazas" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Smoothie de durazno",
        baseIngredientsText: "durazno y yogur",
        photo: "mangoLassi",
        ingredients: [
          { item: "Duraznos maduros sin hueso", amount: 2, unit: "unidades" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Smoothie de banano",
        baseIngredientsText: "banano y leche",
        photo: "licuadoCremoso",
        ingredients: [
          { item: "Banano maduro", amount: 1.5, unit: "unidades" },
          { item: "Leche o bebida vegetal", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Smoothie de maracuyá",
        baseIngredientsText: "maracuyá y yogur",
        photo: "mangoLassi",
        ingredients: [
          { item: "Pulpa natural de maracuyá", amount: 0.5, unit: "taza" },
          { item: "Yogur natural", amount: 1.25, unit: "tazas" },
        ],
      },
      {
        name: "Smoothie de sandía",
        baseIngredientsText: "sandía y fresas",
        photo: "aguaRoja",
        ingredients: [
          { item: "Sandía sin semillas en cubos", amount: 1.5, unit: "tazas" },
          { item: "Fresas limpias", amount: 0.75, unit: "taza" },
        ],
      },
    ],
    variations: [
      { suffix: "con avena", ingredientText: "con avena", ingredient: { item: "Avena en hojuelas", amount: 2, unit: "cdas" } },
      { suffix: "con chía", ingredientText: "con chía", ingredient: { item: "Semillas de chía", amount: 1, unit: "cdita" } },
      { suffix: "con leche", ingredientText: "con leche", ingredient: { item: "Leche fría", amount: 0.5, unit: "taza" } },
      { suffix: "con yogur extra", ingredientText: "con yogur extra", ingredient: { item: "Yogur natural extra", amount: 0.5, unit: "taza" } },
      { suffix: "con coco", ingredientText: "con coco", ingredient: { item: "Coco rallado o leche de coco", amount: 2, unit: "cdas" } },
    ],
  },
  {
    category: "Malteadas y bebidas cremosas",
    prepMinutes: 8,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Malteada de vainilla",
        baseIngredientsText: "leche, helado de vainilla",
        photo: "malteadaCremosa",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla", amount: 2, unit: "bolas" },
        ],
      },
      {
        name: "Malteada de chocolate",
        baseIngredientsText: "leche, helado de chocolate",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de chocolate", amount: 2, unit: "bolas" },
        ],
      },
      {
        name: "Malteada de fresa",
        baseIngredientsText: "leche, helado de fresa",
        photo: "batidoFrutos",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de fresa", amount: 2, unit: "bolas" },
        ],
      },
      {
        name: "Malteada de galleta",
        baseIngredientsText: "leche, helado y galletas",
        photo: "malteadaCremosa",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla", amount: 2, unit: "bolas" },
          { item: "Galletas", amount: 4, unit: "unidades" },
        ],
      },
      {
        name: "Malteada de banano",
        baseIngredientsText: "leche, helado y banano",
        photo: "licuadoCremoso",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla", amount: 2, unit: "bolas" },
          { item: "Banano maduro", amount: 1, unit: "unidad" },
        ],
      },
      {
        name: "Malteada de caramelo",
        baseIngredientsText: "leche, helado y caramelo",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla", amount: 2, unit: "bolas" },
          { item: "Salsa de caramelo", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Malteada de café descafeinado",
        baseIngredientsText: "leche, helado y café descafeinado",
        photo: "frappeCrema",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla o café", amount: 2, unit: "bolas" },
          { item: "Café descafeinado frío", amount: 0.25, unit: "taza" },
        ],
      },
      {
        name: "Malteada de cookies",
        baseIngredientsText: "leche, helado y galletas con chispas",
        photo: "malteadaCremosa",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla", amount: 2, unit: "bolas" },
          { item: "Galletas con chispas", amount: 3, unit: "unidades" },
        ],
      },
      {
        name: "Malteada de mango",
        baseIngredientsText: "leche, helado y mango",
        photo: "mangoLassi",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de vainilla o mango", amount: 2, unit: "bolas" },
          { item: "Mango maduro en cubos", amount: 0.5, unit: "taza" },
        ],
      },
      {
        name: "Malteada de coco",
        baseIngredientsText: "leche, helado y coco",
        photo: "malteadaCremosa",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Helado de coco o vainilla", amount: 2, unit: "bolas" },
          { item: "Coco rallado", amount: 2, unit: "cdas" },
        ],
      },
    ],
    variations: [
      { suffix: "con crema batida", ingredientText: "con crema batida", ingredient: { item: "Crema batida", amount: 3, unit: "cdas" } },
      { suffix: "con salsa de chocolate", ingredientText: "con salsa de chocolate", ingredient: { item: "Salsa de chocolate", amount: 1.5, unit: "cdas" } },
      { suffix: "con galleta triturada", ingredientText: "con galleta triturada", ingredient: { item: "Galleta triturada", amount: 2, unit: "cdas" } },
      { suffix: "con chispas de chocolate", ingredientText: "con chispas de chocolate", ingredient: { item: "Chispas de chocolate", amount: 1.5, unit: "cdas" } },
      { suffix: "con caramelo", ingredientText: "con caramelo", ingredient: { item: "Salsa de caramelo", amount: 1.5, unit: "cdas" } },
    ],
  },
  {
    category: "Bebidas especiales y de temporada",
    prepMinutes: 12,
    difficulty: "Básico",
    requiresBlender: true,
    bases: [
      {
        name: "Ponche de frutas",
        baseIngredientsText: "jugo de naranja, piña y fruta picada",
        photo: "poncheSidra",
        ingredients: [
          { item: "Jugo natural de naranja", amount: 1.5, unit: "tazas" },
          { item: "Jugo de piña", amount: 1, unit: "taza" },
          { item: "Fruta picada de temporada", amount: 0.75, unit: "taza" },
        ],
      },
      {
        name: "Sidra especiada sin alcohol",
        baseIngredientsText: "jugo de manzana y especias",
        photo: "poncheSidra",
        ingredients: [
          { item: "Jugo puro de manzana", amount: 2.5, unit: "tazas" },
          { item: "Especias (canela, clavo suave)", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Leche dorada",
        baseIngredientsText: "leche, cúrcuma culinaria y canela",
        photo: "chaiLatte",
        ingredients: [
          { item: "Leche o bebida vegetal", amount: 2, unit: "tazas" },
          { item: "Cúrcuma culinaria", amount: 0.5, unit: "cdita" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Atole de vainilla",
        baseIngredientsText: "masa de maíz, leche y vainilla",
        photo: "chocolateBlanco",
        ingredients: [
          { item: "Masa o fécula de maíz", amount: 2, unit: "cdas" },
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Atole de chocolate",
        baseIngredientsText: "masa de maíz, leche y cacao",
        photo: "chocolateCaliente",
        ingredients: [
          { item: "Masa o fécula de maíz", amount: 2, unit: "cdas" },
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cacao en polvo", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Horchata de cafetería",
        baseIngredientsText: "arroz, leche y canela",
        photo: "licuadoCremoso",
        ingredients: [
          { item: "Arroz remojado o cocido suave", amount: 0.5, unit: "taza" },
          { item: "Leche o bebida de arroz", amount: 2, unit: "tazas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Lassi de mango",
        baseIngredientsText: "mango y yogur",
        photo: "mangoLassi",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1, unit: "taza" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Lassi de fresa",
        baseIngredientsText: "fresas y yogur",
        photo: "batidoFrutos",
        ingredients: [
          { item: "Fresas limpias", amount: 1, unit: "taza" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Agua de jamaica",
        baseIngredientsText: "flor de jamaica y agua",
        photo: "aguaRoja",
        ingredients: [
          { item: "Flores secas de jamaica lavadas", amount: 0.5, unit: "taza" },
          { item: "Agua fresca", amount: 3, unit: "tazas" },
        ],
      },
      {
        name: "Tisana de frutos rojos",
        baseIngredientsText: "frutos rojos e infusión sin cafeína",
        photo: "infusionCaliente",
        ingredients: [
          { item: "Frutos rojos deshidratados o frescos", amount: 0.5, unit: "taza" },
          { item: "Agua para infusión sin cafeína", amount: 2, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con canela", ingredientText: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con vainilla", ingredientText: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      {
        suffix: "fría con hielo",
        ingredientText: "fría con hielo",
        ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" },
        overridePhoto: (base) => {
          if (base.name === "Tisana de frutos rojos" || base.name === "Agua de jamaica") return "aguaRoja";
          if (base.name === "Atole de vainilla" || base.name === "Leche dorada") return "licuadoCremoso";
          if (base.name === "Atole de chocolate") return "frappeCrema";
          return null;
        },
      },
      { suffix: "con fruta picada", ingredientText: "con fruta picada", ingredient: { item: "Fruta fresca picada", amount: 0.35, unit: "taza" } },
      { suffix: "con espuma de leche", ingredientText: "con espuma de leche", ingredient: { item: "Espuma suave de leche", amount: 0.25, unit: "taza" } },
    ],
  },
];

function detectCafeteriaAllergens(text: string): string[] {
  const lower = text.toLowerCase();
  const allergens: string[] = [];
  if (
    /(leche|yogur|helado|chocolate blanco|dulce de leche|crema batida|espuma de leche|crema de avellana)/.test(lower) &&
    !/solo leche de coco/.test(lower)
  ) {
    allergens.push("Lácteos");
  }
  if (/galleta|cookies/.test(lower)) {
    allergens.push("Gluten (trigo)");
  }
  if (/avellana/.test(lower)) {
    allergens.push("Frutos secos (avellanas)");
  }
  if (/pistacho/.test(lower)) {
    allergens.push("Frutos secos (pistachos)");
  }
  return allergens.length > 0 ? allergens : ["Libre de alérgenos comunes"];
}

function isWarmCafeteriaDrink(spec: CafeteriaCategorySpec, base: CafeteriaBaseSpec, suffix: string): boolean {
  if (suffix.includes("frío") || suffix.includes("fría")) return false;
  if (spec.isHot) return true;
  if (spec.category === "Bebidas especiales y de temporada") {
    return /sidra|leche dorada|atole|tisana/.test(base.name.toLowerCase());
  }
  return false;
}

function buildCafeteriaInstructions(
  spec: CafeteriaCategorySpec,
  base: CafeteriaBaseSpec,
  variationText: string,
  warm: boolean
): string[] {
  if (spec.isSparkling) {
    return [
      `Lávate las manos 20 segundos y lava muy bien los cítricos, frutas o hierbas frescas.`,
      `Prepara ${base.name.toLowerCase()} colocando la fruta, limón o sirope en una jarra o vaso alto junto con ${variationText}.`,
      `Vierte suavemente el agua o agua con gas bien fría inclinando un poco el vaso para conservar las burbujas.`,
      `Mezcla una sola vez con cuchara larga, agrega hielo si lo deseas y sirve frío.`,
    ];
  }

  if (warm) {
    return [
      `Lávate las manos y reúne tus ingredientes medidos sobre la mesa (${base.baseIngredientsText}, ${variationText}).`,
      spec.usesCoffeeMachine
        ? `Con ayuda de un adulto para operar la cafetera, máquina de espresso o agua caliente, prepara la base de café (puedes usar versión descafeinada para jóvenes).`
        : `Pide ayuda de un adulto para calentar el agua o leche a fuego suave hasta que esté bien caliente pero sin hervir de golpe.`,
      `Combina o infusiona la base en una taza amplia junto con ${variationText} hasta que quede bien integrada o con su capa de espuma.`,
      `Deja entibiar 1 o 2 minutos para evitar quemarte la lengua y disfruta.`,
    ];
  }

  if (spec.requiresBlender) {
    return [
      `Lávate las manos 20 segundos y lava muy bien las frutas frescas o utensilios antes de empezar.`,
      `Coloca en el vaso de la licuadora ${base.baseIngredientsText} junto con ${variationText}.`,
      `Con supervisión adulta, asegura bien la tapa y licúa durante 30 a 45 segundos hasta obtener una mezcla cremosa y uniforme.`,
      `Sirve en vasos fríos, decora al gusto y disfruta al instante.`,
    ];
  }

  return [
    `Lávate las manos y llena un vaso alto con cubos de hielo.`,
    `Con ayuda adulta si preparas espresso en máquina, vierte primero el líquido frío o leche y luego añade la base (${base.baseIngredientsText}).`,
    `Incorpora ${variationText}, mezcla suavemente con cuchara larga y sirve bien frío.`,
  ];
}

function buildCafeteriaChefTip(spec: CafeteriaCategorySpec, base: CafeteriaBaseSpec): string {
  switch (spec.category) {
    case "Cafés calientes":
      return "Para jóvenes, prepara cualquier clásico de esta carta con café descafeinado para disfrutar el sabor de cafetería sin cafeína.";
    case "Cafés fríos":
      return "Deja enfriar unos minutos el espresso (o café descafeinado) antes de verterlo sobre el hielo para que no se derrita tan rápido.";
    case "Bebidas de chocolate":
      return "Picar fino el chocolate antes de añadirlo a la leche tibia hace que se derrita parejo y quede súper cremoso.";
    case "Tés y chai de cafetería":
      return base.containsCaffeine
        ? "Controla el tiempo de infusión (3–4 minutos) para que el té no amargue, o elige versiones herbales / rooibos sin cafeína."
        : "Las infusiones sin cafeína como rooibos y chai herbal saben aún más ricas si tapas la taza 5 minutos al reposar.";
    case "Frappés y bebidas mezcladas":
      return "Usa leche bien fría y pulsa la licuadora en ráfagas cortas primero para triturar el hielo sin forzar el motor.";
    case "Lattes de sabores":
      return "Añade la vainilla, canela o caramelo en el fondo de la taza antes de servir la leche espumada para mezclar mejor el aroma.";
    case "Limonadas y refrescos de cafetería":
      return "Machaca suavemente la hierbabuena o fruta con una cuchara antes de añadir el hielo para liberar todo su aroma.";
    case "Smoothies de cafetería":
      return "Congelar el banano o las fresas en trocitos te da una textura de cafetería espesa sin tener que añadir tanto hielo.";
    case "Malteadas y bebidas cremosas":
      return "Enfría el vaso en el refrigerador 5 minutos antes de servir la malteada para que mantenga su textura cremosa por más tiempo.";
    case "Bebidas especiales y de temporada":
      return "En bebidas calientes como atole o leche dorada, mueve el fondo constantemente con batidor de globo para evitar grumos.";
  }
}

export const CAFETERIA_BEVERAGE_RECIPES: Recipe[] = (() => {
  const list: Recipe[] = [];
  let counter = 1;

  for (const spec of CAFETERIA_SPECS) {
    for (const base of spec.bases) {
      for (const variation of spec.variations) {
        const number = counter++;
        const title = `${base.name} ${variation.suffix}`;
        const combinedText = `${title} ${base.baseIngredientsText} ${variation.ingredient?.item ?? ""}`;
        const allergens = detectCafeteriaAllergens(combinedText);
        const warm = isWarmCafeteriaDrink(spec, base, variation.suffix);
        const requiresAdult = Boolean(spec.requiresBlender || spec.usesCoffeeMachine || warm);

        const photoKey =
          variation.overridePhoto?.(base) ??
          base.photo;

        const utensils = warm
          ? spec.usesCoffeeMachine
            ? ["Cafetera o prensa (con adulto)", "Espumador o batidor", "Taza amplia resistente al calor"]
            : ["Olla pequeña o tetera (con adulto)", "Batidor o cuchara", "Taza resistente al calor"]
          : spec.isSparkling
            ? ["Jarra o vaso alto", "Cuchara larga", "Mortero suave o cuchara"]
            : spec.requiresBlender
              ? ["Licuadora (con adulto)", "Vaso alto", "Espátula o cuchara"]
              : ["Vaso alto", "Cuchara larga", "Cafetera (con adulto si usa café)"];

        const safetyNoteParts: string[] = [];
        if (warm || spec.usesCoffeeMachine) {
          safetyNoteParts.push("Pide ayuda adulta para usar agua caliente, estufa o máquinas de café.");
        }
        if (spec.requiresBlender) {
          safetyNoteParts.push("Pide supervisión adulta para tapar y usar la licuadora o cuchillos.");
        }
        if (base.containsCaffeine) {
          safetyNoteParts.push("Contiene café o té con cafeína en su receta clásica; para jóvenes se recomienda preparar con café descafeinado o versión sin cafeína.");
        }
        if (safetyNoteParts.length === 0) {
          safetyNoteParts.push("Lava bien tus manos y todas las frutas o hierbas frescas antes de preparar.");
        }

        const ingredients = variation.ingredient
          ? [...base.ingredients, variation.ingredient]
          : [...base.ingredients];

        list.push({
          id: `cafe-${number}`,
          title,
          mealType: "Bebidas",
          category: "Bebidas",
          source: "cafeteria",
          pdfNumber: number,
          country: spec.category,
          countryFlavors: base.containsCaffeine ? "Cafetería · Opción descafeinada" : "Cafetería · Sin cafeína",
          family: spec.category,
          difficulty: spec.difficulty,
          prepTimeMinutes: spec.prepMinutes,
          servingsBase: 2,
          image: BEVERAGE_PHOTO[photoKey],
          description: `Bebida de cafetería sin alcohol de la categoría "${spec.category}". Ingredientes base: ${base.baseIngredientsText}, ${variation.ingredientText}.${base.containsCaffeine ? " Se puede preparar en versión descafeinada o sin cafeína." : ""}`,
          ingredients,
          utensils,
          instructions: buildCafeteriaInstructions(spec, base, variation.ingredientText, warm),
          chefTip: buildCafeteriaChefTip(spec, base),
          allergens,
          requiresAdultSupervision: requiresAdult,
          safetyNote: safetyNoteParts.join(" "),
        });
      }
    }
  }

  return list;
})();
