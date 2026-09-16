# Fuentes de prensa: robots.txt y sitemaps

Etapa A de `docs/plan-catalogo.md`, solo la parte de sitemaps (primer entregable, antes de gastar
nada en CDX de Wayback). Una fila por cada perfil de `content/medios/*.yaml` que tiene `url:`
propia: los 81 perfiles la tienen, así que no hay lista de «sin dominio» (ver nota al final).

Se pidió únicamente a los sitios de los medios: `robots.txt` y los sitemaps que declara, con
`leerRobots`, `esIndice`, `mesDeUrl` y `descubrir` de `scripts/lib/sitemaps.ts` (que a su vez usan
`fetchConTimeout` de `scripts/lib/http.ts`), con tope de 2 pedidos simultáneos. Nada se pidió a
archive.org ni a web.archive.org. El sitemap se leyó entero (sin recortar, salvo el tope de
lectura de 200.000 URL que solo `el-pais` alcanzó) pero no se bajó ninguna nota.

Columnas: **robots.txt** dice si permite crawlers y qué rutas prohíbe (recortado a 8 patrones);
**Sitemap** dice si hay, si es un índice o un archivo único y cuántos archivos se leyeron
realmente; **Meses cubiertos**, el primer y último mes de `lastmod` o, si falta, de la propia URL
(filtrando cualquier match fuera de 1990-01–2026-09, ver nota sobre `mesDeUrl` al final); **URL
aprox.**, cuántas `<url>` había en los sitemaps leídos (no notas de política: un sitemap mezcla
todo tipo de páginas); **Prensa sobre política**, una lectura en cinco palabras de si el medio
sirve para esta colección (un diario nacional sí, un banco central o una empresa estatal no).

Nota sobre `dominio`: varios organismos uruguayos usan el portal único `gub.uy` con rutas por
institución (`gub.uy/dgi`, `gub.uy/presidencia`, etc.), así que comparten el mismo `robots.txt` y
sitemap — la fila lo muestra tal cual devuelve `hostDe()`, no es un error de esta tabla.

| Medio | Dominio | robots.txt | Sitemap | Meses cubiertos | URL aprox. | Prensa sobre política |
|---|---|---|---|---|---|---|
| 180-com-uy | 180.com.uy | sí (/cfg/, /controller/, /data/, /html/, /lib/, /moclam/, /motte2/, /retriever/, y 2 más) | no | — | 0 | sí, portal de noticias generalista |
| aderasa | aderasa.org | sí (nada prohibido) | índice de sitemaps, 12 archivo(s) | 2023-07 a 2026-08 | 137 | no, organismo técnico regulador regional |
| aebu | aebu.org.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 27 más) | no | — | 0 | no, sindicato bancario, no prensa |
| afe | afe.com.uy | sí (nada prohibido) | no | — | 0 | no, empresa estatal, no prensa |
| afp | afp.com | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | sí, agencia internacional de noticias |
| alur | alur.com.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 25 más) | no | — | 0 | no, empresa estatal, no prensa |
| ambito | ambito.com | sí (nada prohibido) | 4 sitemaps declarados, 515 archivo(s) leídos | 2026-09 a 2026-09 | 553 | sí, diario económico y político |
| ancap | ancap.com.uy | sí (nada prohibido) | no | — | 0 | no, empresa estatal, no prensa |
| andina-peru | andina.pe | sí (nada prohibido) | 2 sitemaps declarados, 28 archivo(s) leídos | 2021-10 a 2026-09 | 28.726 | sí, agencia estatal peruana de noticias |
| anp | anp.com.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | no, organismo estatal portuario |
| anp-brasil | gov.br | sí (/economia/pt-br/internet/*, /*sendto_form$, /*folder_factories$, /ebserh/*?, /ebserh/*atct_album_view$, /ebserh/*folder_summary_view$, /ebserh/*login_form$, /ebserh/*mail_password_form$, y 45 más) | declarado, no se pudo leer ningún archivo | — | 0 | no, organismo regulador técnico brasileño |
| antel | antel.com.uy | no respondió | no respondió | — | — | no, empresa estatal, no prensa |
| augpee | augpee.org.uy | sí (/wp-admin/) | índice de sitemaps, 4 archivo(s) | 2020-10 a 2025-07 | 20 | no, sindicato docente, no prensa |
| banco-mundial | worldbank.org | sí (nada prohibido) | índice de sitemaps, 14 archivo(s) | 2011-04 a 2026-09 | 36.201 | no, organismo multilateral, no prensa |
| bcb-brasil | bcb.gov.br | sí (/*/_catalogs, /*/Lists/, /*/lists/, /*/Forms/, /*/forms/, /*/_layouts/) | no | — | 0 | no, banco central, no prensa |
| bcu | bcu.gub.uy | sí (nada prohibido) | no | — | 0 | no, banco central, no prensa |
| bhu | bhu.com.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | no, banco estatal, no prensa |
| bid | iadb.org | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 46 más) | no | — | 0 | no, organismo multilateral, no prensa |
| brecha | brecha.com.uy | sí (nada prohibido) | índice de sitemaps, 35 archivo(s) | 2014-09 a 2026-09 | 29.344 | sí, semanario centrado en política |
| brou | brou.com.uy | sí (/web/guest/personas/beneficios/aprovecha-tu-verano, /personas/beneficios/aprovecha-tu-verano, /beneficios/prestamos-personales, /web/guest/beneficios/prestamos-personales, /web/guest/empresas/nueva-version-ebrou-empresas, /web/guest/empresas/nueva-version-ebrou-empresas-2, /web/guest/personas/beneficios/turismo-verano) | declarado, no se pudo leer ningún archivo | — | 0 | no, banco estatal, no prensa |
| bse | bse.com.uy | sí (/wps/portal/*, /wps/myportal/*) | un solo sitemap | 2021-03 a 2021-03 | 183 | no, aseguradora estatal, no prensa |
| busqueda | busqueda.com.uy | sí (nada prohibido) | 4 sitemaps declarados, 358 archivo(s) leídos | 2026-09 a 2026-09 | 61 | sí, semanario político muy influyente |
| caras-y-caretas | carasycaretas.com.uy | no respondió | no respondió | — | — | sí, semanario de sátira política |
| catalogodatos-gub-uy | catalogodatos.gub.uy | sí (/dataset/rate/, /revision/, /dataset/*/history, /api/) | no | — | 0 | no, catálogo de datos, no prensa |
| ced | ced.uy | sí (nada prohibido) | no | — | 0 | no, centro de estudios, no prensa |
| congreso-espana | congreso.es | no respondió | no respondió | — | — | no, cuerpo legislativo, no prensa |
| cooperativa-cl | cooperativa.cl | sí (/1020719/, /p4_noticias/, /radio_online/, /cgi-bx/, /noticias/site/tax/port/fid_foto/nuevataxport*, /noticias/site/tax/port/fid_video/nuevataxport*, /noticias/site/tax/port/fid_audio/nuevataxport*, /xml/, y 10 más) | 3 sitemaps declarados, 3 archivo(s) leídos | 2003-06 a 2026-09 | 1.330 | sí, radio chilena con cobertura política |
| correo | correo.com.uy | sí (/*.jpg$, /*.jpeg$, /*.png$, /*.gif$, /*.webp$, /*.pdf$, /*.doc$, /*.docx$, y 4 más) | no | — | 0 | no, empresa estatal, no prensa |
| cpa-ferrere | cpaferrere.com | sí (nada prohibido) | no | — | 0 | no, consultora privada, no prensa |
| cronicas | cronicas.com.uy | sí (nada prohibido) | no | — | 0 | parcial, semanario económico, poca política |
| dgi | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo tributario, no prensa |
| efe | efe.com | sí (nada prohibido) | no | — | 0 | sí, agencia internacional de noticias |
| el-observador | elobservador.com.uy | sí (nada prohibido) | 4 sitemaps declarados, 137 archivo(s) leídos | 2026-09 a 2026-09 | 262 | sí, diario nacional de referencia |
| el-pais | elpais.com.uy | sí (/search) | 5 sitemaps declarados, 54 archivo(s) leídos (tope de lectura alcanzado, hay más) | 2003-03 a 2026-09 | 200.000+ (tope de lectura, hay más) | sí, diario nacional líder en política |
| elpueblodigital | elpueblodigital.uy | sí (nada prohibido) | no | — | 0 | sí, portal local con notas políticas |
| eltelegrafo | eltelegrafo.com | sí (/author/*, /wp-admin/) | declarado, no se pudo leer ningún archivo | — | 0 | sí, diario estatal ecuatoriano, política |
| en-perspectiva | enperspectiva.uy | sí (/wp-admin/) | índice de sitemaps, 64 archivo(s) | 2015-04 a 2026-09 | 58.472 | sí, programa radial de análisis político |
| fiscalia-general-nacion | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo judicial, no prensa |
| fmi | imf.org | sí (/external/country/, /external/np/a4pilot/1999/, /external/np/a4pilot/2000/, /external/np/res/mmod/, /external/np/term/, /external/np/tre/tad/, /external/ns/, /external/pa4158/, y 4 más) | declarado, no se pudo leer ningún archivo | — | 0 | no, organismo multilateral, no prensa |
| foco-economico | focoeconomico.org | sí (nada prohibido) | no | — | 0 | parcial, blog de economía, poca política |
| frenteamplio-uy | frenteamplio.uy | sí (/wp-admin/) | un solo sitemap | 2017-01 a 2026-09 | 1.043 | no, sitio partidario, no prensa |
| grupo-r-multimedio | grupormultimedio.com | no respondió | no respondió | — | — | sí, diario regional, cubre política |
| icndiario | icndiario.com | sí (/wp-admin/) | índice de sitemaps, 37 archivo(s) | 2012-02 a 2026-09 | 58.979 | sí, portal de noticias generalista |
| impo | impo.com.uy | sí (/cgi-bin/, /java, /js, /javascript, /mp3, /skin, /weba, /descargas, y 224 más) | no | — | 0 | no, diario oficial legal, no prensa |
| ine | ine.gub.uy | sí (nada prohibido) | no | — | 0 | no, instituto estadístico, no prensa |
| infobae | infobae.com | sí (/buscador) | 17 sitemaps declarados, 79 archivo(s) leídos | 2024-10 a 2026-09 | 5.832 | sí, portal masivo, cubre política |
| justia | justia.com | sí (nada prohibido) | no | — | 0 | no, base de datos legal |
| jutep | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo estatal de ética |
| la-diaria | ladiaria.com.uy | no respondió | no respondió | — | — | sí, diario centrado en política |
| la-republica | republica.com.uy | sí (nada prohibido) | no | — | 0 | sí, diario nacional, cubre política |
| lacallepou-uy | lacallepou.uy | sí (/wp-admin/) | no | — | 0 | no, sitio de campaña, no prensa |
| mef | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, ministerio, no es prensa |
| miem | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, ministerio, no es prensa |
| ministerio-ambiente | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, ministerio, no es prensa |
| montevideo-portal | montevideo.com.uy | sí (/LuceneIndex/, /plantillas, /static, /paginas, /logs) | no | — | 0 | sí, portal generalista, cubre política |
| mpp | mpp.org.uy | sí (/wp-admin/, /calendar/action~posterboard/, /calendar/action~agenda/, /calendar/action~oneday/, /calendar/action~month/, /calendar/action~week/, /calendar/action~stream/, /calendar/action~undefined/, y 6 más) | índice de sitemaps, 10 archivo(s) | 2019-02 a 2026-09 | 1.468 | no, sitio partidario, no prensa |
| mtop | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, ministerio, no es prensa |
| opp | opp.gub.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 27 más) | no | — | 0 | no, oficina estatal, no prensa |
| ose | ose.com.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | no, empresa estatal, no prensa |
| parlamento | parlamento.gub.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | no, cuerpo legislativo, no prensa |
| poder-judicial | poderjudicial.gub.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | no, poder judicial, no prensa |
| portalmaritimo-com-uy | portalmaritimo.com.uy | sí (nada prohibido) | índice de sitemaps, 3 archivo(s) | 2020-05 a 2026-09 | 269 | no, portal sectorial marítimo, no política |
| prensa-mercosur | prensamercosur.org | no respondió | no respondió | — | — | no, oficina de prensa institucional |
| presidencia | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo estatal, no prensa |
| pv-magazine-latam | pv-magazine-latam.com | sí (nada prohibido) | índice de sitemaps, 26 archivo(s) | 2013-05 a 2026-09 | 18.370 | no, revista sectorial de energía solar |
| radio-carve | radiocarve.uy | sí (nada prohibido) | índice de sitemaps, 17 archivo(s) | 2024-08 a 2026-09 | 11.772 | sí, radio con cobertura política |
| scielo-org-mx | scielo.org.mx | sí (nada prohibido) | no | — | 0 | no, repositorio académico, no prensa |
| sipri | sipri.org | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 28 más) | índice de sitemaps, 59 archivo(s) | 2009-11 a 2026-09 | 114.291 | no, instituto de investigación, no prensa |
| subrayado | subrayado.com.uy | no respondió | no respondió | — | — | sí, noticiero de televisión, política |
| teledoce | teledoce.com | sí (/wp-login.php, /wp-admin/) | no | — | 0 | sí, noticiero de televisión, política |
| telenoche | telenoche.com.uy | sí (nada prohibido) | 4 sitemaps declarados, 237 archivo(s) leídos | 2026-09 a 2026-09 | 156 | sí, noticiero de televisión, política |
| tribunal-de-cuentas | tcr.gub.uy | sí (nada prohibido) | no | — | 0 | no, organismo de contralor, no prensa |
| tv-ciudad | tvciudad.uy | sí (/core/, /profiles/, /README.md, /composer/Metapackage/README.txt, /composer/Plugin/ProjectMessage/README.md, /composer/Plugin/Scaffold/README.md, /composer/Plugin/VendorHardening/README.txt, /composer/Template/README.txt, y 26 más) | no | — | 0 | sí, canal estatal municipal, política |
| union-ferroviaria | unionferroviaria.uy | sí (/wp-admin/) | índice de sitemaps, 10 archivo(s) | 2016-08 a 2026-07 | 496 | no, sindicato ferroviario, no prensa |
| ursea | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo regulador técnico |
| ursec | gub.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 17 más) | no | — | 0 | no, organismo regulador técnico |
| uruguayxxi-gub-uy | uruguayxxi.gub.uy | sí (/ical/) | índice de sitemaps, 23 archivo(s) | 2017-08 a 2026-09 | 9.543 | no, agencia de promoción comercial |
| ute | ute.com.uy | sí (/core/, /profiles/, /README.txt, /web.config, /admin/, /comment/reply/, /filter/tips, /node/add/, y 18 más) | no | — | 0 | no, empresa estatal, no prensa |
| vtv | vtv.com.uy | no respondió | no respondió | — | — | sí, canal de televisión, política |
| wikipedia | es.wikipedia.org | sí (/w/, /api/, /trap/, /wiki/Special:, /wiki/Spezial:, /wiki/Spesial:, /wiki/Special%3A, /wiki/Spezial%3A, y 250 más) | declarado, no se pudo leer ningún archivo | — | 0 | no, enciclopedia, no es prensa |
| youtube | youtube.com | sí (/api/, /channel_picker, /comment, /feeds/videos.xml, /file_download, /get_video, /get_video_info, /get_midroll_info, y 13 más) | 2 sitemaps declarados, 26 archivo(s) leídos | — (sin fecha en las URL) | 2.518 | no, plataforma de video, no prensa |

## Medios sin dominio propio

Ninguno. Los 81 perfiles de `content/medios/*.yaml` tienen `url:` a un sitio con dominio (incluso
Wikipedia y YouTube, que se usan como fuente documental, no como prensa). El plan preveía una lista
corta acá para radios o programas sin sitio propio, pero no apareció ningún caso: hasta un programa
de radio como En Perspectiva tiene su propia URL declarada.

## Qué queda sin sitemap útil

24 medios tienen sitemap utilizable (archivos leídos con URL adentro). Del resto, 44 no declaran
sitemap en `robots.txt`, 5 lo declaran pero el archivo no se pudo leer (`anp-brasil`, `brou`,
`eltelegrafo`, `fmi`, `wikipedia`) y 8 no respondieron dentro del tiempo dado (ver nota siguiente).
En total, 57 medios van a necesitar CDX de Wayback en la etapa siguiente para saber qué URL
publicaron.

De esos 57, los que sí sirven como prensa sobre política y por eso conviene priorizar en el CDX
son: **la diaria, Caras y Caretas, Subrayado, VTV y Grupo R Multimedio** (los 5 que no
respondieron: ver nota de abajo, vale la pena reintentarlos con más tiempo antes de ir a Wayback),
más **El Telégrafo** (sitemap declarado mas no legible), y sin sitemap declarado: **Portal 180,
AFP, EFE, El Pueblo Digital, La República, Montevideo Portal, Teledoce, TV Ciudad**, y con reserva
(cubren más economía que política) **Crónicas** y **Foco Económico**. El resto de la lista de 57
son bancos centrales, empresas estatales, ministerios, sindicatos y organismos reguladores que no
son prensa y probablemente no necesiten CDX para esta colección.

## Nota sobre los dos helpers de `scripts/lib/sitemaps.ts`

No se tocó `scripts/lib/sitemaps.ts` (regla del encargo), pero el barrido encontró dos problemas
reales, documentados acá en vez de arreglados:

1. **`descubrir()` puede bloquear el event loop lo suficiente para vencer un timeout interno.** En
   un proceso único con `Promise.race` contra un `setTimeout`, 8 medios (los mismos 8 que quedaron
   «no respondió» acá) colgaron indefinidamente pese al timeout de 60 s, porque el bloqueo era
   sincrónico (parseo de sitemaps XML con regex, en árboles de índice grandes) y el temporizador
   pendiente nunca llegaba a dispararse. Se resolvió corriendo cada medio en un proceso hijo
   separado (`timeout` de bash, externo al proceso de Node), inmune a que el hijo se cuelgue.
2. **`mesDeUrl()` da falsos positivos con IDs numéricos de nota.** Su regex de año-mes matchea
   segmentos de URL que en realidad son un ID de artículo (p. ej. terminaciones tipo `.../38270413`
   se leían como año 3827, mes 04). Se filtró en el script propio de este barrido, descartando
   cualquier mes fuera de 1990-01 a hoy y contando cuántos se descartaron por medio; no se tocó el
   helper.

## Archivos históricos (medido el 2026-09-16)

Lo que ningún sitemap alcanza (la prensa viva arranca en 2003 en el mejor caso) y la prensa que ya
no existe. Detalle y orden de barrido en `docs/plan-catalogo.md`, etapa A, punto 3.

| archivo | qué tiene | cómo se enumera | texto |
|---|---|---|---|
| Anáforas (`anaforas.fic.edu.uy`, FIC-Udelar, DSpace) | 102.915 ítems; «Publicaciones periódicas del Uruguay»: Diarios, Semanarios, Revistas, Primeros impresos, Otros impresos, Prensa de mujeres, Historietas, Fanzines | sitemap (`/jspui/sitemap?map=0..2`), un ítem por ejemplar con `dc.date.issued`; sin OAI ni REST; `Crawl-delay: 5`; `simple-search` y `discover` prohibidos | PDF de ~4,5 MB por ejemplar **con capa de texto** (El Centinela 1843: 19.219 caracteres; The Montevideo Times 1914: 55.052); OCR de época, con errores |
| sitiosdememoria.uy (Comisión de Sitios de Memoria, Drupal) | ~4.000 ejemplares de prensa 1907–2008 (`/prensa-completa`), causas y sentencias, archivos desclasificados | sitemap propio | por verificar ejemplar por ejemplar |
| Hemeroteca de la Biblioteca del Parlamento | diarios de sesiones desde 1830 | `pnpm sesion`, `docs/fuentes-oficiales/parlamento.md` | PDF con texto |
| archive.org, colección `uruguay-diario-sesiones` | 5.009 diarios de sesiones | `data/diarios-archive.json` (`pnpm sesion:indexar`) | OCR de archive.org |
| Wayback CDX por dominio | prensa digital muerta y versiones viejas de portales | `pnpm inventario`, generalizado a HTML | el de la captura |

Radio y televisión viejas no están en ninguno de estos archivos: lo que hay en línea es reciente
(En Perspectiva desde 2015) o llega transcripto por la prensa. Hueco declarado.
