import type { MealType, Recipe } from "../types/academy";
import { getDishImageForText } from "./curriculum";
import { getOriginalDishTitle } from "./originalDishNames";
import { RECIPES } from "./recipes";
import { BEVERAGE_CATEGORIES, BEVERAGE_RECIPES } from "./beverageRecipes";
import { CAFETERIA_BEVERAGE_RECIPES, CAFETERIA_CATEGORIES } from "./cafeteriaBeverageRecipes";
import {
  buildYouthPdfChefTip,
  buildYouthPdfDescription,
  buildYouthPdfSteps,
} from "./youthRecipeGuide";
import rawInternational from "./international1000.json";

interface RawPdfRecipe {
  n: number;
  t: string;
  c: string;
  cf: string;
  f: string;
  m: MealType;
  d: "Principiante" | "Básico" | "Intermedio" | "Avanzado";
  min: number;
  a: boolean;
  sn: string;
  al: string[];
  u: string[];
  ing: Array<{ item: string; amount: number; unit: string }>;
  st: string[];
}

export const INTERNATIONAL_COUNTRIES = [
  "Italia",
  "México",
  "Japón",
  "China",
  "Estados Unidos",
  "Francia",
  "España",
  "Costa Rica",
  "Brasil",
  "India",
] as const;

export const INTERNATIONAL_RECIPES: Recipe[] = (rawInternational as RawPdfRecipe[]).map((r) => {
  const originalTitle = getOriginalDishTitle(r);
  return {
    id: `pdf-${r.n}`,
    title: originalTitle,
    mealType: r.m,
    category:
      r.m === "Desayuno"
        ? "Desayunos"
        : r.m === "Postre"
          ? "Repostería"
          : r.f === "Pastas y Fideos"
            ? "Pastas y Salsas"
            : r.f === "Ensaladas"
              ? "Saludable"
              : "Internacional",
    source: "pdf",
    pdfNumber: r.n,
    country: r.c,
    countryFlavors: r.cf,
    family: r.f,
    difficulty: r.d,
    prepTimeMinutes: r.min,
    servingsBase: 2,
    image: getDishImageForText(
      originalTitle,
      r.f,
      r.m,
      r.ing.map((i) => i.item).join(" ")
    ),
    description: buildYouthPdfDescription(r),
    ingredients: r.ing,
    utensils: r.u,
    instructions: buildYouthPdfSteps(r),
    chefTip: buildYouthPdfChefTip(r),
    allergens: r.al,
    requiresAdultSupervision: r.a,
    safetyNote: r.sn,
  };
});

export const CURATED_RECIPES: Recipe[] = RECIPES.map((r) => ({
  ...r,
  source: "academia" as const,
}));

export {
  BEVERAGE_CATEGORIES,
  BEVERAGE_RECIPES,
  CAFETERIA_BEVERAGE_RECIPES,
  CAFETERIA_CATEGORIES,
};

export const ALL_RECIPES: Recipe[] = [
  ...CURATED_RECIPES,
  ...INTERNATIONAL_RECIPES,
  ...BEVERAGE_RECIPES,
  ...CAFETERIA_BEVERAGE_RECIPES,
];
