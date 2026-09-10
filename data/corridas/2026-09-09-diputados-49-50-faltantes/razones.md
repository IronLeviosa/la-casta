= Razones — edición del lote `inbox/diputados/faltantes-b/`

Corrida: `2026-09-09-diputados-49-50-faltantes`. Editor: Sonnet (`claude-sonnet-5`), regla 14.
Punto de partida: las 90 fichas ya corregidas por el corrector Sonnet (ver `notas.md` del lote),
no el crudo original de `critica-faltantes`. Lo que sigue son mis cambios sobre esa versión
corregida.

## Cambios de criterio (no triviales)

1. **Se retiró `cobertura` de las 90 fichas.** Regla del mantenedor fijada el 2026-09-09: una ficha
   de identidad sin declaraciones no lleva `cobertura` (la página lo dice sola; las 91 fichas ya
   publicadas de esta misma corrida no la llevan). El corrector había escrito `cobertura.texto` con
   el método y, para 69 personas, la advertencia de que el partido no tiene cita propia. Lo único de
   ese texto que importaba para el registro (la advertencia de partido sin cita, y en los casos de
   convocatorias truncadas, el conteo) pasó a `revision.notas_internas`; el resto (boilerplate de
   método, "no se buscaron declaraciones...") no se conserva porque ya está en este archivo y en
   `notas.md`.

2. **Tier `probable` para las 54 fichas con convocatorias truncadas**, con
   `notas_internas: "Cargadas N de M convocatorias; la lista completa entra por corrección cuando se
   fusione con el padrón regenerado de suplentes."` — instrucción explícita de la tarea, aplicada
   igual a las 54 sin excepción de partido (14 Frente Amplio... verificado que la regla no discrimina
   por partido, ver conteo en el informe).

3. **Tier `probable` para las 26 fichas "completas" (todas sus convocatorias cargadas) cuyo partido no
   tiene cita** en ninguna convocatoria de `actuacion-legislador` (campo del lema vacío en las 83
   filas revisadas por el corrector). Esto extiende O8 de la crítica ("severidad: bloquea... es el
   campo con el que el sitio agrupa a la gente") a estas 26 fichas puntuales: el corrector dejó el
   valor previo sin fuente y lo marcó como pendiente en `cobertura`, que es exactamente la definición
   de "falta una fuente" de la regla de tier. Sin esta regla, 26 fichas con datos de partido no
   verificados habrían quedado en `publicado` solo por tener las convocatorias completas. Precedente:
   `content/politicos/lust-eduardo.yaml` (corrida `2026-09-09-diputados-49-50-revision`) ya usa
   exactamente este criterio (partido sin cita → `probable` con `notas_internas` explicando el hueco).
   Solo 3 fichas "completas" tenían partido confirmado por cita (`nunez-soler-nancy`,
   `araujo-fernanda`, `vietro-ana-paula`): esas + los 7 titulares/Núñez son las 10 que van a
   `publicado`.

4. **`mazzarovich-gabriel` y `diaz-marrero-natalia` → `probable`** con `notas_internas` que nombra el
   posible duplicado con `suplentes:mazzarovich-gabriel-jorge` y `suplentes:diaz-natalia`
   respectivamente (O16 de la crítica), por instrucción directa de la tarea. Las dos ya caían en
   `probable` por la regla 2 (ambas tienen convocatorias truncadas) y por la regla 3 (partido sin
   cita); el aviso de duplicado se agregó además, sin cambiar el tier resultante. Para
   `diaz-marrero-natalia` se agregó también, por instrucción directa, que su ficha oficial (id 13695)
   la muestra como titular en ejercicio desde el 01/03/2026 y esta ficha todavía la registra como
   suplente de Ana María Olivera Pessano sin convocatoria cerrada — no se resolvió el cruce, solo se
   dejó escrito para quien fusione los dos lotes.

5. **`silva-guillermo` — mismo aviso de duplicado, por consistencia con el punto 4.** La crítica (O16)
   señaló tres cruces posibles con `suplentes/`, no dos: `silva-guillermo` ↔
   `suplentes:silva-guillermo-ricardo` es el tercero. La tarea solo nombró a los otros dos, pero
   dejar éste sin ninguna nota habría sido aplicar un umbral distinto a un caso con la misma evidencia
   (Regla 0 / "mismo umbral para todos los registros"). No cambia el tier (ya era `probable` por
   convocatorias truncadas y partido sin cita); solo se agregó la frase de aviso en
   `notas_internas`.

6. **Se restituyó `estado_actual.situacion: fallecido` en `fros-alvarez-virginia`**, que el corrector
   había reemplazado por `fuera_de_cargo` / `fin_de_mandato: 2025-02-14` al reconstruir la ficha
   convocatoria por convocatoria (su único mandato termina el 19/02/2023 según `actuacion-legislador`,
   dos años antes del cierre de la XLIX). Esto es justamente la objeción O14 de la crítica ("Fros
   sostiene un `salida.tipo: fallecimiento` con una cita ... que no menciona la muerte") y O9
   ("un suplente que dejó de ser convocado no está fuera de cargo... fin_de_mandato sigue siendo
   incorrecto" — acá el error era peor: fin_de_mandato aplicado a alguien que había muerto). Releí la
   fuente con `pnpm fuente` en esta sesión
   (https://ladiaria.com.uy/politica/articulo/2023/2/fallecio-virginia-fros-legisladora-del-partido-nacional/):
   el artículo, fechado el 20/02/2023, dice "La diputada del Partido Nacional por el departamento de
   Rivera, Virginia Fros, falleció este domingo a causa de un cáncer" — el domingo anterior al lunes
   20/02/2023 es el 19/02/2023, que coincide exactamente con el cierre de su convocatoria en la fuente
   oficial. Se cargó `estado_actual.situacion: fallecido`, `salida: {tipo: fallecimiento, fecha:
   2023-02-19}` con esa cita y esa fuente (`la-diaria`, `tipo: nota`, `fecha: 2023-02-20`). La ficha
   sigue en `probable` porque el partido tampoco tiene cita propia (regla 3).

## Objeciones de la crítica que quedan sin resolver (y por qué)

- **O1 (naming/grafía canónica) para `gallo-luis-enrique`, `barboza-molina-lucia` y
  `da-silva-francisco`.** La crítica pedía renombrar estos slugs a la grafía de la fuente oficial
  (`gallo-cantera-luis`, `barboza-molina-lucia` ya está bien, `da-silva-barcelo-francisco`) al fusionar
  con su duplicado de otro lote de `critica-faltantes`. Esos duplicados no están en `faltantes-b`
  (el lote solo tomó las fichas de `faltantes-4`), así que no hay nada que fusionar acá; queda como
  tarea de quien promueva `faltantes-b` junto con los demás lotes de la corrida (si todavía existen).
  No cambia el tier de estas tres fichas en este lote.
- **O6 (`molinelli-ricardo`), O2 (`garcia-de-barros-lilian`), O5 (`melazzi-maria-rosa`,
  `charbonnier-aldo`), O11 (`solana-gonzalez-esther`, `mirza-perpignani-adel`), O21
  (`monzillo-ines`), O22 (`casaretto-federico`, `corbo-milton`, `guerrero-gustavo`...)**: ninguna de
  estas fichas está en `faltantes-b`; no aplican a este lote.

## Cambios de forma

- Ninguno sobre el contenido citado: no reescribí ninguna cita. El único ajuste puramente mecánico fue
  el de mi propio proceso de edición (no del crudo): al insertar los campos nuevos de
  `fros-alvarez-virginia` con un script, las fechas `2023-02-19`, `2023-02-20` y `2026-09-09` salieron
  entrecomilladas por el serializador; se les quitaron las comillas a mano para que queden con el
  mismo estilo que el resto del archivo (fecha sin comillas). No cambia el valor, solo la forma en que
  quedó escrito en el YAML.
