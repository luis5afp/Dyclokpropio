let selectedInput = null;
let inputTime = 100;
if (typeof extendedParams == 'undefined') {
} else {
  var oringinExtendedParam = window.atob(extendedParams);

  let data = JSON.parse(oringinExtendedParam);
  inputTime = data.inputTime;
}
let ShortcutKeys = ['Ctrl', 'Shift', 'U'];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'simulateInput' && selectedInput) {
    navigator.clipboard
      .readText()
      .then(text => {
        simulateInput(selectedInput, text);
      })
      .catch(err => {
        console.error('无法读取剪贴板内容:', err);
      });
  }
});

function setSelectedInput(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    selectedInput = e.target;
  } else {
    selectedInput = null;
  }
}

document.addEventListener('contextmenu', e => {
  setSelectedInput(e);
});

function simulateInput(input, text) {
  input.focus();
  let index = 0;

  function typeCharacter() {
    if (index < text.length) {
      input.value += text[index];
      input.dispatchEvent(new Event('input', { bubbles: true }));
      index++;
      setTimeout(typeCharacter, inputTime);
    }
  }
  typeCharacter();
}

window.addEventListener(
  'keydown',
  e => {
    const downKeys = new Set();
    if (e.ctrlKey) downKeys.add('Ctrl');
    if (e.altKey) downKeys.add('Alt');
    if (e.metaKey) downKeys.add('Command');
    if (e.shiftKey) downKeys.add('Shift');
    if (e.key.length === 1) {
      downKeys.add(e.key.toUpperCase());
      if (
        !ShortcutKeys ||
        !Array.from(downKeys) ||
        ShortcutKeys.length !== Array.from(downKeys).length ||
        !ShortcutKeys.every(key => Array.from(downKeys).includes(key))
      ) {
        return;
      } else {
        setSelectedInput(e);
        navigator.clipboard
          .readText()
          .then(text => {
            simulateInput(selectedInput, text);
          })
          .catch(err => {
            console.error('无法读取剪贴板内容:', err);
          });
      }
    }
  },
  true,
);
