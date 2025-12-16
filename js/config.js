/**
 * 功过格 App - 配置模块
 * Configuration Module
 *
 * 用于管理应用配置，包括市场区分、第三方登录配置等
 */

const AppConfig = {
  // 市场类型：'china' | 'global'
  // 可以通过 Android BuildConfig 或环境变量设置
  market: (() => {
    // 1. 优先使用 Android 注入的配置
    if (typeof window !== "undefined" && window.APP_MARKET) {
      return window.APP_MARKET;
    }

    // 2. 根据 User-Agent 判断（Android 可以设置）
    const ua = navigator.userAgent || "";
    if (ua.includes("China") || ua.includes("CN")) {
      return "china";
    }

    // 3. 默认使用 global（可以通过环境变量覆盖）
    return "global";
  })(),

  // 第三方登录配置
  // Refactored: Only Google Sign-In is enabled; other providers are kept for future use
  thirdPartyLogin: {
    // 国内市场支持的登录方式（已禁用，仅保留Google）
    china: ["google"],

    // 全球市场支持的登录方式（已禁用，仅保留Google）
    global: ["google"],

    // 获取当前市场支持的登录方式（仅返回Google）
    getEnabledProviders() {
      return ["google"];
    },

    // 检查某个登录方式是否可用（仅Google可用）
    isProviderEnabled(provider) {
      return provider === "google";
    },
  },

  // 获取当前市场
  getMarket() {
    return this.market;
  },

  // 设置市场（用于测试或动态切换）
  setMarket(market) {
    if (market === "china" || market === "global") {
      this.market = market;
      // 触发配置变更事件
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("appConfigChanged", {
            detail: { market },
          })
        );
      }
    }
  },
};

// Google OAuth Client ID
// 从配置文件或环境变量读取，避免硬编码
let googleClientId = null;
let configLoadPromise = null;

/**
 * 加载配置文件
 */
async function loadConfig() {
  if (configLoadPromise) {
    return configLoadPromise;
  }

  configLoadPromise = (async () => {
    try {
      // 优先使用 Vite 环境变量（构建时注入）
      try {
        // @ts-ignore - Vite 环境变量
        if (
          typeof import.meta !== "undefined" &&
          import.meta.env &&
          import.meta.env.VITE_GOOGLE_CLIENT_ID
        ) {
          // @ts-ignore
          googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        }
      } catch (e) {
        // 忽略环境变量检查错误
      }

      // 如果环境变量不存在，尝试从配置文件加载
      if (!googleClientId) {
        try {
          const response = await fetch("/config.json");
          if (response.ok) {
            const config = await response.json();
            googleClientId = config.googleClientId;
          }
        } catch (e) {
          console.warn(
            "⚠️ 无法加载 config.json，请确保已创建配置文件（参考 config.example.json）"
          );
        }
      }

      // 如果仍然没有，尝试从 window 对象读取（Android 注入或其他方式）
      if (
        !googleClientId &&
        typeof window !== "undefined" &&
        window.GOOGLE_CLIENT_ID
      ) {
        googleClientId = window.GOOGLE_CLIENT_ID;
      }

      // 验证配置是否已加载
      if (!googleClientId) {
        console.error(
          "❌ Google Client ID 未配置！请创建 config.json 文件或设置环境变量 VITE_GOOGLE_CLIENT_ID"
        );
      }

      // 设置到 window 对象，供其他模块使用
      if (typeof window !== "undefined") {
        window.GOOGLE_CLIENT_ID = googleClientId;
      }
    } catch (error) {
      console.error("❌ 加载配置失败:", error);
    }
  })();

  return configLoadPromise;
}

/**
 * 等待配置加载完成
 * 供其他模块在需要 Google Client ID 之前调用
 */
async function ensureConfigLoaded() {
  await loadConfig();
  if (!window.GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID 未配置，无法使用 Google 登录功能");
  }
}

// 立即加载配置（异步）
if (typeof window !== "undefined") {
  loadConfig();

  // 导出配置加载函数
  window.ensureConfigLoaded = ensureConfigLoaded;
}

// 导出
if (typeof window !== "undefined") {
  window.appConfig = AppConfig;
}

export default AppConfig;
