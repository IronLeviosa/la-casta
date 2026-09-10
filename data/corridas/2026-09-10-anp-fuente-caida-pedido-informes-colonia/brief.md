# Corrección: fuente temporal caída en la ficha de ANP (pedido de informes sobre los puertos de Colonia)

Fecha: 2026-09-10. Tipo `fuente_caida`. Al verificar con red el contenido publicado, la fuente
`https://infolegislativa.parlamento.gub.uy/temporales/302199.PDF` de `content/empresas/anp.yaml`
respondió 404 sin copia en Wayback. El texto guardado en el corpus muestra que el documento es el
Diario de Sesiones de la Cámara de Representantes n.º 3072 (62.ª sesión, 9 de octubre de 2002), que
la Hemeroteca de la Biblioteca del Poder Legislativo publica con URL estable. Se reemplazan la URL y
la fecha de esa fuente; nada más cambia. Los enlaces «temporales» del sistema de información
legislativa caducan y no deben citarse: queda anotado para que `pnpm fuente` lo advierta.
