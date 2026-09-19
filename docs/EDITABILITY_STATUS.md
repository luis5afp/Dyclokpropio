# Estado de editabilidad y reconstrucción

## Dos niveles distintos

### 1. Cobertura editable del runtime: completa

El build reconstruido no toma JS/CSS/JSON/HTML directamente de `dist/` o
`dist-electron/`. El script `tools/build-reconstructed-runtime.js` elimina
esos archivos del directorio de salida y los repone desde `src/runtime/`.

El mismo script compara el conjunto de archivos editables recuperados contra el
snapshot de `src/runtime/` y aborta si falta alguno. Por tanto, actualmente
todo archivo de código/runtime recuperado que participa en esa capa tiene una
copia editable versionada.

Esto significa que una corrección urgente puede hacerse incluso antes de que un
módulo haya sido convertido a fuente limpia.

### 2. Reconstrucción limpia y mantenible: en progreso

Este nivel reemplaza bundles compilados/ofuscados por módulos con nombres,
contratos y pruebas.

Estado verificable actual:

- Preload: reconstruido y comparado automáticamente contra el recuperado.
  - misma forma de API;
  - 0 métodos faltantes;
  - 0 métodos extra;
  - 0 diferencias de comportamiento detectadas por la prueba de contrato.
- Proceso principal:
  - 77 canales IPC recuperados con cuerpo de handler;
  - migrados a implementación limpia:
    - `get-current-platform`;
    - `set-process-env`;
    - `get-device-info`.
- Device ID:
  - algoritmo recuperado exactamente:
    `SHA-256(hostname + arch + username).digest("hex").substring(0, 32)`.
- Preferencia de ventana:
  - validación limpia reconstruida;
  - límites recuperados: 500–10000 px para ancho y alto.
- Storage:
  - namespaces recuperados: `app` y `tracker`;
  - claves de cifrado recuperadas;
  - semántica get/set/delete reconstruida;
  - schema en proceso de reconstrucción completa antes de activar IPC limpio.
- Renderer Vue:
  - 381 archivos JS analizados;
  - 239 chunks de componentes detectados;
  - 559 nombres de componentes recuperados;
  - SFCs limpios reconstruidos hasta ahora:
    - `envSerialNums.vue`;
    - `CustomRadioGroup.vue`;
    - `OpenProgressBar.vue`;
    - `TruncateText.vue`;
    - `EnvironmentWarningNoticeBanner.vue`;
    - `IpCountryFlag.vue`.

Estas cifras no deben interpretarse como un porcentaje global de avance: un
handler IPC pequeño y una pantalla compleja no tienen el mismo peso.

## Criterio final

La reconstrucción limpia se considerará completa cuando:

1. `src/main/` no necesite `dist-electron/main-CuCOh59n.js`;
2. preload y proceso principal arranquen solo desde código reconstruido;
3. el renderer se genere desde fuentes mantenibles bajo `src/renderer/`;
4. los bundles recuperados dejen de ser inputs del build y queden solo como
   referencia histórica/regresión;
5. contratos IPC y flujos críticos tengan pruebas;
6. el instalador Windows se compile y supere una prueba de arranque desde esas
   fuentes.

## Principio de seguridad de la migración

La rama `main` conserva la versión recuperada estable. La reconstrucción se
realiza en `reconstruction-source`. Un canal o componente solo sustituye al
legado cuando hay evidencia suficiente y pruebas de paridad; mientras tanto,
la copia editable de compatibilidad permanece disponible.
