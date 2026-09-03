/**
 * Diff unificado (formato `diff -u`) sin dependencias, por líneas.
 * Se usa para `edicion.diff` en data/corridas/<id>/ y para mostrar cambios
 * entre aprobaciones.
 */

type Op = { tipo: ' ' | '-' | '+'; linea: string };

/** LCS por programación dinámica (los archivos son chicos: cientos de líneas). */
function operaciones(a: string[], b: string[]): Op[] {
  const n = a.length;
  const m = b.length;
  // Tabla de largos de LCS, (n+1) x (m+1). Se usa Uint32Array plana para no crear miles de arrays.
  const L = new Uint32Array((n + 1) * (m + 1));
  const idx = (i: number, j: number) => i * (m + 1) + j;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      L[idx(i, j)] = a[i] === b[j] ? L[idx(i + 1, j + 1)] + 1 : Math.max(L[idx(i + 1, j)], L[idx(i, j + 1)]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ tipo: ' ', linea: a[i] });
      i++;
      j++;
    } else if (L[idx(i + 1, j)] >= L[idx(i, j + 1)]) {
      ops.push({ tipo: '-', linea: a[i] });
      i++;
    } else {
      ops.push({ tipo: '+', linea: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ tipo: '-', linea: a[i++] });
  while (j < m) ops.push({ tipo: '+', linea: b[j++] });
  return ops;
}

function partir(texto: string): string[] {
  if (texto === '') return [];
  const lineas = texto.split(/\r?\n/);
  if (lineas[lineas.length - 1] === '') lineas.pop();
  return lineas;
}

/**
 * Devuelve el diff unificado entre `antes` y `despues`, con `contexto` líneas
 * alrededor de cada cambio. Devuelve '' si son iguales.
 */
export function diffUnificado(antes: string, despues: string, nombreAntes: string, nombreDespues: string, contexto = 3): string {
  const a = partir(antes);
  const b = partir(despues);
  const ops = operaciones(a, b);
  if (!ops.some((o) => o.tipo !== ' ')) return '';

  const salida: string[] = [`--- ${nombreAntes}`, `+++ ${nombreDespues}`];
  // Índices de ops con cambio.
  const cambios = ops.map((o, k) => (o.tipo === ' ' ? -1 : k)).filter((k) => k >= 0);

  // Agrupar cambios en hunks separados por más de 2*contexto líneas iguales.
  const hunks: [number, number][] = [];
  let ini = Math.max(0, cambios[0] - contexto);
  let fin = Math.min(ops.length - 1, cambios[0] + contexto);
  for (let c = 1; c < cambios.length; c++) {
    const k = cambios[c];
    if (k - contexto <= fin + 1) {
      fin = Math.min(ops.length - 1, k + contexto);
    } else {
      hunks.push([ini, fin]);
      ini = Math.max(0, k - contexto);
      fin = Math.min(ops.length - 1, k + contexto);
    }
  }
  hunks.push([ini, fin]);

  // Posición en a y b al inicio de cada op.
  const posA: number[] = [];
  const posB: number[] = [];
  let ia = 0;
  let ib = 0;
  for (const o of ops) {
    posA.push(ia);
    posB.push(ib);
    if (o.tipo !== '+') ia++;
    if (o.tipo !== '-') ib++;
  }

  for (const [h0, h1] of hunks) {
    let largoA = 0;
    let largoB = 0;
    for (let k = h0; k <= h1; k++) {
      if (ops[k].tipo !== '+') largoA++;
      if (ops[k].tipo !== '-') largoB++;
    }
    const iniA = largoA ? posA[h0] + 1 : posA[h0];
    const iniB = largoB ? posB[h0] + 1 : posB[h0];
    salida.push(`@@ -${iniA},${largoA} +${iniB},${largoB} @@`);
    for (let k = h0; k <= h1; k++) salida.push(ops[k].tipo + ops[k].linea);
  }
  return salida.join('\n') + '\n';
}
