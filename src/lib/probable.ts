/**
 * Por qué un registro quedó en `probable` y no llegó a `publicado`.
 *
 * El motivo se **deriva del propio registro**, aplicando las mismas condiciones que
 * `scripts/validadores/tiers.ts` hace cumplir. No sale de `revision.notas_internas`, que por
 * esquema son notas del editor y no se muestran en el sitio.
 *
 * El validador es la autoridad: él bloquea. Esto solo pone en palabras lo que el lector ya podría
 * deducir mirando las fuentes del registro, para que no tenga que deducirlo. Si ninguna condición
 * conocida se cumple, se dice eso y no se inventa una explicación.
 */

export interface FuenteMin {
  medio: { id: string } | string;
  tipo: string;
  verificacion?: string;
}

export interface EvidenciaMin {
  nivel: string;
  fuentes: FuenteMin[];
}

const TIPOS_PRIMARIOS = new Set(['video', 'documento_oficial', 'diario_de_sesiones']);

const idDe = (m: FuenteMin['medio']): string => (typeof m === 'string' ? m : m.id);

/** Grupos de propiedad distintos entre las fuentes, según `content/medios/*.grupo`. */
function gruposDe(fuentes: FuenteMin[], grupoPorMedio: Map<string, string>): Set<string> {
  const grupos = new Set<string>();
  for (const f of fuentes) {
    const g = grupoPorMedio.get(idDe(f.medio));
    if (g) grupos.add(g);
  }
  return grupos;
}

export interface Motivo {
  /** Etiqueta corta para filtrar y para la insignia. */
  clave:
    | 'una-sola-fuente'
    | 'mismo-grupo'
    | 'sin-primaria'
    | 'sin-documento-oficial'
    | 'espera-aprobacion'
    | 'verificacion-manual'
    | 'depende-de-otro'
    | 'otro';
  /** Una oración, en llano, para el lector. */
  texto: string;
}

/**
 * Motivos por los que este registro no puede estar en `publicado`.
 * Devuelve todos los que aplican, del más concreto al más genérico.
 */
export function motivosProbable(
  coleccion: string,
  datos: Record<string, any>,
  grupoPorMedio: Map<string, string>,
  /** Ids de registros que están en `probable`, por colección. Un giro hereda el tier de sus declaraciones. */
  probablesPorColeccion: Map<string, Set<string>> = new Map(),
): Motivo[] {
  const motivos: Motivo[] = [];
  const evidencias: EvidenciaMin[] = [];
  if (datos.evidencia?.fuentes) evidencias.push(datos.evidencia);
  if (datos.origen?.fuentes) evidencias.push(datos.origen);
  // Una promesa cuelga cada hecho posterior de su propia evidencia, y cualquiera de ellas
  // puede ser la que la frena.
  for (const h of datos.evidencias ?? []) if (h?.evidencia?.fuentes) evidencias.push(h.evidencia);
  if (datos.evidencia_explicacion?.fuentes) evidencias.push(datos.evidencia_explicacion);
  // Un caso no tiene `evidencia` arriba: cada etapa de la línea de tiempo judicial lleva la suya,
  // y cualquiera de ellas puede ser la que lo frena.
  for (const e of datos.estado_judicial ?? []) if (e?.evidencia?.fuentes) evidencias.push(e.evidencia);
  // Un veto guarda aparte las fuentes del desenlace parlamentario.
  if (datos.resultado?.fuentes?.length) evidencias.push({ nivel: 'reportado', fuentes: datos.resultado.fuentes });

  for (const ev of evidencias) {
    if (ev.nivel === 'reportado') {
      const grupos = gruposDe(ev.fuentes, grupoPorMedio);
      if (ev.fuentes.length < 2) {
        motivos.push({ clave: 'una-sola-fuente', texto: 'Lo cuenta un solo medio. Para publicarse necesita una segunda fuente de otro grupo de propiedad.' });
      } else if (grupos.size < 2) {
        const nombres = [...grupos].join(', ');
        motivos.push({
          clave: 'mismo-grupo',
          texto: `Tiene varias fuentes pero todas del mismo grupo de propiedad${nombres ? ` (${nombres})` : ''}, así que cuentan como una sola.`,
        });
      }
    }
    if (ev.nivel === 'textual' && !ev.fuentes.some((f) => TIPOS_PRIMARIOS.has(f.tipo))) {
      motivos.push({ clave: 'sin-primaria', texto: 'Está marcado como textual pero no hay video, documento oficial ni diario de sesiones que lo respalde.' });
    }
    if (ev.fuentes.some((f) => f.verificacion === 'manual')) {
      motivos.push({ clave: 'verificacion-manual', texto: 'Alguna fuente no se puede verificar de forma automática (TV sin descarga, red social o muro de pago) y necesita revisión humana.' });
    }
  }

  if (coleccion === 'chequeos' && (datos.calificacion === 'verdadero' || datos.calificacion === 'falso')) {
    const oficiales = (datos.dato_real?.fuentes ?? []).some((f: FuenteMin) => f.tipo === 'documento_oficial');
    if (!oficiales) {
      motivos.push({ clave: 'sin-documento-oficial', texto: 'Una calificación de verdadero o falso exige un documento oficial, y todavía no lo tiene.' });
    }
  }

  // Un registro que apunta a otro no puede estar mejor que aquel al que apunta.
  const decProbables = probablesPorColeccion.get('declaraciones') ?? new Set<string>();
  const refs: { campo: string; etiqueta: string }[] = [
    { campo: 'declaracion_antes', etiqueta: 'la declaración anterior' },
    { campo: 'declaracion_despues', etiqueta: 'la declaración posterior' },
    { campo: 'declaracion', etiqueta: 'la declaración que chequea' },
  ];
  const colgados = refs.filter((r) => datos[r.campo]?.id && decProbables.has(datos[r.campo].id)).map((r) => r.etiqueta);
  if (colgados.length > 0) {
    motivos.push({
      clave: 'depende-de-otro',
      texto: `Se apoya en ${colgados.join(' y ')}, que todavía está en probable. Cuando esa se publique, este registro puede subir con ella.`,
    });
  }

  if (coleccion === 'casos') {
    motivos.push({ clave: 'espera-aprobacion', texto: 'Todo caso judicial necesita la firma de una persona antes de publicarse. Este todavía no la tiene.' });
  }
  if (coleccion === 'giros' && datos.cambio === 'cambio_total' && datos.explicacion === 'sin_explicacion') {
    motivos.push({ clave: 'espera-aprobacion', texto: 'Un giro calificado como cambio total sin explicación necesita la firma de una persona antes de publicarse.' });
  }
  if (coleccion === 'vetos' && (datos.resultado?.estado === 'sin_datos' || datos.resultado?.estado === 'pendiente')) {
    motivos.push({ clave: 'otro', texto: 'Falta documentar qué hizo el Parlamento con el veto. Un veto sin desenlace no se publica.' });
  }

  // Lo que solo sabe el editor: un hueco de investigación que ninguna regla mecánica puede derivar.
  if (typeof datos.revision?.que_falta === 'string' && datos.revision.que_falta.trim()) {
    motivos.push({ clave: 'otro', texto: datos.revision.que_falta.trim() });
  }

  if (motivos.length === 0) {
    motivos.push({
      clave: 'otro',
      texto:
        'Cumple las reglas mecánicas, así que lo bajó el editor por un criterio que una máquina no puede derivar ' +
        '(por ejemplo, dos medios que publican el mismo texto y en los hechos son una sola cobertura). El motivo ' +
        'está escrito en las razones de su corrida.',
    });
  }
  // Sin repetidos, conservando el orden.
  const vistos = new Set<string>();
  return motivos.filter((m) => (vistos.has(m.texto) ? false : (vistos.add(m.texto), true)));
}
