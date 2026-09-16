# Plan: índice fecha → ítem de la colección `uruguay-diario-sesiones` de archive.org

Decidido el 2026-09-16 a propuesta de la sesión de orquestación, después del corrector de Batlle
1999-2004, que no pudo abrir ningún diario del Senado de 1999: Wayback no tiene capturas de
`sesionescss/1999-*`, la actuación legislativa del Parlamento solo cubre la legislatura en curso,
y sin tomo y número no hay identificador de archive.org. Es un hueco que se repite para cada
senador de 1985 a 2002 y que la corrida de censo de los cinco presidentes va a pisar (cargos
legislativos de Batlle y Mujica anteriores a 2000, fechados con nómina o diario de sesiones,
`docs/colecciones/politicos.md`). Un índice construido una vez lo vuelve una consulta.

Lo implementa una sesión de ejecución en el worktree `la-casta-taller` (rama `taller`), sin
commitear: la sesión Fable revisa el diff, commitea y mergea (regla 17). Nada de esto toca el
árbol de `main` ni `content/`.

## 1. Premisas verificadas (2026-09-16, API de búsqueda y de metadatos de archive.org)

| Dato | Valor |
|---|---|
| Ítems `identifier:UruguayDiarioSesiones_*` | 5.009 |
| Senadores `_CS_<tomo>_<numero>` (tomo y número a 3 dígitos) | 2.478 |
| Representantes `_CR_<numero>` (sin tomo) | 1.615 |
| Asamblea General `_AG_<tomo>_<numero>`, Comisión Permanente `_CP_<tomo>_<numero>[_n]` | 916 |
| Fecha en los metadatos | Senadores: ninguna. Representantes: solo `year` (`date` es 1 de enero, relleno). |
| Fecha en el OCR | Primera línea de `<id>_djvu.txt`: `N* 263 - TOMO 390 \n\n\n16 DE SETIEMBRE DE 1998` (Range de 600 bytes alcanza; `pnpm sesion` ya pide 3.000). |
| Archivos por ítem | `<id>.pdf` y `<id>_djvu.txt`. |

Lo que ya existe y se reutiliza, todo en `scripts/corpus/sesion.ts`: `identificadorArchive`,
`recortarCabecera` (recorta al bloque de cabecera antes del cuerpo, para no leer «Montevideo, 22
de mayo de 2001» como fecha de sesión), `fechasDeCabecera` (fechas en letras, con «26 Y 27 DE
MARZO DE 1990», «1º DE», tildes de OCR), `cabeceraArchive` (Range GET del OCR con
`fetchWayback`). `docs/fuentes-oficiales/parlamento.md` §2.1 y §2.2 describen la colección y la
verificación de cabecera.

## 2. El índice: `data/diarios-archive.json`

Público, en `data/` como `fuentes-ledger.json`: lo escribe la máquina, cualquier máquina y CI
resuelven fechas sin el corpus privado, y un lector puede comprobar que
`UruguayDiarioSesiones_CS_390_263` es el 16 de setiembre de 1998. Un ítem de archive.org es un
identificador público, no una nota: no hay motivo para esconderlo en el corpus.

```json
{
  "version": 1,
  "coleccion": "https://archive.org/details/uruguay-diario-sesiones",
  "generado": "2026-09-16T18:00:00Z",
  "script": "scripts/corpus/sesion-indexar.ts",
  "items": {
    "UruguayDiarioSesiones_CS_390_263": {
      "camara": "CS",
      "tomo": 390,
      "numero": 263,
      "fechas": ["1998-09-16"],
      "cabecera": "N* 263 - TOMO 390 16 DE SETIEMBRE DE 1998",
      "estado": "fechado"
    }
  },
  "resumen": { "CS": { "1998": 48 }, "CR": { "2010": 69 } }
}
```

- `items` con claves ordenadas (diff estable). `camara` ∈ `CS | CR | AG | CP`; `tomo` solo cuando
  el identificador lo trae; `numero` entero (el sufijo `_3` de algunos `CP` va en `sufijo`).
- `fechas`: todas las que la cabecera nombra (una sesión de dos días son dos fechas al mismo ítem).
- `cabecera`: los primeros 120 caracteres del OCR con espacios colapsados, para que un humano vea
  de dónde salió la fecha sin abrir archive.org.
- `estado`: `fechado` (al menos una fecha), `sin_fecha` (OCR leído, ninguna fecha reconocida: se
  guarda `cabecera` igual para una segunda pasada del parser), `sin_ocr` (el ítem no tiene
  `_djvu.txt` o el GET falló tras los reintentos; se reintenta en la próxima corrida).
- `resumen`: ítems `fechado` por cámara y año. Es lo que dice dónde quedan huecos (el Senado de
  1999, por ejemplo) sin abrir el archivo.
- Tamaño esperado: 5.009 ítems × ~150 bytes ≈ 750 KB. Aceptable; si supera 2 MB, JSONL.

## 3. Script `scripts/corpus/sesion-indexar.ts`, comando `pnpm sesion:indexar`

`pnpm sesion:indexar [--camara CS|CR|AG|CP] [--limite n] [--reintentar] [--concurrencia n]`

1. Lista la colección con la API de búsqueda:
   `https://archive.org/advancedsearch.php?q=identifier:UruguayDiarioSesiones_*&fl[]=identifier&rows=10000&output=json`
   (una sola llamada; hoy son 5.009 filas). Parsea cámara, tomo, número y sufijo del identificador
   con una función pura exportada (`parsearIdentificadorArchive`), y avisa por los que no matchean.
2. Carga `data/diarios-archive.json` si existe. Incremental: salta los `fechado`; con
   `--reintentar` vuelve sobre `sin_fecha` y `sin_ocr`; sin la opción, `sin_ocr` se reintenta
   igual (fue un fallo de red) y `sin_fecha` no (es el parser).
3. Por cada ítem pendiente, `Range: bytes=0-2999` de `<id>_djvu.txt` con `fetchWayback` (o el
   helper que `cabeceraArchive` use), `user-agent` propio, concurrencia 3 por defecto,
   reintentos con espera 2 s, 8 s, 30 s ante 429, 5xx o timeout; un 404 del `_djvu.txt` es
   `sin_ocr` sin reintento. Fecha con `recortarCabecera` + `fechasDeCabecera`.
4. Escribe el archivo cada 200 ítems y al final (una corrida cortada no pierde lo hecho), con
   `generado` y `resumen` recalculados. Log de avance cada 100 (`1.200/5.009 · fechados 1.150 ·
   sin_fecha 38 · sin_ocr 12`) y al final la tabla `resumen` por cámara y año, más los `sin_fecha`
   con su `cabecera` para ver qué le falta al parser.
5. Costo: 5.009 GET de 3 KB. A 3 concurrentes y ~1 s cada uno, 30 a 40 minutos de red, cero
   tokens. `--limite 50` para probar antes de la corrida completa.

Nada se baja entero: ni PDF ni OCR completo. Nada de esto va a `.cache/` salvo, si se quiere, la
respuesta de la búsqueda.

## 4. `pnpm sesion` usa el índice

En `scripts/corpus/sesion.ts`, un cuarto camino entre el CDX de Wayback y las opciones a mano:
sin `--tomo/--numero` ni `--legislador`, busca en `data/diarios-archive.json` los ítems de la
cámara pedida (`css` → `CS`, `crr` → `CR`) cuyas `fechas` incluyen la fecha. Cada candidato pasa
por la verificación de cabecera que ya existe (`cabeceraArchive` + `fechasDeCabecera`): el índice
acelera, no reemplaza el cotejo, así que un ítem mal indexado se detecta al usarlo. Varios
candidatos en la misma fecha (ordinaria y extraordinaria) se imprimen todos, con número y tomo,
y el agente elige por contenido. Sin índice en disco: un aviso con el comando que lo construye,
y el comportamiento de hoy.

Función pura exportada `candidatosDelIndice(indice, camara, fecha): CandidatoArchive[]` para
testear sin red. Actualizar el comentario de cabecera del script (los «tres índices» pasan a
cuatro) y el texto de ayuda.

## 5. Tests (sin red), en `tests/sesion.test.ts` o `tests/sesion-indexar.test.ts`

- `parsearIdentificadorArchive`: `_CS_390_263` → `{camara: 'CS', tomo: 390, numero: 263}`;
  `_CR_3692` → `{camara: 'CR', numero: 3692}`; `_CP_025_003_3` → con `sufijo: 3`; uno que no
  matchea → `null`.
- Fusión incremental: un índice previo con un `fechado`, un `sin_fecha` y un `sin_ocr`, y una
  lista nueva con un ítem más: qué se reprocesa con y sin `--reintentar`.
- `candidatosDelIndice`: fecha con dos ítems, fecha sin ninguno, cámara equivocada.
- `resumen` por cámara y año a partir de tres ítems.
- La cabecera real de arriba (`N* 263 - TOMO 390 … 16 DE SETIEMBRE DE 1998`) fechada con las
  funciones existentes, para atar el índice al parser.

## 6. Documentación

- `docs/fuentes-oficiales/parlamento.md` §2.1: el índice existe, dónde está, cómo se
  reconstruye, y que `pnpm sesion css <fecha>` ya no necesita tomo y número para lo que la
  colección tiene.
- `README.md`, tabla de infraestructura: fila `pnpm sesion:indexar`.
- `CLAUDE.md`, fila de `pnpm sesion`: una frase («la colección de archive.org por fecha gracias a
  `data/diarios-archive.json`»). Es la única línea de CLAUDE.md que cambia.
- `data/corridas/README.md` no cambia: el índice no es una corrida.

## 7. Entrega

En el worktree `la-casta-taller`, sin commitear. Al terminar, un informe de menos de 30 líneas:
archivos tocados, `pnpm test` en verde, la tabla `resumen` por cámara y año, cuántos `sin_fecha` y
`sin_ocr` quedaron y tres ejemplos de cabecera `sin_fecha`, y la salida de
`pnpm sesion css 1999-06-15` y `pnpm sesion css 2001-05-23` (esta debe dar
`UruguayDiarioSesiones_CS_407_103`, verificada). La sesión Fable revisa el diff y commitea.

## 8. Qué no hacer

- No bajar PDFs ni OCR completos; no escribir en el corpus privado.
- No tocar `content/`, `data/corridas/`, `.claude/`, ni el árbol de `main`.
- No commitear; no agregar atribución a ningún modelo en archivos ni mensajes.
- No inventar fechas: un ítem sin fecha reconocida queda `sin_fecha` con su cabecera, nunca con
  una fecha deducida del tomo o del número.
