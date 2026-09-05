import { z } from 'astro/zod';
import { FechaISO, NOMBRES_COLECCIONES, Revision, crearFuenteSchema, type Opciones } from './base';

export const TipoCorreccion = z
  .enum(['error_factual', 'fuente_caida', 'replica', 'cambio_de_rating'])
  .describe('Tipo de corrección: error_factual, fuente_caida, replica (derecho de réplica) o cambio_de_rating.');

/**
 * `replica.md` promete publicar los tres desenlaces —aceptada, parcialmente aceptada o
 * rechazada— "con su fundamento en la página de Correcciones". Sin este campo eso no se podía
 * cumplir: la colección solo modelaba cambios que se hicieron, asi que un pedido desestimado no
 * tenia donde vivir y se resolvia en silencio, que es exactamente lo que el sitio promete no
 * hacer. Un rechazo publicado tambien evita reprocesar el mismo planteo cada vez que alguien lo
 * vuelve a presentar: se lo puede apuntar al registro que ya lo trata.
 */
export const DesenlaceCorreccion = z
  .enum(['aceptada', 'parcialmente_aceptada', 'rechazada'])
  .describe('Qué se resolvió sobre el pedido: aceptada, parcialmente_aceptada o rechazada.');

/**
 * Por qué se rechazó, y sirve para algo concreto: solo `evidencia_insuficiente` se acumula.
 *
 * El nivel `reportado` exige dos fuentes de distinto grupo de medios, así que el caso más
 * probable que va a llegar es que un lector aporte una nota que sola no alcanza y que meses
 * después otro aporte una de otro grupo. Cada una por separado se rechaza; juntas cumplen la
 * regla. Si no se guarda cuál rechazo traía evidencia real, el sitio rechaza dos veces una
 * corrección que correspondía.
 *
 * Un rechazo `sin_evidencia_verificable` no aporta nada al banco por definición: no hay qué sumar.
 */
export const MotivoRechazo = z
  .enum(['evidencia_insuficiente', 'sin_evidencia_verificable', 'la_evidencia_no_prueba_lo_que_afirma', 'fuera_de_alcance'])
  .describe('Solo en rechazos. `evidencia_insuficiente` marca los que aportaron evidencia real que sola no alcanzaba: esos se reconsideran cuando llega evidencia nueva sobre los mismos registros.');

const patronIdCompleto = new RegExp(`^(${NOMBRES_COLECCIONES.join('|')})/[a-z0-9][a-z0-9/-]*$`);

export function crearCorreccionSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  return z
    .object({
      fecha: FechaISO.describe('Fecha en que se resolvió el pedido (YYYY-MM-DD).'),
      /**
       * Cuándo entró el pedido, que no es lo mismo que cuándo se resolvió.
       *
       * `replica.md` promete responder en 15 días. Sin este campo ese plazo era **inauditable**:
       * el sitio prometía un compromiso que no guardaba el dato para verificarlo, en un proyecto
       * cuyo argumento entero es que cualquiera pueda comprobar lo que afirma. Es opcional porque
       * una detección interna no tiene pedido que fechar, pero cuando hay `solicitante` externo
       * tiene que estar.
       */
      fecha_solicitud: FechaISO.optional().describe('Fecha en que se recibió el pedido, si vino de afuera. Con `fecha`, hace medible el plazo de respuesta.'),
      tipo: TipoCorreccion,
      desenlace: DesenlaceCorreccion,
      afecta: z
        .array(z.string().regex(patronIdCompleto, 'Id completo: <coleccion>/<id>, ej. giros/lacalle-pou/iva-tarjeta-2020'))
        .default([])
        .describe('Ids completos de los registros que YA existen y que esta corrección modifica (ej. declaraciones/lacalle-pou/2019-10-15-no-subir-impuestos).'),
      /**
       * `afecta` es lo que ya existe y cambia; `agrega` es lo que no existía y entra.
       *
       * Hasta ahora una corrección solo podía modificar, así que un pedido cuya respuesta correcta
       * era "falta un registro" no se podía resolver por este canal: quedaba esperando una corrida,
       * que es trabajo programado y no algo que dispare el aporte de un lector. `CLAUDE.md` ya
       * admite `procedencia.tipo: correccion` como la excepción a la procedencia de corrida, así
       * que el modelo lo permitía; faltaba poder declararlo.
       */
      agrega: z
        .array(z.string().regex(patronIdCompleto, 'Id completo: <coleccion>/<id>'))
        .optional()
        .describe('Ids completos de registros nuevos que esta corrección introduce, y que no existían en content/.'),
      motivo: z.string().min(1).describe('Qué estaba mal y qué se cambió, en lenguaje llano.'),
      solicitante: z.string().min(1).optional().describe('Quién pidió la corrección (ej. reclamo #12, réplica de X, detección interna).'),
      reemplaza: z.string().regex(patronIdCompleto).optional().describe('Si un registro fue reemplazado por otro, id completo del nuevo registro.'),
      motivo_rechazo: MotivoRechazo.optional(),
      /**
       * Aportes que, sumados, sostienen esta corrección. Cada uno con su fecha propia: el que
       * aportó primero tiene que poder ver que su evidencia terminó contando, aunque en su momento
       * se le haya dicho que no alcanzaba.
       */
      aportes: z
        .array(
          z
            .object({
              fecha: FechaISO.describe('Cuándo se recibió este aporte, no cuándo se resolvió el conjunto.'),
              solicitante: z.string().min(1).describe('Quién lo aportó.'),
              correccion_previa: z
                .string()
                .optional()
                .describe('Id del archivo de correcciones donde ese aporte se había resuelto por separado, si existe.'),
              que_aporto: z.string().min(1).describe('Qué trajo este aporte, en una línea.'),
            })
            .strict(),
        )
        .min(2)
        .optional()
        .describe('Solo cuando la corrección se sostiene por la suma de dos o más aportes que por separado no alcanzaban.'),
      /**
       * Enlace hacia adelante desde un rechazo: "esto solo no alcanzaba, pero su evidencia forma
       * parte de tal corrección aceptada". Sin esto, el rechazo queda como la última palabra sobre
       * un aporte que terminó siendo útil.
       */
      superada_por: z
        .string()
        .optional()
        .describe('Solo en rechazos: id de la corrección aceptada que incorporó la evidencia de este pedido.'),
      que_cambiaria_la_decision: z
        .string()
        .min(1)
        .optional()
        .describe(
          'Solo en rechazos: qué evidencia concreta llevaría a resolver distinto. Un rechazo sin esto es un portazo; con esto es una guía para volver a presentarlo mejor.',
        ),
      fuentes: z.array(Fuente).optional().describe('Fuentes que respaldan la corrección, si las hay.'),
      revision: Revision,
    })
    .strict()
    .superRefine((c, ctx) => {
      const agrega = c.agrega ?? [];
      // Resolver antes de recibir es imposible; casi siempre significa que una de las dos fechas
      // se copio mal, y como de esta resta sale la metrica de plazo publicada, conviene que corte.
      if (c.fecha_solicitud && c.fecha_solicitud > c.fecha) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fecha_solicitud'],
          message: `El pedido no puede haberse recibido (${c.fecha_solicitud}) después de resolverse (${c.fecha}).`,
        });
      }
      if (c.afecta.length === 0 && agrega.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['afecta'],
          message: 'Una corrección tiene que declarar al menos un registro: en `afecta` si lo modifica, en `agrega` si lo introduce.',
        });
      }
      // Un rechazo no cambia ni suma nada publicado; si trae `agrega`, el desenlace esta mal puesto.
      if (c.desenlace === 'rechazada' && agrega.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['agrega'],
          message: 'Una corrección rechazada no agrega registros: el pedido se desestimó.',
        });
      }
      const repetidos = c.afecta.filter((id) => agrega.includes(id));
      if (repetidos.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['agrega'],
          message: `Un registro no puede estar en 'afecta' y en 'agrega' a la vez: o ya existía o es nuevo (${repetidos.join(', ')}).`,
        });
      }
      // Un rechazo no cambia nada publicado: si trae `reemplaza`, algo se aplicó igual y el
      // desenlace esta mal puesto. Vale la pena que falle fuerte, porque el modo silencioso de
      // este error es publicar que un pedido se rechazo mientras el registro ya se habia tocado.
      if (c.desenlace === 'rechazada' && c.reemplaza) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reemplaza'],
          message: 'Una corrección rechazada no reemplaza ningún registro: no cambió nada.',
        });
      }
      if (c.desenlace === 'rechazada' && !c.que_cambiaria_la_decision) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['que_cambiaria_la_decision'],
          message:
            'Un rechazo tiene que decir qué evidencia llevaría a resolver distinto. Sin eso el lector no sabe cómo volver a presentarlo y el registro no sirve para redirigir planteos repetidos.',
        });
      }
      if (c.desenlace === 'rechazada' && !c.motivo_rechazo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['motivo_rechazo'],
          message:
            'Un rechazo tiene que decir por qué. De eso depende si su evidencia se guarda para reconsiderarla cuando llegue otra: solo `evidencia_insuficiente` se acumula.',
        });
      }
      if (c.desenlace !== 'rechazada' && c.motivo_rechazo) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['motivo_rechazo'], message: '`motivo_rechazo` es solo para rechazos.' });
      }
      if (c.desenlace !== 'rechazada' && c.superada_por) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['superada_por'],
          message: '`superada_por` marca un rechazo cuya evidencia se reutilizó después; en una corrección aceptada no aplica.',
        });
      }
      if (c.desenlace !== 'rechazada' && c.que_cambiaria_la_decision) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['que_cambiaria_la_decision'],
          message: '`que_cambiaria_la_decision` es solo para rechazos; en una corrección aceptada la decisión ya se tomó.',
        });
      }
    })
    .describe(
      'Pedido de corrección procesado: qué registros señala, qué se resolvió, por qué y quién lo pidió. Se publican los tres desenlaces, incluidos los rechazos. Los ids nunca se renombran; los cambios van por acá.',
    );
}

export type Correccion = z.infer<ReturnType<typeof crearCorreccionSchema>>;
