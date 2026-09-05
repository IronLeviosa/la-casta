# Brief — discrepancias de prensa detectadas en la corrida de vetos de Vázquez

Origen: el crítico de la corrida `2026-09-05-vazquez-vetos`, al releer las fuentes de ese lote
contra los documentos originales, encontró dos notas cuyo contenido no coincide con el documento
primario. Las escribió en `discrepancias.yaml` de esa corrida, pero esa colección no estaba
registrada en el flujo de promoción, así que el hallazgo nunca llegó al sitio. Esta corrida lo
promueve.

## Encargo al editor (texto literal)

Lote chico: `inbox/prensa/discrepancias/2026-09-05/discrepancias.yaml`, dos registros de la
colección `discrepancias` (divergencias entre lo que publicó un medio y lo que dice la fuente
primaria). Los escribió el crítico de la corrida `2026-09-05-vazquez-vetos` y les faltan campos
para pasar el esquema.

Brazo BARATO del experimento: corrés con Sonnet. Es instrucción del encargo.

`pnpm validar --inbox inbox/prensa/discrepancias/2026-09-05` da hoy 4 errores:
- `publicado.retrieved_at` ausente en los dos registros.
- `evidencia` ausente en los dos registros.

Tu trabajo:
1. Leé `src/schemas/discrepancia.ts` entero: es el contrato, y su docblock trae las tres reglas de
   Regla 0 que se aplican a esta colección. Respetalas.
2. Abrí con `pnpm fuente <url>` TODAS las URLs que ya están en el archivo: la nota publicada y las
   fuentes primarias de cada registro. No completes ningún campo con una URL que no hayas abierto
   en esta sesión.
3. Completá `publicado.retrieved_at` con la fecha real en que la abriste.
4. Completá `evidencia` de cada registro. El nivel es `textual` si la discrepancia se apoya en un
   `documento_oficial`, `diario_de_sesiones` o `video`, que es lo esperable acá: la colección existe
   justamente para confrontar contra fuente primaria. Las fuentes de `evidencia` son las que prueban
   la discrepancia.
5. Verificá que las citas que ya están (`publicado.cita` y `fuente_primaria.cita`) sean copia
   LITERAL y CONTIGUA de lo que dice cada documento. Abrilas y comparalas carácter por carácter. Si
   alguna está cosida de dos fragmentos separados, o no aparece así en el original, corregila o
   eliminá el registro y explicá por qué. Esto ya pasó en otros lotes.
6. Revisá que `analisis` describa qué publicó el medio y qué dice el documento, sin atribuir
   intención. No se afirma que el medio mintió ni que se confundió: se dice qué dice cada uno.
7. Completá `detectada_en` si falta.
8. NO asignes `revision.tier` alto de arriba: si una discrepancia no se puede confrontar contra
   fuente primaria abierta por vos, va a `probable` con `revision.que_falta`, o se elimina.
9. Escribí `razones.md` en la carpeta del inbox con qué completaste y qué verificaste.

Regla 0 acá es crítica: el umbral es el mismo para cualquier medio, sin importar su alineamiento ni
si el error favorece o perjudica al político cubierto. Si al abrir las fuentes ves que el error no
es del medio sino de nuestra lectura, decilo y sacá el registro.

Terminá corriendo `pnpm validar --inbox inbox/prensa/discrepancias/2026-09-05` hasta que dé 0
errores.

No corras `pnpm promover` ni commitees: lo hago yo. No escribas `procedencia`.

Devolveme: qué medios quedan registrados, qué tipo de discrepancia, en qué tier, y si sacaste
alguno.
