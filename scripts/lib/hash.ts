import { createHash } from 'node:crypto';
import { canonicalizar } from './url.ts';

export function sha1(texto: string | Uint8Array): string {
  return createHash('sha1').update(texto).digest('hex');
}

export function sha256(texto: string | Uint8Array): string {
  return createHash('sha256').update(texto).digest('hex');
}

/** Identificador de una nota del corpus: sha1 de la URL canonica. */
export function idDeUrl(url: string): string {
  return sha1(canonicalizar(url));
}
