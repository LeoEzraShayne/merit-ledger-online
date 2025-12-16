/**
 * 功过格 App - 主应用模块
 * Main App Module for GongGuoGe App
 */

// 全局初始化
async function initApp() {
  // 初始化数据（不再使用假数据，改为初始化同步）
  if (window.store && window.store.init) {
    await window.store.init();
  }
  
  // 初始化主题
  if (window.theme) {
    window.theme.initTheme();
  }
  
  // 更新页面文本
  if (window.i18n) {
    window.i18n.updatePageTexts();
  }
  
  // 初始化弹窗系统
  if (window.modals) {
    window.modals.initModals();
  }
  
  // 绑定全局事件
  bindGlobalEvents();
  
  // 页面特定初始化
  await initPageSpecific();
  
  console.log('✓ App initialized');
}

// 绑定全局事件
function bindGlobalEvents() {
  // 返回按钮
  document.querySelectorAll('.back-btn, [data-action="back"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goBack();
    });
  });
  
  // 带跳转的元素
  document.querySelectorAll('[data-href]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const href = el.dataset.href;
      if (href) navigateTo(href);
    });
  });
  
  // 带参数跳转
  document.querySelectorAll('[data-navigate]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const page = el.dataset.navigate;
      const params = el.dataset.params ? JSON.parse(el.dataset.params) : {};
      navigateTo(page, params);
    });
  });
}

// 页面特定初始化
async function initPageSpecific() {
  const page = getCurrentPage();
  
  switch (page) {
    case 'splash':
      initSplashPage();
      break;
    case 'home':
      await initHomePage();
      break;
    case 'record':
      initRecordPage();
      break;
    case 'today_list':
      await initTodayListPage();
      break;
    case 'calendar':
      await initCalendarPage();
      break;
    case 'day_detail':
      await initDayDetailPage();
      break;
    case 'monument':
      await initMonumentPage();
      break;
    case 'settings':
      initSettingsPage();
      break;
    case 'about':
      initAboutPage();
      break;
  }
}

// 获取当前页面名称
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  return filename || 'home';
}

// 页面跳转
function navigateTo(page, params = {}) {
  let url = page.endsWith('.html') ? page : `${page}.html`;
  
  // 添加参数
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  window.location.href = url;
}

// 返回上一页（智能判断来源）
function goBack() {
  const referrer = document.referrer;
  const currentPage = getCurrentPage();
  
  // 如果当前在 calendar 页面，直接返回首页（因为 calendar 通常是入口页面）
  if (currentPage === 'calendar') {
    navigateTo('home');
    return;
  }
  
  // 智能判断来源页面
  if (referrer.includes('today_list')) {
    navigateTo('today_list');
  } else if (referrer.includes('day_detail')) {
    navigateTo('calendar');
  } else if (referrer && referrer.includes(window.location.host)) {
    // 有来源且是同域，使用浏览器返回
    window.history.back();
  } else {
    // 默认返回首页
    navigateTo('home');
  }
}

// 导出为全局函数，供其他页面调用
window.goBack = goBack;

// 获取 URL 参数
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/* ===== Splash 页面 ===== */
function initSplashPage() {
  // 3秒后跳转
  setTimeout(() => {
    const content = document.getElementById('splashContent');
    if (content) {
      content.classList.add('fade-out');
    }
  }, 3000);
  
  setTimeout(() => {
    navigateTo('home');
  }, 4500);
}

/* ===== 首页 ===== */
async function initHomePage() {
  // 更新日期显示
  updateHomeDate();
  
  // 更新今日统计
  await updateTodayStats();
  
  // 更新命运刻度条
  await updateFateIndex();
  
  // 更新周统计图表
  await updateWeekChart();
  
  // 加载每日一言
  await loadDailyQuote();

  // 初始化今日待办与反思
  await initTodoAndReflection();
  // 轻量通知（本地，提示一次）
  ensureNotificationPermission();
  
  // 绑定菜单按钮
  const avatarBtn = document.querySelector('.avatar');
  if (avatarBtn) {
    avatarBtn.addEventListener('click', () => {
      showMenuOverlay();
    });
  }
  
  // 绑定快捷按钮
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.classList.contains('guo') ? 'guo' : 'gong';
      navigateTo('record', { type });
    });
  });
  
  // 绑定今日卡片
  const todayCard = document.querySelector('.today-card');
  if (todayCard) {
    todayCard.addEventListener('click', () => {
      navigateTo('today_list');
    });
  }
  
  // FAB 按钮
  const fab = document.querySelector('.fab');
  if (fab) {
    fab.addEventListener('click', () => {
      navigateTo('record');
    });
  }
}

// 加载每日一言
async function loadDailyQuote() {
  const quoteTextEl = document.querySelector('.quote-text');
  const quoteSourceEl = document.querySelector('.quote-source');
  const dailyQuoteEl = document.querySelector('.daily-quote');
  
  if (!quoteTextEl || !quoteSourceEl) return;
  
  try {
    const locale = window.i18n?.getCurrentLocale() || 'zh';
    const result = await window.api?.getDailyQuote(locale);
    
    if (result && result.success && result.data) {
      const data = result.data;
      
      // 更新语录文本
      quoteTextEl.textContent = data.quote;
      quoteSourceEl.textContent = data.source;
      
      // 计算并显示"修行第X天"
      const dayOfYear = data.dayOfYear;
      const dayText = locale === 'en' 
        ? `Day ${dayOfYear} of Cultivation` 
        : locale === 'ja'
        ? `修行第${dayOfYear}日`
        : `修行第${dayOfYear}天`;
      
      // 检查是否已有"修行第X天"元素，如果没有则创建
      let dayIndicator = dailyQuoteEl?.querySelector('.quote-day-indicator');
      if (!dayIndicator && dailyQuoteEl) {
        dayIndicator = document.createElement('div');
        dayIndicator.className = 'quote-day-indicator';
        dailyQuoteEl.appendChild(dayIndicator);
      }
      
      if (dayIndicator) {
        dayIndicator.textContent = dayText;
      }
    }
  } catch (error) {
    console.warn('加载每日一言失败，使用默认语录:', error);
    // 失败时使用默认语录（已在HTML中定义）
  }
}

// ===== 今日待办 / 每日反思（本地存储，登录后亦可同步扩展） =====
const TODO_KEY = 'ggg_todos';
const REFLECTION_KEY = 'ggg_reflections';
const METRIC_KEY = 'ggg_metrics';

function getTodayKey() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function recordMetric(name) {
  try {
    const data = JSON.parse(localStorage.getItem(METRIC_KEY) || '{}');
    data[name] = (data[name] || 0) + 1;
    localStorage.setItem(METRIC_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

function loadTodos(dateKey) {
  try {
    const data = JSON.parse(localStorage.getItem(TODO_KEY) || '{}');
    return data[dateKey] || [];
  } catch (e) {
    return [];
  }
}

function saveTodos(dateKey, todos) {
  const data = JSON.parse(localStorage.getItem(TODO_KEY) || '{}');
  data[dateKey] = todos;
  localStorage.setItem(TODO_KEY, JSON.stringify(data));
}

function loadReflectionData(dateKey) {
  try {
    const data = JSON.parse(localStorage.getItem(REFLECTION_KEY) || '{}');
    return data[dateKey] || null;
  } catch (e) {
    return null;
  }
}

function saveReflectionData(dateKey, reflection) {
  const data = JSON.parse(localStorage.getItem(REFLECTION_KEY) || '{}');
  data[dateKey] = reflection;
  localStorage.setItem(REFLECTION_KEY, JSON.stringify(data));
}

// ===== 云同步（已登录时） =====
async function fetchTodosCloud(dateKey) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return null;
  try {
    const resp = await window.api.get('/api/todos', { date: dateKey }, true);
    if (resp.success && Array.isArray(resp.data)) return resp.data;
  } catch (e) {
    console.warn('云端获取待办失败，使用本地', e);
  }
  return null;
}

async function createTodoCloud(dateKey, text) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return null;
  try {
    const resp = await window.api.post('/api/todos', { text, date: dateKey }, true);
    if (resp.success && resp.data) return resp.data;
  } catch (e) {
    console.warn('云端创建待办失败，转本地', e);
  }
  return null;
}

async function updateTodoCloud(id, payload) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return false;
  try {
    const resp = await window.api.put(`/api/todos/${id}`, payload, true);
    return !!resp.success;
  } catch (e) {
    console.warn('云端更新待办失败', e);
    return false;
  }
}

async function deleteTodoCloud(id) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return false;
  try {
    const resp = await window.api.delete(`/api/todos/${id}`, true);
    return !!resp.success;
  } catch (e) {
    console.warn('云端删除待办失败', e);
    return false;
  }
}

async function fetchReflectionCloud(dateKey) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return null;
  try {
    const resp = await window.api.get('/api/reflections', { date: dateKey }, true);
    if (resp.success) return resp.data || null;
  } catch (e) {
    console.warn('云端获取反思失败，使用本地', e);
  }
  return null;
}

async function saveReflectionCloud(dateKey, text, score) {
  if (!window.api || !window.api.isAuthenticated || !window.api.isAuthenticated()) return null;
  try {
    const resp = await window.api.post('/api/reflections', { date: dateKey, text, score }, true);
    if (resp.success) return resp.data;
  } catch (e) {
    console.warn('云端保存反思失败', e);
  }
  return null;
}

async function sendMetric(event, meta = {}) {
  // 匿名/半匿名，上报即可，失败无感知
  try {
    await window.api.post('/api/metrics', { event, meta }, false);
  } catch (e) {
    // ignore
  }
}

// ===== 通知（轻量：请求权限 + 当天简单提醒；浏览器关闭时不保证触达） =====
const NOTIFY_KEY = 'ggg_notify_enabled';

function scheduleTodayReminder() {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const target = new Date();
  target.setHours(21, 0, 0, 0); // 晚上21:00 提醒
  let delay = target.getTime() - now.getTime();
  if (delay < 0) return; // 已过提醒时间

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('回顾今日', {
        body: '花1分钟完成待办/反思，记录功过',
        tag: 'ggg-daily-reminder'
      });
    }
  }, delay);
}

function ensureNotificationPermission() {
  if (typeof Notification === 'undefined') return;
  const enabled = localStorage.getItem(NOTIFY_KEY);
  if (enabled === 'yes') {
    scheduleTodayReminder();
    return;
  }
  if (Notification.permission === 'default') {
    // 尽量少打扰，仅提示一次
    const ask = confirm('开启每日提醒？（可随时关闭通知）');
    if (ask) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          localStorage.setItem(NOTIFY_KEY, 'yes');
          scheduleTodayReminder();
        } else {
          localStorage.setItem(NOTIFY_KEY, 'no');
        }
      });
    } else {
      localStorage.setItem(NOTIFY_KEY, 'no');
    }
  } else if (Notification.permission === 'granted' && enabled !== 'no') {
    localStorage.setItem(NOTIFY_KEY, 'yes');
    scheduleTodayReminder();
  }
}

function renderTodos() {
  const listEl = document.getElementById('todoList');
  const dateKey = getTodayKey();
  if (!listEl) return;

  const todos = loadTodos(dateKey);
  listEl.innerHTML = '';
  if (!todos.length) {
    const empty = document.createElement('li');
    const t = window.i18n ? window.i18n.t : (k) => k;
    empty.textContent = t('todo.empty') || '今天还没有待办，添加一条吧';
    empty.style.fontSize = '12px';
    empty.style.color = 'var(--color-text-tertiary)';
    listEl.appendChild(empty);
    return;
  }

  todos.forEach((todo, idx) => {
    const item = document.createElement('li');
    item.className = 'todo-item' + (todo.done ? ' done' : '');
    item.dataset.id = todo.id || '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = !!todo.done;
    checkbox.addEventListener('change', async () => {
      const current = loadTodos(dateKey);
      current[idx].done = checkbox.checked;
      saveTodos(dateKey, current);
      if (item.dataset.id && !item.dataset.id.startsWith('local-')) {
        await updateTodoCloud(item.dataset.id, { done: checkbox.checked });
      }
      renderTodos();
      if (checkbox.checked) recordMetric('todo_done');
      if (checkbox.checked) {
        sendMetric('todo_done', { date: dateKey, loggedIn: !!(window.api?.isAuthenticated && window.api.isAuthenticated()) });
      }
    });

    const text = document.createElement('div');
    text.className = 'todo-text';
    text.textContent = todo.text || '';

    const del = document.createElement('button');
    del.className = 'todo-delete';
    del.textContent = '✕';
    del.title = '删除';
    del.addEventListener('click', async () => {
      const current = loadTodos(dateKey);
      const removed = current.splice(idx, 1)[0];
      saveTodos(dateKey, current);
      if (removed?.id && !removed.id.startsWith('local-')) {
        await deleteTodoCloud(removed.id);
      }
      renderTodos();
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(del);
    listEl.appendChild(item);
  });
}

async function initTodoAndReflection() {
  const dateKey = getTodayKey();
  // 云端同步（若登录）
  const cloudTodos = await fetchTodosCloud(dateKey);
  if (cloudTodos) {
    const mapped = cloudTodos.map(t => ({
      id: t.id,
      text: t.text,
      done: !!t.done
    }));
    saveTodos(dateKey, mapped);
  }
  const cloudReflection = await fetchReflectionCloud(dateKey);
  if (cloudReflection) {
    saveReflectionData(dateKey, {
      id: cloudReflection.id,
      text: cloudReflection.text || '',
      score: cloudReflection.score || 'neutral',
      updatedAt: cloudReflection.updated_at || new Date().toLocaleString()
    });
  }

  const addBtn = document.getElementById('addTodoBtn');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const t = window.i18n ? window.i18n.t : (k) => k;
      const text = prompt(t('todo.addPrompt') || '输入今日待办（尽量简短）');
      if (text && text.trim()) {
        let todos = loadTodos(dateKey);
        const clean = text.trim();
        const created = await createTodoCloud(dateKey, clean);
        if (created && created.id) {
          todos.unshift({ id: created.id, text: created.text, done: !!created.done });
        } else {
          todos.unshift({ id: `local-${Date.now()}`, text: clean, done: false });
        }
        todos = todos.slice(0, 5); // 限制每天最多5条
        saveTodos(dateKey, todos);
        renderTodos();
        recordMetric('todo_add');
        sendMetric('todo_add', { date: dateKey, loggedIn: !!(window.api?.isAuthenticated && window.api.isAuthenticated()) });
      }
    });
  }

  const reflectionInput = document.getElementById('reflectionInput');
  const reflectionScore = document.getElementById('reflectionScore');
  const reflectionMeta = document.getElementById('reflectionMeta');
  const saveReflectionBtn = document.getElementById('saveReflectionBtn');

  if (saveReflectionBtn && reflectionInput && reflectionScore) {
    const existing = loadReflectionData(dateKey);
    if (existing) {
      reflectionInput.value = existing.text || '';
      reflectionScore.value = existing.score || 'neutral';
      if (reflectionMeta) {
        reflectionMeta.textContent = `已保存 · ${existing.updatedAt || ''}`;
      }
    }

    saveReflectionBtn.addEventListener('click', async () => {
      const text = reflectionInput.value.trim();
      const score = reflectionScore.value;
      const data = {
        text,
        score,
        updatedAt: new Date().toLocaleString(),
      };
      const saved = await saveReflectionCloud(dateKey, text, score);
      if (saved && saved.id) {
        data.id = saved.id;
      }
      saveReflectionData(dateKey, data);
      if (reflectionMeta) {
        reflectionMeta.textContent = `已保存 · ${data.updatedAt}`;
      }
      const t = window.i18n ? window.i18n.t : (k) => k;
      alert(t('reflection.saved') || '已保存今日反思');
      recordMetric('reflection_saved');
      sendMetric('reflection_saved', { date: dateKey, loggedIn: !!(window.api?.isAuthenticated && window.api.isAuthenticated()) });
    });
  }

  renderTodos();
}
// 更新首页日期显示
function updateHomeDate() {
  const solarDateEl = document.getElementById('solarDate');
  const lunarDateEl = document.getElementById('lunarDate');
  
  if (!solarDateEl || !lunarDateEl) return;
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  // 获取当前语言主题
  const locale = window.i18n?.getCurrentLocale() || 'zh';
  
  // 根据语言设置星期显示
  let weekday;
  if (locale === 'en') {
    const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekday = weekdaysEn[today.getDay()];
    // 更新公历日期（英文格式）
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    solarDateEl.textContent = `${monthNames[month - 1]} ${day}, ${year} ${weekday}`;
  } else if (locale === 'ja') {
    const weekdaysJa = ['日', '月', '火', '水', '木', '金', '土'];
    weekday = weekdaysJa[today.getDay()];
    solarDateEl.textContent = `${year}年${month}月${day}日 ${weekday}曜日`;
  } else {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    weekday = weekdays[today.getDay()];
    solarDateEl.textContent = `${year}年${month}月${day}日 ${weekday}`;
  }
  
  // 在中文和日文主题下显示农历，英文主题不显示
  if ((locale === 'zh' || locale === 'ja') && lunarDateEl) {
    const lunar = solarToLunar(year, month, day);
    lunarDateEl.textContent = `${lunar.year}${lunar.month}月${lunar.day}`;
    lunarDateEl.style.display = 'block';
  } else if (lunarDateEl) {
    // 英文主题：隐藏农历
    lunarDateEl.style.display = 'none';
  }
}

// 农历转换函数（简化版）
function solarToLunar(year, month, day) {
  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const dayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                   '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                   '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  
  // 天干地支
  const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 计算天干地支年份
  const yearIndex = (year - 4) % 60;
  const ganIndex = yearIndex % 10;
  const zhiIndex = yearIndex % 12;
  const yearGanZhi = gan[ganIndex] + zhi[zhiIndex];
  
  // 简化处理：使用公历月份和日期作为农历的近似值
  // 注意：这是简化版本，实际农历转换需要复杂的天文计算
  let lunarMonth = month;
  let lunarDay = day;
  
  // 确保月份和日期在有效范围内
  if (lunarMonth < 1) lunarMonth = 1;
  if (lunarMonth > 12) lunarMonth = 12;
  if (lunarDay < 1) lunarDay = 1;
  if (lunarDay > 30) lunarDay = 30;
  
  return {
    year: yearGanZhi + '年',
    month: monthNames[lunarMonth - 1] || monthNames[0],
    day: dayNames[lunarDay - 1] || dayNames[0]
  };
}

// 更新今日统计
async function updateTodayStats() {
  if (!window.store) return;
  
  try {
    const stats = await window.store.getTodayStats();
    const t = window.i18n?.t || (k => k);
    const toNum = window.i18n?.toLocalNumber || (n => n);
    
    const gongEl = document.getElementById('gongNum');
    const guoEl = document.getElementById('guoNum');
    
    if (gongEl) gongEl.textContent = toNum(stats.gong);
    if (guoEl) guoEl.textContent = toNum(stats.guo);
  } catch (error) {
    console.error('更新今日统计失败:', error);
  }
}

// 更新命运刻度条
async function updateFateIndex() {
  if (!window.store) return;
  
  try {
    const index = await window.store.calculateFateIndex();
    const level = window.store.getFateLevel(index);
    const t = window.i18n?.t || (k => k);
    
    const bar = document.querySelector('.fate-bar-fill');
    const levelText = document.querySelector('.fate-level-text');
    const scoreText = document.querySelector('.fate-score');
    
    if (bar) {
      bar.style.width = `${index}%`;
      bar.style.background = `var(--fate-level-${level})`;
    }
    
    if (levelText) {
      levelText.textContent = t(`fate.level.${level}`);
      levelText.style.color = `var(--fate-level-${level})`;
    }
    
    if (scoreText) {
      scoreText.textContent = `${index}%`;
    }
  } catch (error) {
    console.error('更新命运刻度条失败:', error);
  }
}

// 更新周统计图表
async function updateWeekChart() {
  if (!window.store) return;
  
  try {
    const stats = await window.store.getWeekStats();
    const maxValue = Math.max(...stats.map(s => Math.max(s.gong, s.guo)), 10);
    
    document.querySelectorAll('.day-bar').forEach((bar, index) => {
      if (stats[index]) {
        const gongBar = bar.querySelector('.bar.gong');
        const guoBar = bar.querySelector('.bar.guo');
        
        if (gongBar) {
          const height = (stats[index].gong / maxValue) * 50;
          gongBar.style.height = `${Math.max(height, 4)}px`;
        }
        
        if (guoBar) {
          const height = (stats[index].guo / maxValue) * 50;
          guoBar.style.height = `${Math.max(height, 4)}px`;
        }
      }
    });
  } catch (error) {
    console.error('更新周统计图表失败:', error);
  }
}

// 显示菜单弹层
function showMenuOverlay() {
  const overlay = document.getElementById('menuOverlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

// 隐藏菜单弹层
function hideMenuOverlay() {
  const overlay = document.getElementById('menuOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

/* ===== 记录页 ===== */
function initRecordPage() {
  const params = getUrlParams();
  const type = params.type || 'gong';
  const editId = params.edit;
  
  // 设置初始类型
  setRecordType(type);
  
  // 如果是编辑模式，加载数据
  if (editId && window.store) {
    const record = window.store.getRecord(editId);
    if (record) {
      loadRecordForEdit(record);
    }
  }
  
  // record.html 中有自己的事件绑定逻辑（包括 Tab 切换、分值卡片、保存按钮等）
  // 这些绑定都在 record.html 的内联脚本中处理，避免重复绑定
  // 这里只设置初始类型，其他交互由 record.html 控制
  
  // 备注输入框验证
  const noteInput = document.querySelector('.text-input');
  if (noteInput && window.validator) {
    window.validator.bindInputValidation(noteInput, 'note');
  }
}

// 设置记录类型
function setRecordType(type) {
  const t = window.i18n?.t || (k => k);
  
  // 更新 Tab
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active');
    if ((type === 'gong' && !tab.classList.contains('guo')) ||
        (type === 'guo' && tab.classList.contains('guo'))) {
      tab.classList.add('active');
    }
  });
  
  // 更新标题
  const title = document.querySelector('.nav-title');
  if (title) {
    title.textContent = type === 'gong' ? t('record.createGong') : t('record.createGuo');
  }
  
  // 更新分值卡片的文案
  const scores = [1, 10, 30, 100];
  scores.forEach(score => {
    const card = document.querySelector(`.amount-card[data-score="${score}"]`);
    if (card) {
      const valueEl = card.querySelector('.amount-value');
      const descEl = card.querySelector('.amount-example');
      
      if (valueEl) {
        const valueKey = type === 'gong' ? `record.score.${score}` : `record.score.${score}.guo`;
        valueEl.textContent = t(valueKey);
        // 更新 data-i18n 属性，以便后续 updatePageTexts 不会覆盖
        valueEl.setAttribute('data-i18n', valueKey);
      }
      
      if (descEl) {
        const descKey = type === 'gong' ? `record.score.${score}.desc` : `record.score.${score}.guo.desc`;
        descEl.textContent = t(descKey);
        // 更新 data-i18n 属性，以便后续 updatePageTexts 不会覆盖
        descEl.setAttribute('data-i18n', descKey);
      }
    }
  });
  
  // 存储当前类型
  document.body.dataset.recordType = type;
}

// 加载记录用于编辑
function loadRecordForEdit(record) {
  setRecordType(record.type);
  
  // 选中分值
  document.querySelectorAll('.amount-card').forEach(card => {
    const value = parseInt(card.dataset.score);
    card.classList.toggle('active', value === record.score);
  });
  
  // 填充备注
  const textarea = document.querySelector('.text-input');
  if (textarea) {
    textarea.value = record.note;
  }
}

// 保存记录
async function saveRecord() {
  const type = document.body.dataset.recordType || 'gong';
  const activeCard = document.querySelector('.amount-card.active');
  const score = activeCard ? parseInt(activeCard.dataset.score) || 1 : 1;
  const noteInput = document.querySelector('.text-input');
  const note = noteInput?.value || '';
  
  // 验证备注（如果输入了）
  if (note && window.validator && noteInput) {
    const noteResult = window.validator.validateField(note, 'note');
    if (!noteResult.valid) {
      // 显示错误提示（输入框下方）
      window.validator.showError(noteInput, noteResult.message);
      noteInput.focus();
      return;
    }
    // 验证通过，清除错误
    window.validator.clearError(noteInput);
  }
  
  // 验证分值（分值通过卡片选择，一般不会有问题，但做检查）
  if (window.validator) {
    const scoreResult = window.validator.validateField(score, 'score');
    if (!scoreResult.valid) {
      // 分值错误通常是因为没有选择，提示用户
      alert(scoreResult.message || '请选择分值');
      return;
    }
  }
  
  // 检查是否需要登录
  if (window.store?.shouldPromptLogin()) {
    window.modals?.showLoginRequiredModal({
      messageType: 'recordLimit',
      onSuccess: async () => {
        await doSaveRecord(type, score, note);
      }
    });
    return;
  }
  
  await doSaveRecord(type, score, note);
}

// 执行保存
async function doSaveRecord(type, score, note) {
  if (window.store) {
    try {
      await window.store.addRecord({ type, score, note });
      // 显示成功动画
      showSuccessAnimation(type);
    } catch (error) {
      console.error('保存记录失败:', error);
      alert('保存失败，请重试');
    }
  } else {
    showSuccessAnimation(type);
  }
}

// 显示成功动画
function showSuccessAnimation(type) {
  const animationType = window.theme?.getAnimationType() || 'stamp';
  const overlay = document.getElementById('successOverlay');
  
  if (overlay) {
    // 根据记录类型更新成功提示文字
    const sealStamp = document.getElementById('sealStamp');
    const successTextZh = document.getElementById('successTextZh');
    
    if (type === 'guo') {
      // 记录"过"时显示"过已存"
      if (sealStamp) {
        sealStamp.textContent = '过已存';
      }
      // 根据《了凡四训》关于改过的解释
      if (successTextZh) {
        successTextZh.textContent = '过由心造，亦由心改';
      }
    } else {
      // 记录"功"时显示"善已存"
      if (sealStamp) {
        sealStamp.textContent = '善已存';
      }
      if (successTextZh) {
        successTextZh.textContent = '功德无量';
      }
    }
    
    overlay.classList.add('show');
    
    // 动画结束后跳转
    setTimeout(() => {
      navigateTo('home');
    }, 2000);
  } else {
    // 没有动画层就直接跳转
    setTimeout(() => {
      navigateTo('home');
    }, 500);
  }
}

/* ===== 今日列表页 ===== */
async function initTodayListPage() {
  await renderTodayList();
}

// 渲染今日列表
async function renderTodayList() {
  if (!window.store) return;
  
  try {
    const records = await window.store.getTodayRecords();
    const stats = await window.store.getTodayStats();
  const t = window.i18n?.t || (k => k);
  const toNum = window.i18n?.toLocalNumber || (n => n);
  
  // 更新统计
  const gongVal = document.querySelector('.summary-value.gong');
  const guoVal = document.querySelector('.summary-value.guo');
  if (gongVal) gongVal.textContent = toNum(stats.gong);
  if (guoVal) guoVal.textContent = toNum(stats.guo);
  
  // 渲染列表
  const listArea = document.querySelector('.list-area');
  if (!listArea) return;
  
  if (records.length === 0) {
    listArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-text">${t('today.empty')}</div>
      </div>
    `;
    return;
  }
  
  let html = '';
  records.forEach(record => {
    html += `
      <div class="list-item" data-id="${record.id}">
        <div class="item-dot ${record.type}"></div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-time">${record.time}</span>
            <span class="tag tag-${record.type}">${toNum(record.score)}${record.type === 'gong' ? '功' : '过'}</span>
          </div>
          <div class="item-desc">${record.note || ''}</div>
        </div>
      </div>
    `;
  });
  
  html += `<div class="hint">${t('today.hint')}</div>`;
  listArea.innerHTML = html;
  
  // 绑定点击事件
  listArea.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      navigateTo('record', { edit: id });
    });
  });
  } catch (error) {
    console.error('渲染今日列表失败:', error);
  }
}

/* ===== 日历页 ===== */
async function initCalendarPage() {
  const now = new Date();
  await renderCalendar(now.getFullYear(), now.getMonth() + 1);
  
  // 绑定月份切换
  document.querySelectorAll('.month-arrow').forEach((arrow, index) => {
    arrow.addEventListener('click', async () => {
      // TODO: 实现月份切换
    });
  });
}

// 渲染日历
async function renderCalendar(year, month) {
  if (!window.store) return;
  
  try {
    const stats = await window.store.getMonthStats(year, month);
  const toNum = window.i18n?.toLocalNumber || (n => n);
  
  // 更新月度统计
  const gongStat = document.querySelector('.month-stat-value.gong');
  const guoStat = document.querySelector('.month-stat-value.guo');
  if (gongStat) gongStat.textContent = toNum(stats.gong);
  if (guoStat) guoStat.textContent = toNum(stats.guo);
  
  // 更新每日格子
  document.querySelectorAll('.day-cell').forEach(cell => {
    const day = cell.querySelector('.day-number')?.textContent;
    if (day && !cell.classList.contains('empty')) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayStats = stats.dailyStats[dateStr];
      
      if (dayStats) {
        const statsEl = cell.querySelector('.day-stats');
        if (statsEl) {
          statsEl.innerHTML = `
            <span class="day-gong">${dayStats.gong}</span>
            <span class="day-guo">${dayStats.guo}</span>
          `;
        }
      }
      
      // 绑定点击
      cell.addEventListener('click', () => {
        navigateTo('day_detail', { date: dateStr });
      });
    }
  });
  } catch (error) {
    console.error('渲染日历失败:', error);
  }
}

/* ===== 某日详情页 ===== */
async function initDayDetailPage() {
  const params = getUrlParams();
  const dateStr = params.date || window.store?.formatDate(new Date());
  
  await renderDayDetail(dateStr);
}

// 渲染某日详情
async function renderDayDetail(dateStr) {
  if (!window.store) return;
  
  try {
    const records = await window.store.getRecordsByDate(dateStr);
    const stats = await window.store.getDayStats(dateStr);
  const t = window.i18n?.t || (k => k);
  const toNum = window.i18n?.toLocalNumber || (n => n);
  
  // 更新标题日期
  const title = document.querySelector('.nav-title');
  if (title) {
    // 简单格式化日期
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    title.textContent = `${month}月${day}日`;
  }
  
  // 更新统计
  const gongVal = document.querySelector('.summary-value.gong');
  const guoVal = document.querySelector('.summary-value.guo');
  if (gongVal) gongVal.textContent = toNum(stats.gong);
  if (guoVal) guoVal.textContent = toNum(stats.guo);
  
  // 渲染列表 (复用今日列表的逻辑)
  const listArea = document.querySelector('.list-area');
  if (!listArea) return;
  
  if (records.length === 0) {
    listArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-text">${t('detail.empty')}</div>
      </div>
    `;
    return;
  }
  
  let html = '';
  records.forEach(record => {
    html += `
      <div class="list-item" data-id="${record.id}">
        <div class="item-dot ${record.type}"></div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-time">${record.time}</span>
            <span class="tag tag-${record.type}">${toNum(record.score)}${record.type === 'gong' ? '功' : '过'}</span>
          </div>
          <div class="item-desc">${record.note || ''}</div>
        </div>
      </div>
    `;
  });
  
  listArea.innerHTML = html;
  } catch (error) {
    console.error('渲染某日详情失败:', error);
  }
}

/* ===== 功德碑页 ===== */
async function initMonumentPage() {
  // 检查登录状态
  if (!window.store?.isLoggedIn()) {
    // 显示登录提示
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
      loginPrompt.style.display = 'flex';
      
      loginPrompt.querySelector('[data-action="login"]')?.addEventListener('click', async () => {
        window.modals?.showLoginModal({
          onSuccess: async () => {
            loginPrompt.style.display = 'none';
            await renderMonument();
          }
        });
      });
    }
    return;
  }
  
  await renderMonument();
}

// 渲染功德碑
async function renderMonument() {
  if (!window.store) return;
  
  try {
    const stats = await window.store.getTotalStats();
  const toNum = window.i18n?.toLocalNumber || (n => n);
  
  // 更新数值
  const gongVal = document.querySelector('.column-value.gong .value-main');
  const guoVal = document.querySelector('.column-value.guo .value-main');
  
  if (gongVal) gongVal.textContent = toNum(stats.gong);
  if (guoVal) guoVal.textContent = toNum(stats.guo);
  } catch (error) {
    console.error('渲染功德碑失败:', error);
  }
}

/* ===== 设置页 ===== */
function initSettingsPage() {
  const t = window.i18n?.t || (k => k);
  const locale = window.i18n?.getCurrentLocale() || 'zh';
  
  // 设置当前语言选中状态
  document.querySelectorAll('.language-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === locale);
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      if (window.theme?.switchLanguage(lang)) {
        document.querySelectorAll('.language-option').forEach(o => 
          o.classList.toggle('active', o.dataset.lang === lang)
        );
        // 刷新页面以应用新语言
        location.reload();
      }
    });
  });
  
  // 删除账号按钮
  const deleteBtn = document.querySelector('[data-action="deleteAccount"]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      window.modals?.showDeleteAccountModal({
        onConfirm: () => {
          window.store?.logout();
          localStorage.clear();
          navigateTo('home');
        }
      });
    });
  }
}

/* ===== 关于页 ===== */
function initAboutPage() {
  // 版本号等静态展示
}

// 自动缩放文字
function autoFitText(element, options = {}) {
  const {
    minFontSize = 12,
    maxFontSize = 32,
    step = 1,
    container = element.parentElement
  } = options;

  let fontSize = maxFontSize;
  element.style.fontSize = `${fontSize}px`;
  element.style.whiteSpace = 'nowrap';

  while (element.scrollWidth > container.clientWidth && fontSize > minFontSize) {
    fontSize -= step;
    element.style.fontSize = `${fontSize}px`;
  }

  if (element.scrollWidth > container.clientWidth) {
    element.style.whiteSpace = 'normal';
    element.style.wordBreak = 'keep-all';
  }

  return fontSize;
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// ❌ Service Worker 已完全禁用
// 原因：Android WebView + Web 混合架构中，Service Worker 会导致缓存和加载问题
// 方案：完全禁用，不注册、不拦截、不缓存 HTML/CSS/JS
// 
// 如果之前已经注册过 Service Worker，这里会清理它们
if ('serviceWorker' in navigator) {
  // 注销所有已存在的 Service Worker
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().then((success) => {
        if (success) {
          console.log('✓ 已注销 Service Worker:', registration.scope);
        }
    });
  });
  });
  
  // 清除所有缓存
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
      if (names.length > 0) {
        console.log('✓ 已清除所有缓存');
      }
    });
  }
}

// 导出
window.app = {
  initApp,
  navigateTo,
  goBack,
  getUrlParams,
  showMenuOverlay,
  hideMenuOverlay,
  autoFitText,
  debounce,
  setRecordType
};

