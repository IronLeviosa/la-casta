# Razones — corrida 2026-09-07-presentacion-chequeos

Corrección de tipo `presentacion` sobre los diez chequeos ya publicados. No cambia `calificacion`, `afirmacion`, `fragmento`, fuentes de evidencia ni tier de ningún registro; solo agrega `titulo`, separa `analisis` y `dato_real.valor` en párrafos, condensa `dato_real.valor` a cifra+unidad+período+fuente (moviendo a `revision.notas_internas` lo que sobra), y agrega `grafico` donde el chequeo compara cifras.

Una línea por chequeo (`<id>: <titulo> · gráfico: sí/no · párrafos: N` — N cuenta los párrafos de `analisis`):

- lacalle-pou/2021-07-28-ahorro-600-millones-pandemia: Ahorro de US$600 millones "durante la pandemia": el dato oficial cubre solo 2020 · gráfico: no · párrafos: 5
- lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil: Combustibles más baratos que en Brasil: cierto para el gasoil, falso para la nafta · gráfico: sí (nafta y gasoil por litro, Uruguay vs. Brasil, dos series) · párrafos: 5
- lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones: Sobrecostos de USD 1.700 millones en 2015-2019: no hay dato oficial, sí un cálculo privado del mismo orden · gráfico: sí (sobreprecio nafta/gasoil 2015-2019, CED) · párrafos: 4
- lacalle-pou/2022-09-26-astesiano-antecedentes-penales: Astesiano "no tiene antecedentes penales": la prensa documentó dos procesamientos y una condena · gráfico: no (no hay cifras comparables) · párrafos: 3
- lacalle-pou/2023-03-02-75-ciento-contribuyentes-irpf: Baja del IRPF "beneficiará al 75%": el propio gobierno reserva ese verbo para un 47% · gráfico: no (porcentajes anidados del mismo universo, no categorías comparables) · párrafos: 4
- lacalle-pou/2023-03-02-renuncia-fiscal-150-millones: Renuncia fiscal de US$150 millones en la rebaja de impuestos: coincide con el desglose oficial · gráfico: sí (renuncia fiscal por componente: IRPF/IASS/mipymes) · párrafos: 3
- orsi/2024-11-18-iva-2-ciento-tarjetas-debito-2024: "2% de aumento de IVA" en tarjetas: fue un recorte del descuento, la tasa general no cambió · gráfico: no (dato por quintil con brecha de fuente, ver observaciones.md) · párrafos: 5
- orsi/2025-04-25-ancap-41-millones-2019-118-millones-perdida-2024: Ancap: ganancia de US$41 millones en 2019 y pérdida de US$118 millones en 2024, según los balances · gráfico: sí (resultado del ejercicio, 2019 vs. 2024, colorear_por_signo) · párrafos: 3
- orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025: ANCAP en números negativos "después de 10 años": el último ejercicio negativo fue 2020 · gráfico: sí (resultado del ejercicio, 2015-2024, colorear_por_signo; agregó fuente para convertir 2023/2024 a USD) · párrafos: 4
- orsi/2025-04-25-prestamo-160-millones-deuda-255-millones-ancap-2025: Deuda de Ancap "de 255 millones" tras un préstamo de 160: no hay balance a esa fecha que lo confirme · gráfico: sí (deuda financiera vs. pasivo total vs. cifra declarada por Orsi) · párrafos: 4

## Notas de método comunes a varios chequeos

- El único agregado de fuente nueva en todo el lote es la nota de moneda extranjera de los Estados Financieros Individuales de Ancap 2024 (`https://www.ancap.com.uy/20615/1/eecc-individuales-2024.html`, cierre 2023 = 39,022, cierre 2024 = 44,066), leída con `pnpm fuente` en esta sesión y agregada a `dato_real.fuentes` del chequeo `orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025` para poder convertir a USD los resultados de 2023 y 2024 y graficarlos junto a los de 2015 y 2020 (que ya venían en USD, citados de El País). El mismo dato ya estaba citado, de forma independiente, en `orsi/2025-04-25-ancap-41-millones-2019-118-millones-perdida-2024`.
- En los seis chequeos con `grafico`, todos los puntos usan cifras que ya estaban en `dato_real` (propio o, en el caso anterior, con la única fuente nueva del lote); ningún gráfico se armó con un número no sourced.
- No se agregó `grafico` a `lacalle-pou/2023-03-02-75-ciento-contribuyentes-irpf` (75%/47%/14% son subconjuntos anidados del mismo universo, no categorías comparables en barras) ni a `orsi/2024-11-18-iva-2-ciento-tarjetas-debito-2024` (ver observaciones.md: uno de los datos por quintil no tiene cita que lo respalde) ni a `lacalle-pou/2022-09-26-astesiano-antecedentes-penales` (no hay cifras que comparar).

## Modelo

Esta corrida corrió en Sonnet (`claude-sonnet-5`), por decisión del mantenedor y no por la tabla de modelos por rol de `CLAUDE.md` (que fija Fable para el editor). Queda registrado en `_investigacion.modelo` de cada chequeo del inbox, sin tocarlo: ya venía así en el crudo de esta corrida de reparación.
