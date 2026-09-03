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

/** Parser de argumentos chico y sin dependencias: `--clave valor`, `--flag`, posicionales. */
export function parsearArgs(argv: string[]): { posicionales: string[]; opciones: Record<string, string | boolean> } {
  const posicionales: string[] = [];
  const opciones: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [clave, valorInline] = a.slice(2).split('=', 2);
      if (valorInline !== undefined) opciones[clave] = valorInline;
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opciones[clave] = argv[++i];
      else opciones[clave] = true;
    } else {
      posicionales.push(a);
    }
  }
  return { posicionales, opciones };
}
