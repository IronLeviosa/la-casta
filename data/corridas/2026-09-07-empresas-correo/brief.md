# Brief de investigación · corrida 2026-09-07-empresas-correo

Regla 0: objetividad por encima de todo. Esta corrida arma la ficha de Correo Uruguayo en la colección `empresas` con el mismo criterio que la de ANCAP (`content/empresas/ancap.yaml`, leela como modelo): qué es, qué hace, cómo le va con la plata de todos, y qué dicen a favor y en contra de su diseño. Las cifras se registran como cifras, sin adjetivos ni verbos de intención; si hay actividades reservadas por ley, los argumentos a favor y en contra se documentan con el mismo esfuerzo, en palabras de quien los sostiene, y el esquema no valida un solo lado. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Sujeto
- slug: `correo` · Correo Uruguayo, Administración Nacional de Correos
- alias: ANC, Correo Uruguayo, el Correo
- tipo: servicio_descentralizado (verificalo en su ley)
- Si existe `content/medios/correo.yaml` es Correo Uruguayo como publicadora; esta ficha es la empresa como sujeto.

## 2. Encargo

Escribí `inbox/empresas/correo/2026-09-07/empresas.yaml` con un solo registro que valide contra `src/schemas/empresa.ts` (leé el esquema; es la forma exacta) y siguiendo la sección "Empresas públicas" de tu archivo de rol: `nombre`, `nombre_completo`, `tipo`, `alias`, `creacion` (fecha, norma, fuentes), `que_hace` + `que_hace_fuentes`, `monopolio` (`tiene`, `alcance`, `normas`, `argumentos_a_favor`, `argumentos_en_contra`), `finanzas[]` (un ítem por año 2015-2024: `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`, `segmentos[]` correspondencia, paquetería, servicios financieros o como los nombre cada balance, si los estados contables informan por segmento; `nota` de una oración cuando haga falta), `comparaciones[]` (solo lo que una fuente compare: costo del servicio postal universal o subsidio por habitante contra correos de la región (UPU, prensa con datos; solo lo que una fuente compare); la fuente es la de quien hizo la comparación, porque la página la imprime como autor; si una misma fuente publica un análisis con varias cifras, no va como filas sueltas: va como un registro de `analisis.yaml` en la misma carpeta, con la forma de `src/schemas/analisis.ts` y `calificacion: discutible` como marcador en cada afirmación, porque califica el editor), `hitos[]` (la línea de tiempo: creación, leyes que cambiaron el negocio, crisis, capitalizaciones, reestructuras; cada hito con fecha, título de una línea y fuente), `fuentes[]`. Los montos `usd` en millones con un decimal (`unidad: millones`) y `tipo_cambio: cierre` con la cotización que declare el propio balance.

Cómo trabajar, en este orden:
1. Corpus primero: `pnpm corpus:buscar "Correo Uruguayo balance" --desde 2015-01-01` y variantes (resultado, pérdida, Rentas Generales, subsidio, servicio postal universal, área reservada, paquetería, comercio electrónico, deuda).
2. Balances: el sitio de la empresa (institucional / transparencia / estados contables auditados), `ain.gub.uy`, `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=correo`), Rendición de Cuentas del MEF para transferencias a Rentas Generales, versiones taquigráficas del Parlamento donde la empresa presentó resultados. Cada año con su PDF leído con `pnpm fuente` y cita literal del renglón del resultado, del total de impuestos y de la nota de tipo de cambio.
3. Marco legal: la ley que transformó la Dirección Nacional de Correos en Administración Nacional de Correos (verificá número y año en impo.com.uy) y la ley de regulación del mercado postal (Ley 19.009 de 2012): qué es el servicio postal universal y qué quedó reservado, en `impo.com.uy`. Sobre el monopolio: verificá qué tiene reservado hoy por ley (servicio postal universal, área reservada) y en qué compite con operadores privados (paquetería, courier); documentá los argumentos a favor y en contra de la reserva. Regulador: URSEC.
4. Argumentos: de los dos lados, en palabras de quien los sostiene, con fuente cada uno (Presidencia, la empresa, su sindicato, partidos, el regulador, cámaras privadas, academia, prensa). Mismo esfuerzo para cada lado; si un lado te cuesta más, decilo en `notas.md`.
5. Comparaciones: solo lo que una fuente compare. Nada calculado por vos.
6. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## anios_sin_balance`, `## anios_sin_segmentos`, `## medios_faltantes`.

## 3. Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Leé barato.
2. `cita` es copia literal y contigua.
3. Preferí documento oficial (estados contables, leyes, Rendición de Cuentas, regulador, Parlamento). La prensa es `reportado`.
4. No escribas tier, procedencia, id ni `resumen` (los pone el editor). No toques `content/`.
5. Pistas cruzadas sobre políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<politico>.yaml`.
6. No investigues casos judiciales; si aparecen, una línea en `casos_vistos`.
7. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
8. Al cerrar, `pnpm validar --inbox inbox/empresas/correo/2026-09-07` (los únicos errores admisibles son medios que el editor va a crear).

## 4. Salida esperada
Carpeta `inbox/empresas/correo/2026-09-07/` con `empresas.yaml`, `consultas.jsonl` y `notas.md`. Informe final: qué años de balance conseguiste, qué encontraste sobre transferencias y capitalizaciones, qué años tienen segmentos, cuántos argumentos de cada lado, qué comparaciones con fuente, el modelo con el que corriste, objeciones al brief.
