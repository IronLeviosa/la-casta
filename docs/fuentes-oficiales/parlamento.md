# Parlamento: dónde están los diarios de sesiones y cómo se leen

Dos sitios distintos, y el que todos miran primero es el que menos tiene.

## 1. `parlamento.gub.uy` (buscador de documentos y leyes)

- Diarios de sesiones de la Cámara de Representantes **desde el 11 de febrero de 2000**; Senado y
  Asamblea General desde 1985. Antes de eso, el buscador no devuelve nada, y de ahí salió la
  frase falsa «los diarios anteriores a 2000 no están digitalizados».
- Los enlaces del buscador son `infolegislativa.parlamento.gub.uy/temporales/<n>.PDF` y **caducan**
  (el mismo número devuelve 404 horas después). Citar siempre con la copia de Wayback que
  `pnpm fuente` pide al leer, o mejor, con la URL estable de la Biblioteca (abajo).
- Fichas de asunto (`parlamento.gub.uy/documentosyleyes/ficha-asunto/<n>`), versiones
  taquigráficas de comisiones, y las fichas de legisladores con asistencia.

## 2. `biblioteca.parlamento.gub.uy` (Hemeroteca Digital de la Biblioteca del Poder Legislativo)

- **Todos los diarios de sesiones desde 1830**: Asamblea General, Senadores, Representantes,
  Comisión Permanente, Consejo de Estado (1973-1985), Asamblea Deliberante, Constituyente,
  Asamblea de Notables. Inventario oficial por legislatura y tomo en
  `https://biblioteca.parlamento.gub.uy/File/Biblioteca/DiariosdeSesionesDisponibles.pdf`.
- Interfaz: `https://biblioteca.parlamento.gub.uy/PublicacionesPeriodicas/busquedalibreTimeLine/?op=ds`,
  un timeline por década y año (JavaScript). Los enlaces «ver?archivo=…» abren un visor y no sirven
  para citar.
- **URL estable del PDF de cada diario**, que es la que se cita y la que lee `pnpm fuente`:
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesiones<camara>/<AAAA-MM-DD> - DIARIO DE SESIONES DE LA <CÁMARA> (<NNNN>).pdf`
  con `<camara>` = `crr` (Representantes), `css` (Senadores), `ag` (Asamblea General), `cp`
  (Comisión Permanente); `<NNNN>` es el número de diario dentro del período; los espacios van
  codificados como `%20`. Ejemplo: `…/sesionescrr/1996-12-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0001).pdf`.
- Los PDF de los años 90 tienen capa de texto (un diario de 1996 dio 258.000 caracteres); los
  anteriores pueden ser escaneos, y `pnpm fuente` los pasa por OCR.
- Hay tomos «[INDICE ALFABETICO]» por período que listan a cada legislador con las sesiones y
  páginas donde intervino: son el atajo para no leer los 80 diarios de un año.
- Cómo armar el inventario de un año: en el timeline, al hacer clic en el año, la página carga las
  tapas como imágenes `TapasD/sesiones<camara>/<nombre>.jpg`; el nombre de cada tapa es el nombre
  del PDF. `.cache/biblioteca-crr-1995-2000.json` tiene el de Representantes 1995-2000, y
  `.cache/barrer-biblioteca.ts` baja cada diario al corpus y busca un apellido.
- **La carpeta no se puede listar** (`.../Publicaciones/sesionescrr/` responde 403): el `<NNNN>` de
  una fecha no se adivina, hay que sacarlo de un índice. `pnpm sesion <crr|css> <AAAA-MM-DD>`
  (`scripts/corpus/sesion.ts`) hace esa búsqueda por vos, en este orden:
  1. Para Representantes desde el 2014-03-01: el CSV oficial de sesiones,
     `https://documentos.diputados.gub.uy/docs/DAdiarioSesiones.csv` (columnas `Legislatura,
     Periodo, Tipo, Sesion, SesionTipo, SesionFecha, Diario, URL`; la fecha viene como
     `2026/07/14` o `2014-03-12 00:00:00` según el tramo del archivo). `URL` es un PDF directo en
     `diputados.gub.uy`, no la Hemeroteca, pero es la misma sesión y sirve igual para citar. Se
     cachea 24 h en `.cache/sesiones/` (gitignored).
  2. El índice CDX de Wayback sobre la carpeta de la Hemeroteca, para cualquier cámara y
     cualquier año: `http://web.archive.org/cdx/search/cdx?url=biblioteca.parlamento.gub.uy/Publicaciones/<carpeta>/<AAAA-MM-DD>*&output=txt&fl=original&collapse=urlkey`,
     con `<carpeta>` = `sesionescrr` (Representantes) o `sesionescss` (Senadores). La cobertura es
     pareja (llega a 1853) pero no exhaustiva: una fecha puntual puede no estar capturada.
  3. `data/diarios-archive.json`, el índice fecha → ítem de la colección `uruguay-diario-sesiones`
     de archive.org que arma `pnpm sesion:indexar` (§2.3). Se prueba solo, sin ninguna opción: es
     lo que reemplazó al tercer índice de más abajo como camino por omisión.
  4. La misma colección `uruguay-diario-sesiones` de archive.org (2478 ítems de Senadores, 1615 de
     Representantes) a mano, para las fechas que Wayback nunca capturó y que el índice todavía no
     tiene (no se corrió `pnpm sesion:indexar`, o el ítem quedó `sin_fecha`/`sin_ocr`) — el barrido
     de la corrida Astori (2026-09-16) encontró seis sesiones de Senadores de 1990-2001 así. Solo se
     prueba si se le pasan `--tomo/--numero` o `--legislador <id>`.
  Si ninguno encuentra la fecha, `pnpm sesion` sale con error y dice qué probó, más el diario más
  cercano que sí encontró en Wayback ese año (los números son consecutivos dentro de una
  legislatura: desde ahí se cuenta a mano) y, si no se usó `--tomo/--numero/--legislador`, la
  sugerencia de probar archive.org.

### 2.1. `uruguay-diario-sesiones` en archive.org: identificador por tomo/número, no por fecha

El ítem de archive.org no tiene la fecha de la sesión en sus metadatos, solo tomo y número (el
título es del tipo «Diario de Sesiones Cámara de Senadores Uruguay. Tomo 68. Número 41»), así que
la fecha no se puede buscar ahí directamente. El identificador se arma así:

- Senadores: `UruguayDiarioSesiones_CS_<tomo>_<numero>`, los dos con relleno a 3 dígitos (ej.
  `UruguayDiarioSesiones_CS_068_041`).
- Representantes: `UruguayDiarioSesiones_CR_<numero>`, sin relleno (ej.
  `UruguayDiarioSesiones_CR_3548`).
- El PDF está en `https://archive.org/download/<id>/<id>.pdf`; la lista de archivos del ítem, en
  `https://archive.org/metadata/<id>/files` (JSON `{result:[{name, format}, …]}`); y si el ítem
  existe se puede chequear con `https://archive.org/metadata/<id>` (JSON con las claves del ítem;
  un id que no existe da `{}` o un resultado vacío).

Para llegar del día que se está investigando al tomo y el número (el «d.s.») hace falta la
actuación legislativa de alguien que haya participado esa sesión:
`https://parlamento.gub.uy/camarasycomisiones/legisladores/<id>/actuacion-legislador/json?_format=json`
(el `<id>` es el de la URL de la ficha de esa persona, `.../legisladores/<id>`) devuelve un array de
`{ "Fecha": "DD-MM-YYYY", "Texto": "… <a href=\"…\">tomo 68 pág.5 d.s.41</a>" }`; se filtran las
filas de la fecha buscada y se les saca `tomo` y `d.s.` del texto (algunas filas viejas traen
`tomo 0`, que quiere decir «no consta» y para Senadores no alcanza para armar el identificador).

**El endpoint solo tiene a los legisladores de la legislatura actual.** Para cualquier otro (un
senador o diputado de un período anterior, aunque su ficha exista) devuelve `[]` entero, no
filtrado por fecha: verificado 2026-09-16 con Danilo Astori (id 479, senador hasta 2022): `[]` con
o sin `Fechadesde/Fechahasta/Legislatura` como parámetro. Para esas personas el tomo y el número
salen de otro lado: el diario mismo (si ya se tiene por otra vía), el índice alfabético por período
de la Hemeroteca (sección 2 arriba), o contando desde un diario vecino que sí se identificó. Con
esos dos datos alcanza `--tomo/--numero` sin pasar por `--legislador`.

La cadena completa es **actuación legislativa → tomo y d.s. → identificador → PDF**, y
`pnpm sesion` la resuelve sola:

```
pnpm sesion css 2001-05-23 --legislador 2921        # saca tomo/d.s. de la actuación de esa persona
pnpm sesion css 2001-05-23 --tomo 68 --numero 41    # si el tomo y el número ya se conocen
pnpm sesion crr 1996-03-01 --numero 1234            # Representantes: solo --numero, sin tomo
```

Un diario citado desde archive.org es el mismo documento que el de la Hemeroteca: lleva
`medio: parlamento`, `tipo: diario_de_sesiones` igual que cualquier otro diario de sesiones, no
`tipo: documento_oficial` ni nada distinto por venir de ese espejo.

### 2.2. `pnpm sesion` verifica la fecha contra la cabecera antes de dar el PDF por bueno

Como el identificador de archive.org es por tomo/número y no por fecha, pedir el tomo o el
`d.s.` equivocado da un PDF real pero de otro día, sin que nada lo avise. Antes de devolver una
fuente de archive.org, `pnpm sesion` pide los primeros ~3000 bytes del OCR
(`https://archive.org/download/<id>/<id>_djvu.txt`, con `Range: bytes=0-2999`) y busca ahí la
fecha en letras de la cabecera del diario, del tipo:

```
Nº 103 - TOMO 407


23 DE MAYO DE 2001


REPUBLICA ORIENTAL DEL URUGUAY
```

(el OCR a veces convierte el «Nº» en «N*»; la fecha va en su propia línea, después del tomo). Una
sesión de dos días trae las dos fechas juntas, por ejemplo «26 Y 27 DE MARZO DE 1990». Con esa
fecha (o esas dos) se compara contra la fecha pedida:

- **coincide**: la fuente se incluye con `fecha_cabecera` y `verificada: true`; en texto sale
  como `[archive] tomo T diario N (cabecera: AAAA-MM-DD) <url>`.
- **la cabecera dice otra fecha**: la fuente **se descarta** (no se ofrece como si fuera buena) y
  se imprime `archive.org <id>: la cabecera dice <fecha(s)>, no <fecha pedida>: identificador
  equivocado`, tanto en la lista de qué se probó como en el mensaje de «sin resultados» si no queda
  ninguna otra fuente. Es la señal de que el tomo o el `d.s.` que se pasó (a mano o vía
  `--legislador`) está mal.
- **no se pudo leer la cabecera** (el `_djvu.txt` no existe o falla la red) o **no se reconoció
  ninguna fecha en el texto**: la fuente se incluye igual pero con `verificada: false` y el aviso
  «fecha sin confirmar en la cabecera»; en texto sale como `(cabecera sin confirmar)`. No es un
  error, pero quien la use para citar sabe que no quedó chequeada del todo.

Para leer la cabecera a mano (por ejemplo si `pnpm sesion` la descarta y hay que confirmar el tomo
correcto): abrir `https://archive.org/download/<id>/<id>_djvu.txt` en el navegador o con
`pnpm fuente`, y mirar las primeras líneas — ahí está el número de diario, el tomo y la fecha en
letras, antes de que empiece la transcripción de la sesión.

### 2.3. `data/diarios-archive.json`: el índice fecha → ítem, para no pedir tomo/número a mano

Decidido el 2026-09-16 (`docs/plan-indice-diarios.md`), después de que un corrector de Batlle
1999-2004 no pudo abrir ningún diario del Senado de 1999: Wayback no tiene capturas de
`sesionescss/1999-*`, y sin `--legislador` (que solo cubre la legislatura en curso) ni tomo/número
a mano, el tercer índice de §2 nunca se probaba.

`pnpm sesion:indexar [--camara CS|CR|AG|CP] [--limite n] [--reintentar] [--concurrencia n]`
(`scripts/corpus/sesion-indexar.ts`) recorre la colección entera con la API de búsqueda de
archive.org (5.009 ítems), lee los primeros ~3.000 bytes del OCR de cada uno y fecha la cabecera
con las mismas funciones que verifica `pnpm sesion` (`recortarCabecera` + `fechasDeCabecera`).
Deja el resultado en `data/diarios-archive.json`, público como `data/fuentes-ledger.json`: un
identificador de archive.org es un dato público, no una nota. Formato:

```json
{
  "version": 1,
  "coleccion": "https://archive.org/details/uruguay-diario-sesiones",
  "items": {
    "UruguayDiarioSesiones_CS_407_103": {
      "camara": "CS", "tomo": 407, "numero": 103,
      "fechas": ["2001-05-23"], "cabecera": "N* 103 - TOMO 407 23 DE MAYO DE 2001",
      "estado": "fechado"
    }
  },
  "resumen": { "CS": { "2001": 1 } }
}
```

`estado` es `fechado` (al menos una fecha reconocida), `sin_fecha` (se leyó el OCR pero
`fechasDeCabecera` no reconoció ninguna fecha — casi siempre ruido de OCR: «1?» en vez de «1º»,
o una palabra rota que tapa el mes) o `sin_ocr` (no se pudo leer el `_djvu.txt`, tras los
reintentos). Es incremental: un ítem `fechado` no se vuelve a pedir; `sin_ocr` se reintenta siempre
(fue la red); `sin_fecha` solo con `--reintentar` (es el parser, no la red).

Los identificadores no siguen siempre el patrón de dos números (tomo y número) que parecía la
regla: verificado contra la API real, algunos ítems de Asamblea General y Comisión Permanente no
llevan tomo (`UruguayDiarioSesiones_AG_060`, un solo número, como Representantes) y algunos de
Senadores y Asamblea General llevan un tercer número de sufijo
(`UruguayDiarioSesiones_CS_407_106_2`). `parsearIdentificadorArchive` acepta uno, dos o tres
números después de la cámara.

`pnpm sesion <crr|css> <fecha>` consulta este índice automáticamente cuando no se le pasa
`--tomo/--numero/--legislador` (§2, camino 3): busca los ítems de la cámara pedida cuyas `fechas`
incluyen la fecha buscada y cada candidato pasa igual por la verificación de cabecera de §2.2 — el
índice acelera la búsqueda, no reemplaza el cotejo. Si `data/diarios-archive.json` no existe
todavía, `pnpm sesion` lo avisa con el comando que lo construye y sigue con el comportamiento de
antes (CSV, CDX de Wayback, y archive.org solo a mano).

## `parlamento.gub.uy`: endpoints de datos detrás de páginas que arman con JavaScript

Varias páginas de `camarasycomisiones/` no traen nada en el HTML: la arma Angular en el navegador,
y `pnpm fuente` (desde el hallazgo de la corrida piloto del 2026-09-15) las rechaza en vez de
guardarlas como si tuvieran texto (`pareceArmazonJs` en `scripts/corpus/fuente.ts`: HTML grande,
poco texto visible, varios `<script>`). Cada una de esas páginas tiene un endpoint de datos
hermano que sí sirve para citar:

- `parlamento.gub.uy/camarasycomisiones/legisladores/<id>` — ficha de un legislador: **armazón de
  JavaScript, `pnpm fuente` la rechaza**. La actuación del legislador está en
  `parlamento.gub.uy/camarasycomisiones/legisladores/<id>/actuacion-legislador/json?_format=json`.
- `parlamento.gub.uy/camarasycomisiones/representantes/comisiones/<id>/comision-actuacion/csv?Fechadesde=AAAA-MM-DD&Fechahasta=AAAA-MM-DD&_format=csv`
  — asistencia de una comisión en un rango de fechas, en CSV.

## Qué cambia para el sitio

- Un legislador de cualquier época tiene su registro parlamentario disponible; «no hay texto» ya
  no es una respuesta válida para 1985-2000 ni para antes.
- Para una persona con poca prensa (un diputado de los 90), el diario de sesiones es la fuente
  primaria principal y alcanza para `textual`.
