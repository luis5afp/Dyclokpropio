// background.js - 插件后台脚本，插件加载时立即执行
console.log('🚀 插件已加载，Service Worker启动');

// ==================== 立即注册Action点击事件 ====================

// 图标配置
const ICONS = {
  normal: {
    16: 'icons/camera-16.png',
    32: 'icons/camera-32.png',
    48: 'icons/camera-48.png',
    128: 'icons/camera-128.png',
  },
};

// 图标动画相关变量
let iconAnimationInterval = null;
let iconAnimationFrame = 0;

// 设置图标状态
function setIconState(state) {
  try {
    if (state === 'loading') {
      // Loading状态：修改标题并开始图标动画
      chrome.action.setTitle({ title: '🔄 conversion...' });
      startIconAnimation();
      console.log(`🎯 状态已设置为: ${state} (开始动画)`);
    } else {
      // 正常状态：停止动画，恢复原始图标和标题
      stopIconAnimation();
      const iconSet = ICONS.normal;
      chrome.action.setIcon({ path: iconSet }, () => {
        if (chrome.runtime.lastError) {
          console.warn('⚠️ 设置图标时出现警告:', chrome.runtime.lastError.message);
        } else {
          console.log(`🎯 图标已恢复为: ${state}`);
        }
      });
      chrome.action.setTitle({ title: `To replace the browser's video stream, please upload an MP4 video.` });
    }
  } catch (error) {
    console.error('❌ 设置图标状态失败:', error);
  }
}

// 开始图标动画（通过修改badge来显示loading状态）
function startIconAnimation() {
  stopIconAnimation(); // 确保没有重复的动画

  const loadingChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  iconAnimationFrame = 0;

  iconAnimationInterval = setInterval(() => {
    const char = loadingChars[iconAnimationFrame % loadingChars.length];
    chrome.action.setBadgeText({ text: char });
    chrome.action.setBadgeBackgroundColor({ color: '#4285f4' });
    iconAnimationFrame++;
  }, 100);
}

// 停止图标动画
function stopIconAnimation() {
  if (iconAnimationInterval) {
    clearInterval(iconAnimationInterval);
    iconAnimationInterval = null;
  }
  // 清除badge
  chrome.action.setBadgeText({ text: '' });
}

// 延迟注册action点击事件，确保所有函数都已定义
function registerActionClickListener() {
  console.log('🔧 注册插件图标点击事件监听器...');
  chrome.action.onClicked.addListener(async tab => {
    console.log('🎬 用户点击了插件图标，开始文件选择和转换流程');
    console.log('📋 当前标签页信息:', tab);

    try {
      // 设置loading状态
      setIconState('loading');

      // 获取环境信息 - 从第一个标签页或已保存的信息
      const environmentInfo = await getEnvironmentInfo();
      console.log('🌍 环境信息:', environmentInfo);

      // 调用桌面应用的文件选择和转换API
      await selectAndConvertFile(environmentInfo);
    } catch (error) {
      console.error('❌ 文件选择和转换失败:', error);

      // // 显示错误通知
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: 'icons/camera-48.png',
      //   title: '❌ MP4转Y4M转换失败',
      //   message: `⚠️ 操作失败: ${error.message}`,
      //   priority: 2, // 高优先级
      //   requireInteraction: true, // 需要用户交互才消失
      // });
    } finally {
      // 恢复正常状态
      setIconState('normal');
    }
  });
  console.log('✅ 插件图标点击事件监听器已注册');
}

function registerRuntimeMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'get-environment-info') {
      getEnvironmentInfo()
        .then(environmentInfo => {
          sendResponse({
            success: true,
            data: environmentInfo,
          });
        })
        .catch(error => {
          sendResponse({
            success: false,
            message: error?.message || '获取环境信息失败',
          });
        });

      return true;
    }

    if (message?.type !== 'select-and-convert') {
      return false;
    }

    (async () => {
      try {
        setIconState('loading');
        const environmentInfo = message.environmentInfo || (await getEnvironmentInfo());
        const data = await selectAndConvertFile(environmentInfo);
        sendResponse({
          success: true,
          data,
        });
      } catch (error) {
        console.error('❌ Popup触发文件选择和转换失败:', error);
        sendResponse({
          success: false,
          message: error?.message || '转换失败',
        });
      } finally {
        setIconState('normal');
      }
    })();

    return true;
  });
}

// 设置初始图标状态
setIconState('normal');

// 清除任何残留的badge
chrome.action.setBadgeText({ text: '' });
// 测试action API
console.log('🧪 测试chrome.action API...');
try {
  if (chrome.action) {
    console.log('✅ chrome.action API可用');

    // 测试获取当前图标
    chrome.action.getTitle({}, title => {
      console.log('📋 当前图标标题:', title);
    });

    // 添加一个简单的测试点击处理
    setTimeout(() => {
      console.log('⏰ 5秒后，如果您点击图标但没有响应，请检查manifest.json配置');
    }, 5000);
  } else {
    console.error('❌ chrome.action API不可用');
  }
} catch (error) {
  console.error('❌ 测试action API失败:', error);
}

// 插件安装/启动时触发
chrome.runtime.onInstalled.addListener(details => {
  console.log('📦 插件已安装/更新:', details.reason);
  handlePluginStartup();
});

// Chrome启动时触发（如果插件已安装）
chrome.runtime.onStartup.addListener(() => {
  console.log('🌟 Chrome启动，插件激活');
  handlePluginStartup();
});

// 立即执行（适配自定义Chromium内核）
(function immediateStartup() {
  console.log('⚡ 立即执行模式启动');
  handlePluginStartup();
})();

// 核心函数：处理插件启动逻辑
async function handlePluginStartup() {
  console.log('🔄 开始处理插件启动逻辑...');
}

console.log('🎉 Background脚本初始化完成');

// ==================== 直接文件选择功能 ====================

// 获取环境信息
async function getEnvironmentInfo() {
  try {
    const environmentInfo =
      typeof globalThis.__dic_profile_info === 'string'
        ? JSON.parse(globalThis.__dic_profile_info)
        : globalThis.__dic_profile_info;

    if (environmentInfo) {
      return environmentInfo;
    }

    console.warn('⚠️ 无法获取环境信息');
    return {};
  } catch (error) {
    console.error('❌ 获取环境信息失败:', error);
    return {};
  }
}

// 选择文件并转换
async function selectAndConvertFile(environmentInfo) {
  const apiBase = 'http://127.0.0.1';
  const port = environmentInfo?.localServerConfig?.port || 27777;
  const apiPath = '/dic_api';

  console.log(`🔄 调用桌面应用API: ${apiBase}:${port}${apiPath}/video/select-and-convert`);

  const response = await fetch(`${apiBase}:${port}${apiPath}/video/select-and-convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      environmentInfo: {
        ...environmentInfo,
        envId: environmentInfo?.id || environmentInfo?.envId,
      },
      convertOptions: {
        quality: 'slow', // 保持高质量
        autoDetectSize: true, // 自动检测原始尺寸
      },
    }),
  });

  if (!response.ok) {
    throw new Error('请求失败，请确保桌面应用正在运行');
  }

  const result = await response.json();
  console.log('📊 选择和转换结果:', result);

  if (result.success) {
    console.log('✅ 转换成功！');
    console.log('📁 原文件:', result.data.originalFile);
    console.log('📁 Y4M文件:', result.data.convertedFile);
    console.log('📊 视频信息:', result.data.videoInfo);
    console.log('⚙️ 转换参数:', result.data.convertOptions);
    console.log('📈 压缩比:', result.data.compressionRatio);

    // 保存转换结果
    await chrome.storage.local.set({
      lastConvertResult: {
        timestamp: Date.now(),
        ...result.data,
        environmentInfo: environmentInfo,
      },
    });

    return result.data;

    // 显示成功通知
    // chrome.notifications.create({
    //   type: 'basic',
    //   iconUrl: 'icons/camera-48.png',
    //   title: '🎉 completed!!',
    //   message: `📁 文件大小: ${result.data.convertedFile.sizeHuman}\n📊 压缩率: ${result.data.compressionRatio}`,
    //   priority: 2, // 高优先级
    //   requireInteraction: true, // 需要用户交互才消失（在支持的平台上）
    // });
  } else {
    if (result.message === 'user_cancelled') {
      console.log('ℹ️ 用户取消了文件选择');
      // 不显示错误，用户主动取消
      return {
        cancelled: true,
      };
    } else {
      throw new Error(result.message || '转换失败');
    }
  }
}

// ==================== 最终初始化 ====================

// 在所有函数定义完成后，注册action点击事件监听器
registerActionClickListener();
registerRuntimeMessageListener();

// 最终初始化完成日志
console.log('🎉 所有功能已初始化完成，插件已就绪！');
