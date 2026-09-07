# Brief de investigación · corrida 2026-09-07-lacalle-pou-veracimetro

Regla 0: objetividad por encima de todo. Esta corrida existe por simetría: la crítica de la corrida 2026-09-06-lacalle-pou-economia-combustibles revisó todas las declaraciones publicadas con un dato numérico dentro de la cita o del resumen y encontró seis sin chequear: dos de Lacalle Pou y cuatro de Orsi. El mismo criterio ("si hay un dato concreto dentro de una cita publicada, se chequea") se pasa por las seis en la misma tanda; este brief cubre las dos de Lacalle Pou y su gemelo (2026-09-07-orsi-veracimetro) las cuatro de Orsi. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `lacalle-pou` · Luis Lacalle Pou · Partido Nacional
- Presidente de la República 2020-03-01 → 2025-03-01.
- alias: Lacalle Pou, Luis Lacalle Pou, Lacalle (ojo con su padre, Lacalle Herrera: desambiguar por apellido o fecha)

## 2. Encargo (solo esto; no investigues otras declaraciones)

Dos declaraciones publicadas. Leé cada una con `Read` antes de empezar; el dato a chequear está dentro de su `cita` o su `resumen`:

| registro (content/declaraciones/lacalle-pou/…) | tema | dato dentro de la cita o el resumen |
|---|---|---|
| `2021-07-28-tercamente-no-vamos-poner-impuestos.yaml` | economia/impuestos | "ahorró más de US$ 600 millones durante la pandemia" (el ahorro del Estado en 2020-2021) |
| `2023-03-02-baja-impuestos-irpf-iass.yaml` | economia/impuestos | "75 %" y "US$ 150" (alcance y monto de la rebaja de IRPF e IASS anunciada en marzo de 2023) |

Por cada dato concreto, un registro en `chequeos.yaml` (formato en tus instrucciones) con `declaracion: lacalle-pou/<id>`, `fragmento` copiado tal cual de la cita o del resumen, `afirmacion` (el dato en una frase completa: qué, cuánto, cuándo), `dato_real` con la fuente oficial y `evidencia` (las fuentes de la declaración sirven). Vos no calificás.

**Precedencia de la primaria.** Estas declaraciones están hoy en nivel `reportado` (prensa) y las dos salen de actos con registro oficial: la del 28 de julio de 2021 de una conferencia o entrevista en ejercicio, la del 2 de marzo de 2023 de la rendición de cuentas ante la Asamblea General (discurso publicado por Presidencia y por el Parlamento). Antes de chequear, buscá el registro primario como manda tu punto 4: `archivo.presidencia.gub.uy` y `medios.presidencia.gub.uy` (mandato terminado), `www.gub.uy/presidencia/comunicacion/noticias/`, el diario de sesiones del Parlamento, el canal de YouTube de Presidencia. Si la encontrás, la `afirmacion` se escribe contra lo que la primaria dice (con sus reservas: un "creo que" es parte de lo dicho), y entregás además en `declaraciones.yaml` una copia del registro con el mismo `_slug` (el que está después de la fecha en el nombre del archivo), la primaria como primera fuente (`tipo: video` con `marca_tiempo`, `contexto`, `pregunta`, `url_nota`, `literalidad: literal`, o `documento_oficial` / `diario_de_sesiones`), y las notas existentes con `verificada_en: {url, marca_tiempo}`. Si la primaria dice algo distinto del `resumen`, no reescribas el resumen: anotalo en `notas.md` bajo `## resumen_vs_primaria` para que el editor lo ajuste junto con el `fragmento`. Si no la encontrás, decilo URL por URL en `## registro_primario`.

Dónde buscar el dato oficial:
- Ahorro de US$ 600 millones: Rendición de Cuentas 2020 y 2021 (MEF, `mef.gub.uy`; Parlamento), informes de ejecución presupuestal de la Contaduría General de la Nación (`cgn.gub.uy`), lo que Presidencia o el MEF hayan publicado sobre "ahorro" del Estado en la pandemia; registrá exactamente qué mide la cifra oficial (ahorro en qué rubros, sobre qué base, en qué período).
- Rebaja de IRPF e IASS: el proyecto y la ley (`impo.com.uy`, `parlamento.gub.uy`), la exposición de motivos del MEF con el costo fiscal y la cantidad de contribuyentes alcanzados, informes de DGI (`dgi.gub.uy`) sobre contribuyentes de IRPF/IASS; "75 %" y "US$ 150" tienen que compararse con lo que esos documentos dicen (porcentaje de qué universo, monto de qué).
- Si un verificador o un medio chequeó estas cifras (Verificado.uy, UYCheck, El Observador, la diaria, Búsqueda, El País, Montevideo Portal), leelo con `pnpm fuente` y ponelo en `evidencia.fuentes`: es prensa, no reemplaza al documento oficial.

## 3. Medios
La tabla de `content/medios/` es la de siempre; verificá con `ls content/medios/` antes de anotar un medio como faltante (el lote 2026-09-06 pudo haber creado `bcu`, `catalogodatos-gub-uy`, `ced`, `anp-brasil`, `bcb-brasil`). Organismos que no estén (MEF, DGI, CGN, Parlamento ya existe) se anotan en `medios_faltantes` con propiedad (Estado uruguayo: `grupo: estado-uruguayo`, `alineamiento: estatal`).

## 4. Reglas duras
1. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Leé barato (`--buscar`, `--desde`, `--indice`).
2. `cita` es copia literal y contigua de lo que devolvió `pnpm fuente`.
3. Preferí documento oficial, diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
4. No escribas tier, procedencia, id, `titulo`, `calificacion` ni `analisis`.
5. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
6. Pistas cruzadas sobre otros políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<otro>.yaml`.
7. No investigues casos judiciales; una línea en `casos_vistos` si aparecen.
8. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.

## 5. Salida esperada
Carpeta `inbox/lacalle-pou/veracimetro/2026-09-07/` con `chequeos.yaml`, `declaraciones.yaml` (solo las copias con primaria encontrada; si no, lista vacía), `promesas.yaml` y `menciones.yaml` vacías, `consultas.jsonl` y `notas.md` con las secciones de siempre más `## registro_primario` y `## resumen_vs_primaria`. Informe final: cuántos chequeos, cuántos con dato oficial y cuántos con `_faltante: dato_oficial`, qué primarias encontraste, el modelo con el que corriste, y objeciones al brief si las hubo.
