import type { CourseLevel, Lesson, MealType } from "../types/academy";

export const IMAGES = {
  hero: "/src/assets/images/hero_chef_academy_1795117201912.jpg",
  nivel1: "/src/assets/images/course_principiante_basics_1795117201543.jpg",
  nivel2: "/src/assets/images/course_cocina_basica_1795117203429.jpg",
  nivel3: "/src/assets/images/course_cocina_intermedia_1795117202739.jpg",
  nivel4: "/src/assets/images/course_chef_avanzado_1795117202305.jpg",
};

export const DISH_IMAGES = {
  arroz: "/src/assets/images/dish_arroz_1795123289391.jpg",
  sopa: "/src/assets/images/dish_sopa_1795123289922.jpg",
  pasta: "/src/assets/images/dish_pasta_1795123290399.jpg",
  tortitas: "/src/assets/images/dish_tortitas_1795123291320.jpg",
  ensalada: "/src/assets/images/dish_ensalada_1795123291365.jpg",
  horneado: "/src/assets/images/dish_horneado_1795123291961.jpg",
  salteado: "/src/assets/images/dish_salteado_1795123292388.jpg",
  panqueques: "/src/assets/images/dish_panqueques_1795123292712.jpg",
  postreFruta: "/src/assets/images/dish_postre_fruta_1795123294888.jpg",
  guiso: "/src/assets/images/dish_guiso_1795123294784.jpg",
  desayunoHuevos: "/src/assets/images/dish_desayuno_huevos_1795123295812.jpg",
  pizzaMargarita: "/src/assets/images/dish_pizza_tacos_1795123295467.jpg",
  pizzaTacos: "/src/assets/images/dish_pizza_tacos_1795123295467.jpg",
  tacosPollo: "/src/assets/images/dish_tacos_pollo_1795135303514.jpg",
  hamburguesa: "/src/assets/images/dish_hamburguesa_1795135303969.jpg",
  salmonCitrico: "/src/assets/images/dish_salmon_citrico_1795135304970.jpg",
  polloLimon: "/src/assets/images/dish_pollo_limon_1795135304444.jpg",
  cookiesChispas: "/src/assets/images/dish_cookies_chispas_1795135305217.jpg",
  browniesCacao: "/src/assets/images/dish_brownies_cacao_1795135305309.jpg",
  omeletteHierbas: "/src/assets/images/dish_omelette_hierbas_1795135305691.jpg",
  avocadoToastPoche: "/src/assets/images/dish_avocado_toast_poche_1795135311295.jpg",
  pastaPesto: "/src/assets/images/dish_pasta_pesto_1795135311321.jpg",
  macAndCheese: "/src/assets/images/dish_mac_and_cheese_1795135311259.jpg",
  lasanaBolonesa: "/src/assets/images/dish_lasana_bolonesa_1795135312026.jpg",
  fileteResPapas: "/src/assets/images/dish_filete_res_papas_1795135310928.jpg",
  albondigasTomate: "/src/assets/images/dish_albondigas_tomate_1795135311709.jpg",
  risottoChampinones: "/src/assets/images/dish_risotto_champinones_1795135311803.jpg",
  cevicheMango: "/src/assets/images/dish_ceviche_mango_1795135311070.jpg",
  curryGarbanzos: "/src/assets/images/dish_curry_garbanzos_1795135311658.jpg",
  muffinsArandanos: "/src/assets/images/dish_muffins_arandanos_1795135311434.jpg",
  donburiBowl: "/src/assets/images/dish_donburi_bowl_1795135311791.jpg",
  paellaEspanola: "/src/assets/images/dish_paella_espanola_1795135311709.jpg",
  crepesFrancesas: "/src/assets/images/dish_crepes_francesas_1795135311080.jpg",
} as const;

function matchDishKeywords(text: string): string | null {
  if (!text) return null;
  if (/muffin|cupcake|magdalena|panecillo/.test(text)) {
    return DISH_IMAGES.muffinsArandanos;
  }
  if (/brownie/.test(text)) {
    return DISH_IMAGES.browniesCacao;
  }
  if (/galleta|cookie/.test(text)) {
    return DISH_IMAGES.cookiesChispas;
  }
  if (/crepe|crêpe|crepa|crespelle|filloa|frisuelo|panqueca|dosa|jianbing/.test(text)) {
    return DISH_IMAGES.crepesFrancesas;
  }
  if (/panqueque|pancake|waffle|hot cake|hotcake|dorayaki|chorreada/.test(text)) {
    return DISH_IMAGES.panqueques;
  }
  if (/vasito|copa |postre|parfait|yogur|macedonia|biónico|kudamono|compote|kheer|fruit chaat|lassi|smoothie|helado|tigela|yangzhi/.test(text)) {
    return DISH_IMAGES.postreFruta;
  }
  if (/pizza/.test(text)) {
    return DISH_IMAGES.pizzaMargarita;
  }
  if (/taco|quesadilla|burrito|enchilada|chilaquil|fajita/.test(text)) {
    return DISH_IMAGES.tacosPollo;
  }
  if (/hamburguesa|burger/.test(text)) {
    return DISH_IMAGES.hamburguesa;
  }
  if (/lasagna|lasaña|pasta al forno|pasta gratinada|gratin de pâtes|pasta bake|baked cheese pasta/.test(text)) {
    return DISH_IMAGES.lasanaBolonesa;
  }
  if (/mac\s*&\s*cheese|macarrones con queso|macaroni/.test(text)) {
    return DISH_IMAGES.macAndCheese;
  }
  if (/pesto/.test(text)) {
    return DISH_IMAGES.pastaPesto;
  }
  if (/risotto/.test(text)) {
    return DISH_IMAGES.risottoChampinones;
  }
  if (/paella/.test(text)) {
    return DISH_IMAGES.paellaEspanola;
  }
  if (/donburi|poke|bowl de arroz|rice bowl/.test(text)) {
    return DISH_IMAGES.donburiBowl;
  }
  if (/ceviche/.test(text)) {
    return DISH_IMAGES.cevicheMango;
  }
  if (/albóndiga|albondiga|meatball/.test(text)) {
    return DISH_IMAGES.albondigasTomate;
  }
  if (/curry|chana masala|dal |rajma|masala|tadka/.test(text)) {
    return DISH_IMAGES.curryGarbanzos;
  }
  if (/avocado toast|aguacate.*huevo|huevo poché|eggs benedict|tostada.*aguacate/.test(text)) {
    return DISH_IMAGES.avocadoToastPoche;
  }
  if (/omelette|tortilla francesa|frittata/.test(text)) {
    return DISH_IMAGES.omeletteHierbas;
  }
  if (/tortita|medall|buñuelo|bocado|frittelle|polpettine|gordita|sope|tlacoyo|okonomiyaki|korokke|galette|croqueta|bolinho|tikki|pakora|cong you bing|hash|crocchette|tortilla española/.test(text)) {
    return DISH_IMAGES.tortitas;
  }
  if (/ensalada|insalata|sarada|sunomono|liangban|salad|salade|salpicão|vinagrete|kachumber|chaat|pico de gallo/.test(text)) {
    return DISH_IMAGES.ensalada;
  }
  if (/sopa|caldo|crema|minestrone|zuppa|vellutata|miso|suimono|tang|chowder|potage|velouté|shorba|rasam|canja|caldinho|geng/.test(text)) {
    return DISH_IMAGES.sopa;
  }
  if (/fideos salteados|salteado|wok|padellata|yasai itame|chao cai|poêlée|pisto|picadillo|refogado|moqueca|sabzi|skillet/.test(text)) {
    return DISH_IMAGES.salteado;
  }
  if (/pasta|espagueti|spaghetti|tagliatelle|penne|fettuccine|fusilli|macarron|fideo|udon|ramen|yakisoba|soba|chow mein|lo mein|fideuà|macarrão|sevai|talharim|pâtes|nouilles|noodle/.test(text)) {
    return DISH_IMAGES.pasta;
  }
  if (/arroz|gohan|chahan|chao fan|pilaf|riz |gallo pinto|baião|biryani|pulao|khichdi|congee|zhou|fan bowl|onigiri|galinhada/.test(text)) {
    return DISH_IMAGES.arroz;
  }
  if (/horno|horneado|bandeja|asada|asadas|forno|cazuela|shao kao|sheet pan|gratin|ratatouille|escalivada|escondidinho|tandoori|tian |assado|papas al horno|papas rústicas/.test(text)) {
    return DISH_IMAGES.horneado;
  }
  if (/guiso|estofado|potaje|legumbre|frijol|lenteja|garbanzo|nimono|shaguo|cassoulet|feijoada|chili|cocido|spezzatino|stufato|ragoût|mijoté/.test(text)) {
    return DISH_IMAGES.guiso;
  }
  if (/huevo|tostada|avena|desayuno|overnight|pan francés|sandwich|sándwich/.test(text)) {
    return DISH_IMAGES.desayunoHuevos;
  }
  if (/salmón|salmon|pescado|atún|trucha|tilapia|merluza/.test(text)) {
    return DISH_IMAGES.salmonCitrico;
  }
  if (/filete|res|bife|carne/.test(text)) {
    return DISH_IMAGES.fileteResPapas;
  }
  if (/pollo|pechuga|muslo/.test(text)) {
    return DISH_IMAGES.polloLimon;
  }
  return null;
}

export function getDishImageForText(
  title: string,
  family?: string,
  mealType?: MealType,
  ingredientsContext?: string
): string {
  const f = (family ?? "").toLowerCase();
  const t = title.toLowerCase();
  const baseDishPart = t.split(/\s+de\s+/i)[0]?.trim() || t;

  // When a known international family is provided, match exact dish styles within that family
  // so secondary ingredients (e.g., "Sopa de pollo" or "Arroz de pesto") never override the dish type.
  if (f) {
    if (f.includes("panqueque")) {
      if (/crepe|crêpe|crepa|crespelle|filloa|frisuelo|panqueca|dosa|jianbing/.test(baseDishPart)) {
        return DISH_IMAGES.crepesFrancesas;
      }
      return DISH_IMAGES.panqueques;
    }
    if (f.includes("postres de fruta")) {
      return DISH_IMAGES.postreFruta;
    }
    if (f.includes("tortitas")) {
      if (/taco|quesadilla|burrito/.test(baseDishPart)) return DISH_IMAGES.tacosPollo;
      return DISH_IMAGES.tortitas;
    }
    if (f.includes("ensalada")) {
      if (/ceviche/.test(baseDishPart)) return DISH_IMAGES.cevicheMango;
      return DISH_IMAGES.ensalada;
    }
    if (f.includes("sopas")) {
      return DISH_IMAGES.sopa;
    }
    if (f.includes("salteados")) {
      return DISH_IMAGES.salteado;
    }
    if (f.includes("pastas")) {
      if (/mac\s*&\s*cheese|macarrones con queso|macaroni/.test(baseDishPart)) {
        return DISH_IMAGES.macAndCheese;
      }
      if (/lasagna|lasaña|pasta al forno|pasta gratinada|gratin de pâtes|pasta bake|baked cheese pasta/.test(baseDishPart)) {
        return DISH_IMAGES.lasanaBolonesa;
      }
      if (/pesto/.test(baseDishPart)) {
        return DISH_IMAGES.pastaPesto;
      }
      return DISH_IMAGES.pasta;
    }
    if (f.includes("horno")) {
      return DISH_IMAGES.horneado;
    }
    if (f.includes("guisos")) {
      if (/curry|chana masala|dal |rajma|masala|tadka/.test(baseDishPart)) {
        return DISH_IMAGES.curryGarbanzos;
      }
      if (/albóndiga|albondiga|meatball/.test(baseDishPart)) {
        return DISH_IMAGES.albondigasTomate;
      }
      return DISH_IMAGES.guiso;
    }
    if (f.includes("arroz")) {
      if (/risotto/.test(baseDishPart)) return DISH_IMAGES.risottoChampinones;
      if (/paella/.test(baseDishPart)) return DISH_IMAGES.paellaEspanola;
      if (/donburi|rice bowl/.test(baseDishPart)) return DISH_IMAGES.donburiBowl;
      return DISH_IMAGES.arroz;
    }
  }

  const fromTitle = matchDishKeywords(t);
  if (fromTitle) return fromTitle;

  const fromContext = matchDishKeywords((ingredientsContext ?? "").toLowerCase());
  if (fromContext) return fromContext;

  if (mealType === "Desayuno") return DISH_IMAGES.desayunoHuevos;
  if (mealType === "Postre") return DISH_IMAGES.postreFruta;
  if (mealType === "Antojo") return DISH_IMAGES.tortitas;
  if (mealType === "Cena") return DISH_IMAGES.salteado;
  return DISH_IMAGES.arroz;
}

export const COURSE_LEVELS: CourseLevel[] = [
  {
    levelNumber: 1,
    title: "Nivel 1: Principiante",
    subtitle: "Fundamentos, higiene y primeras preparaciones",
    description:
      "Domina el entorno seguro de la cocina desde cero: utensilios esenciales, higiene alimentaria, manejo de ingredientes, huevos, arroz y ensaladas frescas.",
    requiredXp: 0,
    image: IMAGES.nivel1,
    certificateTitle: "Certificado en Fundamentos Culinarios y Cocina Segura",
    examPassScore: 4,
    examXpReward: 100,
    examQuestions: [
      {
        id: "ex1-q1",
        question: "¿Por qué debes usar tablas de cortar diferentes para carne cruda y vegetales listos para comer?",
        options: [
          "Para evitar que los cuchillos pierdan filo rápido",
          "Para prevenir la contaminación cruzada de bacterias",
          "Para que los vegetales tengan mejor color",
          "Porque las tablas de plástico no sirven para verduras",
        ],
        correctIndex: 1,
        explanation:
          "Separar carnes crudas de vegetales frescos evita transferir bacterias peligrosas como Salmonella hacia alimentos que no se cocinarán.",
      },
      {
        id: "ex1-q2",
        question: "¿Cuál es la posición segura de los dedos en la mano que sostiene el alimento al picar?",
        options: [
          "Dedos completamente estirados hacia la hoja",
          "Forma de garra con nudillos adelantados y yemas hacia adentro",
          "Sujetando solo con el pulgar por debajo",
          "Presionando con la palma plana",
        ],
        correctIndex: 1,
        explanation:
          "La postura de garra protege las yemas de los dedos haciendo que los nudillos guíen el costado del cuchillo bajo supervisión adulta.",
      },
      {
        id: "ex1-q3",
        question: "Al preparar arroz blanco tradicional, ¿cuál es la proporción estándar de agua por cada taza de arroz?",
        options: [
          "1 taza de agua por 1 de arroz",
          "2 tazas de agua por 1 de arroz",
          "4 tazas de agua por 1 de arroz",
          "Media taza de agua por 1 de arroz",
        ],
        correctIndex: 1,
        explanation:
          "La proporción clásica 2:1 permite que el grano absorba el líquido suficiente para quedar suelto y tierno tras reposar tapado.",
      },
      {
        id: "ex1-q4",
        question: "¿Qué debes hacer si notas que empieza a salir mucho humo del aceite en una sartén?",
        options: [
          "Echar agua fría inmediatamente para apagar el calor",
          "Retirar del fuego con cuidado y pedir ayuda a un adulto",
          "Subir la llama al máximo para terminar más rápido",
          "Tapar los ojos y seguir cocinando",
        ],
        correctIndex: 1,
        explanation:
          "Nunca eches agua sobre aceite caliente porque provoca salpicaduras violentas. Apaga la hornilla, retira la sartén con calma y pide apoyo a un adulto.",
      },
      {
        id: "ex1-q5",
        question: "¿Cuál es la proporción clásica de una vinagreta equilibrada para ensaladas?",
        options: [
          "3 partes de aceite por 1 parte de ácido (vinagre o limón)",
          "3 partes de vinagre por 1 parte de aceite",
          "Partes iguales de azúcar y sal",
          "Solo aceite sin ácido",
        ],
        correctIndex: 0,
        explanation:
          "La regla 3:1 equilibra la suavidad del aceite con la frescura ácida del vinagre o jugo de limón.",
      },
    ],
  },
  {
    levelNumber: 2,
    title: "Nivel 2: Cocina Básica",
    subtitle: "Salsas madre, pastas, sopas y proteínas",
    description:
      "Aprende a construir sabor real: cocción perfecta de pastas, salsas caseras, sopas nutritivas, sellado seguro de pollo, verduras y carnes.",
    requiredXp: 120,
    image: IMAGES.nivel2,
    certificateTitle: "Certificado en Cocina Básica y Técnicas de Cocción",
    examPassScore: 4,
    examXpReward: 130,
    examQuestions: [
      {
        id: "ex2-q1",
        question: "¿Qué significa cocinar la pasta 'al dente'?",
        options: [
          "Dejarla completamente blanda y sin forma",
          "Cocida por fuera pero con una ligera firmeza agradable en el centro",
          "Cocinarla sin agua ni sal",
          "Enjuagarla con agua helada al salir de la olla",
        ],
        correctIndex: 1,
        explanation:
          "Al dente ofrece mejor textura y permite que la pasta termine de integrarse con la salsa en la sartén.",
      },
      {
        id: "ex2-q2",
        question: "¿Por qué se guarda un poco del agua de cocción de la pasta antes de colarla?",
        options: [
          "Para limpiar los platos después",
          "Porque su almidón ayuda a emulsionar y ligar la salsa con la pasta",
          "Para enfriar la salsa rápidamente",
          "No tiene ningún uso culinario",
        ],
        correctIndex: 1,
        explanation:
          "El agua almidonada convierte una salsa suelta en una cobertura sedosa que se adhiere a cada pieza de pasta.",
      },
      {
        id: "ex2-q3",
        question: "¿Cuál es la temperatura interna mínima segura para asegurar que el pollo está bien cocido?",
        options: ["45 °C", "55 °C", "74 °C", "120 °C"],
        correctIndex: 2,
        explanation:
          "A 74 °C (165 °F) se eliminan bacterias como Salmonella, manteniendo la pechuga o muslo jugoso y seguro.",
      },
      {
        id: "ex2-q4",
        question: "¿Qué ingredientes forman la base clásica de una salsa bechamel?",
        options: [
          "Tomate, cebolla y albahaca",
          "Mantequilla, harina y leche tibia (roux blanco)",
          "Aceite, ajo y limón",
          "Yema de huevo y vinagre",
        ],
        correctIndex: 1,
        explanation:
          "La bechamel nace de cocinar partes iguales de mantequilla y harina (roux) antes de incorporar leche poco a poco sin grumos.",
      },
      {
        id: "ex2-q5",
        question: "¿Por qué se recomienda dejar reposar una carne sellada unos minutos antes de cortarla?",
        options: [
          "Para que se enfríe por completo",
          "Para que los jugos internos se redistribuyan y no se escapen en la tabla",
          "Para que se endurezca la corteza",
          "No hace ninguna diferencia",
        ],
        correctIndex: 1,
        explanation:
          "El reposo de 4 a 5 minutos permite que las fibras se relajen y retengan sus jugos naturales al cortar.",
      },
    ],
  },
  {
    levelNumber: 3,
    title: "Nivel 3: Cocina Intermedia",
    subtitle: "Masas, horneado, cocina italiana, mexicana y repostería",
    description:
      "Da el salto a platos icónicos con técnica precisa: pizza artesanal, hamburguesas jugosas, lasaña en capas, risotto, sabores mexicanos y repostería exacta.",
    requiredXp: 320,
    image: IMAGES.nivel3,
    certificateTitle: "Certificado en Gastronomía Intermedia y Horneado",
    examPassScore: 4,
    examXpReward: 160,
    examQuestions: [
      {
        id: "ex3-q1",
        question: "¿Por qué en repostería profesional se pesan los ingredientes en gramos en lugar de usar solo tazas?",
        options: [
          "Porque las tazas no sirven para líquidos",
          "Porque la harina compactada cambia de peso y altera la textura del postre",
          "Para tardar más tiempo en preparar la receta",
          "Solo por estética de la cocina",
        ],
        correctIndex: 1,
        explanation:
          "La repostería funciona como química exacta: pesar en gramos garantiza bizcochos esponjosos y galletas consistentes siempre.",
      },
      {
        id: "ex3-q2",
        question: "¿Qué precaución es indispensable al meter o sacar una bandeja de pizza o lasaña del horno caliente?",
        options: [
          "Usar una toalla húmeda delgada",
          "Usar guantes térmicos secos y pedir supervisión de un adulto",
          "Sacar la bandeja con un tenedor",
          "Abrir el horno y apoyar los brazos en la puerta",
        ],
        correctIndex: 1,
        explanation:
          "Los trapos húmedos conducen el calor rápidamente y queman; usa siempre guantes térmicos secos y pide ayuda a un adulto.",
      },
      {
        id: "ex3-q3",
        question: "¿Cuál es el secreto para que un risotto italiano quede cremoso sin añadir crema de leche?",
        options: [
          "Lavar el arroz Arborio bajo el grifo antes de cocinar",
          "Añadir caldo caliente poco a poco removiendo para liberar el almidón",
          "Hervirlo en abundante agua y colarlo",
          "Cocinarlo tapado sin moverlo nunca",
        ],
        correctIndex: 1,
        explanation:
          "El arroz de grano corto libera su almidón gradualmente gracias al movimiento y al caldo caliente agregado por cucharones.",
      },
      {
        id: "ex3-q4",
        question: "¿Qué diferencia aporta asar los tomates, cebolla y chile suave en comal para una salsa mexicana?",
        options: [
          "Los vuelve ácidos",
          "Carameliza sus azúcares naturales y suma un sabor ahumado profundo",
          "Elimina toda el agua en 10 segundos",
          "Solo cambia el color",
        ],
        correctIndex: 1,
        explanation:
          "El tostado en seco despierta notas dulces y tostadas imposibles de lograr con ingredientes hervidos.",
      },
      {
        id: "ex3-q5",
        question: "¿Qué ayuda a que una hamburguesa casera no se encoja ni se infle en el centro al cocinarla?",
        options: [
          "Aplastarla con fuerza con la espátula mientras se cocina",
          "Hacer una ligera hendidura con el pulgar en el centro de la carne cruda",
          "Añadir mucha agua a la mezcla",
          "Cocinarla congelada directamente",
        ],
        correctIndex: 1,
        explanation:
          "Presionar suavemente el centro antes de cocinar compensa la contracción de las fibras musculares por el calor.",
      },
    ],
  },
  {
    levelNumber: 4,
    title: "Nivel 4: Chef Avanzado",
    subtitle: "Emplatado, armonía de sabores y creación de autor",
    description:
      "Desarrolla criterio de chef profesional: organización de brigada, emplatado de restaurante, balance de cinco sabores, cocina internacional y diseño de tus propias recetas.",
    requiredXp: 580,
    image: IMAGES.nivel4,
    certificateTitle: "Diploma Superior de Chef Academy — Cocina Avanzada",
    examPassScore: 4,
    examXpReward: 220,
    examQuestions: [
      {
        id: "ex4-q1",
        question: "¿Qué significa aplicar 'Mise en Place' antes de encender el fuego?",
        options: [
          "Lavar los platos al día siguiente",
          "Tener todos los ingredientes pesados, cortados y utensilios listos en orden",
          "Servir el plato directamente en la olla",
          "Improvisar ingredientes mientras la sartén humea",
        ],
        correctIndex: 1,
        explanation:
          "Mise en Place ('todo en su lugar') evita errores de tiempos, quemaduras y desorden durante la cocción.",
      },
      {
        id: "ex4-q2",
        question: "Si una sopa o salsa te quedó ligeramente pesada o plana en sabor, ¿qué elemento suele 'despertar' todo el plato?",
        options: [
          "Más aceite crudo",
          "Un toque de acidez equilibrada (unas gotas de limón o vinagre)",
          "Más harina",
          "Hervirla 30 minutos más sin tapa",
        ],
        correctIndex: 1,
        explanation:
          "La acidez corta la sensación grasa y realza los aromas naturales sin necesidad de añadir exceso de sal.",
      },
      {
        id: "ex4-q3",
        question: "¿En qué consiste la 'regla de los impares' al emplatar como un chef?",
        options: [
          "Usar solo platos cuadrados",
          "Colocar elementos en grupos de 3 o 5 para lograr armonía visual natural",
          "Servir siempre porciones dobles",
          "Poner la salsa únicamente en el borde exterior",
        ],
        correctIndex: 1,
        explanation:
          "El ojo humano percibe las composiciones impares (3 piezas, 5 puntos de salsa) como más orgánicas, dinámicas y elegantes.",
      },
      {
        id: "ex4-q4",
        question: "¿Cuál de los cinco gustos básicos aporta sensación de profundidad sabrosa en tomates asados, hongos y parmesano?",
        options: ["Amargo", "Umami", "Ácido", "Dulce"],
        correctIndex: 1,
        explanation:
          "El umami proviene de aminoácidos naturales como el glutamato presente en tomates maduros, setas y quesos curados.",
      },
      {
        id: "ex4-q5",
        question: "Al crear tu propia receta original desde cero, ¿qué es lo más recomendable documentar?",
        options: [
          "Solo el nombre del plato",
          "Proporciones exactas, tiempos, temperatura, alérgenos y notas de seguridad",
          "Únicamente la foto final",
          "Solo los utensilios grandes",
        ],
        correctIndex: 1,
        explanation:
          "Una ficha técnica clara permite repetir el plato con éxito, adaptarlo por alergias y cocinarlo con seguridad.",
      },
    ],
  },
];

export const LESSONS: Lesson[] = [
  // ==================== NIVEL 1: PRINCIPIANTE (7 clases) ====================
  {
    id: "n1-utensilios",
    levelNumber: 1,
    order: 1,
    title: "Conocer los utensilios",
    durationMinutes: 10,
    xpReward: 60,
    image: IMAGES.nivel1,
    summary: "Identifica las herramientas esenciales de cocina y aprende para qué sirve cada una de forma segura.",
    simpleExplanation:
      "Cocinar bien empieza por elegir la herramienta correcta. No necesitas treinta aparatos: con una buena tabla estable, cucharas de madera, batidor de globo, báscula digital y sartenes básicas puedes preparar casi cualquier receta.",
    ingredients: [
      "1 trapo de cocina limpio y seco (para estabilizar la tabla)",
      "1 tomate o pepino de práctica (opcional para postura)",
    ],
    utensils: [
      "Tabla de cortar (madera o polietileno)",
      "Cuchillo pequeño de puntilla o cuchillo de chef (uso con adulto)",
      "Sartén antiadherente mediana",
      "Olla con tapa",
      "Batidor de globo, espátula de silicona y cuchara de madera",
      "Tazas medidoras y báscula digital",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Prepara tu estación estable",
        instruction:
          "Coloca un paño húmedo doblado o tapete antideslizante debajo de tu tabla de cortar para que nunca resbale mientras trabajas.",
      },
      {
        stepNumber: 2,
        title: "Diferencia los materiales",
        instruction:
          "Usa espátulas de silicona o cucharas de madera sobre sartenes antiadherentes; el metal raya el recubrimiento y arruina la sartén.",
      },
      {
        stepNumber: 3,
        title: "Medición líquida vs. seca",
        instruction:
          "Para líquidos usa jarras transparentes apoyadas en la mesa a la altura de tus ojos. Para ingredientes secos usa báscula o tazas niveladas.",
      },
      {
        stepNumber: 4,
        title: "Guarda cuchillos con seguridad",
        instruction:
          "Nunca dejes un cuchillo sumergido dentro del fregadero con espuma donde no se ve; lávalo aparte con supervisión y guárdalo seco en su lugar.",
        safetyReminder: "Los cuchillos afilados siempre requieren supervisión de un adulto para menores de edad.",
      },
    ],
    chefTips: [
      "Una sartén pesada distribuye mejor el calor y evita que la comida se queme en el centro.",
      "Ten siempre dos paños: uno seco para tomar mangos calientes y otro húmedo para limpiar la mesa.",
    ],
    commonMistakes: [
      "Cortar sobre platos de vidrio o mármol: dañan el filo del cuchillo y hacen que resbale.",
      "Dejar mangos de sartenes apuntando hacia afuera de la estufa donde alguien puede tropezar.",
    ],
    safetyTags: ["cuchillos", "higiene"],
    requiresAdultSupervision: true,
    safetyWarning:
      "Los cuchillos afilados deben manipularse siempre sobre tabla estable y bajo la supervisión de un adulto responsable.",
    allergensInfo: "Asegúrate de lavar completamente tablas y utensilios si en casa alguien tiene alergia alimentaria.",
    checkQuestions: [
      {
        id: "n1-u-q1",
        question: "¿Qué debes colocar debajo de la tabla de cortar si se mueve sobre la encimera?",
        options: [
          "Un plato llano",
          "Un paño ligeramente húmedo o base antideslizante",
          "Un poco de aceite",
        ],
        correctIndex: 1,
        explanation: "Un paño húmedo crea fricción inmediata y mantiene la tabla fija.",
      },
      {
        id: "n1-u-q2",
        question: "¿Por qué no se deben dejar cuchillos escondidos dentro del fregadero lleno de agua y jabón?",
        options: [
          "Porque pierden su color",
          "Porque alguien puede meter la mano sin verlos y cortarse",
          "Porque el agua tibia los dobla",
        ],
        correctIndex: 1,
        explanation: "Los cuchillos siempre deben lavarse por separado y colocarse a la vista para evitar accidentes.",
      },
    ],
  },
  {
    id: "n1-higiene",
    levelNumber: 1,
    order: 2,
    title: "Higiene alimentaria",
    durationMinutes: 12,
    xpReward: 65,
    image: IMAGES.hero,
    summary: "Aprende las reglas de oro para mantener tus platos seguros, limpios y libres de contaminación cruzada.",
    simpleExplanation:
      "Antes de encender cualquier fuego, un buen chef protege la salud de quienes van a comer. La higiene alimentaria evita intoxicaciones y hace que cocinar sea ordenado, limpio y profesional.",
    ingredients: [
      "Jabón líquido para manos",
      "Agua limpia",
      "Frutas o verduras para practicar el lavado",
    ],
    utensils: [
      "Delantal limpio",
      "Liga o gorro para recoger el cabello",
      "Dos tablas de distinto color (una para crudos, otra para vegetales)",
      "Toallas de papel o paños limpios",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Lavado de manos de 20 segundos",
        instruction:
          "Antes de tocar comida, lava manos, palmas, dorsos, entre dedos y uñas con agua y jabón durante al menos 20 segundos.",
        timerSeconds: 20,
      },
      {
        stepNumber: 2,
        title: "Cabello recogido y ropa segura",
        instruction:
          "Recoge el cabello largo, quita pulseras sueltas y usa mangas ajustadas para evitar que rocen alimentos o hornillas.",
      },
      {
        stepNumber: 3,
        title: "Cero contaminación cruzada",
        instruction:
          "Nunca pongas alimentos cocidos o ensaladas en el mismo plato o tabla donde estuvo carne o pollo crudo sin lavar antes con agua caliente y jabón.",
      },
      {
        stepNumber: 4,
        title: "Zona limpia mientras cocinas",
        instruction:
          "Usa un tazón grande en la mesa para cáscaras y residuos ('bol de desechos') así no caminas con manos sucias hasta la basura.",
      },
    ],
    chefTips: [
      "Lava frutas y verduras justo antes de usarlas, incluso si vas a pelarlas.",
      "Cambia la esponja o paño de cocina con frecuencia para que no acumule humedad.",
    ],
    commonMistakes: [
      "Lavar pollo crudo bajo el grifo: salpica gotas invisibles con bacterias por todo el fregadero.",
      "Probar la comida con la misma cuchara con la que revuelves y volverla a meter en la olla.",
    ],
    safetyTags: ["higiene", "alergias"],
    requiresAdultSupervision: false,
    safetyWarning:
      "Si usas productos desinfectantes de cocina, lee la etiqueta y manténlos lejos de los alimentos con ayuda de un adulto.",
    allergensInfo:
      "Limpia a fondo superficies y utensilios al preparar comida para personas con alergias a gluten, huevo, lácteos o frutos secos.",
    checkQuestions: [
      {
        id: "n1-h-q1",
        question: "¿Cuánto tiempo mínimo debes frotar tus manos con jabón antes de cocinar?",
        options: ["5 segundos", "20 segundos", "2 minutos"],
        correctIndex: 1,
        explanation: "Veinte segundos completos garantizan eliminar bacterias y suciedad de palmas, dedos y uñas.",
      },
      {
        id: "n1-h-q2",
        question: "¿Se debe lavar el pollo crudo bajo el chorro de agua del grifo?",
        options: [
          "Sí, siempre",
          "No, porque las salpicaduras esparcen bacterias por la cocina; la cocción a 74 °C las elimina",
          "Solo con jabón",
        ],
        correctIndex: 1,
        explanation: "El calor de la cocción elimina las bacterias sin contaminar el lavaplatos.",
      },
    ],
  },
  {
    id: "n1-ingredientes",
    levelNumber: 1,
    order: 3,
    title: "Ingredientes",
    durationMinutes: 12,
    xpReward: 60,
    image: IMAGES.nivel1,
    summary: "Descubre cómo elegir ingredientes frescos, leer etiquetas de alérgenos y organizar tu despensa.",
    simpleExplanation:
      "Un plato sencillo con ingredientes frescos sabe mil veces mejor que una receta compleja con productos pasados. Aprenderás a reconocer frescura, usar sal y especias con criterio y revisar etiquetas de seguridad.",
    ingredients: [
      "Aceite de oliva virgen extra y aceite vegetal neutro",
      "Sal fina y sal en escamas",
      "Pimienta negra, orégano, ajo en polvo",
      "Limón fresco y hierbas aromáticas",
    ],
    utensils: [
      "Frascos herméticos etiquetados",
      "Cucharas medidoras",
      "Colador fino",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Evalúa frescura por vista y aroma",
        instruction:
          "Las verduras frescas tienen color vivo y textura firme; las hierbas no deben verse marchitas ni oscuras.",
      },
      {
        stepNumber: 2,
        title: "Conoce tus aceites",
        instruction:
          "El aceite de oliva virgen extra aporta gran sabor en frío y salteados suaves; el aceite vegetal neutro resiste mejor temperaturas medias-altas.",
      },
      {
        stepNumber: 3,
        title: "Lee la etiqueta de alérgenos",
        instruction:
          "En productos empaquetados busca siempre la sección 'Contiene:' o 'Puede contener trazas de:' para cuidar a tu familia y amigos.",
      },
      {
        stepNumber: 4,
        title: "Sazona en capas",
        instruction:
          "En lugar de echar toda la sal al final, añade una pizca pequeña al inicio y ajusta al final probando con una cuchara limpia.",
      },
    ],
    chefTips: [
      "Guarda las especias lejos del calor de la estufa y de la luz directa para que conserven su aroma.",
      "Un poco de ralladura de limón aporta perfume fresco sin añadir acidez líquida.",
    ],
    commonMistakes: [
      "Confundir bicarbonato de sodio con polvo de hornear o azúcar con sal por no probar o etiquetar.",
      "Usar especias vencidas que ya no huelen a nada.",
    ],
    safetyTags: ["alergias", "higiene"],
    requiresAdultSupervision: false,
    safetyWarning: "Verifica siempre fechas de caducidad y revisa posibles alergias antes de invitar a otros a probar.",
    allergensInfo:
      "Los 8 alérgenos más frecuentes en cocina son: leche, huevo, trigo/gluten, soya, cacahuate, frutos secos, pescado y mariscos.",
    checkQuestions: [
      {
        id: "n1-i-q1",
        question: "¿Dónde conviene guardar tus especias secas?",
        options: [
          "Justo encima de la estufa caliente",
          "En un lugar fresco, seco y protegido de la luz directa",
          "Dentro del congelador sin tapa",
        ],
        correctIndex: 1,
        explanation: "El calor y la humedad apagan rápidamente los aceites aromáticos de las especias.",
      },
    ],
  },
  {
    id: "n1-tecnicas-basicas",
    levelNumber: 1,
    order: 4,
    title: "Técnicas básicas",
    durationMinutes: 15,
    xpReward: 70,
    image: IMAGES.hero,
    summary: "Aprende la postura segura de corte, diferenciar hervir de fuego lento y dominar el salteado controlado.",
    simpleExplanation:
      "Toda receta combina unas pocas técnicas clave: cortar uniforme para que todo se cocine igual, controlar la temperatura del agua y mover los ingredientes en la sartén sin quemarse.",
    ingredients: [
      "1 zanahoria o calabacín lavado",
      "1 cucharada de aceite de oliva",
      "Agua para practicar hervor",
    ],
    utensils: [
      "Tabla estable",
      "Cuchillo adecuado (solo con supervisión adulta)",
      "Olla pequeña y sartén mediana",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Crea una base plana antes de cortar",
        instruction:
          "Si un vegetal es redondo (como zanahoria o cebolla), pide a un adulto que lo parta a la mitad primero y apoya el lado plano sobre la tabla.",
        safetyReminder: "Nunca cortes alimentos redondos que rueden bajo el cuchillo.",
      },
      {
        stepNumber: 2,
        title: "Postura de garra",
        instruction:
          "Dobla los dedos de tu mano guía hacia adentro formando una garra. El costado plano del cuchillo apoya suavemente contra los nudillos, lejos de las yemas.",
      },
      {
        stepNumber: 3,
        title: "Hervir vs. Simmer (fuego lento)",
        instruction:
          "Hervir muestra burbujas grandes y rápidas (100 °C). Fuego lento o 'simmer' tiene burbujas suaves y constantes, ideal para sopas y salsas sin salpicar.",
      },
      {
        stepNumber: 4,
        title: "Saltear seguro en sartén",
        instruction:
          "Calienta la sartén a fuego medio, agrega el aceite, espera 20 segundos hasta que brille y mueve los vegetales con espátula de madera sin acercar la cara.",
        safetyReminder: "Mantén supervisión adulta con el fuego y usa fuego medio para evitar salpicaduras de aceite.",
      },
    ],
    chefTips: [
      "Cortar todos los trozos del mismo tamaño hace que ninguno quede crudo ni quemado.",
      "Seca bien los vegetales lavados antes de ponerlos en sartén con aceite para que no salpiquen.",
    ],
    commonMistakes: [
      "Llenar demasiado la sartén: los vegetales se cuecen al vapor en lugar de dorarse.",
      "Usar fuego máximo todo el tiempo y quemar el aceite.",
    ],
    safetyTags: ["cuchillos", "fuego", "aceite_caliente"],
    requiresAdultSupervision: true,
    safetyWarning:
      "El uso de cuchillos y hornillas encendidas requiere supervisión de un adulto. Seca siempre los alimentos antes de tocar aceite tibio.",
    allergensInfo: "Esta práctica base con verduras es libre de alérgenos comunes.",
    checkQuestions: [
      {
        id: "n1-tb-q1",
        question: "¿Por qué debes secar las verduras antes de saltearlas en una sartén con aceite?",
        options: [
          "Para que pesen menos",
          "Porque el agua en contacto con aceite caliente provoca salpicaduras peligrosas",
          "Para que pierdan vitaminas",
        ],
        correctIndex: 1,
        explanation: "El agua se evapora instantáneamente en aceite caliente y puede salpicar gotas ardientes.",
      },
    ],
  },
  {
    id: "n1-huevos",
    levelNumber: 1,
    order: 5,
    title: "Preparación de huevos",
    durationMinutes: 15,
    xpReward: 70,
    image: IMAGES.nivel1,
    summary: "Prepara huevos revueltos cremosos estilo chef y aprende a romper huevos sin dejar cáscaras.",
    simpleExplanation:
      "El huevo es la prueba favorita de las escuelas de gastronomía porque revela el control del calor. Fuego bajo y paciencia transforman unos huevos simples en un desayuno sedoso de restaurante.",
    ingredients: [
      "2 huevos frescos",
      "1 cucharadita de mantequilla o aceite de oliva",
      "1 pizca de sal y pimienta",
      "1 cucharada de cebollino picado (opcional)",
    ],
    utensils: [
      "Tazón pequeño",
      "Tenedor o batidor de globo",
      "Sartén antiadherente pequeña",
      "Espátula de silicona",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Rompe sobre superficie plana",
        instruction:
          "Golpea el huevo suavemente sobre la encimera plana (no en el borde del tazón) dentro de un plato aparte para evitar cáscaras.",
      },
      {
        stepNumber: 2,
        title: "Bate sin exceso de espuma",
        instruction:
          "Mezcla yema y clara con tenedor hasta obtener un color amarillo uniforme. Agrega una pizca de sal al final o justo antes de cocinar.",
      },
      {
        stepNumber: 3,
        title: "Fuego bajo y mantequilla derretida",
        instruction:
          "Derrite la mantequilla en sartén a fuego bajo con ayuda de un adulto hasta que haga burbujitas suaves sin tostarse.",
        safetyReminder: "Usa fuego medio-bajo y sujeta el mango de la sartén con firmeza.",
      },
      {
        stepNumber: 4,
        title: "Pliega suavemente",
        instruction:
          "Vierte los huevos y mueve con la espátula haciendo pliegues lentos desde los bordes hacia el centro durante 2 a 3 minutos. Retira cuando aún brillen ligeramente húmedos.",
        timerSeconds: 150,
      },
    ],
    chefTips: [
      "El calor residual sigue cocinando los huevos en el plato; retíralos un poco antes de que se vean secos.",
      "Lávate siempre las manos con jabón después de tocar cáscaras de huevo crudo.",
    ],
    commonMistakes: [
      "Cocinar a fuego alto: deja el huevo gomoso, seco y con bordes dorados duros.",
      "Romper el huevo directo sobre la sartén caliente: si cae cáscara es difícil sacarla.",
    ],
    safetyTags: ["fuego", "higiene", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "Supervisión adulta recomendada al usar la estufa. Lávate las manos tras manipular huevo crudo.",
    allergensInfo: "Contiene HUEVO y LÁCTEOS (si usas mantequilla). Puedes sustituir mantequilla por aceite de oliva.",
    checkQuestions: [
      {
        id: "n1-hu-q1",
        question: "¿Qué temperatura funciona mejor para lograr unos huevos revueltos cremosos?",
        options: [
          "Fuego máximo para terminar en 20 segundos",
          "Fuego bajo moviendo suavemente con espátula",
          "Cocinarlos en sartén fría sin encender",
        ],
        correctIndex: 1,
        explanation: "Las proteínas del huevo se cuajan suaves a baja temperatura; el fuego alto las vuelve secas.",
      },
    ],
  },
  {
    id: "n1-arroz",
    levelNumber: 1,
    order: 6,
    title: "Preparación de arroz",
    durationMinutes: 25,
    xpReward: 75,
    image: IMAGES.nivel1,
    summary: "Domina la proporción exacta 2:1, el lavado del almidón y el reposo tapado para un arroz suelto perfecto.",
    simpleExplanation:
      "El arroz acompaña miles de platos en todo el mundo. El secreto no está en revolverlo sin parar, sino en medir bien el agua, bajar el fuego al mínimo y respetar su tiempo tapado.",
    ingredients: [
      "1 taza de arroz blanco largo o jazmín",
      "2 tazas de agua",
      "1 cucharadita de aceite de oliva",
      "1/2 cucharadita de sal",
    ],
    utensils: [
      "Colador fino",
      "Taza medidora",
      "Olla mediana con tapa ajustada",
      "Tenedor",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Lava el arroz en el colador",
        instruction:
          "Enjuaga el arroz bajo agua fría moviéndolo suavemente hasta que el agua salga casi transparente para quitar exceso de almidón superficial.",
      },
      {
        stepNumber: 2,
        title: "Sofríe suavemente 1 minuto",
        instruction:
          "Con supervisión adulta, calienta la cucharadita de aceite en la olla a fuego medio, añade el arroz escurrido y mezcla 1 minuto.",
      },
      {
        stepNumber: 3,
        title: "Agrega agua y tapa a fuego mínimo",
        instruction:
          "Añade las 2 tazas de agua y la sal. Cuando empiece a hervir, baja la llama al mínimo, tapa la olla y cocina 15 minutos sin destapar.",
        timerSeconds: 900,
        safetyReminder: "Ten cuidado con el vapor caliente al revisar la olla.",
      },
      {
        stepNumber: 4,
        title: "Reposo y esponjado",
        instruction:
          "Apaga el fuego y deja reposar tapado 5 minutos más. Luego destapa inclinando la tapa hacia afuera (para que el vapor no vaya a tu cara) y suelta con un tenedor.",
        timerSeconds: 300,
      },
    ],
    chefTips: [
      "Nunca destapes la olla a mitad de cocción: escapará el vapor necesario para cocinar los granos superiores.",
      "Esponjar con tenedor evita aplastar los granos.",
    ],
    commonMistakes: [
      "Revolver el arroz mientras hierve: libera demasiado almidón y queda pastoso.",
      "Levantar la tapa directo hacia tu rostro recibiendo el vapor caliente.",
    ],
    safetyTags: ["fuego"],
    requiresAdultSupervision: true,
    safetyWarning:
      "Precaución extrema con el vapor caliente al destapar la olla. Inclina la tapa hacia el lado contrario a ti con ayuda de un adulto.",
    allergensInfo: "Naturalmente libre de gluten, lácteos, huevo y frutos secos.",
    checkQuestions: [
      {
        id: "n1-ar-q1",
        question: "¿Hacia dónde debes inclinar la tapa al abrir una olla con arroz recién cocido?",
        options: [
          "Hacia tu cara para olerlo",
          "Hacia el lado opuesto a tu cuerpo para que el vapor salga lejos de ti",
          "Da igual",
        ],
        correctIndex: 1,
        explanation: "El vapor atrapado supera los 100 °C y puede quemar rostro y manos si abre hacia ti.",
      },
    ],
  },
  {
    id: "n1-ensaladas",
    levelNumber: 1,
    order: 7,
    title: "Ensaladas",
    durationMinutes: 15,
    xpReward: 70,
    image: IMAGES.nivel1,
    summary: "Crea ensaladas crujientes, coloridas y aprende a emulsionar una vinagreta casera equilibrada.",
    simpleExplanation:
      "Una gran ensalada combina frescura, color, algo crujiente y un aderezo que se adhiera bien a las hojas. Si las hojas están mojadas, el aderezo resbala al fondo del plato.",
    ingredients: [
      "1 lechuga romana o mix de hojas verdes",
      "10 tomates cherry",
      "1/2 pepino en medias lunas",
      "3 cucharadas de aceite de oliva virgen extra",
      "1 cucharada de vinagre de manzana o jugo de limón",
      "1/2 cucharadita de miel o mostaza suave, sal y pimienta",
    ],
    utensils: [
      "Escurridor o centrifugador de ensalada",
      "Frasco pequeño con tapa (para agitar vinagreta)",
      "Ensaladera amplia",
      "Tabla limpia de vegetales",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Lava y seca muy bien las hojas",
        instruction:
          "Lava hoja por hoja en agua fría y sécalas completamente con centrifugador o paño limpio. Hojas secas = ensalada crujiente.",
      },
      {
        stepNumber: 2,
        title: "Prepara la vinagreta 3:1 en frasco",
        instruction:
          "Coloca 3 cucharadas de aceite, 1 de limón o vinagre, la mostaza/miel, sal y pimienta en un frasco limpio, cierra y agita 15 segundos hasta espesar.",
      },
      {
        stepNumber: 3,
        title: "Corta los complementos",
        instruction:
          "Parte los tomates cherry a la mitad y el pepino en láminas uniformes usando tabla limpia exclusiva de vegetales.",
        safetyReminder: "Pide supervisión adulta si usas cuchillo afilado.",
      },
      {
        stepNumber: 4,
        title: "Adereza justo antes de servir",
        instruction:
          "Mezcla las hojas con la mitad de la vinagreta suavemente usando dos cucharas para cubrir sin aplastar.",
      },
    ],
    chefTips: [
      "Trocea las hojas grandes con las manos en lugar de cuchillo para evitar que los bordes se oxiden rápido.",
      "Agrega semillas tostadas o crutones al final para que no se humedezcan.",
    ],
    commonMistakes: [
      "Poner el aderezo media hora antes: la sal y el ácido marchitan las hojas.",
      "Usar demasiado aderezo hasta inundar el fondo del plato.",
    ],
    safetyTags: ["higiene", "cuchillos"],
    requiresAdultSupervision: false,
    safetyWarning: "Usa tabla exclusiva para vegetales lavados y supervisión si utilizas cuchillo afilado para los tomates.",
    allergensInfo: "Revisa si agregas mostaza, nueces o queso. La receta base es libre de gluten, huevo y lácteos.",
    checkQuestions: [
      {
        id: "n1-en-q1",
        question: "¿Por qué es tan importante secar bien las hojas de lechuga antes de añadir la vinagreta?",
        options: [
          "Para que pesen menos",
          "Porque el agua repele el aceite e impide que el aderezo se adhiera a las hojas",
          "Para cambiarles el color",
        ],
        correctIndex: 1,
        explanation: "Las hojas secas permiten que la emulsión de aceite y limón abrace cada hoja de manera uniforme.",
      },
    ],
  },

  // ==================== NIVEL 2: COCINA BÁSICA (6 clases) ====================
  {
    id: "n2-pastas",
    levelNumber: 2,
    order: 1,
    title: "Pastas",
    durationMinutes: 20,
    xpReward: 75,
    image: IMAGES.nivel2,
    summary: "Cocina pasta al dente como en Italia, sala el agua correctamente y liga con agua de cocción.",
    simpleExplanation:
      "La pasta no necesita aceite en el agua; necesita espacio suficiente, agua con sal ('como el mar') y terminar su último minuto mezclada dentro de la salsa.",
    ingredients: [
      "200 g de pasta corta o espagueti",
      "2 litros de agua",
      "1 cucharada rasa de sal para el agua",
      "1 taza de tu salsa favorita",
    ],
    utensils: [
      "Olla grande y profunda",
      "Colador",
      "Taza resistente al calor",
      "Pinzas de cocina",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Hierve agua abundante con sal",
        instruction:
          "Lleva el agua a hervor fuerte en olla grande, añade la sal cuando ya hierva y agrega la pasta sin partirla.",
      },
      {
        stepNumber: 2,
        title: "Mueve en los primeros 2 minutos",
        instruction:
          "Remueve suavemente al principio para que no se pegue en el fondo. Cocina 1 minuto menos de lo que indica el paquete.",
        timerSeconds: 480,
      },
      {
        stepNumber: 3,
        title: "Reserva el oro líquido (agua de pasta)",
        instruction:
          "Con ayuda de un adulto, saca media taza de agua de la olla antes de escurrir en el colador dentro del fregadero.",
        safetyReminder: "Nunca cargues una olla llena de agua hirviendo sin la ayuda de un adulto.",
      },
      {
        stepNumber: 4,
        title: "Emulsiona en sartén",
        instruction:
          "Mezcla la pasta con la salsa caliente y un chorrito de agua de cocción por 1 minuto hasta que brille y se cubra por completo.",
      },
    ],
    chefTips: [
      "Jamás enjuagues la pasta caliente bajo el grifo: lavas el almidón que ayuda a pegar la salsa.",
    ],
    commonMistakes: [
      "Agregar aceite al agua: hace que la salsa resbale de la pasta.",
      "Escurrir una olla pesada solo sin supervisión.",
    ],
    safetyTags: ["fuego", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning:
      "Escurrir agua hirviendo de una olla pesada es peligroso: pide siempre a un adulto que sostenga y vuelque la olla al colador.",
    allergensInfo: "La pasta tradicional contiene TRIGO (GLUTEN) y a veces HUEVO. Existen versiones certificadas sin gluten.",
    checkQuestions: [
      {
        id: "n2-pa-q1",
        question: "¿Conviene poner aceite en el agua hirviendo de la pasta?",
        options: [
          "Sí, un vaso entero",
          "No, porque crea una capa resbalosa y la salsa ya no se pega a la pasta",
          "Solo si es pasta corta",
        ],
        correctIndex: 1,
        explanation: "Remover durante los primeros 2 minutos evita que se pegue sin arruinar la adherencia de la salsa.",
      },
    ],
  },
  {
    id: "n2-salsas",
    levelNumber: 2,
    order: 2,
    title: "Salsas",
    durationMinutes: 25,
    xpReward: 80,
    image: IMAGES.nivel2,
    summary: "Prepara una salsa pomodoro italiana fresca y entiende el secreto de un roux suave para salsas blancas.",
    simpleExplanation:
      "Las salsas convierten ingredientes sencillos en platos memorables. Aprenderás a sofreír ajo sin quemarlo y a equilibrar la acidez del tomate maduro.",
    ingredients: [
      "400 g de tomate triturado natural",
      "2 cucharadas de aceite de oliva",
      "2 dientes de ajo laminados",
      "6 hojas de albahaca fresca",
      "Sal, pimienta y 1 pizca de azúcar si está muy ácido",
    ],
    utensils: [
      "Sartén honda u olla mediana",
      "Cuchara de madera",
      "Tabla y cuchillo (con adulto)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Perfuma el aceite sin quemar el ajo",
        instruction:
          "Coloca aceite y ajo en la sartén aún tibia y sube a fuego medio-bajo. Cuando el ajo apenas comience a oler rico (sin ponerse marrón), pasa al paso 2.",
      },
      {
        stepNumber: 2,
        title: "Añade el tomate con cuidado",
        instruction:
          "Agrega el tomate triturado despacio para evitar salpicaduras, añade sal y cocina a fuego lento tapado parcialmente 12 minutos.",
        timerSeconds: 720,
        safetyReminder: "La salsa de tomate burbujea; usa tapa entreabierta para evitar salpicaduras calientes.",
      },
      {
        stepNumber: 3,
        title: "Perfume final con albahaca",
        instruction:
          "Apaga el fuego, añade hojas de albahaca rasgadas con la mano y prueba la acidez antes de servir.",
      },
    ],
    chefTips: [
      "El ajo quemado amarga toda la salsa. Si se oscurece demasiado, es mejor empezar de nuevo.",
    ],
    commonMistakes: [
      "Cocinar salsa de tomate a fuego muy fuerte sin tapa: ensucia y quema la piel con salpicaduras.",
    ],
    safetyTags: ["fuego", "aceite_caliente"],
    requiresAdultSupervision: true,
    safetyWarning: "Las salsas espesas retienen mucho calor y salpican al hervir. Cocina a fuego suave y supervisado.",
    allergensInfo: "Esta salsa pomodoro es libre de gluten, lácteos y huevo.",
    checkQuestions: [
      {
        id: "n2-sa-q1",
        question: "¿Qué pasa si dejas que el ajo se queme hasta ponerse oscuro en el aceite?",
        options: [
          "Se vuelve más dulce",
          "Toma un sabor amargo que arruina toda la salsa",
          "Espesa el tomate",
        ],
        correctIndex: 1,
        explanation: "El ajo tiene azúcares que se queman rápido; debe quedar apenas dorado pálido.",
      },
    ],
  },
  {
    id: "n2-sopas",
    levelNumber: 2,
    order: 3,
    title: "Sopas",
    durationMinutes: 30,
    xpReward: 80,
    image: IMAGES.nivel2,
    summary: "Construye una sopa de verduras reconfortante desde un sofrito aromático y licúa cremas con seguridad.",
    simpleExplanation:
      "Una sopa deliciosa empieza dorando suavemente cebolla, zanahoria y apio antes de echar el líquido. Así liberas todo su dulzor natural.",
    ingredients: [
      "1 zanahoria en cubos",
      "1/2 cebolla picada",
      "1 papa mediana en cubos",
      "1 litro de caldo de verduras o agua",
      "1 cucharada de aceite de oliva, sal y perejil",
    ],
    utensils: [
      "Olla mediana",
      "Cuchara de madera",
      "Tabla de cortar y cuchillo (con adulto)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Sudar los aromáticos",
        instruction:
          "En fuego medio-bajo cocina cebolla y zanahoria con aceite y pizca de sal 5 minutos hasta que brillen sin quemarse.",
        timerSeconds: 300,
      },
      {
        stepNumber: 2,
        title: "Hervor suave con caldo",
        instruction:
          "Agrega papa y caldo. Lleva a hervor suave y cocina 15 minutos hasta que la papa esté tierna al pincharla con tenedor.",
        timerSeconds: 900,
      },
      {
        stepNumber: 3,
        title: "Regla de oro si haces crema licuada",
        instruction:
          "Si deseas licuar una crema caliente, espera 10 minutos a que entibie, llena la licuadora máximo a la mitad y pide a un adulto sujetar la tapa con un paño.",
        safetyReminder: "Licuar líquidos hirviendo genera presión de vapor que puede botar la tapa.",
      },
    ],
    chefTips: [
      "Corta todos los vegetales en cubos parecidos para que se ablanden exactamente al mismo tiempo.",
    ],
    commonMistakes: [
      "Llenar la licuadora hasta el tope con líquido hirviendo: riesgo alto de quemadura.",
    ],
    safetyTags: ["fuego", "cuchillos"],
    requiresAdultSupervision: true,
    safetyWarning:
      "Nunca licúes sopas muy calientes ni llenes la licuadora arriba de la mitad; pide ayuda adulta siempre.",
    allergensInfo: "Revisa etiquetas si usas caldo comercial (algunos contienen apio o trazas de gluten/soja).",
    checkQuestions: [
      {
        id: "n2-so-q1",
        question: "¿Qué precaución debes tener si vas a licuar una sopa tibia?",
        options: [
          "Llenar el vaso hasta el borde",
          "Dejar entibiar, llenar máximo a la mitad y sujetar la tapa con un paño bajo supervisión",
          "Licuar sin tapa",
        ],
        correctIndex: 1,
        explanation: "Dejar espacio libre evita que la presión del vapor expulse el líquido caliente.",
      },
    ],
  },
  {
    id: "n2-pollo",
    levelNumber: 2,
    order: 4,
    title: "Pollo",
    durationMinutes: 25,
    xpReward: 85,
    image: IMAGES.nivel4,
    summary: "Aprende a manipular pollo con máxima higiene y cocinar pechugas doradas por fuera y jugosas por dentro.",
    simpleExplanation:
      "Cocinar pollo es súper sencillo si respetas dos reglas: higiene impecable al manipularlo crudo y control de grosor para que se cocine parejo hasta los 74 °C seguros.",
    ingredients: [
      "2 filetes delgados de pechuga de pollo",
      "1 cucharada de aceite de oliva",
      "1/2 cucharadita de ajo en polvo, pimentón dulce, sal y pimienta",
    ],
    utensils: [
      "Tabla exclusiva para carnes crudas",
      "Sartén mediana",
      "Pinzas de cocina (lavarlas tras tocar crudo)",
      "Termómetro digital de cocina (recomendado)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Seca y sazona sin contaminar",
        instruction:
          "Seca el pollo con papel desechable y sazona por ambos lados. Lleva el papel directo a la basura y lávate las manos 20 segundos con jabón.",
      },
      {
        stepNumber: 2,
        title: "Sellado dorado a fuego medio",
        instruction:
          "Con un adulto cerca, calienta la sartén con aceite a fuego medio. Coloca las pechugas alejándolas de ti para que no salpique y deja 4 minutos sin mover.",
        timerSeconds: 240,
        safetyReminder: "Coloca el filete en la sartén inclinándolo hacia afuera, nunca lo dejes caer desde arriba.",
      },
      {
        stepNumber: 3,
        title: "Voltea y confirma cocción segura (74 °C)",
        instruction:
          "Voltea con pinzas limpias y cocina otros 4 a 5 minutos. Verifica con termómetro (74 °C) o asegurándote de que el centro esté completamente blanco sin partes rosadas.",
        timerSeconds: 240,
      },
    ],
    chefTips: [
      "Usa unas pinzas para colocar el pollo crudo y otras limpias (o lávalas) para sacarlo cocido.",
    ],
    commonMistakes: [
      "Mover el pollo cada 10 segundos: impide que se forme la costra dorada.",
      "Devolver el pollo cocido al plato donde estuvo crudo.",
    ],
    safetyTags: ["higiene", "fuego", "aceite_caliente"],
    requiresAdultSupervision: true,
    safetyWarning:
      "El pollo crudo requiere lavado estricto de manos y utensilios. Cocina a fuego medio bajo supervisión adulta.",
    allergensInfo: "Naturalmente libre de gluten, lácteos y frutos secos.",
    checkQuestions: [
      {
        id: "n2-po-q1",
        question: "¿Qué debes hacer con el plato donde sazonaste el pollo crudo?",
        options: [
          "Servir el pollo cocido ahí mismo",
          "Lavarlo inmediatamente con agua caliente y jabón, usando un plato limpio para servir",
          "Limpiarlo con una servilleta seca",
        ],
        correctIndex: 1,
        explanation: "Usar un plato limpio al servir evita recontaminar el pollo ya cocinado.",
      },
    ],
  },
  {
    id: "n2-verduras",
    levelNumber: 2,
    order: 5,
    title: "Verduras",
    durationMinutes: 20,
    xpReward: 75,
    image: IMAGES.nivel1,
    summary: "Descubre el blanqueado para colores vibrantes y el asado al horno para verduras caramelizadas.",
    simpleExplanation:
      "A mucha gente no le gustan las verduras solo porque las probó sobrecocidas. Con blanqueado rápido o asado al horno quedan crujientes, dulces y llenas de color.",
    ingredients: [
      "1 taza de ramilletes de brócoli",
      "1 zanahoria en bastones",
      "1 cucharada de aceite de oliva, sal y pizca de ajo",
    ],
    utensils: [
      "Olla con agua hirviendo y tazón con agua fría (blanqueado)",
      "Espumadera o colador",
      "Bandeja para horno con papel vegetal",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Blanqueado en 2 minutos",
        instruction:
          "Sumerge el brócoli en agua hirviendo con sal por 2 minutos para fijar su verde intenso y pásalo al agua fría con espumadera.",
        timerSeconds: 120,
        safetyReminder: "Usa espumadera de mango largo con supervisión adulta cerca del agua hirviendo.",
      },
      {
        stepNumber: 2,
        title: "Asado dorado en horno",
        instruction:
          "Mezcla zanahorias secas con aceite y sal en una bandeja sin amontonar. Un adulto hornea a 200 °C por 18 minutos hasta dorar bordes.",
        safetyReminder: "La apertura y manejo del horno a 200 °C debe hacerlo un adulto o con guantes térmicos supervisados.",
      },
    ],
    chefTips: [
      "No amontones verduras en la bandeja del horno; deja espacio entre ellas para que se doren y no se cuezan al vapor.",
    ],
    commonMistakes: [
      "Hervir el brócoli 15 minutos hasta que pierda su color y textura.",
    ],
    safetyTags: ["horno", "fuego"],
    requiresAdultSupervision: true,
    safetyWarning: "El horno caliente y el agua hirviendo requieren supervisión adulta y guantes térmicos secos.",
    allergensInfo: "Libre de alérgenos comunes.",
    checkQuestions: [
      {
        id: "n2-ve-q1",
        question: "¿Por qué se sumerge el brócoli en agua fría justo después de blanquearlo 2 minutos?",
        options: [
          "Para lavarle la sal",
          "Para detener la cocción al instante y mantenerlo verde y crujiente",
          "Para ablandarlo más",
        ],
        correctIndex: 1,
        explanation: "El choque térmico detiene el calor residual y conserva color, textura y nutrientes.",
      },
    ],
  },
  {
    id: "n2-carnes",
    levelNumber: 2,
    order: 6,
    title: "Preparación de carnes",
    durationMinutes: 25,
    xpReward: 85,
    image: IMAGES.nivel4,
    summary: "Aprende la reacción de Maillard para sellar jugos, controlar el punto y respetar el reposo.",
    simpleExplanation:
      "Cuando una carne se dora en sartén ocurren cientos de aromas deliciosos (reacción de Maillard). Para lograrlo, la carne debe estar seca por fuera y la sartén bien templada.",
    ingredients: [
      "1 filete de res o lomo de cerdo (150–180 g)",
      "1 cucharada de aceite vegetal neutro",
      "Sal, pimienta y 1 ramita de romero o tomillo",
    ],
    utensils: [
      "Sartén gruesa o plancha",
      "Pinzas metálicas",
      "Papel absorbente",
      "Tabla limpia de reposo",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Templa y seca la superficie",
        instruction:
          "Saca la carne del refrigerador 15 minutos antes y sécala muy bien con papel absorbente; la humedad impide el dorado.",
      },
      {
        stepNumber: 2,
        title: "Sella sin presionar",
        instruction:
          "Con supervisión adulta, sella en sartén a fuego medio-alto 3 minutos por lado sin aplastar la carne con la espátula.",
        timerSeconds: 180,
        safetyReminder: "Puede haber chisporroteo leve; mantén distancia prudente y usa mango seguro.",
      },
      {
        stepNumber: 3,
        title: "Reposo obligatorio de 5 minutos",
        instruction:
          "Pasa a una tabla limpia y deja reposar 5 minutos antes de cortar en láminas diagonales.",
        timerSeconds: 300,
      },
    ],
    chefTips: [
      "Nunca pinches la carne con tenedor al darle la vuelta: usa pinzas para no perder sus jugos.",
    ],
    commonMistakes: [
      "Cortar el filete recién salido de la sartén y ver todo el jugo derramado en la tabla.",
    ],
    safetyTags: ["fuego", "aceite_caliente", "higiene"],
    requiresAdultSupervision: true,
    safetyWarning: "El sellado a fuego medio-alto genera salpicaduras de aceite. Realízalo siempre con un adulto supervisando.",
    allergensInfo: "Libre de gluten y lácteos (si no añades mantequilla).",
    checkQuestions: [
      {
        id: "n2-ca-q1",
        question: "¿Por qué secamos el filete con papel absorbente antes de llevarlo a la sartén?",
        options: [
          "Para quitarle sabor",
          "Para que se dore rápido por fuera en lugar de hervir en su propia agua",
          "Para enfriarlo",
        ],
        correctIndex: 1,
        explanation: "Sin agua superficial la sartén logra dorado aromático de inmediato.",
      },
    ],
  },

  // ==================== NIVEL 3: COCINA INTERMEDIA (6 clases) ====================
  {
    id: "n3-pizza",
    levelNumber: 3,
    order: 1,
    title: "Pizza",
    durationMinutes: 35,
    xpReward: 95,
    image: IMAGES.nivel3,
    summary: "Amasa, fermenta y estira masa artesanal de pizza para lograr bordes aireados y crujientes.",
    simpleExplanation:
      "La pizza perfecta no depende de mil ingredientes encima, sino de una masa bien hidratada que descansó lo suficiente y un horneado uniforme con adulto.",
    ingredients: [
      "250 g de harina de trigo",
      "160 ml de agua tibia",
      "4 g de levadura seca de panadero",
      "1 cucharadita de sal y 1 cucharada de aceite de oliva",
      "Salsa de tomate, queso mozzarella y albahaca",
    ],
    utensils: [
      "Tazón grande",
      "Paño limpio húmedo",
      "Bandeja para horno con papel vegetal",
      "Guantes térmicos secos",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Mezcla y amasa 8 minutos",
        instruction:
          "Une agua tibia con levadura, añade harina, sal y aceite. Amasa doblando y presionando con la palma 8 minutos hasta quedar lisa y elástica.",
      },
      {
        stepNumber: 2,
        title: "Primer levado",
        instruction:
          "Deja reposar tapada en tazón engrasado 45 minutos hasta duplicar volumen.",
      },
      {
        stepNumber: 3,
        title: "Estira con las yemas (sin rodillo)",
        instruction:
          "Presiona del centro hacia afuera con tus dedos dejando un borde más gordito para atrapar aire.",
      },
      {
        stepNumber: 4,
        title: "Horneado con adulto",
        instruction:
          "Cubre con poca salsa y mozzarella. Un adulto precalienta el horno a 230 °C y hornea 10–12 minutos hasta dorar bordes.",
        timerSeconds: 660,
        safetyReminder: "El horno a 230 °C alcanza temperatura muy alta; toda manipulación dentro del horno debe hacerla un adulto.",
      },
    ],
    chefTips: [
      "Menos es más: demasiada salsa remoja el centro de la pizza.",
    ],
    commonMistakes: [
      "Aplastar los bordes con rodillo expulsando todas las burbujas de fermentación.",
    ],
    safetyTags: ["horno", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "El horno doméstico a alta temperatura exige manejo exclusivo de un adulto con guantes térmicos secos.",
    allergensInfo: "Contiene GLUTEN (trigo) y LÁCTEOS (queso mozzarella).",
    checkQuestions: [
      {
        id: "n3-pz-q1",
        question: "¿Por qué estiramos la masa de pizza con las yemas de los dedos en lugar de usar rodillo?",
        options: [
          "Para conservar las burbujas de aire en el borde y lograr una corteza esponjosa",
          "Porque el rodillo rompe el horno",
          "Para gastar menos harina",
        ],
        correctIndex: 0,
        explanation: "Empujar suavemente del centro hacia el borde preserva el gas de la fermentación en la orilla.",
      },
    ],
  },
  {
    id: "n3-hamburguesas",
    levelNumber: 3,
    order: 2,
    title: "Hamburguesas",
    durationMinutes: 25,
    xpReward: 90,
    image: IMAGES.nivel3,
    summary: "Arma hamburguesas caseras jugosas, tuesta el pan brioche y equilibra texturas crujientes y frescas.",
    simpleExplanation:
      "Una gran hamburguesa no necesita huevo ni pan rallado dentro de la carne: solo carne molida con algo de grasa, sal por fuera y un pan tostado que soporte los jugos.",
    ingredients: [
      "300 g de carne molida de res (80/20)",
      "2 panes de hamburguesa tipo brioche",
      "2 láminas de queso cheddar",
      "Lechuga crujiente, rodajas de tomate y sal",
    ],
    utensils: [
      "Plancha o sartén amplia",
      "Espátula firme",
      "Plato limpio para armado",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Forma sin apretar demasiado",
        instruction:
          "Divide en dos bolas suaves y aplasta formando discos de 1.5 cm con una leve hendidura en el centro. Sazona por fuera justo antes de cocinar.",
      },
      {
        stepNumber: 2,
        title: "Tuesta el pan primero",
        instruction:
          "Dora los panes abiertos 1 minuto en la sartén tibia para crear una barrera crujiente.",
      },
      {
        stepNumber: 3,
        title: "Cocina hasta el punto seguro (71 °C)",
        instruction:
          "Con supervisión adulta, cocina 3–4 minutos por lado. Coloca el queso en el último minuto y tapa 30 segundos para fundir.",
        timerSeconds: 210,
      },
    ],
    chefTips: [
      "Poner la lechuga debajo de la carne protege el pan inferior de la humedad.",
    ],
    commonMistakes: [
      "Aplastar la carne con la espátula mientras se cocina y exprimirle todo su jugo.",
    ],
    safetyTags: ["fuego", "higiene", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "Lávate las manos después de formar carne cruda y cocina la carne molida completamente (71 °C) con supervisión.",
    allergensInfo: "Contiene GLUTEN (pan) y LÁCTEOS (queso). Revisa el pan por trazas de sésamo o huevo.",
    checkQuestions: [
      {
        id: "n3-hb-q1",
        question: "¿Por qué tostamos ligeramente la cara interna del pan de hamburguesa?",
        options: [
          "Para hacerlo más pequeño",
          "Para sellar la miga y evitar que los jugos deshagan el pan",
          "Para enfriar la carne",
        ],
        correctIndex: 1,
        explanation: "Una capa dorada aporta sabor y resistencia estructural.",
      },
    ],
  },
  {
    id: "n3-lasana",
    levelNumber: 3,
    order: 3,
    title: "Lasaña",
    durationMinutes: 45,
    xpReward: 100,
    image: IMAGES.nivel2,
    summary: "Domina el armado por capas alternando salsa boloñesa, bechamel sedosa y gratinado dorado.",
    simpleExplanation:
      "La lasaña es pura arquitectura culinaria: capas equilibradas para que al cortarla mantenga su forma y cada bocado tenga pasta, salsa y cremosidad.",
    ingredients: [
      "9 láminas de pasta para lasaña",
      "2 tazas de salsa pomodoro o boloñesa",
      "1.5 tazas de salsa bechamel",
      "150 g de queso mozzarella y parmesano rallado",
    ],
    utensils: [
      "Molde rectangular apto para horno",
      "Cucharón",
      "Papel aluminio",
      "Guantes térmicos secos",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Base hidratada",
        instruction:
          "Cubre el fondo del molde con una capa fina de salsa para que la primera pasta no se pegue ni endurezca.",
      },
      {
        stepNumber: 2,
        title: "Construye 3 pisos ordenados",
        instruction:
          "Alterna láminas de pasta, salsa roja, bechamel y un toque de queso. Termina arriba con bechamel y queso para gratinar.",
      },
      {
        stepNumber: 3,
        title: "Horneado y reposo",
        instruction:
          "Un adulto hornea a 190 °C por 25 minutos (primero tapado, últimos 8 minutos destapado). Reposa 10 minutos antes de servir.",
        safetyReminder: "El molde caliente pesa mucho; solo un adulto debe retirarlo del horno.",
      },
    ],
    chefTips: [
      "El reposo de 10 minutos al salir del horno evita que las capas se deslicen al cortar la porción.",
    ],
    commonMistakes: [
      "Usar láminas precocidas sin suficiente líquido en las salsas, quedando bordes duros.",
    ],
    safetyTags: ["horno", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "Manipular bandejas pesadas y calientes del horno requiere siempre intervención adulta.",
    allergensInfo: "Contiene GLUTEN y LÁCTEOS (bechamel y quesos).",
    checkQuestions: [
      {
        id: "n3-la-q1",
        question: "¿Qué ocurre si cortas una lasaña recién salida del horno sin dejarla reposar?",
        options: [
          "Se congela",
          "Las capas líquidas se derrumban en el plato; reposar 10 minutos estabiliza la porción",
          "Sabe más salada",
        ],
        correctIndex: 1,
        explanation: "El breve reposo permite que el almidón y el queso asienten las capas perfectamente.",
      },
    ],
  },
  {
    id: "n3-italiana",
    levelNumber: 3,
    order: 4,
    title: "Comida italiana",
    durationMinutes: 35,
    xpReward: 95,
    image: IMAGES.nivel2,
    summary: "Prepara un risotto cremoso al estilo del norte de Italia entendiendo la liberación natural del almidón.",
    simpleExplanation:
      "La cocina italiana brilla por respetar pocos ingredientes de enorme calidad. En el risotto, el arroz Arborio crea su propia crema natural con paciencia y caldo caliente.",
    ingredients: [
      "1 taza de arroz Arborio o Carnaroli",
      "3.5 tazas de caldo de verduras caliente",
      "1/2 cebolla picada fina",
      "2 cucharadas de mantequilla o aceite de oliva",
      "40 g de queso parmesano rallado",
    ],
    utensils: [
      "Olla pequeña para mantener caldo caliente",
      "Sartén honda u olla ancha",
      "Cucharón",
      "Cuchara de madera",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Nacarado del grano",
        instruction:
          "Sofríe cebolla suave 3 minutos, añade el arroz SIN lavar y mezcla 2 minutos hasta que los bordes de cada grano se vean translúcidos.",
      },
      {
        stepNumber: 2,
        title: "Caldo cucharón a cucharón",
        instruction:
          "Agrega 1 cucharón de caldo caliente, remueve despacio y añade el siguiente solo cuando el anterior casi se haya absorbido (~16 min total).",
        timerSeconds: 960,
      },
      {
        stepNumber: 3,
        title: "Mantecatura fuera del fuego",
        instruction:
          "Apaga la estufa, incorpora mantequilla fría y parmesano batiendo enérgicamente para crear una ola cremosa.",
      },
    ],
    chefTips: [
      "Si usas caldo frío detienes la cocción en cada cucharón; mantenlo siempre caliente en otra hornilla con supervisión.",
    ],
    commonMistakes: [
      "Lavar el arroz de risotto: eliminas el almidón que le da su cremosidad mágica.",
    ],
    safetyTags: ["fuego", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "Trabajar con dos hornillas encendidas (caldo y risotto) exige supervisión de un adulto.",
    allergensInfo: "Contiene LÁCTEOS (mantequilla y parmesano). Naturalmente libre de gluten.",
    checkQuestions: [
      {
        id: "n3-it-q1",
        question: "¿Por qué NO se debe lavar el arroz Arborio antes de hacer risotto?",
        options: [
          "Porque se rompe",
          "Porque necesitas su almidón superficial para lograr la textura cremosa",
          "Porque tarda más en secar",
        ],
        correctIndex: 1,
        explanation: "A diferencia del arroz blanco suelto, el risotto depende del almidón liberado.",
      },
    ],
  },
  {
    id: "n3-mexicana",
    levelNumber: 3,
    order: 5,
    title: "Comida mexicana",
    durationMinutes: 30,
    xpReward: 95,
    image: IMAGES.nivel3,
    summary: "Explora el comal, las salsas tatemadas suaves y tacos frescos balanceados con cítricos y cilantro.",
    simpleExplanation:
      "La gastronomía mexicana es Patrimonio de la Humanidad por técnicas milenarias como el tatemado en comal y el equilibrio entre maíz, hierbas frescas y acidez de limón.",
    ingredients: [
      "3 tomates rojos maduros",
      "1/4 de cebolla blanca y 1 diente de ajo",
      "Tortillas de maíz",
      "Pollo deshebrado o frijoles negros cocidos",
      "Cilantro fresco, limón y aguacate",
    ],
    utensils: [
      "Comal o sartén plana seca",
      "Pinzas de cocina",
      "Licuadora o molcajete",
      "Tabla limpia",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Tatema en comal seco",
        instruction:
          "Con supervisión adulta, asa tomates, cebolla y ajo en sartén seca a fuego medio hasta que tengan manchitas doradas/tostadas por varios lados.",
        timerSeconds: 360,
      },
      {
        stepNumber: 2,
        title: "Licúa con pulso corto",
        instruction:
          "Deja enfriar 5 minutos, licúa con pizca de sal y cilantro usando pulsos breves para conservar textura rústica.",
      },
      {
        stepNumber: 3,
        title: "Calienta tortillas y arma tus tacos",
        instruction:
          "Calienta las tortillas 20 segundos por lado en el comal, rellena con frijoles o pollo, corona con guacamole, cilantro y gotas de limón.",
      },
    ],
    chefTips: [
      "Si usas algún chile suave como poblano o jalapeño sin semillas, lávate muy bien las manos antes de tocarte la cara o los ojos.",
    ],
    commonMistakes: [
      "Echar aceite al comal para tatemar o no dejar enfriar los tomates antes de licuar.",
    ],
    safetyTags: ["fuego", "higiene"],
    requiresAdultSupervision: true,
    safetyWarning:
      "El comal caliente no tiene aceite visible pero quema al instante. Usa pinzas y nunca toques chiles picantes sin lavarte las manos.",
    allergensInfo: "Las tortillas de maíz 100% son libres de gluten, lácteos y huevo.",
    checkQuestions: [
      {
        id: "n3-mx-q1",
        question: "¿Qué aporta tatemar los tomates en comal seco antes de hacer la salsa?",
        options: [
          "Notas dulces caramelizadas y un aroma ligeramente ahumado",
          "Más agua líquida",
          "Color verde brillante",
        ],
        correctIndex: 0,
        explanation: "El calor directo concentra los azúcares del tomate y transforma su sabor.",
      },
    ],
  },
  {
    id: "n3-reposteria",
    levelNumber: 3,
    order: 6,
    title: "Repostería",
    durationMinutes: 35,
    xpReward: 100,
    image: IMAGES.nivel3,
    summary: "Aprende la precisión exacta de la pastelería preparando galletas crujientes por fuera y suaves por dentro.",
    simpleExplanation:
      "En cocina salada puedes improvisar; en repostería cada gramo cuenta. Aprenderás a cremar mantequilla, tamizar harina e integrar sin sobrebatir.",
    ingredients: [
      "115 g de mantequilla a temperatura ambiente",
      "100 g de azúcar mascabado o morena + 50 g azúcar blanca",
      "1 huevo a temperatura ambiente",
      "180 g de harina de trigo + 1/2 cdta polvo de hornear",
      "100 g de chispas de chocolate y 1 cdta esencia de vainilla",
    ],
    utensils: [
      "Báscula digital",
      "2 tazones grandes",
      "Batidor de globo o espátula",
      "Bandeja con papel encerado",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Pesa todo antes de comenzar",
        instruction:
          "Usa la báscula digital en gramos para cada ingrediente (Mise en Place de pastelería).",
      },
      {
        stepNumber: 2,
        title: "Crema mantequilla y azúcares",
        instruction:
          "Bate la mantequilla blanda con los azúcares hasta lograr una crema homogénea, luego integra el huevo y la vainilla.",
      },
      {
        stepNumber: 3,
        title: "Integra harina sin sobrebatir",
        instruction:
          "Tamiza harina y polvo de hornear; mezcla con espátula con movimientos envolventes solo hasta que no veas harina seca, luego suma el chocolate.",
      },
      {
        stepNumber: 4,
        title: "Horneado con adulto",
        instruction:
          "Forma bolitas separadas en bandeja. Un adulto hornea a 180 °C durante 11 minutos y deja enfriar 10 minutos antes de moverlas.",
        timerSeconds: 660,
        safetyReminder: "Usa guantes térmicos secos y supervisión adulta para meter y sacar la bandeja del horno.",
      },
    ],
    chefTips: [
      "Al sacar las galletas del horno aún se sienten suaves en el centro; se endurecen al enfriar.",
    ],
    commonMistakes: [
      "Batir demasiado la harina desarrolla gluten y deja galletas duras en lugar de suaves.",
    ],
    safetyTags: ["horno", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "El horno caliente y las bandejas metálicas deben manipularse con adultos y guantes térmicos.",
    allergensInfo: "Contiene GLUTEN, HUEVO, LÁCTEOS y posibles trazas de SOYA o FRUTOS SECOS en el chocolate.",
    checkQuestions: [
      {
        id: "n3-re-q1",
        question: "¿Por qué dejamos de mezclar la masa apenas desaparece la harina seca?",
        options: [
          "Para ahorrar energía",
          "Porque mezclar de más desarrolla gluten y vuelve duras las galletas o bizcochos",
          "Para que el chocolate se derrita antes",
        ],
        correctIndex: 1,
        explanation: "Integrar con suavidad conserva una miga tierna.",
      },
    ],
  },

  // ==================== NIVEL 4: CHEF AVANZADO (5 clases) ====================
  {
    id: "n4-tecnicas-pro",
    levelNumber: 4,
    order: 1,
    title: "Técnicas profesionales",
    durationMinutes: 30,
    xpReward: 110,
    image: IMAGES.nivel4,
    summary: "Trabaja con sistema Mise en Place de brigada, realiza reducciones brillantes y marinados equilibrados.",
    simpleExplanation:
      "Un chef profesional no corre ni improvisa en caos: organiza tiempos, concentra sabores mediante reducciones suaves y transforma proteínas con marinados aromáticos.",
    ingredients: [
      "1 taza de caldo o jugo de naranja natural",
      "1 cucharadita de miel o ralladura de jengibre",
      "1 cucharadita de maicena (opcional para glaseado)",
    ],
    utensils: [
      "Cacerola pequeña de fondo grueso",
      "Contenedores de Mise en Place",
      "Cuchara de cata limpia",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Organiza tu cronograma",
        instruction:
          "Ordena en tu mesa qué tarda más (horno/reducción) y qué va al último minuto (hierbas/emplatado).",
      },
      {
        stepNumber: 2,
        title: "Reducción controlada",
        instruction:
          "Con supervisión adulta, cocina el líquido a fuego medio-bajo sin tapa hasta reducir a la mitad y lograr textura de jarabe ligero que cubra la cuchara ('nappe').",
        timerSeconds: 420,
      },
      {
        stepNumber: 3,
        title: "Limpieza continua",
        instruction:
          "Limpia tu tabla y estación entre cada preparación ('clean as you go') como en las cocinas de alta gastronomía.",
      },
    ],
    chefTips: [
      "Prueba las reducciones al final porque al evaporarse el agua se concentra tanto el dulzor como la sal.",
    ],
    commonMistakes: [
      "Salar demasiado antes de reducir un caldo: al reducirse a la mitad queda doblemente salado.",
    ],
    safetyTags: ["fuego", "cuchillos"],
    requiresAdultSupervision: true,
    safetyWarning: "Las reducciones con azúcar o miel alcanzan temperaturas superiores al agua hirviendo; nunca las toques con los dedos.",
    allergensInfo: "Verifica los ingredientes del caldo o marinado si hay alergia a soya, cítricos o miel.",
    checkQuestions: [
      {
        id: "n4-tp-q1",
        question: "¿Por qué conviene añadir poca sal al iniciar una salsa que vas a reducir a la mitad?",
        options: [
          "Porque la sal se evapora",
          "Porque el agua se evapora pero la sal permanece, concentrando el sabor salado",
          "Porque frena la ebullición",
        ],
        correctIndex: 1,
        explanation: "Siempre se ajusta la sal cuando la reducción alcanzó su consistencia final.",
      },
    ],
  },
  {
    id: "n4-emplatado",
    levelNumber: 4,
    order: 2,
    title: "Emplatado",
    durationMinutes: 20,
    xpReward: 100,
    image: IMAGES.nivel4,
    summary: "Aplica reglas de composición visual, altura, contraste de color y trazos limpios de salsa.",
    simpleExplanation:
      "Comemos primero con los ojos. Aprenderás a usar el espacio vacío del plato como un marco de arte, dar altura a tus ingredientes y mantener bordes impecables.",
    ingredients: [
      "Plato ya cocinado de tu preferencia",
      "Salsa o reducción tibia",
      "Brotes frescos o ralladura de limón para contraste",
    ],
    utensils: [
      "Plato amplio de color neutro (blanco o negro mate)",
      "Cuchara sopera para salsa",
      "Pinzas de precisión o cucharas limpias",
      "Papel limpio para bordes",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Elige contraste de vajilla",
        instruction:
          "Los platos oscuros resaltan salsas doradas, hierbas verdes y salmón; los platos blancos destacan salsas rojas y pastas vibrantes.",
      },
      {
        stepNumber: 2,
        title: "Trazo de espejo o media luna",
        instruction:
          "Coloca una cucharada de salsa en el plato y desliza el dorso de la cuchara con un gesto fluido.",
      },
      {
        stepNumber: 3,
        title: "Altura y regla de los impares",
        instruction:
          "Apila elementos con suavidad para crear volumen vertical, usa grupos de 3 o 5 guarniciones y limpia siempre cualquier gota del borde.",
      },
    ],
    chefTips: [
      "Nunca decores con algo que no se pueda comer o que no aporte sabor real al plato.",
    ],
    commonMistakes: [
      "Llenar el plato hasta el borde sin dejar margen de descanso visual.",
    ],
    safetyTags: ["higiene"],
    requiresAdultSupervision: false,
    safetyWarning: "Emplata siempre con manos recién lavadas y en platos limpios y tibios si la comida es caliente.",
    allergensInfo: "No añadas semillas o brotes decorativos sin confirmar alergias de tus comensales.",
    checkQuestions: [
      {
        id: "n4-em-q1",
        question: "¿Qué regla debe cumplir cualquier elemento decorativo que coloques en un plato?",
        options: [
          "Debe ser brillante aunque sea plástico",
          "Debe ser 100% comestible y complementar el sabor del plato",
          "Debe cubrir toda la comida",
        ],
        correctIndex: 1,
        explanation: "En gastronomía moderna todo lo que está en el plato tiene propósito gustativo y visual.",
      },
    ],
  },
  {
    id: "n4-sabores",
    levelNumber: 4,
    order: 3,
    title: "Combinación de sabores",
    durationMinutes: 25,
    xpReward: 105,
    image: IMAGES.nivel4,
    summary: "Equilibra dulce, salado, ácido, amargo y umami como un chef creativo para transformar cualquier plato.",
    simpleExplanation:
      "¿Alguna vez probaste un plato y sentiste que 'le falta algo', aunque ya tiene sal? Casi siempre falta acidez, un contraste crujiente o una nota umami.",
    ingredients: [
      "Ingredientes de prueba: limón (ácido), sal, miel (dulce), tomate seco o queso (umami), rúcula (amargo suave)",
    ],
    utensils: [
      "Cucharitas de degustación",
      "Cuaderno de notas del chef",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Mapa de los 5 gustos",
        instruction:
          "Identifica cómo la acidez ilumina lo graso, el dulce suaviza lo ácido o picante, y el umami da profundidad.",
      },
      {
        stepNumber: 2,
        title: "Contraste de texturas",
        instruction:
          "Combina siempre al menos dos texturas: algo cremoso (puré/aguacate) con algo crujiente (semillas tostadas/vegetal fresco).",
      },
      {
        stepNumber: 3,
        title: "Diagnóstico al probar",
        instruction:
          "Antes de añadir más sal, pregúntate: ¿necesita frescura (limón), riqueza (aceite/mantequilla) o profundidad (hierbas/parmesano)?",
      },
    ],
    chefTips: [
      "Unas gotas de limón al final pueden salvar una crema pesada mejor que una cucharada extra de sal.",
    ],
    commonMistakes: [
      "Añadir solo sal cuando un plato sabe plano.",
    ],
    safetyTags: ["alergias"],
    requiresAdultSupervision: false,
    safetyWarning: "Usa siempre cucharitas limpias distintas cada vez que pruebes una preparación.",
    allergensInfo: "Ten precaución si experimentas contrastes con frutos secos, lácteos o mariscos.",
    checkQuestions: [
      {
        id: "n4-sb-q1",
        question: "Si una salsa cremosa resulta demasiado pesada al paladar, ¿qué elemento la equilibra mejor?",
        options: [
          "Más crema",
          "Un toque ácido como jugo de limón o vinagre suave",
          "Más harina",
        ],
        correctIndex: 1,
        explanation: "La acidez limpia el paladar y realza los demás aromas.",
      },
    ],
  },
  {
    id: "n4-internacional",
    levelNumber: 4,
    order: 4,
    title: "Cocina internacional",
    durationMinutes: 35,
    xpReward: 115,
    image: IMAGES.nivel4,
    summary: "Viaja por Asia y América Latina aprendiendo salteado aromático estilo wok y ceviche cítrico fresco.",
    simpleExplanation:
      "Cada cultura resuelve los sabores con técnicas únicas: en Asia los aromáticos (jengibre, ajo, soya) despiertan salteados rápidos; en los Andes y el Pacífico, el limón marina sabores marinos y vegetales.",
    ingredients: [
      "Vegetales en tiras finas (pimiento, zanahoria, brócoli)",
      "1 trocito de jengibre fresco rallado y 1 diente de ajo",
      "2 cucharadas de salsa de soya baja en sodio + 1 cdta aceite de sésamo",
      "Arroz jazmín cocido para acompañar",
    ],
    utensils: [
      "Sartén amplia o wok",
      "Espátula de madera",
      "Rallador fino",
      "Tabla limpia",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Mise en Place estricto antes del wok",
        instruction:
          "En cocina asiática se cocina en 4 minutos: todo debe estar cortado y medido antes de encender el fuego.",
      },
      {
        stepNumber: 2,
        title: "Salteado rápido y ordenado",
        instruction:
          "Con supervisión adulta, saltea primero las verduras más firmes (zanahoria 2 min), luego las suaves (pimiento) y al final jengibre/ajo 30 segundos.",
        timerSeconds: 180,
        safetyReminder: "El fuego medio-alto en sartén amplia debe estar vigilado por un adulto.",
      },
      {
        stepNumber: 3,
        title: "Glaseado aromático final",
        instruction:
          "Apaga o baja el fuego, añade la soya y gotitas de aceite de sésamo, mezcla y sirve sobre arroz caliente.",
      },
    ],
    chefTips: [
      "Añade el aceite de sésamo tostado al final: si se cocina mucho pierde su aroma tostado.",
    ],
    commonMistakes: [
      "Poner el ajo y jengibre desde el minuto cero: se queman antes de que la zanahoria esté lista.",
    ],
    safetyTags: ["fuego", "cuchillos", "alergias"],
    requiresAdultSupervision: true,
    safetyWarning: "El salteado rápido requiere supervisión adulta y mantener ingredientes secos para evitar salpicaduras.",
    allergensInfo: "La salsa de soya contiene SOYA y normalmente TRIGO (GLUTEN); el aceite de sésamo contiene SÉSAMO.",
    checkQuestions: [
      {
        id: "n4-in-q1",
        question: "¿Por qué en un salteado asiático se prepara absolutamente todo cortado antes de encender la sartén?",
        options: [
          "Porque la cocción dura pocos minutos y si buscas ingredientes se quema el plato",
          "Para enfriar los vegetales",
          "No es necesario",
        ],
        correctIndex: 0,
        explanation: "Los salteados son veloces y exigen foco continuo junto al fuego.",
      },
    ],
  },
  {
    id: "n4-creacion",
    levelNumber: 4,
    order: 5,
    title: "Creación de recetas",
    durationMinutes: 30,
    xpReward: 120,
    image: IMAGES.hero,
    summary: "Diseña tu propia receta original usando la fórmula de chef: base + proteína + salsa + contraste + seguridad.",
    simpleExplanation:
      "Graduarte de Chef Academy significa dejar de copiar recetas a ciegas y empezar a crear las tuyas. Usa nuestra matriz de diseño culinario para inventar platos equilibrados y seguros.",
    ingredients: [
      "1 base energética (arroz, pasta, papa o tortilla)",
      "1 proteína o vegetal protagonista",
      "1 salsa o emulsión aromática",
      "1 elemento fresco o crujiente de cierre",
    ],
    utensils: [
      "Ficha de diseño culinario (puedes usar también Chef Mentor IA)",
      "Utensilios según tu técnica elegida",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Elige el protagonista y la estación",
        instruction:
          "Define qué ingrediente quieres destacar y qué técnica segura (horneado, salteado, vapor o frío) le sienta mejor.",
      },
      {
        stepNumber: 2,
        title: "Diseña balance y alérgenos",
        instruction:
          "Asegura un punto ácido o fresco, una textura crujiente y anota explícitamente los alérgenos de tu creación.",
      },
      {
        stepNumber: 3,
        title: "Prueba, ajusta y documenta",
        instruction:
          "Anota cantidades exactas en gramos/cucharadas, tiempos de cocción y si un principiante necesita supervisión adulta.",
      },
    ],
    chefTips: [
      "Consulta a Chef Mentor en la pestaña Profesor IA para validar proporciones e ideas de combinación de sabores.",
    ],
    commonMistakes: [
      "Mezclar demasiados sabores fuertes a la vez (8 especias distintas que compiten entre sí).",
    ],
    safetyTags: ["higiene", "alergias", "cuchillos", "fuego"],
    requiresAdultSupervision: true,
    safetyWarning:
      "Toda receta nueva que involucre calor, horno o cortes debe ser revisada con un adulto antes de ejecutarse en cocina.",
    allergensInfo: "Documenta siempre todos los alérgenos presentes en tu ficha técnica final.",
    checkQuestions: [
      {
        id: "n4-cr-q1",
        question: "¿Qué cuatro pilares garantizan que una receta inventada funcione bien?",
        options: [
          "Solo sal y mantequilla",
          "Base + Protagonista + Salsa equilibrada + Contraste de textura/frescura",
          "Usar al menos 12 especias diferentes",
        ],
        correctIndex: 1,
        explanation: "Esa estructura ofrece nutrición, sabor balanceado y contraste en cada bocado.",
      },
    ],
  },
];
