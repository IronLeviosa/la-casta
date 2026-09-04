# Nota del editor sobre este brief

El 2026-09-04, después de que la corrida ya se había ejecutado, se regeneró `brief.md`
por error con una plantilla posterior. Se restauró de inmediato al texto que el agente
recibió realmente, reponiendo lo que la plantilla nueva había cambiado:

- la definición del registro `Mención`, que en la plantilla nueva usa `referente` y
  `politico_mencionado` y en la original usaba `mencionado`;
- la regla 2, a la que la plantilla nueva le agrega la indicación de leer con
  `--buscar` para gastar menos contexto;
- tres filas de la tabla de medios (ambito, infobae, lacallepou-uy) que se dieron de alta
  después de la corrida y por lo tanto no estaban en el brief original.

El texto restaurado coincide con el prompt que consta en la transcripción de la corrida.
Para que esto no se repita, `scripts/brief.ts` ahora se niega a sobrescribir un
`brief.md` existente salvo que se le pase `--forzar`.
