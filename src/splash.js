// 启动页入口文件
import './styles.js'
import '../js/config.js'
import '../js/i18n.js'
import '../js/theme.js'
import '../js/store.js'
import '../js/app.js'

document.addEventListener('DOMContentLoaded', function () {
  // 启动页动画总时长约3.5秒，在动画完成后跳转
  setTimeout(function () {
    var splashContent = document.getElementById('splashContent')
    if (splashContent) {
      splashContent.classList.add('fade-out')
    }

    // 淡出动画1.5秒后跳转
    setTimeout(function () {
      window.location.href = 'home.html'
    }, 1500)
  }, 3500)
})

