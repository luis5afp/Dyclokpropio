/**
 * Recovery controller for the recovered Dyclokpropio renderer.
 *
 * Prefer the application's original logout function when there are no open
 * profiles. Legacy Electron STOP_ENV IPC is only required if browsers remain
 * open, and a missing IPC response must not silently deadlock the UI.
 *
 * Recovery is EXPLICIT: never clear authentication without an additional user
 * confirmation. Local recovery does not remove browser profiles or cookies.
 */
export function makeLogoutController({
  isClient,
  openProfiles,
  stopProfiles,
  standardLogout,
  stillSignedIn,
  confirm,
  translate,
  localOnlyLogout,
  logError = console.error,
  schedule = setTimeout,
  clearSchedule = clearTimeout,
  rescueDelayMs = 15000,
}) {
  if (![isClient, openProfiles, stopProfiles, standardLogout, stillSignedIn,
    confirm, translate, localOnlyLogout].every((fn) => typeof fn === 'function')) {
    throw new TypeError('Incomplete logout controller dependencies');
  }

  let busy = false;
  let rescueShown = false;
  function showLocalRecovery() {
    if (rescueShown || !stillSignedIn()) return;
    rescueShown = true;
    confirm({
      title: translate('logout.title'),
      message: 'El cierre de sesión normal no respondió. ¿Cerrar únicamente la sesión LOCAL de Dyclokpropio? No se borrarán perfiles ni cookies. Los navegadores que sigan abiertos no se cerrarán y la sesión del servidor podría continuar activa.',
      confirmCb: async () => {
        try {
          await localOnlyLogout();
        } catch (error) {
          logError('[Dyclokpropio] Error en salida local', error);
          rescueShown = false;
          showLocalRecovery();
        }
      },
    });
  }

  async function executeLogout() {
    if (busy) return;
    busy = true;
    const rescueTimer = schedule(showLocalRecovery, rescueDelayMs);
    try {
      if (!isClient() || openProfiles().length === 0) {
        // Crucial: the recovered UI previously sent STOP_ENV even with zero
        // profiles; on some older installations the IPC reply never arrives.
        await standardLogout();
      } else {
        // Preserve the original native stop-environment workflow for real
        // browser processes; its callback performs the regular logout.
        await stopProfiles();
      }
    } catch (error) {
      logError('[Dyclokpropio] Normal logout failed', error);
      clearSchedule(rescueTimer);
      showLocalRecovery();
    } finally {
      busy = false;
      // A native STOP_ENV callback is asynchronous and can never resolve a
      // Promise returned by IPC.send(). Keep the watchdog alive while signed
      // in; do not automatically sign out or close browsers.
      if (!isClient() || openProfiles().length === 0) {
        // Standard logout may have returned while navigating; the watchdog
        // checks the current auth state before showing another dialog.
      }
    }
  }

  function requestLogout(confirmed = false) {
    if (busy) return;
    if (isClient() && openProfiles().length > 0) {
      confirm({
        title: translate('logout.title'),
        message: translate('header.promptError') +
          '\nSi ya cerraste los navegadores, confirma para intentar detener los perfiles. No se eliminarán los perfiles.',
        confirmCb: executeLogout,
      });
      return;
    }
    if (confirmed === true) return executeLogout();
    confirm({
      title: translate('logout.title'),
      message: translate('logout.hint'),
      confirmCb: executeLogout,
    });
  }

  return requestLogout;
}
