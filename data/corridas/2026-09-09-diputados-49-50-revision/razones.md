# Razones — edición del lote `inbox/diputados/critica-revision/` (66 fichas)

Corrida: `2026-09-09-diputados-49-50-revision`. Editor en Sonnet (`claude-sonnet-5`), regla 14 de
`CLAUDE.md`. Este archivo cubre `edicion.diff` cuando se corra `pnpm promover`.

## Cambios no triviales

1. **Se quitó `cobertura` de las 66 fichas.** Las 66 son identidad y mandatos sin declaraciones,
   promesas, chequeos ni casos; por instrucción del encargo (adenda 2, punto 11: una ficha de
   identidad sin declaraciones no lleva `cobertura`, la página lo dice sola), se retiró el campo
   para dejarlas iguales a las 91 fichas ya promovidas de `inbox/diputados/todos/`. Se verificó
   antes de borrar que el `texto` era idéntico, palabra por palabra, en las 66 fichas (un párrafo
   de plantilla genérico sin ningún dato propio de la persona) y que ninguna decía algo que el
   lector no tuviera de otra forma: no había nada que preservar en `notas_internas` ni en otro
   campo.

2. **`sanchez-cal-dardo`: se quitó una segunda fuente que probaba otro hecho.** El mandato
   2020-2025 citaba, además de `legislaturas-actuo`, una biografía en PDF (`Bio09464.PDF`) fechada
   2008-07-02 con la cita «Actualmente se desempeña como Representante Nacional por el departamento
   de Treinta y Tres»: esa biografía prueba que en 2008 ya era representante (legislatura anterior,
   no cargada), no que lo fuera en 2020-2025. Es el mismo patrón de «segunda fuente falsa» que la
   crítica objetó en `mujica-gonzalo` (3.25, Wikipedia hablando de 2014 para un mandato
   2020-2025); la crítica no lo señaló para esta ficha en particular, pero el criterio es el mismo
   y se aplicó parejo. La primera fuente (`legislaturas-actuo`) alcanza sola para las fechas del
   mandato.

3. **`irigoin-pedro` (3.26, aviso sin resolver): se sumó la fuente que ya tenía la ficha para el
   cierre del mandato de la L también como fuente del cargo.** La ficha ya citaba el diario de
   sesiones del 08/07/2025 («Renuncia a la banca del señor representante Pedro Irigoin Macari»)
   como fuente de `estado_actual.salida`; se agregó la misma fuente a `mandatos[1].fuentes` (el
   tramo 2025-03-02 → 2025-07-08), porque nombra a la persona como «representante» el mismo día
   que cierra ese tramo, y cierra el aviso de la crítica («ninguna cita trae la línea
   'Representante Nacional por el Lema...' para el tramo de la L»). No hizo falta leer una fuente
   nueva: es la misma cita ya verificada, aplicada también al campo que le faltaba. Con esto la
   ficha pasa de "sin cerrar" a `publicado`.

4. **Tiers: 60 `publicado`, 6 `probable`.** Se aplicó el mismo umbral a las 66 sin distinción de
   partido (comprobado al cierre: de las 6 en `probable`, 2 son del Frente Amplio —
   `melo-ana-laura`, `morel-christian` —, 2 del Partido Nacional — `sanchez-cal-dardo` y, por la
   ficha en sí, ninguna otra —, y las 2 restantes son `lust-eduardo` — Cabildo Abierto — y
   `mier-sergio` — Frente Amplio —; no hay concentración por partido).
   - `lust-eduardo`: **probable** (crítica 3.10, sin resolver por el corrector). Se intentó
     cerrar en esta sesión releyendo con `pnpm fuente` la nómina archivada del 07/03/2023
     (`https://diputados.gub.uy/docs/LegAlfab.pdf`, contenido congelado): la fila que nombra su
     partido («Lust Hitta, Eduardo ... CA ...») existe, pero no es contigua al encabezado que
     permite leer la tabla (más de 1.500 caracteres de distancia en el texto extraído), y citarlos
     juntos habría violado la regla de cita contigua. Se probó también `actuacion-legislador` con
     rango acotado (sin mención de lema) y la página individual (no renderiza del lado del
     servidor, 100 caracteres). Sin fuente citable dentro de la regla de contigüidad, queda
     `probable` con `notas_internas` explicando el hueco.
   - `melo-ana-laura`: **probable** (crítica 3.20, sin resolver por el corrector, confirmado en
     esta sesión: el mismo problema de no-contigüidad que Lust, más páginas individuales que no
     renderizan).
   - `mier-sergio`, `minetti-orquidea`, `morel-christian`, `sanchez-cal-dardo`: **probable** por
     `_faltante: segunda_fuente` en la salida (crítica: «bien marcadas», «es trabajo del
     resolvedor»). Se escribió `notas_internas` puntual para cada una. Para `minetti-orquidea` se
     verificó con `pnpm fuente` que la fecha de salida que trae la ficha (01/01/2023,
     `legislaturas-actuo`) no coincide con la fecha del índice de diario de sesiones que
     `notas.md` había localizado como pista (05/07/2022): se dejó anotado para que el resolvedor no
     dé por buena esa pista sin resolver antes la discrepancia de fecha.
   - Las 60 restantes: **publicado**. Cumplen mandato con fuente que dice el cargo, fechas de la
     fuente (no la plantilla por defecto), y ninguna objeción `bloquea` sin resolver de
     `critica.md` (las 4 bloqueantes — `andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`,
     `goni-rodrigo` — ya habían sido resueltas por el corrector con el diario de sesiones del
     15/02/2020, verificado en la tercera pasada; no se tocó ese trabajo).

## Objeciones de `critica.md` que quedan sin resolver (no las resolví yo)

- **3.10** (`lust-eduardo`, partido sin cita) y **3.20** (`melo-ana-laura`, partido/cargo sin cita
  contigua): quedan en `probable`, ver arriba.
- **4.2** (45 fuentes con la fecha del hecho en vez de la fecha de consulta): sigue sin resolver.
  Es un rediseño transversal de más de 150 fuentes en todo el lote de 156+156 fichas, no algo que
  se corrija ficha por ficha en esta pasada sin arriesgar tocar de más; el corrector ya lo había
  dejado igual en la pasada anterior por el mismo motivo.
- **4.3** (`medio: parlamento` para `documentos.diputados.gub.uy` y
  `biblioteca.parlamento.gub.uy`): requiere editar `content/medios/parlamento.yaml`, fuera del
  alcance de este lote (`content/` no se toca desde acá).
- **4.4** (bandas de ancho cero en `echeverria-solis` y en la primera suplencia de
  `umpierrez-alejo`): es revisión visual de la página construida (`docs/revision-visual.md`), no
  del YAML.
- **4.5** (seis salidas «por pasaje a Intendente» sin la intendencia cargada): decisión de alcance
  ya tomada (lote de intendencias aparte), no se tocó.
- **5.2** (Penadés, `content/politicos/penades.yaml`): documentado por el corrector para que el
  mantenedor lo resuelva por corrección (`cotejo_con_primaria`); no se edita desde este lote porque
  no es un archivo del inbox.
- **5.4** (ids `de-armas-paula`, `de-brum-horacio`, `de-mattos-alfredo`,
  `rodriguez-galvez-carlos`): sin cambios, según indica el encargo (el orquestador ya ajustó
  `promover` para respetar la partícula «de» en un `_slug` explícito).

## Problema de infraestructura detectado al validar (no es un error de contenido)

Al correr `pnpm validar --inbox inbox/diputados/critica-revision --red` varias veces, la URL
`https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`
(la captura de Wayback de la nómina de titulares de la XLIX al 22/07/2024, usada en
`amarilla-gerardo`, `castaingdebat-armando`, `jisdonian-pedro`, `olaizola-juan-jose` y
`lust-eduardo`) devolvió intermitentemente `HTTP 0` y, en las corridas siguientes, `HTTP 404` de
forma consistente. Verifiqué con el índice CDX de Wayback
(`http://web.archive.org/cdx/search/cdx?url=documentos.diputados.gub.uy/docs/LegxPartido.pdf`) que
la captura existe (timestamp `20240722113854`, `200`, `application/pdf`, 34.281 bytes): el
contenido no desapareció, es un problema de servicio de Wayback al reproducir ese PDF puntual en
este momento, el mismo tipo de falla transitoria que la tercera pasada ya había documentado para
una captura hermana (`20230919195148if_`, que en efecto se recuperó en uno de mis reintentos). Las
citas de esas cinco fichas ya están verificadas como exactas contra el texto cacheado en el corpus
(no aparece ningún error de contenido de cita en las corridas de `--red`, solo de disponibilidad en
vivo). No bajé el tier de esas cinco fichas por este motivo: hacerlo solo para ellas, cuando la
misma URL sostiene contenido ya publicado en otras partes del sitio, sería una aplicación desigual
de la regla por una falla de red que no depende del contenido. Recomiendo correr `pnpm archivar`
sobre esa URL puntual cuando el mantenedor lo vea, como sugiere el propio validador.

## Cambios de forma

- Ninguno adicional a los ya descritos arriba (no encontré erratas de fecha, nombre ni `medio:`
  fuera de lo que la crítica ya señaló como pendiente en la sección anterior).
