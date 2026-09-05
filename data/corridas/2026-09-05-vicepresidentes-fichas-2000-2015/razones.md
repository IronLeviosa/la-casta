# Razones — fichas de vicepresidentes 2000-2015

Editado en el chat, con el modelo que eligió el mantenedor para la sesión. Los pasos de criterio
fueron dos y ninguno cambia el contenido que trajo el investigador.

## 1. Renombrado `_id` → `_slug`

El encargo pidió el campo como `_id` y la convención del repo es `_slug`, que es el que lee
`derivarId`. Con `_id` los registros habrían quedado con el id derivado del nombre completo
(`luis-hierro-lopez`) en vez del corto (`hierro-lopez`), incompatible con cómo están cargados los
cinco presidentes. Es un error del encargo, no del investigador.

## 2. Tier: `publicado` para todos

Mismo criterio que se aplicó a los cinco presidentes ya cargados, y el mismo para las siete
personas de estos dos lotes, sin importar el partido. La condición que se verificó en cada una:
cada mandato tiene al menos una fuente, y cada persona tiene al menos una fuente que no es
Wikipedia. Las siete la cumplen.

Queda dicho lo que es más flojo, porque cumplir el mínimo no es lo mismo en todos los casos:
Sendic y Cosse tienen una sola fuente no-Wikipedia cada uno (la diaria y JUTEP respectivamente),
mientras Topolansky y Argimón tienen dos. La ficha identitaria no exige dos grupos de medios como
sí lo exige una declaración reportada; si más adelante el esquema de `politicos` incorpora esa
regla, estos dos son los primeros a revisar.

## 3. Lo que no se tocó

La salida de Sendic quedó como `renuncia` y no `renuncia_forzada`. El investigador dejó
constancia de que las fuentes no permiten distinguir entre las dos. Ante esa duda se elige la
opción que no afirma de más: decir que fue forzada requiere una fuente que lo diga, y no la hay.

No se investigó ninguna causa judicial de ninguna de las siete personas. El investigador anotó en
`notas.md` las que vio de pasada, aplicando la misma búsqueda a las siete y no solo a quien dejó
el cargo antes de tiempo, que es lo correcto.
