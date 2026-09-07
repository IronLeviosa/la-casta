# Brief de investigación · corrida 2026-09-07-lacalle-pou-brasil-serie

Regla 0: objetividad por encima de todo. Esta corrida completa un chequeo ya publicado con la serie entera que su afirmación abarca; el mismo criterio (el gráfico tiene que servir para probar toda la afirmación, no una parte) vale para cualquier chequeo de cualquier político. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Encargo

El chequeo `content/chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil.yaml` (leelo con `Read`) compara los precios de nafta y gasoil de Uruguay y Brasil en la semana del 27 de marzo de 2022, y su gráfico muestra solo esa semana. Pero la afirmación del presidente es «hoy por primera vez creo que del 2001 2002 tenemos combustibles más baratos que Brasil»: para probarla o refutarla entera hace falta la serie anual desde 2001 o 2002 hasta 2022, para nafta y para gasoil, en dólares por litro, en los dos países.

Entregá en `inbox/lacalle-pou/economia/combustibles/2026-09-07-brasil/`:

1. `series.yaml`: una lista con un ítem por año (2001 o 2002 hasta 2022), cada uno `{anio, uruguay_nafta_usd_l, uruguay_gasoil_usd_l, brasil_nafta_usd_l, brasil_gasoil_usd_l, uruguay_tipo_cambio, brasil_tipo_cambio, nota}`, con el promedio anual de cada precio y el método (promedio simple de los meses o semanas disponibles; decilo). Cada número tiene que poder rastrearse a una fuente oficial leída con `pnpm fuente` en esta sesión, listada en `fuentes_series` al final del archivo (una entrada por dataset o documento, con `cita` literal de su descripción o de un renglón).
2. `chequeos.yaml`: una copia del chequeo con `_slug: combustibles-mas-baratos-brasil`, sin tocar `calificacion`, `analisis`, `afirmacion`, `fragmento` ni `titulo`, con `grafico` reemplazado por la serie completa (`tipo: lineas`, cuatro series: "Nafta Uruguay", "Nafta Brasil", "Gasoil Uruguay", "Gasoil Brasil", `x` = año, `unidad: USD por litro`, `nota` con la convención de tipo de cambio y qué productos se comparan, `fuente` de cada serie en una frase) y las fuentes nuevas agregadas a `dato_real.fuentes`. El editor decide después si el análisis cambia.

Dónde están los datos:
- **Uruguay**: el dataset de URSEA en `catalogodatos.gub.uy` (`ursea-ppi_vs_pe_v2`, series mensuales desde 2002-01 con precio de venta al público y PPI; API CKAN `catalogodatos.gub.uy/api/3/action/package_show?id=ursea-ppi_vs_pe_v2` para llegar al CSV), los decretos de precios en `impo.com.uy` si falta algún año, y el tipo de cambio del BCU (`bcu.gub.uy`, cotizaciones históricas o series estadísticas; el promedio anual del dólar interbancario o billete, decí cuál). Los productos: nafta Súper 95 (o la de mayor volumen del año) y gasoil (50S, o el grado de mayor volumen; en años viejos había un solo gasoil).
- **Brasil**: la ANP publica la "Série Histórica de Preços de Combustíveis" (`gov.br/anp`, "Preços de combustíveis", con archivos por semestre desde 2004 en `dados.gov.br`) y síntesis anuales; para 2001-2003 buscá el "Anuário Estatístico" de la ANP o la serie del levantamiento anterior. Precio médio de revenda nacional, gasolina comum y óleo diesel (S10 desde que existe; antes, diesel común). Tipo de cambio PTAX del Banco Central do Brasil (`olinda.bcb.gov.br`, serie anual o promedio de las diarias).
- Si un año no tiene dato en alguna de las fuentes, el ítem lleva `null` en ese campo y `nota` con el motivo. No estimes.

## 2. Reglas duras
1. Toda página, PDF, CSV o API que cites se lee con `pnpm fuente <url>` (si `pnpm fuente` no puede con un CSV o una API, leelo con `WebFetch` y anotá en `notas.md` que esa fuente queda con `verificacion: manual`). Nunca cites una URL que no abriste en esta sesión.
2. Los promedios anuales los calculás vos a partir de los datos oficiales; el método y los datos crudos (o el enlace exacto al archivo) quedan en `notas.md` bajo `## metodo`, para que cualquiera lo reproduzca.
3. No escribas tier, calificación ni análisis. No toques `content/`.
4. Cada búsqueda y URL a `consultas.jsonl`.
5. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.

## 3. Salida esperada
Carpeta `inbox/lacalle-pou/economia/combustibles/2026-09-07-brasil/` con `series.yaml`, `chequeos.yaml`, `consultas.jsonl` y `notas.md` (secciones de siempre más `## metodo` y `## anios_sin_dato`). Informe final: qué años y productos cubriste, qué fuentes, en qué años Uruguay resultó más barato que Brasil según tu serie (sin calificar), el modelo con el que corriste, y objeciones al brief.
