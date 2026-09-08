# Razones — corrida 2026-09-08-empresas-antel-serie-historica

Editor: Sonnet (`claude-sonnet-5`), por instrucción del mantenedor (2026-09-07): ningún subagente
corre en Fable sin su permiso, y Opus queda para el crítico. La corrida ya llegó a esta instancia
con las cinco objeciones `bloquea` de `critica.md` resueltas por el investigador en su segunda
vuelta (ver `notas.md` del lote); lo que sigue es el trabajo de criterio y presentación que
`critica.md` dejó para el editor.

## Decisiones no triviales

**Base de comparación de la serie en pesos (punto 1 del encargo; objeción "finanzas[1997..2012] ·
la columna en pesos, como serie", `bloquea`).** De las tres opciones que dio el crítico, descarté
la (b) —reexpresar toda la serie a una única base— porque el esquema exige que `pesos` sea "tal
como figura en el documento" (`src/schemas/empresa.ts`, campo `Monto.pesos`): calcular una
reexpresión propia violaría esa regla y además el sitio no calcula cifras, las cita. Entre (a)
graficar en dólares y cortar la línea de pesos en 2012, y (c) mantener pesos por año sin unir los
puntos antes de 2012, elegí una combinación que no depende de tocar el componente de gráfico (que
no es mi rol tocar): mantuve `pesos` año por año tal como está documentado, con la moneda de cierre
declarada en la `nota` de cada año (eso ya lo había resuelto el investigador), y declaré en
`resumen` —una sola vez, no repetido por año— que la comparación entre años de toda la serie se
lee en dólares porque no cambian con la reexpresión, con el mínimo y el máximo de todo el período
en esa moneda. Dos años (2001, 2002) quedan sin cifra en dólares; lo digo explícitamente en
`resumen` en vez de dejarlo implícito.

**`resumen` reescrito para 1997-2024 (punto 2 del encargo; objeción "resumen (campo publicado, no
tocado por el lote)", `corregir`, y objeción al brief n.° 2).** El brief pedía no tocar `resumen`,
pero el crítico señaló bien que eso deja la ficha diciendo dos cosas falsas de sí misma (que releva
2015-2024 y que usa siempre el balance propio). Reescribí el campo entero: resultado positivo en
los 28 años con dato, sin datos antes de 1997 con el detalle de qué se buscó, la convención de
moneda (ver arriba), la crisis de 2002 y el pago con títulos públicos (con remisión al hito),
transferencias con el quiebre cambiario de 2000-2002, impuestos pagados solo en cuatro años del
tramo viejo (con la razón), deuda financiera chica en toda la serie, capitalizaciones del Estado
(ninguna, 1997-2024), segmentos (ingreso no resultado, cruce entre telefonía agrupada y móvil entre
2007 y 2012, el hueco de 2000-2001), y fuentes/auditoría (qué años dependen del resumen no
auditado). El párrafo de monopolio queda igual: no lo tocó esta corrida.

**Dos hitos nuevos (punto 3 del encargo; objeción "hitos[] — no se tocó, y hay dos hitos con fuente
esperando", `corregir`).** Sumé el pago a Rentas Generales con títulos públicos de diciembre de
2002 y el fin de la reexpresión monetaria desde 2012. Las dos citas las leí yo mismo con
`pnpm fuente` en esta sesión (Nota 17.2 de `est_notas.pdf` vía Wayback, y la Nota 2.u del balance de
2014), no copié el `cita_de_contexto` del crítico. El tercer hito que proponía `notas.md`
(transferencia nominal fija de $ 1.867.704 miles, 2010-2014) no tiene norma que lo sostenga —el
propio investigador lo dice— así que no entra a `hitos[]`; lo dejo mencionado en `resumen` como
observación, sin atribuirle mecanismo.

**`concepto` y `nota` recortados a una oración (punto 4 del encargo; objeciones
"finanzas[*].concepto — párrafos donde va una frase" y la repetición de la salvedad de auditoría en
seis años, ambas `corregir`).** Detecté con un script 26 campos `concepto` con más de una oración
(no los 236 caracteres de los segmentos, que son una sola oración compuesta y ya seguían el modelo
que el crítico elogió) y los reescribí uno por uno, verificando después con `--red` que las citas
que dependían de esos años no se rompieran. Además saqué de las `nota` de 1997, 1998, 2003, 2004,
2005 y 2006 la misma frase repetida ("ANTEL reexpresaba... no se cita el dictamen...") y la puse una
sola vez en `resumen`, dejando en cada `nota` solo el dato específico de ese año (qué falta, qué
documento se usó). Es exactamente lo que pide "las convenciones dichas una vez donde el lector las
necesita".

**Segmentos 2000-2001 (objeción "notas.md § anios_sin_segmentos", `corregir`, y encargo explícito
del orquestador).** No mapeé los ingresos por servicio de las notas de 2001/2000 a los nombres de
división que usa el resto de la ficha: el propio crítico dijo que no está claro que sean
equivalentes, y forzar la correspondencia sería inventar un dato. En cambio agregué una `nota` en
finanzas[2000] y finanzas[2001] diciendo que existe una desagregación por servicio, distinta de "no
existe información", que es lo que decía `notas.md`.

**Dictamen del auditor citado una vez (objeción "fuentes del tramo 1997-1998 y 2003-2006 — resumen
no auditado, sin decirlo", `corregir`).** Los tres dictámenes del tramo 2007-2009 que sugería el
crítico son PDF escaneados sin capa de texto (esta máquina no tiene `pdftoppm`/poppler para OCR, ver
`notas.md` § `verificacion_manual`). Encontré uno legible en Wayback, el dictamen del balance de
2001/2000 (`estados_contables_nuevos/dictamen_auditores.htm`, firmado 12/04/2002), y lo agregué a
`fuentes` (nivel ficha) con su cita, y lo menciono en `resumen`. No es de la misma década que los
años sin auditar (1997-1998, 2003-2006), pero sí prueba que el resto de la serie vieja tiene
dictamen y da al lector un ejemplo concreto de lo que "auditado" significa acá.

**Objeción "finanzas[2001,2002,2009] — sin cifra en dólares" (`corregir`).** Para 2009 ya estaba
resuelto por el investigador (tipo de cambio implícito de la Nota 5 del balance de 2010). Para 2001
y 2002 no perseguí la serie de cotizaciones del BCU que sugería el crítico como tercera opción: es
una fuente nueva que no se había leído en esta corrida, y agregar un tipo de cambio de una fuente
distinta a la que ya declara la ficha (que usa siempre el tipo de cambio que trae el propio balance
o resumen de ANTEL) habría introducido un criterio no uniforme sin poder revisarlo con el mismo
cuidado que el resto. Queda como hueco documentado en `resumen` y en `notas_internas`, para una
próxima vuelta del investigador o el resolvedor.

**Fuentes rotas al validar con `--red` (no viene de `critica.md`, la encontré yo).** Nueve citas de
2002, 2008, 2009, 2010, 2011 y 2012 (todas del crudo original, ninguna tocada por mí antes de esta
revisión) no eran un tramo contiguo del texto de su fuente: el investigador había reordenado
"etiqueta + valor de un año + valor del otro año" para que se leyera como una fila de tabla, pero
los PDF de ANTEL de esos años extraen todas las etiquetas juntas, después toda la columna de un año
y después la del otro, así que esa reconstrucción no es un tramo real del documento. Releí cada una
de las nueve con `pnpm fuente --buscar` en esta sesión y las reemplacé por el tramo contiguo real
(en la mayoría de los casos, la corrida de números sin etiqueta, que es exactamente el mismo
problema que el crítico ya había señalado como aceptable para 1999/2000 — "la asignación se verifica
sola" — y que no cambia ningún monto, solo la cita). Dos más (2011 y 2012, resultado del ejercicio)
tenían la etiqueta correcta salvo que decían "Utilidad" en vez de "Resultado" y un espacio de más
dentro de un paréntesis; las corregí letra por letra contra la fuente. Ninguna de las nueve cambió
el número que ya estaba en `pesos`/`usd`; verifiqué cada una contra el documento antes de escribir
la cita nueva. `pnpm validar --inbox … --red` corre limpio: 0 errores en las cinco etapas, 185/185
citas exactas.

## Tier

`publicado`, único registro del lote. Las cinco objeciones `bloquea` de `critica.md` están resueltas
(por el investigador en su segunda vuelta); de las trece `corregir`, quedan resueltas todas menos el
tipo de cambio de 2001-2002 (documentado arriba) y la agrupación de fuentes por documento en la
página (es una decisión de plantilla, no de este YAML: lo dejo anotado en `notas_internas` para que
quien toque la plantilla lo sepa). No hay giros, promesas, chequeos ni casos en este lote — es una
sola ficha de empresa.

## Pendiente para 1974-1996

El crítico confirmó con sus propias búsquedas que no hay balance, memoria ni resumen de ANTEL
anterior a 2000 en ningún archivo consultado. Lo único previsible que queda —el dictamen del
Tribunal de Cuentas sobre esos ejercicios, que por el artículo 211 de la Constitución va a la
Asamblea General y podría estar en `parlamento.gub.uy` o el Diario Oficial— no lo perseguí: es
trabajo de investigación (buscar y leer un documento nuevo), no una decisión de criterio, y el
crítico mismo lo calificó de "no bloqueante, nombrarlo alcanza". Queda para una próxima corrida.

## Cambios de forma

- `hitos[5].detalle` (el nuevo hito de 2002) medía 401 caracteres contra el máximo de 400 del
  esquema; lo acorté sin cambiar ningún dato.
- Erratas de tipeo nuevas: ninguna — todo el texto que agregué es propio, escrito en esta sesión.

## Texto propuesto para la corrección pública

Esta corrida extiende una ficha ya publicada (`content/empresas/antel.yaml`, 2015-2024) a 1997-2024.
Es una corrección de tipo `contexto_omitido`: la ficha publicada no decía nada falso sobre los años
que le faltaban, pero un lector que la viera antes de esta corrida podía pensar que la serie de
ANTEL solo existe desde 2015 o que el sitio no la cargó más atrás por decisión editorial, cuando en
realidad los documentos existían y no se habían leído. Propongo:

```yaml
id: 2026-09-antel-serie-1997-2024
tipo: contexto_omitido
fecha: 2026-09-08
motivo: >-
  La ficha de ANTEL solo relevaba 2015-2024. Existen documentos públicos (estados contables
  auditados y resúmenes oficiales de ANTEL, en el sitio vivo y en Wayback Machine) para 1997-2014,
  con la sola excepción de 1974-1996, para los que no se encontró ningún balance ni resumen
  público. Esta corrección carga esos 18 años con el mismo detalle y el mismo rigor que 2015-2024,
  reescribe `resumen` para que describa la serie completa y agrega dos hitos documentados.
afecta:
  - content/empresas/antel.yaml
desenlace: aceptada
```

## Simetría entre empresas

El brief y `critica.md` señalan, con razón, que hoy ANTEL es la única ficha de `content/empresas/`
con serie larga: si queda así, comparar empresas por cobertura queda sesgado por qué ficha se corrió
primero, no por qué documentos existen. Dejo esto anotado para que la misma corrida (serie histórica
completa, mismo detalle) se programe para ANCAP, UTE y OSE.
