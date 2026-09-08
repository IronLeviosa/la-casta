# Brief de investigación · corrida 2026-09-07-analisis-ced-ancap-paridad

Regla 0: objetividad por encima de todo. Esta corrida convierte en un registro de `analisis.yaml` el análisis del Centro de Estudios para el Desarrollo (CED) sobre el precio de los combustibles frente a la paridad de importación, publicado por El Observador, que hoy está en la ficha de ANCAP como cuatro filas de `comparaciones[]`. Un lector señaló lo obvio: un análisis así merece página propia, con cada cifra cotejada contra el documento oficial. El criterio es el mismo para cualquier análisis de cualquier autor sobre cualquier gobierno: se verifica lo que dice, no a quién favorece. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Sujeto
- Empresa: `ancap` (ficha publicada en `content/empresas/ancap.yaml`; leé sus `comparaciones[]` y las fuentes de cada una: ahí están las URL de El Observador y las citas ya verificadas).
- Autor del análisis: CED. `autor_es`: qué es el CED y qué vínculos documentados tiene (la ficha de ANCAP y el chequeo publicado sobre sobrecostos de combustibles ya registran uno con fuente; usalo con su cita, sin adjetivos).
- Publicado en: la nota de El Observador de 2022 que ya está en la ficha (`https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150`), leída con `pnpm fuente`.

## 2. Encargo

Escribí `inbox/empresas/ancap/2026-09-07-analisis-ced/analisis.yaml` con un solo registro que valide contra `src/schemas/analisis.ts` (leé el esquema y la sección «Análisis de terceros» de tu archivo de rol), con `_slug: ced-sobreprecio-combustibles-paridad`, `empresa: ancap`, `fecha` de publicación de la nota, `publicado` (la nota, con cita de su título o primera oración), `resumen` (qué sostiene el análisis, en sus términos), `metodo` (cómo dice el CED que calculó, si la nota lo dice), y una `afirmaciones[]` por cada cifra del análisis: los dos períodos (2010-2014 y 2015-2019), nafta y gasoil, y cualquier otra cifra concreta que la nota atribuya al CED. Para cada afirmación:

1. `afirmacion` como dato concreto y `fragmento` literal de la nota.
2. `dato_real`: qué dice la fuente oficial. La planilla de URSEA «Series PPI vs PE» (precio de paridad de importación y precio de venta, mes a mes desde 2002) está en el corpus y ahora `pnpm fuente` la imprime como filas separadas por tabulador: buscala con `pnpm corpus:buscar "PPI" --medio ursea` o con la URL que figura en el chequeo `content/chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil.yaml`. Con esa planilla, reconstruí la brecha anual entre precio de venta y paridad por producto para 2010-2019 y escribí en `notas.md` `## metodo` cómo lo hiciste, paso a paso, para que cualquiera lo repita. Citá las filas de la planilla que usaste (la cita es la fila tal como la imprime `pnpm fuente`). Si el CED o ANCAP publicaron el cálculo en un documento propio (informe del CED, presentación de ANCAP, versión taquigráfica), leelo y citalo también.
3. `calificacion: discutible` como marcador en todas: califica el editor.
4. Si tu reconstrucción da un número distinto al del CED, no lo escribas como «el CED se equivocó»: escribí las dos cifras, el método de cada una y en qué difieren los supuestos (tipo de cambio, volúmenes, impuestos incluidos o no), en `dato_real.valor`.

También `graficos[]`: un gráfico de líneas con el precio de venta y la paridad por producto para 2010-2019 (color por producto, trazo continuo el precio y punteado la paridad), con los puntos anuales que reconstruiste y la planilla como fuente de la serie, con `nota` de dos oraciones y `metodo` con el detalle.

## 3. Reglas duras
1. Toda página, PDF o planilla que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión.
2. `cita` es copia literal y contigua; en una planilla, una fila completa tal como la imprime `pnpm fuente`.
3. No escribas `revision`, `procedencia`, `id` ni `veredicto` (los pone el editor). No toques `content/`.
4. No investigues casos judiciales.
5. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
6. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## metodo`.
7. Al cerrar, `pnpm validar --inbox inbox/empresas/ancap/2026-09-07-analisis-ced`.

## 4. Salida esperada
Carpeta `inbox/empresas/ancap/2026-09-07-analisis-ced/` con `analisis.yaml`, `consultas.jsonl` y `notas.md`. Informe final: cuántas afirmaciones cargaste, cuáles pudiste reconstruir con la planilla de URSEA y cuáles no, qué diferencias encontraste entre tu reconstrucción y las cifras del CED, el modelo con el que corriste, objeciones al brief.
