#!/usr/bin/env node
/**
 * Hook `PreToolUse` de Claude Code: deniega `Bash` fuera de la lista de comandos
 * de cada rol (plan-2026-09, fase 0.3 y 1.4). JavaScript plano, sin dependencias.
 *
 * Lee JSON por stdin (`tool_name`, `tool_input.command`, `agent_type`) y, si
 * corresponde denegar, escribe por stdout:
 *   {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}
 * Para permitir, no escribe nada. Siempre sale con código 0: la decisión la
 * lee el harness del JSON, no del código de salida.
 * Docs: https://code.claude.com/docs/en/hooks
 *
 * No se conecta a ningún rol todavía (ver el informe de la corrida que lo creó
 * para el bloque de frontmatter que hay que pegar en cada `.claude/agents/*.md`).
 */
import { readFileSync } from 'node:fs';

/** Prefijos de `pnpm ...` / `ls ` / etc. permitidos, por rol. Coincidencia por `startsWith`. */
const PERMITIDOS_POR_ROL = {
  investigador: ['pnpm fuente', 'pnpm corpus:buscar', 'pnpm inventario', 'pnpm descubrir', 'pnpm validar', 'pnpm lote', 'ls ', 'mkdir -p inbox'],
  editor: ['pnpm fuente', 'pnpm corpus:buscar', 'pnpm validar', 'pnpm lote', 'pnpm imagen', 'ls '],
  critico: ['pnpm fuente', 'pnpm corpus:buscar', 'pnpm banco', 'pnpm lote', 'ls '],
  // Mismos permisos que investigador (encargo: "resolvedor -> como investigador").
  resolvedor: ['pnpm fuente', 'pnpm corpus:buscar', 'pnpm inventario', 'pnpm descubrir', 'pnpm validar', 'pnpm lote', 'ls ', 'mkdir -p inbox'],
  detective: ['pnpm fuente', 'pnpm corpus:buscar', 'ls '],
};

/** Comandos de filtro que se aceptan como último tramo de un `|`, sin chequear el rol. */
const FILTROS_FINALES = /^(tail|head|grep)\b/;

/**
 * Parte `comando` en tramos por `&&`, `;` y `|`, respetando comillas simples y
 * dobles (para no cortar un `--buscar "<frase> | <otra frase>"`). Cada tramo
 * lleva el separador que lo introdujo (`null` para el primero).
 */
function dividirEnTramos(comando) {
  const tramos = [];
  let actual = '';
  let separadorPrevio = null;
  let comillas = null;
  for (let i = 0; i < comando.length; i++) {
    const c = comando[i];
    if (comillas) {
      actual += c;
      if (c === comillas) comillas = null;
      continue;
    }
    if (c === '"' || c === "'") {
      comillas = c;
      actual += c;
      continue;
    }
    if (c === '&' && comando[i + 1] === '&') {
      tramos.push({ texto: actual, separador: separadorPrevio });
      actual = '';
      separadorPrevio = '&&';
      i++;
      continue;
    }
    if (c === ';') {
      tramos.push({ texto: actual, separador: separadorPrevio });
      actual = '';
      separadorPrevio = ';';
      continue;
    }
    if (c === '|' && comando[i + 1] !== '|') {
      tramos.push({ texto: actual, separador: separadorPrevio });
      actual = '';
      separadorPrevio = '|';
      continue;
    }
    actual += c;
  }
  tramos.push({ texto: actual, separador: separadorPrevio });
  return tramos.map((t) => ({ ...t, texto: t.texto.trim() })).filter((t) => t.texto.length > 0);
}

/** Quita un `cd "<ruta>" && ` o `cd <ruta> && ` inicial, si lo hay. */
function quitarPrefijoCd(comando) {
  const m = /^cd\s+(?:"[^"]*"|'[^']*'|\S+)\s*&&\s*/.exec(comando);
  return m ? comando.slice(m[0].length) : comando;
}

/**
 * Evalúa un comando completo contra la lista de un rol. Devuelve `{ ok: true }`
 * o `{ ok: false, tramo }` con el primer tramo que no está permitido.
 */
export function evaluarComando(comando, permitidos) {
  const sinCd = quitarPrefijoCd(comando.trim());
  const tramos = dividirEnTramos(sinCd);
  if (!tramos.length) return { ok: false, tramo: comando };
  for (let i = 0; i < tramos.length; i++) {
    const tramo = tramos[i];
    const esUltimo = i === tramos.length - 1;
    if (esUltimo && tramo.separador === '|' && FILTROS_FINALES.test(tramo.texto)) continue;
    if (permitidos.some((p) => tramo.texto.startsWith(p))) continue;
    return { ok: false, tramo: tramo.texto };
  }
  return { ok: true };
}

function razonDenegado(agentType, tramo, permitidos) {
  return (
    `Bash denegado para el rol "${agentType}": "${tramo}" no está en la lista permitida. ` +
    `Para leer o cambiar un registro usá pnpm lote ver/fijar; para leer una nota, pnpm fuente. ` +
    `Permitidos para este rol: ${permitidos.join(', ')}.`
  );
}

function denegar(razon) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: razon,
      },
    }) + '\n',
  );
}

function main() {
  let entrada;
  try {
    entrada = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    // JSON ilegible: no es asunto de este hook, que no bloquea el flujo por eso.
    process.exit(0);
  }

  const toolName = entrada?.tool_name;
  const agentType = entrada?.agent_type;
  if (toolName !== 'Bash' || !agentType) process.exit(0);

  const permitidos = PERMITIDOS_POR_ROL[agentType];
  if (!permitidos) process.exit(0); // rol no gobernado por este hook: se deja pasar

  const comando = typeof entrada?.tool_input?.command === 'string' ? entrada.tool_input.command : '';
  const resultado = evaluarComando(comando, permitidos);
  if (!resultado.ok) denegar(razonDenegado(agentType, resultado.tramo, permitidos));
  process.exit(0);
}

main();
