# Línea experimental DICloak nativo 3.0.7 — sin DyclokPRO.exe

Esta rama inicia una **nueva dirección técnica**: usar solo el ejecutable oficial
`DICloak.exe` como aplicación visible y elimininar la dependencia del lanzador
externo `DyclokPRO.exe`.

## Primera etapa (reversible)

- Descarga solo el instalador oficial **DICloak 3.0.7** y comprueba el SHA-256 fijado.
- Extrae el motor sin alterar `DICloak.exe` ni `resources/app.asar`.
- **No** compila, copia ni distribuye `DyclokPRO.exe`; los accesos directos
  apuntan exclusivamente a `DICloak.exe`.
- Instala en `%LOCALAPPDATA%\Programs\DICloak-Nativo-Lab`, separado de
  DyclokPRO y de las instalaciones oficiales existentes.
- No copia carpetas de perfiles `SourceData` / `Chromium\User Data`.
- Valida instalación, integridad y arranque básico en un runner Windows.
- Produce un **artefacto experimental** de Actions. No publica un Release ni
  elimina la instalación del usuario.

**Advertencia:** al no ejecutar el administrador externo, desaparecen de esta
variante las funciones propias de DyclokPRO (pestañas integradas, alias,
diagnósticos por cuenta, etc.). Es una base del navegador original, no una
sustitución funcional equivalente a v6.44. También es independiente del
actualizador automático de la línea v30.0.N.

## Ediciones controladas que siguen

Realizar cambios en ramas pequeñas, con pruebas de regresión para inicio,
cuentas, perfiles, persistencia, red y actualizaciones. No editar PE, integridad
ni autenticación para eludir verificaciones. No alterar el motor oficial hasta
disponer de una estrategia de empaquetado, restauración y permiso de distribución
adecuados.

## Pruebas y construcción

```powershell
python tools/verify-dicloak-native-only.py
```

Workflow de Windows: `.github/workflows/build-dicloak-native-only-307.yml`.
Antes de instalar cualquier artefacto de prueba, respaldar datos de perfiles y
sesiones. La compilación no implica que el inicio de sesión remoto o todos los
perfiles funcionen en el equipo del usuario.

El código base del empaquetado original procede de la línea histórica
`v6.44` de este repositorio, que preparaba el motor 3.0.7 intacto y añadía
posteriormente el lanzador independiente. Esta variante omite ese último paso.
