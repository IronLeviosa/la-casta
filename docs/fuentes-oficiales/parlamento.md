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
  Si ninguno de los dos encuentra la fecha, `pnpm sesion` sale con error y dice qué probó, más el
  diario más cercano que sí encontró en Wayback ese año (los números son consecutivos dentro de
  una legislatura: desde ahí se cuenta a mano).

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
