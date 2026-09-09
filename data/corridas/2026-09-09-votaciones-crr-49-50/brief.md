# Votaciones de la Cámara de Representantes, legislaturas XLIX (2020-2025) y L (2025-)

Fecha: 2026-09-09. Pedido del mantenedor: seguir si los diputados votan como prometieron y, en las
votaciones decididas por pocos votos, quién de la bancada que impulsaba el proyecto votó al revés o
no apareció. Serie completa de las dos legislaturas: se analizan todas y se destacan las ajustadas
(Regla 0: no se eligen «las escandalosas»).

## Cómo se llegó a la lista

1. Inventario de los 368 diarios de sesiones de Diputados en la Hemeroteca de la Biblioteca del Poder
   Legislativo (`.cache/biblioteca-crr-2020-2026.json`, URL estable por PDF).
2. Extracción mecánica de cada diario (`.cache/extraer-votaciones.ts`): resultado literal proclamado
   por la Mesa, asunto en consideración, instancia (general, particular, trámite), si fue nominal, y
   la asistencia de la sesión (presentes, con licencia, faltas con y sin aviso, en el Senado).
3. Ranking por margen contra la mayoría de presentes (`.cache/rankear-votaciones.ts`): ajustada =
   sobraron o faltaron tres votos o menos. Las de trámite (licencias, exposiciones escritas,
   homenajes) quedan fuera. La lista con fecha, sesión, número de votación y asunto está en
   `.cache/votaciones/ajustadas.json` y se copia al final de este brief.

## Qué hace el investigador con cada votación de la lista

- Abre el diario de esa fecha con `pnpm fuente` (URL de la Hemeroteca) y confirma el resultado
  literal (`texto_del_acta`), el asunto (título en lenguaje llano, tipo, carpeta o repartido si consta,
  ley resultante si existe), la instancia y si fue nominal.
- Carga `legisladores[]` con los 99 integrantes de la Cámara en esa sesión a partir del bloque de
  asistencia: presentes (`voto: sin_dato`, `fuente_del_voto: sin_dato`, salvo nominal), con licencia,
  faltas con y sin aviso, en el Senado, y los suplentes convocados (`condicion: suplente`,
  `suple_a`). Partido y departamento de cada uno: de la ficha en `content/politicos/` (corrida
  `2026-09-09-diputados-49-50`) o de su página en parlamento.gub.uy.
- Si la votación fue nominal, carga el voto de cada uno (`fuente_del_voto: nominal`) y verifica que
  los totales coincidan con el resultado.
- Si no fue nominal: busca en prensa (corpus primero, `pnpm corpus:buscar`; después web) la
  posición declarada de cada bancada (`bancadas[]` con fuente) y declaraciones públicas de
  legisladores sobre su propio voto (`fuente_del_voto: declarado`, con la cita). Deduce un voto por
  aritmética solo cuando los totales no dejen otra posibilidad, y lo explica en `nota`.
- `promesas_relacionadas[]`: busca en `content/promesas/` y en el programa o las declaraciones de
  campaña de los legisladores que votaron distinto de su bancada o faltaron; si la promesa no está
  cargada, la escribe en `promesas.yaml` del lote con su fuente.
- `analisis`: qué se votó, margen, cómo votó cada bancada, quiénes se apartaron o faltaron. Sin
  verbos de intención. Lo que la persona explicó en público, en `nota` con fuente. Lo que se rumorea,
  a `hipotesis/`.
- Enlaza la votación al evento de `content/eventos/` al que pertenece (`asunto.evento`), o propone el
  evento en `eventos.yaml` del lote.

## Lotes

Un lote por año (`inbox/votaciones/<año>/`), con `votaciones.yaml`, `promesas.yaml` y `eventos.yaml`
si hacen falta, y `notas.md`.

## Lista de votaciones (se completa al terminar el ranking)


### Grupos de votaciones ajustadas (sesión y asunto), 81 en total

| Fecha | Sesión | Asunto | Votaciones ajustadas | Margen mínimo | Rechazadas | Nominales | Diario |
|---|---|---|---|---|---|---|---|
| 2020-06-02 | 21 | Opiniones acerca del señor presidente | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-06-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0021).pdf) |
| 2020-09-01 | 40 | Violación de las disposiciones sani- | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-09-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0040).pdf) |
| 2020-09-01 | 40 | Cuestión política planteada por el | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-09-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0040).pdf) |
| 2020-10-12 | 45 | Presupuesto Nacional Período 2020-2024. | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-10-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf) |
| 2020-10-15 | 49 | Presupuesto Nacional Período 2020-2024 | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-10-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0049).pdf) |
| 2020-12-15 | 63 | Residencia Fiscal. (Se modifica su | 2 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-12-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0063).pdf) |
| 2021-04-14 | 9 | Impuesto Emergencia Sanitaria-2 | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-04-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0009).pdf) |
| 2021-05-05 | 11 | Llamado a sala a la señora ministra | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-05-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0011).pdf) |
| 2021-06-01 | 16 | Intermedio | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-06-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0016).pdf) |
| 2021-06-16 | 21 | Proyectos sobre tenencia compartida | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-06-16%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0021).pdf) |
| 2021-08-03 | 28 | Empleo para jóvenes de quince a | 5 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-08-03%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0028).pdf) |
| 2021-08-19 | 32 | Rendición de Cuentas y Balance de | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-08-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0032).pdf) |
| 2021-09-22 | 37 | Congreso Nacional de Ediles. (Institu- | 2 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-09-22%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0037).pdf) |
| 2021-09-28 | 38 | Solicitud de intermedio | 1 | 2 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2021-09-28%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0038).pdf) |
| 2022-03-09 | 3 | Solicitud de autorización a la señora | 4 | 2 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2022-03-09%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0003).pdf) |
| 2022-03-09 | 3 | Invasión militar de la Federación de | 4 | 2 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2022-03-09%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0003).pdf) |
| 2022-05-11 | 11 | Llamado a sala a la señora ministra de Economía y Finanzas | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2022-05-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0011).pdf) |
| 2022-06-08 | 19 | Programa Oportunidad Laboral. (Creación de la Fase 2) | 1 | 3 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2022-06-08%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0019).pdf) |
| 2022-12-15 | 55 | Ocupación militar rusa en Ucrania. (Se expresa su condena) | 2 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2022-12-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0055).pdf) |
| 2023-03-15 | 5 | Decreto N° 4056/2022 de la Junta Departamental de Maldonado. (Recurso de | 2 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-03-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0005).pdf) |
| 2023-04-19 | 10 | Intermedio | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-04-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0010).pdf) |
| 2023-05-10 | 16 | Intercambio conjunto bilateral con la Fuerza Aérea Uruguaya. (Se autoriza el | 2 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-05-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0016).pdf) |
| 2023-05-10 | 16 | Comisión Especial de Sobreendeudamiento de Consumidores y Usuarios (Solicitud | 1 | 1 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-05-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0016).pdf) |
| 2023-06-07 | 20 | Llamado a sala al señor ministro del Interior | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-06-07%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0020).pdf) |
| 2023-06-28 | 24 | Estado de situación de los homicidios en Uruguay en 2022 y 2023, situaciones de | 7 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-06-28%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0024).pdf) |
| 2023-07-04 | 26 | Víctimas de hechos ilícitos cometidos por integrantes de grupos armados, por | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-07-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0026).pdf) |
| 2023-07-11 | 28 | Llamado a sala al señor ministro de Ambiente | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-07-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0028).pdf) |
| 2023-07-12 | 29 | Tipificación de ciberdelito. (Normas) | 3 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-07-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0029).pdf) |
| 2023-07-12 | 29 | Donación de alimentos. (Normas) | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-07-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0029).pdf) |
| 2023-08-09 | 32 | Ejercicio Multinacional de Operaciones de Paz MPE 23 Keris Aman II. (Se autoriza | 4 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-08-09%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0032).pdf) |
| 2023-08-17 | 36 | Rendición de Cuentas y Balance de Ejecución Presupuestal Ejercicio 2022. | 5 | 2 | 5 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-08-17%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0036).pdf) |
| 2023-08-17 | 36 | Rendición de Cuentas y Balance de Ejecución Presupuestal Ejercicio 2022 | 2 | 3 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-08-17%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0036).pdf) |
| 2023-10-11 | 45 | Cuestión política planteada por el señor representante Sebastián Valdomir | 1 | 2 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-10-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf) |
| 2023-10-23 | 49 | Propuesta de creación de un fideicomiso. | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-10-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0049).pdf) |
| 2023-11-07 | 52 | Cuestión política planteada por la señora representante Lucía Etcheverry Lima | 4 | 2 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-11-07%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0052).pdf) |
| 2023-11-08 | 53 | Extrabajadores de Casa de Galicia. (Pago de créditos laborales post concursales) | 2 | 0 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-11-08%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0053).pdf) |
| 2023-11-28 | 56 | Partidos Políticos. (Modificaciones a la Ley N° 18.485, de 11 de mayo de 2009, | 4 | 0 | 3 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-11-28%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0056).pdf) |
| 2023-12-05 | 57 | Partidos Políticos (Modificaciones a la Ley N° 18.485, de 11 de mayo de 2009, | 2 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-12-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0057).pdf) |
| 2023-12-12 | 59 | Banco Hipotecario del Uruguay y Agencia Nacional de Vivienda. (Se establecen | 4 | 1 | 3 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-12-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0059).pdf) |
| 2023-12-12 | 59 | Ejercicio multinacional de operaciones de paz "MPE 24" Shanti Prayas IV "SP IV". | 2 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-12-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0059).pdf) |
| 2023-12-14 | 62 | Servicios de difusión de contenido audiovisual. (Regulación) | 14 | 1 | 6 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2023-12-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0062).pdf) |
| 2024-04-03 | 7 | Evento Conjunto de Capacitación de Operaciones Especiales (J-CET). (Se autoriza | 2 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-04-03%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0007).pdf) |
| 2024-05-07 | 14 | Pasado reciente y violaciones de los derechos humanos. (Se crea en el Archivo | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-05-07%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0014).pdf) |
| 2024-06-04 | 18 | Bachillerato virtual para mayores de 18 años. (Se solicita su implementación) | 2 | 3 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-06-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0018).pdf) |
| 2024-07-16 | 22 | Servicios de entrega de bienes o transporte urbano y oneroso de pasajeros. | 6 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-07-16%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0022).pdf) |
| 2024-08-14 | 28 | Protección del trabajo sexual. (Normas) | 3 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-08-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0028).pdf) |
| 2024-09-11 | 36 | Precio de venta por unidad de medida. (Regulación) | 2 | 2 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-09-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0036).pdf) |
| 2025-04-02 | 8 | Vuelta de proyecto a Comisión | 3 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-04-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0008).pdf) |
| 2025-04-02 | 8 | Intermedio | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-04-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0008).pdf) |
| 2025-05-28 | 16 | Ley Orgánica de la Caja de Jubilaciones y Pensiones de Profesionales | 24 | 0 | 23 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-05-28%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0016).pdf) |
| 2025-05-28 | 16 | Intermedio | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-05-28%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0016).pdf) |
| 2025-06-03 | 17 | Iniciativas del nuevo gobierno | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-06-03%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0017).pdf) |
| 2025-06-17 | 21 | Rendición de Cuentas y Balance de Ejecución Presupuestal del Ejercicio 2024. | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-06-17%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0021).pdf) |
| 2025-08-05 | 29 | Economía de las Zonas Fronterizas. (Normas para mitigar las diferencias de los | 16 | 0 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-08-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0029).pdf) |
| 2025-08-12 | 31 | Muerte digna (Regulación) | 1 | 3 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-08-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0031).pdf) |
| 2025-08-13 | 32 | Llamado a sala al señor ministro de Ambiente | 1 | 2 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-08-13%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0032).pdf) |
| 2025-08-19 | ? | Suspensión del Proyecto Neptuno y anuncio por parte del Poder Ejecutivo de las | 3 | 0 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-08-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0033).pdf) |
| 2025-09-02 | 34 | Aplazamiento | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-09-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0034).pdf) |
| 2025-10-10 | 40 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 7 | 0 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0040).pdf) |
| 2025-10-10 | 40 | Presupuesto Nacional Período 2025 - 2029. (Aprobación) | 8 | 0 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0040).pdf) |
| 2025-10-11 | 41 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 10 | 0 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0041).pdf) |
| 2025-10-12 | 42 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 11 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-12%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0042).pdf) |
| 2025-10-13 | 43 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-13%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0043).pdf) |
| 2025-10-13 | 43 | Presupuesto Nacional Período 2025-2029 (Aprobación) | 5 | 0 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-13%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0043).pdf) |
| 2025-10-14 | 44 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 2 | 2 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0044).pdf) |
| 2025-10-14 | 44 | Presupuesto Nacional Período 2025-2029 (Aprobación) | 2 | 2 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0044).pdf) |
| 2025-10-15 | 45 | Presupuesto Nacional Período 2025-2029 (Aprobación) | 16 | 0 | 8 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf) |
| 2025-10-15 | 45 | Presupuesto Nacional Período 2025-2029. (Aprobación) | 69 | 0 | 41 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf) |
| 2025-10-15 | 45 | Presupuesto Nacional Período 2025 - 2029. (Aprobación) | 2 | 2 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-10-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf) |
| 2025-11-04 | 46 | Llamado a sala a la señora ministra de Salud Pública | 2 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-11-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0046).pdf) |
| 2025-11-11 | 48 | Cuestión de fueros | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-11-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0048).pdf) |
| 2025-11-18 | 51 | Llamado a sala al señor Ministro de Educación y Cultura | 1 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-11-18%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0051).pdf) |
| 2025-11-24 | 52 | Intermedio | 1 | 2 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-11-24%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0052).pdf) |
| 2025-12-16 | 1 | Intermedio | 1 | 0 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-12-16%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0001).pdf) |
| 2025-12-16 | 1 | que la actual conducción mayoritaria de la Jutep, a partir de la acción de su presidenta, ha actuado | 2 | 2 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-12-16%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0001).pdf) |
| 2026-02-23 | 4 | Prevención de lavado de activos. (Actualización de la Ley n.o 19.574 y otras | 1 | 1 | 1 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-02-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0004).pdf) |
| 2026-02-23 | 4 | Prevención de Lavado de Activos. (Actualización de la Ley n.o 19.574 y otras | 4 | 1 | 4 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-02-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0004).pdf) |
| 2026-02-23 | 4 | Prevención de lavado de activos. (Actualización de la Ley n.° 19.574 y otras | 2 | 1 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-02-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0004).pdf) |
| 2026-02-23 | 4 | Prevención del Lavado de Activos. (Actualización de la Ley n.o 19.574 y otras | 2 | 2 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-02-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0004).pdf) |
| 2026-04-15 | 12 | Llamado a sala al señor ministro de Desarrollo Social | 2 | 1 | 0 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-04-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0012).pdf) |
| 2026-05-05 | 14 | Situación del sistema de protección de niños y adolescentes bajo tutela del Estado. | 2 | 1 | 2 | 0 | [PDF](https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2026-05-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0014).pdf) |
