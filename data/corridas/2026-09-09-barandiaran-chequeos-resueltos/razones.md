# Razones — corrida 2026-09-09-barandiaran-chequeos-resueltos

Modelo: Sonnet (editor no corre en Fable ni en Opus, regla del mantenedor del 2026-09-07).

Un resolvedor (Sonnet) buscó el documento previsible de los 12 chequeos de Gabriel Barandiarán
que habían quedado en `probable` (corrida `2026-09-09-barandiaran-intervenciones`, objeciones
`documento_previsible` de `critica.md`). Verifiqué cada fuente nueva con `pnpm fuente` antes de
tocar nada: leí el pasaje exacto, comparé contra la cita del resolvedor y, en un caso, corregí una
atribución que el resolvedor había hecho mal.

## Cambios sustantivos

- **`chequeos/barandiaran/1996-08-13-hubo-credito-us-137-000-000`**: verifiqué con `pnpm fuente`
  que el Informe en Minoría de la Comisión Investigadora sobre FOCOEX (dentro del mismo Diario de
  Sesiones del 1996-08-13 ya citado) fija el monto de los negocios intermediados por FOCOEX en
  US$137.053.000, cifra que Barandiarán redondeó a "US$137:000.000". La cita del resolvedor calza
  literal. Subo `calificacion: discutible → verdadero` y `tier: probable → publicado`. Nota para
  el lector en `notas_internas`: el informe es el mismo documento del que Barandiarán fue coautor
  como informante en minoría, así que confirma la cifra pero no es una fuente externa a su propia
  posición en la investigación; lo dejo dicho en el análisis publicado, sin verbo de intención.
  Responde a la objeción `documento_previsible` de `critica.md` sobre `chequeos[7]`.

- **`chequeos/barandiaran/1996-08-13-intermediario-senor-estellano-cobro-comision-4`**: verifiqué
  con `pnpm fuente` la cita del resolvedor ("No pudimos acceder a la copia del contrato del señor
  Estellano...") en el mismo Informe en Minoría: calza literal. El documento existe y trata el
  punto, pero dice expresamente que la Comisión no pudo confirmar la cifra del 4 % / US$5.000.000,
  así que la calificación se mantiene `discutible` (no hay contradicción a favor ni en contra) y
  subo el `tier: probable → publicado`, con el análisis explicando qué confirma el documento y qué
  no, como habilita el brief para el caso "parcial". **Corrección a la resolución**: el resolvedor
  atribuyó el techo del 5 % de comisión a un "testimonio del contador Testoni"; leyendo el pasaje
  completo con `pnpm fuente --desde <carácter>`, el informe atribuye esa cifra a "lo declarado por
  los jerarcas de FOCOEX", no a Testoni. Carlos Testoni aparece en otra parte del mismo documento
  como el Diputado que presentó la denuncia original ante la Comisión Preinvestigadora, sin
  relación con el techo del 5 %. Corregida la atribución en `dato_real.valor` y `analisis`, y
  dejada explícita en `notas_internas` para que quede el rastro del error. Responde a la objeción
  `documento_previsible` de `critica.md` sobre `chequeos[8]`.

- **`chequeos/barandiaran/1997-11-18-1997-mayor-parte-paquete-accionario-pluna`**: verifiqué con
  `pnpm fuente` que la Resolución del Poder Ejecutivo N.º 629/995 (IMPO) identifica al
  Pluriconsorcio de Aeronavegación —único oferente y adjudicatario de la licitación de PLUNA de
  1994-1995— como una entidad "cuyo operador es VARIG". La cita del resolvedor calza literal.
  Subo `calificacion: discutible → verdadero` (la identificación de VARIG deja de depender solo de
  la nota de opinión de La República) y `tier: probable → publicado`. En el análisis dejo explícito
  que la resolución nombra a VARIG como "operador" del consorcio, no como titular directo de las
  acciones a su nombre, y por qué esa distinción no cambia el sentido de lo dicho. Responde a la
  objeción `documento_previsible` de `critica.md` sobre `chequeos[10]`.

- **`chequeos/barandiaran/1997-12-17-empresas-uruguayas-habian-incrementado-exportaciones-cada`**:
  verifiqué con `pnpm fuente` el cuadro "Balanza de Pagos" de la Revista de Economía del BCU
  (1997), que esta vez sí se pudo descargar. Da exportaciones de bienes de US$1.645,3M (1993),
  US$1.913,4M (1994), US$2.147,6M (1995) y US$2.439,6M (1996, preliminar): variaciones de +16,3 %,
  +12,2 % y +13,6 % contra el 16 %, 10 % y 13 % que dijo Barandiarán. Dos de los tres números
  difieren en menos de un punto porcentual; el del medio, en 2,2 puntos (unos 18 puntos de
  diferencia relativa). Como el sentido general —crecimiento de dos dígitos los tres años, ningún
  año de caída— se mantiene, califico `impreciso` (no `verdadero`, porque el año del medio excede
  la tolerancia de la regla numérica; no `falso`, porque no cambia el sentido de lo dicho) y subo
  `tier: probable → publicado`. Reemplacé la serie sustituta de Comtrade/Banco Mundial (WITS) que
  traía el registro anterior por la serie oficial del BCU en `dato_real` y en `grafico`, y ajusté
  los períodos del eje x de 1994→1995/1995→1996/1996→1997 a 1993→1994/1994→1995/1995→1996, que son
  los tres años que la serie oficial disponible en diciembre de 1997 podía cubrir. Responde a la
  objeción `documento_previsible` de `critica.md` sobre `chequeos[20]`.

- **`chequeos/barandiaran/1998-09-01-segun-instituto-nacional-estadistica-precios-educacion`**:
  verifiqué con `pnpm fuente` (vía Wayback, prefijo `id_`, porque `www5.ine.gub.uy` sigue sin
  responder directo desde este entorno) la planilla "IPC 2 gral rub M.xls" del INE. Confirmé fila
  por fila los valores de setiembre de 1997 y setiembre de 1998 que citó el resolvedor: Enseñanza
  107,68 → 124,31 (+15,45 %) contra el índice general 107,17 → 117,87 (+9,98 %). Confirma
  exactamente lo que Barandiarán atribuyó al INE. Subo `calificacion: discutible → verdadero` y
  `tier: probable → publicado`, y agrego un gráfico de barras comparando las dos variaciones
  (punto 8 de la lista de control: compara cifras entre categorías). Responde a la objeción
  `documento_previsible` de `critica.md` sobre `chequeos[21]`.

- **`content/medios/ine.yaml` (nuevo, vía `inbox/.../medios/ine.yaml`)**: el Instituto Nacional de
  Estadística no existía en `content/medios/` y lo necesitaba el chequeo anterior. Propiedad y
  alineamiento (`estatal`) con fuente en Wikipedia, leída con `pnpm fuente` en esta sesión (el
  sitio institucional de INE en gub.uy no trae una descripción propia, solo widgets de datos).

## Chequeos que no cambian (resuelto: no)

Los siguientes 7 quedan en `probable`, sin ningún campo tocado. El resolvedor documentó la
búsqueda en `busque:` de cada archivo de `inbox/resoluciones/2026-09-09/`; la resumo acá para que
la próxima vuelta no la repita:

- **`1996-06-05-parlamento-voto-presupuesto-nacional-1995-1999`** (Aeropuerto de Carrasco,
  US$60.000.000): el articulado de la Ley 16.736 en IMPO no trae el monto por obra; falta la
  planilla anexa del Plan de Inversiones, no encontrada en Wayback ni en el sitio del MTOP. Falta
  probar `pnpm inventario` sobre mtop.gub.uy y el archivo histórico de Presidencia.
- **`1997-11-25-deficit-conjunto-cajas-militar-policial-alcanzaba`** (déficit conjunto Caja
  Militar y Policial, US$250.000.000/año): ni la Rendición de Cuentas 1996/1997 (abierta
  completa) ni el articulado de la Ley 16.878 en IMPO (solo ficha corta, sin anexos) traen la
  cifra. Apareció una cifra de 2001 (US$260.000.000) que no se usó por ser de cuatro años después.
  Falta la respuesta al pedido de informes C/2366/97 del propio Barandiarán, no localizada.
- **`1997-12-11-caja-militar-costaba-aproximadamente-us-230`** (costo anual Caja Militar,
  US$230.000.000): mismo resultado y mismo camino pendiente que el anterior (pedido de informes
  C/2366/97).
- **`1998-05-12-antel-tenia-800-000-suscriptores-1998`** (ANTEL, 800.000 suscriptores): no se
  encontró la cifra absoluta de suscriptores/líneas de 1998 en ninguna fuente relevada; el
  resumen de ANTEL 1997-2000 ya citado solo trae ratios. `pnpm inventario antel.com.uy` se cortó
  por el tope de tiempo antes de completar el listado 1997-2000; falta correrlo con timeout largo.
- **`1998-06-16-uruguay-detectaban-600-casos-cancer-cervicouterino`** (600 casos, 100 muertes de
  cáncer cervicouterino/año): no hay boletín ni anuario digitalizado de la Comisión Honoraria de
  Lucha Contra el Cáncer / Registro Nacional de Cáncer de fines de los 90; el artículo de la
  Revista Médica del Uruguay ya citado no desglosa por año ni cubre 1998. El medio
  "comisioncancer" tampoco existe en `content/medios/` si aparece una fuente en una próxima vuelta.
- **`1998-11-11-fondos-administrados-afap-eran-1998-aproximadamente`** (fondos AFAP,
  ~US$300.000.000): no hay serie histórica pública del fondo total de las AFAP para 1996-1999; la
  página viva del BCU solo expone la memoria del trimestre corriente. Falta pedir el archivo
  histórico a la Superintendencia de Servicios Financieros o revisar la Memoria Anual del BCU de
  1998 completa.
- **`1999-04-13-uruguay-producian-entre-80-100-nacimientos`** (80-100 nacimientos múltiples/año):
  no hay Anuario Estadístico del INE de fines de los 90 digitalizado con nacimientos por tipo de
  parto; la tabla actual del Anuario solo cubre 2020-2022. El catálogo de microdatos de Natalidad
  1996-2007 no tiene copia en Wayback para esa URL. Falta escribir a la Biblioteca del Poder
  Legislativo (bdau@parlamento.gub.uy) o insistir por otra vía de acceso a los microdatos.

## Cambios de forma

Ninguno: no hubo correcciones de fechas, tipeo ni reordenamiento en este lote; todos los cambios
de campo están listados arriba porque todos alteran calificación, tier o el respaldo documental.
