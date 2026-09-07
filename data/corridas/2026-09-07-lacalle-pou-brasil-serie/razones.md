# Razones — corrida 2026-09-07-lacalle-pou-brasil-serie (edición)

## Modelo

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor (2026-09-07), como está fijado en
`.claude/agents/editor.md`. La tabla de modelos de `CLAUDE.md` declara Fable para este rol; el
experimento en curso (`EXPERIMENTO.md`) corre esta corrida en Sonnet a propósito, y eso queda
registrado acá y en `procedencia.modelo` de cada registro cuando `pnpm promover` lo escriba. No es un
error de proceso.

## Cambios sustantivos sobre `chequeos.yaml`

1. **`revision.tier: probable`** (nuevo; el campo no existía en la copia). Ocho de las 24 fuentes de
   `dato_real` llevan `verificacion: manual` (los xlsx/csv/zip/API que `pnpm fuente` no puede leer
   como texto), y por regla del sitio eso exige la firma del mantenedor antes de `publicado`. Está
   detallado en `revision.que_falta`. Objeción de critica.md: "las ocho `verificacion: manual`"
   (aviso, sin objetar la clasificación, solo la consecuencia).
2. **`calificacion`: `discutible` → `falso`.** Objeción bloqueante de critica.md ("la serie contesta
   'por primera vez' y el registro sigue diciendo que no se contestó"): el fundamento anterior de
   discutible ya no es sostenible por dos motivos que la propia crítica marcó — la reconstrucción que
   supuestamente faltaba es el gráfico que este mismo lote agrega, y la exigencia de que el documento
   oficial "enuncie la conclusión" no es una regla del sitio (ya corregida en el commit 0f913e9). El
   elemento distintivo de la frase, "por primera vez desde 2001 o 2002", es falso bajo cualquier
   combustible o convención de cálculo probada (28 meses de nafta más barata entre 2007 y 2011, 13 de
   gasoil desde 2002, los dos combustibles a la vez en abril-mayo de 2009). El criterio y su
   simetría hacia cualquier otro presidente quedan escritos en `revision.notas_internas`.
3. **`titulo` reescrito**: "Combustibles más baratos que Brasil «por primera vez desde 2001»: no fue
   la primera vez". El título anterior ("cierto para el gasoil, falso para la nafta") describía solo
   la comparación puntual de la semana, no la parte de la frase que termina decidiendo la
   calificación.
4. **`analisis` reescrito entero.** Misma objeción bloqueante que en (2). Se sacaron las dos
   oraciones finales que la crítica marcó como contradichas por el propio gráfico del lote ("por
   primera vez queda sin verificar…"; "el documento oficial da los insumos, no la conclusión…") y se
   agregó: el resultado de la serie mensual completa, la distinción de convención para el gasoil (50S
   por posición de mercado vs. 10S por especificación de azufre, con qué cambia cada una) y la nota de
   robustez que pide "Objeciones al lote → Robustez de los cruces" de critica.md (apoyarse en
   2009-2010, no en 2007, por margen y por no depender de la convención cambiaria).
5. **`dato_real.valor` ampliado** con dos párrafos nuevos (recuento mensual de nafta y de gasoil,
   1979-2022... 2002-2022). Objeción bloqueante de critica.md: "`dato_real.valor` sigue describiendo
   solo la semana del 27/03/2022, mientras el gráfico muestra 84 puntos que no están en ningún lado
   del texto".
6. **`content/medios/ursea.yaml` creado.** Resuelve el único error de `referencias` (`medio: gub.uy`
   no existe). Modelo: `content/medios/presidencia.yaml`, con estructura de organismo estatal como
   `impo.yaml`/`miem.yaml`/`ancap.yaml`. `propiedad` y `alineamiento` con cita literal leída con
   `pnpm fuente` en esta sesión (páginas "Cometidos" y "Precios de Paridad de Importación" de URSEA,
   no releídas del crudo del investigador). No se afirma que URSEA sea "servicio descentralizado"
   pese a que `notas.md` lo menciona: no encontré una cita propia que lo sostenga literalmente, así
   que la descripción se ciñe a lo que las dos fuentes leídas dicen (ley de creación 17.598/2002,
   cometidos actualizados por la Ley 19.889/2020 art. 239, cálculo del PPI).

## `cobertura.yaml` (nuevo)

Copiadas las dos coberturas neutrales de la sección "Cobertura" de `critica.md` (ya leídas y
clasificadas por el crítico con `pnpm fuente`; el editor no las releyó). Se agregó `_slug`,
`_investigacion: {agente: critico, modelo: claude-opus-5[1m]}` (atribución a quien hizo la lectura y
la clasificación de tono) y `revision: {tier: publicado}`. IDs completos que asignará `pnpm promover`:
- `lacalle-pou/2023-07-31-nafta-super-primer-aumento-en-mas-de-un-ano` (Ámbito)
- `lacalle-pou/2023-08-01-precio-combustibles-aumento-2019-2023` (Caras y Caretas)

## Verificado sin cambios: `grafico` y `graficos[0]`

Ya traían, de la segunda pasada del investigador, las dos advertencias pedidas por el encargo (Súper
95 vs. Gasolina C comum con etanol; Gas Oil 50S sin equivalente exacto en la serie brasileña), la
fuente de cada serie y la unidad; `fragmento` no fue tocado. Crucé los números de ambos gráficos
contra `notas.md ## hallazgos_para_el_editor` y no encontré inconsistencias. No se modificaron.

## Objeciones de critica.md ya resueltas por la segunda pasada del investigador (el editor no las tocó)

Decretos 245/021 y 289/021 para 2021 (bloquea); método declarado = método ejecutado, promedio de
razones mensuales (corregir); ventanas de Brasil 2020 (corregir); puntos obsevados/sostenidos
marcados con `Punto.nota` (corregir); segundo gráfico con el emparejamiento por azufre, resolviendo la
objeción de asimetría (corregir); cita del Decreto 386/021 con la tabla completa (corregir); las
cuatro fuentes en prosa subidas a `dato_real.fuentes` (corregir); fechas de publicación en vez de
vigencia o descarga (corregir); remisión a "series.yaml" corregida (corregir); sección "ATENCION"
obsoleta de `notas.md` reemplazada (aviso). Verificado con `pnpm validar --inbox --red`: 0 errores.

## Objeciones que quedan documentadas, no resueltas (ninguna bloqueante)

- El congelamiento del precio uruguayo entre junio de 2019 y diciembre de 2020 sigue apoyado en parte
  en el índice de UNVENU (asociación privada) en vez de, o adicionalmente a, la página "Decretos
  Precios" de ANCAP que propuso la crítica (esa página tampoco es un índice completo). `notas.md` lo
  deja explícitamente para "quien retome este chequeo"; quedó repetido en `revision.notas_internas`
  del registro para que no se pierda al promoverlo.
- El año 2001 de la afirmación original ("2001 o 2002") no se pudo probar por falta de serie oficial
  uruguaya de ese año. Ya está en `grafico.nota`; se repitió en `revision.notas_internas`.

## Autochequeo de simetría

El criterio aplicado —un "por primera vez en N años" es falso si existe evidencia documentada de que
ya había pasado dentro de esos N años, más allá de que la comparación puntual del día sea mixta— es el
mismo que aplicaría a un chequeo equivalente de Vázquez, Mujica, Orsi o cualquier otro presidente; no
depende de qué se está comparando ni de quién lo dijo. Quedó escrito en `revision.notas_internas` del
registro, tal como pide el brief del editor, para que se use igual la próxima vez que aparezca un "por
primera vez" en cualquier chequeo.

## Cambios de forma

Ninguno. El único error de forma que señalaba `critica.md` (la nota de 2009 en `_series.yaml` decía
"0,4 dólares por litro" en lugar de la magnitud real) ya venía corregido por la segunda pasada del
investigador (queda en "unos 6,3 centavos de dólar por litro, 4,9%", consistente con los valores
finales 1,2791/1,2163). No encontré otras erratas de forma al revisar el lote.

## Validación

`pnpm validar --inbox inbox/lacalle-pou/economia/combustibles/2026-09-07-brasil --red`: esquema 0
errores (360 registros), referencias 0 errores, tiers 0 errores, fuentes 0 errores (24 URLs
verificadas), citas 0 errores (26 citas entre `dato_real` y `evidencia`: 18 verificadas
automáticamente contra el texto de su fuente, las 18 exactas; 8 con `verificacion: manual`, excluidas
del diff por diseño del validador). Los 9 avisos de "cobertura asimétrica" son preexistentes a nivel
de todo `content/` y no corresponden a este lote.
