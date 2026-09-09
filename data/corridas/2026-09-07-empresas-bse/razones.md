# Razones — corrida 2026-09-07-empresas-bse (edición)

Modelo: Sonnet (`claude-sonnet-5`), por la regla de modelos del mantenedor (2026-09-07): el editor
no corre en Fable ni en Opus. El crudo que edito es la **segunda vuelta** del investigador
(`inbox/empresas/bse/2026-09-07/empresas.yaml`), que ya resuelve casi todas las objeciones de
`critica.md` (2 `bloquea` + 18 `corregir` + 7 `aviso`; ver `notas.md` § `vuelta 2` con la tabla
objeción por objeción). Verifiqué esa tabla campo por campo contra el YAML antes de tocar nada.
Lo que sigue son los cambios que hice yo sobre ese crudo, no una repetición de lo que ya hizo el
investigador.

## Decisión editorial: `impuestos_pagados`

El investigador decidió no cargarlo (nota en cada año: "impuestos_pagados queda sin cargar... a
propósito"), porque el único renglón de caja que encontró ("Impuesto a la renta pagado", en el
flujo de efectivo) es un residuo neto de anticipos de IRAE de un solo año comparativo, no el total
de tributos que pide `docs/diccionario-empresas.md`. Coincido con ese diagnóstico pero no con la
conclusión de dejarlo vacío: el diccionario pide "total de tributos... con qué renglones y con qué
criterio" y hay un total parcial, real y citable, que sí se puede cargar.

- **Qué cargué**: la suma de dos renglones que la Nota 11 a los Estados Contables ("Otros gastos de
  explotación") desagrega todos los años, "Impuestos, tasas y contribuciones" e "Impuesto al
  patrimonio", sobre base **devengado** (no caja). Lo hice para los once años (2015-2025), cada uno
  con cita propia leída en esta sesión con `pnpm fuente`.
- **Qué excluí a propósito, y por qué**: el IRAE. Figura aparte en el resultado del ejercicio y en
  2021, 2023 y 2024 fue un ingreso (crédito fiscal), no un gasto — sumarlo habría *reducido* el
  total de "impuestos pagados" justo en los años de mayor resultado, el efecto contrario al que el
  campo tiene que mostrarle al dueño de la empresa. Esto separa a esta ficha de ANCAP (cuyo "Total
  impuestos" sí incluye el IRIC/IRAE porque es un renglón ya armado por la propia ANCAP, siempre
  positivo en esos años); lo dejo escrito en `revision.notas_internas` y en el `resumen` para que
  no se lea como inconsistencia entre fichas sin explicación.
- **Verificación de la extracción**: para 2015, 2016, 2019, 2020, 2023, 2024 y 2025 el PDF
  conserva el renglón (etiqueta + valor) en la misma línea, cita directa. Para 2017, 2018, 2021 y
  2022 la extracción de texto separa la columna de etiquetas de la columna de valores; en esos
  cuatro casos emparejé por posición ordinal y **verifiqué la suma contra el total que la propia
  nota declara** antes de publicar nada (diccionario, regla transversal 5: "un dígito que depende
  de una corrección se publica solo si la aritmética interna lo determina"). En 2021 esa
  verificación además descubrió un signo negativo espurio de extracción en un renglón que no uso
  ("Publicidad, propaganda y publicaciones"): con ese único signo corregido, la suma de los 17
  renglones coincide con el total al peso: confirma que el resto de la columna, incluidos los dos
  renglones que uso, está bien pareado.
- **2016-2020**: no estaban en el crudo (el investigador se ciñó al rango del brief más 2021-2025);
  fetché las cinco Notas 11 correspondientes yo mismo para completar la serie, con el mismo
  criterio.

## `resumen` y `revision`

Faltaban ambos (el investigador no los escribe, es tarea del editor). Escribí `resumen` en
párrafos: qué es el BSE, la serie de resultados 2015-2025 en dólares, el segmento que pierde todos
los años en que está desagregado (Seguro de Renta Vitalicia, con el quiebre de rótulos de 2022
declarado), las transferencias a Rentas Generales (2024 con monto, 2023 sin monto, el resto sin
documento), el criterio de `impuestos_pagados`, los dos lados del monopolio de accidentes de
trabajo, la cuota de mercado de la propia página de Transparencia con su salvedad, y la cobertura
2015-2025 con 2005-2014 declarado como pendiente (mismo criterio que ANCAP/UTE/ANTEL, objeción
O-L3). `revision.tier: publicado`: no queda ningún `bloquea` sin resolver, ningún chequeo o
argumento con un solo grupo de medios, y todo lo financiero es `documento_oficial`. Dejé en
`notas_internas` lo que sigue pendiente (2005-2014, transferencias de 2023 sin monto, el criterio
de `impuestos_pagados`, A-5 sin argumentos de renta vitalicia) para que quien retome la ficha no
tenga que releer todo el hilo.

## Medios: `prensamundo-com` no entra a `content/`

El brief de esta tarea pedía evaluar si `prensamundo-com` es "de verdad un medio con propiedad
conocida". No lo es: su propia ficha (`medios/prensamundo-com.yaml` del crudo) no citaba nada sobre
quién es dueño de PrensaMundo.com, solo repetía la página que usa como fuente para hablar de
Crónicas (un directorio de medios que él mismo declara no verificar de forma independiente). El
investigador ya había buscado por otras vías (WebSearch para propietario, historia, Wikipedia) sin
resultado, según `consultas.jsonl`. Con eso: borré `medios/prensamundo-com.yaml` del lote y
reescribí `medios/cronicas.yaml` para que `propiedad` y `alineamiento` se sostengan con una
autocita de una nota propia de Crónicas (mismo patrón que `content/medios/eltelegrafo.yaml` e
`icndiario.yaml`: cuando no hay fuente sobre la propiedad, se cita cualquier nota propia publicada
bajo ese nombre, para no in ventar ni aproximar, y se dice explícitamente qué se buscó y no se
encontró). Se pierde el dato de fundación (13/7/1981) y director (Jorge Estellano) de Crónicas
porque la única fuente que los daba era, precisamente, el medio sin propiedad documentada.

## Correcciones de forma

- `medios/bse.yaml`: el campo `propiedad.descripcion` tenía un escalar YAML plano con un `: ` (dos
  puntos y espacio) en medio del texto ("son el mismo publicador: el primero..."), que el parser
  interpreta como un mapeo anidado inválido (`pnpm validar` tiraba "YAML inválido: Nested mappings
  are not allowed"). Lo pasé a bloque plegado (`>-`) y reformulé esa oración sin dos puntos.
- `creacion.fuentes[1].cita` (Nota 1.1, BCU 2015): la cita usaba "N*" en las cinco leyes; el PDF
  extrae el signo "N°" como "”" (comilla curva) en la primera y la cuarta ley, y como "*" en las
  otras tres — un artefacto de esa extracción puntual, verificado con `--red` (similitud 0.99, no
  0.9x: bastaba un carácter). Corregido carácter por carácter contra el texto que devolvió
  `pnpm fuente` en esta sesión.
- `monopolio.argumentos_a_favor[1].fuentes[0].cita` (Diputado Álvarez, Diario de Sesiones
  1996-06-04): la cita empezaba con "la legislación aprobada...", pero entre el "la" y
  "legislación" el PDF intercala un salto de página ("50 CAMARA DE REPRESENTANTES Martes 4 de
  junio de..."), así que "la" no es contiguo con el resto. Recorté la cita para que empiece en
  "legislación aprobada...", que sí es un tramo contiguo real.
- La cita de Otheguy en Crónicas (`monopolio.argumentos_a_favor[0]` y las dos autocitas de
  `medios/cronicas.yaml`) usaban `https://www.cronicas.com.uy/news-69340-...`. La etapa `fuentes`
  de `--red` la marcó como caída (HTTP 404 en vivo) sin copia en Wayback, dos corridas de
  validación seguidas. El motivo: `pnpm fuente` archiva por la URL canónica sin `www.`
  (`https://cronicas.com.uy/...`), así que el Save Page Now de esta sesión quedó indexado ahí y no
  en la variante con `www.` que tenían las tres citas. Cambié las tres al host sin `www.` (mismo
  documento, misma cita); confirmado con dos corridas seguidas de `--red` en verde.

## Objeciones de `critica.md`: estado final

Confirmado con `pnpm validar --inbox --red` (0 errores) y lectura propia:

- **O-1, O-2 (bloquea)**: resueltas por el investigador en la vuelta 2 (finanzas 2015-2019
  cargadas; comparación reemplazada por la página de Transparencia del BSE, sin cálculo propio).
  No encontré nada que reabrir.
- **O-3 a O-9, O-13 a O-17 (corregir)**: resueltas por el investigador (segmentos en los once años;
  fuente del resultado movida al `estres`; cotización de la Mesa de Cambios del BCU declarada, no
  deducida; nota de 2024 reescrita; "arrastra por error" reemplazado por un hecho; citas de
  Ley 18.243 y Ley 18.401 corregidas o retiradas; tres hitos nuevos). Las verifiqué una por una
  contra el YAML y contra `--red`; no encontré ninguna a medio resolver.
- **O-10, O-11, O-12 (corregir, simetría del monopolio)**: resueltas con dos citas de diario de
  sesiones de 1996 (una por lado) y el matiz de Audea agregado; el episodio CIPU/CAPU se sacó en
  vez de forzarlo a la respuesta del BSE, que es una lectura tan válida como la sugerida por el
  crítico (evita quedarse con un "episodio" en la lista de argumentos de diseño). No agrego nada
  yo: el resultado ya es 2 a 2, con el mismo tipo de fuente primaria de cada lado.
- **O-18 (riesgo legal)**: resuelta (la afirmación sobre El Observador/En Perspectiva sin abrir se
  retiró de `notas.md`).
- **O-L1, O-L2 (herramienta/método)**: ya no aplican; `notas.md` documenta que el bug de `www.` en
  `pnpm fuente` estaba resuelto en el código antes de esta vuelta.
- **O-L3 (simetría de cobertura)**: resuelta para el rango pedido (2015-2024, más 2025 ya
  disponible); 2005-2014 queda pendiente, declarado como tal en `resumen` y `notas_internas`, no
  omitido — mismo criterio que las correcciones ya aplicadas a ANCAP, UTE y ANTEL.
- **A-1 a A-4, A-6, A-7 (aviso)**: sin cambios, tal como quedaron en la vuelta 2; no bloquean tier.
- **A-5 (aviso, monopolio de hecho en renta vitalicia sin argumentos)**: sigue abierto. No es
  bloqueante para `publicado` (el esquema solo exige los dos lados cuando hay monopolio *legal*,
  y este es de hecho), pero lo dejo anotado en `notas_internas` para que no se pierda.

## Validación

- `pnpm validar --inbox inbox/empresas/bse/2026-09-07`: 0 errores (los 13 "medio desconocido" antes
  de copiar `medios/` a `content/` eran los esperados por el brief). Avisos: solo los 44
  preexistentes de `ancap.yaml`, `antel.yaml`, `ute.yaml` y de cobertura por tema, ninguno de este
  lote.
- `pnpm validar --inbox inbox/empresas/bse/2026-09-07 --red`, con `medios/bse.yaml` y
  `medios/cronicas.yaml` copiados temporalmente a `content/medios/` (y borrados después de validar,
  `content/` sin cambios): **0 errores** — esquema, referencias, tiers, fuentes (71 URLs), citas
  (106 citas: 105 exactas, 1 aproximada dentro de tolerancia por ser tipo `nota`), simetría.
