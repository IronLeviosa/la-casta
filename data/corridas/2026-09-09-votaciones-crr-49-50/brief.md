# Votaciones de la Cámara de Representantes, legislaturas XLIX (2020-2025) y L (2025-)

Fecha: 2026-09-09. Pedido del mantenedor: seguir si los diputados votan como prometieron y, en las
votaciones decididas por pocos votos, quién de la bancada que impulsaba el proyecto votó al revés o
no apareció. Serie completa de las dos legislaturas: se analizan todas y se destacan las ajustadas
(Regla 0: no se eligen «las escandalosas»).

## Cómo se llegó a la lista

1. Inventario de los 368 diarios de sesiones de Diputados en la Hemeroteca de la Biblioteca del Poder
   Legislativo (`.cache/biblioteca-crr-2020-2026.json`, URL estable por PDF).
2. Extracción mecánica de cada diario (`.cache/extraer-votaciones.ts`): resultado literal proclamado
   por la Mesa, asunto en consideración, instancia (general, particular, trámite), si fue nominal, y
   la asistencia de la sesión (presentes, con licencia, faltas con y sin aviso, en el Senado).
3. Ranking por margen contra la mayoría de presentes (`.cache/rankear-votaciones.ts`): ajustada =
   sobraron o faltaron tres votos o menos. Las de trámite (licencias, exposiciones escritas,
   homenajes) quedan fuera. La lista con fecha, sesión, número de votación y asunto está en
   `.cache/votaciones/ajustadas.json` y se copia al final de este brief.

## Qué hace el investigador con cada votación de la lista

- Abre el diario de esa fecha con `pnpm fuente` (URL de la Hemeroteca) y confirma el resultado
  literal (`texto_del_acta`), el asunto (título en lenguaje llano, tipo, carpeta o repartido si consta,
  ley resultante si existe), la instancia y si fue nominal.
- Carga `legisladores[]` con los 99 integrantes de la Cámara en esa sesión a partir del bloque de
  asistencia: presentes (`voto: sin_dato`, `fuente_del_voto: sin_dato`, salvo nominal), con licencia,
  faltas con y sin aviso, en el Senado, y los suplentes convocados (`condicion: suplente`,
  `suple_a`). Partido y departamento de cada uno: de la ficha en `content/politicos/` (corrida
  `2026-09-09-diputados-49-50`) o de su página en parlamento.gub.uy.
- Si la votación fue nominal, carga el voto de cada uno (`fuente_del_voto: nominal`) y verifica que
  los totales coincidan con el resultado.
- Si no fue nominal: busca en prensa (corpus primero, `pnpm corpus:buscar`; después web) la
  posición declarada de cada bancada (`bancadas[]` con fuente) y declaraciones públicas de
  legisladores sobre su propio voto (`fuente_del_voto: declarado`, con la cita). Deduce un voto por
  aritmética solo cuando los totales no dejen otra posibilidad, y lo explica en `nota`.
- `promesas_relacionadas[]`: busca en `content/promesas/` y en el programa o las declaraciones de
  campaña de los legisladores que votaron distinto de su bancada o faltaron; si la promesa no está
  cargada, la escribe en `promesas.yaml` del lote con su fuente.
- `analisis`: qué se votó, margen, cómo votó cada bancada, quiénes se apartaron o faltaron. Sin
  verbos de intención. Lo que la persona explicó en público, en `nota` con fuente. Lo que se rumorea,
  a `hipotesis/`.
- Enlaza la votación al evento de `content/eventos/` al que pertenece (`asunto.evento`), o propone el
  evento en `eventos.yaml` del lote.

## Lotes

Un lote por año (`inbox/votaciones/<año>/`), con `votaciones.yaml`, `promesas.yaml` y `eventos.yaml`
si hacen falta, y `notas.md`.

## Lista de votaciones (se completa al terminar el ranking)
