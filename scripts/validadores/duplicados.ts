/**
 * Etapa: duplicados (plan 2026-09, ítem 5.3).
 *
 * Dos registros de la misma colección, con la misma persona (`politico`), la misma fecha y los
 * primeros 60 caracteres normalizados de la `cita` (o del `texto`, en promesas) iguales, con ids
 * distintos: casi siempre el mismo hecho cargado dos veces en corridas distintas.
 *
 * `contenido.registros` ya trae juntos content/ y, en modo --inbox, la corrida (scripts/validar.ts
 * las combina antes de que corra ninguna etapa), así que esta función no necesita distinguir el
 * modo: compara todo lo que ve y decide la severidad mirando `enInbox` en cada registro del par.
 *
 * Severidad: aviso si los dos registros del par ya estaban en content/; error si alguno de los dos
 * viene del inbox (duplicado dentro del mismo lote, o un registro nuevo que duplica uno publicado):
 * en ese caso el lote no puede salir del inbox así.
 */
import { normalizar } from '../lib/texto.ts';
import type { Contenido, Registro } from '../lib/contenido.ts';
import type { NombreColeccion } from '../../src/schemas/comunes';
import { resultadoVacio, type ResultadoEtapa } from './tipos.ts';

/** Cuántos caracteres normalizados del texto se comparan. */
const LARGO_PREFIJO = 60;

/** Colección → campo de fecha y campo de texto citable a comparar. */
const CAMPOS_DUPLICADOS: Partial<Record<NombreColeccion, { fecha: string; texto: string }>> = {
  declaraciones: { fecha: 'fecha', texto: 'cita' },
  promesas: { fecha: 'fecha_promesa', texto: 'texto' },
};

export function validarDuplicados(contenido: Contenido): ResultadoEtapa {
  const r = resultadoVacio();

  for (const [coleccion, campos] of Object.entries(CAMPOS_DUPLICADOS) as [NombreColeccion, { fecha: string; texto: string }][]) {
    const grupos = new Map<string, Registro[]>();
    for (const reg of contenido.de(coleccion)) {
      const d = reg.datos;
      const politico = typeof d.politico === 'string' ? d.politico : undefined;
      const fecha = typeof d[campos.fecha] === 'string' ? d[campos.fecha] : undefined;
      const texto = typeof d[campos.texto] === 'string' ? d[campos.texto] : undefined;
      if (!politico || !fecha || !texto) continue;
      const prefijo = normalizar(texto).slice(0, LARGO_PREFIJO);
      const clave = `${politico}|${fecha}|${prefijo}`;
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave)!.push(reg);
    }

    for (const grupo of grupos.values()) {
      if (grupo.length < 2) continue;
      // Orden estable: cada duplicado se reporta apuntando al primero del grupo por id, para no
      // repetir el mismo par dos veces (una vez por cada lado).
      const ordenado = [...grupo].sort((a, b) => a.id.localeCompare(b.id));
      const original = ordenado[0]!;
      for (const dup of ordenado.slice(1)) {
        const destino = dup.enInbox || original.enInbox ? r.errores : r.avisos;
        destino.push({
          archivo: dup.archivo,
          campo: campos.texto,
          mensaje: `Posible duplicado de "${original.id}" (${original.archivo}): mismo politico, mismo ${campos.fecha} y los primeros ${LARGO_PREFIJO} caracteres de ${campos.texto} coinciden (normalizados).`,
        });
      }
    }
  }

  return r;
}
