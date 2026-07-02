// ===== 应用入口 =====
(function init() {
  // 0. 确保云同步配置已初始化
  getCloudConfig();
  // 1. 从云端自动加载数据（含去重合并）
  autoLoadFromCloud().then(() => {
    // 2. 登录星星
    checkLoginStars();

    // 3. 渲染首页
    switchView('home');

    // 4. 检查待复习提醒
    setTimeout(() => {
      const data = loadData();
      const due = collectDue(data);
      if (due.length > 0) {
        showModal(`
          <h2>📅 复习提醒</h2>
          <p style="font-size:18px;margin:16px 0;">共有 <strong>${due.length}</strong> 项内容需要复习！</p>
          <p style="color:#888;margin-bottom:16px;">包括今日到期及之前过期的内容。</p>
          <div class="btn-group" style="justify-content:center">
            <button class="btn btn-primary" onclick="closeModal();startReviewFromDue('todayDue', 0)">✅ 开始复习</button>
            <button class="btn btn-outline" onclick="closeModal()">稍后</button>
          </div>
        `);
      }
    }, 300);
  });

  console.log('✅ 复习工具已加载（云端自动同步已启用）');
})();
