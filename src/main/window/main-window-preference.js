'use strict';

const MAIN_WINDOW_SIZE_LIMITS = Object.freeze({
  minWidth: 500,
  maxWidth: 10000,
  minHeight: 500,
  maxHeight: 10000,
});

/**
 * Clean equivalent of recovered helper Ei().
 *
 * Returns a normalized { width, height } pair or null when the recovered
 * validation rules reject the value.
 */
function normalizeMainWindowLaunchPreference(value) {
  if (!value || typeof value !== 'object') return null;

  const { width, height } = value;

  if (
    typeof width !== 'number' ||
    !Number.isFinite(width) ||
    typeof height !== 'number' ||
    !Number.isFinite(height) ||
    width < MAIN_WINDOW_SIZE_LIMITS.minWidth ||
    width > MAIN_WINDOW_SIZE_LIMITS.maxWidth ||
    height < MAIN_WINDOW_SIZE_LIMITS.minHeight ||
    height > MAIN_WINDOW_SIZE_LIMITS.maxHeight
  ) {
    return null;
  }

  return { width, height };
}

module.exports = {
  MAIN_WINDOW_SIZE_LIMITS,
  normalizeMainWindowLaunchPreference,
};
