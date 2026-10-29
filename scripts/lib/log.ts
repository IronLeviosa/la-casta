/**
 * Logger minimo. Escribe a stderr para que stdout quede limpio cuando se pide --json.
 */
const usaColor = process.stderr.isTTY && !process.env.NO_COLOR;
const c = (codigo: string, s: string) => (usaColor ? `\x1b[${codigo}m${s}\x1b[0m` : s);

let silencioso = false;
export function silenciar(valor = true): void {
  silencioso = valor;
}

function hora(): string {
  return new Date().toISOString().slice(11, 19);
}

export const log = {
  info(msg: string): void {
    if (!silencioso) process.stderr.write(`${c('90', hora())} ${msg}\n`);
  },
  ok(msg: string): void {
    if (!silencioso) process.stderr.write(`${c('90', hora())} ${c('32', '✔')} ${msg}\n`);
  },
  aviso(msg: string): void {
    process.stderr.write(`${c('90', hora())} ${c('33', '⚠')} ${msg}\n`);
  },
  error(msg: string): void {
    process.stderr.write(`${c('90', hora())} ${c('31', '✘')} ${msg}\n`);
  },
  debug(msg: string): void {
    if (process.env.DEBUG) process.stderr.write(`${c('90', hora() + ' · ' + msg)}\n`);
  },
};

/**
 * Parser de argumentos chico y sin dependencias: `--clave valor`, `--flag`, posicionales.
 *
 * Un `--flag` seguido de algo que no empieza con `--` se traga ese algo como su valor, y para un
 * interruptor eso es un defecto: `pnpm lote objeciones critica.md --prosa declaraciones[0]` dejaba
 * `prosa = "declaraciones[0]"` y sin registro posicional, así que la opción imprimía todos los
 * encabezados y ninguna prosa. `booleanas` lista los interruptores del comando: nunca consumen el
 * argumento que sigue (`--texto=false` los apaga igual, porque el valor inline sí se respeta).
 */
export function parsearArgs(
  argv: string[],
  config: { booleanas?: readonly string[] } = {},
): { posicionales: string[]; opciones: Record<string, string | boolean> } {
  const booleanas = new Set(config.booleanas ?? []);
  const posicionales: string[] = [];
  const opciones: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [clave, valorInline] = a.slice(2).split('=', 2);
      if (valorInline !== undefined) opciones[clave] = valorInline;
      else if (!booleanas.has(clave) && i + 1 < argv.length && !argv[i + 1].startsWith('--')) opciones[clave] = argv[++i];
      else opciones[clave] = true;
    } else {
      posicionales.push(a);
    }
  }
  return { posicionales, opciones };
}

/** Un interruptor está encendido si vino sin valor o con un valor que no es «false», «0» ni «no». */
export function interruptorActivo(v: string | boolean | undefined): boolean {
  if (v === undefined || v === false) return false;
  if (v === true) return true;
  return !/^(false|0|no)$/i.test(v.trim());
}
