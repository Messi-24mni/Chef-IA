export const BEVERAGE_PHOTO = {
  aguaRoja: "/src/assets/images/beb_agua_roja_1795218133220.jpg",
  aguaLimon: "/src/assets/images/beb_agua_limon_1795218133683.jpg",
  jugoDorado: "/src/assets/images/beb_jugo_dorado_1795218141939.jpg",
  jugoVerde: "/src/assets/images/beb_jugo_verde_1795218283379.jpg",
  batidoFrutos: "/src/assets/images/beb_batido_frutos_1795218283206.jpg",
  licuadoCremoso: "/src/assets/images/beb_licuado_cremoso_1795218142128.jpg",
  infusionCaliente: "/src/assets/images/beb_infusion_caliente_1795218142030.jpg",
  sodaItaliana: "/src/assets/images/beb_soda_italiana_1795218143077.jpg",
  mangoLassi: "/src/assets/images/beb_mango_lassi_1795218141899.jpg",
  espressoAmericano: "/src/assets/images/cafe_espresso_americano_1795218141925.jpg",
  latteArt: "/src/assets/images/cafe_latte_art_1795218142187.jpg",
  icedLatte: "/src/assets/images/cafe_iced_latte_1795218283584.jpg",
  chocolateCaliente: "/src/assets/images/cafe_chocolate_caliente_1795218284444.jpg",
  chocolateBlanco: "/src/assets/images/cafe_chocolate_blanco_1795218142624.jpg",
  matchaCaliente: "/src/assets/images/cafe_matcha_caliente_1795218142584.jpg",
  matchaFrio: "/src/assets/images/cafe_matcha_frio_1795218187716.jpg",
  chaiLatte: "/src/assets/images/cafe_chai_latte_1795218284775.jpg",
  frappeCrema: "/src/assets/images/cafe_frappe_crema_1795218142655.jpg",
  malteadaCremosa: "/src/assets/images/cafe_malteada_cremosa_1795218141465.jpg",
  poncheSidra: "/src/assets/images/cafe_ponche_sidra_1795218284530.jpg",
} as const;

export type BeveragePhotoKey = keyof typeof BEVERAGE_PHOTO;
