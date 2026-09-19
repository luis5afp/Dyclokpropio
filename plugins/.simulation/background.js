const background = {};

let ShortcutKeys = ['Ctrl', 'Shift', 'U'];
const userLanguage = chrome.i18n.getUILanguage();
console.log(userLanguage);
background.init = async () => {
  createAutopasteContext();
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'simulateInput') {
      chrome.tabs.sendMessage(tab.id, { action: 'simulateInput' }, response => {
        if (chrome.runtime.lastError) {
          console.error('发送消息失败:', chrome.runtime.lastError);
        }
      });
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === 'apply-autopaste') {
      if (
        !ShortcutKeys ||
        !message.keys ||
        ShortcutKeys.length !== message.keys.length ||
        !ShortcutKeys.every(key => message.keys.includes(key))
      ) {
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs[0];
        console.log(activeTab);
        chrome.tabs.sendMessage(activeTab.id, { action: 'simulateInput' }, response => {
          if (chrome.runtime.lastError) {
            console.error('发送消息失败:', chrome.runtime.lastError);
          }
        });
      });
    }
  });
};

function createAutopasteContext() {
  chrome.contextMenus.create({
    id: 'simulateInput',
    title: userLanguage === 'zh-CN' ? '输入仿真 (Ctrl+ Shift+U)' : 'Input simulation (Ctrl+ Shift+U)',
    contexts: ['editable'],
  });
}

background.init();
