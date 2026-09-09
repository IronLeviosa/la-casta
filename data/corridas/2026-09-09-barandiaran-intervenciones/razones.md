# Razones de edición — corrida 2026-09-09-barandiaran-intervenciones

Editor: `claude-sonnet-5` (regla de modelos del mantenedor, 2026-09-07: el editor no corre en Fable ni
en Opus salvo permiso explícito; acá no lo hubo). Crítico: Opus (`critica.md`). Investigador (vuelta 1
y 2): Sonnet.

## Regla 0

Ningún mensaje de esta sesión pidió calificar, omitir o encuadrar algo por partido o persona. El
lote es, en los hechos, el único con 100 declaraciones publicadas para 1995-1999, todas de un
legislador de un solo partido (Nuevo Espacio): eso no es una decisión editorial mía ni del
investigador, es la asimetría que la propia crítica marca en su objeción 3 y que reitero abajo. El
umbral que apliqué a cada declaración, chequeo y tema es el mismo que aplicaría a un legislador de
cualquier otro lema con la misma evidencia: cita literal + resumen fiel + sin dato personal indebido
→ `publicado`; documento previsible sin abrir → `probable` con `que_falta`; sin documento posible →
`discutible` definitivo. Antes de cerrar repasé los tres registros que la crítica bloqueó por datos
personales con ese mismo criterio (ver más abajo) y los diez que reasigné de tema con la misma regla
descriptiva para todos, no según de quién se trate.

## Objeciones de `critica.md`, una por una

### Bloquea (3/3, confirmado que quedaron limpias)

- **`barandiaran/1995-07-25-caso-banco-pan-azucar-informe-minoria-1995`** (Braga): el investigador
  agregó "en minoría", cambió "concluye" por "sostenía" y agregó el desenlace (esa madrugada la
  Cámara aprobó, por amplia mayoría, pasar los antecedentes a la Justicia, **sin nombrar a Braga** en
  el texto aprobado). Confirmé releyendo `1995-07-25-0034.md`: el nombre de Braga solo queda dentro de
  la cita literal del proyecto de resolución que Barandiarán leyó (texto del propio proyecto, no una
  afirmación del sitio), y el resumen no lo acusa de nada en indicativo. No abrí un registro en
  `content/casos/`: no hay una causa propia contra Braga con etapa y fecha, solo la remisión genérica
  a la Justicia que votó la Cámara esa noche. `tier: publicado`.
- **`barandiaran/1996-11-05-respaldo-politico-ministro-solari-1996`** (Lasalvia/Bresque): la cita
  quedó recortada al tramo político ("¿tiene hoy por hoy el doctor Solari el respaldo político
  necesario para continuar?") y el resumen ya no nombra a Lasalvia ni a Sandra Bresque ni afirma la
  denuncia como hecho. Confirmé releyendo el turno completo en `1996-11-05-0058.md`: ningún dato de
  salud ni el nombre de la paciente quedan en cita ni resumen. `tier: publicado`.
- **`barandiaran/1996-08-13-focoex-comision-estellano-1996`** (Estellano): el resumen atribuye la
  afirmación a Barandiarán ("dijo que...", "planteó, sin tener certeza, la duda de...") y no la
  asevera como hecho del sitio; el nombre de Estellano queda en la cita literal del diario de
  sesiones junto con la propia duda del orador ("no tengo la menor idea... si lo hizo"). No hay
  denuncia ni investigación documentada contra Estellano en esta corrida, así que no corresponde un
  registro en `content/casos/`; queda como declaración, con la cita completa que incluye el matiz.
  `tier: publicado`.

### Corregir (24/24)

Los 11 de tipo `cita_fuera_de_contexto` / `contexto_omitido` / `riesgo_legal` sobre declaraciones
individuales (`[3]`, `[5]`, `[11]`, `[20]`+`[69]`, `[25]`, `[26]`, `[42]`, `[77]`, `[82]`, `[84]`,
`[96]`) ya venían resueltos por el investigador en la vuelta 2; verifiqué cada uno releyendo la cita
final contra el turno en `.cache/barandiaran-turnos/` y contra el propio `resumen`. Un hallazgo
propio, no señalado por la crítica: la extensión hacia atrás de la cita de `declaraciones[3]`
(seguridad social) se hizo saltándose una frase intermedia del diario ("En la parte general
sef'lala:"), lo que dejó la cita **no contigua** — exactamente el defecto que la propia crítica
pide evitar. Lo corregí insertando la frase que falta (con el mismo artefacto de OCR, "sef'lala", tal
como aparece en el PDF) y `pnpm validar --red` pasó de "aproximada" a "exacta". Ningún otro salto
de este tipo apareció al recorrer las 138 citas con `--red`.

Los 13 de tipo `documento_previsible` sobre chequeos (`[5]`, `[6]`, `[7]`+`[8]`, `[10]`, `[11]`+`[19]`,
`[12]`, `[13]`, `[14]`+`[16]`, `[15]`, `[20]`, `[21]`) los resolví así, con el criterio de tier
explicado en la sección siguiente: 2 se cerraron con documento oficial (`[6]` ANCAP, `[12]` SIPRI,
ambos `verdadero`); los 10 restantes tienen ahora una búsqueda documentada del documento específico
que falta (no "no se buscó", sino "se buscó y no se encontró donde debería estar", o "se encontró un
documento parcial que no cubre el dato exacto") y quedan en `tier: probable` con `que_falta` y
listados en `notas.md > chequeos_pendientes` para una segunda vuelta del investigador con el nombre
exacto del documento.

Los 2 de tipo `asimetria`/`presentacion` sobre el lote (`_slug` faltantes, criterio de "qué es una
posición") ya los resolvió el investigador en la vuelta 2 (40 `_slug` escritos, 5 diarios revisados
con el criterio unificado). El de "temas nuevos" lo resolví yo (ver más abajo). El de Regla 0 de
cobertura entre partidos no es corregible por esta edición; se reitera en la sección de Regla 0 y en
`notas.md`.

### Aviso (8/8)

Los 6 sobre declaraciones individuales (`[38]`, `[60]`, `[65]`, `[74]`, `[92]`, `[97]`) ya venían
resueltos por el investigador; confirmé cada uno. El del turno de "mora" perdido entre tranches está
agregado como `barandiaran/1997-12-17-asimetria-plazos-mora-clearing-informes-1997`. El de
"discrepancias: no hay" se mantiene: no escribo `discrepancias.yaml`, por el mismo motivo que dio la
crítica (ninguna de las 49 URL del lote es cobertura de prensa sobre un hecho con primaria propia).

## Tier de las 107 declaraciones

Las 107 quedan en `tier: publicado`. Las tres que la crítica bloqueó están arriba; el resto pasa la
regla completa: cita literal contra el diario de sesiones (138/138 citas exactas con `--red`,
incluida la extendida de `[3]`), resumen que no dice más ni menos que la cita, y ningún dato personal
indebido de un tercero. Ninguna quedó en `probable`: no hay fuente única (todas son
`diario_de_sesiones`, nivel `textual`, que no exige segunda fuente), no hay `verificacion: manual`, y
no quedó ningún `bloquea` sin resolver.

## Los 22 chequeos

Calificación final: 2 `verdadero` (`[6]` ANCAP, dos medidas del mismo mercado no una corrección de
error; `[12]` gasto militar per cápita, confirmado por SIPRI), 20 `discutible` (0 `falso`, 0
`impreciso`: ningún dato oficial encontrado erraba por poco, o el dato oficial simplemente no existe
o no se relevó). Tier: 10 `publicado` (el dato no tiene, o no va a tener nunca, un documento oficial
que lo confirme: encuestas privadas, cifras que la propia empresa o cámara empresarial dio de
palabra sin balance auditado, o el caso de ANTEL 1995 donde la ficha de empresas de este sitio ya
documentó exhaustivamente que no hay balances anteriores a 1997) y 12 `probable` con `que_falta`
(el documento que resolvería el chequeo existe en algún archivo público y no se abrió en esta
corrida; el nombre exacto queda en `notas.md > chequeos_pendientes`).

Dos gráficos nuevos con datos ya en el registro: `[6]` (ANCAP, dos bases de medición) y `[12]`
(gasto militar per cápita, Uruguay/Chile/Brasil, SIPRI). Un tercero en `[20]` (exportaciones,
tres años, comparando lo dicho contra la serie sustituta de WITS/Banco Mundial) porque compara
cifras en el tiempo aunque el chequeo quede en `probable`: nada en el esquema exige que un gráfico
solo vaya en registros `publicado`, y el lector necesita ver la comparación aunque la calificación
quede pendiente. No agregué gráfico a `[11]` ni a `[19]` (Caja Militar, deficit conjunto): serían
gráficos de un solo número no confirmado, y "un gráfico sin fuente es peor que ninguno" — acá directamente
no hay una cifra oficial que graficar.

Corregí dos citas encontradas al correr `pnpm validar --red` que no había señalado la crítica (ver
`Correcciones de cita` abajo): la de `declaraciones[3]` (contigüidad) y la de `dato_real.fuentes[1]`
de `chequeos[7]` (espacios de más en una cita copiada de una página HTML con saltos de línea que
unen palabras: "DELCOMERCIO", "LASIRREGULARIDADES" — no es un error de tipeo del medio, es cómo
quedó el texto al extraerse; se dejó literal, sin agregar los espacios que un lector esperaría).

`afirmacion` de `chequeos[3]` y `chequeos[4]` reescritas con la cadena de atribución completa (el
documento del Nuevo Espacio que Barandiarán leyó; un diputado preopinante citado por él), como pedía
la crítica para que la afirmación chequeable sea la de quien la dijo, no la de Barandiarán.

## Temas nuevos

Creados en `inbox/barandiaran/intervenciones/2026-09-09/temas/` (`/revisar` los copia a
`content/temas/`): `economia/seguridad-social`, `economia/defensa-consumidor`,
`derechos-humanos/datos-personales`, `agropecuario` (primer nivel), `sistema-politico` (primer
nivel). Los cinco son los que la crítica recomendó crear (tabla de la objeción 6); el criterio de
alias y descripción es el mismo que usa cualquier tema existente (`economia/empleo` de referencia) y
se aplica igual a cualquier otro político con registros en esos temas, no solo a Barandiarán.

**Género** y **transporte/infraestructura** no se crean, siguiendo la recomendación de la crítica
("no todavía" / "no"): los 4 registros de género quedan en `derechos-humanos` (agregué los alias que
faltaban solo dentro de este archivo de tema; el tema en sí no cambia) y los de aviación/PLUNA en
`empresas-publicas`.

Reasigné `tema` en 30 declaraciones. En la mayoría el encaje es directo (AFAP, Caja Militar, Caja
Policial, IRP a jubilados, jubilaciones de privilegio → `economia/seguridad-social`; Diners, Skytel,
Clearing como consumidor, ley de defensa del consumidor → `economia/defensa-consumidor`; Internet,
Clearing como base de datos, confidencialidad del registro de trabajo sexual →
`derechos-humanos/datos-personales`; aftosa, arroceras, tierra y sociedades anónimas →
`agropecuario`; reforma constitucional/balotaje, publicidad de ingresos a la función pública, fueros
parlamentarios, Ombudsman, inasistencia legislativa → `sistema-politico`). En un puñado hice una
llamada editorial que no está escrita palabra por palabra en la crítica, y la dejo documentada acá
para que se pueda revisar con el mismo criterio en otro lote:

- `sociedades-anonimas-tierra-lavado-1999` (Punta del Este, sociedades anónimas por acciones al
  portador, lavado de dinero) se queda en `transparencia-corrupcion` en vez de pasar a
  `agropecuario`: el contenido es sobre apartamentos urbanos y opacidad societaria, no sobre el agro;
  la mención final a "la tierra" es una extensión retórica, no el tema del turno. Por eso
  `agropecuario` queda con 4 declaraciones y no 5 como estimó la crítica.
- `defensa-fueros-parlamentarios-1997` y `fueros-amedrentamiento-legislador-1998` pasan de
  `transparencia-corrupcion` a `sistema-politico`: son sobre el diseño institucional de la inmunidad
  parlamentaria, no sobre una denuncia de corrupción.
- `falta-ombudsman-legisladores-intermediarios-1998` pasa a `sistema-politico` por el mismo motivo
  (vacío institucional, no denuncia).
- `inasistencia-legisladores-maquinas-de-impedir-1999` pasa a `sistema-politico`: es sobre el
  funcionamiento del Parlamento como institución, no una denuncia de un hecho irregular.
- `antel-clearing-informes-corte-telefono-1997` pasa de `empresas-publicas` a
  `economia/defensa-consumidor`: el propio resumen lo encuadra en el Día Internacional de los
  Derechos del Consumidor y termina pidiendo una ley de protección al consumidor.
- `asimetria-plazos-mora-clearing-informes-1997` pasa de `economia/impuestos` a
  `economia/defensa-consumidor`: la asimetría que cuestiona es entre el BPS y el Clearing de
  Informes, no un impuesto.
- `irp-doble-imposicion-jubilados-1996` pasa de `economia/impuestos` a `economia/seguridad-social`,
  siguiendo el propio agrupamiento del investigador en `notas.md` (lo lista junto a la Caja Militar y
  las AFAP como parte del mismo eje de jubilados), aunque el mecanismo puntual (IRP) sea un
  impuesto.

Advertencia repetida de la crítica, que reitero: crear cinco temas cuyo único ocupante por ahora es
Barandiarán va a sumar cinco filas nuevas de "cobertura asimétrica" en `pnpm validar`. Es correcto
que se vea así — los temas son neutrales y el vacío tiene que ser visible — pero conecta
directamente con la objeción de Regla 0 de abajo.

## Medios nuevos

`inbox/barandiaran/intervenciones/2026-09-09/medios/sipri.yaml` y `congreso-espana.yaml`, con
`propiedad` y `alineamiento` sacados de una lectura propia con `pnpm fuente` en esta sesión (SIPRI
`/about`, Wikipedia sobre el Congreso de los Diputados), no de lo que dejó el investigador en
`notas.md`. Los dos llevan `etiqueta: estatal` con grupo propio (`sipri`, `estado-espanol`) en vez de
`estado-uruguayo`, siguiendo el mismo criterio que ya usa `content/medios/banco-mundial.yaml` para un
organismo internacional que no integra el Estado uruguayo. Agregué los bloques `Fuente` que el
investigador había dejado en prosa dentro de `dato_real.valor` de `chequeos[7]` y `chequeos[12]` a
`dato_real.fuentes[]`, con una corrección de cita en el de `congreso-espana` (ver arriba).

## Giro

`candidatos_giro` de `notas.md` (tranche B) señala una tensión de matiz entre
`ancap-asociacion-capital-privado-1996` (ANCAP puede asociarse con capital privado en actividades no
monopólicas, "para sobrevivir") y `ute-monopolio-natural-distribucion-1996` (la distribución
eléctrica, monopolio natural, "debe permanecer siempre en manos del Estado"), y el propio
investigador la descartó como candidata a giro. Releí las dos citas completas: son sobre mercados
distintos (alcoholes competitivos vs. distribución eléctrica) y Barandiarán traza la misma línea
explícita en las dos — monopolio natural adentro, actividad competitiva afuera — así que no hay
objeto común ni contradicción; es consistencia con una distinción, no un giro. No escribo
`giros.yaml` en este lote: no hay ningún par de declaraciones que sea `sin_cambio`, `cambio_parcial`
ni `cambio_total` sobre el mismo asunto con las citas que tengo. (Los patrones de consistencia
sostenida que ambos investigadores señalan — genocidio armenio, protección de datos, protección al
consumidor, fueros, verdad y memoria — son material para cruzar con una corrida futura sobre su
actuación como suplente en 2000-2004, no giros dentro de este mismo lote.)

## Regla 0 a escala del sitio

Con este lote promovido, la ficha de Barandiarán queda con 100+ declaraciones publicadas para
1995-1999 y es, por lejos, la trayectoria mejor documentada del sitio para esa Legislatura — y la
única, porque es el único legislador de la XLIV Legislatura con un barrido completo de la Hemeroteca.
`pnpm validar` va a marcar "cobertura asimétrica" en los 21 temas que tocan sus declaraciones (16 más
los 5 nuevos), siempre contra los mismos cuatro nombres: astori, hierro-lopez, mieres, topolansky,
que tuvieron mandato solapado y no tienen ningún registro. Esto no es una razón para no promover —la
información es verdadera, verificable y el brief la pidió sin filtro de partido— pero si se publica
sin más, un lector que entre a `/politicos/barandiaran/` o a cualquiera de los temas de 1995-1999 va a
ver a un solo diputado del Nuevo Espacio opinando y va a sacar una conclusión sobre el sitio que no
es la que corresponde. Propuesta concreta para el mantenedor, igual a la que ya dejó la crítica: el
mismo barrido de la Hemeroteca 1995-2000 (mismo brief, mismo método, ya probado y barato) para al
menos un legislador de cada uno de los otros tres lemas con mandato en el período (Partido Nacional,
Partido Colorado, Frente Amplio), empezando por los cuatro que el validador señala. Mientras eso no
exista, la ficha de Barandiarán (que edita otro editor, en `inbox/barandiaran/ficha/2026-09-08-vuelta-3/`,
fuera de mi alcance en este lote) tiene que decir en su `cobertura.texto` que se recorrió la
actuación parlamentaria completa de esta persona y todavía no la de sus contemporáneos, y por qué.
No lo edito yo: dejo esta nota para quien cierre esa corrida.

## Presentación

Recorrí los trece puntos de la lista de control:

- **Título** en las 107 declaraciones y en los 22 chequeos (ninguno lo tenía). Dicen qué afirma o
  qué se chequea, sin el nombre de Barandiarán, sin adjetivos; en los tres casos sensibles (Braga,
  Solari, Estellano) el título no nombra al tercero privado aunque la cita sí lo haga.
- **Párrafos cortos con el veredicto primero** en los 22 `analisis` y los 22 `dato_real.valor`
  (ninguno los tenía separados en párrafos). El primer párrafo de cada `analisis` dice qué dijo, qué
  dice el dato real (o que no se encontró) y por qué, en una o dos oraciones.
- **Gráficos** en `[6]`, `[12]` y `[20]` (ver arriba). Los otros 19 chequeos no comparan series o no
  tienen una cifra oficial que graficar.
- **Un hueco no es un cero**: los 12 `probable` llevan `que_falta` visible en la ficha (a diferencia
  de `notas_internas`), y quedan listados con el documento exacto en `notas.md > chequeos_pendientes`
  para que la próxima vuelta no repita la búsqueda desde cero.
- **Citas con defectos de OCR**: no las toqué, siguiendo la recomendación de la crítica (sección 5).
  Ya venían resueltas la coma de `declaraciones[11]` y los demás artefactos de OCR que la crítica
  revisó (`SE~OR`, `af'lo`, `1O%`, `U"n`, etc.): se dejan literales porque son lo que el validador
  compara contra el PDF, y limpiarlas rompería la comparación exacta. La propuesta de la crítica
  sobre `cita_legible` (opción a/b) queda para el mantenedor, sin aplicarla: es cambio de esquema,
  y el encargo la reserva a esa decisión. En este lote: no se tocó ninguna cita salvo por defectos
  de contigüidad como el de `declaraciones[3]` (ver arriba).
- **Línea de tiempo vertical, filtro por tema**: con 107 declaraciones esta va a ser la ficha más
  larga del sitio; queda como aviso de verificación visual para quien la promueva (abrir `pnpm dev`
  sobre `/politicos/barandiaran/`), no es algo que el editor pueda corregir desde el YAML.

## Chequeos pendientes y datos sin chequeo

Ver `notas.md > vuelta 3 (editor) > chequeos_pendientes`: 12 chequeos en `probable` con el documento
exacto que falta, más 2 datos dentro de citas ya publicadas que no tenían chequeo propio (el ahorro
de "US$900.000.000" en el Rubro 0 de la Cámara —cifra literal y verificada con `--red`, pero
implausible para esa partida, posible lapsus del propio orador o error de magnitud del taquígrafo— y
la cifra de armenios residentes en Uruguay hacia 1997). No invento el dato real de ninguno de los
dos: quedan para la segunda vuelta del investigador que dispara `/revisar`.

## Registros que necesitan aprobación humana

Ninguno. No hay casos, no hay giros (no armé ninguno), y ninguna fuente de este lote lleva
`verificacion: manual`.

## Validación

`pnpm validar --inbox inbox/barandiaran/intervenciones/2026-09-09`: 0 errores de esquema, 34 errores
de referencias (los 5 temas y los 2 medios nuevos, admisibles hasta que `/revisar` los copie a
`content/`), 0 avisos propios del lote (los 43 avisos que imprime son de `content/empresas/*`, de
corridas anteriores, no de este lote). Con `--red` (corrido por etapa, `--solo citas` y `--solo
fuentes`, porque el error de referencias corta la corrida completa antes de llegar a esas etapas):
138/138 citas exactas, 97/97 URL verificadas con 0 errores (2 avisos ya esperados: la nota de La
República de `chequeos[10]` devuelve HTTP 403 sin copia en Wayback, y la Ley 16.736 de IMPO no
responde directo pero tiene copia archivada que el validador usa sola).
