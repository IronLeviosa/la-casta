# Brief: resolvedor sobre los chequeos de Batlle que siguen en probable con `_faltante: dato_oficial`

Origen: la corrida 2026-09-16-batlle-economia-impuestos dejó siete chequeos con `_faltante: dato_oficial` en el crudo (`data/corridas/2026-09-16-batlle-economia-impuestos/crudo/chequeos.yaml`). Hoy, en `content/`, cinco siguen en `probable`; uno (IVA de noviembre de 2000) ya está publicado y otro (presión fiscal del agro, 2005-01-26) quedó en hipótesis, privada. Este lote es de cinco, no de siete.

Simetría (Regla 0): los chequeos de Astori con el mismo faltante ya pasaron por un resolvedor (`data/corridas/2026-09-16-correccion-astori-resolucion-chequeos/`). Este lote cierra el mismo paso para Batlle. Un criterio, aplicado igual: todo chequeo en `probable` cuyo crudo traía `_faltante: dato_oficial`.

Qué hacés: leé `.claude/agents/resolvedor.md` y seguilo. Motivo a resolver en los cinco: falta el documento oficial que permita juzgar el dato. No cambiás tier ni calificás: dejás la fuente en el inbox y la decide el editor.

## Dónde escribís

`inbox/resoluciones/2026-10-29/chequeos-batlle-<AAAA-MM-DD>-<slug>.yaml`, uno por chequeo, **apenas termines con cada uno** (resuelto, parcial o agotado), no al final. Formato del agente, con dos agregados:

- Si hace falta más de un documento, `fuentes_nuevas:` (lista con las mismas claves que `fuente_nueva`) en vez de `fuente_nueva:`. Cada una con `tipo: documento_oficial` (o `diario_de_sesiones`), `medio` de los que existen en `content/medios/` (`mef`, `bcu`, `dgi`, `impo`, `ine`, `opp`, `parlamento`, `presidencia`, `banco-mundial`; si falta uno, lo anotás), `cita` copia literal y contigua de lo que devolvió `pnpm fuente` (≥ 20 caracteres) y `retrieved_at`.
- `que_dice_sobre_el_dato:` una o dos oraciones que dicen qué dice ese documento sobre la cifra o la comparación del chequeo (coincide, no coincide, no lo desglosa), sin calificación. Calificar es del editor.

`resuelto: si` solo si el documento contiene la cifra, la serie o el acto que el chequeo necesita para juzgarse. Un documento que da contexto pero no el dato es `parcial`, con qué falta. Si no aparece, `resuelto: no` con `busque:` URL por URL y consulta por consulta: que sea porque no existe, no porque no se buscó. Buscá en las dos direcciones: el documento que confirma lo que dijo y el que sostiene la lectura contraria.

## Los cinco chequeos (`content/chequeos/batlle/<id>.yaml`, ya publicados en probable)

1. **2005-11-28-rebaja-40-millones-50-empresas** y 2. **2005-11-28-rebaja-15-millones-bancos** (misma nota de El País del 28/11/2005 sobre el anteproyecto de reforma tributaria; buscalos juntos). El registro ya cita la serie de recaudación de la DGI y el tipo de cambio del Banco Mundial. Falta el documento que desglose esas dos cifras: USD 40 millones de rebaja para las 50 empresas más grandes y USD 15 millones para los bancos. Puertas: el proyecto de ley de reforma tributaria y su exposición de motivos o informe de impacto recaudatorio (Parlamento: ficha del asunto, repartido, versión taquigráfica de la comisión de Hacienda), presentaciones o informes del MEF de 2005-2006, y el diario de sesiones donde el MEF expone el costo fiscal por sector. El segundo registro además involucra IMABA e ICOSIFI (eliminados): si el documento da cuánto recaudaban o cuánto costaba la rebaja a los bancos, es lo que falta.
3. **2013-07-01-licitacion-desierta-once-millones-dolares-junio-2013**. Falta el resultado oficial de las licitaciones de deuda pública en pesos de la ventana junio-julio de 2013 (monto ofrecido y adjudicado, licitación desierta, tasas de la licitación siguiente). Puertas: Unidad de Gestión de Deuda del MEF (resultados de licitaciones, informes de deuda), comunicados de licitación del BCU, el Informe de Deuda Pública de 2013. El registro dice que los informes mensuales de enero y julio no cubren esa semana: mirá los trimestrales, los comunicados semanales y las copias archivadas.
4. **2013-02-05-comparacion-deficit-fiscal-2003-2013**. Falta una serie oficial del resultado fiscal del sector público (global, consolidado o gobierno central-BPS, como porcentaje del PIB) para 2003 y para el cierre de 2012, con el perímetro dicho. Puertas: MEF (resultado fiscal 2012, comunicados de febrero y marzo de 2013), BCU (Memoria Anual 2003, PDF escaneado: `pnpm fuente` lo manda a OCR y termina con código 3; seguí con otro y volvé a llamarlo), exposición de motivos de la Rendición de Cuentas, series del BCU o del Banco Mundial.
5. **2013-02-05-irpf-iass-2500-millones-franjas-menores-2013**. Falta cualquiera de estos documentos: el decreto que fijó la Base de Prestaciones y Contribuciones (BPC) de 2013 y las franjas de IRPF e IASS; el texto o la exposición de motivos de la última rendición de cuentas (el registro identifica la Ley 18.996 como la del ejercicio 2011) con el aumento de gasto de US$ 140 millones; alguna estimación oficial de lo no ajustado ($ 2.500 millones). Puertas: IMPO, Presidencia (decretos), MEF, Parlamento.

## Reglas de este brief

- Corpus primero (`pnpm corpus:buscar`), después la web. Todo se lee con `pnpm fuente`; ninguna URL que no abriste.
- Una fuente que cuenta otra cosa parecida o remite al mismo original no es la que falta. Es preferible `no` documentado que un `si` forzado (`correcciones.md`, trampas).
- Wayback: no corras `pnpm sesion:indexar`. `pnpm inventario <dominio>` solo si lo necesitás para decir que un documento no existe, una vez por dominio y con `--desde`, `--hasta` o `--filtro` que acoten; si responde 429 o se corta por tiempo, frená esa puerta y anotala en `busque`.
- Tope de turnos: si llegás, el informe dice cuáles chequeos quedaron sin mirar, en el orden de esta lista.
- Informe final de menos de 20 líneas: una por chequeo (`si`, `parcial` o `no`, y el documento o lo que falta), medios que haya que dar de alta y el modelo con el que corriste.
