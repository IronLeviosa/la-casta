/**
 * Tipo de un hito de empresa, para la leyenda de su línea de tiempo: la misma leyenda con hover,
 * clic y multiselección que tiene la ficha de una persona por tema. El investigador lo declara en
 * `hitos[].tipo`; cuando falta (fichas anteriores a la regla), se deduce del título y, si el título
 * no alcanza, del detalle. Los colores son fijos por tipo en todo el sitio.
 */
export const TIPOS_HITO = ['creacion', 'ley', 'monopolio', 'precios', 'capital', 'crisis', 'directorio', 'negocio', 'contable', 'otro'] as const;
export type TipoHito = (typeof TIPOS_HITO)[number];

export const NOMBRE_TIPO_HITO: Record<TipoHito, string> = {
  creacion: 'Creación y estatuto',
  ley: 'Ley o decreto',
  monopolio: 'Monopolio y competencia',
  precios: 'Precios y tarifas',
  capital: 'Dinero del Estado',
  crisis: 'Crisis y conflictos',
  directorio: 'Directorio',
  negocio: 'Negocio y contratos',
  contable: 'Contabilidad',
  otro: 'Otro',
};

/* Índice de color en la paleta de LineaTiempo (lt-c1 … lt-c10). */
export const COLOR_TIPO_HITO: Record<TipoHito, number> = {
  creacion: 8, // gris
  ley: 1, // azul
  monopolio: 4, // naranja
  precios: 9, // oliva
  capital: 3, // verde
  crisis: 2, // rojo
  directorio: 5, // violeta
  negocio: 6, // marrón
  contable: 10, // celeste
  otro: 8,
};

/* En orden de prioridad: un hito que es a la vez ley y monopolio es un cambio en la reserva legal;
   uno que fija precios de productos «no monopolizados» es de precios. */
const REGLAS: [TipoHito, RegExp][] = [
  ['precios', /precio|tarifa|paridad|\bppi\b|factor x/i],
  ['monopolio', /monopol|exclusividad|desmonopoliz|abre .{0,40}(competencia|uso de las v[ií]as)|libre importaci[oó]n|servicios operativos del puerto|abre la (generaci[oó]n|telefon[ií]a)|open access|concesionarse|reserva|dep[oó]sitos (p[uú]blicos|judiciales)/i],
  ['capital', /capitaliz|aporte de capital|capital del estado|condona|transfiere (us\$|\$|usd|los activos|.{0,25}millones)|pr[eé]stamo|deuda|\bfondo\b|fideicomiso|rentas generales|anticipo de resultados|integraci[oó]n de capital|garant[ií]as? de ancap/i],
  ['contable', /niif|estados? (contables|financieros)|reexpresar|inflaci[oó]n|resultado por (actividad|segmento)|modifica el resultado|apertura del resultado/i],
  ['crisis', /crisis|p[eé]rdida|corrida bancaria|emergencia|\bparo\b|ocupaci[oó]n|clausura|cierre|se abstiene|reclamo|diferendo|denuncia|inconstitucional|no operativa|deja de contratar|no renueva|comisi[oó]n investigadora/i],
  ['directorio', /directorio|asume la presidencia|presiden(te|ta) del|designad[oa]|revoca/i],
  ['creacion', /creaci[oó]n de|se crea|estatizaci[oó]n|carta org[aá]nica|pasa a llamarse|reorganiza|reestructura|divisi[oó]n en|se separa|primer administrador|primera reuni[oó]n/i],
  ['ley', /\bley\b|decreto|refer[eé]ndum|plebiscito|rendici[oó]n de cuentas|presupuesto|\bluc\b|marco regulatorio|art[ií]culo/i],
  ['negocio', /contrato|concesi[oó]n|planta|inversi[oó]n|invierte|subsidiaria|entra al negocio|parque e[oó]lico|inaugura|primer viaje|puesta en marcha|servicio|licencias?|asume la administraci[oó]n|proyecto|refiner[ií]a|suministro|compra|venden?|acuerdo|cese de actividades|forman|constituy|s\.a\.|cr[eé]dito|mercado/i],
];

function clasificar(texto: string): TipoHito | undefined {
  for (const [tipo, re] of REGLAS) if (re.test(texto)) return tipo;
  return undefined;
}

/**
 * `esCreacion`: el hito coincide con la fecha de creación de la empresa (la página lo sabe); sin
 * eso, «Constitución de Alcoholes del Uruguay S.A.» es creación en la ficha de ALUR y un negocio en
 * la de ANCAP, y el título solo no lo distingue.
 */
export function tipoDeHito(h: { tipo?: string | null; titulo: string; detalle?: string | null }, op: { esCreacion?: boolean } = {}): TipoHito {
  if (h.tipo && (TIPOS_HITO as readonly string[]).includes(h.tipo)) return h.tipo as TipoHito;
  if (op.esCreacion) return 'creacion';
  return clasificar(h.titulo) ?? clasificar(`${h.titulo} ${h.detalle ?? ''}`) ?? 'otro';
}
