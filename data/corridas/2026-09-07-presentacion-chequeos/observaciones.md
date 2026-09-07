# Observaciones de fondo — corrida 2026-09-07-presentacion-chequeos

Encontradas al releer los diez chequeos para el trabajo de presentación. No se corrigieron en este lote (el brief lo prohíbe expresamente); quedan para una corrida de fondo.

## lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones

El informe del CED (Boletín Macroeconómico N°27) da, además de la cifra 2015-2019 ya usada en el chequeo, "USD 14 millones y USD 67 millones respectivamente para 2020-2021" de sobreprecio de nafta y gasoil. Esta corrida no verificó contra el PDF original a qué combustible corresponde cada una de las dos cifras (el adverbio "respectivamente" remite a un orden — ¿nafta, gasoil? ¿gasoil, nafta?— que no se confirmó releyendo la fuente). Por eso el gráfico agregado en esta corrida usa solo 2015-2019 (única cifra con atribución inequívoca) y no los otros dos quinquenios. Para cerrarlo: releer el PDF del CED con `pnpm fuente` buscando el párrafo de "2020-2021" y confirmar el orden nafta/gasoil antes de usar esas dos cifras en cualquier registro.

## orsi/2024-11-18-iva-2-ciento-tarjetas-debito-2024

`dato_real.valor` y `analisis` afirman que, según el documento de la Asesoría Tributaria del MEF citado por Ámbito, el quintil de mayores ingresos usaba tarjeta de débito para consumo básico en "36,76% en el más alto". La única `cita` presente en `dato_real.fuentes` sobre esa encuesta dice literalmente: "en el primer quintil de ingresos la utilizan el 4,81% de los hogares relevados por la encuesta, en el segundo quintil el 9,41% y en el tercer quintil el 15,89%" — llega hasta el tercer quintil, no hasta "el más alto" (que sería el quinto). No hay en el registro una cita que respalde el 36,76%. No se corrigió el número en este lote (no se cambia contenido sustantivo); tampoco se construyó gráfico con ese dato por la misma razón. Para cerrarlo: releer la nota de Ámbito (o el documento del MEF si está enlazado) con `pnpm fuente` y agregar la cita del quinto quintil, o corregir la cifra si la nota no la sostiene.
