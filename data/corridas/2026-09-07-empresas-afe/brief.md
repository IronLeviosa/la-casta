# Brief de investigación · corrida 2026-09-07-empresas-afe

Regla 0: objetividad por encima de todo. Esta corrida arma la ficha de AFE en la colección `empresas` con el mismo criterio que la de ANCAP (`content/empresas/ancap.yaml`, leela como modelo): qué es, qué hace, cómo le va con la plata de todos, y qué dicen a favor y en contra de su diseño. Las cifras se registran como cifras, sin adjetivos ni verbos de intención; si hay actividades reservadas por ley, los argumentos a favor y en contra se documentan con el mismo esfuerzo, en palabras de quien los sostiene, y el esquema no valida un solo lado. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Sujeto
- slug: `afe` · AFE, Administración de Ferrocarriles del Estado
- alias: AFE, la empresa ferroviaria estatal
- tipo: empresa_publica o servicio_descentralizado (verificalo en su ley)
- Si existe `content/medios/afe.yaml` es AFE como publicadora; esta ficha es la empresa como sujeto.

## 2. Encargo

Escribí `inbox/empresas/afe/2026-09-07/empresas.yaml` con un solo registro que valide contra `src/schemas/empresa.ts` (leé el esquema; es la forma exacta) y siguiendo la sección "Empresas públicas" de tu archivo de rol: `nombre`, `nombre_completo`, `tipo`, `alias`, `creacion` (fecha, norma, fuentes), `que_hace` + `que_hace_fuentes`, `monopolio` (`tiene`, `alcance`, `normas`, `argumentos_a_favor`, `argumentos_en_contra`), `finanzas[]` (un ítem por año 2015-2024: `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`, `segmentos[]` infraestructura, pasajeros y carga si los estados contables informan por segmento; `nota` de una oración cuando haga falta), `comparaciones[]` (solo lo que una fuente compare: carga transportada, costo por tonelada-kilómetro o subsidio por pasajero contra otros ferrocarriles de la región (CEPAL, ALAF, consultoras contratadas por el Estado o prensa con datos); la fuente es la de quien hizo la comparación, porque la página la imprime como autor), `fuentes[]`. Los montos `usd` en millones con un decimal (`unidad: millones`) y `tipo_cambio: cierre` con la cotización que declare el propio balance.

AFE recibe transferencias del Estado para funcionar: registrá en `capitalizaciones_del_estado` cada aporte anual con su concepto (subsidio, aporte de capital, pago del canon del Ferrocarril Central por el MEF), porque para esta empresa lo que el Estado pone es la cifra principal.

Cómo trabajar, en este orden:
1. Corpus primero: `pnpm corpus:buscar "AFE balance" --desde 2015-01-01` y variantes (resultado, pérdida, Rentas Generales, subsidio, Ferrocarril Central, canon, SLF, pasajeros, carga, UPM, deuda).
2. Balances: el sitio de la empresa (institucional / transparencia / estados contables auditados), `ain.gub.uy`, `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=afe`), Rendición de Cuentas del MEF para transferencias a Rentas Generales, versiones taquigráficas del Parlamento donde la empresa presentó resultados. Cada año con su PDF leído con `pnpm fuente` y cita literal del renglón del resultado, del total de impuestos y de la nota de tipo de cambio.
3. Marco legal: la ley de creación (año 1952; verificá número y fecha en impo.com.uy), la apertura del transporte ferroviario a operadores privados (Ley 19.355 de 2015 y decretos), la creación de Servicios Logísticos Ferroviarios S.A. y el contrato del Ferrocarril Central (participación público-privada, 2019-2023), en `impo.com.uy`. Sobre el monopolio: verificá qué tiene reservado hoy (administración de la infraestructura ferroviaria) y qué se abrió a privados (operación de trenes); el Ferrocarril Central y el canon anual que paga el Estado por la infraestructura tienen argumentos documentados de los dos lados. Regulador: MTOP; la Dirección Nacional de Transporte Ferroviario.
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
8. Al cerrar, `pnpm validar --inbox inbox/empresas/afe/2026-09-07` (los únicos errores admisibles son medios que el editor va a crear).

## 4. Salida esperada
Carpeta `inbox/empresas/afe/2026-09-07/` con `empresas.yaml`, `consultas.jsonl` y `notas.md`. Informe final: qué años de balance conseguiste, qué encontraste sobre transferencias y capitalizaciones, qué años tienen segmentos, cuántos argumentos de cada lado, qué comparaciones con fuente, el modelo con el que corriste, objeciones al brief.
