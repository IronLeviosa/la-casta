# Razones — corrida 2026-09-09-diputados-49-50

Lote `inbox/diputados/todos/`: las 91 fichas que la crítica dejó sin objeción de fondo. Los otros lotes de la misma corrida (las 66 con objeciones, los faltantes, los suplentes) tienen su propia carpeta `2026-09-09-diputados-49-50-…` con su rastro.

# Razones — lote `diputados/todos` (91 fichas sin objeción de fondo)

Corrida `2026-09-09-diputados-49-50`. Editor: Sonnet (regla 14 de `CLAUDE.md`; el orquestador
pasó el modelo explícitamente, sin tocar `.claude/agents/editor.md`).

Este lote es exactamente el conjunto de 91 fichas que `critica.md` lista bajo "Fichas sin
objeción" (sección final de "Objeciones por registro"). Las 65 fichas con objeción `bloquea` o
`corregir` de fondo están en otras carpetas del inbox y las corrige otro agente; acá solo se
aplicaron las objeciones de forma y de lote que les tocan a estas 91.

## Cambios no triviales

1. `cervini-walter`: `nombre` "Walter Cervini" → "Walter Cervini Pratto" (`nombre_corto` sin
   cambios). Objeción "67 fichas donde `nombre` es igual a `nombre_corto`" de `critica.md`, que ya
   señala "las tres nóminas oficiales dicen «Cervini Pratto, Walter»". Confirmado de nuevo, en esta
   sesión, con `pnpm fuente https://documentos.diputados.gub.uy/docs/LegAlfab.pdf --buscar
   "Cervini"`: "Cervini Pratto, Walter".
2. `colman-mario`: `nombre` "Mario Colman" → "Mario Colman Giriboni". Misma objeción de forma;
   confirmado con la misma fuente: "Colman Giriboni, Mario".
3. `gianoli-gabriel`: `nombre` "Gabriel Gianoli" → "Gabriel Gianoli Travieso". Misma objeción;
   confirmado con la misma fuente: "Gianoli Travieso, Gabriel".
4. `libschitz-margarita`: `nombre` "Margarita Libschitz" → "Margarita Libschitz Suárez". Misma
   objeción; confirmado con la misma fuente: "Libschitz Suárez, Margarita".
5. Las 32 fichas restantes que la objeción de forma marca como "`nombre` = `nombre_corto`" se
   revisaron una por una contra `LegAlfab.pdf` (para las 18 con mandato de la L) y contra la nómina
   archivada de la XLIX en Wayback (`LegxPartido.pdf`, captura del 22/07/2024, para las 18 con
   mandato solo de la XLIX; `diaz-bettiana` está en ambos grupos por tener mandato de Senadora
   desde 2025, no de Diputada, así que se verificó además con su propia página individual, id
   11634): abdala-pablo, amado-fernando, cairo-cecilia, cortes-ines, dastugue-alvaro, diaz-bettiana,
   echenique-graciela, lima-alvaro, mendez-anibal, niffouri-amin, perez-bonavita-silvana,
   rinaldi-magela, verri-walter, zavala-alejandro, barreiro-gabriela, caballero-wilman,
   cal-sebastian, capillera-elsa, estevez-omar, galan-lilian, gerhard-daniel, hugo-claudia,
   lustemberg-cristina, melazzi-martin, mendiondo-constante, olmos-gustavo, rosello-maria-eugenia,
   testa-carlos, tierno-martin, viana-pablo, viviano-alvaro. En las 31 de esas 32 el documento
   confirma un solo apellido oficial (sin segundo apellido que agregar); no se tocó nada.
6. `moreno-juan-carlos`: no se cambió, y queda dicho por qué. El mismo documento archivado
   (`LegxPartido.pdf` 2024) trae "Moreno, Juan" sin "Carlos", pero el mismo documento trae, dos
   filas más abajo, "Díaz Rey, Bettiana" para la persona cuya propia página oficial
   (`legisladores/11634`) dice solo "Díaz, Bettiana" sin segundo apellido — es decir, esta fuente
   puntual ya demostró un error de nombre en esta misma tanda de filas (probablemente el
   desplazamiento de columnas del PDF de tres columnas que `notas.md` ya documentó para
   departamento y partido, extendido acá a los nombres). Con una fuente que se contradice a sí misma
   al lado, no alcanza para borrarle "Carlos" a Moreno; se deja el registro como está.

## Fecha de la fuente: bug sistemático (objeción de forma "Fuentes: fechas, títulos y medio")

7. 32 entradas de `fuentes[].fecha`, en 16 fichas, tenían la fecha del hecho (2020-02-15, inicio
   del mandato) en vez de la fecha de consulta de la página viva de `parlamento.gub.uy`
   (2026-09-09, que es lo que ya dice `retrieved_at` en la misma entrada y lo que usan las otras 108
   fuentes del mismo tipo de página en este lote). `critica.md` señala el mismo patrón en
   `echeverria-solis` (fuera de esta carpeta) bajo "Fuentes: fechas, títulos y medio". Corregidas
   las 32 entradas (mandato + salida, misma fuente citada dos veces) en: aita-ubaldo,
   albernaz-rodrigo, alvear-jorge, bacigalupe-ruben, barreiro-gabriela, bottino-cecilia,
   caballero-wilman, cal-sebastian, camargo-nazmi, capillera-elsa, estevez-omar, galan-lilian,
   gerhard-daniel, hugo-claudia, larzabal-nelson, lustemberg-cristina.

## Tier

8. Las 91 fichas quedan en `revision.tier: publicado`. Ninguna tiene objeción `bloquea` ni
   `corregir` de fondo en `critica.md`: son exactamente las 91 que el crítico separó como "Fichas
   sin objeción", con 26 de ellas verificadas por el crítico contra la fuente primaria (20
   completas + 6 de partido/departamento). Sobre las 91 verifiqué estructuralmente: rótulo del
   cargo ("Representante Nacional por el Lema…", "Senador/a…" o, en su defecto, una cita de diario
   de sesiones que llame "representante" a la persona) presente en al menos una fuente de cada
   mandato; fechas del mandato coincidentes con la cita; ningún `_faltante`; ningún
   `verificacion: manual`; coherencia entre `estado_actual.situacion` y la existencia de un mandato
   sin `hasta`. No encontré objeciones de fondo nuevas.
9. `mendiondo-constante` y `nunez-gerardo`: el chequeo automático que hice marca el mandato sin el
   rótulo estándar en su propia cita, pero es la excepción que `critica.md` ya señaló y avaló
   expresamente ("son el modelo de cómo debería quedar el resto de las salidas anticipadas"): el
   diario de sesiones de la renuncia, citado dentro del mismo mandato, dice "Renuncia a la banca del
   señor representante Constante Mendiondo" / "…de la señora representante…Núñez Fallabrino". No se
   modificó nada.

## Cambios de forma

10. Normalicé el campo `titulo` de las fuentes para que el mismo tipo de página tenga siempre el
    mismo título (objeción de forma "Fuentes: fechas, títulos y medio" de `critica.md`, punto 2): 20
    fuentes que decían `titulo: Legislaturas` y 34 que decían `titulo: Legislaturas en las que actuó
    <Nombre>` quedaron en `Legislaturas en las que actuó`; 25 que decían `titulo: Parlamento UY |
    <Apellido>` quedaron en `Parlamento UY`. No cambia la URL, la cita ni la fecha: solo la
    etiqueta con la que la página va a agrupar el documento.

## Objeciones de la crítica que no se aplicaron a este lote, y por qué

- **Colisiones de alias** (Delgado/Mujica/Salle/Araújo/Echeverría/Pereyra): ninguno de esos seis
  apellidos en colisión corresponde a una ficha de esta carpeta (verificado por búsqueda exacta
  sobre el archivo). La corrección le toca a las carpetas donde están esas fichas.
- **"Ids que quedarán mal"** (`inthamoussou-pablo`, `rodriguez-carlos-florida`,
  armas-paula/brum-horacio/mattos-alfredo): ninguno está en esta carpeta.
- **Medio**: agregar `documentos.diputados.gub.uy` y `biblioteca.parlamento.gub.uy` a los alias de
  `content/medios/parlamento.yaml`. Ninguna fuente de esta carpeta cita `documentos.diputados.gub.uy`
  (0 ocurrencias); las 17 citas de `biblioteca.parlamento.gub.uy` (diarios de sesiones) sí quedarían
  mejor con ese alias declarado, pero es un cambio a `content/medios/`, que solo edito cuando el
  investigador lo pide en `notas.md` bajo `medios_faltantes` — no fue el caso en este lote. Queda
  para quien mantiene esa colección.
- **Cobertura de la L (14 personas) y de la XLIX (32, 19 de ellas sin ficha en ningún lote)**: son
  objeciones de ausencia total, no de una ficha de esta carpeta; no se resuelven editando registros
  existentes sin hacer el trabajo de investigación primaria que le corresponde a un investigador.
  Quedan pendientes de una corrida de seguimiento (no de este lote).
- **Aviso de simetría del validador** (listas de ~170 nombres sin registro en un tema): es un pedido
  de cambio en el validador o en la página, no en `content/`; no corresponde a este rol.

## Verificación final

`pnpm validar --inbox inbox/diputados/todos --red` corrido después de todos los cambios:
0 errores en esquema, referencias, tiers, fuentes (118 URLs verificadas) y citas (125 citas: 125
exactas, 0 aproximadas, 0 manuales). Los 22 avisos que quedaron son de "cobertura asimétrica" (por
temas que ninguna de estas 91 fichas de identidad tiene, algo esperado y ya señalado por
`notas.md`) y uno de `content/empresas/ute.yaml` ajeno a este lote.
