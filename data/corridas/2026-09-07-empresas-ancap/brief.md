# Brief de investigación · corrida 2026-09-07-empresas-ancap

Regla 0: objetividad por encima de todo. Esta corrida abre una colección nueva, `empresas` (empresas públicas y entes del Estado), y ANCAP es la primera ficha porque un lector la pidió al ver un chequeo sobre sus balances. El criterio va a ser el mismo para OSE, UTE, ANTEL y las demás: qué es, qué hace, cómo le va con la plata de todos, y qué dicen a favor y en contra de su diseño. Sobre el monopolio de ANCAP hay un debate público con argumentos de los dos lados; se documentan los dos con sus fuentes, y las cifras se registran como cifras, sin verbos de intención ni adjetivos. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Sujeto
- slug: `ancap` · ANCAP, Administración Nacional de Combustibles, Alcohol y Portland
- alias: ANCAP, Ancap, la petrolera estatal, la refinería de La Teja
- Existe `content/medios/ancap.yaml` (ANCAP como publicadora de sus documentos); esta ficha es otra cosa: la empresa como sujeto.

## 2. Encargo

Escribí `inbox/empresas/ancap/2026-09-07/empresas.yaml` con un solo registro, con esta forma (los campos con `_` los quita `pnpm promover`; no escribas tier, procedencia ni id):

```yaml
- _slug: ancap
  _investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}
  nombre: ANCAP
  nombre_completo: Administración Nacional de Combustibles, Alcohol y Portland
  tipo: empresa_publica            # empresa_publica | ente_autonomo | servicio_descentralizado | sociedad_estatal
  creacion:
    fecha: 1931-10-15               # o YYYY-MM si no hay día
    norma: Ley 8.764
    fuentes: [Fuente]               # el texto de la ley en impo.com.uy o parlamento.gub.uy
  que_hace: >-
    Dos a cuatro oraciones neutrales, cada una respaldada por las fuentes de abajo: refinación, importación, distribución mayorista, portland, alcoholes, participaciones.
  que_hace_fuentes: [Fuente]
  monopolio:
    tiene: true
    alcance: >-
      Qué actividades tiene reservadas por ley (importación y refinación de crudo, importación de derivados, etc.), con las modificaciones (leyes posteriores, referéndum de 2003 sobre la ley 17.448, LUC 2020).
    normas: [{norma: Ley 8.764 art. N, fuentes: [Fuente]}, ...]
    argumentos_a_favor: [{texto: >- (una idea, en palabras de quien la sostiene o resumida sin adjetivos), quien: (organismo, partido, persona, informe), fuentes: [Fuente]}, ...]
    argumentos_en_contra: [{texto, quien, fuentes}, ...]
  finanzas:
    - anio: 2015
      resultado_ejercicio: {pesos: 0, usd: 0, tipo_cambio: cierre|promedio, fuentes: [Fuente]}   # de los estados financieros auditados (individuales), con la nota de tipo de cambio
      transferencias_al_estado: {usd: 0, concepto: (aportes a Rentas Generales, dividendos, impuestos específicos), fuentes: [Fuente]}   # si consta; si no, omitir el campo y decirlo en notas.md
      capitalizaciones_del_estado: {usd: 0, fuentes: [Fuente]}   # si el Estado puso plata (por ejemplo 2015-2016)
      deuda_financiera: {usd: 0, fuentes: [Fuente]}
    # ... un ítem por año, 2015 a 2024 inclusive; los años que no consigas, omitidos y explicados
  precios_vs_paridad:
    descripcion: >-
      Qué es el precio de paridad de importación (PPI) de URSEA y qué mide la diferencia con el precio de venta.
    series: [{anio: 2015, nafta_usd_millones: 0, gasoil_usd_millones: 0, fuentes: [Fuente]}, ...]   # solo si sale de una fuente oficial (URSEA) o de un cálculo publicado con su autor; decí cuál
  comparaciones: [{con: (Petrobras, ENAP, Petropar, YPF...), indicador: (margen de refinación, costo por barril, precio al público...), valor_ancap: '', valor_par: '', periodo: '', fuentes: [Fuente]}, ...]   # solo con fuente que compare; nada calculado por vos
  fuentes: [Fuente]   # generales
```

Cómo trabajar, en este orden:
1. Corpus primero: `pnpm corpus:buscar "ANCAP balance" --desde 2015-01-01` y variantes (resultado del ejercicio, pérdida, ganancia, capitalización, Rentas Generales, monopolio, paridad de importación, refinería).
2. Balances: `ancap.com.uy` (sección institucional / transparencia / estados contables), `ain.gub.uy` (Auditoría Interna de la Nación, estados financieros de entes), `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=ancap`), Rendición de Cuentas (MEF, `mef.gub.uy`) para transferencias al Estado, y las versiones taquigráficas del Parlamento donde ANCAP presentó resultados. Cada año con su PDF leído con `pnpm fuente` y una cita literal del renglón del resultado y de la nota de tipo de cambio. El chequeo `content/chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025.yaml` ya tiene 2019, 2020, 2023 y 2024 con sus fuentes: reusalas y completá los años que faltan.
3. Marco legal: la Ley 8.764 y sus artículos sobre el monopolio (impo.com.uy), la ley 17.448 de 2001 (asociación de ANCAP) y su derogación por referéndum en diciembre de 2003 (Corte Electoral), la LUC (Ley 19.889, 2020) en lo que toca a combustibles (mecanismo de precios, comisión de expertos), y el informe de esa comisión si existe.
4. Argumentos: de los dos lados, en palabras de quien los sostiene, con fuente cada uno (Presidencia, ANCAP, sindicato Fancap, partidos, informes de URSEA, CED, academia, prensa). Mismo esfuerzo para cada lado; si un lado te cuesta más encontrarlo, decilo en `notas.md`.
5. Comparaciones: solo lo que una fuente compare (informes de consultoras contratadas por el Estado, URSEA, organismos regionales, prensa especializada con datos). Nada calculado por vos.
6. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## anios_sin_balance` y `## medios_faltantes`.

## 3. Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Leé barato (`--buscar`, `--desde`, `--indice`).
2. `cita` es copia literal y contigua de lo que devolvió `pnpm fuente`.
3. Preferí documento oficial (estados contables, leyes, Rendición de Cuentas, URSEA, Parlamento). La prensa es `reportado`.
4. No escribas tier, procedencia ni id. No toques `content/`.
5. Pistas cruzadas sobre políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<politico>.yaml`.
6. No investigues casos judiciales (el caso ANCAP de 2017-2019 con Sendic aparece: una línea en `casos_vistos`, nada más).
7. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.

## 4. Salida esperada
Carpeta `inbox/empresas/ancap/2026-09-07/` con `empresas.yaml` (un registro), `consultas.jsonl` y `notas.md`. Informe final: qué años de balance conseguiste y de dónde, qué encontraste sobre transferencias al Estado y capitalizaciones, cuántos argumentos de cada lado, qué comparaciones con fuente, el modelo con el que corriste, y objeciones al brief si las hubo.
