# Reglas por colección

Un archivo por colección de `content/`. Cada uno dice qué es la colección, qué campos lleva un registro, cómo se investiga, qué mira el crítico y cómo califica el editor. Son instrucciones para agentes: `pnpm brief` incluye en el brief los de las colecciones que la corrida toca, y el editor y el crítico leen los de las colecciones del lote que reciben, y ninguno más.

Lo que vale para toda colección (Regla 0, contrato de carpetas, fuentes, niveles de evidencia, tiers, procedencia, las reglas 1 a 14) está en `CLAUDE.md` y no se repite acá. Los ejemplos completos de un registro, en la forma en que lo escribe el investigador, están en `docs/ejemplos/`.

| Colección | Archivo | Qué es |
|---|---|---|
| declaraciones | `declaraciones.md` | Qué dijo, cuándo y en qué contexto, con cita literal |
| chequeos | `chequeos.md` | Veracímetro: un dato concreto contra el documento oficial |
| giros | `giros.md` | Dos declaraciones de la misma persona sobre lo mismo, en el tiempo |
| promesas | `promesas.md` | Promesa de campaña contra gestión, escala de Chequeado |
| casos | `casos.md` | Casos judiciales y administrativos con estado y fecha |
| menciones | `menciones.md` | A quién cita, reivindica o critica |
| vetos | `vetos.md` | Observaciones del Poder Ejecutivo y qué hizo el Parlamento después |
| votaciones | `votaciones.md` | Una votación en una cámara, con la sala entera |
| empresas | `empresas.md` | Ficha de una empresa pública, año por año |
| analisis | `analisis.md` | Análisis de terceros con cifras, cotejado afirmación por afirmación |
| discrepancias | `discrepancias.md` | Lo que publicó un medio contra lo que dice el documento |
| correcciones | `correcciones.md` | Cómo cambia un registro ya publicado |
| politicos | `politicos.md` | Fichas de identidad: mandatos, salida, alias |
| presentación | `presentacion.md` | Lo que un registro tiene que traer para que la página se entienda |

Estos archivos forman parte de las instrucciones que recibe cada agente. `pnpm promover` guarda su SHA-256 en `agentes.json` de cada corrida junto con el de `CLAUDE.md`, los roles y los comandos (fase 1.7 del plan), y `/auditar` los recorre buscando instrucciones asimétricas igual que a los demás.
