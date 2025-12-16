/**
 * 功过格 App - API 工具模块
 * API Utility Module for GongGuoGe App
 * 
 * 工程必须：基础 API 封装，统一错误处理
 * 可以以后再做：请求拦截器、自动重试、请求队列
 */

// API 基础配置
// 优先级：window.API_BASE_URL > 环境变量 > 默认值
// Android 集成：在 WebView 中通过 window.API_BASE_URL 设置
const getBaseURL = () => {
  // 1. 优先使用全局变量（Android WebView 可以设置）
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  
  // 2. 检查是否是移动设备，使用局域网 IP
  if (typeof window !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hostname = window.location.hostname;
    
    // 如果是移动设备且不在 localhost，尝试使用当前 hostname
    if (isMobile && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
    
    // 如果是移动设备访问 localhost，使用局域网 IP（需要手动配置）
    if (isMobile && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      // 默认使用 192.168.33.50，Android 项目可以覆盖
      return 'http://192.168.33.50:3000';
    }
  }
  
  // 3. 默认使用 localhost
  return 'http://localhost:3000';
};

const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 10000, // 10秒超时
  TOKEN_KEY: 'ggg_auth_token', // Token 存储 key
  USER_KEY: 'ggg_user' // 用户信息存储 key
};

/**
 * Token 管理
 */
const TokenManager = {
  getToken() {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  },
  setToken(token) {
    if (token) {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    }
  },
  clearToken() {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.USER_KEY);
  }
};

/**
 * 基础请求函数
 * @param {string} endpoint - API 路径（如 '/api/health'）
 * @param {object} options - fetch 选项
 * @param {boolean} requireAuth - 是否需要认证（默认 false）
 * @returns {Promise} 响应数据
 */
async function apiRequest(endpoint, options = {}, requireAuth = false) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };

  // 如果需要认证，添加 Token
  if (requireAuth) {
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('未登录，请先登录');
    }
  }

  const defaultOptions = {
    headers,
    ...options
  };

  // 如果有 body，确保是 JSON 字符串
  if (defaultOptions.body && typeof defaultOptions.body === 'object') {
    defaultOptions.body = JSON.stringify(defaultOptions.body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    // 解析 JSON
    const data = await response.json();
    return data;
    
  } catch (error) {
    // 统一错误处理
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接');
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('无法连接到服务器，请确认后端服务已启动');
    }
    // 401 未授权，清除 Token
    if (error.message.includes('401') || error.message.includes('未登录')) {
      TokenManager.clearToken();
      // 触发登出事件
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    throw error;
  }
}

/**
 * GET 请求
 */
async function get(endpoint, params = {}, requireAuth = false) {
  let url = endpoint;
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  return apiRequest(url, { method: 'GET' }, requireAuth);
}

/**
 * POST 请求
 */
async function post(endpoint, data = {}, requireAuth = false) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: data
  }, requireAuth);
}

/**
 * PUT 请求
 */
async function put(endpoint, data = {}, requireAuth = false) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: data
  }, requireAuth);
}

/**
 * DELETE 请求
 */
async function del(endpoint, requireAuth = false) {
  return apiRequest(endpoint, { method: 'DELETE' }, requireAuth);
}

/**
 * 测试后端连接
 * 用于调试，可在控制台直接调用：window.api.testConnection()
 */
async function testConnection() {
  console.log('🔍 开始测试后端连接...');
  console.log(`📍 后端地址: ${API_CONFIG.BASE_URL}`);
  
  try {
    // 测试健康检查接口
    console.log('\n1️⃣ 测试健康检查接口 /api/health...');
    const health = await get('/api/health');
    console.log('✅ 健康检查成功:', health);
    
    // 测试示例接口
    console.log('\n2️⃣ 测试示例接口 /api/test...');
    const test = await get('/api/test');
    console.log('✅ 示例接口成功:', test);
    
    console.log('\n🎉 后端连接测试全部通过！');
    return { success: true, health, test };
    
  } catch (error) {
    console.error('❌ 后端连接测试失败:', error.message);
    console.error('💡 请确认：');
    console.error('   1. 后端服务已启动（npm run dev）');
    console.error('   2. 后端运行在 http://localhost:3000');
    console.error('   3. 浏览器控制台没有 CORS 错误');
    return { success: false, error: error.message };
  }
}

// ========== 认证 API ==========

/**
 * 发送验证码
 */
async function sendCode(email) {
  const result = await post('/api/auth/send-code', { email });
  return result;
}

/**
 * 登录/注册
 */
async function login(email, code) {
  const result = await post('/api/auth/login', { email, code });
  
  if (result.success && result.data) {
    // 保存 Token 和用户信息
    TokenManager.setToken(result.data.token);
    localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(result.data.user));
    
    // 触发登录事件
    window.dispatchEvent(new CustomEvent('auth:login', { detail: result.data }));
  }
  
  return result;
}

/**
 * 退出登录
 */
function logout() {
  TokenManager.clearToken();
  window.dispatchEvent(new CustomEvent('auth:logout'));
}

/**
 * 获取当前用户
 */
function getCurrentUser() {
  const userStr = localStorage.getItem(API_CONFIG.USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * 是否已登录
 */
function isAuthenticated() {
  return !!TokenManager.getToken();
}

// ========== 记录 API ==========

/**
 * 创建记录
 */
async function createRecord(record) {
  return await post('/api/records', record, true);
}

/**
 * 获取记录列表
 */
async function getRecords(options = {}) {
  return await get('/api/records', options, true);
}

/**
 * 获取单条记录
 */
async function getRecord(id) {
  return await get(`/api/records/${id}`, {}, true);
}

/**
 * 更新记录
 */
async function updateRecord(id, data) {
  return await put(`/api/records/${id}`, data, true);
}

/**
 * 删除记录
 */
async function deleteRecord(id) {
  return await del(`/api/records/${id}`, true);
}

/**
 * 获取统计信息
 */
async function getStats(options = {}) {
  return await get('/api/records/stats', options, true);
}

// ========== 同步 API ==========

/**
 * 同步记录
 */
async function syncRecords(records) {
  return await post('/api/sync/records', { records }, true);
}

// ========== 埋点分析 API ==========

/**
 * 获取用户统计
 */
async function getAnalyticsStats(eventType = null) {
  const params = eventType ? { eventType } : {};
  return await get('/api/analytics/stats', params, true);
}

/**
 * 获取日记录次数
 */
async function getDailyRecordCount(days = 30) {
  return await get('/api/analytics/daily-record-count', { days }, true);
}

/**
 * 获取连续使用天数
 */
async function getConsecutiveDays() {
  return await get('/api/analytics/consecutive-days', {}, true);
}

// ========== 命运刻度条 API ==========

/**
 * 计算命运刻度条
 */
async function getFateIndex() {
  return await get('/api/fate/index', {}, true);
}

// ========== 每日一言 API ==========

/**
 * 获取今日语录（公开接口，不需要认证）
 */
async function getDailyQuote(locale = null) {
  const params = locale ? { locale } : {};
  return await get('/api/daily-quote', params, false);
}

// 导出 API 工具
window.api = {
  // 基础方法
  get,
  post,
  put,
  delete: del,
  testConnection,
  config: API_CONFIG,
  
  // 认证
  sendCode,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  
  // 记录
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  getStats,
  
  // 同步
  syncRecords,
  
  // 埋点
  getAnalyticsStats,
  getDailyRecordCount,
  getConsecutiveDays,
  
  // 命运刻度条
  getFateIndex,
  
  // 每日一言
  getDailyQuote
};

// 开发环境下自动暴露到全局，方便调试
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('💡 API 工具已加载，可在控制台使用：');
  console.log('   window.api.testConnection() - 测试后端连接');
  console.log('   window.api.get("/api/health") - 测试 GET 请求');
}

