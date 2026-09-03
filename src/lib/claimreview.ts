/**
 * JSON-LD ClaimReview (schema.org) para chequeos, giros y promesas.
 *
 * ClaimReview está pensado para verificaciones de hechos; para giros y
 * promesas se usa el mismo vocabulario con una escala propia declarada en
 * `alternateName`, `ratingValue`, `bestRating` y `worstRating`, que es lo que
 * hacen PolitiFact (Flip-O-Meter) y Chequeado (promesas).
 */

import { urlAbsoluta } from './ruta';

export interface DatosAutor {
  nombre: string;
  wikidata?: string;
}

interface Base {
  url: string;
  fecha: string;
  afirmacion: string;
  autor: DatosAutor;
  fechaAfirmacion: string;
  fuenteAfirmacionUrl?: string;
}

/** El editor de la verificación, identificado por la URL vigente del sitio. */
function organizacion() {
  return { '@type': 'Organization', name: 'La Casta', url: urlAbsoluta('/') };
}

function base(d: Base, rating: { alternateName: string; ratingValue: number; bestRating: number; worstRating: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    url: d.url,
    datePublished: d.fecha,
    author: organizacion(),
    claimReviewed: d.afirmacion,
    itemReviewed: {
      '@type': 'Claim',
      datePublished: d.fechaAfirmacion,
      author: {
        '@type': 'Person',
        name: d.autor.nombre,
        ...(d.autor.wikidata ? { sameAs: `https://www.wikidata.org/wiki/${d.autor.wikidata}` } : {}),
      },
      ...(d.fuenteAfirmacionUrl
        ? { appearance: { '@type': 'CreativeWork', url: d.fuenteAfirmacionUrl } }
        : {}),
    },
    reviewRating: { '@type': 'Rating', ...rating },
  };
}

const RATING_CHEQUEO: Record<'verdadero' | 'discutible' | 'falso', { alternateName: string; ratingValue: number }> = {
  verdadero: { alternateName: 'Verdadero', ratingValue: 5 },
  discutible: { alternateName: 'Discutible', ratingValue: 3 },
  falso: { alternateName: 'Falso', ratingValue: 1 },
};

export function claimReviewChequeo(d: Base & { calificacion: keyof typeof RATING_CHEQUEO }) {
  return base(d, { ...RATING_CHEQUEO[d.calificacion], bestRating: 5, worstRating: 1 });
}

const RATING_GIRO: Record<'sin_cambio' | 'cambio_parcial' | 'cambio_total', { alternateName: string; ratingValue: number }> = {
  sin_cambio: { alternateName: 'Sin cambio', ratingValue: 3 },
  cambio_parcial: { alternateName: 'Cambio parcial', ratingValue: 2 },
  cambio_total: { alternateName: 'Cambio total', ratingValue: 1 },
};

export function claimReviewGiro(d: Base & { cambio: keyof typeof RATING_GIRO }) {
  return base(d, { ...RATING_GIRO[d.cambio], bestRating: 3, worstRating: 1 });
}

const RATING_PROMESA: Record<
  'cumplida' | 'en_proceso_adelantada' | 'en_proceso_demorada' | 'incumplida',
  { alternateName: string; ratingValue: number }
> = {
  cumplida: { alternateName: 'Cumplida', ratingValue: 4 },
  en_proceso_adelantada: { alternateName: 'En proceso, adelantada', ratingValue: 3 },
  en_proceso_demorada: { alternateName: 'En proceso, demorada', ratingValue: 2 },
  incumplida: { alternateName: 'Incumplida', ratingValue: 1 },
};

export function claimReviewPromesa(d: Base & { estado: keyof typeof RATING_PROMESA }) {
  return base(d, { ...RATING_PROMESA[d.estado], bestRating: 4, worstRating: 1 });
}

/** Serializa JSON-LD de forma segura para incrustar en un <script>. */
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj).replaceAll('</', '<\\/');
}
