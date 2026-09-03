/**
 * Canonicalizacion de URLs para que la misma nota tenga siempre el mismo id.
 */

const PARAMETROS_BASURA = new Set([
  'fbclid', 'gclid', 'dclid', 'msclkid', 'igshid', 'mc_cid', 'mc_eid', 'ref', 'ref_src', 'refsrc',
  '_ga', '_gl', 'yclid', 'twclid', 'ttclid', 'si', 'feature', 'ncid', 'cmpid', 'ito', 'source', 'outputType',
]);

const HOSTS_YOUTUBE = new Set(['youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com', 'youtube-nocookie.com']);

function esParametroBasura(nombre: string): boolean {
  const n = nombre.toLowerCase();
  return n.startsWith('utm_') || PARAMETROS_BASURA.has(n);
}

/** Host sin `www.` y en minusculas. */
export function hostDe(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Extrae el id de un video de YouTube (watch?v=, youtu.be/, shorts/, embed/, live/). */
export function idYoutube(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (!HOSTS_YOUTUBE.has(host)) return null;
  if (host === 'youtu.be') return u.pathname.split('/')[1] || null;
  const v = u.searchParams.get('v');
  if (v) return v;
  const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export function esYoutube(url: string): boolean {
  return idYoutube(url) !== null;
}

/** Heuristica: URL que apunta a un video que yt-dlp puede bajar. */
export function esVideo(url: string): boolean {
  if (esYoutube(url)) return true;
  const host = hostDe(url);
  return /(^|\.)(vimeo\.com|dailymotion\.com|twitch\.tv|facebook\.com\/.*\/videos|tiktok\.com)$/.test(host) ||
    /\.(mp4|m4a|mp3|wav|webm|mkv|ogg|opus)(\?|$)/i.test(url);
}

/**
 * Canonicaliza: esquema https si era http, host en minusculas sin www, sin utm_* ni fbclid,
 * sin fragmento, parametros ordenados, sin barra final (salvo raiz). YouTube -> https://www.youtube.com/watch?v=<id>.
 */
export function canonicalizar(url: string): string {
  const entrada = url.trim();
  const yt = idYoutube(entrada);
  if (yt) return `https://www.youtube.com/watch?v=${yt}`;

  let u: URL;
  try {
    u = new URL(entrada);
  } catch {
    return entrada;
  }
  u.protocol = u.protocol === 'http:' ? 'https:' : u.protocol;
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
  u.hash = '';
  u.username = '';
  u.password = '';
  if ((u.protocol === 'https:' && u.port === '443') || (u.protocol === 'http:' && u.port === '80')) u.port = '';

  const conservados: [string, string][] = [];
  for (const [k, v] of u.searchParams) if (!esParametroBasura(k)) conservados.push([k, v]);
  conservados.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));
  u.search = '';
  for (const [k, v] of conservados) u.searchParams.append(k, v);

  let ruta = u.pathname.replace(/\/{2,}/g, '/');
  if (ruta.length > 1 && ruta.endsWith('/')) ruta = ruta.slice(0, -1);
  if (/\/index\.(html?|php)$/i.test(ruta)) ruta = ruta.replace(/\/index\.(html?|php)$/i, '') || '/';
  u.pathname = ruta;

  let salida = u.toString();
  // URL.toString() agrega "/" en la raiz; lo dejamos porque es la forma estandar.
  if (salida.endsWith('?')) salida = salida.slice(0, -1);
  return salida;
}
