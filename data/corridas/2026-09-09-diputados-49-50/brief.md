# Fichas de los diputados de las legislaturas XLIX (2020-2025) y L (2025-2030)

Fecha: 2026-09-09. Pedido del mantenedor: «completemos el actual y último período con los políticos,
así podemos linkearlos a sus votos». Es la base del seguimiento de votaciones (`content/votaciones/`):
o tienen ficha todos los que votan, o ninguno.

## Qué se carga

Una ficha (`politicos.yaml`) por cada persona que ocupó una banca titular de la Cámara de
Representantes en la legislatura XLIX (15 de febrero de 2020 a 14 de febrero de 2025) o en la L
(desde el 15 de febrero de 2025), los 99 de cada una, con:

- `nombre` completo como figura en el Parlamento, `nombre_corto` como la nombra la prensa, `partido`
  (nombre canónico: Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto, Partido
  Independiente, Identidad Soberana, Partido de la Gente, PERI), `alias` (apellido solo, nombre y
  apellido, variantes).
- `mandatos[]`: un mandato por legislatura, `cargo: "Representante Nacional por <Departamento>"`,
  `desde` (2020-02-15 o 2025-02-15) y `hasta` (2025-02-14 para la XLIX; vacío si sigue), con la
  fuente oficial: la página de la persona en `parlamento.gub.uy/camarasycomisiones/legisladores/<id>`
  (tipo `documento_oficial`, medio `parlamento`), cuya cita es la línea «Representante Nacional por el
  Lema PARTIDO X, departamento de Y» y «La legislatura seleccionada es: Legislatura L (2025-2030)».
  Si dejó la banca antes (pasó al Senado, a un ministerio o a una intendencia), `hasta` con la fecha
  y una segunda fuente (diario de sesiones o nota de prensa).
- `estado` según el esquema (`en_cargo` / `fuera_de_cargo`; `salida` cuando corresponde).
- `candidaturas[]` opcional: solo si la fuente ya está a mano.

## Fuentes, en este orden

1. Página de la persona en parlamento.gub.uy (Conozca a sus legisladores). Se busca con `pnpm fuente
   "https://parlamento.gub.uy/sobreelparlamento/busquedalegisladores/lista?Cpo_Codigo=D&Quienes=T&Plm_codigo=All&Ptm_codigo=All&Fecha%5Bdate%5D=&Fecha%5Btime%5D=&Ppsn_apenombre=<Apellido>&combine="`
   y se abre `https://parlamento.gub.uy/camarasycomisiones/legisladores/<id>` con `pnpm fuente`. La
   biografía en PDF que enlaza esa página sirve para el nombre completo.
2. El diario de sesiones de la primera sesión de cada legislatura (Hemeroteca, `biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/`),
   que lista la asistencia con nombre y apellido.
3. La lista de Wikipedia de cada legislatura es solo un índice para no olvidar a nadie; no se cita.

## Regla 0

Los 99 de cada legislatura, de todos los partidos, con la misma ficha. Nada de adjetivos, nada de
«conocido por»; solo identidad, partido, mandatos con fuente. Lo que no se pueda documentar se
anota en `notas.md`, no se inventa.

## Lotes

- `inbox/diputados/l-a-l/`: legislatura L, apellidos de la A a la L.
- `inbox/diputados/l-m-z/`: legislatura L, apellidos de la M a la Z.
- `inbox/diputados/xlix-a-l/` y `inbox/diputados/xlix-m-z/`: legislatura XLIX, solo quienes no están en la L.

Quien estuvo en las dos legislaturas va en el lote de la L con los dos mandatos. Las personas que ya
tienen ficha en `content/politicos/` no se vuelven a crear: se anota en `notas.md` qué mandato les
falta, y entra por corrección.

## Adenda del 2026-09-09, después de la crítica (antes de promover nada)

La crítica del lote (`critica.md`) encontró un error de método que vale para todos los lotes de
esta corrida, y este brief se corrige antes de que entre un solo registro:

1. **Censo primero, por documento oficial, no por la lista del brief.** La nómina de los 99
   titulares de la legislatura en curso es `https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`
   (con las notas al pie de sustitución) y `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf`
   (partido y departamento junto al nombre). Para la XLIX, la única captura archivada de esa
   nómina es `https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`
   (99 titulares al 22/07/2024). Quien figura ahí es titular de esa legislatura, y su ficha lleva
   ese mandato con esa cita; quien no figura no es titular por esa fuente, y solo lo es si un diario
   de sesiones o su página oficial lo dice con el cargo.
2. **Sin la línea que nombra el cargo, no hay mandato.** En `/legislaturas-actuo`, una fila solo
   prueba un cargo cuando antepone «Representante Nacional por el Lema PARTIDO - Legislatura N» (o
   la equivalente de Senador). Una fila pelada con dos fechas puede ser una suplencia de un día,
   un pasaje al Senado o un dato incompleto: no se carga como mandato de titular. La plantilla
   `desde: 2020-02-15 / hasta: 2025-02-14` no se llena por defecto; cada fecha sale de la fuente.
3. **Un tramo de senador no es un mandato de diputado.** Si la página dice «Convocado a la Cámara
   de Senadores», ese tramo va como `cargo: Senador (suplente)` o `Senador`, con la fecha y el
   titular al que suple, y el mandato de Representante termina con la renuncia a la banca cuando el
   diario la registra.
4. **El mismo criterio para el mismo hecho.** Una suplencia de uno o pocos días es un mandato con
   `cargo: "Representante Nacional por <Departamento> (suplente)"` y sus fechas exactas, nunca un
   mandato de titular ni una fila omitida; si son más de doce períodos, los doce más largos y el
   resto condensado en `notas.md`. El pasaje de un titular al Poder Ejecutivo o a una intendencia no
   corta su mandato de Representante (la banca la ocupa el suplente y el titular puede volver): el
   mandato de diputado sigue hasta el fin del período o hasta la renuncia documentada, y el cargo
   ejecutivo va como otro ítem de `mandatos[]` con su fuente. Vale igual para Cardoso, Lema,
   Amarilla, Castaingdebat y cualquiera en la misma situación.
5. **`salida.tipo: fin_de_mandato` solo en la fecha de fin del período** (14/02/2025 para la XLIX).
   Una renuncia, un pasaje al Senado o al Ejecutivo llevan su propio tipo y la fuente que lo dice.
   `situacion: en_cargo` solo con un mandato abierto y su fuente.
6. **Departamento y partido salen de la nómina** (`LegAlfab.pdf`), no de la fila desordenada de
   tres columnas del PDF de la Cámara.
7. **Ids y alias**: el `_slug` sigue la grafía de la fuente oficial (`inthamoussu-pablo`, no
   `inthamoussou-pablo`; `rodriguez-carlos`, sin departamento). Un alias compartido por dos
   personas (padre e hija, homónimos) se retira de las dos fichas y queda solo el nombre completo.
8. **Quien fue diputado y hoy es senador, o al revés, tiene ficha igual** (Aníbal Pereyra, Mahía,
   Antonini, Ferreira, Viera): la ficha lleva todos los mandatos, cada uno con su fuente.

Nada de esto se aplica distinto a un partido que a otro: el documento que se le exige a un
diputado se le exige a los 99.
