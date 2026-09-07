# Brief de investigación · corrida 2026-09-07-empresas-ancap-segmentos

Regla 0: objetividad por encima de todo. Esta corrida completa la ficha publicada de ANCAP (`content/empresas/ancap.yaml`) con dos series que un lector pidió: los resultados por segmento de negocio (qué parte de la empresa gana y cuál pierde) y la evolución del precio de venta contra el precio de paridad de importación. El mismo criterio vale para cualquier empresa pública. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## Encargo

Leé con `Read` la ficha publicada y su esquema (`src/schemas/empresa.ts`: campos `finanzas[].segmentos[]` y `precios_vs_paridad.series[]` con `periodo`, `producto`, `precio_venta`, `paridad`, `unidad_precio`, `diferencia_usd_millones`). Entregá en `inbox/empresas/ancap/2026-09-07-segmentos/empresas.yaml` una copia de la ficha con `_slug: ancap` y `_investigacion`, sin tocar `resumen`, `revision` ni los argumentos, con:

1. **Segmentos, año por año (2015-2024).** Los Estados Financieros Individuales de ANCAP traen información por segmento de negocio (combustibles/refinación, portland, alcoholes y otros, o como los nombre cada balance: leé la nota de "información por segmentos"). Por cada año y segmento, `segmentos[].resultado` como `Monto` (pesos tal como figura; USD al tipo de cambio de cierre que el mismo balance declara; `unidad: millones` con un decimal), `fuentes` con la cita literal del renglón. Si un año no tiene la nota de segmentos, decilo en `nota` de ese año y en `notas.md`. Reusá las URL de los balances que ya están en la ficha: ya se leyeron y están en el corpus.
2. **Precio de venta contra paridad de importación.** La planilla oficial de URSEA "Series PPI vs PE" (Excel, ya leída en la corrida 2026-09-07-lacalle-pou-brasil-serie; está en el corpus) trae, mes a mes desde 2002, el precio de venta al público y el precio de paridad de importación por producto. Armá `precios_vs_paridad.series` con un ítem por año y producto (nafta Súper 95 y gasoil 50S al menos), `precio_venta` y `paridad` como promedio anual en la unidad que declares (`unidad_precio: "pesos por litro"` o "USD por litro", con el tipo de cambio de la misma corrida), `fuentes` con la planilla y, si la usás, la fuente del tipo de cambio. Escribí el método en `notas.md` `## metodo` para que cualquiera lo reproduzca. Si el CED o ANCAP publican la diferencia agregada en millones de dólares para un período, `diferencia_usd_millones` con su fuente, en ítems aparte por período.
3. `precios_vs_paridad.descripcion`: dos oraciones que digan qué es el PPI de URSEA y qué mide la diferencia, sin adjetivos.

## Reglas duras
1. Toda página, PDF, planilla o API que cites se lee con `pnpm fuente` (planillas y API con `WebFetch` y `verificacion: manual`, como en la corrida de Brasil). Nunca cites una URL que no abriste en esta sesión.
2. Citas literales y contiguas. No toques `content/`. No escribas tier ni resumen.
3. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## metodo` y `## anios_sin_segmentos`.
4. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.

## Salida esperada
Carpeta `inbox/empresas/ancap/2026-09-07-segmentos/` con `empresas.yaml`, `consultas.jsonl`, `notas.md`. Informe: qué años tienen segmentos y cuáles no, qué productos y años cubre la serie de paridad, el modelo con el que corriste, objeciones al brief.
