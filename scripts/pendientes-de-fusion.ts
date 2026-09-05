#!/usr/bin/env tsx
/**
 * `pnpm banco <id-de-registro>` — evidencia guardada de pedidos rechazados sobre un registro.
 *
 * El nivel `reportado` exige dos fuentes de distinto grupo de medios. Eso hace que el caso más
 * probable no sea un aporte que alcanza solo, sino dos que por separado no alcanzan: un lector
 * trae una nota, se le dice que falta una segunda fuente de otro grupo, y meses despues otro trae
 * exactamente esa. Si quien evalua el segundo pedido no ve el primero, el sitio rechaza dos veces
 * una correccion que correspondia, y ninguno de los dos lectores se entera de que juntos tenian
 * razon.
 *
 * Este comando existe para que ese olvido no dependa de la memoria de nadie. Se corre al recibir
 * cualquier pedido, antes de resolverlo.
 *
 * Solo lista rechazos con `motivo_rechazo: evidencia_insuficiente`. Los otros no se acumulan: de
 * un pedido sin evidencia verificable no hay nada que sumar.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';

interface Correccion {
  fecha?: string;
  desenlace?: string;
  motivo_rechazo?: string;
  afecta?: string[];
  motivo?: string;
  solicitante?: string;
  que_cambiaria_la_decision?: string;
  superada_por?: string;
  fuentes?: { url?: string; medio?: string; fecha?: string }[];
}

function main(): void {
  const { posicionales } = parsearArgs(process.argv.slice(2));
  const objetivo = posicionales[0];
  if (!objetivo) {
    process.stdout.write(
      'uso: pnpm banco <id-completo-del-registro>\n' +
        'ej:  pnpm banco declaraciones/lacalle-pou/2021-11-16-deberiamos-haber-aumentado-ganancia-ancap\n' +
        '     pnpm banco declaraciones/lacalle-pou   (prefijo: todos los registros de ese politico)\n',
    );
    process.exit(1);
  }
  const dir = path.join(RAIZ, 'content', 'correcciones');
  if (!existsSync(dir)) {
    log.info('todavia no hay correcciones.');
    return;
  }
  const banco: { id: string; c: Correccion }[] = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
    const c = parseYaml(readFileSync(path.join(dir, f), 'utf8')) as Correccion;
    if (c?.desenlace !== 'rechazada') continue;
    if (c?.motivo_rechazo !== 'evidencia_insuficiente') continue;
    if (c?.superada_por) continue; // su evidencia ya se reutilizo
    if (!(c.afecta ?? []).some((id) => id === objetivo || id.startsWith(objetivo))) continue;
    banco.push({ id: f.replace(/\.yaml$/, ''), c });
  }
  if (banco.length === 0) {
    log.info(`sin evidencia guardada para "${objetivo}". Resolvé el pedido nuevo por sí solo.`);
    return;
  }
  process.stdout.write(
    `\n${banco.length} pedido(s) rechazado(s) por evidencia insuficiente sobre "${objetivo}".\n` +
      `Miralos antes de resolver el pedido nuevo: si la evidencia nueva sumada a alguna de estas alcanza,\n` +
      `corresponde una corrección fusionada con 'aportes', y marcar cada rechazo con 'superada_por'.\n\n`,
  );
  for (const { id, c } of banco) {
    process.stdout.write(`  ${id}   (${c.fecha ?? 's/f'})\n`);
    if (c.solicitante) process.stdout.write(`    pidió: ${c.solicitante}\n`);
    if (c.que_cambiaria_la_decision) process.stdout.write(`    qué le faltaba: ${c.que_cambiaria_la_decision.trim().replace(/\s+/g, ' ')}\n`);
    for (const f of c.fuentes ?? []) process.stdout.write(`    aportó: ${f.medio ?? '?'} ${f.fecha ?? ''} ${f.url ?? ''}\n`);
    process.stdout.write('\n');
  }
}

main();
