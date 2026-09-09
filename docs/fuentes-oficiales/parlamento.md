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

## Qué cambia para el sitio

- Un legislador de cualquier época tiene su registro parlamentario disponible; «no hay texto» ya
  no es una respuesta válida para 1985-2000 ni para antes.
- Para una persona con poca prensa (un diputado de los 90), el diario de sesiones es la fuente
  primaria principal y alcanza para `textual`.
