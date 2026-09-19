const DEFAULT_PORT = 27777;

const titleText = document.getElementById('titleText');
const stateBadge = document.getElementById('stateBadge');
const environmentLabel = document.getElementById('environmentLabel');
const statusPanel = document.getElementById('statusPanel');
const copyPathButton = document.getElementById('copyPathButton');
const uploadButton = document.getElementById('uploadButton');

const LABELS = {
  title: 'Video replacement',
  environment: 'Profile: ',
  environmentEmpty: 'Profile: -',
  uploaded: 'Uploaded',
  uploadedTitle: 'Uploaded video',
  cachedTitle: 'Uploaded video (cached)',
  sourceMissing: 'Source missing',
  sourceMissingTitle: 'Original file is missing',
  apiUnavailable: 'API unavailable',
  noEnvironment: 'No profile',
  empty: 'Not uploaded',
  emptyText: 'No video uploaded',
  apiUnavailableText: 'Local API unavailable',
  noEnvironmentText: 'Unable to read profile info',
  conversionFailed: 'Failed',
  cachedBadge: 'Cached',
  originalPath: 'Original MP4 path',
  originalSize: 'Original file size',
  videoInfo: 'Resolution / FPS',
  updatedAt: 'Converted at',
  convertedSize: 'Converted size',
  copyPath: 'Copy original path',
  copied: 'Copied',
  copyFailed: 'Copy failed',
  upload: 'Upload/replace video',
  processing: 'Processing...',
};

let environmentInfo = {};
let currentOriginalPath = '';
let lastRenderedState = { state: 'empty' };
let copyFeedbackTimer = null;

function t(key) {
  return LABELS[key] || key;
}

function parseEnvironmentInfo() {
  try {
    if (typeof globalThis.__dic_profile_info === 'string') {
      return JSON.parse(globalThis.__dic_profile_info);
    }

    if (globalThis.__dic_profile_info) {
      return globalThis.__dic_profile_info;
    }
  } catch (error) {
    console.warn('Failed to read profile info:', error);
  }

  return {};
}

async function resolveEnvironmentInfo() {
  const parsedInfo = parseEnvironmentInfo();
  if (getEnvId(parsedInfo)) {
    return parsedInfo;
  }

  const backgroundInfo = await sendMessage({ type: 'get-environment-info' });
  if (backgroundInfo?.success && getEnvId(backgroundInfo.data)) {
    return backgroundInfo.data;
  }

  const { lastConvertResult } = await getStorage(['lastConvertResult']);
  return lastConvertResult?.environmentInfo || parsedInfo;
}

function getEnvId(info) {
  return info?.id || info?.envId || '';
}

function getApiPort(info) {
  return info?.localServerConfig?.port || DEFAULT_PORT;
}

function getStorage(keys) {
  return new Promise(resolve => {
    chrome.storage.local.get(keys, resolve);
  });
}

function sendMessage(message) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function setBusy(isBusy) {
  uploadButton.disabled = isBusy;
  uploadButton.textContent = isBusy ? t('processing') : t('upload');
}

function setBadge(text, className = '') {
  stateBadge.className = `badge ${className}`.trim();
  stateBadge.textContent = text;
}

function setCopyFeedback(type) {
  if (copyFeedbackTimer) {
    clearTimeout(copyFeedbackTimer);
  }

  copyPathButton.classList.toggle('copied', type === 'success');
  copyPathButton.textContent = type === 'success' ? t('copied') : t('copyFailed');

  copyFeedbackTimer = setTimeout(() => {
    copyPathButton.classList.remove('copied');
    copyPathButton.textContent = t('copyPath');
  }, 1200);
}

function formatUpdatedAt(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatVideoInfo(videoInfo = {}) {
  const width = videoInfo.width || '-';
  const height = videoInfo.height || '-';
  const frameRate = videoInfo.frameRate || videoInfo.fps || '-';
  return `${width} x ${height} / ${frameRate} FPS`;
}

function convertedSizeHuman(metadata = {}) {
  return metadata?.convertedFile?.sizeHuman || '-';
}

function renderChrome() {
  const envId = getEnvId(environmentInfo);
  const envName = environmentInfo?.homeData?.name || environmentInfo?.name || envId;
  titleText.textContent = t('title');
  environmentLabel.textContent = envName ? `${t('environment')}${envName}` : t('environmentEmpty');
  copyPathButton.textContent = t('copyPath');
  uploadButton.textContent = uploadButton.disabled ? t('processing') : t('upload');
}

function renderMetadata(metadata, options = {}) {
  currentOriginalPath = metadata?.originalFile?.path || '';
  copyPathButton.disabled = !currentOriginalPath;

  statusPanel.innerHTML = `
    <p class="status-title">${escapeHtml(options.title || t('uploadedTitle'))}</p>
    <dl>
      <div>
        <dt>${escapeHtml(t('originalPath'))}</dt>
        <dd>${escapeHtml(currentOriginalPath || '-')}</dd>
      </div>
      <div>
        <dt>${escapeHtml(t('originalSize'))}</dt>
        <dd>${escapeHtml(metadata?.originalFile?.sizeHuman || '-')}</dd>
      </div>
      <div>
        <dt>${escapeHtml(t('videoInfo'))}</dt>
        <dd>${escapeHtml(formatVideoInfo(metadata?.videoInfo))}</dd>
      </div>
      <div>
        <dt>${escapeHtml(t('updatedAt'))}</dt>
        <dd>${escapeHtml(formatUpdatedAt(metadata?.updatedAt || metadata?.timestamp))}</dd>
      </div>
      <div>
        <dt>${escapeHtml(t('convertedSize'))}</dt>
        <dd>${escapeHtml(convertedSizeHuman(metadata))}</dd>
      </div>
    </dl>
  `;
}

function renderEmpty(text) {
  currentOriginalPath = '';
  copyPathButton.disabled = true;
  statusPanel.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function renderState(data) {
  lastRenderedState = data || { state: 'empty' };
  const state = lastRenderedState.state || 'empty';

  renderChrome();

  if (state === 'uploaded') {
    setBadge(t(lastRenderedState.badgeKey || 'uploaded'), lastRenderedState.badgeClass || 'uploaded');
    renderMetadata(lastRenderedState.metadata, { title: t(lastRenderedState.titleKey || 'uploadedTitle') });
    return;
  }

  if (state === 'source_missing') {
    setBadge(t('sourceMissing'), 'warning');
    renderMetadata(lastRenderedState.metadata, { title: t('sourceMissingTitle') });
    return;
  }

  if (state === 'api_unavailable') {
    setBadge(t('apiUnavailable'), 'error');
    renderEmpty(t('apiUnavailableText'));
    return;
  }

  if (state === 'no_environment') {
    setBadge(t('noEnvironment'), 'error');
    renderEmpty(t('noEnvironmentText'));
    return;
  }

  setBadge(t('empty'));
  renderEmpty(t('emptyText'));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function storageResultMatchesEnv(result, envId) {
  const cachedEnvId = result?.environmentInfo?.id || result?.environmentInfo?.envId;
  return Boolean(result && envId && cachedEnvId === envId);
}

async function renderCachedState(envId) {
  const { lastConvertResult } = await getStorage(['lastConvertResult']);

  if (storageResultMatchesEnv(lastConvertResult, envId)) {
    renderState({
      state: 'uploaded',
      metadata: {
        updatedAt: lastConvertResult.timestamp,
        originalFile: lastConvertResult.originalFile,
        convertedFile: lastConvertResult.convertedFile,
        videoInfo: lastConvertResult.videoInfo,
        convertOptions: lastConvertResult.convertOptions,
      },
      badgeKey: 'cachedBadge',
      badgeClass: 'warning',
      titleKey: 'cachedTitle',
    });
    return true;
  }

  return false;
}

async function loadCurrentState() {
  environmentInfo = await resolveEnvironmentInfo();
  renderChrome();

  const envId = getEnvId(environmentInfo);
  if (!envId) {
    renderState({ state: 'no_environment' });
    return;
  }

  try {
    const port = getApiPort(environmentInfo);
    const response = await fetch(`http://127.0.0.1:${port}/dic_api/video/current?envId=${encodeURIComponent(envId)}`);

    if (!response.ok) {
      throw new Error('api_unavailable');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'api_unavailable');
    }

    renderState(result.data);
  } catch (error) {
    console.warn('Failed to read current spoofing video state:', error);
    const renderedCache = await renderCachedState(envId);
    if (!renderedCache) {
      renderState({ state: 'api_unavailable' });
    }
  }
}

uploadButton.addEventListener('click', async () => {
  setBusy(true);

  try {
    const response = await sendMessage({
      type: 'select-and-convert',
      environmentInfo,
    });

    if (!response?.success) {
      throw new Error(response?.message || 'conversion_failed');
    }

    if (!response.data?.cancelled) {
      await loadCurrentState();
    }
  } catch (error) {
    console.warn('Failed to upload or replace video:', error);
    setBadge(t('conversionFailed'), 'error');
  } finally {
    setBusy(false);
  }
});

copyPathButton.addEventListener('click', async () => {
  if (!currentOriginalPath) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentOriginalPath);
    setCopyFeedback('success');
  } catch (error) {
    console.warn('Failed to copy original path:', error);
    setCopyFeedback('error');
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCurrentState);
} else {
  loadCurrentState();
}
