# Notas — ANTEL, serie histórica de finanzas (corrida 2026-09-08-empresas-antel-serie-historica)

Segunda vuelta: resuelve las objeciones de `data/corridas/2026-09-08-empresas-antel-serie-historica/critica.md`
(crítico en Opus). Las cinco que bloqueaban quedaron resueltas; de las trece "corregir" se resolvieron
las de investigación (datos, citas, notas); las de presentación pura (agrupar fuentes por URL en la
página, reescribir `resumen`) quedan para el editor, con las fuentes listadas en `## para_el_editor`.

## candidatos_giro

No aplica: esta corrida es sobre finanzas de una empresa pública, no sobre declaraciones de un
político. No hay registros de este tipo.

## hipotesis

- **Pago a Rentas Generales con valores públicos (2002).** Confirmado y ampliado con `est_notas.pdf`
  (Wayback, ejercicios 2002/2001), que sí se pudo leer en esta segunda vuelta (51.729 caracteres). La
  Nota 17.2 ("Otros resultados") describe un mecanismo distinto y más grande que el ya citado en la
  primera vuelta (el COFIS de $ 8.137 miles): por la Ley 16.170 y el Decreto 436/02, la OPP le informó
  a ANTEL la obligación de pagar US$ 5.500.000 como anticipo de resultados de 2003; el Directorio
  (Resolución 1946/02, 30/12/2002) resolvió pagarlo con títulos públicos por valor nominal de
  US$ 5.426.400 más US$ 73.600 en efectivo, y como esos títulos estaban contabilizados a valor de
  mercado de US$ 3.554.592 (dato repetido más abajo en el propio documento como "3.544.592": la
  inconsistencia es del original, no una lectura mía), la diferencia de US$ 1.871.807 ($ 50.857 miles)
  se registró como ganancia en "Otros Resultados". Sigo sin poder establecer si el mecanismo de pagar
  con títulos en vez de efectivo se repitió en otros años. Va a `## para_el_editor` como hito.
- **Monto fijo de $ 1.867.704 miles transferido a Rentas Generales, 2010-2014.** Se confirma también
  para 2013 y 2014 (bloque individual del balance de 2014: "Distribución de utilidades" es
  $ 1.867.704 miles en ambos años, idéntico a 2010-2012), así que el nominal se sostiene cinco años
  seguidos: 2010, 2011 (implícito, no verificado por separado porque el balance propio es un escaneo),
  2012, 2013 y 2014. Sigue sin aparecer el texto que fije esa cifra específica (el mecanismo general —
  artículo 643 de la Ley 16.170, decretos 161/91 y 436/002 — no fija un monto). No va a `hitos[]` sin
  esa norma, según lo que señaló el crítico; queda en hipótesis.
- **Deuda financiera casi nula, 1997-2014.** Sin cambios respecto de la primera vuelta.
- **1994 — bienes de uso: cambio de criterio contable.** Sin profundizar, ver `## para_el_editor` de
  la primera vuelta (no se retomó en esta segunda vuelta, no era parte del encargo del crítico).

## casos_vistos

Ninguno. El brief no pidió investigar casos judiciales y no apareció ningún caso (denuncia,
investigación, formalización) vinculado a ANTEL en las fuentes leídas en ninguna de las dos vueltas.

## verificacion_manual

Sin cambios respecto de la primera vuelta (los cinco ítems siguen sin poder leerse):

- `https://www.antel.com.uy/documents/37544/378823/estados-contables-2007.pdf/ae5aa7f3-dd21-fed2-ec2a-45e9d3c5a7df?t=1755713580409` — escaneo sin capa de texto (39 páginas, 0 caracteres extraídos); `pnpm fuente` intentó OCR y falló porque esta máquina no tiene `pdftoppm` (poppler) instalado. Es el balance propio de 2007 (individual y consolidado); el año 2007 igual quedó cargado en esta ficha usando la columna comparativa del balance de 2008, que sí tiene texto.
- `https://www.antel.com.uy/documents/37544/378823/estados-financieros-consolidados-individuales-2013.pdf/50d8d64a-ab05-7a6d-0752-398d6f7ce9fa?t=1755713605413` — escaneo sin capa de texto (97 páginas, 0 caracteres), mismo problema de OCR. Es el balance propio de 2013; el año 2013 quedó cargado usando la columna comparativa del balance de 2014.
- `https://www.antel.com.uy/documents/37544/378823/estados-financieros-consolidados-e-individuales-2011.pdf/c9fcf15a-1411-15ce-7e71-6720568c7749?t=1755713600521` — escaneo sin capa de texto, mismo problema. Es el balance propio de 2011; el año 2011 quedó cargado usando la columna comparativa del balance de 2012.
- `https://www.antel.com.uy/documents/37544/378823/e_c_2002y2003_est_resultados.pdf` (y los otros cuatro PDF de 2003 enlazados desde `estados_2003_y_2002/estados_contables_contenido.htm`) — la página de índice de ese ejercicio sí fue capturada por Wayback Machine, pero los cinco PDF que enlaza (Estados de Situación Patrimonial, de Resultados, de Evolución del Patrimonio, de Origen y Aplicación de Fondos, y Notas) nunca fueron archivados: piden HTTP 404 en cualquier fecha. El balance propio de 2003 queda sin registro por esa razón (el año 2003 sí quedó cargado, en esta segunda vuelta, desde un resumen oficial distinto: ver `## cobertura_del_periodo`).
- `https://www.yumpu.com/es/document/view/49026523/memoria-anual-2005-pdf-28mb-antel` (y los análogos de 2006, 2007, 2008 y 2009 en el mismo sitio) — Yumpu exige registro de usuario para descargar el PDF completo. No se pudo leer.
- Nuevo en esta vuelta: `https://web.archive.org/web/20031011212136/http://www.antel.com.uy:80/la_empresa/estados_contables/estados_2002_y_2001/est_notas.pdf` (sin el sufijo `id_`) devuelve "Invalid PDF structure" — es el wrapper HTML de Wayback, no el PDF; con `id_` (`https://web.archive.org/web/20031011212136id_/...`) se lee bien. Dejo la nota porque el mismo problema puede repetirse con otros PDF de Wayback.

## cobertura_del_periodo

Tabla año por año, 1974-2014 (2015 en adelante ya estaba cargado en la ficha publicada y no se tocó).
Estado: **cargado** (con cita en `finanzas[]`), **escaneo** (el balance existe pero es un PDF sin capa
de texto) o **sin documento** (no se encontró nada público, con las búsquedas hechas). Corregida en
esta segunda vuelta respecto de la que entregó la primera: **1997 y 1998** ahora tienen pesos además de
dólares; **2003** pasa de "sin documento" a cargado; **2009** ahora tiene cifra en dólares; **2011**
mantiene el mismo detalle pero con la explicación de moneda corregida; **2013 y 2014** pasan de
ausentes (a pesar de que la corrida anterior los declaraba cargados) a efectivamente cargados.

| Año | Estado | Detalle |
|---|---|---|
| 1974-1996 | sin documento | ANTEL se crea en 1974. No se encontró ningún balance, memoria anual ni resumen financiero de estos 23 años en `antel.com.uy`, Wayback Machine, Yumpu, el corpus, ni en las búsquedas web hechas (Tribunal de Cuentas, Rendición de Cuentas, bibliografía académica). El archivo físico de ANTEL en La Paz (Av. Artigas 370) tiene documentación desde 1968, pero es un archivo físico, no consultable a distancia. Sin cambios respecto de la primera vuelta; el crítico confirmó con sus propias búsquedas (CDX de Wayback) que no hay nada anterior a `20010817`. |
| 1997 | cargado | `resultado_ejercicio` y `transferencias_al_estado`, ahora en pesos **y** dólares. Los dólares (fila "por su monto original en dólares estadounidenses", moneda de cierre propia de cada año) salen del resumen 1997-2000; los pesos (moneda de cierre de 2001, no de 1997) salen de una segunda edición del mismo resumen, para 1997-2001, en la carpeta hermana `estados_contables_nuevos/` de Wayback (la primera vuelta solo había recorrido `estados_contables/`). Sin deuda financiera, sin impuestos, sin segmentos. |
| 1998 | cargado | Igual que 1997. |
| 1999 | cargado (parcial) | `resultado_ejercicio`, `deuda_financiera` y `transferencias_al_estado`, tomados de la columna comparativa del balance de 2000 (reexpresada a moneda de cierre de 2000, no de 1999; ahora dicho explícitamente en la `nota` del año). Sin impuestos pagados ni segmentos. |
| 2000 | cargado | `resultado_ejercicio`, `deuda_financiera` y `transferencias_al_estado`, del balance propio de 2000. Sin impuestos pagados ni segmentos. |
| 2001 | cargado (parcial) | Del balance propio de 2001. Sin cifra en dólares. Sin impuestos pagados: en esta vuelta se confirmó por qué (las notas del balance de 2002/2001 desagregan cada impuesto por separado pero no traen el cuadro sumable que la ficha usa desde 2008). |
| 2002 | cargado (parcial) | Del balance propio de 2002. Mismo motivo que 2001 para la ausencia de impuestos pagados. |
| 2003 | cargado | **Nuevo en esta vuelta.** `resultado_ejercicio` y `transferencias_al_estado`, en pesos y dólares, desde `datos-financieros-y-operativos-relevantes-2007.pdf` (resumen oficial 2003-2007, publicado hoy en `antel.com.uy`, la edición 2007 del mismo resumen que la primera vuelta ya había usado para 2004-2008). El balance propio de 2003 sigue sin existir en ningún archivo (los cinco PDF de `estados_2003_y_2002/` nunca fueron capturados por Wayback). Sin deuda financiera, impuestos ni segmentos (el resumen no los desagrega). |
| 2004 | cargado (parcial) | Solo `resultado_ejercicio` y `transferencias_al_estado` (pesos y dólares), del resumen oficial 2004-2008. Sin deuda, impuestos ni segmentos. Nota agregada: la cifra sale de un resumen no auditado, no del estado contable. |
| 2005 | cargado (parcial) | Igual que 2004. |
| 2006 | cargado (parcial) | Igual que 2004-2005. |
| 2007 | cargado | `resultado_ejercicio`, `deuda_financiera`, `transferencias_al_estado` y segmentos. Cifras en pesos de la columna comparativa del balance de 2008 (cierre de 2008); dólares del resumen propio de 2007. Segmentos corregidos en esta vuelta: ahora es **ingreso** operativo por división (antes era resultado operativo, una magnitud distinta a la de 2015-2024); el resultado operativo que el balance también publica quedó en la `nota` de cada segmento. Sin impuestos pagados. |
| 2008 | cargado | Todos los campos. Segmentos corregidos igual que 2007 (ingreso, no resultado operativo). |
| 2009 | cargado | **Ahora con dólares** en `resultado_ejercicio`, `deuda_financiera`, `transferencias_al_estado` y los tres segmentos: se dedujo el tipo de cambio implícito (20,998) de la Nota 5 del balance de 2010 (columna comparativa 2009), el mismo procedimiento que ya usaba la ficha para 2008, 2010, 2011 y 2012. Segmentos corregidos a ingreso. Sin impuestos pagados (el bloque individual del balance propio de 2009 no está disponible). |
| 2010 | cargado | Todos los campos, del balance individual propio de 2010. Segmentos corregidos a ingreso. |
| 2011 | cargado (parcial) | Mismo detalle que la primera vuelta, pero con la explicación de moneda **corregida**: la columna comparativa de 2011 en el balance de 2012 está en moneda de cierre de **2012**, no de 2011 (la Nota 5 lo desmiente: tipo de cambio implícito 21,39 contra el interbancario real de cierre 2011, que fue 19,898). Los pesos de este año valen ~7,5% más que lo que habría mostrado el balance propio. Los dólares no cambian. Segmentos corregidos a ingreso. |
| 2012 | cargado | Todos los campos, del balance individual propio de 2012. `transferencias_al_estado` corregido en esta vuelta: ahora cita el renglón "Contribución a Rentas Generales" del estado de origen y aplicación de fondos (mismo criterio que 2015-2024), no la nota narrativa "Transferencias a Rentas Generales" que usaba antes (el monto no cambiaba, pero el criterio de citación ahora es uniforme). Segmentos corregidos a ingreso. |
| 2013 | cargado | **Nuevo en esta vuelta** (la corrida anterior lo declaraba cargado en `notas.md` pero no estaba en `finanzas[]`). Todos los campos salvo impuestos pagados, del bloque individual del balance de 2014 (columna comparativa 2013). Cinco segmentos (fija, móvil, datos, pública, telegrafía; solo ingreso — el balance ya no da gasto ni resultado por división). |
| 2014 | cargado | **Nuevo en esta vuelta.** Todos los campos, del bloque individual propio del balance de 2014, incluidos impuestos pagados (con un renglón negativo: IVA contribuyente $ -259.043 miles ese año, un crédito). Mismos cinco segmentos que 2013. |

## escaneos_sin_texto

Sin cambios respecto de la primera vuelta: `estados-contables-2007.pdf`, `estados-financieros-consolidados-individuales-2013.pdf`
y `estados-financieros-consolidados-e-individuales-2011.pdf` siguen sin capa de texto (ver `verificacion_manual`).
Los tres años quedan cargados igual, con la columna comparativa del balance del año siguiente.

## anios_sin_segmentos

1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005 y 2006: ninguno de los documentos localizados
para estos años trae información por segmento de negocio. **Corrección respecto de la primera
vuelta:** el crítico señaló que las notas archivadas del balance de 2001/2000 (`estados_contables_nuevos/notas.htm`,
no releídas en esta segunda vuelta por no ser parte del encargo) sí traen una desagregación de
ingresos por **servicio** para 2000 y 2001 (telefonía internacional, transmisión de radio y TV,
arrendamiento de transmisión digital, RDSI, acceso a celulares desde la red fija...), que es distinto
de "no existe información" — es una desagregación por servicio, no por división (fija/móvil/datos), y
no está claro que sea mapeable a los nombres que usa el resto de la ficha. Queda pendiente para una
próxima vuelta: no se cargó `segmentos[]` para 2000-2001 en esta corrida.

## para_el_editor

Hechos fechados para sumar a `hitos[]`, con fuente ya leída en esta sesión:

- **30/12/2002 — ANTEL paga un anticipo de resultados a Rentas Generales con títulos públicos, no en
  efectivo.** Por la Ley 16.170 y el Decreto 436/02, la Oficina de Planeamiento y Presupuesto le
  informó a ANTEL la obligación de pagar US$ 5.500.000 como anticipo de resultados de 2003; el
  Directorio (Resolución 1946/02) decidió pagarlo con títulos públicos por valor nominal de
  US$ 5.426.400 más US$ 73.600 en efectivo. Como los títulos estaban contabilizados a valor de mercado
  de US$ 3.554.592 (más bajo que el nominal), la diferencia de US$ 1.871.807 ($ 50.857 miles) se
  registró como ganancia en "Otros Resultados" del ejercicio 2002. Fuente:
  `https://web.archive.org/web/20031011212136id_/http://www.antel.com.uy:80/la_empresa/estados_contables/estados_2002_y_2001/est_notas.pdf`,
  Nota 17.2. Es el antecedente más antiguo encontrado del mecanismo de pago con valores públicos que
  la ficha ya documenta para 2002 (COFIS, $ 8.137 miles) y 2015 (nota del año 2015 en `finanzas[]`).
- **2012 — fin de la reexpresión monetaria por inflación.** El balance de 2014 tiene una nota ("u.
  Bases para la reexpresión monetaria hasta el 31 de diciembre de 2011") que dice que ANTEL ajustaba
  sus estados contables por inflación hasta el ejercicio 2011 inclusive, y que dejó de hacerlo desde
  2012. Es el hito que explica por qué la misma cifra de un año cambia según en qué balance se la
  mire: por ejemplo, la Contribución a Rentas Generales de 2001 vale $ 2.128.285 miles en el balance
  propio de 2001 y $ 3.518.136 miles en la columna comparativa del balance de 2002 (factor 1,646, no
  el IPC de 2002 que fue 25,9%: el índice de reexpresión no fue el mismo cada año). Sin él, la tabla
  de finanzas es incomprensible para el lector. Fuente: `estados-financieros-consolidados-individuales-2014.pdf`
  (ya citada en la ficha para `creacion`/`normas`), más la comprobación aritmética hecha por el
  crítico y verificada de nuevo en esta vuelta con la Nota 5 del balance de 2012 (ver `finanzas[2011].nota`).
- Recordatorio: la transferencia fija de $ 1.867.704 miles (2010-2014) **no** es un hito documentado
  con norma (ver `## hipotesis`); no sumar a `hitos[]` sin encontrar el texto que fije esa cifra.

Pendiente que el editor decida (no es investigación, es una decisión de presentación que el crítico
dejó anotada y esta segunda vuelta no resuelve porque no es un campo del YAML):

- **`resumen` publicado.** Sigue sin tocar (el brief original lo pedía así) y sigue describiendo solo
  2015-2024. Con la serie ahora completa 1997-2024, el `resumen` necesita reescribirse o el registro
  no debería promoverse tal cual.
- **Agrupar `fuentes` por URL en la página.** No es un cambio de YAML (el esquema no lo pide), es una
  decisión de la plantilla de la ficha. Mencionado para que quede registrado.
- **Serie larga en pesos, base de comparación.** Con las `nota` de cada año ya explicitando la moneda
  de cierre, el editor puede optar entre las tres alternativas que dio el crítico (graficar en
  dólares, reexpresar toda la serie a una base, o mantener pesos por año sin unir los puntos antes de
  2012). No se tomó esa decisión en esta corrida porque es de presentación, no de dato.
- **1974-1996.** Sigue sin balance. Lo único previsible que queda (dictamen del Tribunal de Cuentas
  vía Parlamento/Diario Oficial) no se persiguió en esta vuelta: no era parte del encargo del crítico.

## objeciones_al_brief

Ninguna, ni en el brief original ni en el encargo de esta segunda vuelta (que pide corregir objeciones
de un crítico, aplicando el mismo criterio a todos los años sea cual sea el gobierno). El propio
crítico verificó la simetría entre gobiernos y la Regla 0 en su corrida; esta segunda vuelta no
introduce ningún criterio nuevo que la comprometa: la corrección de moneda (Nota 5, reexpresión) se
aplicó con el mismo método a 2009 y 2011 sin importar qué presidencia gobernaba ese año.

## resumen_vs_primaria

No aplica (esta corrida no trata declaraciones de un político).
