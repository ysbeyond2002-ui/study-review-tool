// ===== 数据层：localStorage 存储 =====
const STORAGE_KEY = 'study_review_data';
const REVIEW_DAYS = [0, 1, 2, 4, 7, 15, 30];

function getDefaultData() {
  return {
    math: [], chinese: [], english: [], words: [],
    stars: 0, last_login: ''
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data = JSON.parse(raw);
    for (const k of ['math','chinese','english','words']) {
      if (!Array.isArray(data[k])) data[k] = [];
    }
    if (typeof data.stars !== 'number') data.stars = 0;
    if (typeof data.last_login !== 'string') data.last_login = '';
    return data;
  } catch(e) {
    console.warn('数据加载失败，重置', e);
    return getDefaultData();
  }
}

function saveData(data, skipCloudSync) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // 本地存完后，自动同步到云端（静默、不阻塞）
    if (!skipCloudSync) {
      autoSyncToCloud(data);
    }
    return true;
  } catch(e) {
    alert('保存失败！浏览器存储空间可能已满。\n请导出数据备份。');
    return false;
  }
}

// 自动静默同步到云端（不阻塞、不弹窗）
let _autoSyncPending = false;
function autoSyncToCloud(data) {
  if (_autoSyncPending) return;
  const config = getCloudConfig();
  if (!config.gistId || !config.token) return;
  _autoSyncPending = true;
  const url = `${GIST_API}/${config.gistId}?access_token=${encodeURIComponent(config.token)}`;
  fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
    })
  }).then(r => {
    if (!r.ok) console.warn('云端自动同步 HTTP', r.status);
  }).catch(e => {
    console.warn('云端自动同步失败（本地数据已保存，下次打开会自动同步）');
  }).finally(() => {
    _autoSyncPending = false;
  });
}

// 启动时从云端自动加载
async function autoLoadFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) return;
  try {
    let url = `${GIST_API}/${config.gistId}`;
    if (config.token) url += `?access_token=${encodeURIComponent(config.token)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const result = await resp.json();
    const content = result.files?.[GIST_FILENAME]?.content;
    if (!content) throw new Error('Gist 中未找到数据');
    const cloudData = JSON.parse(content);
    if (cloudData && typeof cloudData === 'object') {
      const localData = loadData();
      cloudData.stars = Math.max(cloudData.stars || 0, localData.stars || 0);
      if ((cloudData.last_login || '') < (localData.last_login || ''))
        cloudData.last_login = localData.last_login;
      for (const k of ['math','chinese','english','words']) {
        const localMap = new Map();
        for (const item of localData[k] || []) localMap.set(item.created_time, item);
        for (const item of cloudData[k] || []) {
          if (!localMap.has(item.created_time)) localMap.set(item.created_time, item);
        }
        cloudData[k] = Array.from(localMap.values());
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
      console.log('☁️ 已从云端自动加载数据');
    }
  } catch(e) {
    console.warn('云端自动加载失败，使用本地数据', e);
  }
}

// 工具函数
function now() { return Date.now(); }
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDateShort(ds) {
  if (!ds) return '';
  return ds; // already YYYY-MM-DD
}

function isDue(reviewDate) {
  if (!reviewDate) return true;
  return reviewDate <= today();
}

// 艾宾浩斯遗忘曲线：下次复习日 = 上次复习日 + REVIEW_DAYS[intervalIndex]
// intervalIndex 递增：0→1→2→4→7→15→30 天
function getNextReviewDate(baseDate, intervalIndex) {
  const d = new Date(baseDate || now());
  const days = intervalIndex < REVIEW_DAYS.length ? REVIEW_DAYS[intervalIndex] : 30;
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// 按日期分组：今日到期 vs 过往过期
function groupDueItems(items) {
  const t = today();
  return {
    todayDue: items.filter(x => x.item.review_date === t),
    overdue: items.filter(x => x.item.review_date < t)
  };
}

// 星星徽章
function starBadge(count) {
  if (count >= 100) return '⭐⭐⭐';
  if (count >= 50) return '⭐⭐';
  if (count >= 10) return '⭐';
  return '☆';
}

// 科目名称
function subjectName(k) {
  return {math:'数学', chinese:'语文', english:'英语', words:'单词'}[k] || k;
}

function subjectTag(k) {
  return {math:'数学', chinese:'语文', english:'英语题', words:'单词'}[k] || k;
}

function itemDisplay(item, k) {
  return k === 'words' ? (item.word || '') : (item.q || '');
}

// ===== 星星系统 =====
function addStars(n) {
  const data = loadData();
  data.stars = (data.stars || 0) + n;
  saveData(data);
  return data.stars;
}

function checkLoginStars() {
  const t = today();
  const data = loadData();
  if (data.last_login !== t) {
    data.stars = (data.stars || 0) + 1;
    data.last_login = t;
    saveData(data);
  }
}

// ===== 导出/导入 =====
function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `复习数据备份_${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.math || !data.chinese || !data.english || !data.words) {
        alert('文件格式不正确，请选择正确的备份文件。');
        return;
      }
      saveData(data);
      alert(`✅ 导入成功！\n共 ${data.math.length + data.chinese.length + data.english.length + data.words.length} 条数据`);
      switchView(currentView);
    } catch(e) {
      alert('❌ 文件解析失败，请确认是有效的备份文件。');
    }
  };
  reader.readAsText(file);
}

// ===== Gitee Gist 云端同步（国内可用、支持 CORS） =====
const GIST_API = 'https://gitee.com/api/v5/gists';
const GIST_FILENAME = 'study_review_data.json';

function getCloudConfig() {
  try {
    const raw = localStorage.getItem('cloud_config');
    return raw ? JSON.parse(raw) : { token: '', gistId: '' };
  } catch { return { token: '', gistId: '' }; }
}

function saveCloudConfig(config) {
  localStorage.setItem('cloud_config', JSON.stringify(config));
}

// Gitee 的 token 通过 query param 或者 Bearer header 都行
function gistOpts(method, body) {
  const cfg = getCloudConfig();
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  return opts;
}

function gistUrl(path) {
  const cfg = getCloudConfig();
  let url = path;
  if (cfg.token) url += (url.includes('?') ? '&' : '?') + `access_token=${encodeURIComponent(cfg.token)}`;
  return url;
}

async function gistCreate(data) {
  const cfg = getCloudConfig();
  if (!cfg.token) throw new Error('❌ 需要 Gitee 私人令牌');

  const resp = await fetch(gistUrl(GIST_API), gistOpts('POST', {
    description: 'study_review_data (auto-sync)',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
  }));
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `创建失败 (${resp.status})`);
  }
  const result = await resp.json();
  return result.id;
}

async function gistRead(gistId) {
  const resp = await fetch(gistUrl(`${GIST_API}/${gistId}`));
  if (!resp.ok) throw new Error(`读取失败 (${resp.status})`);
  const result = await resp.json();
  const content = result.files?.[GIST_FILENAME]?.content;
  if (!content) throw new Error('Gist 中未找到数据文件');
  return JSON.parse(content);
}

async function gistUpdate(gistId, data) {
  const cfg = getCloudConfig();
  if (!cfg.token) throw new Error('❌ 需要 Gitee 私人令牌');

  const resp = await fetch(gistUrl(`${GIST_API}/${gistId}`), gistOpts('PATCH', {
    files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
  }));
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `更新失败 (${resp.status})`);
  }
  return true;
}

async function syncToCloud() {
  const config = getCloudConfig();
  const data = loadData();
  if (config.gistId) {
    await gistUpdate(config.gistId, data);
    return '✅ 已同步到云端';
  } else {
    const gistId = await gistCreate(data);
    config.gistId = gistId;
    saveCloudConfig(config);
    return `✅ 已创建云端仓库！Gist ID: ${gistId}`;
  }
}

async function syncFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) throw new Error('请先创建或输入 Gist ID');
  const cloudData = await gistRead(config.gistId);
  saveData(cloudData, true);
  return '✅ 已从云端加载数据';
}

async function syncMergeFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) throw new Error('请先设置 Gist ID');
  const cloudData = await gistRead(config.gistId);
  const localData = loadData();
  for (const k of ['math','chinese','english','words']) {
    const localMap = new Map();
    for (const item of localData[k]) localMap.set(item.created_time, item);
    for (const item of cloudData[k] || []) localMap.set(item.created_time, item);
    localData[k] = Array.from(localMap.values());
  }
  localData.stars = Math.max(localData.stars || 0, cloudData.stars || 0);
  if ((cloudData.last_login || '') > (localData.last_login || ''))
    localData.last_login = cloudData.last_login;
  saveData(localData, true);
  return '✅ 已合并云端数据（本地+云端）';
}
