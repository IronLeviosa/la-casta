# Razones de edición — 2026-09-16-correccion-astori-irpf-2016-05

## Cambios de fondo

- declaraciones[0] astori/2016-05-26-defensa-suba-irpf-franja-33401-50100 (critica 2026-09-16-correccion-astori-resolucion-chequeos, presentacion + un_solo_grupo): resumen corregido (a Astori lo entrevisto radio Carve, El Pais reporto la entrevista, no la hizo); se sumo El Observador del 27/5/2016 como segunda fuente porque contiene el mismo pasaje de Astori condensado con (...), fechado ayer. Se mantiene tier: probable pese a que el validador cuenta dos grupos distintos (scheck-aguirre y werthein-hochbaum): la ficha de El Observador solo documenta ese grupo desde el 5/5/2022 y no tiene grupo_historial para 2016, asi que no corresponde dar la segunda fuente por buena todavia.

## Cambios de fondo

- chequeos[0] astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100 (critica 2026-09-16-correccion-astori-resolucion-chequeos, bloquea un_solo_grupo + corregir documento_previsible): se encontro el documento_previsible que pedia el critico -el comunicado de Presidencia del 23/5/2016, misma conferencia del anuncio del ajuste fiscal- que confirma literalmente la tasa de 15% a 18% para esta franja; sumado como dato_real.fuentes[2] y calificacion sube de discutible a verdadero. No se re-ancla el chequeo a la declaracion del 23/5 como sugeria la accion_sugerida del critico: esa declaracion esta publicada, fuera de alcance de esta correccion, y su cita/resumen no traen el tramo del fragmento, asi que el cambio de id dejaria un fragmento sin correspondencia. Se sumo El Observador del 27/5 a evidencia.fuentes espejando la declaracion; se mantiene tier: probable por la misma razon de grupo de El Observador sin documentar en 2016.

## Tier

- declaraciones[0] y chequeos[0] (astori/2016-05-26): quedan en probable. Mismo criterio que se aplicaria a cualquier otro politico: una segunda fuente cuyo grupo editorial en la fecha del hecho no esta documentado no cuenta como segunda fuente valida para pasar a publicado, aunque el validador la cuente mecanicamente como grupo distinto (la ficha de El Observador solo tiene grupo_historial desde 2022).

## Cambios de fondo

- discrepancias[0] astori-franja-irpf-33041-50110-2016 y discrepancias[1] astori-plazo-rendicion-cuentas-31-de-junio-2016 (halladas por el critico, evidencia.nivel textual contra Presidencia 23/5/2016): cumplen las tres reglas de discrepancias.md (solo contra fuente primaria, sin verbos de intencion, mismo umbral) y quedan listas para entrar como agrega en correcciones.yaml, sin cambios.

## Corrector

- chequeos[0] (astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100): se saca El Observador (27/5/2016) de evidencia.fuentes. Verificado con pnpm fuente --buscar: la nota trae el tramo $33.401-$50.100 y la frase de liquidacion progresiva, pero no menciona 15% ni 18% atribuidos a Astori, asi que no respalda la cifra puntual del chequeo (docs/colecciones/correcciones.md, 'la segunda fuente falsa'). Queda solo en la declaracion, donde si corrobora la cita general. dato_real y calificacion (verdadero) no se tocan: siguen sostenidos por los documentos de Presidencia. evidencia.fuentes del chequeo vuelve a 1 fuente (El Pais, reportado); validar avisa 'un solo grupo de medios' (no es error). Tier se mantiene probable por esa falta de segunda fuente en evidencia, no por dato_real. Se actualizo notas_internas y se corrigieron cambios[] y motivo de correcciones[0] para reflejar que El Observador solo se sumo a la declaracion.

## Tier

- correcciones[0] (astori-irpf-2016-05): revision.tier de probable a publicado. docs/colecciones/correcciones.md no exige que el tier de la corrección siga el de los registros que afecta; la corrección documenta un cambio ya cerrado (calificacion, resumen, dato_real) con sus propias fuentes citadas, aunque declaracion y chequeo sigan probable por falta de segunda fuente. Se aplica el mismo criterio que a las demas correcciones publicadas del repositorio.
