# razones.md — inbox/prensa/discrepancias/2026-09-05

Lote de 2 registros en `discrepancias.yaml`, escritos por el crítico de la corrida
`2026-09-05-vazquez-vetos`. Faltaban `publicado.retrieved_at` y `evidencia` en los dos; el resto
del crudo se revisó igual, reabriendo cada fuente con `pnpm fuente`.

## Fuentes reabiertas en esta sesión (todas con `pnpm fuente`, 2026-09-05)

- https://www.180.com.uy/articulo/713_Vazquez-veto-la-despenalizacion-del-aborto-parte-del-gabinete-le-dio-la-espalda
- https://pmb.parlamento.gub.uy/pmb/opac_css?id=80299&lvl=notice_display
- https://parlamento.gub.uy/documentosyleyes/ficha-asunto/29685/ficha_completa
- https://www.infobae.com/sociedad/2020/12/06/el-dia-que-tabare-vazquez-veto-el-aborto-en-uruguay-y-cuales-fueron-sus-fundamentos-para-esa-decision/
- https://www.180.com.uy/articulo/858_El-veto-quedo-firme
- https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=46

## Cambios no triviales

1. **Registro 1 (180.com.uy, 2008-11-14, `dato_erroneo`).** Confirmé carácter a carácter que
   `publicado.cita` y `fuente_primaria.cita` son literales y contiguas en sus respectivas fuentes
   (180.com.uy y el texto del veto reproducido íntegro por Infobae). No cambié ninguna de las dos
   citas. Agregué `evidencia: {nivel: textual, fuentes: [...]}` reusando las tres fuentes de
   `fuente_primaria` (dos `documento_oficial` de Parlamento + la nota de Infobae que reproduce el
   texto oficial), porque son las que prueban la discrepancia. Agregué `publicado.retrieved_at:
   2026-09-05` (fecha real de esta sesión). Agregué `tema: derechos-humanos` y `politico: vazquez`
   para que quede indexado junto al veto ya publicado en `content/vetos/vazquez/2008-11-14-...`,
   que usa el mismo tema.

2. **Registro 2 (180.com.uy, 2008-11-21, `dato_erroneo`).** Mismos agregados de `evidencia`,
   `publicado.retrieved_at`, `tema` y `politico`. Además corregí `fuente_primaria.cita`: la versión
   del crítico unía con "..." dos tramos de la MISMA página del índice de diarios de sesión de
   Parlamento (el encabezado "13ª Sesión Extraordinaria del 20 de noviembre de 2008..." y, salteando
   el sumario numerado 1) a 4) de esa sesión, el ítem 5) "Defensa del derecho a la salud sexual y
   reproductiva..."). Al reabrir la fuente con `pnpm fuente --buscar` y leer el JSON del corpus
   completo, el sumario 1)-4) está genuinamente entre esos dos tramos: usar "..." saltaba contenido
   real de la fuente, lo que el encargo pide evitar. Reemplacé la cita por el tramo íntegro y
   contiguo, sin elidir nada (queda más largo, incluye "S U M A R I O 1) Texto de la citación
   2) Asistencia 3) Asuntos entrados 4) Inasistencias anteriores 5)", pero es exactamente lo que dice
   la página en ese orden). No es una objeción de `critica.md`; es un hallazgo propio al verificar
   citas carácter a carácter, tal como pide el encargo (punto 5).

3. **No elegí `revision.tier: probable` para ninguno de los dos.** Ambos se pudieron confrontar
   contra fuente primaria (documento_oficial de Parlamento) abierta por mí en esta sesión, con citas
   exactas confirmadas por `pnpm validar --inbox --red` (5/5 citas "exacta (1.00)", 0 aproximadas).
   Fueron a `tier: publicado`.

4. **No saqué ningún registro.** Los dos análisis, al reabrir las fuentes, siguen sosteniéndose: el
   primero es un error de magnitud/alcance (tres artículos vs. catorce artículos en tres capítulos),
   el segundo un error de día de la semana (miércoles vs. jueves 20-11-2008, confirmado con
   `date -j`). Ninguno es un error de nuestra lectura.

## Verificación final

`pnpm validar --inbox inbox/prensa/discrepancias/2026-09-05 --red`: 0 errores, 6 avisos (los 6 son
de cobertura por tema/partido, no de este lote), 5/5 citas exactas.
