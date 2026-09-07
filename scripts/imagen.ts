/**
 * `pnpm imagen <url> --para <coleccion>/<id> --credito "<autor>" --licencia "<licencia>" [--licencia-url <url>] [--pagina <url>] [--alt "<texto>"] [--pie "<texto>"]`
 *
 * La única forma de meter una imagen en el sitio. Baja el archivo a `public/imagenes/<coleccion>/<id>/`,
 * lo anota en `data/imagenes-ledger.json` (de dónde salió, con qué licencia, cuándo, hash) e imprime
 * el bloque YAML listo para pegar en `imagenes[]` del registro.
 *
 * Se niega sin licencia. No verifica la licencia por su cuenta: quien la declara tiene que haberla
 * leído en la página de origen (`--pagina`), y eso queda registrado con su nombre de agente. Las
 * licencias admitidas son las libres: Creative Commons BY / BY-SA / CC0, dominio público, y las
 * declaradas por un organismo público en su sitio. Una foto de un diario no entra por acá ni por
 * ningún lado.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { descargar } from './lib/http.ts';
import { parsearArgs } from './lib/log.ts';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = path.join(RAIZ, 'data', 'imagenes-ledger.json');
const LICENCIAS = /^(CC[ -]?(BY|BY-SA|0)( ?\d(\.\d)?)?|dominio p[úu]blico|public domain|licencia libre declarada por .+)$/i;

interface EntradaLedger {
  archivo: string;
  url: string;
  pagina?: string;
  credito: string;
  licencia: string;
  licencia_url?: string;
  sha256: string;
  bytes: number;
  fecha: string;
  agente: string;
}

function ayuda(): number {
  console.error(
    [
      'Uso: pnpm imagen <url> --para <coleccion>/<id> --credito "<autor>" --licencia "<licencia>" [--licencia-url <url>] [--pagina <url>] [--alt "<texto>"] [--pie "<texto>"]',
      '',
      'Licencias admitidas: CC BY, CC BY-SA, CC0 (con versión), dominio público, o "licencia libre declarada por <organismo>" cuando el sitio del organismo lo dice.',
      'La página de origen (--pagina) es donde se leyó la licencia; conviene darla siempre.',
    ].join('\n'),
  );
  return 2;
}

async function main(): Promise<number> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const url = posicionales[0];
  const para = typeof opciones.para === 'string' ? opciones.para : '';
  const credito = typeof opciones.credito === 'string' ? opciones.credito.trim() : '';
  const licencia = typeof opciones.licencia === 'string' ? opciones.licencia.trim() : '';
  if (!url || !para || !credito || !licencia) return ayuda();
  if (!LICENCIAS.test(licencia)) {
    console.error(`Licencia no admitida: "${licencia}". Solo licencias libres (CC BY, CC BY-SA, CC0, dominio público) o "licencia libre declarada por <organismo>".`);
    return 1;
  }
  const [coleccion, ...restoId] = para.split('/');
  const id = restoId.join('/');
  if (!coleccion || !id) return ayuda();

  let r: Awaited<ReturnType<typeof descargar>>;
  try {
    r = await descargar(url);
  } catch (e) {
    console.error(`No se pudo bajar ${url}: ${e instanceof Error ? e.message : e}`);
    return 1;
  }
  if (r.estado !== 200 || !r.buffer?.length) {
    console.error(`No se pudo bajar ${url}: HTTP ${r.estado}`);
    return 1;
  }
  const tipo = (r.contentType ?? '').toLowerCase();
  const ext = tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : tipo.includes('jpeg') || tipo.includes('jpg') ? 'jpg' : tipo.includes('gif') ? 'gif' : null;
  if (!ext) {
    console.error(`La URL no devolvió una imagen (content-type: ${r.contentType ?? 'desconocido'}).`);
    return 1;
  }
  const datos = r.buffer;
  const sha256 = createHash('sha256').update(datos).digest('hex');
  const dir = path.join(RAIZ, 'public', 'imagenes', coleccion, ...id.split('/'));
  mkdirSync(dir, { recursive: true });
  const nombre = `${sha256.slice(0, 10)}.${ext}`;
  const destino = path.join(dir, nombre);
  writeFileSync(destino, datos);
  const rutaSitio = `/imagenes/${coleccion}/${id}/${nombre}`;
  if (datos.length > 800_000) console.error(`⚠ ${(datos.length / 1024).toFixed(0)} KB: es pesada para una página; conviene una versión más chica de la misma fuente.`);

  const ledger: EntradaLedger[] = existsSync(LEDGER) ? (JSON.parse(readFileSync(LEDGER, 'utf8')) as EntradaLedger[]) : [];
  ledger.push({
    archivo: rutaSitio,
    url,
    pagina: typeof opciones.pagina === 'string' ? opciones.pagina : undefined,
    credito,
    licencia,
    licencia_url: typeof opciones['licencia-url'] === 'string' ? (opciones['licencia-url'] as string) : undefined,
    sha256,
    bytes: datos.length,
    fecha: new Date().toISOString().slice(0, 10),
    agente: process.env.LA_CASTA_AGENTE ? 'agente' : 'humano',
  });
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n', 'utf8');

  const alt = typeof opciones.alt === 'string' ? opciones.alt : '(describí la imagen para quien no la ve)';
  const pie = typeof opciones.pie === 'string' ? opciones.pie : undefined;
  console.log(`✔ guardada en public${rutaSitio} (${(datos.length / 1024).toFixed(0)} KB) y anotada en data/imagenes-ledger.json`);
  console.log('\nBloque para imagenes[] del registro:\n');
  const lineas = [`  - url: ${rutaSitio}`, `    alt: ${JSON.stringify(alt)}`];
  if (pie) lineas.push(`    pie: ${JSON.stringify(pie)}`);
  lineas.push(`    credito: ${JSON.stringify(credito)}`, `    licencia: ${JSON.stringify(licencia)}`);
  if (typeof opciones['licencia-url'] === 'string') lineas.push(`    licencia_url: ${opciones['licencia-url']}`);
  if (typeof opciones.pagina === 'string') lineas.push(`    pagina: ${opciones.pagina}`);
  console.log(lineas.join('\n'));
  return 0;
}

// Sin process.exit: en Windows, salir con una descarga a medio cerrar aborta con una asercion de libuv.
main()
  .then((codigo) => {
    process.exitCode = codigo;
  })
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  });
