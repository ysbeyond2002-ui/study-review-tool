// ===== 视图渲染 =====
let currentView = 'home';
let reviewQueue = [];
let reviewIndex = 0;

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  render(view);
}

function render(view) {
  const content = document.getElementById('content');
  const views = {
    home: renderHome,
    math: () => renderSubject('math'),
    chinese: () => renderSubject('chinese'),
    english: renderEnglish,
    history: renderHistory,
    all_review: renderAllReview,
    settings: renderSettings,
  };
  content.innerHTML = '';
  if (views[view]) views[view]();
  else renderHome();
}

// ===== 首页 =====
function renderHome() {
  const data = loadData();
  const due = collectDue(data);
  const grouped = groupDueItems(due);
  const total = data.math.length + data.chinese.length + data.english.length + data.words.length;
  const mastered = countMastered(data);
  const s = data.stars || 0;

  setContent(`
    <div class="star-badge">⭐ ${s} 颗星星 ${starBadge(s)}</div>
    <div class="card">
      <div class="card-title">📊 学习统计</div>
      <div class="stats">
        <div class="stat-item"><div class="num">${total}</div><div class="label">总条目</div></div>
        <div class="stat-item"><div class="num">${mastered}</div><div class="label">已掌握</div></div>
        <div class="stat-item ${due.length > 0 ? 'overdue' : ''}"><div class="num">${due.length}</div><div class="label">待复习</div></div>
        <div class="stat-item"><div class="num">${today()}</div><div class="label">今日日期</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📅 今日到期</div>
      ${renderDueGroup('todayDue', grouped.todayDue)}
    </div>
    ${grouped.overdue.length > 0 ? `
    <div class="card">
      <div class="card-title" style="color:#e74c3c;">⚠️ 过期未复习（${grouped.overdue.length}项）</div>
      ${renderDueGroup('overdue', grouped.overdue)}
    </div>` : ''}
    <div class="toolbar center">
      <button class="btn btn-outline btn-sm" onclick="exportData()">📤 导出备份</button>
      <label class="btn btn-outline btn-sm" style="cursor:pointer">
        📥 导入
        <input type="file" accept=".json" style="display:none" onchange="importData(this.files[0]);this.value=''">
      </label>
      <button class="btn btn-outline btn-sm" onclick="switchView('settings')">☁️ 云端同步</button>
    </div>
  `);
}

function collectDue(data) {
  const items = [];
  for (const k of ['math','chinese','english','words']) {
    for (const item of data[k]) {
      if (!item.mastered && isDue(item.review_date)) {
        items.push({k, item});
      }
    }
  }
  return items;
}

function countMastered(data) {
  let c = 0;
  for (const k of ['math','chinese','english','words']) {
    for (const item of data[k]) {
      if (item.mastered) c++;
    }
  }
  return c;
}

function renderDueGroup(groupName, items) {
  if (items.length === 0) {
    return `<div class="empty-state" style="padding:20px;"><p>🎉 没有待复习项</p></div>`;
  }
  let html = '<div class="listbox">';
  for (let i = 0; i < items.length; i++) {
    const {k, item} = items[i];
    const display = itemDisplay(item, k);
    const interval = item.interval_index !== undefined ? 
      `间隔${REVIEW_DAYS[item.interval_index] || '?'}天` : '';
    html += `
      <div class="list-item" onclick="startReviewFromDue('${groupName}', ${i})">
        <span class="tag ${k}">${subjectName(k)}</span>
        <span class="status">📚</span>
        ${display.slice(0,40)}
        <span class="badge">${interval || `复习${item.review_count || 0}次`}</span>
      </div>`;
  }
  html += '</div>';
  html += `
    <div class="btn-group">
      <button class="btn btn-primary" onclick="startReviewFromDue('${groupName}', 0)">✅ 复习这组</button>
      <button class="btn btn-outline" onclick="switchView('all_review')">📋 全部未掌握</button>
    </div>`;
  return html;
}

// ===== 从首页开始复习 =====
function startReviewFromDue(group, idx) {
  if (!group) {
    // 降级：从全部待复习开始
    const data = loadData();
    const due = collectDue(data);
    if (due.length === 0) return;
    reviewQueue = due;
    reviewIndex = 0;
    renderReview();
    return;
  }
  const data = loadData();
  const allDue = collectDue(data);
  const grouped = groupDueItems(allDue);
  const items = grouped[group];
  if (!items || items.length === 0) return;
  reviewQueue = items;
  reviewIndex = Math.min(idx, items.length - 1);
  renderReview();
}

// ===== 科目页 =====
function renderSubject(sub) {
  const data = loadData();
  const items = data[sub];
  let listHtml = '<div class="listbox">';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const display = itemDisplay(item, sub);
    const created = item.created_time ? formatTime(item.created_time) : '';
    const overdue = !item.mastered && isDue(item.review_date);
    let cls = overdue ? 'list-item overdue' : 'list-item';
    if (item.mastered) cls += ' done';
    const badge = item.interval_index ? `间隔${REVIEW_DAYS[item.interval_index] || '?'}天` : '';
    listHtml += `
      <div class="${cls}" onclick="reviewItem('${sub}', ${i})">
        <span class="status">${item.mastered ? '✅' : '📚'}</span>
        ${display.slice(0,50)}
        <span class="badge">${created} ${badge ? '| '+badge : ''}</span>
        <button class="btn-del" onclick="event.stopPropagation();deleteItem('${sub}', ${i})" title="删除">🗑️</button>
      </div>`;
  }
  listHtml += '</div>';

  setContent(`
    <div class="card">
      <div class="card-title">📚 ${subjectName(sub)}（共${items.length}条）</div>
      <div class="btn-group">
        <button class="btn btn-primary" onclick="showAddQuestion('${sub}')">➕ 新增错题</button>
        <button class="btn btn-outline" onclick="switchView('history')">📋 历史记录</button>
      </div>
    </div>
    <div class="card">
      <div class="card-subtitle">双击条目开始复习</div>
      ${listHtml}
    </div>
  `);
  // 绑定双击
  document.querySelectorAll('.listbox .list-item').forEach((el, i) => {
    el.ondblclick = () => {
      const data = loadData();
      const items = data[sub];
      if (items[i]) {
        reviewQueue = [{k: sub, item: items[i]}];
        reviewIndex = 0;
        renderReview();
      }
    };
  });
}

// ===== 英语页 =====
function renderEnglish() {
  const data = loadData();
  const questions = data.english;
  const words = data.words;

  let qHtml = '<div class="listbox">';
  for (let i = 0; i < questions.length; i++) {
    const item = questions[i];
    const display = itemDisplay(item, 'english');
    const created = item.created_time ? formatTime(item.created_time) : '';
    qHtml += `<div class="list-item ${item.mastered ? 'done' : ''}">
      <span class="status">${item.mastered ? '✅' : '📚'}</span>
      ${display.slice(0,40)}<span class="badge">${created}</span>
      <button class="btn-del" onclick="event.stopPropagation();deleteItem('english', ${i})" title="删除">🗑️</button></div>`;
  }
  qHtml += '</div>';

  let wHtml = '<div class="listbox">';
  for (let i = 0; i < words.length; i++) {
    const item = words[i];
    const display = `${item.word || ''} - ${(item.mean || '').slice(0,25)}`;
    const created = item.created_time ? formatTime(item.created_time) : '';
    wHtml += `<div class="list-item ${item.mastered ? 'done' : ''}">
      <span class="status">${item.mastered ? '✅' : '📚'}</span>
      ${display}<span class="badge">${created}</span>
      <button class="btn-del" onclick="event.stopPropagation();deleteItem('words', ${i})" title="删除">🗑️</button></div>`;
  }
  wHtml += '</div>';

  setContent(`
    <div class="card">
      <div class="card-title">📙 英语</div>
      <div class="btn-group">
        <button class="btn btn-primary" onclick="showAddQuestion('english')">➕ 英语错题</button>
        <button class="btn btn-primary" onclick="showAddWord()">➕ 英语单词</button>
        <button class="btn btn-outline" onclick="switchView('history')">📋 历史记录</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">英语错题（${questions.length}条）</div>
      ${qHtml}
    </div>
    <div class="card">
      <div class="card-title">英语单词（${words.length}条）</div>
      ${wHtml}
    </div>
  `);
}

// ===== 复习页 =====
function renderReview() {
  if (!reviewQueue || reviewIndex >= reviewQueue.length) {
    // 完成整个周期
    addStars(1);
    reviewQueue = [];
    switchView('home');
    return;
  }
  const {k, item} = reviewQueue[reviewIndex];
  const display = itemDisplay(item, k);
  const created = item.created_time ? formatTime(item.created_time) : '';
  const nextReview = item.review_date || '未设置';
  const overdue = isDue(nextReview);

  let content = '';
  if (k === 'words') {
    content = `【单词】${item.word || ''}\n\n【音标】${item.phon || ''}\n【词性】${item.pos || ''}\n\n【释义】${item.mean || ''}\n\n【搭配】${item.coll || ''}\n【记忆提示】${item.tip || ''}`;
  } else {
    content = `【题干】${item.q || ''}\n\n【错答】${item.err || ''}\n\n【正答】${item.ans || ''}\n\n【解析】${item.exp || ''}`;
  }

  setContent(`
    <div class="card">
      <div class="card-title">📖 复习 <span class="tag ${k}">${subjectName(k)}</span></div>
      <div class="review-progress">进度：${reviewIndex + 1} / ${reviewQueue.length}</div>
      <div class="review-content">${escapeHtml(content)}</div>
      <div class="review-info">
        <span>📅 创建：${created}</span>
        <span>📊 间隔${item.interval_index !== undefined ? REVIEW_DAYS[item.interval_index]+'天' : item.review_count+'次'}</span>
        <span class="${overdue ? 'overdue' : 'upcoming'}">📌 下次复习：${nextReview}</span>
      </div>
      <div class="btn-group" style="justify-content:center;margin-top:16px;">
        <button class="btn btn-success" onclick="doMaster()" style="min-width:120px">✅ 已掌握</button>
        <button class="btn btn-warning" onclick="doNotMaster()" style="min-width:120px">🔄 未掌握</button>
        <button class="btn btn-danger" onclick="deleteReviewItem()" style="min-width:80px">🗑️ 删除</button>
        <button class="btn btn-outline" onclick="switchView('home')" style="min-width:80px">返回</button>
      </div>
    </div>
  `);
}

function doMaster() {
  const {k, item} = reviewQueue[reviewIndex];
  const data = loadData();
  const items = data[k];
  const idx = items.findIndex(i => i === item);
  if (idx >= 0) {
    items[idx].mastered = true;
    items[idx].last_review_date = today();
    saveData(data);
  }
  addStars(1);
  reviewIndex++;
  renderReview();
}

// 艾宾浩斯：未掌握 → 递增间隔周期
// 第1次：明天复习 | 第2次：2天后 | 第3次：4天后 | 第4次：7天后 | 第5次：15天后 | 第6次：30天后
function doNotMaster() {
  const {k, item} = reviewQueue[reviewIndex];
  const data = loadData();
  const items = data[k];
  const idx = items.findIndex(i => i === item);
  if (idx >= 0) {
    // 初始化 interval_index（从旧数据迁移时兼容 review_count）
    if (items[idx].interval_index === undefined) {
      items[idx].interval_index = items[idx].review_count || 0;
    }
    // 递增间隔（最多到最大间隔）
    if (items[idx].interval_index < REVIEW_DAYS.length - 1) {
      items[idx].interval_index += 1;
    }
    // 下次复习 = 今天 + 对应间隔天数
    items[idx].last_review_date = today();
    items[idx].review_date = getNextReviewDate(
      items[idx].last_review_date,
      items[idx].interval_index
    );
    saveData(data);
  }
  addStars(1);
  reviewIndex++;
  // 如果这是最后一项，加完成周期星星
  if (reviewIndex >= reviewQueue.length) {
    addStars(1);
  }
  renderReview();
}

// ===== 删除条目 =====
function deleteItem(k, idx) {
  const data = loadData();
  const item = data[k][idx];
  if (!item) return;
  const display = itemDisplay(item, k);
  showModal(`
    <h2>🗑️ 确认删除</h2>
    <p style="font-size:16px;margin:16px 0;">确定要删除以下条目吗？</p>
    <div style="background:#f8f8f8;padding:12px;border-radius:8px;font-size:15px;margin-bottom:16px;">
      <span class="tag ${k}">${subjectName(k)}</span>
      ${escapeHtml(display.slice(0,60))}
    </div>
    <p style="color:#e74c3c;font-size:14px;margin-bottom:16px;">此操作不可撤销。</p>
    <div class="btn-group" style="justify-content:center">
      <button class="btn btn-danger" onclick="confirmDelete('${k}', ${idx})">🗑️ 确认删除</button>
      <button class="btn btn-outline" onclick="closeModal()">取消</button>
    </div>
  `);
}

function confirmDelete(k, idx) {
  closeModal();
  const data = loadData();
  data[k].splice(idx, 1);
  saveData(data);
  switchView(currentView);
}

function deleteReviewItem() {
  const {k, item} = reviewQueue[reviewIndex];
  const data = loadData();
  const items = data[k];
  const idx = items.findIndex(i => i.created_time === item.created_time);
  if (idx < 0) return;
  const display = itemDisplay(item, k);
  showModal(`
    <h2>🗑️ 删除当前条目</h2>
    <p style="font-size:16px;margin:16px 0;">确定要删除吗？</p>
    <div style="background:#f8f8f8;padding:12px;border-radius:8px;font-size:15px;margin-bottom:16px;">
      <span class="tag ${k}">${subjectName(k)}</span>
      ${escapeHtml(display.slice(0,60))}
    </div>
    <p style="color:#e74c3c;font-size:14px;margin-bottom:16px;">此操作不可撤销。</p>
    <div class="btn-group" style="justify-content:center">
      <button class="btn btn-danger" onclick="confirmDeleteReviewItem()">🗑️ 确认删除</button>
      <button class="btn btn-outline" onclick="closeModal()">取消</button>
    </div>
  `);
}

function confirmDeleteReviewItem() {
  closeModal();
  const {k, item} = reviewQueue[reviewIndex];
  const data = loadData();
  const items = data[k];
  const idx = items.findIndex(i => i.created_time === item.created_time);
  if (idx >= 0) {
    data[k].splice(idx, 1);
    saveData(data);
  }
  reviewIndex++;
  renderReview();
}

function reviewItem(k, idx) {
  const data = loadData();
  const items = data[k];
  if (!items[idx]) return;
  reviewQueue = [{k, item: items[idx]}];
  reviewIndex = 0;
  renderReview();
}

// ===== 历史记录 =====
function renderHistory() {
  const data = loadData();
  let allItems = [];
  for (const k of ['math','chinese','english','words']) {
    for (const item of data[k]) {
      allItems.push({k, item});
    }
  }
  // 按创建时间倒序
  allItems.sort((a,b) => (b.item.created_time || 0) - (a.item.created_time || 0));

  let html = '<div class="listbox">';
  for (let i = 0; i < allItems.length; i++) {
    const {k, item} = allItems[i];
    const display = itemDisplay(item, k);
    const created = item.created_time ? formatTime(item.created_time) : '';
    const rd = item.review_date || 'N/A';
    const overdue = !item.mastered && isDue(rd);
    const cls = overdue ? 'list-item overdue' : 'list-item';
    const tag = overdue ? ' ⚠️过期' : '';
    const cnt = item.interval_index !== undefined ? `间隔${REVIEW_DAYS[item.interval_index]}天` : `${item.review_count||0}次`;

    html += `
      <div class="${cls}" onclick="reviewItem('${k}', ${data[k].indexOf(item)})">
        <span class="tag ${k}">${subjectName(k)}</span>
        <span class="status">${item.mastered ? '✅' : '📚'}</span>
        ${display.slice(0,50)}
        <span class="badge">${created} | ${cnt} | 下次${rd}${tag}</span>
        <button class="btn-del" onclick="event.stopPropagation();deleteItem('${k}', ${data[k].indexOf(item)})" title="删除">🗑️</button>
      </div>`;
  }
  html += '</div>';

  const total = allItems.length;
  const mastered = allItems.filter(x => x.item.mastered).length;

  setContent(`
    <div class="card">
      <div class="card-title">📚 历史记录（共${total}条，已掌握${mastered}条）</div>
      <div class="card-subtitle">双击条目开始复习</div>
      ${html}
    </div>
  `);
}

// ===== 全部复习 =====
function renderAllReview() {
  const data = loadData();
  const all = [];
  for (const k of ['math','chinese','english','words']) {
    for (const item of data[k]) {
      if (!item.mastered) all.push({k, item});
    }
  }
  all.sort((a,b) => (a.item.review_date || '').localeCompare(b.item.review_date || ''));

  let html = '<div class="listbox">';
  for (let i = 0; i < all.length; i++) {
    const {k, item} = all[i];
    const display = itemDisplay(item, k);
    const rd = item.review_date || 'N/A';
    const overdue = isDue(rd);
    const cls = overdue ? 'list-item overdue' : 'list-item';
    const tag = overdue ? '⚠️ 已过期' : '';
    const cnt = item.interval_index !== undefined ? `间隔${REVIEW_DAYS[item.interval_index]}天` : `${item.review_count||0}次`;

    html += `
      <div class="${cls}" onclick="reviewAllItem(${i})">
        <span class="tag ${k}">${subjectName(k)}</span>
        ${display.slice(0,45)}
        <span class="badge">${tag} | ${cnt} | 下次${rd}</span>
      </div>`;
  }
  html += '</div>';

  setContent(`
    <div class="card">
      <div class="card-title">🔄 全部未掌握内容（${all.length}项）</div>
      <div class="card-subtitle">双击条目开始复习，或点击下方按钮批量复习</div>
      ${html}
    </div>
    <div class="center btn-group" style="justify-content:center">
      <button class="btn btn-primary" onclick="startAllReview()">✅ 开始批量复习</button>
      <button class="btn btn-outline" onclick="switchView('home')">返回首页</button>
    </div>
  `);

  window._allReviewItems = all;
}

function reviewAllItem(idx) {
  if (!window._allReviewItems || !window._allReviewItems[idx]) return;
  reviewQueue = window._allReviewItems;
  reviewIndex = idx;
  renderReview();
}

function startAllReview() {
  if (!window._allReviewItems || window._allReviewItems.length === 0) return;
  reviewQueue = window._allReviewItems;
  reviewIndex = 0;
  renderReview();
}

// ===== 弹窗：新增错题 =====
function showAddQuestion(sub) {
  const isEnglish = sub === 'english';
  const labels = isEnglish ?
    ['题干/内容 *', '解析/知识点'] :
    ['题干/内容 *', '错误答案', '正确答案', '解析/知识点'];

  let fieldsHtml = labels.map((l, i) => `
    <div class="form-group">
      <label>${l}</label>
      <textarea id="qf${i}" rows="${isEnglish && i === 0 ? 3 : i === labels.length-1 ? 3 : 2}"></textarea>
    </div>
  `).join('');

  showModal(`
    <h2>➕ 新增${subjectName(sub)}错题</h2>
    ${fieldsHtml}
    <div class="btn-group" style="justify-content:center">
      <button class="btn btn-primary" onclick="saveQuestion('${sub}')">保存</button>
      <button class="btn btn-outline" onclick="closeModal()">取消</button>
    </div>
  `);
}

function saveQuestion(sub) {
  const labels = sub === 'english' ?
    ['q', 'exp'] :
    ['q', 'err', 'ans', 'exp'];
  const data = {mastered: false, interval_index: 0};
  let empty = false;

  for (let i = 0; i < labels.length; i++) {
    const el = document.getElementById(`qf${i}`);
    const val = el ? el.value.trim() : '';
    if (i === 0 && !val) empty = true;
    data[labels[i]] = val;
  }

  if (empty) { alert('题干/内容必填'); return; }

  const ts = now();
  data.created_time = ts;
  data.review_date = today();

  const d = loadData();
  d[sub].push(data);
  if (!saveData(d)) return;
  addStars(3);
  closeModal();
  switchView(sub === 'english' ? 'english' : sub);
}

// ===== 弹窗：新增单词 =====
function showAddWord() {
  showModal(`
    <h2>➕ 新增单词</h2>
    <div class="form-group"><label>单词 *</label><input id="wf0"></div>
    <div class="form-group"><label>音标</label><input id="wf1"></div>
    <div class="form-group"><label>词性</label><input id="wf2"></div>
    <div class="form-group"><label>释义 *</label><input id="wf3"></div>
    <div class="form-group"><label>搭配</label><input id="wf4"></div>
    <div class="form-group"><label>记忆提示</label><input id="wf5"></div>
    <div class="btn-group" style="justify-content:center">
      <button class="btn btn-primary" onclick="saveWord()">保存</button>
      <button class="btn btn-outline" onclick="closeModal()">取消</button>
    </div>
  `);
}

function saveWord() {
  const word = document.getElementById('wf0').value.trim();
  const mean = document.getElementById('wf3').value.trim();
  if (!word) { alert('单词必填'); return; }
  if (!mean) { alert('释义必填'); return; }

  const ts = now();
  const d = loadData();
  d.words.push({
    word,
    phon: document.getElementById('wf1').value.trim(),
    pos: document.getElementById('wf2').value.trim(),
    mean,
    coll: document.getElementById('wf4').value.trim(),
    tip: document.getElementById('wf5').value.trim(),
    created_time: ts,
    review_date: today(),
    mastered: false,
    interval_index: 0,
    review_count: 0
  });
  if (!saveData(d)) return;
  addStars(3);
  closeModal();
  switchView('english');
}

// ===== 设置页（云端同步 - GitHub Gist） =====
function renderSettings() {
  const config = getCloudConfig();
  const hasGist = !!config.gistId;

  setContent(`
    <div class="card">
      <div class="card-title">⚙️ 设置 — 云端同步</div>
      <div class="card-subtitle">通过 Gitee 代码片段实现多设备数据同步</div>

      <div class="form-group">
        <label>Gitee 私人令牌 <span style="color:#e74c3c;font-size:12px;">（必填）</span></label>
        <input id="gh-token" type="password" value="${escapeHtml(config.token)}" placeholder="粘贴私人令牌">
        <p style="font-size:12px;color:#888;margin-top:4px;">
          去 <a href="https://gitee.com/profile/personal_access_tokens"
             target="_blank" style="color:#667eea">Gitee 令牌生成页</a>
          创建令牌（勾选 gists 权限）
        </p>
      </div>

      <div class="form-group">
        <label>Gist ID <span style="color:#888;font-size:12px;">（空则自动创建）</span></label>
        <input id="gh-gist-id" value="${escapeHtml(config.gistId)}" placeholder="留空自动创建，或粘贴已有的 Gist ID">
        <p style="font-size:12px;color:#888;margin-top:4px;">
          💡 输入同一个 Gist ID 的多台设备共享同一份数据
        </p>
      </div>

      <div class="btn-group" style="justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="saveSettings()">💾 保存设置</button>
        <button class="btn btn-success" onclick="doSyncToCloud()">☁️ ⬆ 上传到云端</button>
        <button class="btn btn-success" onclick="doSyncFromCloud()">☁️ ⬇ 从云端加载</button>
        <button class="btn btn-warning" onclick="doSyncMerge()">🔄 合并云端+本地</button>
      </div>

      ${hasGist ? `
      <div style="margin-top:14px;padding:12px;background:#e8f5e9;border-radius:10px;font-size:14px;word-break:break-all;">
        ✅ 已配置云端同步<br>
        <span style="color:#888;font-size:12px;">Gist ID: ${escapeHtml(config.gistId)}</span><br>
        <span style="color:#888;font-size:12px;">将此 Gist ID 分享给其他人，即可共享数据（需各自的令牌）</span>
      </div>` : `
      <div style="margin-top:14px;padding:12px;background:#e3f2fd;border-radius:10px;font-size:14px;">
        ℹ️ 填入 Gitee 令牌，空着 Gist ID 点「上传到云端」就会自动创建
      </div>`}

      <div id="sync-status" style="margin-top:10px;font-size:14px;"></div>
    </div>
  `);
}

function saveSettings() {
  const token = document.getElementById('gh-token').value.trim();
  const gistId = document.getElementById('gh-gist-id').value.trim();
  saveCloudConfig({ token, gistId });
  alert('✅ 设置已保存');
  renderSettings();
}

async function doSyncToCloud() {
  const btn = event.target;
  btn.disabled = true; btn.textContent = '⏳ 上传中...';
  try {
    const msg = await syncToCloud();
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#27ae60">${msg}</span>`;
    renderSettings();
  } catch(e) {
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#e74c3c">❌ ${e.message}</span>`;
  }
  btn.disabled = false; btn.textContent = '☁️ ⬆ 上传到云端';
}

async function doSyncFromCloud() {
  const btn = event.target;
  btn.disabled = true; btn.textContent = '⏳ 加载中...';
  try {
    const msg = await syncFromCloud();
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#27ae60">${msg}</span>`;
    setTimeout(() => switchView('home'), 1000);
  } catch(e) {
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#e74c3c">❌ ${e.message}</span>`;
  }
  btn.disabled = false; btn.textContent = '☁️ ⬇ 从云端加载';
}

async function doSyncMerge() {
  const btn = event.target;
  btn.disabled = true; btn.textContent = '⏳ 合并中...';
  try {
    const msg = await syncMergeFromCloud();
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#27ae60">${msg}</span>`;
    setTimeout(() => switchView('home'), 1000);
  } catch(e) {
    document.getElementById('sync-status').innerHTML =
      `<span style="color:#e74c3c">❌ ${e.message}</span>`;
  }
  btn.disabled = false; btn.textContent = '🔄 合并云端+本地';
}

// ===== 工具 =====
function setContent(html) {
  document.getElementById('content').innerHTML = html;
}

function showModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
