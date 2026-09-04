# Razones de edición — corrida 2026-09-04-lacalle-pou-economia-impuestos

Editor: comando `/revisar` (Fable, `claude-fable-5-1`), 2026-09-04. Crítico: Opus (`critica.md`).
Lote editado junto con `2026-09-04-lacalle-pou-economia-combustibles` y `2026-09-04-lacalle-pou-transparencia-corrupcion`, porque los tres comparten la promesa del 30/03/2019.

Nota sobre `crudo/`: la copia en `crudo/` se tomó después de la ronda de correcciones que los investigadores aplicaron a pedido de la crítica (ver `notas.md`, secciones `correcciones_por_critica` y `correcciones_post_validacion`), así que `edicion.diff` contiene solo lo que cambió después: decisiones del editor y ajustes finales. Lo que ya estaba corregido en el crudo se menciona acá solo cuando hace falta para entender una decisión.

Nota sobre `procedencia.modelo` de los registros del investigador: el investigador no dejó el id del modelo en `notas.md`; `claude-sonnet-5` sale de las transcripciones de la sesión en que se lanzaron los tres investigadores (`.claude/agents/investigador.md` declara `model: sonnet`). Los giros, casos y chequeos llevan `claude-fable-5-1` porque los escribió el editor.

## Regla 0

Ningún mensaje de la sesión pidió calificar u omitir según partido o persona. El umbral aplicado a las tres promesas de este lote es uno solo y se aplicaría igual a cualquier político: una promesa formulada en términos absolutos ("se terminó… Se terminó") se juzga por su letra, y el balance neto (rebajas, transitoriedad, excepciones) se escribe completo en la fundamentación y en las evidencias, nunca se omite. Si un lector prefiere leer el saldo neto, lo tiene en el mismo bloque.

## Decisiones editoriales

1. **La promesa compuesta del 30/03/2019 se parte en tres** (impuestos, tarifas públicas, combustibles), con el mismo `origen` en las tres (`critica.md` promesas[0], y promesas[0] de la crítica de combustibles). Motivo: la cita nombra tres objetos distintos; publicar un solo estado bajo "impuestos" cuando el incumplimiento más claro es de tarifas (que no son un impuesto) induciría a error, y a la inversa una rebaja de IRPF lavaría un incumplimiento tarifario. Cada componente se califica con su propia evidencia: `no-aumentar-impuestos` y `no-aumentar-tarifas-publicas` en este lote, `no-aumentar-combustibles` en el lote de combustibles. La declaración de origen se publica una sola vez, bajo el tema padre `economia` (id `lacalle-pou/2019-03-30-termino-aumento-impuestos-tarifas-combustibles`), y los giros de los dos lotes la referencian; en el lote de combustibles se retiró su duplicado.
2. **Tema nuevo `economia/tarifas-publicas`** (`content/temas/economia/tarifas-publicas.yaml`, creado por el editor con autorización expresa del mantenedor). Se prefirió a `empresas-publicas` para que los tres componentes de la misma frase cuelguen del mismo padre y aparezcan juntos en la página de economía; `empresas-publicas` sigue cubriendo la gestión de los entes.
3. **`no-aumentar-impuestos` → `incumplida`, tier `publicado`.** Dos hechos contradicen la letra: el recorte a la mitad de la exoneración de IVA por pago con tarjeta (11/03/2020; IVA efectivo de 18% a 20% con débito, recaudación adicional estimada por el gobierno en US$ 40 millones) y la creación por ley 19.874 del "Impuesto Emergencia Sanitaria COVID-19" más un adicional al IASS (abril de 2020, transitorio, sobre remuneraciones y pasividades públicas superiores a $120.000). Del otro lado, actos de igual rango: ley 20.124 (rebaja de IRPF e IASS, marzo de 2023) y decreto 65/023 (régimen ficto de IRAE). El crítico sugirió `incumplida` "por poco" y dejó abierta `cumplida` como defendible; se eligió `incumplida` por la regla de umbral de arriba, con las dos lecturas de cada evidencia escritas en su descripción. Las autoevaluaciones del propio gobierno se registran como `neutral` (crítica evidencias[3] y [5]): no prueban cumplimiento.
4. **`no-aumentar-tarifas-publicas` → `incumplida`, tier `publicado`.** UTE +10,5%, OSE +10,7%, Antel +9,78% desde el 1/04/2020, anunciadas a once días de asumir, con tres fuentes de tres grupos. La defensa ("adecuación por debajo de los costos", criterio fijado por él mismo el 04/12/2019) se publica completa como evidencia `neutral` y en la fundamentación; explica el porqué, no cancela el hecho. Pendiente y anotado: costos de UTE/OSE/Antel y serie 2021-2025.
5. **Giro `no-subir-impuestos-iva-tarjetas-2020`: `cambio_parcial` + `justificado_por_contexto`, `publicado`.** Antes: "se terminó el aumento de impuestos" (30/03/2019). Después: "Se toma porque el déficit es grande" (11/03/2020) sobre el recorte de la exoneración de IVA. Parcial y no total porque las dos lecturas (se recortó un beneficio / el contribuyente paga más IVA) son sostenibles con los mismos hechos. Justificado por contexto y no reconocido: adujo una circunstancia (el déficit heredado, la omisión del gobierno saliente de ajustar en enero) y en ningún momento dijo haber cambiado de posición; el criterio "acompañar los costos no es aumento para recaudar" es anterior al hecho (04/12/2019, video). Coincide con el veredicto sugerido por el crítico. La frase "se súper cumplió" es de Alfie (OPP) y no se atribuye a Lacalle Pou.
6. **Giro `no-subir-impuestos-reiteracion-2020`: `sin_cambio`, `publicado`.** 30/03/2019 → 26/08/2020 ("no vamos a aumentar los impuestos", presentación del Presupuesto). La consistencia se publica; el análisis deja escrito que la reiteración es posterior al recorte de IVA y a la ley 19.874 y no los menciona.
7. **No se armó el "Giro 2" del crítico (promesa → Impuesto COVID).** Un giro exige dos declaraciones del político; no hay ninguna declaración suya sobre ese tributo. El hecho se computa como evidencia `en_contra` de la promesa, con las dos lecturas que pidió el crítico (evidencias[1]).
8. **Mención a Daniel Martínez (04/12/2019): `publicado`, `sentido: neutral`.** Nivel textual (video con marca de tiempo). Se conserva la salvedad "esto no lo vamos a poder probar nunca" dentro de la cita, que no puede recortarse (crítica menciones[0]). El crítico propuso `negativo`; se mantiene `neutral` porque la frase es un contrafáctico sobre qué habría hecho el rival, no una crítica a Martínez. `content/referentes/daniel-martinez.yaml` existe.
9. **Ningún chequeo en este lote.** Las cifras chequeables (US$ 600 millones de ahorro; 80.000 contribuyentes; US$ 150 millones de renuncia fiscal; "se bajaron los impuestos a las pymes") no tienen en el lote un documento oficial con el dato real (DGI, MEF, OPP). Sin documento solo cabría `discutible`, y un `discutible` sin dato real no informa; quedan como candidatos en `notas_internas` de cada declaración y en las hipótesis.

## Cambios entre `crudo/` y lo promovido (una línea por cambio)

### declaraciones.yaml

- [0] 2019-03-30 · `tema` `economia/impuestos` → `economia`; `resumen` amplía que la frase agrupa tres objetos y que las dos fuentes transcriben con distinto orden de sustantivos, sin transcripción del audio; `tier: publicado` (dos grupos: fontaina-de-feo, werthein-hochbaum). Crítica declaraciones[0] y promesas[0]. El video del acto (Subrayado remite a él, discurso desde el minuto 14) no se transcribió: pendiente anotado.
- [1] 2019-11-14 · `resumen` reescrito: la frase "no piensa incrementar los impuestos" se atribuye a Infobae como paráfrasis y se agrega el contrapunto de Martínez ("los impuestos no van a variar"); `tier: publicado`. Crítica declaraciones[1].
- [2] 2019-12-04 "acompañar los costos" · sin cambio de contenido; `tier: publicado` (textual, video con marca 1:03). Registro agregado por el investigador tras la crítica declaraciones[2].
- [3] 2019-12-04 "dijeron que no iban a aumentar" · `tier: publicado` (textual).
- [4] 2020-03-11 · `tier: publicado`; `notas_internas` sobre la fecha (El Observador 12/03 dice "este miércoles"; la diaria publica el 11/03). El resumen ya venía corregido por el investigador (crítica declaraciones[3]: "se súper cumplió" es de Alfie).
- [5] 2020-08-26 · `tier: publicado` (monte-carlo-romay-salvo + fontaina-de-feo). Agregada por el investigador tras la objeción de lote 1.
- [6] "tercamente" · `fecha` 2021-07-29 → 2021-07-28 (fecha de la entrevista según El Observador; la diaria publicó el 29; crítica declaraciones[5]); `resumen` agrega la refutación de Kechichian en la misma nota y que la cifra de ahorro no está verificada; `tier: publicado`.
- [7] "impuesto más jorobado" · `tema` → `economia/inflacion` (es una metáfora sobre la inflación, no una posición tributaria); `resumen` lo aclara; `tier: probable` por fuente única (werthein-hochbaum). Crítica declaraciones[6].
- [8] 2023-03-02 · `resumen` agrega que encuadró la baja del IASS como compromiso de campaña y anunció beneficios a mipymes (crítica declaraciones[7]); `tier: publicado` (documento oficial); nota: presidencia.gub.uy es órgano del propio gobierno, el primario neutral es el diario de sesiones.
- [9] 2024-06-21 · `resumen` agrega que en el mismo discurso reconoció que las medidas para el litoral "no han sido suficientes" (crítica declaraciones[8]); `tier: publicado`; nota: el acto de gobierno detrás es el decreto 65/023.

### promesas.yaml

- [0] `texto` acotado al componente impuestos, con remisión a las otras dos promesas; `estado: incumplida`; `fundamentacion` nueva (ver decisión 3); `tier: publicado`.
- [0].evidencias[0] 2020-03-11 · descripción reescrita solo sobre el IVA en tarjetas, con los números (18%→20%, 9→5 puntos, US$ 40 millones) y las dos lecturas; la cita de El Observador cambiada al pasaje con esos números; el ajuste de tarifas pasa a la promesa de tarifas. Crítica evidencias[0].
- [0].evidencias[1] 2020-04-08 · descripción con artículos 3, 7 y 10 de la ley 19.874, adicional al IASS y las dos lecturas; nivel `textual` con IMPO (dos citas) más Montevideo Portal como secundaria; `_faltante` quitado (textual no exige dos grupos). Crítica evidencias[1]. La fuente IMPO la agregó el investigador; `content/medios/impo.yaml` se dio de alta aparte (`[semilla medio-impo]`).
- [0].evidencias[2] 2020-06-17 · descripción precisa (adicional al IASS, US$ 8 millones según Arbeleche; la versión del mensaje privado a Cofe no se registra como declaración). Crítica evidencias[2] y declaraciones[4] (bloqueante, ya resuelta por el investigador al retirar esa "declaración").
- [0].evidencias[3] · `fecha` 2021-07-29 → 2021-07-28; `efecto` a_favor → neutral (autoevaluación del promitente, contestada en la misma nota). Crítica evidencias[3].
- [0].evidencias[4] 2023-03-02 · `tipo` ley → accion_de_gobierno (es el anuncio del proyecto); descripción en condicional ("alcanzaría"). Crítica evidencias[4].
- [0].evidencias[5] 2023-03-02 decreto 65/023 y [6] 2023-03-24 ley 20.124 · agregadas por el investigador (IMPO, textual); `_faltante` quitado en ambas; descripción de [6] sin la remisión interna redundante.
- [0].evidencias 2025-02-13 (balance de Arbeleche) · **retirada**: fuente única (grupo-infobae), `tipo: dato_oficial` incorrecto para una nota de prensa, y autoevaluación de una tercera persona sobre el cumplimiento del propio gobierno. Crítica evidencias[5]. El dato que la reemplazaría (presión fiscal DGI/PIB 2019 vs 2024) queda pendiente en `notas_internas`.
- [1] `no-aumentar-tarifas-publicas` · **promesa nueva** creada por el editor al partir la compuesta; `tema: economia/tarifas-publicas`; `estado: incumplida`; evidencias: 04/12/2019 criterio "acompañar costos" (neutral, textual) y 11/03/2020 subas de UTE/OSE/Antel (en_contra; Montevideo Portal + El Observador + la diaria, tres grupos); `tier: publicado`. Crítica promesas[0] y evidencias[0] (tercera fuente de Montevideo Portal con los porcentajes exactos).

### menciones.yaml

- [0] · `revision` agregada (`publicado`, con la nota sobre la cita indivisible y el sentido). Crítica menciones[0].

### giros.yaml (nuevo, del editor)

- `no-subir-impuestos-iva-tarjetas-2020` y `no-subir-impuestos-reiteracion-2020`: ver decisiones 5 y 6. `evidencia_explicacion` del primero: El Observador 12/03/2020 (respuesta sobre el déficit), la diaria 11/03/2020 (omisión del gobierno anterior), video 04/12/2019 (criterio previo).

## Cambios de forma

- `_slug` explícito en todos los registros para que los ids sean legibles; `pnpm promover` quita las palabras vacías (por eso `se-toma-porque-el-deficit-es-grande` queda como `toma-porque-deficit-es-grande`), y los giros referencian los ids ya derivados.
- `_faltante: segunda_fuente` eliminado de evidencias de nivel `textual` (no aplica).
- Fecha unificada 2021-07-28 en el registro y en la evidencia de la promesa (misma entrevista).

## Objeciones del crítico que no se siguieron, y por qué

- declaraciones[0] y [1], "subir a textual con el video del acto / del debate": no se transcribió ningún video en esta edición; los registros salen como `reportado` con dos grupos, que cumple la regla, y el pendiente queda anotado. Igual tratamiento para cualquier otro lote.
- menciones[0], `sentido: desfavorable`: se mantiene `neutral` (decisión 8).
- Objeción de lote 4 (2022 sin registros; 2025-2026 sin palabra propia): no se investigó en la edición; abierta `hipotesis/lacalle-pou/posicion-impuestos-posmandato-2026.yaml`.
- Objeción de lote 5 (impuesto mínimo global, tasa consular, IMESI): abierta `hipotesis/lacalle-pou/impuesto-minimo-global-origen.yaml`; sin verificación en IMPO no puede entrar como evidencia.
- Objeción de lote 7 (Veracímetro): ver decisión 9.
- Objeción de lote 8 (no gravar al capital, abril de 2020): abierta `hipotesis/lacalle-pou/no-gravar-capital-pandemia-2020.yaml`; la frase entrecomillada disponible no enuncia la posición.
- Hipótesis de `notas.md` sobre el discurso ante ADM (2019): abierta `hipotesis/lacalle-pou/impuestos-tarifas-discurso-adm-2019.yaml` (fuente única y retrospectiva).
- Veredicto sugerido "Giro 2" (impuesto covid, `cambio_parcial + sin_explicacion`): no se arma por falta de declaración "después" (decisión 7). Con eso no hay en este lote ningún giro `cambio_total + sin_explicacion`.

## Registros de este lote que necesitan firma del mantenedor

Ninguno: no hay casos, no hay giros `cambio_total + sin_explicacion` y ninguna fuente tiene `verificacion: manual`.

## Cobertura del crítico

Los 18 registros de `cobertura` de `critica.md` no se promueven en esta corrida: 11 de sus eventos son "propuestos" y no existen en `content/eventos/`, y no corresponde crear eventos sin fuentes propias dentro de una edición. Quedan en `critica.md` para una corrida de eventos.
