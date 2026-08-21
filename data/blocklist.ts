/**
 * =====================================================================
 * TÉRMINOS BLOQUEADOS EN EL FORMULARIO
 * ---------------------------------------------------------------------
 * Lista de moderación: insultos y términos racistas, homófobos, sexistas
 * y xenófobos. Si el nombre o el mensaje contienen alguno, el envío se
 * rechaza y se pide reformular.
 *
 * CÓMO SE COMPARA (ver `lib/validation.ts`)
 * El texto se normaliza antes de buscar: minúsculas, sin tildes, sin
 * sustituciones tipo leet (@→a, 3→e, 1→i, 0→o, $→s) y con las letras
 * repetidas tres o más veces colapsadas. Así «p3nd3j0», «PUUUTA» e
 * «id!ota» caen igual que sus formas normales.
 *
 * La búsqueda usa LÍMITES DE PALABRA para evitar falsos positivos: sin
 * ellos, «puta» bloquearía «disputa», «Cospeito» o «reputación».
 *
 * CÓMO AMPLIARLA
 * Añade el término en minúsculas y sin tildes al bloque de su idioma.
 * Incluye las variantes de género y número cuando cambien de forma
 * (`tonto` / `tonta` / `tontos` / `tontas`), porque la comparación es
 * exacta sobre la palabra completa.
 *
 * FALSOS POSITIVOS
 * Si alguien reporta que un mensaje legítimo fue rechazado, lo más
 * probable es que una palabra corta de esta lista aparezca dentro de
 * otra. Quítala de aquí antes que relajar los límites de palabra.
 * =====================================================================
 */

/** Español de España. */
const ES_ESPANA = [
  'gilipollas', 'gilipollez', 'gilipuertas',
  'capullo', 'capulla', 'capullos',
  'subnormal', 'subnormales',
  'mongolo', 'mongola', 'mongolico', 'mongolica',
  'retrasado', 'retrasada', 'retrasados', 'retrasadas',
  'imbecil', 'imbeciles',
  'idiota', 'idiotas',
  'estupido', 'estupida', 'estupidos', 'estupidas',
  'cabron', 'cabrona', 'cabrones', 'cabronas',
  'hijoputa', 'hijaputa', 'hijosdeputa', 'hijodeputa', 'hijadeputa',
  'puta', 'putas', 'puto', 'putos', 'putada',
  'zorra', 'zorras',
  'perra', 'perras',
  'zorrona',
  'joder', 'jodete', 'jodido', 'jodida',
  'mierda', 'mierdas',
  'polla', 'pollas', 'pollon',
  'coño', 'coños', 'cono',
  'follar', 'follame', 'follada',
  'pajero', 'pajera', 'pajillero',
  'chupapollas',
  'lameculos',
  'malparido', 'malparida',
  'muerdealmohadas',
  'tonto', 'tonta', 'tontos', 'tontas', 'tontopollas',
  'payaso', 'payasa',
  'baboso', 'babosa',
  'asqueroso', 'asquerosa',
  'basura',
  'escoria',
  'pringado', 'pringada',
  'panoli',
  'soplapollas',
  'cagon', 'cagona',
  'meapilas',
];

/** Español de Latinoamérica y variantes regionales. */
const ES_LATAM = [
  'pendejo', 'pendeja', 'pendejos', 'pendejas', 'pendejada',
  'boludo', 'boluda', 'boludos', 'boludas',
  'pelotudo', 'pelotuda', 'pelotudos', 'pelotudas',
  'huevon', 'huevona', 'huevones', 'webon', 'webona',
  'chingar', 'chinga', 'chingada', 'chingado', 'chingon',
  'verga', 'vergas',
  'culero', 'culera', 'culeros',
  'cabrona', 'cabronazo',
  'mamon', 'mamona', 'mamones',
  'naco', 'naca', 'nacos',
  'gonorrea',
  'malparido', 'malparida',
  'guevon', 'guevona',
  'concha', 'conchudo', 'conchuda', 'conchatumadre', 'conchetumare',
  'carajo',
  'weon', 'weona', 'weones',
  'maricon', 'maricona', 'maricones',
  'joto', 'jotos',
  'puñeta', 'puneta',
  'cojudo', 'cojuda',
  'pinche', 'pinches',
  'mierdero',
  'zopenco', 'zopenca',
  'baboso', 'babosa',
  'tarado', 'tarada', 'tarados', 'taradas',
  'forro', 'forra',
  'chupamedias',
  'gil', 'giles',
  'trolo', 'trola',
  'sorete',
  'orto',
];

/** Gallego. */
const GALEGO = [
  'parvo', 'parva', 'parvos', 'parvas',
  'imbecil', 'imbeciles',
  'cabron', 'cabrona',
  'fillodeputa', 'fillaputa', 'filladeputa',
  'merda', 'merdas',
  'carallo',
  'peido',
  'lambecus',
  'papon',
  'lacazan', 'lacazana',
  'burro', 'burra',
  'estupido', 'estupida',
  'tolo', 'tola',
  'porco', 'porca',
];

/** Euskera. */
const EUSKERA = [
  'kabroi', 'kabroia',
  'putakume', 'putakumea',
  'zakil',
  'ipurdi',
  'txotxolo', 'txotxoloa',
  'ergel', 'ergela',
  'inozo', 'inozoa',
  'kaka',
  'zorri',
  'astoa', 'asto',
  'zikin', 'zikina',
  'lotsagabe', 'lotsagabea',
  'txorimalo',
];

/** Catalán. */
const CATALA = [
  'gilipolles',
  'imbecil', 'imbecils',
  'cabro', 'cabrons',
  'filldeputa', 'filladeputa',
  'merda', 'merdes',
  'collons',
  'polla',
  'capsigrany',
  'burro', 'burra',
  'idiota', 'idiotes',
  'estupid', 'estupida', 'estupids',
  'malparit', 'malparida',
  'llepaculs',
  'purria',
  'brut', 'bruta',
  'ximple', 'ximples',
  'talos',
];

/** Inglés. */
const ENGLISH = [
  'fuck', 'fucker', 'fucking', 'fucked', 'motherfucker', 'fuckoff',
  'shit', 'shitty', 'bullshit', 'shithead',
  'bitch', 'bitches', 'bitching',
  'asshole', 'assholes', 'arsehole',
  'bastard', 'bastards',
  'cunt', 'cunts',
  'dick', 'dickhead', 'dicks',
  'cock', 'cocksucker',
  'pussy',
  'whore', 'whores',
  'slut', 'sluts',
  'retard', 'retarded',
  'moron', 'morons', 'moronic',
  'idiot', 'idiots',
  'stupid',
  'scumbag',
  'douchebag', 'douche',
  'jackass',
  'wanker',
  'bollocks',
  'twat',
  'prick',
  'piss', 'pissed',
  'crap', 'crappy',
];

/**
 * Términos de odio: racistas, xenófobos, homófobos, tránsfobos,
 * capacitistas y antisemitas. Van aparte porque el criterio es distinto:
 * no son tacos, son ataques a un grupo, y aquí no cabe la tolerancia con
 * los falsos positivos.
 */
const ODIO = [
  // Racistas y xenófobos
  'negrata', 'negratas',
  'sudaca', 'sudacas',
  'moromierda',
  'panchito', 'panchita', 'panchitos',
  'gitanazo', 'gitanaco',
  'mena', 'menas',
  'chino de mierda',
  'indio de mierda',
  'nigger', 'niggers', 'nigga',
  'chink', 'chinks',
  'spic', 'spics',
  'wetback',
  'paki', 'pakis',
  'gypo', 'gyppo',
  'towelhead',
  'raghead',
  'beaner',
  // Homófobos y tránsfobos
  'maricon', 'maricona', 'maricones', 'mariconazo',
  'bollera', 'bolleras',
  'travelo', 'travelos',
  'sarasa',
  'faggot', 'faggots', 'fag', 'fags',
  'dyke', 'dykes',
  'tranny', 'trannies',
  'shemale',
  // Capacitistas
  'subnormal profundo',
  'mongolico', 'mongolica', 'mongolicos',
  'tullido', 'tullida',
  'spastic', 'spaz',
  // Antisemitas y neonazis
  'judiada',
  'kike', 'kikes',
  'heil hitler',
  'sieg heil',
  'holohoax',
  // Sexistas
  'putilla', 'putillas',
  'guarra', 'guarras',
  'fregona',
  'cacho carne',
];

/**
 * Lista final: todos los bloques juntos, sin duplicados.
 * Se ordena por longitud descendente para que las expresiones de varias
 * palabras se comprueben antes que sus partes sueltas.
 */
export const BLOCKLIST: readonly string[] = Array.from(
  new Set([...ES_ESPANA, ...ES_LATAM, ...GALEGO, ...EUSKERA, ...CATALA, ...ENGLISH, ...ODIO]),
).sort((a, b) => b.length - a.length);
