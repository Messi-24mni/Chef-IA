import type { MealType, Recipe } from "../types/academy";
import { extractIngredientFocus } from "./originalDishNames";

export interface PdfGuideInput {
  n: number;
  t: string;
  c: string;
  cf: string;
  f: string;
  m: MealType;
  ing: Array<{ item: string; amount: number; unit: string }>;
  st: string[];
}

export interface GlossaryEntry {
  term: string;
  meaning: string;
}

const CULINARY_GLOSSARY: Array<{ pattern: RegExp; term: string; meaning: string }> = [
  {
    pattern: /mise en place/i,
    term: "Mise en place",
    meaning: "Tener todos los ingredientes lavados, cortados y medidos en tazones antes de encender la estufa.",
  },
  {
    pattern: /sofr[ií]e|sofre[ií]r/i,
    term: "Sofreír",
    meaning: "Cocinar poco a poco los alimentos en una sartén u olla con poquito aceite a fuego medio-bajo, moviendo seguido hasta que estén suaves y huelan rico.",
  },
  {
    pattern: /al dente/i,
    term: "Al dente",
    meaning: "Cuando la pasta o verdura ya está cocida y suave por fuera, pero conserva un puntito firme al morderla (sin quedar aguada).",
  },
  {
    pattern: /emulsiona|emulsi[oó]n/i,
    term: "Emulsionar",
    meaning: "Mezclar dos líquidos que normalmente se separan (como aceite y limón, o salsa y agua de pasta) agitando o moviendo rápido hasta que queden cremosos y unidos.",
  },
  {
    pattern: /saltea|saltear/i,
    term: "Saltear",
    meaning: "Cocinar trocitos pequeños de comida en sartén con poco aceite moviéndolos todo el tiempo para que se doren por fuera y sigan crujientes por dentro.",
  },
  {
    pattern: /tamiza|tamizar/i,
    term: "Tamizar",
    meaning: "Pasar ingredientes secos como harina o cacao por un colador fino dando golpecitos para quitar bolitas o grumos.",
  },
  {
    pattern: /\bcrema\s+la\s+mantequilla|\bcremar/i,
    term: "Cremar",
    meaning: "Batir mantequilla blanda junto con el azúcar hasta que cambie a un color más clarito y parezca una crema suave.",
  },
  {
    pattern: /\broux\b/i,
    term: "Roux",
    meaning: "Mezcla cocida de partes iguales de mantequilla y harina que sirve para espesar salsas cremosas sin que queden grumos.",
  },
  {
    pattern: /tatema|tatemada/i,
    term: "Tatemar",
    meaning: "Asar tomates, cebolla o chiles directo en una sartén o comal seco (sin aceite) hasta que les salgan manchitas oscuras llenas de sabor.",
  },
  {
    pattern: /poch[eé]|pochar|escalfado/i,
    term: "Pochar",
    meaning: "Cocinar un alimento suavemente en agua caliente con burbujitas muy pequeñas (sin que hierva fuerte) para que quede tierno.",
  },
  {
    pattern: /gratinar|gratinado/i,
    term: "Gratinar",
    meaning: "Derretir queso en el horno hasta que forme una capita dorada y burbujeante por encima.",
  },
  {
    pattern: /reducci[oó]n|reduce/i,
    term: "Reducir",
    meaning: "Cocinar un líquido a fuego suave sin tapa para que se evapore parte del agua y quede una salsa más espesa y con más sabor.",
  },
  {
    pattern: /precalienta|precalentar/i,
    term: "Precalentar",
    meaning: "Encender el horno unos 10 minutos antes de meter la comida (con un adulto) para que ya tenga la temperatura exacta desde el inicio.",
  },
  {
    pattern: /forma envolvente|sin sobrebatir/i,
    term: "Mezcla envolvente",
    meaning: "Mover la espátula despacio haciendo círculos suaves desde el fondo hacia arriba, sin batir rápido, para que la masa no quede dura.",
  },
  {
    pattern: /nacarado|nacarar/i,
    term: "Nacarar",
    meaning: "Mover el arroz crudo en sartén con un poco de aceite o mantequilla durante 1 o 2 minutos hasta que los bordes del grano se vean transparentes como perla.",
  },
];

export function buildYouthPdfDescription(r: PdfGuideInput): string {
  const focus = extractIngredientFocus(r.t, r.ing);
  switch (r.f) {
    case "Arroz":
      return `Un arroz suelto y lleno de aroma al estilo de ${r.c}, preparado con ${focus}. En esta receta aprendes a medir el agua exacta para que el grano quede suave y no se pegue.`;
    case "Sopas y Caldos":
      return `Una sopa tibia, reconfortante y muy fácil inspirada en la cocina de ${r.c} con ${focus}. Ideal para aprender a cocinar a fuego suave y combinar sabores caseros.`;
    case "Pastas y Fideos":
      return `Un plato clásico de pasta al estilo de ${r.c} acompañado de ${focus}. Aprenderás a cocer la pasta al punto justo y mezclarla para que quede deliciosa.`;
    case "Tortitas y Bocados":
      return `Tortitas doraditas por fuera y suaves por dentro con ${focus}, inspiradas en ${r.c}. Se arman fácil con cuchara y se cocinan en sartén con muy poquito aceite.`;
    case "Ensaladas":
      return `Una ensalada fresca, colorida y crujiente con ${focus} al estilo de ${r.c}. Casi no usa calor y te enseña a lavar, secar y aderezar vegetales como un chef.`;
    case "Al Horno":
      return `Una bandeja de vegetales dorados al horno con ${focus} y toques de ${r.c}. El calor del horno resalta su dulzor natural casi sin esfuerzo (con ayuda adulta en el horno).`;
    case "Salteados y Wok":
      return `Un plato rápido y colorido cocinado en sartén amplia o wok con ${focus} al estilo de ${r.c}. Aprenderás a tener todo listo antes de empezar para cocinar en pocos minutos.`;
    case "Panqueques":
      return `Panqueques suaves y esponjosos para el desayuno con un toque especial de ${focus} e inspiración de ${r.c}. Perfectos para practicar cómo voltear en sartén sin romperlos.`;
    case "Postres de Fruta":
      return `Un vasito dulce y refrescante de fruta fresca con yogur y avena al estilo de ${r.c}. No necesita estufa ni horno: solo mezclar con cuidado y disfrutar frío.`;
    case "Guisos y Legumbres":
      return `Un guiso casero muy nutritivo de legumbres y tomate con ${focus} inspirado en ${r.c}. Te enseña cómo cocinar a fuego lento hasta que la salsa quede espesa y sabrosa.`;
    default:
      return `Receta casera paso a paso de ${r.c} con ${focus}, pensada para aprender técnicas sencillas de cocina segura.`;
  }
}

export function buildYouthPdfSteps(r: PdfGuideInput): string[] {
  const focus = extractIngredientFocus(r.t, r.ing);
  const rawLower = r.ing.map((i) => i.item.toLowerCase()).join(" ");
  const hasChicken = rawLower.includes("pollo");
  const hasEgg = rawLower.includes("huevo");

  switch (r.f) {
    case "Arroz":
      return [
        `Prepara tu espacio: lávate las manos 20 segundos con agua y jabón, mide todos los ingredientes y ten lista la olla con su tapa. Si necesitas cortar ${focus}, hazlo con calma y con los dedos doblados hacia adentro junto a un adulto.`,
        `Lava la taza de arroz en un colador bajo el chorro de agua fría moviéndolo con tu mano limpia hasta que el agua salga casi transparente (así el arroz queda suelto y no pegajoso).`,
        `Con un adulto cerca, calienta la olla a fuego medio-bajo con la cucharadita de aceite y sofríe (cocina moviendo suave 1 a 2 minutos) ${focus} hasta que huela muy rico.`,
        `Agrega el arroz escurrido, las 2 tazas de agua o caldo y una pizca de sal. Cuando empiece a hacer burbujitas (hervir), baja la llama al mínimo, pon la tapa y deja cocinar 15 minutos SIN abrir la olla.`,
        `Apaga la estufa y espera 5 minutos con la olla tapada. Pide a un adulto abrir la tapa inclinando el vapor lejos de tu cara, suelta el arroz con un tenedor y prueba si necesita un poquito más de sal antes de servir.`,
      ];
    case "Sopas y Caldos":
      return [
        `Lávate las manos y organiza todo sobre la mesa. Lava bien los vegetales y córtalos en trocitos del mismo tamaño (pide ayuda de un adulto para usar el cuchillo) para que se cocinen al mismo tiempo.`,
        `En una olla mediana a fuego medio-bajo con un adulto, calienta la cucharadita de aceite y sofríe ${focus} durante 3 a 4 minutos moviendo con cuchara de madera hasta que se ablanden un poco y huelan delicioso.`,
        `Vierte con cuidado el agua o caldo y agrega una pizca de sal y condimentos. Sube el fuego un poco hasta que veas burbujas suaves y luego bájalo para que hierva despacito (sin salpicar).`,
        `Cocina de 15 a 20 minutos moviendo de vez en cuando hasta que al pinchar ${focus} con un tenedor entren suaves.${hasChicken ? " Confirma que el pollo esté completamente blanco por dentro sin partes rosadas." : ""}`,
        `Apaga la estufa, deja reposar 2 minutos para no quemarte la lengua y sirve con cucharón en tazones.`,
      ];
    case "Pastas y Fideos":
      return [
        `Pon a calentar una olla grande con abundante agua y un adulto cerca. Mientras tanto, prepara y mide ${focus} y los condimentos para tener todo listo (mise en place).`,
        `Cuando el agua tenga burbujas grandes (esté hirviendo), agrega una pizca de sal y coloca la pasta con cuidado. Mueve suavemente los primeros 2 minutos para que no se pegue al fondo.`,
        `Cocina el tiempo que dice el paquete hasta que la pasta esté "al dente" (suave por fuera pero firme al morderla, sin quedar aguada). Antes de colarla, saca media taza del agua caliente de la olla con ayuda de un adulto.`,
        `Pide al adulto escurrir la pasta en el colador en el fregadero. Luego, en una sartén u olla tibia, mezcla ${focus} con el poquito de aceite y añade 2 o 3 cucharadas del agua de pasta para crear una salsita brillante.`,
        `Integra la pasta caliente moviendo suavemente durante 1 minuto para que absorba todo el sabor, apaga el fuego y sirve enseguida.`,
      ];
    case "Tortitas y Bocados":
      return [
        `Lávate las manos y reúne un tazón, tenedor, sartén antiadherente y espátula. Asegúrate de que ${focus} esté bien picado en trocitos pequeños y ya cocido si así lo indica la lista.`,
        `En el tazón mezcla ${focus} junto con ${hasEgg ? "el huevo (lávate las manos después de romperlo), " : ""}la harina, cebolla y una pizca de sal hasta obtener una masa espesa que no se desarme fácil.`,
        `Con un adulto supervisando la estufa, calienta la sartén a fuego medio con una gotita de aceite esparcida. Forma tortitas pequeñas y delgadas con una cuchara (no las hagas muy gruesas para que se cocinen bien por dentro).`,
        `Cocina 3 minutos sin moverlas hasta que los bordes se vean doraditos y firmes. Desliza la espátula por debajo con cuidado y voltéalas para dorar el otro lado otros 3 minutos.`,
        `Comprueba que el centro esté bien cocido y calientito${hasChicken || hasEgg ? " (sin partes húmedas o crudas)" : ""}, pasa a un plato y deja entibiar 1 minuto antes de comer.`,
      ];
    case "Ensaladas":
      return [
        `Lávate las manos 20 segundos con jabón. Lava muy bien todas las hojas verdes y vegetales bajo agua limpia; después sécalos con papel absorbente o centrifugador para que el aderezo no resbale.`,
        `Sobre una tabla limpia para vegetales, corta en trozos cómodos para un bocado el tomate y ${focus} (si necesitas cuchillo afilado, usa la mano en forma de garra con un adulto cerca).`,
        hasChicken || hasEgg
          ? `Asegúrate de que el pollo o ingrediente cocido ya esté bien cocido (totalmente firme y sin partes rosadas) y frío o tibio antes de juntarlo con la lechuga.`
          : `Coloca primero las hojas secas en una ensaladera grande y acomoda encima los vegetales frescos por colores.`,
        `En una tacita aparte o frasco pequeño con tapa, mezcla el aceite, el jugo de limón y una pizca de sal agitando o batiendo con tenedor durante 15 segundos hasta que se unan.`,
        `Vierte el aderezo justo antes de sentarte a comer y mezcla suavemente con dos cucharas para que las hojas sigan crujientes.`,
      ];
    case "Al Horno":
      return [
        `Pide a un adulto precalentar el horno a 200 °C (encenderlo 10 minutos antes) y forra una bandeja de horno con papel vegetal para que no se pegue nada.`,
        `Lava bien los vegetales y córtalos junto a ${focus} en trozos del mismo tamaño para que todos estén listos al mismo tiempo.`,
        `Pon todo en un tazón grande, agrega la cucharada de aceite, hierbas, sal y pimienta, y mezcla con tus manos limpias o una cuchara hasta que cada trocito brille con una capa fina de aceite.`,
        `Acomoda los trozos separados en la bandeja sin amontonarlos (si quedan encimados se cuecen al vapor y no se doran). Un adulto mete la bandeja al horno usando guantes térmicos secos.`,
        `A mitad del tiempo (aprox. 12-15 minutos), el adulto saca un momento la bandeja para voltearlos con espátula. Están listos cuando los bordes se ven dorados y un tenedor entra suave.${hasChicken ? " Si lleva pollo, confirma que llegue a 74 °C y quede blanco por dentro." : ""}`,
      ];
    case "Salteados y Wok":
      return [
        `Regla número uno del salteado: prepara TODO antes de prender el fuego (mise en place). Lava, corta en tiras delgadas y deja medidos ${focus}, el ajo y cualquier salsa junto a la estufa.`,
        `Con un adulto supervisando, calienta el wok o sartén grande a fuego medio durante 1 minuto y agrega la cucharadita de aceite.`,
        `Añade primero el ajo y mueve rápido 20 segundos sin dejar que se ponga oscuro (el ajo quemado sabe amargo).`,
        `Agrega ${focus} y mueve todo el tiempo con la espátula de madera durante 3 a 4 minutos hasta que se vean brillantes, tiernos pero todavía un poquito crujientes.`,
        `Si lleva tofu, pollo ya cocido o legumbres, agrégalos al final y mezcla 2 minutos más hasta que todo esté bien caliente. Apaga el fuego y sirve de inmediato.`,
      ];
    case "Panqueques":
      return [
        `Lávate las manos y alista un tazón, tenedor o batidor, cuchara medidora y una sartén antiadherente.`,
        `Mezcla primero en el tazón la harina, el polvo de hornear y una pizquita de sal. Luego agrega el huevo (lávate las manos tras tocar cáscara cruda), la leche y ${focus} bien picadito o triturado.`,
        `Bate suavemente solo hasta que ya no se vea harina seca (si quedan unos poquitos grumos chiquitos no pasa nada; batir de más deja los panqueques duros).`,
        `Con un adulto junto a la estufa, calienta la sartén a fuego medio-bajo y engrasa apenas con unas gotitas de aceite. Vierte porciones pequeñas dejando espacio entre ellas.`,
        `Espera sin aplastarlos hasta que salgan burbujitas por toda la parte de arriba y los bordes se vean sequitos (unos 2 minutos). Voltéalos con la espátula y cocina 1 a 2 minutos más hasta que queden doraditos y cocidos por dentro.`,
      ];
    case "Postres de Fruta":
      return [
        `Lávate las manos 20 segundos y lava muy bien bajo el chorro de agua fría toda la fruta fresca que vas a usar.`,
        `Con calma y usando una tabla limpia, corta la fruta en trocitos pequeños del tamaño de un bocado (pide ayuda a un adulto si la fruta es dura o tiene cáscara gruesa).`,
        `En un vaso transparente o tazón bonito, coloca primero una capa de yogur natural y encima una capa de fruta fresca.`,
        `Agrega las cucharadas de avena y una pizquita de canela para dar aroma dulce sin necesidad de azúcar extra.`,
        `Si quieres, repite las capas hasta llenar el vaso y mételo al refrigerador de 10 a 15 minutos para disfrutarlo bien fresquito.`,
      ];
    case "Guisos y Legumbres":
      return [
        `Ten listos tus ingredientes sobre la mesa: escurre y enjuaga las legumbres cocidas en un colador, mide el tomate y ten a mano ${focus} y las especias.`,
        `Con un adulto cerca, calienta una olla mediana a fuego medio-bajo con unas gotitas de aceite y sofríe ${focus} durante 3 minutos moviendo con cuchara de madera hasta suavizar.`,
        `Agrega el tomate triturado, las especias (sin pasarte de cantidad) y mezcla 1 minuto para despertar el aroma.`,
        `Incorpora las legumbres cocidas y el agua o caldo. Baja la llama al mínimo para evitar salpicaduras y cocina de 12 a 18 minutos moviendo cada pocos minutos.`,
        `Sabrás que está listo cuando el caldo se vea un poquito más espeso, brillante y con buen olor. Prueba con una cuchara limpia (dejando enfriar un poquito) para ajustar la sal y sirve caliente.`,
      ];
    default:
      return r.st;
  }
}

export function buildYouthPdfChefTip(r: PdfGuideInput): string {
  switch (r.f) {
    case "Arroz":
      return `¡No levantes la tapa mientras se cocina el arroz! El vapor atrapado adentro es lo que cocina todos los granos parejos. Inspirado en ${r.c}: ${r.cf}.`;
    case "Sopas y Caldos":
      return `Corta todas las verduras de un tamaño parecido para que ninguna quede cruda ni deshecha. Prueba al final con una cuchara distinta cada vez.`;
    case "Pastas y Fideos":
      return `Guardar un poquito del agua blanca donde hirvió la pasta es el secreto de los chefs: hace que cualquier salsa se pegue mejor a los fideos.`;
    case "Tortitas y Bocados":
      return `Haz una tortita chiquita primero para probar el calor de la sartén; así las demás te saldrán doraditas y parejitas.`;
    case "Ensaladas":
      return `Secar bien las hojas de lechuga es el truco número uno para que el limón y el aceite no se resbalen al fondo del plato.`;
    case "Al Horno":
      return `Deja espacio libre entre cada trocito en la bandeja para que el aire caliente circule y queden doraditos y crujientes.`;
    case "Salteados y Wok":
      return `Ten todo picado y medido antes de encender la hornilla, porque el salteado se cocina súper rápido y no da tiempo de picar después.`;
    case "Panqueques":
      return `El primer panqueque casi siempre sale distinto porque la sartén apenas se está calentando: ¡no te desanimes, los siguientes quedan geniales!`;
    case "Postres de Fruta":
      return `Si vas a comerlo más tarde, guarda la avena aparte y ponla justo antes de servir para que se sienta más crujiente.`;
    case "Guisos y Legumbres":
      return `Cocinar a fuego bajito y moviendo el fondo de la olla evita que las legumbres se peguen y hace que los sabores de ${r.c} se mezclen mucho mejor.`;
    default:
      return `Lee toda la receta antes de empezar y ten tus utensilios listos. ¡Cocinar con orden hace todo más fácil!`;
  }
}

export function getRecipeReadySignal(recipe: Recipe): string {
  const f = (recipe.family ?? "").toLowerCase();
  const t = recipe.title.toLowerCase();

  if (f.includes("arroz") || /arroz|risotto|gohan|donburi|chahan|chao fan|pilaf|riz |paella|gallo pinto|baião|biryani|pulao|khichdi/.test(t)) {
    return "No queda agua suelta en el fondo de la olla y al probar un grano está blandito por completo (o con centro cremoso en el risotto).";
  }
  if (f.includes("sopas") || /sopa|caldo|crema|minestrone|zuppa|vellutata|miso|suimono|tang|chowder|potage|velouté|shorba|rasam|canja/.test(t)) {
    return "Los trocitos de verdura se sienten suaves al pincharlos con un tenedor y el caldo huele aromático y está bien caliente.";
  }
  if (f.includes("pastas") || /pasta|espagueti|spaghetti|tagliatelle|penne|fettuccine|fusilli|macarron|mac & cheese|lasagna|lasaña|fideo|udon|ramen|yakisoba|soba|chow mein|lo mein|fideuà|macarrão|sevai/.test(t)) {
    return "La pasta está flexible y suave pero firme al morderla (sin punto blanco duro adentro) y la salsa la cubre de forma uniforme.";
  }
  if (f.includes("panqueque") || /panqueque|pancake|hot cake|hotcake|crespelle|dorayaki|jianbing|crêpe|filloa|frisuelo|chorreada|panqueca|dosa|chilla|uttapam/.test(t)) {
    return "Salen burbujas arriba antes de voltear y ambos lados quedan dorados con centro esponjoso sin masa líquida.";
  }
  if (f.includes("tortitas") || /tortita|medall|buñuelo|bocado|frittelle|polpettine|gordita|sope|tlacoyo|okonomiyaki|korokke|galette|croqueta|bolinho|tikki|pakora/.test(t)) {
    return "Ambos lados tienen color dorado parejo y al partir una por la mitad no se ve masa húmeda ni cruda.";
  }
  if (f.includes("ensalada") || /ensalada|insalata|sarada|sunomono|liangban|salad|salade|salpicão|vinagrete|kachumber|chaat|ceviche/.test(t)) {
    return "Los vegetales están frescos, fríos y cubiertos de una capa ligera y brillante de aderezo sin agua acumulada en el fondo.";
  }
  if (f.includes("horno") || /horno|horneado|pizza|muffin|galleta|brownie|forno|cazuela|shao kao|sheet pan|gratin|ratatouille|escalivada|escondidinho|tandoori/.test(t)) {
    if (/galleta/.test(t)) return "Los bordes están doraditos aunque el centro parezca suave (se endurecen al enfriarse fuera del horno).";
    if (/brownie/.test(t)) return "Al meter un palillo de madera en el centro, sale con unas pocas migas húmedas y sin masa líquida.";
    if (/pizza/.test(t)) return "El queso está derretido burbujeante y los bordes de la masa se ven inflados y dorados.";
    return "Los bordes están doraditos y un tenedor entra sin esfuerzo en los trozos más gruesos.";
  }
  if (f.includes("postres de fruta") || /vasito|copa|parfait|avena nocturna|overnight|macedonia|biónico|kudamono|compote|kheer|fruit chaat/.test(t)) {
    return "Las capas se ven ordenadas y el vaso se siente bien frío tras unos minutos en el refrigerador.";
  }
  if (f.includes("guisos") || /guiso|estofado|potaje|curry|albóndiga|frijoles|nimono|shaguo|cassoulet|feijoada|dal |chana masala|rajma/.test(t)) {
    return "La salsa se ve ligeramente espesa (cubre la cuchara) y todo está bien cocido por dentro sin partes rosadas.";
  }
  if (/pollo|hamburguesa|filete|salmón|salmon/.test(t)) {
    return "El exterior está dorado y el interior está completamente cocido (blanco en el pollo, jugoso y opaco en salmón o firme en carne).";
  }
  if (/huevo|tortilla|omelette/.test(t)) {
    return "La clara y la yema están cocidas y suaves, brillantes y sin partes líquidas crudas.";
  }
  return "Los ingredientes están tiernos, bien cocidos y con aroma agradable.";
}

export function getYouthGlossaryForRecipe(recipe: Recipe): GlossaryEntry[] {
  const fullText = [recipe.title, recipe.description, recipe.chefTip, ...recipe.instructions].join(" ");
  const seen = new Set<string>();
  const matches: GlossaryEntry[] = [];
  for (const entry of CULINARY_GLOSSARY) {
    if (entry.pattern.test(fullText) && !seen.has(entry.term)) {
      seen.add(entry.term);
      matches.push({ term: entry.term, meaning: entry.meaning });
    }
  }
  return matches;
}
