/**
 * Etapa 3: tiers, niveles de evidencia, compuerta humana, procedencia y ledger.
 *
 * - Sin `tier: hipotesis` en content/.
 * - `reportado` ⇒ ≥ 2 fuentes de distinto `grupo` de medio (aviso si todas comparten alineamiento).
 * - `inferencia` ⇒ `cadena` no vacía.
 * - `textual` ⇒ ≥ 1 fuente video | documento_oficial | diario_de_sesiones.
 * - Aprobación humana (hash en data/aprobaciones.json) para: casos publicados,
 *   giros cambio_total + sin_explicacion publicados, y registros publicados con
 *   alguna fuente `verificacion: manual`. Si el registro cambió después de aprobarse, falla.
 * - Procedencia: la exige el esquema; acá se comprueba que la corrida exista con
 *   sus artefactos y que agente_sha / brief_sha coincidan con lo guardado en la corrida.
 * - Ledger: toda URL de un registro publicado con entrada `ok: false` es error;
 *   sin entrada es aviso "sin verificar en ledger" (el ledger lo llena `--red`).
 *
 * En modo --inbox las reglas de nivel de evidencia son avisos (el editor decide el
 * tier) y no se exigen tier, aprobación, procedencia ni ledger. En content/ esas
 * reglas son error solo para `publicado`: un registro en `probable` está ahí
 * justamente porque le falta una segunda fuente o un registro primario (CLAUDE.md,
 * "Tiers"; README, "pnpm validar termina con código 1"), así que se reportan como
 * aviso y el sitio lo sirve con banner y noindex.
 */
import path from 'node:path';
import { hashCanonico, leerAprobaciones, ultimaAprobacion, type Aprobacion } from '../lib/aprobaciones.ts';
import { COLECCIONES_REFERENCIA, recorrerEvidencias, recorrerFuentes, type Contenido, type Registro } from '../lib/contenido.ts';
import { hashDelBrief, leerAgentesJson, verificarArtefactos } from '../lib/corridas.ts';
import { leerLedger, type Ledger } from '../lib/ledger.ts';
import { resultadoVacio, type ResultadoEtapa } from './tipos.ts';

export interface OpcionesTiers {
  aprobacionesPath?: string;
  ledgerPath?: string;
  corridasDir?: string;
  modoInbox?: boolean;
}

const TIPOS_PRIMARIOS = new Set(['video', 'documento_oficial', 'diario_de_sesiones']);

/** true si el registro exige aprobación humana en tier publicado. */
export function requiereAprobacion(reg: Registro): { requiere: boolean; motivo: string } {
  const d = reg.datos;
  // La compuerta humana en casos existe para el terreno donde hay algo que decidir: una acusacion
  // sin resolver sobre una persona nombrada, donde publicar es una decision con costo y con riesgo
  // legal. Cuando el proceso judicial ya termino en condena, absolucion o archivo, un tribunal
  // dedico a eso tiempo y recursos, el hecho es publico y firmado, y una firma nuestra no agrega
  // criterio: solo agrega demora y convierte la compuerta en un tramite. Una compuerta que siempre
  // dice que si no filtra nada y ademas anuncia una revision que no ocurre.
  const RESUELTOS = new Set(['condena', 'cerrado_sin_condena']);
  if (reg.coleccion === 'casos' && !RESUELTOS.has(String(d.etiqueta_legal))) {
    return { requiere: true, motivo: 'un caso sin resolución judicial requiere aprobación humana antes de publicarse' };
  }
  if (reg.coleccion === 'giros' && d.cambio === 'cambio_total' && d.explicacion === 'sin_explicacion') {
    return { requiere: true, motivo: 'un giro cambio_total + sin_explicacion requiere aprobación humana' };
  }
  let manual = false;
  recorrerFuentes(d, (f) => {
    if (f.verificacion === 'manual') manual = true;
  });
  if (manual) return { requiere: true, motivo: 'tiene fuentes con verificacion: manual, que requieren aprobación humana' };
  return { requiere: false, motivo: '' };
}

/**
 * Marcas de futuro: una nota que dice que alguien "anunció que renunciará" documenta el anuncio, no
 * la renuncia. Valen a cualquier distancia de la fecha del mandato, porque el problema no es cuándo
 * se publicó sino qué afirma.
 */
const CITA_EN_FUTURO =
  /\b(anunci[óo] que (?:renunciar|dejar|abandonar|se ir)|renunciar[áa]|dejar[áa] el cargo|asumir[áa]|ser[áa] (?:el|la) (?:nuev|próxim)|se prevé que|prevé que)/i;

/**
 * Marcas de presente. Solas no dicen nada: "actual INAU" es el nombre de una institución y "el
 * actual presidente" puede referirse a otra persona. Lo que las vuelve sospechosas es que la nota
 * sea contemporánea del cese que se le hace probar: una nota del mismo día que dice "el actual
 * embajador" está documentando que la persona seguía en el cargo, no que lo dejó. Ese fue el error
 * real que tuvo la ficha de Hierro López durante dos años y medio.
 */
const CITA_EN_PRESENTE = /\b(actual(mente)?|hoy en día|est[áa] en funciones|contin[úu]a (?:al frente|en el cargo))/i;

/** Días de margen para considerar que una fuente es contemporánea del fin del mandato. */
const DIAS_CONTEMPORANEA = 30;

function diasEntre(a: string, b: string): number {
  const ms = Math.abs(Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`));
  return Number.isNaN(ms) ? Infinity : ms / 86_400_000;
}

export function validarTiers(contenido: Contenido, opciones: OpcionesTiers = {}): ResultadoEtapa {
  const r = resultadoVacio();
  const modoInbox = opciones.modoInbox === true;
  const aprobacionesPath = opciones.aprobacionesPath ?? path.join(contenido.rootDir, 'data', 'aprobaciones.json');
  const ledgerPath = opciones.ledgerPath ?? path.join(contenido.rootDir, 'data', 'fuentes-ledger.json');
  const corridasDir = opciones.corridasDir ?? path.join(contenido.rootDir, 'data', 'corridas');

  let aprobaciones: Aprobacion[] = [];
  let ledger: Ledger = {};
  if (!modoInbox) {
    try {
      aprobaciones = leerAprobaciones(aprobacionesPath);
    } catch (e) {
      r.errores.push({ archivo: 'data/aprobaciones.json', campo: '(archivo)', mensaje: (e as Error).message });
    }
    try {
      ledger = leerLedger(ledgerPath);
    } catch (e) {
      r.errores.push({ archivo: 'data/fuentes-ledger.json', campo: '(archivo)', mensaje: (e as Error).message });
    }
  }

  const medioDe = (slug: string) => contenido.obtener('medios', slug)?.datos;
  // Cache de artefactos por corrida para no releer el disco por registro.
  const corridas = new Map<string, ReturnType<typeof verificarArtefactos> & { agentes: ReturnType<typeof leerAgentesJson>; brief: string | null }>();
  const estadoCorrida = (id: string) => {
    if (!corridas.has(id)) {
      const dir = path.join(corridasDir, id);
      corridas.set(id, { ...verificarArtefactos(dir), agentes: leerAgentesJson(dir), brief: hashDelBrief(dir) });
    }
    return corridas.get(id)!;
  };

  for (const reg of contenido.registros) {
    if (modoInbox && !reg.enInbox) continue; // en modo inbox solo se juzga la corrida
    const d = reg.datos;
    const tier: string | undefined = d.revision?.tier;
    const publicado = tier === 'publicado';
    // Precisión de las fechas de mandato. El esquema acepta año y mes sueltos porque exigir día
    // exacto borraba cargos reales, pero la excepción tiene que verse: si nadie la mira, la
    // próxima ficha se carga con el año aunque la fuente diga el día, y la imprecisión deja de ser
    // lo que la fuente permitió para pasar a ser lo que el agente no buscó.
    if (reg.coleccion === 'politicos') {
      for (const [i, m] of (d.mandatos ?? []).entries()) {
        // Una cita que habla del presente o del futuro no puede probar que un mandato terminó.
        // Es el error que más se repitió en este proyecto: se cerró una embajada en 2022 con una
        // nota que ese mismo día decía "el actual embajador", se dio por renunciado a alguien con
        // una nota que decía "anunció que renunciará", y se probó un mandato con un diario de
        // sesiones que listaba a la persona como ausente. El validador no puede saber si la cita
        // sostiene la afirmación —eso es semántico— pero sí puede señalar dónde mirar.
        if (m?.hasta) {
          for (const [j, f] of (m.fuentes ?? []).entries()) {
            const cita = String(f?.cita ?? '');
            const futuro = CITA_EN_FUTURO.exec(cita);
            const presente = CITA_EN_PRESENTE.exec(cita);
            const contemporanea = typeof f?.fecha === 'string' && diasEntre(f.fecha, String(m.hasta)) <= DIAS_CONTEMPORANEA;
            const marca = futuro?.[0] ?? (presente && contemporanea ? presente[0] : null);
            if (marca) {
              r.avisos.push({
                archivo: reg.archivo,
                campo: `mandatos.${i}.fuentes.${j}.cita`,
                mensaje: futuro
                  ? `La cita que cierra "${m.cargo}" dice "${marca}": documenta un anuncio, no el hecho. Comprobá que exista una fuente del hecho consumado.`
                  : `La cita que cierra "${m.cargo}" dice "${marca}" y la fuente es del mismo período que el fin del cargo. Comprobá que documente el cese y no que la persona seguía en funciones.`,
              });
            }
          }
        }
        for (const extremo of ['desde', 'hasta'] as const) {
          const v = m?.[extremo];
          if (typeof v === 'string' && /^\d{4}(-\d{2})?$/.test(v)) {
            r.avisos.push({
              archivo: reg.archivo,
              campo: `mandatos.${i}.${extremo}`,
              mensaje: `Fecha con precisión de ${/^\d{4}$/.test(v) ? 'año' : 'mes'} ("${v}") en el cargo "${m.cargo}". Se acepta, pero si la fuente dice el día exacto, ponelo.`,
            });
          }
        }
      }
    }

    // Nivel de evidencia: error solo en publicado; en probable (y en modo inbox) es aviso.
    const nivelEs = modoInbox || !publicado ? r.avisos : r.errores;

    // 1. hipotesis nunca en content/.
    if (!modoInbox && tier === 'hipotesis') {
      r.errores.push({ archivo: reg.archivo, campo: 'revision.tier', mensaje: 'tier "hipotesis" no puede estar en content/: las hipótesis viven en hipotesis/ (privado).' });
    }

    // 2. Niveles de evidencia.
    recorrerEvidencias(d, (ev, ruta) => {
      const fuentes = ev.fuentes ?? [];
      if (ev.nivel === 'reportado') {
        const grupos = new Set<string>();
        const alineamientos = new Set<string>();
        for (const f of fuentes) {
          const m = medioDe(f.medio);
          if (m) {
            grupos.add(m.grupo);
            alineamientos.add(m.alineamiento?.etiqueta ?? 'sin_datos');
          }
        }
        if (grupos.size < 2) {
          nivelEs.push({
            archivo: reg.archivo,
            campo: `${ruta}.fuentes`,
            mensaje: `Nivel reportado con un solo grupo de medios (${[...grupos].join(', ') || 'ninguno resuelto'}): se exigen al menos 2 fuentes de distinto grupo (content/medios/*.grupo).`,
          });
        } else if (alineamientos.size === 1) {
          r.avisos.push({
            archivo: reg.archivo,
            campo: `${ruta}.fuentes`,
            mensaje: `Todas las fuentes comparten alineamiento "${[...alineamientos][0]}"; conviene una de otro alineamiento.`,
          });
        }
      }
      if (ev.nivel === 'inferencia' && (!ev.cadena || ev.cadena.length === 0)) {
        nivelEs.push({ archivo: reg.archivo, campo: `${ruta}.cadena`, mensaje: 'Nivel inferencia sin cadena: se exige la lista ordenada de pasos con su fuente.' });
      }
      if (ev.nivel === 'textual' && !fuentes.some((f) => TIPOS_PRIMARIOS.has(f.tipo))) {
        nivelEs.push({
          archivo: reg.archivo,
          campo: `${ruta}.fuentes`,
          mensaje: 'Nivel textual sin registro primario: se exige al menos una fuente de tipo video, documento_oficial o diario_de_sesiones (o bajar a reportado).',
        });
      }
    });

    if (modoInbox) continue;

    // 3. Compuerta humana.
    if (publicado) {
      const { requiere, motivo } = requiereAprobacion(reg);
      if (requiere) {
        const hash = hashCanonico(reg.crudo);
        const ultima = ultimaAprobacion(aprobaciones, reg.coleccion, reg.id);
        if (!ultima) {
          r.errores.push({
            archivo: reg.archivo,
            campo: 'revision.tier',
            mensaje: `Sin aprobación humana: ${motivo}. Corré pnpm aprobar ${reg.archivo} (solo un humano) o bajá el tier a probable.`,
          });
        } else if (ultima.hash !== hash) {
          r.errores.push({
            archivo: reg.archivo,
            campo: 'revision.tier',
            mensaje: `Aprobación desactualizada: el registro cambió después de aprobarse (hash actual ${hash.slice(0, 12)}…, aprobado ${ultima.hash.slice(0, 12)}… el ${ultima.fecha} por ${ultima.por}). Volvé a correr pnpm aprobar ${reg.archivo}.`,
          });
        }
      }
    }

    // 4. Procedencia: corrida existente con artefactos y hashes coherentes.
    const p = d.procedencia;
    if (p && p.tipo !== 'correccion') {
      const est = estadoCorrida(p.corrida);
      if (!est.existe) {
        r.errores.push({ archivo: reg.archivo, campo: 'procedencia.corrida', mensaje: `No existe la corrida data/corridas/${p.corrida}/.` });
      } else {
        if (est.faltantes.length) {
          r.errores.push({
            archivo: reg.archivo,
            campo: 'procedencia.corrida',
            mensaje: `La corrida ${p.corrida} está incompleta: faltan ${est.faltantes.join(', ')}.`,
          });
        }
        if (est.brief && est.brief !== p.brief_sha) {
          r.errores.push({ archivo: reg.archivo, campo: 'procedencia.brief_sha', mensaje: `brief_sha no coincide con el SHA-256 de data/corridas/${p.corrida}/brief.md (${est.brief.slice(0, 12)}…).` });
        }
        const ag = est.agentes?.agentes?.[p.agente];
        if (est.agentes && !ag) {
          r.errores.push({ archivo: reg.archivo, campo: 'procedencia.agente', mensaje: `El agente "${p.agente}" no figura en data/corridas/${p.corrida}/agentes.json.` });
        } else if (ag && ag.sha256 !== p.agente_sha) {
          r.errores.push({ archivo: reg.archivo, campo: 'procedencia.agente_sha', mensaje: `agente_sha no coincide con el hash de ${ag.archivo} guardado en agentes.json de la corrida (${ag.sha256.slice(0, 12)}…).` });
        }
      }
    } else if (!p && !COLECCIONES_REFERENCIA.has(reg.coleccion) && reg.coleccion !== 'correcciones') {
      // El esquema ya lo exige; esto solo cubre esquemas futuros que lo dejen opcional.
      r.errores.push({ archivo: reg.archivo, campo: 'procedencia', mensaje: 'Falta procedencia (la escribe pnpm promover).' });
    }

    // 5. Ledger.
    if (publicado) {
      recorrerFuentes(d, (f, ruta) => {
        const e = ledger[f.url];
        if (!e) {
          r.avisos.push({ archivo: reg.archivo, campo: `${ruta}.url`, mensaje: `Sin verificar en ledger: ${f.url} (corré pnpm validar:red).` });
        } else if (!e.ok && e.http === null) {
          // La entrada existe pero nadie consultó la fuente: la creó `pnpm archivar` y lo único que
          // falló fue el pedido a Wayback. Eso no dice nada sobre si la fuente está viva, así que no
          // puede bloquear la publicación. Que la fuente responda lo decide `pnpm validar:red`.
          r.avisos.push({
            archivo: reg.archivo,
            campo: `${ruta}.url`,
            mensaje: `Sin copia archivada y sin verificar por HTTP: ${f.url}${e.error ? ` (${e.error})` : ''}. Corré pnpm validar:red y pnpm archivar.`,
          });
        } else if (!e.ok) {
          r.errores.push({
            archivo: reg.archivo,
            campo: `${ruta}.url`,
            mensaje: `Fuente caída y sin copia archivada según el ledger (HTTP ${e.http}, ${e.checked_at.slice(0, 10)}): ${f.url}. Corré pnpm archivar o bajá el tier.`,
          });
        }
      });
    }
  }

  return r;
}
