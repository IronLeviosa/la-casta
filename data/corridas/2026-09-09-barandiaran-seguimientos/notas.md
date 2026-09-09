# Notas — barandiaran / seguimientos / 2026-09-09

## Criterio de selección

El brief pidió tratar la declaración de pasantías (prioridad) y "las otras declaraciones
publicadas de Barandiarán que denuncian una ilegalidad o irregularidad, o piden una acción
concreta". `grep -li "inconstitucional\|ilegal\|viola\|contraviene\|irregular"
content/declaraciones/barandiaran/*.yaml` dio seis candidatas. De esas seis, cuatro se trataron
en este lote (ver tabla) y dos se excluyeron por no ajustarse al criterio del brief, no por
ningún motivo de contenido:

- **1996-09-11-fiebre-aftosa-control-fronterizo-1996**: pide "máxima energía y rigor" en general
  a "las autoridades nacionales" ante el fenómeno del ingreso irregular de ganado, sin nombrar un
  acto, un responsable ni una medida concreta trazable; el propio texto da por hecho que el
  decreto-ley que generaba la confusión "seguramente" iba a derogarse, es decir, no describe una
  denuncia de que alguien se salió con la suya sino una expectativa de que el Parlamento iba a
  actuar como ya se sabía que iba a actuar. No se le buscó desenlace.
- **1997-07-15-condena-eta-asesinato-miguel-angel-blanco-1997**: es una condena a un atentado
  ocurrido en España, sin denuncia de una ilegalidad ni pedido de acción a una autoridad
  uruguaya. No se le buscó desenlace.

Este criterio (¿nombra un acto y pide o anticipa una acción concreta y trazable de una
autoridad?) es el mismo que se aplicó a las cuatro incluidas, y a cualquier otra declaración de
cualquier político en corridas futuras: no depende de a quién denuncia Barandiarán ni de qué
partido gobierna en cada caso.

## Tabla: declaración → vías probadas → qué se encontró

| Declaración | Vías probadas | Qué se encontró |
|---|---|---|
| **pasantias-discriminan-universidad-catolica** (2003-11-07) | Diarios de sesión de Representantes nov. 2003 a dic. 2004 que mencionan a Barandiarán (13 diarios, de `.cache/barandiaran-crr-2000-2005-hits.jsonl`); búsqueda de "pasantías" y "contesta" en cada uno; búsqueda específica de la sección "Comunicaciones de los Ministerios"; búsqueda web de resolución del MTSS en IMPO; búsqueda web de cobertura de prensa; búsqueda del portal de pedidos de informes de Parlamento (404 y certificado inválido, no navegable) | El MTSS contestó la exposición el 6 de mayo de 2004 (Diario N.º 20), archivada "a sus antecedentes" sin otra medida de la Cámara. El Diario no reproduce el contenido de la respuesta (es la práctica habitual: solo se transcribe el texto íntegro de la exposición original, no el de la respuesta ministerial). No se encontró resolución en IMPO, cobertura de prensa, ni indicio de a quién se contrató, si el llamado se amplió o si se anuló. |
| **caso-banco-pan-azucar-informe-minoria-1995** (1995-07-25) | Mismo Diario de Sesiones (la votación fue esa misma madrugada) | La Cámara aprobó (84 en 94, y el punto 3 por unanimidad) una resolución de mayoría —distinta a la que Barandiarán había presentado en minoría, y que no nombra a Braga— que pasa a la Justicia los antecedentes de la investigación. El desenlace judicial posterior (si la Justicia formalizó, imputó o archivó algo) no se investigó: cae bajo "no investigues casos judiciales salvo pedido explícito del brief", y este brief pide el desenlace *legislativo* de la denuncia, no el judicial. Se anota en `casos_vistos`. |
| **irp-doble-imposicion-jubilados-1996** (1996-08-06) | Mismo Diario (1996-08-06, donde se pospuso el debate a setiembre); Diario del 1996-09-03 (primera sesión de setiembre, donde se retomó); búsqueda de la ley interpretativa posterior; Diario de 1997-10-01 (hallado por búsqueda de corpus sobre IRP/pasividades) | El 3 de setiembre de 1996 la Cámara votó (44 en 45) devolver a la Comisión de Seguridad Social el proyecto completo —incluida la minuta de comunicación del Nuevo Espacio pidiendo al Poder Ejecutivo la devolución de lo retenido—; en la misma sesión constó que el Poder Ejecutivo ya venía reduciendo administrativamente el adicional del IRP sobre las pasividades (mitad desde el 30/6/1996, con expectativa de eliminarlo el 31/12/1996) por una autorización del Presupuesto Nacional, es decir, por una vía distinta a la minuta. No se encontró la resolución final de la Comisión ni una ley posterior que ordene la devolución retroactiva que pedía la minuta; el Diario de 1997-10-01 muestra que, más de un año después, un legislador seguía describiendo que los jubilados pagaban el IRP dos veces. |
| **trabajadores-brasilenos-arroceras-irregulares-1999** (1999-03-17) | Mismo Diario (no fue exposición escrita ni pedido de informes, sino un pedido de que se enviara la versión taquigráfica a la Junta Departamental de Rocha y al MTSS, en el uso de la media hora previa); búsqueda de corpus por "trabajadores brasileños/extranjeros… arrocera…" en diarios de 1999; verificación de un pedido de informes de otro legislador (Courtoisie) sobre un caso relacionado pero distinto (Treinta y Tres, no Rocha) | No se encontró ninguna comunicación del MTSS ni de la Junta Departamental de Rocha que responda al pedido de Barandiarán. Sí se encontró que un pedido de informes de Gabriel Courtoisie sobre trabajadores extranjeros indocumentados en la cuenca arrocera de **Treinta y Tres** (presentado el 9/6/1999) fue contestado por el MTSS el 10/8/1999 — un trámite distinto, de otro departamento y otro legislador, que no menciona a Barandiarán ni a Rocha. |

## candidatos_giro

Ninguno detectado en este lote (es un lote de seguimiento, no de nuevas declaraciones).

## hipotesis

- Es posible que el llamado a pasantías del MTSS de 2003 se haya "corregido" ampliándolo a otras
  universidades o anulándolo en los meses siguientes, y que eso conste en una resolución del
  MTSS no indexada en IMPO ni en Wayback bajo los términos de búsqueda probados ("pasantías",
  "abogados", "Universidad Católica"). No se puede confirmar sin acceso a un archivo de
  resoluciones del MTSS de 2003-2004 más completo que el buscador de IMPO usado.
- El código de trámite parlamentario de la exposición de Barandiarán aparece como "C/27/000" en
  el Diario tanto en noviembre de 2003 como en mayo de 2004 — el mismo código que llevan varias
  exposiciones no relacionadas de otros legisladores en otros años (ej. Roque Arregui en el mismo
  Diario de noviembre de 2003). Es casi seguro un error de OCR del escaneo (un número real mal
  leído), no un código real reutilizado. Eso impidió rastrear el asunto por el portal de "Ficha
  Asunto" de Parlamento, cuyo buscador no devolvió resultados útiles para ese código.

## casos_vistos

- Venta del Banco Pan de Azúcar y actuación del Directorio del Banco Central del Uruguay /
  contador Enrique Braga (Diario de Sesiones de Representantes, 1995-07-25): la Cámara resolvió
  pasar los antecedentes a la Justicia Penal. No se investigó el desenlace judicial posterior
  (formalización, imputación, archivo): el brief de esta corrida no lo pidió y las instrucciones
  generales prohíben investigar casos judiciales sin pedido explícito.

## verificacion_manual

- `https://parlamento.gub.uy/camarasycomisiones/representantes/plenario/documentos/pedidos-de-informe/por-asunto`:
  HTTP 404 con `WebFetch` (usado solo para navegar, no para citar).
- `http://www.diputados.gub.uy/transparencia/pedidos-de-informe/`: error de certificado con
  `WebFetch`; con `curl -k` devolvió 200 pero la página se renderiza por JavaScript y no expone
  un listado navegable sin un navegador real. No se usó para citar nada.
- El portal de "Ficha Asunto" de Parlamento (`parlamento.gub.uy/documentosyleyes/ficha-asunto/…`)
  no se pudo consultar por número de carpeta porque el número que trae el Diario para la
  exposición de Barandiarán ("C/27/000") es casi con certeza un error de OCR (ver `hipotesis`).

## cobertura_del_periodo

- **1995-1999** (mandato como suplente, Nuevo Espacio, en la oposición durante los gobiernos de
  Sanguinetti y primeros años de Batlle): cubiertas dos declaraciones con seguimiento (Banco Pan
  de Azúcar 1995, IRP 1996) más una sin resolución pública encontrada (arroceras 1999). Se buscó
  en los diarios de sesión inmediatos y en diarios posteriores hasta 1997-10 para el caso del IRP.
- **2000-2004** (segundo período como suplente): cubierta la declaración de pasantías (2003), con
  seguimiento documentado hasta diciembre de 2004 usando el índice de diarios que mencionan a
  Barandiarán (`.cache/barandiaran-crr-2000-2005-hits.jsonl`).
- No se investigó el período posterior a 2004 porque ninguna de las cuatro declaraciones
  tratadas lo requería (todos los desenlaces encontrados, o su ausencia, quedaron establecidos
  dentro de 1995-2004).
- Prensa: se buscó cobertura de la exposición de pasantías en la prensa de fines de 2003 vía
  `WebSearch`; no apareció ninguna nota. No se corrió `pnpm descubrir` sobre un medio específico
  (el brief no lo pidió para este tema y no hay indicio de qué medio, si alguno, cubrió un hecho
  tan menor en 2003); si el editor lo considera necesario, `elpais.com.uy` es el candidato más
  productivo por el historial del proyecto con ese diario.

## objeciones_al_brief

Ninguna. El brief pide aplicar a las denuncias de Barandiarán el mismo rigor de desenlace que a
los casos judiciales, sin pedir asimetría de ningún tipo; es exactamente el criterio de Regla 0
(buscar el desenlace de toda acusación, la haga quien la haga).

## Nota sobre el esquema

El brief decía que el campo `seguimiento` "ya está" en `src/schemas/declaracion.ts`. La primera
lectura del archivo en esta sesión no lo mostró, pero una relectura posterior (tras confirmar con
`git log`) sí lo mostró: el campo fue agregado en el commit `acfa167...` de este mismo día
(2026-09-09), que resultó ser ancestro de `HEAD`. Probablemente una lectura de archivo hecha
antes de que ese commit terminara de aplicarse en el árbol de trabajo. No hubo que improvisar el
campo: se usó tal como está definido (`estado: resuelto | sin_resolucion_publica`, `fecha`
opcional, `texto` de al menos 20 caracteres, `fuentes` con la misma forma que
`evidencia.fuentes`).

## Nota sobre una cita corregida

La primera versión de la cita del `seguimiento.fuentes` del caso Banco Pan de Azúcar (texto del
proyecto de resolución aprobado) quedó en "aproximada" (0.99) en `pnpm validar --red` porque, al
transcribirla, se unieron las palabras que el PDF corta con guion a fin de línea (p. ej.
"actuaciones" en vez de "actua- ciones", "Justicia" en vez de "Justi- cia") y se corrigió una
errata de OCR ("cuyos" en vez de "Ccuyos"). Se volvió a extraer el texto literal del JSON del
corpus y se reescribió la cita preservando los guiones de corte de línea (que al plegarse quedan
como "guion + espacio", igual que en la cita ya publicada de esta misma declaración, que trae
"Repre- sentantes") y la errata de OCR tal cual aparece. Con eso, `pnpm validar --red` marca las
8 citas del lote como exactas (1.00).
