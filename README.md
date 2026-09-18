# Dyclokpropio - proyecto recuperado

Esta carpeta fue reconstruida desde el instalador `Dyclokpropio_30.0.0_win_x64.exe`.

## Qué se pudo recuperar

- Aplicación Electron empaquetada originalmente con Electron **31.7.7**.
- `package.json` original y una copia intacta en `package.original.json`.
- Código compilado de Electron en `dist-electron/`.
- Interfaz compilada de Vue/Vite en `dist/`.
- Worker desempaquetado en `dist-electron/worker/`.
- `DicSyncService.exe`, `plugins/`, `SourceData/`, `vendor/ffmpeg` y recursos auxiliares necesarios por la aplicación.
- Configuración inicial `electron-builder.yml` para volver a empaquetar una versión de Windows x64.

## Importante

Esto **no es el proyecto fuente original**. El instalador contiene código ya compilado/ofuscado y no incluye los `.vue`, `.ts` o configuración de desarrollo originales. Aun así, esta recuperación conserva la aplicación y permite estudiar/modificar los archivos compilados. Para mantenimiento serio, lo ideal es conseguir el repositorio fuente original y usar esta carpeta como referencia.

## Ejecutar como proyecto recuperado

En Windows, dentro de esta carpeta:

```powershell
npm install
npm start
```

El `package.json` recuperado fue ampliado con Electron 31.7.7 y electron-builder para facilitar el arranque y empaquetado. El archivo `package.original.json` conserva exactamente los metadatos extraídos del `app.asar`.

## Generar instalador de Windows

```powershell
npm install
npm run build:win
```

El resultado se escribirá en `release/`. La configuración de `electron-builder.yml` es una reconstrucción inicial basada en la estructura observada del instalador original; puede requerir ajustes si alguna ruta está codificada internamente.

## Integridad del instalador de origen

SHA-256:

```text
e29f761cce9a744d00dd1ccf82a29209a2f42c07b32c5567054419d08651dfde
```

## Estructura

- `dist-electron/`: proceso principal, preload, sincronizador y worker.
- `dist/`: interfaz de usuario compilada y recursos.
- `plugins/`: recursos/plugins distribuidos con la aplicación.
- `SourceData/`: plantilla/datos de navegador incluidos en el instalador.
- `vendor/`: utilidades externas incluidas, como FFmpeg.
- `resources/`: recursos auxiliares de Electron.
- `package.original.json`: paquete original sin cambios.
- `package.json`: paquete preparado para ejecutar/reconstruir.

## Recomendación para futuras mejoras

1. Conservar esta recuperación sin modificar en una rama o etiqueta.
2. Hacer los cambios en otra rama.
3. Si aparece el código fuente original, migrar las mejoras a ese código y dejar de editar los bundles compilados.

## Copia para GitHub

Esta variante `source-only` omite archivos de runtime grandes y `SourceData`. Consulta `RUNTIME_FILES_REQUIRED.md`. Para subirla al repositorio desde Windows puedes ejecutar `SUBIR_A_GITHUB.ps1` después de tener Git instalado y haber iniciado sesión en GitHub.
