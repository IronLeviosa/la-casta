import { z } from 'astro/zod';
import { FechaISO, FechaParcial, Revision, completarFecha, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Situacion = z
  .enum(['en_cargo', 'fuera_de_cargo', 'en_prision', 'fallecido'])
  .describe('Situación actual: en_cargo, fuera_de_cargo, en_prision o fallecido.');

export const TipoSalida = z
  .enum(['fin_de_mandato', 'renuncia', 'renuncia_forzada', 'destitucion', 'fallecimiento'])
  .describe('Cómo terminó el último cargo: fin_de_mandato, renuncia, renuncia_forzada, destitucion o fallecimiento.');

export function crearPoliticoSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente').describe('Fuentes que documentan el dato (mínimo 1).');

  const Mandato = z
    .object({
      cargo: z.string().min(1).describe('Cargo ejercido (ej. Presidente de la República, Senador, Intendente de Canelones).'),
      desde: FechaParcial.describe('Inicio del mandato: YYYY, YYYY-MM o YYYY-MM-DD, según lo que la fuente permita afirmar.'),
      hasta: FechaParcial.optional().describe('Fin del mandato, con la misma precisión disponible. Vacío si sigue en el cargo.'),
      fuentes,
    })
    .strict()
    .superRefine((m, ctx) => {
      // Se compara con los extremos completados: un mandato "1990"–"1990-03-05" es válido, porque
      // el año empieza antes que el día. Comparar los textos crudos lo rechazaría por error.
      if (m.hasta && completarFecha(m.hasta, 'fin') < completarFecha(m.desde, 'inicio')) {
        ctx.addIssue({ code: 'custom', path: ['hasta'], message: 'hasta debe ser posterior a desde.' });
      }
    })
    .describe('Un cargo con fechas y fuentes.');

  const Prision = z
    .object({
      desde: FechaISO.describe('Inicio de la privación de libertad.'),
      hasta: FechaISO.optional().describe('Fin de la privación de libertad, si terminó.'),
      lugar: z.string().min(1).describe('Establecimiento o modalidad (ej. Unidad N.º 1, prisión domiciliaria).'),
      fuentes,
    })
    .strict()
    .describe('Datos de privación de libertad; solo si situacion = en_prision o la hubo.');

  const Salida = z
    .object({
      tipo: TipoSalida,
      fecha: FechaISO.describe('Fecha de la salida del cargo o del fallecimiento.'),
      fuentes,
    })
    .strict()
    .describe('Cómo y cuándo dejó el último cargo relevante.');

  const EstadoActual = z
    .object({
      situacion: Situacion,
      prision: Prision.optional(),
      salida: Salida.optional(),
    })
    .strict()
    .superRefine((e, ctx) => {
      if (e.situacion === 'fallecido' && (!e.salida || e.salida.tipo !== 'fallecimiento')) {
        ctx.addIssue({ code: 'custom', path: ['salida'], message: 'Si situacion = fallecido, salida.tipo debe ser fallecimiento con fecha y fuentes.' });
      }
      if (e.situacion === 'en_prision' && !e.prision) {
        ctx.addIssue({ code: 'custom', path: ['prision'], message: 'Si situacion = en_prision se requiere el bloque prision.' });
      }
      if (e.situacion === 'fuera_de_cargo' && !e.salida) {
        ctx.addIssue({ code: 'custom', path: ['salida'], message: 'Si situacion = fuera_de_cargo se requiere salida (tipo, fecha, fuentes).' });
      }
    })
    .describe('Estado actual de la persona: situación, prisión y salida del cargo.');

  /**
   * Una candidatura no es un mandato: la persona no ejercio nada por presentarse. Se registra
   * aparte porque, si entrara en `mandatos`, quien perdio una eleccion figuraria en el sitio con un
   * cargo que nunca tuvo, y quien la gano la tendria contada dos veces.
   *
   * `resultado` tiene solo dos valores a proposito. Modelar cada particularidad de cada sistema
   * electoral (balotaje, sublemas, acumulacion por lema) haria falta un enum distinto por pais y
   * por reforma; lo que siempre se puede afirmar con una fuente es si la persona resulto electa o
   * no. El matiz va en `detalle`, en palabras, que es donde no miente.
   */
  const Candidatura = z
    .object({
      cargo: z.string().min(1).describe('Cargo al que se postulo (ej. Presidencia de la República).'),
      fecha: FechaISO.describe('Fecha de la elección (YYYY-MM-DD). Si hubo segunda vuelta, la de la instancia que decidió.'),
      lema: z.string().min(1).describe('Lema o partido por el que se presentó, que puede no ser su partido actual.'),
      resultado: z.enum(['electo', 'no_electo']).describe('Si resultó electo o no. El matiz va en detalle.'),
      detalle: z
        .string()
        .optional()
        .describe('Una oración con lo que el enum no captura (ej. pasó a segunda vuelta y perdió; su lema obtuvo tres senadores).'),
      votos: z.number().int().nonnegative().optional().describe('Votos obtenidos, si hay fuente oficial.'),
      fuentes,
    })
    .strict()
    .describe('Una candidatura a un cargo electivo, con su resultado y fuentes.');

  const Foto = z
    .object({
      url: z
        .string()
        .min(1)
        .describe('Ruta del archivo dentro del sitio, sin el base (ej. /fotos/mujica.jpg). La página la pasa por ruta().'),
      credito: z
        .string()
        .min(1)
        .describe('Autor de la fotografía, tal como lo pide la licencia (ej. "Marcelo Cúneo").'),
      licencia: z
        .string()
        .min(1)
        .describe('Nombre exacto de la licencia libre (ej. CC BY-SA 4.0). Solo se aceptan licencias libres o dominio público.'),
      licencia_url: z.url().optional().describe('URL del texto de la licencia; las licencias CC piden enlazarla.'),
      pagina: z
        .url()
        .optional()
        .describe('URL de la página del archivo en Wikimedia Commons u otro repositorio, para verificar autoría y licencia.'),
    })
    .strict()
    .describe('Fotografía de la persona, con crédito y licencia libre. Si no hay ninguna libre, se omite y el sitio muestra un marcador neutro.');

  const AliasAmbiguo = z
    .object({
      alias: z.string().min(1).describe('Alias que también puede referirse a otra persona.'),
      nota: z.string().min(1).describe('Con quién se confunde y cómo desambiguar (ej. por fechas o contexto).'),
    })
    .strict();

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre completo tal como figura en registros oficiales.'),
      nombre_corto: z.string().min(1).describe('Nombre con el que se lo conoce públicamente (ej. Lacalle Pou).'),
      partido: z.string().min(1).describe('Partido político actual o último (nombre canónico de data/alias.yaml, ej. Frente Amplio).'),
      wikidata: z.string().regex(/^Q\d+$/, 'QID de Wikidata, ej. Q6800406').describe('Identificador de Wikidata (QID).'),
      foto: Foto.optional(),
      alias: z.array(z.string().min(1)).min(1).describe('Formas en que la prensa lo nombra; se usan para etiquetar el corpus de forma determinista.'),
      alias_ambiguos: z
        .array(AliasAmbiguo)
        .optional()
        .describe('Alias que también coinciden con otra persona (ej. "Lacalle" también es Lacalle Herrera); el etiquetador exige confirmación.'),
      mandatos: z.array(Mandato).min(1).describe('Cargos ejercidos, cada uno con fechas y fuentes.'),
      candidaturas: z
        .array(Candidatura)
        .optional()
        .describe('Candidaturas a cargos electivos, ganadas o perdidas. No son mandatos: presentarse no es ejercer.'),
      estado_actual: EstadoActual,
      revision: Revision,
      procedencia: crearProcedenciaSchema(op).optional().describe('Opcional en colecciones de referencia; obligatoria cuando el registro sale de una corrida.'),
    })
    .strict()
    .describe('Político: identidad, partido, mandatos con fuentes y estado actual.');
}

export type Politico = z.infer<ReturnType<typeof crearPoliticoSchema>>;
