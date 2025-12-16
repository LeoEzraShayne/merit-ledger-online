/**
 * 功过格 App - 数据存储模块
 * Data Store Module for GongGuoGe App
 * 
 * 策略：
 * - 已登录：API + localStorage 缓存
 * - 未登录：localStorage（离线模式）
 * - 同步：登录后自动同步本地数据到服务端
 */

const STORAGE_KEYS = {
  RECORDS: 'ggg_records',
  USER: 'ggg_user',
  SETTINGS: 'ggg_settings',
  SYNC_PENDING: 'ggg_sync_pending', // 待同步的记录
  LAST_SYNC: 'ggg_last_sync' // 最后同步时间
};

// 同步状态
let isSyncing = false;
let syncQueue = [];

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化时间为 HH:mm
function formatTime(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ========== 本地存储操作 ==========

function getLocalRecords() {
  const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return data ? JSON.parse(data) : [];
}

function saveLocalRecords(records) {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

function addToSyncQueue(record) {
  const pending = getSyncPending();
  pending.push(record);
  localStorage.setItem(STORAGE_KEYS.SYNC_PENDING, JSON.stringify(pending));
}

function getSyncPending() {
  const data = localStorage.getItem(STORAGE_KEYS.SYNC_PENDING);
  return data ? JSON.parse(data) : [];
}

function clearSyncPending() {
  localStorage.removeItem(STORAGE_KEYS.SYNC_PENDING);
}

// ========== 记录操作（统一接口） ==========

/**
 * 获取所有记录（优先从 API，失败则用本地）
 */
async function getAllRecords() {
  if (window.api && window.api.isAuthenticated()) {
    try {
      const result = await window.api.getRecords();
      if (result.success && result.data) {
        // 保存到本地缓存
        saveLocalRecords(result.data);
        return result.data;
      }
    } catch (error) {
      console.warn('获取记录失败，使用本地缓存:', error);
    }
  }
  
  // 使用本地缓存
  return getLocalRecords();
}

/**
 * 获取某天的记录
 */
async function getRecordsByDate(dateStr) {
  const records = await getAllRecords();
  // 去重：使用 Map 确保每个 ID 只返回一次
  const uniqueRecords = new Map();
  records
    .filter(r => r && r.date === dateStr && r.id) // 确保记录有效且有 ID
    .forEach(r => {
      // 如果已存在相同 ID，保留最新的（基于 created_at）
      if (!uniqueRecords.has(r.id)) {
        uniqueRecords.set(r.id, r);
      } else {
        const existing = uniqueRecords.get(r.id);
        const existingTime = existing.created_at || 0;
        const newTime = r.created_at || 0;
        if (newTime > existingTime) {
          uniqueRecords.set(r.id, r);
        }
      }
    });
  
  // 转换为数组并排序
  return Array.from(uniqueRecords.values())
    .sort((a, b) => {
      const timeA = a.time || formatTime(new Date(a.created_at || 0));
      const timeB = b.time || formatTime(new Date(b.created_at || 0));
      return timeA.localeCompare(timeB);
    });
}

/**
 * 获取今天的记录
 */
async function getTodayRecords() {
  return await getRecordsByDate(formatDate(new Date()));
}

/**
 * 获取今天的统计
 */
async function getTodayStats() {
  const records = await getTodayRecords();
  let gong = 0, guo = 0, gongCount = 0, guoCount = 0;
  
  records.forEach(r => {
    if (r.type === 'gong') {
      gong += r.score || 0;
      gongCount++;
    } else {
      guo += r.score || 0;
      guoCount++;
    }
  });
  
  return { gong, guo, gongCount, guoCount, total: records.length };
}

/**
 * 获取某天的统计
 */
async function getDayStats(dateStr) {
  const records = await getRecordsByDate(dateStr);
  let gong = 0, guo = 0;
  
  records.forEach(r => {
    if (!r || !r.type) return; // 跳过无效记录
    const score = (r.score && typeof r.score === 'number') ? r.score : 0;
    if (r.type === 'gong') {
      gong += score;
    } else if (r.type === 'guo') {
      guo += score;
    }
  });
  
  return { gong: gong || 0, guo: guo || 0, records: records.length };
}

/**
 * 获取某月的统计
 */
async function getMonthStats(year, month) {
  const records = await getAllRecords();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  let gong = 0, guo = 0;
  const dailyStats = {};
  
  records.filter(r => r.date && r.date.startsWith(prefix)).forEach(r => {
    if (r.type === 'gong') {
      gong += r.score || 0;
    } else {
      guo += r.score || 0;
    }
    
    if (!dailyStats[r.date]) {
      dailyStats[r.date] = { gong: 0, guo: 0 };
    }
    if (r.type === 'gong') {
      dailyStats[r.date].gong += r.score || 0;
    } else {
      dailyStats[r.date].guo += r.score || 0;
    }
  });
  
  return { gong, guo, dailyStats };
}

/**
 * 获取本周统计
 */
async function getWeekStats() {
  const today = new Date();
  const stats = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const dayStats = await getDayStats(dateStr);
    stats.push({
      date: dateStr,
      day: date.getDay(),
      isToday: i === 0,
      ...dayStats
    });
  }
  
  return stats;
}

/**
 * 获取总计统计
 */
async function getTotalStats() {
  if (window.api && window.api.isAuthenticated()) {
    try {
      const result = await window.api.getStats();
      if (result.success && result.data) {
        return {
          gong: result.data.totalGong || 0,
          guo: result.data.totalGuo || 0,
          totalRecords: result.data.totalCount || 0
        };
      }
    } catch (error) {
      console.warn('获取总统计失败，使用本地计算:', error);
    }
  }
  
  // 本地计算
  const records = await getAllRecords();
  let gong = 0, guo = 0;
  
  records.forEach(r => {
    if (r.type === 'gong') {
      gong += r.score || 0;
    } else {
      guo += r.score || 0;
    }
  });
  
  return { gong, guo, totalRecords: records.length };
}

/**
 * 计算命运刻度条（优先从 API）
 */
async function calculateFateIndex() {
  if (window.api && window.api.isAuthenticated()) {
    try {
      const result = await window.api.getFateIndex();
      if (result.success && result.data) {
        return result.data.fateIndex;
      }
    } catch (error) {
      console.warn('获取命运刻度条失败，使用本地计算:', error);
    }
  }
  
  // 本地计算（30天）
  const today = new Date();
  let totalGong = 0, totalGuo = 0;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const stats = await getDayStats(formatDate(date));
    totalGong += stats.gong;
    totalGuo += stats.guo;
  }
  
  const total = totalGong + totalGuo;
  if (total === 0) return 50;
  
  const index = Math.round((totalGong / total) * 100);
  return Math.max(0, Math.min(100, index));
}

/**
 * 获取命运档位
 */
function getFateLevel(index) {
  if (index < 20) return 1;      // 暗淡
  if (index < 40) return 2;      // 微光
  if (index < 60) return 3;      // 明光
  if (index < 80) return 4;      // 昼明
  return 5;                      // 辉耀
}

/**
 * 添加记录（先写本地，再同步到服务端）
 */
async function addRecord(record) {
  const now = new Date();
  const dateStr = formatDate(now);
  
  const newRecord = {
    id: `${dateStr}-${Date.now()}`,
    date: dateStr,
    time: formatTime(now),
    type: record.type,
    score: record.score || 1,
    note: record.note || '',
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  
  // 先保存到本地
  const localRecords = getLocalRecords();
  localRecords.push(newRecord);
  saveLocalRecords(localRecords);
  
  // 如果已登录，同步到服务端
  if (window.api && window.api.isAuthenticated()) {
    try {
      const result = await window.api.createRecord({
        type: newRecord.type,
        score: newRecord.score,
        note: newRecord.note,
        date: newRecord.date
      });
      
      if (result.success && result.data) {
        // 更新本地记录 ID（使用服务端返回的 ID）
        const index = localRecords.findIndex(r => r.id === newRecord.id);
        if (index !== -1) {
          localRecords[index] = result.data;
          saveLocalRecords(localRecords);
        }
        return result.data;
      }
    } catch (error) {
      console.warn('同步记录失败，已保存到本地:', error);
      // 添加到待同步队列
      addToSyncQueue(newRecord);
    }
  } else {
    // 未登录，添加到待同步队列
    addToSyncQueue(newRecord);
  }
  
  return newRecord;
}

/**
 * 更新记录
 */
async function updateRecord(id, updates) {
  const localRecords = getLocalRecords();
  const index = localRecords.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...localRecords[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  localRecords[index] = updated;
  saveLocalRecords(localRecords);
  
  // 如果已登录，同步到服务端
  if (window.api && window.api.isAuthenticated()) {
    try {
      await window.api.updateRecord(id, updates);
    } catch (error) {
      console.warn('更新记录失败，已保存到本地:', error);
      addToSyncQueue(updated);
    }
  } else {
    addToSyncQueue(updated);
  }
  
  return updated;
}

/**
 * 删除记录
 */
async function deleteRecord(id) {
  const localRecords = getLocalRecords();
  const filtered = localRecords.filter(r => r.id !== id);
  saveLocalRecords(filtered);
  
  // 如果已登录，同步到服务端
  if (window.api && window.api.isAuthenticated()) {
    try {
      await window.api.deleteRecord(id);
    } catch (error) {
      console.warn('删除记录失败，已从本地删除:', error);
    }
  }
  
  return filtered.length < localRecords.length;
}

/**
 * 获取单条记录
 */
async function getRecord(id) {
  const records = await getAllRecords();
  return records.find(r => r.id === id);
}

// ========== 用户操作 ==========

/**
 * 获取用户信息
 */
function getUser() {
  if (window.api) {
    return window.api.getCurrentUser();
  }
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
}

/**
 * 是否已登录
 */
function isLoggedIn() {
  if (window.api) {
    return window.api.isAuthenticated();
  }
  return getUser() !== null;
}

/**
 * 退出登录
 */
function logout() {
  if (window.api) {
    window.api.logout();
  }
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * 检查是否需要登录提示（第4条及以后）
 */
function shouldPromptLogin() {
  if (isLoggedIn()) return false;
  // 这里需要异步获取，但为了兼容现有代码，先同步获取
  const todayRecords = getLocalRecords().filter(r => r.date === formatDate(new Date()));
  return todayRecords.length >= 3;
}

// ========== 同步操作 ==========

/**
 * 同步本地数据到服务端
 */
async function syncToServer() {
  if (!window.api || !window.api.isAuthenticated()) {
    return { success: false, message: '未登录' };
  }
  
  if (isSyncing) {
    return { success: false, message: '正在同步中' };
  }
  
  isSyncing = true;
  
  try {
    const localRecords = getLocalRecords();
    const pending = getSyncPending();
    
    // 合并本地记录和待同步记录
    const allRecords = [...localRecords, ...pending];
    
    if (allRecords.length === 0) {
      isSyncing = false;
      return { success: true, message: '无需同步' };
    }
    
    // 调用同步接口
    const result = await window.api.syncRecords(allRecords);
    
    if (result.success) {
      // 更新本地记录（使用服务端返回的数据）
      if (result.data.serverRecords) {
        saveLocalRecords(result.data.serverRecords);
      }
      
      // 清空待同步队列
      clearSyncPending();
      
      // 更新最后同步时间
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
      isSyncing = false;
      return { success: true, message: '同步成功', data: result.data };
    }
    
    isSyncing = false;
    return { success: false, message: result.message || '同步失败' };
  } catch (error) {
    isSyncing = false;
    console.error('同步失败:', error);
    return { success: false, message: error.message || '同步失败' };
  }
}

/**
 * 初始化（登录后调用，自动同步）
 */
async function init() {
  // 如果已登录，尝试同步
  if (isLoggedIn()) {
    await syncToServer();
    // 拉取最新数据
    await getAllRecords();
  }
}

// 导出
window.store = {
  // 基础方法
  formatDate,
  init,
  
  // 记录查询
  getAllRecords,
  getRecordsByDate,
  getTodayRecords,
  getTodayStats,
  getDayStats,
  getMonthStats,
  getWeekStats,
  getTotalStats,
  getRecord,
  
  // 记录操作
  addRecord,
  updateRecord,
  deleteRecord,
  
  // 命运刻度条
  calculateFateIndex,
  getFateLevel,
  
  // 用户
  getUser,
  isLoggedIn,
  logout,
  shouldPromptLogin,
  
  // 同步
  syncToServer
};

// 监听登录事件，自动同步
if (typeof window !== 'undefined') {
  window.addEventListener('auth:login', () => {
    init();
  });
}
