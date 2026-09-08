# Brief de investigación · corrida 2026-09-08-empresas-ose-serie-historica

Regla 0: objetividad por encima de todo. La ficha publicada de OSE (`content/empresas/ose.yaml`) tiene balances desde 2015; la empresa existe desde 1952. Un lector señaló que un botón que muestra «todo» y termina en 2015 hace pensar que la empresa nació ese año o que el sitio esconde el resto. Esta corrida carga la serie histórica hacia atrás: **todos los años con balance público**, hasta donde existan documentos, con el mismo detalle y el mismo rigor que los años ya cargados. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## Encargo

Leé con `Read` tu archivo de rol (sección «Empresas públicas» y reglas duras), la ficha publicada y el esquema `src/schemas/empresa.ts`. Entregá en `inbox/empresas/ose/2026-09-08-serie-historica/empresas.yaml` una copia de la ficha con `_slug: ose` y `_investigacion`, sin tocar `resumen`, `revision`, `hitos` ni los argumentos, con:

1. **Un ítem de `finanzas[]` por cada año anterior a 2015 del que encuentres el balance** (`resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`, `segmentos[]` si el documento los informa), en pesos tal como figuran y en dólares al tipo de cambio de cierre que declare el propio balance, `unidad: millones` con un decimal, cita literal del renglón de cada monto. Si un balance está publicado pero es un escaneo sin capa de texto, cargá el año con `nota` de una oración que lo diga y la URL en `notas.md` bajo `## escaneos_sin_texto`, para pasarlo por OCR después; no inventes cifras. Los balances antes de 2000 pueden estar en pesos uruguayos viejos o en nuevos pesos: registrá la moneda que dice el documento en `nota` y no conviertas lo que el documento no convierte.
2. **Dónde buscar, en este orden**: corpus (`pnpm corpus:buscar "OSE balance" --hasta 2015-12-31` y variantes: estados contables, memoria anual, resultado del ejercicio, Rentas Generales, capitalización), `ose.com.uy` (estados financieros por año), `ain.gub.uy`, Rendiciones de Cuentas del MEF, informes del Banco Mundial y del BID con estados financieros de OSE en anexos, memorias anuales en Wayback. Cada URL leída con `pnpm fuente` (PDF, planilla o zip). Para lo que solo exista en Wayback, la URL archivada es la fuente y `archived_url` la misma.
3. **`## cobertura_del_periodo`** en `notas.md`: una tabla año por año desde 1952 hasta 2014 con tres estados: cargado, publicado pero sin texto (escaneo), o sin documento público encontrado (con las búsquedas hechas). Esa tabla es lo que la ficha va a decir para que el lector sepa qué existe y qué no.
4. **Hitos**: si al leer balances viejos aparecen hechos fechados que la ficha no tiene (crisis de 2002, capitalizaciones, reestructuras, cambios de marco legal), anotalos en `notas.md` bajo `## para_el_editor` con su fuente; el editor los suma a `hitos[]`.

## Reglas duras
1. Toda página, PDF, planilla o zip que cites se lee con `pnpm fuente`; nunca cites una URL que no abriste en esta sesión.
2. Citas literales y contiguas (una fila completa en planillas). No toques `content/`. No escribas tier ni resumen.
3. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## cobertura_del_periodo`, `## escaneos_sin_texto` y `## para_el_editor`.
4. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
5. Guardá `empresas.yaml` después de cada año cargado: si te interrumpen, que quede lo hecho.
6. Al cerrar, `pnpm validar --inbox inbox/empresas/ose/2026-09-08-serie-historica`.

## Salida esperada
Carpeta `inbox/empresas/ose/2026-09-08-serie-historica/` con `empresas.yaml`, `consultas.jsonl`, `notas.md`. Informe: qué años cargaste, cuáles quedaron como escaneo sin texto, cuáles no tienen documento público, el modelo con el que corriste, objeciones al brief.
