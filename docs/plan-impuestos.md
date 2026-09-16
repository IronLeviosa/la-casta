# Plan: página de impuestos (2026-09-16)

Decidido por la sesión Fable con el alcance que confirmó el mantenedor; lo ejecuta la sesión Opus en el
árbol de corridas y Fable revisa el resultado. Las decisiones de este plan no se reabren en la
implementación: si algo no cierra, se reporta y se decide, no se improvisa.

## Qué pidió el mantenedor (alcance confirmado)

Una página por impuesto y una general con: qué es cada tributo, la historia de sus modificaciones (cuándo,
**quién lo impulsó** —en general el partido o gobierno que empujó el proyecto—, **por qué dijeron que lo
hacían** —hay que investigar lo que explicaron sus referentes—, **a quién alcanza** y, en cada cambio, el
alcance nuevo contra el anterior: si se recauda más, menos o lo mismo pero de otras personas), el ranking
por recaudación y el porcentaje del PIB por año. Empezar por los tributos que cubren el 95 % de lo
recaudado, contribuciones al BPS incluidas. Su frase: «que no pase por debajo del radar de la gente».

Regla 0 aplicada: el mismo esquema y la misma búsqueda de justificaciones para cada gobierno y cada
partido; `efecto_recaudacion` sale de una fuente que lo estimó, nunca del sitio; el alcance se escribe con
la norma, no con adjetivos.

## Fuentes, ya verificadas y en el corpus

| Qué | Dónde | Verificado |
|---|---|---|
| Recaudación anual por impuesto, DGI, 1982-2025 | `https://www.gub.uy/direccion-general-impositiva/sites/direccion-general-impositiva/files/2026-02/Recaudaci%C3%B3n%20por%20impuesto%20-%20Series%20anuales.csv` | nota `8a347746…` del corpus; 21.604 caracteres; 40 columnas separadas por `;` (Año, «SELECCIONE IMPUESTO» vacía, 37 impuestos, «RECAUDACIÓN TOTAL DE LA DGI»); Windows-1252 (`pnpm fuente` lo decodifica solo); fila 2 = «Inicio serie» por columna; fila 3 = «Notas» por columna; valores en **pesos uruguayos, unidades**, con puntos de miles (`85.911.275.097`), negativos posibles (devoluciones), celda vacía = sin dato (no es cero). |
| PIB a precios corrientes, 1982-2025 | `https://api.worldbank.org/v2/country/URY/indicator/NY.GDP.MKTP.CN?date=1982%3A2025&format=json&per_page=80` (URL canónica que guarda el corpus) | nota `054b0157…`; `lastupdated: 2026-07-13`; `pnpm fuente` lo vuelve JSON con sangría de un espacio, un valor por renglón; medio `banco-mundial` ya existe. El Banco Mundial toma la serie del BCU. |
| Página de Cuentas Nacionales del BCU | `https://www.bcu.gub.uy/Estadisticas-e-Indicadores/Paginas/Cuentas-Nacionales-e-Internacionales.aspx` | arma los enlaces a las planillas por JavaScript: no hay URL estable de una planilla anual larga. Cuando aparezca, la serie del PIB se cambia por corrección; mientras tanto la página dice de dónde sale. |
| Recaudación del BPS | sin planilla estable encontrada (el sitio publica PDF: boletín estadístico, material de ATyR) | entra por corrida de investigador, fila por fila del PDF, no por script. |

Chequeos de coherencia hechos: DGI/PIB = 13,1 % en 1990 y 19,9 % en 2024 (la DGI publica que recauda más
del 80 % de los recursos del Estado; la presión total del país ronda 27 %). Las dos series están en la
misma unidad (pesos uruguayos; los años anteriores a 1993 ya vienen convertidos).

Trece columnas del CSV llevan en la fila «Notas» el texto «Derogado por el Art. 1 de la 18.083 del
27-12-2006 …»: es fuente citable de la derogación (reforma tributaria de 2007). La columna IVA anota que
desde 2008 incluye el IVA mínimo; la de pequeña empresa, que hasta julio de 2007 era IRIC lit. E.

Medio `dgi` sembrado en `content/medios/dgi.yaml` (semilla; dominios `gub.uy/direccion-general-impositiva/`
y `dgi.gub.uy`). El medio `bps` lo documenta el lote que lo cite (`docs/colecciones/medios.md`).

## Colecciones

### `impuestos` — una ficha por tributo

Esquema **ya escrito** en `src/schemas/impuesto.ts` (contrato de campos; no se cambia sin decidirlo):
`nombre`, `sigla`, `tipo` (consumo | renta | patrimonio | seguridad_social | comercio_exterior | otro),
`recaudador` (dgi | bps | aduana | otro), `vigente`, `creacion` y `derogacion` ({fecha, norma, ley?,
fuentes}), `que_grava` + `que_grava_fuentes`, `alcance` ({quien_paga, quien_no?, fuentes}), `hitos[]`
({fecha, titulo, detalle?, tipo (creacion | tasa_sube | tasa_baja | alcance_amplia | alcance_reduce |
reforma | derogacion | otro), norma?, ley?, votacion?, impulsado_por {quien, politico?, fuentes}?,
alcance_antes?, alcance_despues?, efecto_recaudacion (mas | menos | igual_otras_personas | sin_dato)?,
justificaciones[] {quien, politico?, cita, fuentes}, fuentes}), `recaudacion[]` ({anio, pesos,
componente?, fuentes}), `resumen`, `fuentes`, `imagenes`, `revision`, `procedencia`. Reglas del
esquema: `que_grava` exige fuentes; `vigente: false` exige `derogacion`; una ficha sin `recaudacion`,
`hitos` ni `que_grava` no valida; `(anio, componente)` único.

### `series` — series oficiales que el sitio usa como denominador

Esquema **ya escrito** en `src/schemas/serie.ts`: `nombre`, `unidad`, `organismo`, `frecuencia`,
`descripcion?`, `puntos[]` ({periodo AAAA | AAAA-MM, valor, fuentes}), `fuentes`, `revision`,
`procedencia`. Primer registro: `content/series/pib-corriente.yaml`. Sin página propia.

### Registro de las dos colecciones (todos los lugares, ninguno se salta)

`src/schemas/base.ts` (`NOMBRES_COLECCIONES`), `src/schemas/comunes.ts` (import, `crearEsquemas`,
`COLECCIONES`: `impuestos` carpeta `content/impuestos`, `patronId` SLUG, ejemplo `iva`, `referencia:
false`; `series` carpeta `content/series`, SLUG, ejemplo `pib-corriente`, `referencia: false`),
`src/content.config.ts`, `src/lib/permalinks.ts` (`impuestos` → `/impuestos/<id>/`; `series` no
enlaza), `src/lib/tipos.ts`, `scripts/lib/inbox.ts` (carpetas; `AGENTE_POR_COLECCION` investigador para
las dos; `derivarId`: `impuestos` = `_slug` o slug de `sigla ?? nombre`, `series` = `_slug`),
`scripts/lib/presentacion.ts` (`impuestos`: `resumen` como resumen; `que_grava`, `alcance.quien_paga`,
`alcance.quien_no`, `hitos[].detalle`, `hitos[].alcance_antes`, `hitos[].alcance_despues` como texto para
el lector; `hitos[].detalle` además como una oración), `scripts/lote.ts` (`resumenImpuesto`: años cargados
por componente con huecos, cantidad de hitos, si tiene `que_grava` y `alcance`), `scripts/revisar-paginas.ts`
(`impuestos/<slug>` e `impuestos` exigen un `<svg>`; ficha sin `.lt` = aviso), `src/layouts/Base.astro`
(«Impuestos» después de «Empresas públicas»). `scripts/exportar.ts` no cambia: itera `COLECCIONES`.

## Script `pnpm impuestos:extraer`

`scripts/impuestos-extraer.ts`, calcado de `scripts/finanzas-extraer.ts` (mismos imports, `obtenerNota`
con `{ sinHaiku: true, sinArchivo: true }`, salida al inbox, `notas.md`). CLI:
`pnpm impuestos:extraer [--fecha AAAA-MM-DD] [--desde AAAA] [--hasta AAAA] [--sin-pib]`.

1. Las URL salen de `docs/fuentes-oficiales/series.yaml`, dos entradas nuevas con todos los campos
   requeridos (`id, organismo, nombre, unidad, frecuencia, url, tipo, como_leer, desde, ejemplo,
   verificado`): `dgi-recaudacion-anual` (`tipo: csv`, `separador: ;`, `columna_periodo: 0`, `columna: 39`
   para el total, `medio: dgi`; en `como_leer` decir que la fila 2 es «Inicio serie», la 3 «Notas», y que
   las celdas vacías no son ceros) y `banco-mundial-pib-corriente` (`tipo: api_json`, `medio:
   banco-mundial`, `como_leer` con el par `"date"`/`"value"`). Ningún `FormatoPeriodo` de `scripts/dato.ts`
   describe «el año solo, en una columna»: agregar `anio_columna` (columna de período = AAAA) con su caso
   en `tests/dato.test.ts`, para que `pnpm dato dgi-recaudacion-anual --anio 2024` devuelva la fila y la
   cita como con cualquier otra serie. `pnpm dato` tiene que seguir pasando sus tests.
2. Parseo del **texto que guardó el corpus** (`nota.texto`), nunca del archivo bajado aparte: es contra ese
   texto que `validar --red` coteja. Puntos de miles fuera, signo respetado, celda vacía = sin fila.
3. Mapa de columnas → fichas, en el script (columna sin mapa → `notas.md` bajo `## columnas_sin_ficha`,
   nunca una ficha inventada). Una ficha por tributo; cuando la planilla desagrega, un `componente` por
   columna:

   | slug | columnas del CSV (encabezado tal cual) | tipo | vigente |
   |---|---|---|---|
   | `irae` | IMPUESTO A LAS RENTAS DE LAS ACTIVIDADES ECONÓMICAS - IRAE | renta | sí |
   | `imeba` | … IMEBA; … Adicional MEVIR; … Adicional INIA (componentes) | renta | sí |
   | `irpf` | … CATEGORÍA I - IRPF Cat I; … CATEGORÍA II - IRPF Cat II (componentes) | renta | sí |
   | `irnr` | IMPUESTO A LAS RENTAS DE LOS NO RESIDENTES - IRNR | renta | sí |
   | `iass` | IMPUESTO DE ASISTENCIA A LA SEGURIDAD SOCIAL - IASS | renta | sí |
   | `isafi` | IMPUESTO A LAS SOCIEDAES FINANCIERAS DE INVERSIÓN - ISAFI (sic, así viene) | renta | no |
   | `patrimonio` | IMPUESTO AL PATRIMONIO PERSONAS JURÍDICAS; … EXPLOTACIONES AGROPECUARIAS; SOBRETASA …; … PERSONAS FÍSICAS (componentes) | patrimonio | sí |
   | `icosa` | IMPUESTO DE CONTROL DE SOCIEDADES ANÓNIMAS - ICOSA | patrimonio | sí |
   | `itp` | IMPUESTO A LAS TRASMISIONES PATRIMONIALES - ITP; … - Adicional (componentes) | patrimonio | sí |
   | `iva` | IMPUESTO AL VALOR AGREGADO - IVA; IMPUESTO A LA PEQUEÑA EMPRESA (IVA Mínimo) (componentes) | consumo | sí |
   | `imesi` | IMPUESTO ESPECÍFICO INTERNO - IMESI | consumo | sí |
   | `seguros` | IMPUESTO A LOS INGRESOS DE LAS COMPAÑÍAS DE SEGUROS | consumo | sí |
   | `fis` | IMPUESTO PARA EL FONDO DE INSPECCIÓN SANITARIA - FIS | consumo | sí |
   | `iric` | IMPUESTO A LAS RENTAS DE INDUSTRIA  COMERCIO - IRIC | renta | no |
   | `cofis` | IMPUESTO DE CONTRIBUCION AL FINANCIAMIENTO DE LA SEGURIDAD SOCIAL - COFIS | consumo | no |
   | `imessa` | IMPUESTO ESPECÍFICO A LOS SERVICIOS DE SALUD - IMESSA | consumo | no |
   | `comisiones` | IMPUESTO A LAS COMISIONES | renta | no |
   | `ventas-forzadas` | IMPUESTO A LAS VENTAS FORZADAS | consumo | no |
   | `tarjetas-de-credito` | IMPUESTO A LAS TARJETAS DE CREDITO | consumo | no |
   | `itel` | IMPUESTO A LAS TELECOMUNICACIONES - ITEL | consumo | no |
   | `sorteos` | IMPUESTO A LOS INGRESOS DE LOS ORGANIZADORES DE SORTEOS | renta | no |
   | `icome` | IMPUESTO A LA COMPRA DE MONEDA EXTRANJERA - ICOME | consumo | no |
   | `remate` | IMPUESTO A LA COMPRA-VENTA DE BIENES EN REMATE PÚBLICO | consumo | no |
   | `cesiones-deportistas` | IMPUESTO A LAS CESIONES DE DERECHOS SOBRE DEPORTISTAS | renta | no |
   | `imaba` | IMPUESTO A LOS ACTIVOS DE LAS EMPRESAS BANCARIAS - IMABA | patrimonio | no |
   | `icosifi` | IMPUESTO DE CONTROL DEL SISTEMA FINANCIERO - ICOSIFI | patrimonio | no |
   | `ira` | IMPUESTO A LAS RENTAS AGROPECUARIAS - IRA | renta | no |
   | `imagro` | IMPUESTO A LAS ACTIVIDADES AGROPECUARIAS - IMAGRO | renta | no |
   | `ensenanza-primaria` | IMPUESTO DE ENSEÑANZA PRIMARIA | patrimonio | sí |

   `vigente: no` **solo** para las columnas cuya celda de «Notas» dice «Derogado por el Art. 1 de la
   18.083»: el script lo lee de la planilla, no de esta tabla; si una columna que la tabla da por derogada
   no trae la nota, queda `vigente: true` y se anota en `notas.md`. `derogacion` = `{fecha: 2006-12-27,
   norma: 'Ley 18.083, art. 1', fuentes: [la celda de Notas como cita]}`. `nombre` = el encabezado en
   mayúsculas y minúsculas normales (sin la sigla), `sigla` = lo que sigue al guion cuando lo hay.
   `creacion`, `que_grava`, `alcance` e `hitos` no salen del CSV: los deja vacíos para la corrida de historia.
4. `recaudacion[]`: un ítem por año y componente con `pesos` entero y `fuentes[0]` = `{url: nota.url_canonica,
   medio: dgi, fecha: 2026-02-01 (la carga del archivo según su ruta; decirlo en como_leer), tipo:
   documento_oficial, titulo: 'Recaudación por impuesto - Series anuales', cita: <la fila entera del
   año, tal como está en el texto>, retrieved_at}`. La fila entera es lo que cita `pnpm dato` y lo que un
   lector puede encontrar con buscar en la planilla; una celda suelta no identifica el año.
5. `series`: `pib-corriente` con un punto por año; `cita` = el tramo `"date": "AAAA",` … `"value": N` tal
   como aparece en `nota.texto` (dos renglones contiguos; el validador normaliza espacios); el script
   verifica la contención antes de escribir. `organismo: 'Banco Mundial, a partir de las cuentas
   nacionales del BCU'`, `unidad: 'pesos uruguayos corrientes'`, `fecha` de la fuente = `lastupdated`.
6. Salida: `inbox/impuestos/dgi/<fecha>-serie/` con `impuestos.yaml` (una lista, cada registro con
   `_slug` y `_investigacion: {script: 'impuestos-extraer.ts', insumos: ['docs/fuentes-oficiales/series.yaml']}`),
   `series.yaml`, `notas.md` (`## cobertura_del_periodo` por columna: inicio de serie declarado, años con
   dato, huecos; `## columnas_sin_ficha`; `## derogaciones_leidas`). La corrida la crea el script con
   `escribirCorridaDeScript` (sufijo `impuestos-dgi-serie`; brief generado: qué bajó, sha de cada nota,
   mapa aplicado; `motivoSinCritica`: copia de planilla oficial sin criterio editorial) e imprime el
   comando de promover. Antes de promover: `pnpm validar --inbox <dir>` y `pnpm validar --inbox <dir> --red`.
7. Tests `tests/impuestos-extraer.test.ts` sobre helpers puros (sin red ni modelo) con fixtures recortadas
   (`tests/fixtures/impuestos-dgi-anual.csv`: encabezado, Inicio serie, Notas con una derogación, 3 años,
   6 columnas incluida una negativa y una vacía; `tests/fixtures/impuestos-bm-pib.json`: 3 años): parseo
   de números, celdas vacías, mapa, citas contenidas literalmente en el texto, derogación leída de Notas,
   punto del PIB con su cita. Y `tests/impuesto-schema.test.ts` con las cuatro reglas del esquema.
   `tests/instrucciones-comandos.test.ts` exige que `pnpm impuestos:extraer` exista en `package.json`
   si alguna instrucción lo nombra.

## Cómo entra la historia a una ficha que ya publicó el script

`pnpm promover` nunca sobreescribe y una corrección reemplaza el registro entero. Para agregar
`hitos`, `que_grava`, `alcance` y `creacion` a una ficha publicada sin copiar a mano sus 44 filas de
recaudación (y para los deltas de `finanzas:extraer`, que hoy vuelca el editor a mano):

- Nuevo subcomando `pnpm lote ampliar <coleccion>/<slug> --inbox <dir> [--fecha] [--simulacion]`: toma el
  registro publicado y el delta del inbox con el mismo `_slug`, y escribe en `inbox/correcciones/<fecha>/`
  la corrección lista para `pnpm promover --correccion`. Regla de fusión: un campo escalar del delta solo
  entra si el publicado no lo tiene (pisar uno publicado es `error_factual` y va por otra corrección);
  las listas se concatenan sin duplicar (`hitos` por `fecha+titulo`, `recaudacion` por `anio+componente`,
  `fuentes` por `url`). Nuevo tipo de corrección `ampliacion` en `src/schemas/correccion.ts` y en
  `docs/colecciones/correcciones.md`: «el registro se completa con campos que no tenía; nada de lo que el
  lector vio cambia». `motivo` generado: qué campos entran y de qué corrida. Test con una ficha y un delta.
- `pnpm validar --inbox` valida el delta tomando la cabecera de la ficha publicada, como hace con
  `empresas` (`scripts/lib/inbox.ts`, bloque «Un script de extracción…»): extender ese bloque a `impuestos`
  (`nombre`, `tipo`, `recaudador`).

## Páginas

`src/pages/impuestos/index.astro`:
1. Tres oraciones de entrada: qué cubre (los impuestos que administra la DGI, 1982-2025, según su
   planilla anual), de dónde sale el PIB, y que las contribuciones a la seguridad social (BPS) y los
   tributos aduaneros no están cargados todavía, con enlace a `/cobertura/` (un hueco no es un cero).
2. Ranking del último año con datos: tabla `tributo | millones de pesos | % del PIB | % del total DGI`,
   vigentes ordenados por recaudación; los derogados en una tabla plegada con su último año y su norma.
   El nombre enlaza a la ficha (punto 15: un contador enlaza a lo que cuenta).
3. `GraficoInteractivo` de líneas: **% del PIB por tributo**, las ocho mayores del último año prendidas,
   el resto apagadas en el grupo «Otros tributos», más «Total DGI»; `cobertura` dice el rango y que el BPS
   falta. Es el visual que exige `revisar:paginas`.
4. Nada plegado que sea visual (punto 20).

`src/pages/impuestos/[slug].astro`:
1. Cabecera: nombre, sigla, tipo, recaudador, vigente o derogado con norma y fecha, creación si consta.
2. `que_grava` y `alcance` (quién paga, quién no). Si faltan: una línea «La historia y el alcance de este
   tributo todavía no fueron investigados» con enlace a `/cobertura/`.
3. `LineaTiempo` de `hitos[]` (color por `tipo`, tabla fija en `src/lib/hitos-impuesto.ts`: creacion 8,
   tasa_sube 2, tasa_baja 3, alcance_amplia 4, alcance_reduce 10, reforma 1, derogacion 5, otro 8); cada
   tarjeta: título, `impulsado_por.quien` (con enlace a la ficha del político si hay), `efecto_recaudacion`,
   alcance antes → después; debajo de la línea, por hito, las `justificaciones` con `Cita.astro` (más de
   dos, plegadas) y el enlace a la votación si `votacion` consta.
4. `GraficoInteractivo`: «% del PIB» (línea, prendida) y «pesos corrientes» (barras, apagada), una serie
   por componente cuando los hay; tabla de valores plegada; `cobertura` con el inicio de serie que
   declara la DGI.
5. `resumen` del editor, fuentes, `Historial`, `Procedencia`, `CompartirBar`, `TierBanner`.

Ayudas visuales: puntos 13, 15, 17, 19, 20 y 21 de `docs/revision-visual.md`. Legible en el celular.

## Documentación e instrucciones

- `docs/colecciones/impuestos.md` con el formato de `empresas.md` (intro y tres reglas; Campos;
  Investigación; Edición; Crítica). Reglas de fondo: (a) las cifras las escribe el script, el
  investigador no copia celdas; (b) cada hito lleva la norma (IMPO o Texto Ordenado), quién lo impulsó tal
  como consta en el mensaje del Poder Ejecutivo o el proyecto (partido y gobierno), la votación por
  `pnpm sesion` cuando fue nominal, y las justificaciones en palabras de los referentes que lo impulsaron
  (diario de sesiones, exposición de motivos, conferencia oficial), con la misma búsqueda para cada
  gobierno; (c) `alcance_antes` y `alcance_despues` con la norma, franjas y mínimos incluidos, y
  `efecto_recaudacion` solo si una fuente lo estimó (DGI, MEF, CINVE, Parlamento), con quién lo estimó;
  (d) un cambio sin justificación pública encontrada se registra igual con `justificaciones: []` y la
  búsqueda en `consultas.jsonl`; (e) Regla 0: no se investiga «los impuestos que subió X»; se investiga
  el tributo entero, todos sus cambios, quien sea que los haya hecho.
- `docs/colecciones/series.md` (corto: qué es, que lo escribe un script, que cada punto cita su renglón).
- `docs/ejemplos/impuesto.yaml` y `docs/ejemplos/serie.yaml` con el formato de `docs/ejemplos/empresa.yaml`.
- `CLAUDE.md`: fila de `Impuestos` y de `Series` en la tabla de colecciones; fila de
  `pnpm impuestos:extraer` y de `pnpm lote ampliar` en la de comandos. `docs/colecciones/README.md`.
- Sin modo nuevo en `pnpm brief`: la corrida de historia de un tributo lleva brief escrito a mano como las
  de empresas (`data/corridas/<fecha>-impuestos-<slug>-historia/brief.md`, secciones Encargo, Reglas duras,
  Salida esperada), y `escribirInstruccionesCongeladas` igual que siempre.

## Corridas, en este orden

1. **Serie**: `pnpm impuestos:extraer` → `validar --inbox` y `--red` → `promover` → `build` → commit
   `[corrida <id>]`. Sin crítico ni editor (copia de planilla oficial). Fable revisa `/impuestos/` y dos
   fichas antes del siguiente paso.
2. **Piloto de historia (regla 15)**: IVA, la mayor recaudación. Un investigador (Sonnet) con brief a mano:
   cambios de tasa y alcance desde su creación (1972, Ley 14.100) hasta hoy, por Texto Ordenado e IMPO;
   por cada cambio, quién lo mandó (mensaje del Poder Ejecutivo: gobierno y partido), votación (`pnpm
   sesion` para las nominales), justificaciones de los referentes (diario de sesiones de la discusión
   general; conferencias en Presidencia), alcance antes y después, efecto estimado si alguien lo estimó.
   Crítico y editor como siempre; el editor escribe `resumen`. Entra a la ficha con `pnpm lote ampliar`.
3. Después del piloto corregido: IRPF, IRAE, IMESI, IASS, Patrimonio (en ese orden, por recaudación), y
   una corrida de investigador para `bps-contribuciones` (boletín estadístico del BPS: recaudación anual
   citada fila por fila, más la historia de las tasas de aportes), que crea el medio `bps` en el lote.

## Qué no hacer

- No leer el CSV bajado aparte ni el xlsx: solo `nota.texto` del corpus.
- No inventar `creacion` desde «Inicio serie»: el inicio de la serie no es la creación del impuesto.
- No calcular ni publicar `efecto_recaudacion` desde las propias series: es de quien lo estimó.
- No escribir en `content/` a mano: script → inbox → validar → promover, y la historia por `ampliar`.
- No abrir un modo de `pnpm brief` ni tocar `brief.ts` para esto.
