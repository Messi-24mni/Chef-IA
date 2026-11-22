import type { Recipe } from "../types/academy";
import { BEVERAGE_PHOTO } from "./beverageImages";

export const BEVERAGE_CATEGORIES = [
  "Aguas frescas",
  "Jugos naturales",
  "Batidos de frutas",
  "Licuados cremosos",
  "Tés e infusiones sin cafeína",
  "Bebidas de cacao y leche",
  "Bebidas con gas y mocktails",
  "Bebidas tropicales",
  "Bebidas nutritivas",
  "Bebidas del mundo",
] as const;

export type BeverageCategory = (typeof BEVERAGE_CATEGORIES)[number];

interface BeverageBaseSpec {
  name: string;
  baseIngredientsText: string;
  image: string;
  ingredients: Array<{ item: string; amount: number; unit: string }>;
  originHint?: string;
}

interface BeverageCategorySpec {
  category: BeverageCategory;
  prepMinutes: number;
  difficulty: "Principiante" | "Básico";
  requiresBlender?: boolean;
  isHot?: boolean;
  isSparkling?: boolean;
  bases: BeverageBaseSpec[];
  variations: Array<{
    suffix: string;
    ingredient: { item: string; amount: number; unit: string };
  }>;
}

const BEVERAGE_SPECS: BeverageCategorySpec[] = [
  {
    category: "Aguas frescas",
    prepMinutes: 10,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Agua de sandía",
        baseIngredientsText: "sandía licuada, agua y unas gotas de limón",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Sandía sin semillas en cubos", amount: 2, unit: "tazas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
          { item: "Jugo de limón", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Agua de melón",
        baseIngredientsText: "melón, agua y hierbabuena",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Melón maduro en cubos", amount: 2, unit: "tazas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
          { item: "Hojas de hierbabuena", amount: 4, unit: "hojas" },
        ],
      },
      {
        name: "Agua de piña",
        baseIngredientsText: "piña, agua y limón",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Piña fresca en trozos", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
          { item: "Jugo de limón", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Agua de mango",
        baseIngredientsText: "mango maduro y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
        ],
      },
      {
        name: "Agua de papaya",
        baseIngredientsText: "papaya y agua fría",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Papaya madura en trozos", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
        ],
      },
      {
        name: "Agua de fresa",
        baseIngredientsText: "fresas, agua y limón",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Fresas limpias sin tallo", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
          { item: "Jugo de limón", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Agua de pepino",
        baseIngredientsText: "pepino, agua y limón",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Pepino lavado en rodajas", amount: 1, unit: "unidad" },
          { item: "Agua fría", amount: 3, unit: "tazas" },
          { item: "Jugo de limón", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Agua de tamarindo",
        baseIngredientsText: "pulpa de tamarindo y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Pulpa natural de tamarindo sin semillas", amount: 4, unit: "cdas" },
          { item: "Agua fresca", amount: 3, unit: "tazas" },
        ],
      },
      {
        name: "Agua de jamaica",
        baseIngredientsText: "flor de jamaica infusionada y agua",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Flores secas de jamaica lavadas", amount: 0.5, unit: "taza" },
          { item: "Agua", amount: 3, unit: "tazas" },
        ],
      },
      {
        name: "Agua de guayaba",
        baseIngredientsText: "guayaba madura y agua",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Guayabas maduras limpias", amount: 4, unit: "unidades" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con hierbabuena", ingredient: { item: "Hojas frescas de hierbabuena", amount: 5, unit: "hojas" } },
      { suffix: "con jengibre suave", ingredient: { item: "Jengibre fresco rallado suave", amount: 0.5, unit: "cdita" } },
      { suffix: "con naranja", ingredient: { item: "Jugo o rodajas de naranja", amount: 0.5, unit: "unidad" } },
      { suffix: "con limón y hielo", ingredient: { item: "Limón y cubos de hielo", amount: 1, unit: "taza" } },
      { suffix: "con un toque de canela", ingredient: { item: "Canela molida", amount: 1, unit: "pizca" } },
    ],
  },
  {
    category: "Jugos naturales",
    prepMinutes: 10,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Jugo de naranja",
        baseIngredientsText: "naranjas frescas exprimidas",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [{ item: "Naranjas jugosas frescas", amount: 4, unit: "unidades" }],
      },
      {
        name: "Jugo de manzana",
        baseIngredientsText: "manzana licuada y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Manzanas lavadas sin corazón", amount: 2, unit: "unidades" },
          { item: "Agua fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Jugo de zanahoria",
        baseIngredientsText: "zanahoria y naranja",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [
          { item: "Zanahorias peladas en trozos", amount: 2, unit: "unidades" },
          { item: "Jugo de naranja natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Jugo de piña",
        baseIngredientsText: "piña fresca y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Piña fresca en cubos", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Jugo de mango",
        baseIngredientsText: "mango y agua fría",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [
          { item: "Pulpa de mango maduro", amount: 1.5, unit: "tazas" },
          { item: "Agua fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Jugo de guayaba",
        baseIngredientsText: "guayaba y agua",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Guayabas maduras", amount: 4, unit: "unidades" },
          { item: "Agua fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Jugo de maracuyá",
        baseIngredientsText: "pulpa de maracuyá y agua",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [
          { item: "Pulpa de maracuyá", amount: 0.5, unit: "taza" },
          { item: "Agua fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Jugo de sandía",
        baseIngredientsText: "sandía sin semillas",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [{ item: "Sandía sin semillas en cubos", amount: 2.5, unit: "tazas" }],
      },
      {
        name: "Jugo de pera",
        baseIngredientsText: "pera madura y agua",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Peras maduras sin semillas", amount: 2, unit: "unidades" },
          { item: "Agua fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Jugo de melón",
        baseIngredientsText: "melón y agua",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [
          { item: "Melón maduro en cubos", amount: 2, unit: "tazas" },
          { item: "Agua fría", amount: 0.75, unit: "taza" },
        ],
      },
    ],
    variations: [
      { suffix: "con limón", ingredient: { item: "Jugo de limón recién exprimido", amount: 1, unit: "cda" } },
      { suffix: "con manzana", ingredient: { item: "Manzana picada", amount: 0.5, unit: "unidad" } },
      { suffix: "con zanahoria", ingredient: { item: "Zanahoria en trocitos", amount: 0.5, unit: "unidad" } },
      { suffix: "con pepino", ingredient: { item: "Pepino en rodajas", amount: 0.5, unit: "taza" } },
      { suffix: "con un toque de jengibre", ingredient: { item: "Jengibre fresco rallado", amount: 0.5, unit: "cdita" } },
    ],
  },
  {
    category: "Batidos de frutas",
    prepMinutes: 8,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Batido de banano",
        baseIngredientsText: "banano y leche o bebida vegetal",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Banano maduro en rodajas", amount: 1.5, unit: "unidades" },
          { item: "Leche o bebida vegetal", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de fresa",
        baseIngredientsText: "fresas y leche o bebida vegetal",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Fresas limpias", amount: 1.5, unit: "tazas" },
          { item: "Leche o bebida vegetal", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de mango",
        baseIngredientsText: "mango y yogur natural",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Batido de papaya",
        baseIngredientsText: "papaya y leche",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Papaya en cubos", amount: 1.5, unit: "tazas" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de piña",
        baseIngredientsText: "piña y yogur natural",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Piña dulce en cubos", amount: 1.5, unit: "tazas" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Batido de mora",
        baseIngredientsText: "moras y leche",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Moras lavadas", amount: 1, unit: "taza" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de durazno",
        baseIngredientsText: "durazno y yogur",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Duraznos maduros sin hueso", amount: 2, unit: "unidades" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Batido de arándanos",
        baseIngredientsText: "arándanos y leche",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Arándanos lavados", amount: 1, unit: "taza" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de pera",
        baseIngredientsText: "pera y yogur",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Peras maduras sin semillas", amount: 2, unit: "unidades" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Batido de melón",
        baseIngredientsText: "melón y leche",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Melón maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con avena", ingredient: { item: "Avena en hojuelas", amount: 2, unit: "cdas" } },
      { suffix: "con chía", ingredient: { item: "Semillas de chía", amount: 1, unit: "cdita" } },
      { suffix: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con coco rallado", ingredient: { item: "Coco rallado sin azúcar", amount: 1.5, unit: "cdas" } },
    ],
  },
  {
    category: "Licuados cremosos",
    prepMinutes: 8,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Licuado de banano",
        baseIngredientsText: "banano y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Banano maduro", amount: 1.5, unit: "unidades" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Licuado de fresa",
        baseIngredientsText: "fresas y leche",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Fresas limpias", amount: 1.5, unit: "tazas" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Licuado de chocolate",
        baseIngredientsText: "leche y cacao",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Cacao en polvo", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Licuado de vainilla",
        baseIngredientsText: "leche y vainilla",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Licuado de mango",
        baseIngredientsText: "mango y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Licuado de galleta",
        baseIngredientsText: "leche y galletas sencillas",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Galletas sencillas", amount: 4, unit: "unidades" },
        ],
      },
      {
        name: "Licuado de coco",
        baseIngredientsText: "leche y leche de coco",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Leche fría", amount: 1, unit: "taza" },
          { item: "Leche de coco", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Licuado de durazno",
        baseIngredientsText: "duraznos y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Duraznos maduros sin hueso", amount: 2, unit: "unidades" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Licuado de café descafeinado",
        baseIngredientsText: "leche y café descafeinado frío",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
          { item: "Café descafeinado frío", amount: 0.5, unit: "taza" },
        ],
      },
      {
        name: "Licuado de canela",
        baseIngredientsText: "leche y canela",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
    ],
    variations: [
      { suffix: "con avena", ingredient: { item: "Avena suave", amount: 2, unit: "cdas" } },
      { suffix: "con fresas", ingredient: { item: "Fresas frescas", amount: 0.5, unit: "taza" } },
      { suffix: "con banano", ingredient: { item: "Banano en rodajas", amount: 0.5, unit: "unidad" } },
      { suffix: "con cacao", ingredient: { item: "Cacao puro en polvo", amount: 1, unit: "cda" } },
      { suffix: "con hielo triturado", ingredient: { item: "Hielo triturado", amount: 0.75, unit: "taza" } },
    ],
  },
  {
    category: "Tés e infusiones sin cafeína",
    prepMinutes: 10,
    difficulty: "Principiante",
    isHot: true,
    bases: [
      {
        name: "Infusión de manzanilla",
        baseIngredientsText: "flores de manzanilla y agua caliente",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Flores secas de manzanilla", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de menta",
        baseIngredientsText: "hojas de menta y agua caliente",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Hojas frescas de menta", amount: 8, unit: "hojas" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de jengibre",
        baseIngredientsText: "jengibre fresco y agua",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Rodajas finas de jengibre fresco", amount: 4, unit: "láminas" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de canela",
        baseIngredientsText: "rama de canela y agua",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Rama de canela", amount: 1, unit: "unidad" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de hierbaluisa",
        baseIngredientsText: "hierbaluisa y agua caliente",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Hojas de hierbaluisa", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de hibisco",
        baseIngredientsText: "flor de hibisco y agua",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Flores secas de hibisco", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de rooibos",
        baseIngredientsText: "rooibos y agua caliente",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Hebras o bolsita de rooibos", amount: 1, unit: "cda" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de lavanda",
        baseIngredientsText: "lavanda culinaria y agua",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Flores de lavanda culinaria", amount: 1, unit: "cdita" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de anís",
        baseIngredientsText: "anís y agua caliente",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Semillas o estrella de anís", amount: 1, unit: "cdita" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Infusión de limón",
        baseIngredientsText: "cáscara de limón y agua",
        image: "/assets/beverages/infusion_caliente.svg",
        ingredients: [
          { item: "Tiras limpias de cáscara de limón", amount: 3, unit: "tiras" },
          { item: "Agua caliente", amount: 2, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con miel", ingredient: { item: "Miel de abeja", amount: 1, unit: "cdita" } },
      { suffix: "con limón", ingredient: { item: "Rodaja y gotas de limón", amount: 1, unit: "rodaja" } },
      { suffix: "con naranja", ingredient: { item: "Rodaja de naranja lavada", amount: 1, unit: "rodaja" } },
      { suffix: "con manzana", ingredient: { item: "Trocitos de manzana", amount: 0.25, unit: "taza" } },
      { suffix: "con canela", ingredient: { item: "Pizca o ramita de canela", amount: 1, unit: "pizca" } },
    ],
  },
  {
    category: "Bebidas de cacao y leche",
    prepMinutes: 10,
    difficulty: "Básico",
    isHot: true,
    bases: [
      {
        name: "Leche con cacao",
        baseIngredientsText: "leche y cacao sin azúcar",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cacao puro sin azúcar", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Chocolate caliente",
        baseIngredientsText: "leche y chocolate",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Chocolate troceado", amount: 40, unit: "g" },
        ],
      },
      {
        name: "Leche de vainilla",
        baseIngredientsText: "leche y extracto de vainilla",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Leche con canela",
        baseIngredientsText: "leche y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Canela en rama o molida", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Leche con fresa",
        baseIngredientsText: "leche y fresas",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Fresas frescas machacadas", amount: 0.5, unit: "taza" },
        ],
      },
      {
        name: "Leche con miel",
        baseIngredientsText: "leche y un poco de miel",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Miel suave", amount: 1, unit: "cda" },
        ],
      },
      {
        name: "Cacao frío",
        baseIngredientsText: "leche fría y cacao",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Leche fría", amount: 2, unit: "tazas" },
          { item: "Cacao en polvo", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Chocolate blanco caliente",
        baseIngredientsText: "leche y chocolate blanco",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Chocolate blanco troceado", amount: 35, unit: "g" },
        ],
      },
      {
        name: "Leche dorada suave",
        baseIngredientsText: "leche, cúrcuma culinaria y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cúrcuma culinaria", amount: 0.25, unit: "cdita" },
          { item: "Canela molida", amount: 0.25, unit: "cdita" },
        ],
      },
      {
        name: "Leche de coco especiada",
        baseIngredientsText: "bebida de coco y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Bebida de coco", amount: 2, unit: "tazas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
    ],
    variations: [
      { suffix: "con una pizca de nuez moscada", ingredient: { item: "Nuez moscada molida", amount: 1, unit: "pizca" } },
      { suffix: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con canela extra", ingredient: { item: "Canela molida extra", amount: 0.5, unit: "cdita" } },
      { suffix: "fría con hielo", ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" } },
      { suffix: "con espuma de leche", ingredient: { item: "Leche batida en espuma", amount: 0.25, unit: "taza" } },
    ],
  },
  {
    category: "Bebidas con gas y mocktails",
    prepMinutes: 7,
    difficulty: "Principiante",
    isSparkling: true,
    bases: [
      {
        name: "Limonada con gas",
        baseIngredientsText: "limón, agua con gas y hielo",
        image: "/assets/beverages/mocktail_gas.svg",
        ingredients: [
          { item: "Jugo de limón fresco", amount: 3, unit: "cdas" },
          { item: "Agua con gas fría", amount: 2, unit: "tazas" },
          { item: "Hielo", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Naranjada con gas",
        baseIngredientsText: "naranja y agua con gas",
        image: "/assets/beverages/jugo_natural.svg",
        ingredients: [
          { item: "Jugo de naranja natural", amount: 1, unit: "taza" },
          { item: "Agua con gas fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Mojito sin alcohol",
        baseIngredientsText: "lima, menta, agua con gas y hielo",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Jugo de lima fresca", amount: 2, unit: "cdas" },
          { item: "Hojas de menta", amount: 6, unit: "hojas" },
          { item: "Agua con gas y hielo", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Spritz de naranja sin alcohol",
        baseIngredientsText: "naranja y agua con gas",
        image: "/assets/beverages/mocktail_gas.svg",
        ingredients: [
          { item: "Jugo de naranja fresca", amount: 0.75, unit: "taza" },
          { item: "Agua con gas fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Soda de fresa",
        baseIngredientsText: "fresas machacadas y agua con gas",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Fresas maduras machacadas", amount: 0.5, unit: "taza" },
          { item: "Agua con gas fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Soda de mora",
        baseIngredientsText: "moras y agua con gas",
        image: "/assets/beverages/mocktail_gas.svg",
        ingredients: [
          { item: "Moras frescas machacadas", amount: 0.5, unit: "taza" },
          { item: "Agua con gas fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Soda de pepino",
        baseIngredientsText: "pepino, limón y agua con gas",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Pepino en láminas finas", amount: 0.5, unit: "taza" },
          { item: "Jugo de limón", amount: 2, unit: "cdas" },
          { item: "Agua con gas fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Soda de piña",
        baseIngredientsText: "piña y agua con gas",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Jugo o puré natural de piña", amount: 0.75, unit: "taza" },
          { item: "Agua con gas fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Soda de maracuyá",
        baseIngredientsText: "maracuyá y agua con gas",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Pulpa natural de maracuyá", amount: 3, unit: "cdas" },
          { item: "Agua con gas fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Ponche cítrico",
        baseIngredientsText: "naranja, limón y agua con gas",
        image: "/assets/beverages/mocktail_gas.svg",
        ingredients: [
          { item: "Jugo de naranja", amount: 0.75, unit: "taza" },
          { item: "Jugo de limón", amount: 2, unit: "cdas" },
          { item: "Agua con gas fría", amount: 1.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con hojas de menta", ingredient: { item: "Hojas frescas de menta", amount: 6, unit: "hojas" } },
      { suffix: "con rodajas de limón", ingredient: { item: "Rodajas de limón lavado", amount: 3, unit: "rodajas" } },
      { suffix: "con hielo picado", ingredient: { item: "Hielo picado", amount: 1, unit: "taza" } },
      { suffix: "con romero", ingredient: { item: "Ramita de romero fresco", amount: 1, unit: "ramita" } },
      { suffix: "con frutos rojos", ingredient: { item: "Frutos rojos frescos", amount: 0.25, unit: "taza" } },
    ],
  },
  {
    category: "Bebidas tropicales",
    prepMinutes: 10,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Piña colada sin alcohol",
        baseIngredientsText: "piña y leche de coco",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Piña fresca en cubos", amount: 1.5, unit: "tazas" },
          { item: "Leche de coco", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Limonada de coco",
        baseIngredientsText: "limón, leche de coco y agua",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Jugo de limón", amount: 3, unit: "cdas" },
          { item: "Leche de coco", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Agua de coco con piña",
        baseIngredientsText: "agua de coco y piña",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Agua natural de coco", amount: 1.5, unit: "tazas" },
          { item: "Piña fresca en trozos", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Refresco de guanábana",
        baseIngredientsText: "guanábana y agua",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Pulpa de guanábana sin semillas", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Batido de guanábana",
        baseIngredientsText: "guanábana y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Pulpa de guanábana sin semillas", amount: 1, unit: "taza" },
          { item: "Leche fría", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Jugo de cas",
        baseIngredientsText: "pulpa de cas y agua",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Pulpa de cas", amount: 0.75, unit: "taza" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
        ],
      },
      {
        name: "Refresco de nance",
        baseIngredientsText: "nance y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Fruta de nance madura", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 2.5, unit: "tazas" },
        ],
      },
      {
        name: "Jugo de carambola",
        baseIngredientsText: "carambola y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Carambola madura en trozos", amount: 2, unit: "unidades" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Batido de coco y mango",
        baseIngredientsText: "mango y leche de coco",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        ingredients: [
          { item: "Mango maduro en cubos", amount: 1.5, unit: "tazas" },
          { item: "Leche de coco", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Refresco de pitahaya",
        baseIngredientsText: "pitahaya y agua",
        image: "/assets/beverages/agua_fresca_roja.svg",
        ingredients: [
          { item: "Pulpa de pitahaya", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con limón", ingredient: { item: "Jugo de limón", amount: 1, unit: "cda" } },
      { suffix: "con hierbabuena", ingredient: { item: "Hojas de hierbabuena", amount: 4, unit: "hojas" } },
      { suffix: "con hielo", ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" } },
      { suffix: "con naranja", ingredient: { item: "Jugo o rodaja de naranja", amount: 0.5, unit: "unidad" } },
      { suffix: "con un toque de jengibre", ingredient: { item: "Jengibre fresco rallado", amount: 0.5, unit: "cdita" } },
    ],
  },
  {
    category: "Bebidas nutritivas",
    prepMinutes: 10,
    difficulty: "Principiante",
    requiresBlender: true,
    bases: [
      {
        name: "Licuado de avena",
        baseIngredientsText: "avena y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Avena en hojuelas", amount: 0.5, unit: "taza" },
          { item: "Leche o bebida vegetal", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Batido de yogur",
        baseIngredientsText: "yogur natural y fruta",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Yogur natural", amount: 1, unit: "taza" },
          { item: "Fruta fresca picada", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Bebida de chía y limón",
        baseIngredientsText: "chía hidratada, limón y agua",
        image: "/assets/beverages/agua_fresca_verde.svg",
        ingredients: [
          { item: "Semillas de chía hidratadas", amount: 1.5, unit: "cdas" },
          { item: "Jugo de limón", amount: 2, unit: "cdas" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Licuado de manzana y avena",
        baseIngredientsText: "manzana, avena y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Manzana picada", amount: 1, unit: "unidad" },
          { item: "Avena", amount: 3, unit: "cdas" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Batido de banano y avena",
        baseIngredientsText: "banano, avena y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Banano maduro", amount: 1, unit: "unidad" },
          { item: "Avena", amount: 3, unit: "cdas" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
      {
        name: "Bebida de almendras",
        baseIngredientsText: "almendras remojadas y agua",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Almendras remojadas y peladas", amount: 0.5, unit: "taza" },
          { item: "Agua filtrada", amount: 2.5, unit: "tazas" },
        ],
      },
      {
        name: "Bebida de arroz",
        baseIngredientsText: "arroz cocido, agua y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        ingredients: [
          { item: "Arroz blanco cocido", amount: 0.75, unit: "taza" },
          { item: "Agua", amount: 2.5, unit: "tazas" },
          { item: "Canela", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Licuado de dátiles",
        baseIngredientsText: "dátiles sin semilla y leche",
        image: "/assets/beverages/licuado_cremoso.svg",
        ingredients: [
          { item: "Dátiles sin semilla", amount: 3, unit: "unidades" },
          { item: "Leche", amount: 2, unit: "tazas" },
        ],
      },
      {
        name: "Batido de frutos rojos",
        baseIngredientsText: "frutos rojos y yogur",
        image: "/assets/beverages/batido_frutas.svg",
        ingredients: [
          { item: "Frutos rojos variados", amount: 1, unit: "taza" },
          { item: "Yogur natural", amount: 1, unit: "taza" },
        ],
      },
      {
        name: "Licuado de cacao y avena",
        baseIngredientsText: "cacao, avena y leche",
        image: "/assets/beverages/cacao_leche.svg",
        ingredients: [
          { item: "Cacao sin azúcar", amount: 1, unit: "cda" },
          { item: "Avena", amount: 3, unit: "cdas" },
          { item: "Leche", amount: 1.5, unit: "tazas" },
        ],
      },
    ],
    variations: [
      { suffix: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con fresas", ingredient: { item: "Fresas frescas", amount: 0.5, unit: "taza" } },
      { suffix: "con banano", ingredient: { item: "Banano en rodajas", amount: 0.5, unit: "unidad" } },
      {
        suffix: "con una cucharadita de semillas",
        ingredient: { item: "Semillas (chía, linaza o ajonjolí)", amount: 1, unit: "cdita" },
      },
    ],
  },
  {
    category: "Bebidas del mundo",
    prepMinutes: 12,
    difficulty: "Básico",
    requiresBlender: true,
    bases: [
      {
        name: "Lassi de mango",
        baseIngredientsText: "yogur, mango y agua",
        image: "/assets/beverages/agua_fresca_dorada.svg",
        originHint: "India",
        ingredients: [
          { item: "Yogur natural", amount: 1, unit: "taza" },
          { item: "Mango maduro en cubos", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 0.5, unit: "taza" },
        ],
      },
      {
        name: "Lassi de fresa",
        baseIngredientsText: "yogur, fresas y agua",
        image: "/assets/beverages/batido_frutas.svg",
        originHint: "India",
        ingredients: [
          { item: "Yogur natural", amount: 1, unit: "taza" },
          { item: "Fresas limpias", amount: 1, unit: "taza" },
          { item: "Agua fría", amount: 0.5, unit: "taza" },
        ],
      },
      {
        name: "Horchata de arroz",
        baseIngredientsText: "arroz, agua y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        originHint: "México / España",
        ingredients: [
          { item: "Arroz remojado", amount: 0.5, unit: "taza" },
          { item: "Agua fresca", amount: 3, unit: "tazas" },
          { item: "Canela", amount: 1, unit: "rama" },
        ],
      },
      {
        name: "Agua de cebada",
        baseIngredientsText: "cebada cocida y agua",
        image: "/assets/beverages/bebida_mundo.svg",
        originHint: "Latinoamérica",
        ingredients: [
          { item: "Cebada cocida", amount: 0.5, unit: "taza" },
          { item: "Agua fría", amount: 3, unit: "tazas" },
        ],
      },
      {
        name: "Atole de vainilla",
        baseIngredientsText: "masa de maíz, leche y vainilla",
        image: "/assets/beverages/licuado_cremoso.svg",
        originHint: "México",
        ingredients: [
          { item: "Masa o fécula de maíz", amount: 2, unit: "cdas" },
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Extracto de vainilla", amount: 1, unit: "cdita" },
        ],
      },
      {
        name: "Atole de chocolate",
        baseIngredientsText: "masa de maíz, leche y cacao",
        image: "/assets/beverages/cacao_leche.svg",
        originHint: "México",
        ingredients: [
          { item: "Masa o fécula de maíz", amount: 2, unit: "cdas" },
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Cacao en polvo", amount: 1.5, unit: "cdas" },
        ],
      },
      {
        name: "Chicha de arroz sin fermentar",
        baseIngredientsText: "arroz cocido, leche y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        originHint: "Centroamérica y Sudamérica",
        ingredients: [
          { item: "Arroz cocido muy suave", amount: 0.75, unit: "taza" },
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Canela molida", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Sahlab suave",
        baseIngredientsText: "leche, almidón y canela",
        image: "/assets/beverages/bebida_mundo.svg",
        originHint: "Medio Oriente",
        ingredients: [
          { item: "Leche", amount: 2, unit: "tazas" },
          { item: "Almidón de maíz", amount: 1.5, unit: "cdas" },
          { item: "Canela", amount: 0.5, unit: "cdita" },
        ],
      },
      {
        name: "Limonada brasileña sin alcohol",
        baseIngredientsText: "limas, agua y leche condensada",
        image: "/assets/beverages/agua_fresca_verde.svg",
        originHint: "Brasil",
        ingredients: [
          { item: "Limas frescas lavadas", amount: 2, unit: "unidades" },
          { item: "Agua fría", amount: 2, unit: "tazas" },
          { item: "Leche condensada", amount: 2, unit: "cdas" },
        ],
      },
      {
        name: "Té helado de frutas sin cafeína",
        baseIngredientsText: "infusión frutal fría y fruta",
        image: "/assets/beverages/mocktail_gas.svg",
        originHint: "Internacional",
        ingredients: [
          { item: "Infusión frutal sin cafeína fría", amount: 2, unit: "tazas" },
          { item: "Fruta fresca picada", amount: 0.5, unit: "taza" },
        ],
      },
    ],
    variations: [
      { suffix: "con canela", ingredient: { item: "Canela molida", amount: 0.5, unit: "cdita" } },
      { suffix: "con vainilla", ingredient: { item: "Extracto de vainilla", amount: 0.5, unit: "cdita" } },
      { suffix: "con hielo", ingredient: { item: "Cubos de hielo", amount: 1, unit: "taza" } },
      { suffix: "con ralladura de limón", ingredient: { item: "Ralladura fina de limón", amount: 0.5, unit: "cdita" } },
      { suffix: "con fruta picada", ingredient: { item: "Fruta fresca picada", amount: 0.35, unit: "taza" } },
    ],
  },
];

function detectBeverageAllergens(text: string): string[] {
  const lower = text.toLowerCase();
  const allergens: string[] = [];
  if (/(leche|yogur|chocolate blanco)/.test(lower) && !/leche de coco/.test(lower.replace(/leche y leche de coco/, ""))) {
    allergens.push("Lácteos");
  } else if (/leche condensada/.test(lower)) {
    allergens.push("Lácteos");
  }
  if (/galleta/.test(lower)) {
    allergens.push("Gluten (trigo)");
  }
  if (/almendra/.test(lower)) {
    allergens.push("Frutos secos (almendras)");
  }
  return allergens.length > 0 ? allergens : ["Libre de alérgenos comunes"];
}

function buildBeverageInstructions(
  spec: BeverageCategorySpec,
  base: BeverageBaseSpec,
  variationText: string,
  title: string
): string[] {
  const isWarmDrink =
    Boolean(spec.isHot) ||
    ((/atole|sahlab/.test(base.name.toLowerCase())) && !variationText.includes("hielo"));

  if (spec.isSparkling) {
    return [
      `Lávate las manos 20 segundos y lava muy bien las frutas o hierbas frescas bajo agua limpia.`,
      `Prepara ${base.name.toLowerCase()} colocando los ingredientes de fruta y cítricos en una jarra o vaso grande, junto con ${variationText.replace(/^con\s+/i, "")}.`,
      `Agrega suavemente el agua con gas bien fría para conservar las burbujas y mezcla despacio con cuchara larga.`,
      `Sirve con hielo si lo deseas y disfruta bien frío al momento.`,
    ];
  }

  if (isWarmDrink) {
    return [
      `Lávate las manos y prepara tus ingredientes medidos sobre la mesa (${base.baseIngredientsText}, ${variationText}).`,
      `Con ayuda de un adulto para manejar agua caliente o la estufa, calienta el líquido a fuego suave o en tetera hasta que esté bien tibio o empiece a soltar vapor.`,
      `Disuelve o infusiona los ingredientes durante 4 a 6 minutos, mezclando suavemente (o colando las flores/ramas antes de servir).`,
      `Vierte en una taza resistente al calor, espera 2 minutos a que entibie para evitar quemaduras y disfruta.`,
    ];
  }

  if (spec.requiresBlender) {
    return [
      `Lávate las manos 20 segundos y lava y desinfecta muy bien las frutas o hierbas frescas.`,
      `Si alguna fruta necesita pelarse o cortarse, pide ayuda de un adulto para usar el cuchillo sobre una tabla limpia.`,
      `Coloca en la licuadora ${base.baseIngredientsText} junto con ${variationText.replace(/^con\s+/i, "")}. Pide supervisión adulta para tapar bien y licuar hasta lograr una mezcla suave.`,
      `Prueba una cucharadita para ajustar al gusto, cuela si prefieres una textura más ligera y sirve frío en vasos.`,
    ];
  }

  return [
    `Lávate las manos y lava bien las frutas o hierbas frescas.`,
    `Combina en un vaso o jarra ${base.baseIngredientsText} junto con ${variationText.replace(/^con\s+/i, "")}.`,
    `Mezcla suavemente hasta integrar los sabores y sirve frío.`,
  ];
}

function buildBeverageChefTip(spec: BeverageCategorySpec, base: BeverageBaseSpec): string {
  switch (spec.category) {
    case "Aguas frescas":
      return "Si la fruta está bien madura, aporta dulzor natural y casi no necesitas añadir endulzantes extra.";
    case "Jugos naturales":
      return "Prepara tu jugo justo antes de tomarlo para aprovechar todo su color, aroma y frescura natural.";
    case "Batidos de frutas":
      return "Congelar trocitos de fruta madura antes de licuar hace que el batido quede súper cremoso sin aguarse.";
    case "Licuados cremosos":
      return "Licúa primero los ingredientes sólidos con un poquito de líquido y luego agrega el resto para evitar grumos.";
    case "Tés e infusiones sin cafeína":
      return "Tapa la taza durante los 5 minutos de reposo para que los aromas naturales queden concentrados en la infusión.";
    case "Bebidas de cacao y leche":
      return "Disuelve primero el cacao en un chorrito de leche tibia formando una pasta suave antes de mezclar todo.";
    case "Bebidas con gas y mocktails":
      return "Vierte el agua con gas al final inclinando un poco el vaso para que no se escapen las burbujas.";
    case "Bebidas tropicales":
      return "Enfría previamente la leche o agua de coco en el refrigerador para lograr una bebida tropical más refrescante.";
    case "Bebidas nutritivas":
      return "Si usas chía o avena, dejarlas hidratar unos 10 minutos en el líquido vuelve la textura mucho más sedosa.";
    case "Bebidas del mundo":
      return base.originHint
        ? `Bebida inspirada en la tradición de ${base.originHint}. Ajusta la textura o dulzor natural poco a poco.`
        : "Sirve con una pizca ligera de canela o ralladura cítrica al final para realzar el aroma.";
  }
}

function resolveRealisticBeveragePhoto(
  category: string,
  baseName: string,
  variationSuffix: string,
  fallbackSvg: string
): string {
  const name = baseName.toLowerCase();
  const varLower = variationSuffix.toLowerCase();

  if (category === "Tés e infusiones sin cafeína") {
    if (name.includes("hibisco")) return BEVERAGE_PHOTO.aguaRoja;
    return BEVERAGE_PHOTO.infusionCaliente;
  }
  if (category === "Bebidas con gas y mocktails") {
    if (name.includes("naranjada") || name.includes("maracuyá") || name.includes("piña")) {
      return varLower.includes("frutos rojos") ? BEVERAGE_PHOTO.sodaItaliana : BEVERAGE_PHOTO.jugoDorado;
    }
    if (name.includes("mojito") || name.includes("pepino")) {
      return varLower.includes("frutos rojos") ? BEVERAGE_PHOTO.sodaItaliana : BEVERAGE_PHOTO.aguaLimon;
    }
    if (name.includes("fresa")) return BEVERAGE_PHOTO.aguaRoja;
    return BEVERAGE_PHOTO.sodaItaliana;
  }
  if (category === "Bebidas de cacao y leche") {
    if (name.includes("cacao frío")) return BEVERAGE_PHOTO.frappeCrema;
    if (name.includes("chocolate blanco") || name.includes("vainilla") || name.includes("miel")) {
      return BEVERAGE_PHOTO.chocolateBlanco;
    }
    if (name.includes("dorada") || name.includes("coco") || name.includes("canela")) {
      return BEVERAGE_PHOTO.chaiLatte;
    }
    if (name.includes("fresa")) return BEVERAGE_PHOTO.batidoFrutos;
    return varLower.includes("hielo") ? BEVERAGE_PHOTO.frappeCrema : BEVERAGE_PHOTO.chocolateCaliente;
  }
  if (category === "Bebidas del mundo") {
    if (name.includes("lassi de mango")) return BEVERAGE_PHOTO.mangoLassi;
    if (name.includes("lassi de fresa")) return BEVERAGE_PHOTO.batidoFrutos;
    if (name.includes("atole de chocolate")) {
      return varLower.includes("hielo") ? BEVERAGE_PHOTO.frappeCrema : BEVERAGE_PHOTO.chocolateCaliente;
    }
    if (name.includes("atole de vainilla")) {
      return varLower.includes("hielo") ? BEVERAGE_PHOTO.licuadoCremoso : BEVERAGE_PHOTO.chocolateBlanco;
    }
    if (name.includes("limonada brasileña")) return BEVERAGE_PHOTO.aguaLimon;
    if (name.includes("té helado")) return BEVERAGE_PHOTO.sodaItaliana;
    return BEVERAGE_PHOTO.licuadoCremoso;
  }
  if (category === "Aguas frescas") {
    if (name.includes("sandía") || name.includes("fresa") || name.includes("jamaica") || name.includes("guayaba")) {
      return BEVERAGE_PHOTO.aguaRoja;
    }
    if (name.includes("pepino")) return BEVERAGE_PHOTO.aguaLimon;
    if (name.includes("tamarindo")) return BEVERAGE_PHOTO.poncheSidra;
    return BEVERAGE_PHOTO.jugoDorado;
  }
  if (category === "Jugos naturales") {
    if (name.includes("sandía") || name.includes("guayaba")) return BEVERAGE_PHOTO.aguaRoja;
    if (name.includes("pera")) return BEVERAGE_PHOTO.aguaLimon;
    return BEVERAGE_PHOTO.jugoDorado;
  }
  if (category === "Batidos de frutas") {
    if (name.includes("mango") || name.includes("piña")) return BEVERAGE_PHOTO.mangoLassi;
    if (name.includes("banano") || name.includes("pera")) return BEVERAGE_PHOTO.licuadoCremoso;
    return BEVERAGE_PHOTO.batidoFrutos;
  }
  if (category === "Licuados cremosos") {
    if (name.includes("fresa")) return BEVERAGE_PHOTO.batidoFrutos;
    if (name.includes("chocolate") || name.includes("café")) return BEVERAGE_PHOTO.frappeCrema;
    if (name.includes("mango")) return BEVERAGE_PHOTO.mangoLassi;
    return BEVERAGE_PHOTO.licuadoCremoso;
  }
  if (category === "Bebidas tropicales") {
    if (name.includes("pitahaya")) return BEVERAGE_PHOTO.aguaRoja;
    if (name.includes("limonada de coco") || name.includes("cas")) return BEVERAGE_PHOTO.aguaLimon;
    if (name.includes("guanábana")) return BEVERAGE_PHOTO.licuadoCremoso;
    return BEVERAGE_PHOTO.jugoDorado;
  }
  if (category === "Bebidas nutritivas") {
    if (name.includes("chía y limón")) return BEVERAGE_PHOTO.aguaLimon;
    if (name.includes("frutos rojos") || name.includes("yogur")) return BEVERAGE_PHOTO.batidoFrutos;
    if (name.includes("cacao")) return BEVERAGE_PHOTO.frappeCrema;
    return BEVERAGE_PHOTO.licuadoCremoso;
  }
  if (fallbackSvg.includes("agua_fresca_roja")) return BEVERAGE_PHOTO.aguaRoja;
  if (fallbackSvg.includes("agua_fresca_verde")) return BEVERAGE_PHOTO.aguaLimon;
  if (fallbackSvg.includes("batido_frutas")) return BEVERAGE_PHOTO.batidoFrutos;
  if (fallbackSvg.includes("cacao_leche")) return BEVERAGE_PHOTO.chocolateCaliente;
  if (fallbackSvg.includes("infusion_caliente")) return BEVERAGE_PHOTO.infusionCaliente;
  if (fallbackSvg.includes("mocktail_gas")) return BEVERAGE_PHOTO.sodaItaliana;
  if (fallbackSvg.includes("licuado_cremoso")) return BEVERAGE_PHOTO.licuadoCremoso;
  return BEVERAGE_PHOTO.jugoDorado;
}

export const BEVERAGE_RECIPES: Recipe[] = (() => {
  const list: Recipe[] = [];
  let counter = 1;

  for (const spec of BEVERAGE_SPECS) {
    for (const base of spec.bases) {
      for (const variation of spec.variations) {
        const number = counter++;
        const title = `${base.name} ${variation.suffix}`;
        const combinedText = `${title} ${base.baseIngredientsText} ${variation.ingredient.item}`;
        const allergens = detectBeverageAllergens(combinedText);
        const isWarm =
          Boolean(spec.isHot) ||
          (/atole|sahlab/.test(base.name.toLowerCase()) && !variation.suffix.includes("hielo"));
        const requiresAdult = Boolean(spec.requiresBlender || isWarm);

        const utensils = isWarm
          ? ["Olla pequeña o tetera", "Cuchara o batidor", "Colador fino", "Taza resistente al calor"]
          : spec.isSparkling
            ? ["Jarra o vaso alto", "Cuchara larga", "Exprimidor de cítricos"]
            : ["Licuadora (con adulto)", "Tabla y cuchillo (con adulto)", "Jarra y vasos"];

        const safetyNote = isWarm
          ? "Lava bien las frutas/hierbas y pide ayuda adulta al calentar agua o leche en la estufa o tetera para evitar quemaduras."
          : spec.requiresBlender
            ? "Lava bien las frutas y pide ayuda adulta al usar cuchillos para cortar o al operar y tapar la licuadora."
            : "Lava bien las manos y todas las frutas o hierbas frescas antes de preparar la bebida.";

        list.push({
          id: `beb-${number}`,
          title,
          mealType: "Bebidas",
          category: "Bebidas",
          source: "bebidas",
          pdfNumber: number,
          country: spec.category,
          countryFlavors: base.originHint,
          family: spec.category,
          difficulty: spec.difficulty,
          prepTimeMinutes: spec.prepMinutes,
          servingsBase: 2,
          image: resolveRealisticBeveragePhoto(spec.category, base.name, variation.suffix, base.image),
          description: `Bebida sin alcohol de la colección "${spec.category}"${base.originHint ? ` (${base.originHint})` : ""}. Ingredientes base: ${base.baseIngredientsText}, ${variation.suffix}.`,
          ingredients: [...base.ingredients, variation.ingredient],
          utensils,
          instructions: buildBeverageInstructions(spec, base, variation.suffix, title),
          chefTip: buildBeverageChefTip(spec, base),
          allergens,
          requiresAdultSupervision: requiresAdult,
          safetyNote,
        });
      }
    }
  }

  return list;
})();
