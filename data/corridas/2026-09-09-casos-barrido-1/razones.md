# Razones — edición de `inbox/casos-barrido-1/todos/` (corrida 2026-09-09-casos-barrido-1)

Editor: Sonnet (modelo `claude-sonnet-5`), regla 14 de CLAUDE.md. El crítico (Opus) y el corrector
(Sonnet) ya habían resuelto la mayoría de las 67 objeciones de `critica.md`; lo que sigue es lo que
cambié yo sobre ese trabajo, con la referencia a la objeción de origen.

## Tiers (por qué cada caso quedó donde quedó)

Umbral aplicado igual a los 13 casos: publicado cuando (a) ningún hito queda con una sola fuente de
un grupo de medios (o, si es `textual`, sin fuente primaria), y (b) el desenlace documentado no deja
en duda la `etiqueta_legal` vigente. Si (a) o (b) fallan, el caso queda en `probable` con
`revision.que_falta` explicando el hueco.

1. **casos[0] Argimón/audio Cristino → `probable`.** El hito de 2020-06-22 sigue con una sola fuente
   (Subrayado); el corrector ya había buscado una segunda sin éxito (objeción 3 de casos[0],
   `un_solo_grupo`). No repetí la búsqueda porque no es mi rol; dejé `que_falta`.
2. **casos[1] Argimón/JUTEP hermana → `probable`.** El hito de 2020-08-03 sigue con una sola fuente
   y no se encontró la resolución de la Jutep del 10/8/2020 ("Respuesta a trascendidos de prensa")
   que la objeción 2 de casos[1] (`documento_previsible`) pedía. `que_falta` lo dice.
3. **casos[2] Batlle → `probable`.** Quité "No se buscó en esta corrida qué hizo la Justicia..." del
   resumen y de la descripción del hito de cierre (narración de proceso) y lo reescribí como "No hay
   registro público de qué hizo la Justicia con esos antecedentes"; el hueco en sí pasó a
   `revision.que_falta`, no a la línea de tiempo. Sigo literalmente la acción sugerida de la objeción
   2 de casos[2]: "el caso queda en probable hasta que se resuelva".
4. **casos[3] Cosse/juicio político → `publicado`.** Las dos objeciones `corregir` (etapa, contexto)
   ya estaban resueltas por el corrector; ningún hito quedó con una sola fuente.
5. **casos[4] Cosse/Antel Arena → `publicado`.** Las cuatro objeciones `bloquea` y las tres
   `corregir` sobre evidencia ya estaban resueltas. Dejé en `notas_internas` que el documento
   previsible de la objeción 8 (auditoría de Ecovis, informe del Tribunal de Cuentas, dictámenes de
   Fiscalía) sigue sin encontrarse: no lo busco yo porque no es tarea del editor, y no bloquea
   `publicado` porque cada hito ya tiene dos grupos de medios.
6. **casos[5] Manini Ríos → `publicado`.** Todas las objeciones `corregir` resueltas. Dejé en
   `notas_internas` la discrepancia de nombre de la fiscal (María Nogueira / Lucía Nogueira) que la
   crítica marcó como `aviso` en el punto 5 de casos[5], sin buscar el comunicado de la FGN que la
   resolvería.
7. **casos[6] Nin Novoa → `probable`.** Sigo la acción sugerida de la objeción 1 de casos[6]:
   "`revision.que_falta` diciendo que no se encontró el destino de la causa" tras el rechazo del
   desafuero de 2011.
8. **casos[7] Ojeda/artículo 124 → `publicado`.** Agregué a la descripción del hito de 2025-11-20 la
   respuesta de la fiscal de Corte Mónica Ferrero, que la objeción 4 de casos[7] pedía ("un hito que
   abre una consulta y nunca dice cómo terminó es media línea de tiempo"). Recorté el resumen de 341
   a ~205 palabras, moviendo a esa misma descripción de hito lo que era prosa fechada (regla de
   presentación del encargo).
9. **casos[8] Ojeda/difamación → `probable`.** Mantuve el `_faltante: segunda_fuente` que dejó el
   corrector en los dos hitos: aunque hay dos grupos de medios nominalmente en el primer hito, Caras
   y Caretas atribuye el dato a "según publica La Diaria" (reproducción, no reporteo propio), que es
   la misma regla que "una copia de agencia en varios diarios cuenta como uno" (objeción 1 de
   casos[8], `un_solo_grupo`, bloqueaba).
10. **casos[9] Orsi/denuncia falsa → `publicado`.** Sin cambios de fondo; todas las objeciones ya
    resueltas por el corrector (condenas de las denunciantes agregadas como hito, datos sensibles
    retirados).
11. **casos[10] Sendic/Ancap → `probable`.** Creé `content/medios/fiscalia-general-nacion.yaml`
    (no existía ningún medio para la Fiscalía; ver "Lo que queda pendiente para el editor" de
    `notas.md`) y agregué un hito nuevo (2020-12-09, `nivel: textual`) con el comunicado oficial de
    la Fiscalía sobre el pedido de condena de Pacheco, releído por mí con `pnpm fuente`. Recorté el
    resumen de 381 a ~200 palabras trasladando esa fecha al hito nuevo. El tier queda en `probable`
    porque sigo la acción sugerida explícita de la objeción 4 de casos[10]: "el caso queda en
    probable hasta que se resuelva [la apelación de 2021]"; mientras no se sepa el resultado,
    `etiqueta_legal: condena` describe una sentencia de primera instancia apelada, no un estado
    final.
12. **casos[11] Topolansky → `publicado`.** Recorté el resumen de 348 a ~214 palabras quitando
    fechas ya cubiertas por los tres hitos. Dejé en `notas_internas` que la fecha del hito del
    Tribunal de Apelaciones es aproximada (las fuentes solo dan la fecha de publicación de la nota,
    no de la resolución) y que no se encontró el comunicado de la FGN sobre el cierre de esta
    investigación puntual (objeción 4 de casos[11], no resuelta por el corrector); no bloquea
    `publicado` porque el rol y el desenlace personal de Topolansky (testificó, nunca indagada) sí
    están documentados con dos grupos de medios en cada hito.
13. **casos[12] Vázquez/UPM II → `publicado`.** Sin cambios de fondo.

**Sobre Ojeda/124 frente a Batlle, Nin Novoa y Sendic (mismo criterio, resultado distinto y por
qué).** Los cuatro casos terminan sin un desenlace final conocido, pero en Ojeda/124 eso es el estado
real y vigente (una comisión parlamentaria sigue trabajando el caso, con búsquedas de seguimiento que
confirmaron que no hay resolución posterior); en Batlle, Nin Novoa y Sendic el hueco es antiguo
(2004, 2011, 2021) y no se buscó con el mismo esfuerzo que la acusación, que es exactamente lo que la
regla de desenlaces de `content/casos/` exige parejo para todos.

Roles: los doce cambios de `mencionado`/`imputado` a `denunciado` de la tabla de la objeción de lote
3 ya estaban aplicados por el corrector; confirmé con `grep "rol:" casos.yaml` que quedaron 12
`denunciado` y 1 `imputado` (Sendic, sin cambio, es el único con procesamiento y condena).

## declaraciones.yaml

14. Agregué `titulo` a la declaración de Manini Ríos (2019-09-25), que no lo tenía: "Sostiene que
    hizo lo que correspondía frente a la confesión de Gavazzo sobre Gomensoro" (regla del encargo:
    toda declaración lleva título de 8 a 110 caracteres).
15. Tier `probable`: sigue con una sola fuente (180, que reproduce a Subrayado) y sin la entrevista
    original; `que_falta` lo dice.
16. No repuse `declaraciones[1]` (Delgado/Cardama). El corrector ya la había sacado del lote
    (`notas.md`, "Se optó por la primera: sacar declaraciones[1] de este lote") siguiendo la objeción
    de `asimetria` de la crítica: la nota tiene cuatro voces (oficialismo y oposición) y el lote solo
    había cargado una. Cargar las cuatro excede el alcance de un barrido de casos judiciales; queda
    para una corrida temática sobre Cardama, como ya está anotado.
17. No agregué `seguimiento` a la declaración de Manini Ríos. La crítica lo planteó como posible
    (objecion de declaraciones[0]) pero la calificó de "marginal: no la señala con nombre"; una
    declaración que no nombra a nadie con una irregularidad concreta no cumple el supuesto de
    `seguimiento` ("declaración que denuncia una ilegalidad o una irregularidad, o que pide una
    acción concreta").

## discrepancias.yaml

18. Agregué el campo `evidencia` (obligatorio, `nivel: textual`, reutilizando las mismas fuentes ya
    presentes en `fuente_primaria.fuentes` de cada entrada) a las dos entradas del crítico, que no
    validaban por faltarles ese campo (`notas.md`, "Lo que queda pendiente para el editor", punto 1).
    No toqué el resto del contenido: el crítico ya documentó, dentro del propio archivo, los siete
    casos que evaluó y no registró por falta de documento primario, y ese razonamiento se sostiene
    igual para todos los medios.

## content/medios/

19. Creé `content/medios/fiscalia-general-nacion.yaml` (organismo público, `tipo: estatal`, `grupo:
    estado-uruguayo`, `alineamiento: estatal`), con `propiedad` y `alineamiento` respaldados por una
    fuente leída con `pnpm fuente` en esta sesión (`gub.uy/fiscalia-general-nacion/politicas-y-gestion/somos`,
    "La Fiscalía es un servicio descentralizado que no forma parte de ninguno de los tres Poderes del
    Estado"). Sin este medio, ningún caso del sitio podía citar un comunicado de la Fiscalía como
    fuente (gap señalado en `notas.md`, "Hallazgo con fuente pero sin poder citar").

## hipotesis/ (las cuatro que pedía el encargo, tomadas de `notas.md`)

20. `hipotesis/manini-rios/giro-fueros-desafuero-campana-2019.yaml`: giro sobre los fueros señalado
    en la objeción 6 de "lo que el lote tuvo delante y no levantó"; dos fuentes existentes son del
    mismo grupo (Montevideo Portal) y falta la declaración de campaña original.
21. `hipotesis/vidalin/denuncia-fondos-evacuados-durazno-2009.yaml`: caso anotado en `casos_vistos`
    del lote b; Vidalín no tiene ficha en `content/politicos/` (es intendente departamental, fuera
    del alcance de este barrido de presidentes y legisladores nacionales).
22. `hipotesis/mujica/interrogatorio-testigo-hechos-14-abril-1972.yaml`: anotado en `hipotesis` del
    lote b; declaró como testigo, sin denuncia ni imputación.
23. `hipotesis/lacalle-pou/ayax-camionetas-compras-excepcion.yaml`: anotado en `hipotesis` del lote
    b; sin denuncia, investigación ni acusación pública identificable.

Para 21, 22 y 23, `notas.md` no dejó URL ni cita literal (son hallazgos narrados, no citados). No
inventé una fuente: dejé `evidencia_a_favor: []` y el hueco explícito en `cabos_sueltos`, para que la
etapa 2 del barrido busque y lea la fuente con `pnpm fuente` antes de cargar nada.

## Por qué ciertas objeciones quedan sin resolver (y por qué eso es correcto en este rol)

Mi rol de editor no corre `pnpm inventario`, `pnpm descubrir` ni una búsqueda general en la web; solo
releo con `pnpm fuente` lo que ya está citado en el lote, y uso WebSearch solo para documentar un
giro. Por eso, cuando el corrector dejó una objeción `corregir` sin resolver porque exigía una
búsqueda nueva que no le correspondía a él tampoco completar (un documento de la Jutep, una sentencia
de la Base de Jurisprudencia Nacional, el resultado de una apelación, el comunicado de la FGN sobre
Topolansky), no la busqué yo: dejé `revision.que_falta` cuando el hueco impide `publicado`, o
`notas_internas` cuando no lo impide porque las reglas mecánicas ya están satisfechas. Esas búsquedas
quedan para el resolvedor.

## Cambios de forma (no alteran lo afirmado ni la evidencia)

- Corregí dos errores de sintaxis YAML que introduje al editar (dos puntos seguidos de espacio dentro
  de escalares planos sin comillas, en el resumen de Cosse/Antel Arena y en la `notas_internas` de
  ese mismo caso), detectados por `pnpm validar --inbox`.
