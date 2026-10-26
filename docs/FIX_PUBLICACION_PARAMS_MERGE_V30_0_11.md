# Corrección del fallo de publicación v30.0.11

La compilación de Windows (run 40298681914) se detuvo en la etapa
`Instrument safe paramsMerge checkpoints`. El script volvía a ejecutar
`stages(legacy(baseline))` aunque en la compilación ya se había aplicado
`apply-legacy-expand-check.js --apply` y luego
`instrument-open-stages.js --apply`. Por eso la segunda ejecución
intentaba localizar un ancla anterior ya sustituida y generaba
`Missing or duplicate change site`.

## Cambio
- Preflight (sin `--apply`): trabaja sobre el renderer original del
  repositorio, compara su SHA-256 exacto y ejecuta ambos parches anteriores
  solamente en memoria.
- Instalación (`--apply`): utiliza *directamente* el archivo ya parcheado
  y exige el SHA-256 exacto `c31673200543e6b83e4f2f6e0f59835a3322d599e9961b8d5580181c6122bdf0`
  obtenido en la compilación fallida después de las dos primeras etapas.
- Tras validar ese SHA, inserta únicamente los checkpoints de
  `paramsMerge`, comprueba sintaxis JS y conserva el verificador remoto de
  integridad y el código original de apertura.
- Una prueba de regresión exige que el modo `--apply` acepte el resultado
  del pipeline revisado, y rechace baseline no parcheado, transformaciones
  inesperadas y la doble aplicación.

La corrección solo arregla el **pipeline de publicación**.
El problema de `paramsMerge` al abrir el perfil 244 todavía requiere
leer el nuevo informe del PC afectado; no se ha declarado resuelto.
