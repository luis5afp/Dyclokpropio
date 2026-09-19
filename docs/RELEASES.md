# Generar versiones instalables

El repositorio está configurado para construir un instalador Windows NSIS x64.

## Flujo recomendado

1. Realiza y prueba las mejoras.
2. Haz commit y push a `main`.
3. Desde una copia clonada del repositorio ejecuta:

```powershell
.\PUBLICAR_VERSION.ps1 30.0.1
```

4. El tag `v30.0.1` activa `.github/workflows/release-windows.yml`.
5. GitHub Actions instala dependencias, reconstruye módulos nativos y ejecuta `electron-builder`.
6. Si la compilación termina correctamente, el Release recibe un archivo similar a:

```text
Dyclokpropio_30.0.1_win_x64.exe
```

Los usuarios solo necesitan descargar ese `.exe` e instalarlo.

## Prueba sin crear un Release

En GitHub abre **Actions > Build Windows Installer > Run workflow**. Esto compila el instalador y lo guarda como artifact sin necesidad de crear un tag.
