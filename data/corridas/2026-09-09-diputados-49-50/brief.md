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
