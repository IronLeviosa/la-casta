# Corrección de presentación: narración de proceso y bloques largos, lote c

Fecha: 2026-09-09. Tipo: `presentacion`. Tercer lote, después de `2026-09-09-presentacion-narracion-a`
(análisis, casos, empresas, medios) y `-b` (chequeos, declaraciones, giros, promesas, vetos).

`pnpm revisar:paginas --estricto` sobre el sitio construido en el commit 64cd123 deja 22 hallazgos
de contenido en 16 páginas. Este lote cubre los que salen de registros de `content/`:

- `analisis/ose/2020-06-01-bid-sector-agua-saneamiento-uruguay` y `analisis/ose/2024-11-01-aderasa-indicadores-2022`:
  «en el fragmento leído en esta corrida», «nombra 8 de los 11 en el texto leído en esta corrida»,
  «No se encontró, en esta corrida, un documento propio de OSE o de URSEA».
- `empresas/anp` (se ve en `/empresas/anp/` y en `/monopolios/`): «no se verificó en esta corrida
  contra el texto de IMPO», «verificó el texto de ese decreto en IMPO en esta corrida», «no se
  encontró, en esta corrida, una respuesta pública de ANP», en `monopolio.alcance` y en un argumento.
- `cobertura/*` (se ve en «Misma noticia, distintos títulos» de `/eventos/caso-astesiano/`,
  `/eventos/mecanismo-precios-combustibles-luc/`, `/eventos/referendum-luc/`): «ver
  discrepancias.yaml de este lote», «content/medios/la-republica.yaml no tenía ese dominio
  registrado», «que el lote de la ficha no citaba y que esta corrida incorporó», «registrada aparte
  en discrepancias.yaml».
- `discrepancias/*` (se ve en «Diferencias con la fuente primaria» de `/medios/<slug>/`): «que no se
  leyó en esta corrida», «ver empresas.yaml de esta misma corrida», «…-diez-anos-2025.yaml, y la
  crítica de esta corrida pide su corrección», «no se estableció en esta corrida», «Los dos chequeos
  de esta corrida»; y cuatro `analisis` de más de 1.500 caracteres en un solo párrafo (bid 1.670,
  el-observador 1.552, presidencia 2.236, subrayado 1.791).

Regla: se reescribe la forma, nunca lo afirmado. Ninguna cifra, cita, fuente, calificación, tono ni
tier cambia. Los registros de `cobertura` y `discrepancias` los escribe el crítico; acá el editor
solo les saca el rastro del proceso y parte los párrafos largos.

Quedan fuera, por ser de código y no de contenido: los dos párrafos de declaraciones con chequeos
marcados (`lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto`,
`orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`), donde el contador sumaba el texto
oculto de los globos; `revisar:paginas` ya mide solo lo visible.
