# Brief de investigación · corrida 2026-09-07-orsi-veracimetro

Regla 0: objetividad por encima de todo. Esta corrida existe por simetría: el Veracímetro tenía un solo chequeo, de Lacalle Pou, y la corrida 2026-09-06-lacalle-pou-economia-combustibles le agrega dos más. La crítica de esa corrida revisó todas las declaraciones publicadas con un dato numérico dentro de la cita o del resumen y encontró seis sin chequear: dos de Lacalle Pou y cuatro de Orsi. El mismo criterio ("si hay un dato concreto dentro de una cita publicada, se chequea") se pasa por las seis en la misma tanda; este brief cubre las cuatro de Orsi y su gemelo (2026-09-07-lacalle-pou-veracimetro) las dos de Lacalle Pou. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `orsi` · Yamandú Orsi · Frente Amplio
- Presidente de la República desde 2025-03-01. Antes intendente de Canelones y candidato (campaña 2024).
- alias: Orsi, Yamandú Orsi, Yamandú

## 2. Encargo (solo esto; no investigues otras declaraciones)

Cuatro declaraciones publicadas. Leé cada una con `Read` antes de empezar; el dato a chequear está dentro de su `cita` o su `resumen`:

| registro (content/declaraciones/orsi/…) | tema | dato dentro de la cita o el resumen |
|---|---|---|
| `2025-04-25-orsi-informo-ancap-volvio-tener-resultados.yaml` | economia/combustibles | resultados de ANCAP: cifras de 41, 118 y 160 millones y "deuda total de 255 millones de dólares" |
| `2024-11-18-orsi-sostuvo-recargo-iva-2-aplicado.yaml` | economia/impuestos | el recargo de 2 % de IVA aplicado por el gobierno anterior |
| `2026-05-26-consultado-prensa-sobre-descuento-usd-25.yaml` | transparencia-corrupcion | el descuento de USD 25.000 en la compra de su camioneta |
| `2026-08-25-respaldo-publicamente-ministra-defensa-nacional-sandra.yaml` | (el tema del registro) | "100 %": decidí vos si es un dato concreto o una figura retórica; si es retórica, no hay chequeo y lo decís en `notas.md` con el motivo |

Por cada dato concreto, un registro en `chequeos.yaml` (formato en tus instrucciones) con `declaracion: orsi/<id>`, `fragmento` copiado tal cual de la cita o del resumen, `afirmacion` (el dato en una frase completa: qué, cuánto, cuándo), `dato_real` con la fuente oficial y `evidencia` (las fuentes de la declaración sirven). Vos no calificás.

**Precedencia de la primaria.** Estas declaraciones están hoy en nivel `reportado` (prensa). Antes de chequear, buscá el registro primario de cada una como manda tu punto 4: para un presidente en ejercicio, `www.gub.uy/presidencia/comunicacion/noticias/` (gacetillas con audio o transcripción), `medios.presidencia.gub.uy`, el canal de YouTube de Presidencia; para la campaña de 2024, el video del debate o la entrevista. Si la encontrás, la `afirmacion` se escribe contra lo que la primaria dice (con sus reservas: un "creo que" es parte de lo dicho), y entregás además en `declaraciones.yaml` una copia del registro con el mismo `_slug` (el que está después de la fecha en el nombre del archivo), la primaria como primera fuente (`tipo: video` con `marca_tiempo`, `contexto`, `pregunta`, `url_nota`, `literalidad: literal`, o `documento_oficial`), y las notas existentes con `verificada_en: {url, marca_tiempo}`. Si la primaria dice algo distinto del `resumen`, no reescribas el resumen: anotalo en `notas.md` bajo `## resumen_vs_primaria` para que el editor lo ajuste junto con el `fragmento`. Si no la encontrás, decilo URL por URL en `## registro_primario`.

Dónde buscar el dato oficial:
- ANCAP: estados contables auditados y memoria anual (`ancap.com.uy`, sección institucional/transparencia), Auditoría Interna de la Nación (`ain.gub.uy`), `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=ancap`), Rendición de Cuentas y versiones taquigráficas del Parlamento donde ANCAP presentó resultados.
- IVA 2 %: el decreto o la ley del gobierno anterior que estableció el recargo (o la rebaja de 2 puntos en pagos con tarjeta y su fin), en `impo.com.uy`; DGI (`dgi.gub.uy`); MEF.
- Camioneta: lo que consta en documentos públicos (declaración jurada ante JUTEP si es pública, factura publicada por Presidencia, resolución de la Corte Electoral o de la JUTEP), y el precio de lista del modelo en la fecha si el importador lo publicó. Es un caso con denuncias en curso: registrás solo lo que está en fuentes públicas, con estado y fecha, y no investigás el caso judicial (tus instrucciones lo prohíben; si aparece, una línea en `casos_vistos`).
- Si un verificador o un medio chequeó estas cifras (Verificado.uy, UYCheck, El Observador, la diaria, Búsqueda, El País, Montevideo Portal), leelo con `pnpm fuente` y ponelo en `evidencia.fuentes`: es prensa, no reemplaza al documento oficial.

## 3. Medios
La tabla de `content/medios/` es la de siempre; verificá con `ls content/medios/` antes de anotar un medio como faltante (el lote 2026-09-06 de Lacalle Pou pudo haber creado `bcu`, `catalogodatos-gub-uy`, `ced`, `anp-brasil`, `bcb-brasil`). Organismos que no estén se anotan en `medios_faltantes` con propiedad (Estado uruguayo: `grupo: estado-uruguayo`, `alineamiento: estatal`).

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
Carpeta `inbox/orsi/veracimetro/2026-09-07/` con `chequeos.yaml`, `declaraciones.yaml` (solo las copias con primaria encontrada; si no, lista vacía), `promesas.yaml` y `menciones.yaml` vacías, `consultas.jsonl` y `notas.md` con las secciones de siempre más `## registro_primario` y `## resumen_vs_primaria`. Informe final: cuántos chequeos, cuántos con dato oficial y cuántos con `_faltante: dato_oficial`, qué primarias encontraste, el modelo con el que corriste, y objeciones al brief si las hubo.
