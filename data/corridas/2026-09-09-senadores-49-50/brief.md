# Fichas de los senadores de las legislaturas XLIX (2020-2025) y L (2025-2030)

Fecha: 2026-09-09. Pedido del mantenedor: seguir las votaciones de las dos cámaras (`content/votaciones/`)
y los pedidos de desafuero (`/desafueros/`), que se votan en el Senado. O tienen ficha todos los que
votan, o ninguno: esta corrida carga a los titulares de la Cámara de Senadores de las dos legislaturas.
Las suplencias salen después, mecánicamente, de los diarios de sesiones (como en Diputados), y por eso
acá lo que importa es que cada titular tenga su ficha con partido y fechas exactas.

## Qué se carga

Una ficha (`politicos.yaml`) por cada persona que ocupó una banca **titular** del Senado en la
legislatura XLIX (15 de febrero de 2020 a 14 de febrero de 2025) o en la L (desde el 15 de febrero de
2025): los 30 senadores electos de cada una más quien preside (la Vicepresidencia de la República),
y quienes asumieron la banca titular por renuncia, fallecimiento o pasaje de un titular al Poder
Ejecutivo (el primer suplente que queda como titular por el resto del período). Con:

- `nombre` completo como figura en el Parlamento, `nombre_corto` como la nombra la prensa, `partido`
  (nombre canónico: Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto, Partido
  Independiente, Identidad Soberana, Partido de la Gente), `alias` (apellido solo tal como figura en
  «ASISTEN:» del diario del Senado, nombre y apellido, variantes; si el apellido solo es ambiguo con
  otro senador del período, va en `alias_ambiguos` con la nota).
- `mandatos[]`: un mandato por legislatura, `cargo: "Senador"` (o `"Senadora"` no: el cargo va en
  masculino genérico, `Senador`), `desde` y `hasta` exactos, con la fuente oficial. Quien preside lleva
  `cargo: "Vicepresidente de la República"`. Si dejó la banca antes (pasó a un ministerio, a una
  intendencia, renunció, falleció) `hasta` con la fecha y el diario de sesiones que lo registra.
- `estado_actual` según el esquema.

## Método (el mismo que la adenda del brief de diputados, que vale acá palabra por palabra)

1. **Censo primero, por documento oficial.** La integración actual del Senado la publica
   `parlamento.gub.uy` (buscá la nómina con `pnpm fuente` sobre
   `https://parlamento.gub.uy/sobreelparlamento/busquedalegisladores/lista?Cpo_Codigo=S&Quienes=T&Plm_codigo=All&Ptm_codigo=All&Fecha%5Bdate%5D=&Fecha%5Btime%5D=&Ppsn_apenombre=&combine=`
   y con `pnpm inventario parlamento.gub.uy --filtro -i senad`); para la XLIX, la captura de Wayback de
   esa nómina o el diario de la sesión preparatoria del 15 de febrero de 2020
   (`https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-02-15 - DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0001).pdf`)
   con la proclamación. Quien figura ahí es titular; quien no, solo lo es si un diario o su página
   oficial lo dice con el cargo.
2. **Sin la línea que nombra el cargo, no hay mandato.** En `/camarasycomisiones/legisladores/<id>/legislaturas-actuo`
   una fila solo prueba un cargo cuando antepone «Senador por el Lema PARTIDO - Legislatura N» (o
   la línea equivalente). Una fila pelada con dos fechas puede ser una suplencia de días: no se
   carga como mandato de titular. Ninguna fecha se llena por defecto.
3. **Un tramo de diputado no es un mandato de senador** y al revés: cada tramo con su cargo.
4. **`salida.tipo: fin_de_mandato` solo al 14/02/2025.** Renuncias y pasajes al Ejecutivo con su
   tipo y la fuente que lo dice. `situacion: en_cargo` solo con un mandato abierto y su fuente.
5. **Ids**: `_slug: apellido-nombre` con la grafía oficial. Las personas que ya tienen ficha en
   `content/politicos/` (Argimón, Cosse, Penadés, Manini Ríos, Topolansky, Astori, Bordaberry,
   Mieres, Sendic, Delgado, Orsi, Lacalle Pou…) no se vuelven a crear: se anota en `notas.md` qué
   mandato les falta y entra por corrección.
6. `.cache/votaciones/senadores-asistencia.txt` (copiado al lote como `asistencia.md`) es el índice de
   apellidos que aparecen en «ASISTEN:» de los diarios 2020-2026 con su cantidad de sesiones: sirve
   para no olvidar a nadie y para el `alias`, no se cita como fuente.

## Regla 0

Los titulares de las dos legislaturas, de todos los partidos, con la misma ficha. Nada de adjetivos,
nada de «conocido por»; solo identidad, partido, mandatos con fuente. Lo que no se pueda documentar
se anota en `notas.md`, no se inventa. El mismo documento que se le exige a un senador se le exige a
los demás.

## Lotes

- `inbox/senadores/a-l/`: apellidos de la A a la L, las dos legislaturas.
- `inbox/senadores/m-z/`: apellidos de la M a la Z, las dos legislaturas.
