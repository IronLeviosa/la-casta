import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

/**
 * Una votación en una cámara del Parlamento: qué se votó, cómo salió, y cómo votó (o dónde
 * estaba) cada legislador.
 *
 * Existe para responder una pregunta que un lector hizo con todas las letras: si un legislador
 * entró con un programa, ¿vota como prometió? Y en las votaciones que se deciden por pocos votos,
 * ¿quién de la bancada que impulsaba el proyecto votó en contra, o no apareció? El registro dice
 * qué pasó; no dice por qué. «Comprado», «presionado», «traicionó» no tienen campo a propósito:
 * el sitio pone el voto al lado de la promesa y del resto de la bancada, y decide quien lee.
 *
 * Límite de los datos, que la ficha dice en voz alta: en la Cámara de Representantes el voto de
 * cada diputado solo consta cuando la votación es nominal (artículo 93 del Reglamento; con voto
 * electrónico, artículo 7 de la resolución de 2022: la versión taquigráfica registra quiénes
 * estaban registrados para cada votación y, si fue nominal, quiénes votaron por la afirmativa).
 * En una votación común se sabe el resultado y quién estaba en Sala, no el voto de cada uno. El
 * campo `fuente_del_voto` de cada legislador lo declara, y el validador no deja publicar un voto
 * individual sin esa constancia.
 */
export const Camara = z.enum(['representantes', 'senadores', 'asamblea_general']).describe('Cámara donde se votó.');

export const ModalidadVotacion = z
  .enum(['nominal', 'electronica', 'sumaria'])
  .describe(
    'nominal: consta el voto de cada legislador. electronica: registro electrónico; consta quiénes estaban registrados y el resultado, no el voto de cada uno salvo que además sea nominal. sumaria: a mano alzada o por signo, solo el resultado.',
  );

export const InstanciaVotacion = z
  .enum(['general', 'particular', 'reconsideracion', 'levantamiento_de_veto', 'otra'])
  .describe('general: el proyecto en general. particular: un artículo o capítulo (decir cuál en `articulo`). reconsideracion, levantamiento_de_veto, otra.');

export const Voto = z
  .enum(['afirmativo', 'negativo', 'presente_sin_votar', 'no_registrado', 'ausente_con_aviso', 'ausente_sin_aviso', 'licencia', 'sin_dato'])
  .describe(
    'afirmativo / negativo: su voto. presente_sin_votar: registrado y no votó (en Diputados equivale a negativo, y la ficha lo dice). no_registrado: en Sala pero no se registró para esa votación (cuenta como ausente). ausente_con_aviso / ausente_sin_aviso / licencia: según el registro de asistencia de la sesión. sin_dato: estaba, pero su voto individual no consta (votación no nominal).',
  );

export const FuenteDelVoto = z
  .enum(['nominal', 'declarado', 'aritmetica', 'asistencia', 'sin_dato'])
  .describe(
    'nominal: consta en el diario de sesiones. declarado: el propio legislador dijo públicamente cómo votó (fuente obligatoria). aritmetica: se deduce con certeza de los totales (p. ej. una bancada de 5 presentes y 4 afirmativos con nadie más votando a favor: decir el razonamiento en `nota`). asistencia: solo se sabe si estaba (para ausencias y licencias). sin_dato.',
  );

export const PosicionBancada = z
  .enum(['a_favor', 'en_contra', 'libertad_de_accion', 'dividida', 'sin_dato'])
  .describe('Posición declarada de la bancada o del partido, con fuente; dividida cuando la propia bancada lo dice; sin_dato nunca se adivina.');

export function crearVotacionSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);
  const Evidencia = crearEvidenciaSchema(op);

  const Legislador = z
    .object({
      nombre: z.string().min(3).describe('Nombre como figura en el diario de sesiones.'),
      politico: ref('politicos').optional().describe('Ficha en content/politicos si existe; se crea cuando falta (todos los que votan tienen ficha, o ninguno).'),
      partido: z.string().min(2).describe('Partido o lema (nombre canónico de data/alias.yaml).'),
      sector: z.string().optional().describe('Sector o lista dentro del partido, si el diario o la Corte lo registran.'),
      departamento: z.string().optional().describe('Departamento por el que ocupa la banca (Diputados).'),
      condicion: z.enum(['titular', 'suplente']).describe('titular o suplente en esa sesión.'),
      suple_a: z.string().optional().describe('A quién suple, si es suplente.'),
      voto: Voto,
      fuente_del_voto: FuenteDelVoto,
      nota: z.string().max(400).optional().describe('Una oración: qué dijo después el legislador sobre su voto o su ausencia, o el razonamiento aritmético. Sin verbos de intención.'),
      fuentes: z.array(Fuente).default([]).describe('Obligatorias cuando fuente_del_voto es declarado o aritmetica, y cuando hay `nota`.'),
    })
    .strict();

  const Bancada = z
    .object({
      partido: z.string().min(2),
      sector: z.string().optional(),
      posicion: PosicionBancada,
      presentes: z.number().int().min(0).optional().describe('Cuántos de la bancada estaban registrados para la votación, si consta.'),
      fuentes: z.array(Fuente).default([]).describe('Cómo se sabe la posición: declaración del coordinador, del partido, o el propio diario de sesiones.'),
    })
    .strict();

  return z
    .object({
      camara: Camara,
      fecha: FechaISO.describe('Fecha de la sesión (YYYY-MM-DD).'),
      sesion: z
        .object({
          numero: z.string().optional().describe('Número de sesión tal como lo cita el diario.'),
          tipo: z.enum(['ordinaria', 'extraordinaria', 'especial', 'permanente']).default('ordinaria'),
          legislatura: z.number().int().min(1).describe('Legislatura (la 50.ª empezó el 15 de febrero de 2025).'),
        })
        .strict(),
      asunto: z
        .object({
          titulo: z.string().min(8).max(160).describe('Qué se votó, en una línea de lenguaje llano (qué cambia si se aprueba, no el título formal del repartido).'),
          tipo: z
            .enum(['proyecto_de_ley', 'proyecto_de_resolucion', 'articulo', 'mocion', 'designacion', 'veto', 'desafuero', 'otro'])
            .describe('desafuero: pedido de la justicia para procesar a un legislador (artículo 114 de la Constitución); la cámara vota si lo concede. Lleva `caso` cuando el caso está fichado.'),
          carpeta: z.string().optional().describe('Número de carpeta o repartido, como lo cita el diario.'),
          ley: ref('leyes').optional().describe('Ficha de la ley resultante, si existe.'),
          caso: ref('casos').optional().describe('Caso judicial al que pertenece la votación (un desafuero, una comisión investigadora); la ficha del caso la muestra.'),
          evento: ref('eventos').optional().describe('Evento del sitio al que pertenece (se muestra en su línea de tiempo).'),
          tema: ref('temas'),
          descripcion: z.string().min(20).max(600).describe('Dos o tres oraciones: qué proponía el proyecto y quién lo impulsaba, con fuente en `evidencia`.'),
        })
        .strict(),
      instancia: InstanciaVotacion,
      articulo: z.string().optional().describe('Artículo o capítulo votado, cuando la instancia es particular.'),
      modalidad: ModalidadVotacion,
      resultado: z
        .object({
          afirmativos: z.number().int().min(0),
          negativos: z.number().int().min(0),
          presentes: z.number().int().min(0).describe('Legisladores registrados o en Sala para esa votación, según el diario.'),
          integrantes: z.number().int().min(1).describe('Integrantes de la cámara (99 en Diputados, 31 en el Senado con el vicepresidente, 130 en la Asamblea General).'),
          requerido: z.enum(['mayoria_simple', 'mayoria_absoluta', 'dos_tercios', 'tres_quintos']).describe('Mayoría que exigía la Constitución o el Reglamento para ese asunto.'),
          aprobado: z.boolean(),
          texto_del_acta: z.string().min(5).max(200).describe('El resultado como lo proclamó la Mesa, literal («Sesenta y uno en setenta y ocho: AFIRMATIVA»).'),
        })
        .strict(),
      bancadas: z.array(Bancada).min(1).describe('Una entrada por partido presente en la cámara, todos, con su posición declarada o sin_dato.'),
      legisladores: z
        .array(Legislador)
        .min(1)
        .describe('Todos los integrantes de la cámara en esa sesión, presentes y ausentes: la ficha dibuja la sala entera y el que no vino se ve tanto como el que votó.'),
      promesas_relacionadas: z
        .array(
          z
            .object({
              politico: ref('politicos'),
              promesa: ref('promesas'),
              relacion: z.enum(['coherente', 'contradice', 'sin_relacion_clara']).describe('coherente: el voto va en el sentido de la promesa. contradice: va en contra. sin_relacion_clara: la promesa habla de otra cosa o es ambigua.'),
              nota: z.string().max(300).optional().describe('Una oración con el punto de contacto entre la promesa y el voto.'),
            })
            .strict(),
        )
        .default([])
        .describe('Promesas de campaña de legisladores de esta cámara que este voto confirma o contradice. El mismo criterio para todos los partidos.'),
      analisis: z
        .string()
        .min(1)
        .describe('Qué se votó, con qué margen, cómo votó cada bancada, y quiénes votaron distinto de su bancada o faltaron en una votación decidida por pocos votos. Menos de 350 palabras, el dato principal primero, sin verbos de intención.'),
      seguimiento: z
        .object({
          texto: z.string().min(20).describe('Qué pasó después: pasó a la otra cámara, se promulgó, se vetó, se archivó.'),
          fuentes: z.array(Fuente).min(1),
        })
        .strict()
        .optional(),
      evidencia: Evidencia,
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((v, ctx) => {
      const r = v.resultado;
      if (r.afirmativos + r.negativos > r.presentes) ctx.addIssue({ code: 'custom', path: ['resultado'], message: 'Afirmativos más negativos no pueden superar a los presentes.' });
      if (r.presentes > r.integrantes) ctx.addIssue({ code: 'custom', path: ['resultado', 'presentes'], message: 'Los presentes no pueden superar a los integrantes de la cámara.' });
      if (v.instancia === 'particular' && !v.articulo) ctx.addIssue({ code: 'custom', path: ['articulo'], message: 'Una votación en particular dice qué artículo se votó.' });
      const conVoto = v.legisladores.filter((l) => l.voto === 'afirmativo' || l.voto === 'negativo');
      for (const [i, l] of v.legisladores.entries()) {
        if ((l.voto === 'afirmativo' || l.voto === 'negativo') && l.fuente_del_voto === 'sin_dato') {
          ctx.addIssue({ code: 'custom', path: ['legisladores', i, 'fuente_del_voto'], message: `${l.nombre}: un voto afirmativo o negativo necesita constancia (nominal, declarado o aritmetica).` });
        }
        if ((l.fuente_del_voto === 'declarado' || l.fuente_del_voto === 'aritmetica') && l.fuentes.length === 0) {
          ctx.addIssue({ code: 'custom', path: ['legisladores', i, 'fuentes'], message: `${l.nombre}: un voto declarado o deducido lleva su fuente.` });
        }
        if (l.fuente_del_voto === 'aritmetica' && !l.nota) {
          ctx.addIssue({ code: 'custom', path: ['legisladores', i, 'nota'], message: `${l.nombre}: un voto deducido dice el razonamiento en nota.` });
        }
        if (v.modalidad !== 'nominal' && l.fuente_del_voto === 'nominal') {
          ctx.addIssue({ code: 'custom', path: ['legisladores', i, 'fuente_del_voto'], message: `${l.nombre}: la votación no fue nominal, así que su voto no puede constar como nominal.` });
        }
        if (l.nota && l.fuentes.length === 0 && l.fuente_del_voto !== 'aritmetica') {
          ctx.addIssue({ code: 'custom', path: ['legisladores', i, 'fuentes'], message: `${l.nombre}: una nota sobre su voto o su ausencia lleva fuente.` });
        }
      }
      if (v.modalidad === 'nominal') {
        const si = conVoto.filter((l) => l.voto === 'afirmativo' && l.fuente_del_voto === 'nominal').length;
        const no = conVoto.filter((l) => l.voto === 'negativo' && l.fuente_del_voto === 'nominal').length;
        if (v.revision.tier === 'publicado' && (si !== r.afirmativos || no !== r.negativos)) {
          ctx.addIssue({ code: 'custom', path: ['legisladores'], message: `En una votación nominal publicada, los votos nominales cargados (${si} afirmativos, ${no} negativos) tienen que coincidir con el resultado (${r.afirmativos} y ${r.negativos}).` });
        }
      }
      if (v.revision.tier === 'publicado' && v.legisladores.length < r.integrantes) {
        ctx.addIssue({ code: 'custom', path: ['legisladores'], message: `Para publicarse, la ficha lleva a los ${r.integrantes} integrantes de la cámara (hay ${v.legisladores.length}): el que faltó se ve tanto como el que votó.` });
      }
      const partidos = new Set(v.legisladores.map((l) => l.partido));
      for (const p of partidos) if (!v.bancadas.some((b) => b.partido === p)) ctx.addIssue({ code: 'custom', path: ['bancadas'], message: `Falta la posición de la bancada de ${p} (aunque sea sin_dato).` });
    })
    .describe('Una votación en una cámara: qué se votó, cómo salió y cómo votó o dónde estaba cada legislador, con la constancia de cada voto.');
}
