// 首页入口文件
// 导入 CSS 文件（这是主要目的）
import './styles.js'

// 页面特定的初始化逻辑
// 注意：其他 JS 文件仍然通过 HTML 中的 <script> 标签加载

// 额外的首页特定逻辑
document.addEventListener('DOMContentLoaded', function () {
  // 菜单开关
  document
    .getElementById('avatarBtn')
    .addEventListener('click', function () {
      document.getElementById('menuOverlay').classList.add('show')
    })

  document
    .getElementById('closeMenuBtn')
    .addEventListener('click', function () {
      document.getElementById('menuOverlay').classList.remove('show')
    })

  document
    .getElementById('menuOverlay')
    .addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('show')
      }
    })

  // 菜单项跳转
  document
    .querySelectorAll('.menu-item[data-href]')
    .forEach(function (item) {
      item.addEventListener('click', function () {
        window.location.href = item.dataset.href
      })
    })

  // 快捷按钮
  document
    .getElementById('recordGongBtn')
    .addEventListener('click', function () {
      window.location.href = 'record.html?type=gong'
    })

  document
    .getElementById('recordGuoBtn')
    .addEventListener('click', function () {
      window.location.href = 'record.html?type=guo'
    })

  // 今日卡片
  const todayCard = document.getElementById('todayCard')
  if (todayCard) {
    todayCard.style.cursor = 'default'
  }

  // 查看更多
  document
    .getElementById('viewMoreBtn')
    .addEventListener('click', function () {
      window.location.href = 'calendar.html'
    })

  // 命运刻度条说明
  var fateHelpIcon = document.getElementById('fateHelpIcon')
  if (fateHelpIcon) {
    fateHelpIcon.addEventListener('click', function (e) {
      e.stopPropagation()
      var t = window.i18n
        ? window.i18n.t
        : function (k) {
            return k
          }
      var locale = window.i18n ? window.i18n.getCurrentLocale() : 'zh'

      var messages = {
        zh: '命运刻度是根据你的功过记录计算出的综合指数，反映了你当前的修行状态。数值越高，表示善行积累越多。',
        ja: '運命の目盛りは、あなたの功過記録に基づいて計算された総合指数で、現在の修行状態を反映しています。数値が高いほど、善行の蓄積が多いことを示します。',
        en: 'Fate Index is a comprehensive score calculated from your merit-demerit records, reflecting your current cultivation state. Higher values indicate more accumulated good deeds.',
      }

      alert(messages[locale] || messages['zh'])
    })
    fateHelpIcon.addEventListener('mouseenter', function () {
      this.style.opacity = '0.7'
    })
    fateHelpIcon.addEventListener('mouseleave', function () {
      this.style.opacity = '0.4'
    })
  }

  // 本周趋势图表点击跳转
  var weekChart = document.getElementById('weekChart')
  if (weekChart) {
    weekChart
      .querySelectorAll('.day-bar')
      .forEach(function (dayBar, index) {
        dayBar.style.cursor = 'pointer'
        dayBar.addEventListener('click', function () {
          // 计算日期（本周的日期）
          var today = new Date()
          var dayOfWeek = today.getDay() // 0=周日, 1=周一...
          var daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 转换为周一为0
          var targetDate = new Date(today)
          targetDate.setDate(today.getDate() - daysFromMonday + index)

          // 格式化日期
          var year = targetDate.getFullYear()
          var month = String(targetDate.getMonth() + 1).padStart(2, '0')
          var day = String(targetDate.getDate()).padStart(2, '0')
          var dateStr = year + '-' + month + '-' + day

          window.location.href = 'day_detail.html?date=' + dateStr
        })
      })
  }

  // 功过卡片点击动画
  document
    .getElementById('gongStat')
    .addEventListener('click', function (e) {
      e.stopPropagation()
      var num = this.querySelector('.stat-number')
      num.classList.add('pulse')
      setTimeout(function () {
        num.classList.remove('pulse')
      }, 400)
      window.location.href = 'record.html?type=gong'
    })

  document
    .getElementById('guoStat')
    .addEventListener('click', function (e) {
      e.stopPropagation()
      var num = this.querySelector('.stat-number')
      num.classList.add('pulse')
      setTimeout(function () {
        num.classList.remove('pulse')
      }, 400)
      window.location.href = 'record.html?type=guo'
    })
})
