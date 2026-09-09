# Caso Penadés: ficha del caso y del político

Fecha: 2026-09-09. Pedido explícito del mantenedor («Tampoco veo acá la de Penadés, esa dónde
quedó?»), que es lo que la regla 12 exige para investigar un caso judicial.

## Qué se carga

1. `politicos.yaml`: la ficha de Gustavo Penadés (Partido Nacional): nombre completo, alias,
   mandatos con fuente oficial (parlamento.gub.uy: senador de la República desde 2020-02-15 y la fecha
   en que dejó la banca, con el documento que lo registra), `estado_actual` según lo que conste hoy
   (situación y salida).
2. `casos.yaml`: el caso, con `estado_judicial[]` completo y en orden: la denuncia pública de marzo
   de 2023 (quién la hizo, dónde, con fuente), la investigación de Fiscalía, el desafuero o la
   renuncia a los fueros en el Senado (con la votación, que es nominal: consta en el diario de
   sesiones), la formalización, la prisión preventiva, el juicio y la sentencia si existe, y todo
   recurso o etapa posterior que conste en fuentes públicas hasta hoy. Cada etapa con fecha y fuente.
   `involucrados[]` con el rol exacto que la fuente sostiene. Sin adjetivos, sin verbos de intención,
   sin datos de las víctimas (menores de edad: ni nombres, ni iniciales, ni datos que las
   identifiquen; ley 18.331 y art. 9 bis).
3. Si hay sentencia: cita textual de la parte resolutiva desde el documento (Base de Jurisprudencia
   Nacional Pública del Poder Judicial, o el comunicado oficial de la Fiscalía), leído con `pnpm
   fuente`.

## Fuentes, en este orden

- Fiscalía General de la Nación (fiscalia.gub.uy: comunicados y noticias sobre la causa).
- Poder Judicial (bjn.poderjudicial.gub.uy para sentencias; comunicados del Poder Judicial).
- Diario de sesiones del Senado (Hemeroteca: `biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/`)
  para el desafuero o la renuncia y la votación nominal.
- Prensa de al menos dos grupos distintos para lo que no tenga documento oficial (`reportado`).
- El corpus antes que la web (`pnpm corpus:buscar Penadés`).

## Regla 0 y riesgo legal

Se registra lo que consta, con etapa y fecha, en las dos direcciones (acusación y desenlace). Si el
caso tiene condena firme, va a `publicado` sin compuerta; si hay etapas sin resolución, queda en
`probable` hasta la firma del mantenedor. El mismo rigor que se aplicó a Astesiano y Marset.
