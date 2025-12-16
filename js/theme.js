/**
 * 功过格 App - 主题控制模块
 * Theme Control Module for GongGuoGe App
 */

// 语言与文化主题映射
const languageThemeMap = {
  'zh': 'theme-zh',
  'ja': 'theme-ja',
  'en': 'theme-en'
};

// 主题配置
const themeConfig = {
  'theme-zh': {
    name: '中文主题',
    nameKey: 'theme.zh',
    animationType: 'stamp',
    font: "'Noto Serif SC', 'PingFang SC', 'Hiragino Sans GB', serif"
  },
  'theme-ja': {
    name: '日文主题',
    nameKey: 'theme.ja',
    animationType: 'ripple',
    font: "'Noto Serif JP', 'Hiragino Mincho Pro', serif"
  },
  'theme-en': {
    name: '英文主题',
    nameKey: 'theme.en',
    animationType: 'confetti',
    font: "'Inter', 'SF Pro Display', -apple-system, sans-serif"
  }
};

// 获取当前系统主题偏好
function getSystemThemePreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// 获取当前文化主题
function getCurrentCultureTheme() {
  const locale = window.i18n ? window.i18n.getCurrentLocale() : 'zh';
  return languageThemeMap[locale] || 'theme-zh';
}

// 获取当前明暗模式
function getCurrentColorMode() {
  const saved = localStorage.getItem('ggg_colorMode');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  // 跟随系统
  return getSystemThemePreference();
}

// 设置明暗模式
function setColorMode(mode) {
  if (mode === 'system') {
    localStorage.removeItem('ggg_colorMode');
    mode = getSystemThemePreference();
  } else {
    localStorage.setItem('ggg_colorMode', mode);
  }
  
  applyTheme();
  return mode;
}

// 应用主题
function applyTheme() {
  const cultureTheme = getCurrentCultureTheme();
  const colorMode = getCurrentColorMode();
  
  // 移除所有主题类
  document.body.classList.remove('theme-zh', 'theme-ja', 'theme-en', 'dark', 'light');
  
  // 添加文化主题
  document.body.classList.add(cultureTheme);
  
  // 添加明暗模式
  if (colorMode === 'dark') {
    document.body.classList.add('dark');
  }
  
  // 更新 HTML lang 属性
  const locale = window.i18n ? window.i18n.getCurrentLocale() : 'zh';
  document.documentElement.lang = locale;
  
  // 触发主题变更事件
  document.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { cultureTheme, colorMode }
  }));
}

// 切换语言（同时切换文化主题）
function switchLanguage(locale) {
  if (window.i18n && window.i18n.setLocale(locale)) {
    applyTheme();
    window.i18n.updatePageTexts();
    return true;
  }
  return false;
}

// 获取当前主题的动画类型
function getAnimationType() {
  const cultureTheme = getCurrentCultureTheme();
  return themeConfig[cultureTheme]?.animationType || 'stamp';
}

// 获取主题配置
function getThemeConfig(themeName) {
  return themeConfig[themeName || getCurrentCultureTheme()];
}

// 监听系统主题变化
function watchSystemTheme() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 只有在"跟随系统"模式下才响应
      if (!localStorage.getItem('ggg_colorMode')) {
        applyTheme();
      }
    });
  }
}

// 初始化主题
function initTheme() {
  applyTheme();
  watchSystemTheme();
}

// 导出
window.theme = {
  languageThemeMap,
  themeConfig,
  getSystemThemePreference,
  getCurrentCultureTheme,
  getCurrentColorMode,
  setColorMode,
  applyTheme,
  switchLanguage,
  getAnimationType,
  getThemeConfig,
  initTheme
};

