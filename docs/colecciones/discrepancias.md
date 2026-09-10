# Discrepancias (`content/discrepancias/`)

Distancia comprobable entre lo que publicó un medio y lo que dice la fuente primaria del mismo hecho. El sitio mide el sesgo de los medios por tono y por propiedad; esto agrega la dimensión más comprobable: si lo publicado coincide con el documento. Las escribe el crítico, en `discrepancias.yaml` del lote, cuando al releer una fuente encuentra la diferencia; es un hallazgo propio, además de una objeción al registro.

## Tres reglas, y valen más que el resto del esquema

- **Solo contra fuente primaria.** Dos medios que se contradicen entre sí no son una discrepancia, son un desacuerdo, y va a la crítica como tal. Hace falta el documento oficial, el diario de sesiones o el video que decide; sin eso va a `hipotesis/`.
- **Sin verbos de intención.** No se sabe si el medio se equivocó, copió mal o mintió, y el esquema no tiene campo para eso a propósito. Se registra qué publicó y qué dice el original.
- **El mismo umbral para todos.** Un error del medio que cubre favorablemente a alguien pesa igual que el del que lo cubre en contra. La cuenta se normaliza por veces citado: contar errores sin contar citas castiga al medio que más se usa. Un registro de discrepancias que solo contiene medios de un lado es un problema de Regla 0, no un hallazgo.

## Campos

`medio`, `fecha`, `tipo` (`dato_erroneo | atribucion_incorrecta | contexto_omitido | titular_no_respaldado | cita_alterada`), `tema`, `politico`, `publicado` (url, título, cita literal y contigua de lo que dice el medio), `fuente_primaria` (cita literal del documento y sus fuentes, que incluyen un `documento_oficial`, `diario_de_sesiones` o `video`), `analisis`, `detectada_en` (id de la corrida), `evidencia`. Ejemplo en `docs/ejemplos/discrepancia.yaml`.
