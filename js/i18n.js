/**
 * 功过格 App - 国际化模块
 * i18n Module for GongGuoGe App
 */

const messages = {
  zh: {
    // 首页
    "home.title": "首页",
    "home.fateIndex": "命运刻度",
    "home.fateIndex.level": "当前等级",
    "home.fateIndex.trend": "近30日趋势",
    "home.todayGong": "今日所积功",
    "home.todayGuo": "今日所犯过",
    "home.todayCard": "今日功过",
    "home.aiSuggestion": "AI 今日一语",
    "home.viewTodayList": "查看今日记录",
    "home.viewCalendar": "历史日历",
    "home.viewMonument": "功德碑",
    "home.recordGong": "记一功",
    "home.recordGuo": "记一过",
    "home.menu": "菜单",
    "home.weekTrend": "本周趋势",
    "home.viewMore": "查看更多",
    "home.dailyQuote":
      "一念之善，吉神随之；一念之恶，厉鬼随之。知此可以役使鬼神。",
    "home.quoteSource": "——《了凡四训》",
    "todo.title": "今日待办",
    "todo.add": "＋ 添加",
    "todo.addPrompt": "输入今日待办（尽量简短）",
    "todo.empty": "今天还没有待办，添加一条吧",
    "reflection.title": "每日反思",
    "reflection.placeholder": "写下今日一句反思或感恩...",
    "reflection.save": "保存",
    "reflection.score.gong": "今日更偏功",
    "reflection.score.neutral": "中性",
    "reflection.score.guo": "今日需改过",
    "reflection.saved": "已保存今日反思",
      "todo.title": "今日待办",
      "todo.add": "＋ 添加",
      "todo.empty": "今天还没有待办，添加一条吧",
      "reflection.title": "每日反思",
      "reflection.placeholder": "写下今日一句反思或感恩...",
      "reflection.save": "保存",
      "reflection.score.gong": "今日更偏功",
      "reflection.score.neutral": "中性",
      "reflection.score.guo": "今日需改过",
      "reflection.saved": "已保存今日反思",

    // 命运刻度条档位
    "fate.level.1": "暗淡",
    "fate.level.2": "微光",
    "fate.level.3": "明光",
    "fate.level.4": "昼明",
    "fate.level.5": "辉耀",

    // 记录页
    "record.title": "记录",
    "record.createGong": "记一功",
    "record.createGuo": "记一过",
    "record.editTitle": "编辑记录",
    "record.category": "类别",
    "record.category.gong": "功",
    "record.category.guo": "过",
    "record.tabGong": "记功",
    "record.tabGuo": "记过",
    "record.selectScore": "选择分量",
    "record.score.1": "一功",
    "record.score.1.desc": "拾金不昧\n善语待人",
    "record.score.10": "十功",
    "record.score.10.desc": "施财救急\n谏止恶行",
    "record.score.30": "三十功",
    "record.score.30.desc": "救人危难\n成人之美",
    "record.score.100": "百功",
    "record.score.100.desc": "救人一命\n活命无数",
    "record.score.1.guo": "一过",
    "record.score.1.guo.desc": "轻慢之失\n言行不谨",
    "record.score.10.guo": "十过",
    "record.score.10.guo.desc": "害人利己\n损人益己",
    "record.score.30.guo": "三十过",
    "record.score.30.guo.desc": "激怒他人\n败坏善念",
    "record.score.100.guo": "百过",
    "record.score.100.guo.desc": "误人前途\n兴祸作恶",
    "record.notePlaceholder": "可简述事由与当时念头...",
    "record.noteLabel": "事由简述（选填）",
    "record.photo": "📷 图片",
    "record.voice": "🎤 录音",
    "record.voiceHint": "长按录音，单击语音输入",
    "record.stopRecording": "停止录音",
    "record.save": "存",
    "record.saving": "保存中...",
    "record.saveSuccess": "善已存",
    "record.saveSuccessGuo": "已记过",
    "record.saveFailed": "保存失败",
    "record.successText": "功德无量",
    "record.successTextGuo": "知过能改",
    "record.loginLimitTip": "为长期安全保存更多记录，请先登录。",

    // 今日列表
    "today.title": "今日记录",
    "today.subtitle": "今天所有的功与过",
    "today.empty": "今天还没有记录",
    "today.emptyDesc": "开始记录你的功过，培养自省习惯",
    "today.goRecord": "去记录",
    "today.hint": "← 左滑可删除",
    "today.totalGong": "今日累积功",
    "today.totalGuo": "今日累积过",

    // 日历
    "calendar.title": "历史日历",
    "calendar.monthGong": "本月累计功",
    "calendar.monthGuo": "本月累计过",
    "calendar.legendGong": "功",
    "calendar.legendGuo": "过",
    "calendar.noRecord": "这一天没有记录",
    "calendar.week.sun": "日",
    "calendar.week.mon": "一",
    "calendar.week.tue": "二",
    "calendar.week.wed": "三",
    "calendar.week.thu": "四",
    "calendar.week.fri": "五",
    "calendar.week.sat": "六",

    // 某日详情
    "detail.title": "某日详情",
    "detail.totalGong": "当日累积功",
    "detail.totalGuo": "当日累积过",
    "detail.empty": "这一天没有记录",
    "detail.emptyDesc": "该日暂无记录",
    "detail.goRecord": "去记录",
    "detail.backCalendar": "返回日历",

    // 功德碑
    "monument.title": "功德碑",
    "monument.quote": "从前种种　譬如昨日死",
    "monument.totalGong": "累计功",
    "monument.totalGuo": "累计过",
    "monument.gongUnit": "善利益他人、有益于世的善行，即使微小亦能积累福德。",
    "monument.guoUnit": "损人利己、违背天理的恶行，即使无心也需忏悔消解。",
    "monument.footer1": "终身功过　并列而行",
    "monument.footer2": "唯愿过栏　日渐稀疏",
    "monument.startDate": "立碑之日",
    "monument.loginRequired": "请登录后查看你的功德碑",
    "monument.goLogin": "前往登录",

    // 菜单
    "menu.title": "菜单",
    "menu.user": "修行者",
    "menu.days": "已记录 {days} 天",
    "menu.calendar": "历史日历",
    "menu.monument": "功德碑",
    "menu.book": "了凡四训全文",
    "menu.reminder": "每日提醒",
    "menu.theme": "主题切换",
    "menu.backup": "数据备份与恢复",
    "menu.settings": "设置",
    "menu.about": "关于功过格",
    "menu.footer": "非商业 · 仅为自修",
    "menu.logout": "退出登录",
    "menu.confirmLogoutTitle": "确定退出登录？",
    "menu.confirmLogoutText": "你随时可以重新登录。",

    // 设置
    "settings.title": "设置",
    "settings.language": "应用语言",
    "settings.language.zh": "简体中文",
    "settings.language.ja": "日本語",
    "settings.language.en": "English",
    "settings.theme": "主题模式",
    "settings.theme.system": "跟随系统",
    "settings.theme.light": "浅色",
    "settings.theme.dark": "深色",
    "settings.account": "账号",
    "settings.email": "绑定邮箱",
    "settings.notLoggedIn": "未登录",
    "settings.login": "登录",
    "settings.deleteAccount": "删除账号",
    "settings.deleteAccountWarning": "这将永久删除与你账号有关的所有数据",
    "settings.privacy": "隐私政策",
    "settings.terms": "用户协议",
    "settings.version": "版本",

    // 关于
    "about.title": "关于功过格",
    "about.appName": "功过格",
    "about.tagline": "命自我立 福自己求",
    "about.description":
      "功过格源自明代袁了凡《了凡四训》，是一种传统的自我修身方法。通过每日记录善行与过失，培养自省习惯，改变命运。",
    "about.version": "版本",
    "about.privacy": "隐私政策",
    "about.terms": "用户协议",
    "about.contact": "联系我们",
    "about.since": "SINCE 1606",

    // 登录
    "login.title": "登录",
    "login.email": "邮箱",
    "login.emailPlaceholder": "请输入邮箱地址",
    "login.sendCode": "发送验证码",
    "login.code": "验证码",
    "login.codePlaceholder": "请输入 6 位验证码",
    "login.sendCodeSuccess": "验证码已发送到你的邮箱",
    "login.verify": "验证",
    "login.verifyFailed": "验证失败",
    "login.resend": "重新发送",
    "login.resendIn": "{seconds} 秒后可重新发送",
    "login.thirdParty": "或使用 Google 账号登录",
    "login.continueWithGoogle": "",
    "login.bindEmailTitle": "绑定邮箱",
    "login.bindEmailDesc": "请绑定邮箱以便日后找回账号",
    "login.bindNow": "立即绑定",
    "login.bindLater": "稍后绑定",
    "login.bindSuccess": "邮箱绑定成功",
    "login.loginSuccess": "登录成功",
    "login.logoutSuccess": "已退出登录",

    // 登录提示
    "loginRequired.title": "需要登录",
    "loginRequired.message.recordLimit":
      "为了长期安全地保存更多记录，请先登录。",
    "loginRequired.message.monument": "登录后才能查看完整功德碑。",
    "loginRequired.message.detail": "登录后可在多设备间同步历史记录。",
    "loginRequired.goLogin": "前往登录",
    "loginRequired.later": "以后再说",

    // 删除确认
    "delete.confirm": "删除",
    "delete.cancel": "取消",
    "delete.recordTitle": "删除记录？",
    "delete.recordText": "该记录将被永久删除，无法恢复。",
    "delete.accountTitle": "删除账号？",
    "delete.accountText": "与你账号相关的所有数据将被清除且无法恢复。",
    "delete.accountConfirm": "请输入 DELETE 以确认",
    "delete.success": "已删除",
    "delete.failed": "删除失败",

    // 通用
    "common.ok": "好的",
    "common.cancel": "取消",
    "common.save": "保存",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.close": "关闭",
    "common.back": "返回",
    "common.next": "下一步",
    "common.loading": "加载中...",
    "common.success": "操作成功",
    "common.failed": "操作失败",
    "common.networkError": "网络异常，请稍后重试",
    "common.retry": "重试",

    // 数字
    "num.0": "零",
    "num.1": "一",
    "num.2": "二",
    "num.3": "三",
    "num.4": "四",
    "num.5": "五",
    "num.6": "六",
    "num.7": "七",
    "num.8": "八",
    "num.9": "九",
    "num.10": "十",
    "num.100": "百",
    "num.1000": "千",
    "num.10000": "万",

    // Splash
    "splash.title1": "功",
    "splash.title2": "过",
    "splash.title3": "格",
    "splash.tagline": "命自我立  福自己求",
    "splash.logo": "凡",
    "splash.since": "SINCE 1606",
  },

  ja: {
    // ホーム
    "home.title": "ホーム",
    "home.fateIndex": "運命メーター",
    "home.fateIndex.level": "現在のレベル",
    "home.fateIndex.trend": "直近30日の推移",
    "home.todayGong": "本日の功",
    "home.todayGuo": "本日の過",
    "home.todayCard": "本日の功過",
    "home.aiSuggestion": "AI 本日のひと言",
    "home.viewTodayList": "今日の記録を見る",
    "home.viewCalendar": "カレンダー履歴",
    "home.viewMonument": "功徳碑",
    "home.recordGong": "功を記録",
    "home.recordGuo": "過ちを記録",
    "home.menu": "メニュー",
    "home.weekTrend": "今週の推移",
    "home.viewMore": "もっと見る",
    "home.dailyQuote": "一念の善に、吉神随う。一念の悪に、厉鬼随う。",
    "home.quoteSource": "——『了凡四訓』",
    "todo.title": "今日のToDo",
    "todo.add": "＋ 追加",
    "todo.addPrompt": "今日のToDoを入力してください（できるだけ短く）",
    "todo.empty": "今日のToDoはまだありません、追加してください",
    "reflection.title": "一日一省",
    "reflection.placeholder": "今日のひと言反省や感謝を書いてください...",
    "reflection.save": "保存",
    "reflection.score.gong": "今日は功が多い",
    "reflection.score.neutral": "中立",
    "reflection.score.guo": "今日は改過が必要",
    "reflection.saved": "本日の反省を保存しました",

    // 命運档位
    "fate.level.1": "暗澹",
    "fate.level.2": "微光",
    "fate.level.3": "明光",
    "fate.level.4": "昼明",
    "fate.level.5": "輝耀",

    // 記録ページ
    "record.title": "記録",
    "record.createGong": "功を記録",
    "record.createGuo": "過を記録",
    "record.editTitle": "記録を編集",
    "record.category": "カテゴリ",
    "record.category.gong": "功",
    "record.category.guo": "過",
    "record.tabGong": "功を記録",
    "record.tabGuo": "過を記録",
    "record.selectScore": "点数を選択",
    "record.score.1": "一功",
    "record.score.1.desc": "善い言葉\n親切な行い",
    "record.score.10": "十功",
    "record.score.10.desc": "困っている人を助ける\n悪を諫める",
    "record.score.30": "三十功",
    "record.score.30.desc": "危機から救う\n人を成功に導く",
    "record.score.100": "百功",
    "record.score.100.desc": "命を救う\n多くを救済",
    "record.score.1.guo": "一過",
    "record.score.1.guo.desc": "軽率な過ち\n言行の不謹慎",
    "record.score.10.guo": "十過",
    "record.score.10.guo.desc": "人を害し己を利す\n人を損ない己を益す",
    "record.score.30.guo": "三十過",
    "record.score.30.guo.desc": "他人を激怒させる\n善念を損なう",
    "record.score.100.guo": "百過",
    "record.score.100.guo.desc": "人の前途を誤る\n禍を起こし悪をなす",
    "record.notePlaceholder": "行ったことを簡単に...",
    "record.noteLabel": "メモ（任意）",
    "record.photo": "📷 写真",
    "record.voice": "🎤 音声",
    "record.voiceHint": "長押しで録音、タップで音声入力",
    "record.stopRecording": "録音を停止",
    "record.save": "保存",
    "record.saving": "保存中...",
    "record.saveSuccess": "保存しました",
    "record.saveSuccessGuo": "記録しました",
    "record.saveFailed": "保存に失敗",
    "record.successText": "功徳無量",
    "record.successTextGuo": "反省は成長の糧",
    "record.loginLimitTip":
      "より多くの記録を安全に残すため、ログインしてください。",

    // 本日リスト
    "today.title": "本日の記録",
    "today.subtitle": "今日のすべての功と過",
    "today.empty": "今日はまだ記録がありません",
    "today.emptyDesc": "功過を記録し、自省の習慣を身につけましょう",
    "today.goRecord": "記録する",
    "today.hint": "← スワイプで削除",
    "today.totalGong": "本日の功合計",
    "today.totalGuo": "本日の過合計",

    // カレンダー
    "calendar.title": "履歴カレンダー",
    "calendar.monthGong": "今月の功合計",
    "calendar.monthGuo": "今月の過合計",
    "calendar.legendGong": "功",
    "calendar.legendGuo": "過",
    "calendar.noRecord": "この日は記録がありません",
    "calendar.week.sun": "日",
    "calendar.week.mon": "月",
    "calendar.week.tue": "火",
    "calendar.week.wed": "水",
    "calendar.week.thu": "木",
    "calendar.week.fri": "金",
    "calendar.week.sat": "土",

    // 日別詳細
    "detail.title": "日別詳細",
    "detail.totalGong": "その日の功合計",
    "detail.totalGuo": "その日の過合計",
    "detail.empty": "この日の記録はありません",
    "detail.emptyDesc": "この日はまだ記録がありません",
    "detail.goRecord": "記録する",
    "detail.backCalendar": "カレンダーに戻る",

    // 功徳碑
    "monument.title": "功徳碑",
    "monument.quote": "過去は過去、明日からの新生",
    "monument.totalGong": "功の合計",
    "monument.totalGuo": "過の合計",
    "monument.gongUnit":
      "他人を利し、世に益する善行。たとえ小さくとも、福徳を積むことができる。",
    "monument.guoUnit":
      "人を損ない己を利し、天理に背く悪行。たとえ無心であっても、懺悔して消し去る必要がある。",
    "monument.footer1": "一生の功過　並べて記す",
    "monument.footer2": "過ちの列　日に薄れゆくを願う",
    "monument.startDate": "開始日",
    "monument.loginRequired": "功徳碑を見るにはログインしてください",
    "monument.goLogin": "ログインへ",

    // メニュー
    "menu.title": "メニュー",
    "menu.user": "修行者",
    "menu.days": "{days}日間記録中",
    "menu.calendar": "履歴カレンダー",
    "menu.monument": "功徳碑",
    "menu.book": "了凡四訓",
    "menu.reminder": "毎日リマインダー",
    "menu.theme": "テーマ切替",
    "menu.backup": "バックアップと復元",
    "menu.settings": "設定",
    "menu.about": "このアプリについて",
    "menu.footer": "非営利・自己修養のため",
    "menu.logout": "ログアウト",
    "menu.confirmLogoutTitle": "ログアウトしますか？",
    "menu.confirmLogoutText": "いつでも再度ログインできます。",

    // 設定
    "settings.title": "設定",
    "settings.language": "アプリの言語",
    "settings.language.zh": "简体中文",
    "settings.language.ja": "日本語",
    "settings.language.en": "English",
    "settings.theme": "テーマ",
    "settings.theme.system": "システムに合わせる",
    "settings.theme.light": "ライト",
    "settings.theme.dark": "ダーク",
    "settings.account": "アカウント",
    "settings.email": "メールアドレス",
    "settings.notLoggedIn": "未ログイン",
    "settings.login": "ログイン",
    "settings.deleteAccount": "アカウント削除",
    "settings.deleteAccountWarning": "すべてのデータが完全に削除されます",
    "settings.privacy": "プライバシーポリシー",
    "settings.terms": "利用規約",
    "settings.version": "バージョン",

    // アバウト
    "about.title": "このアプリについて",
    "about.appName": "功過格",
    "about.tagline": "運命は自ら切り開く",
    "about.description":
      "功過格は明代の袁了凡『了凡四訓』に由来する伝統的な自己修養法です。日々の善行と過ちを記録することで、内省の習慣を養い、運命を変えていきます。",
    "about.version": "バージョン",
    "about.privacy": "プライバシーポリシー",
    "about.terms": "利用規約",
    "about.contact": "お問い合わせ",
    "about.since": "SINCE 1606",

    // ログイン
    "login.title": "ログイン",
    "login.email": "メールアドレス",
    "login.emailPlaceholder": "メールアドレスを入力",
    "login.sendCode": "コードを送信",
    "login.code": "確認コード",
    "login.codePlaceholder": "6桁のコードを入力",
    "login.sendCodeSuccess": "コードをメールに送信しました",
    "login.verify": "確認",
    "login.verifyFailed": "確認に失敗しました",
    "login.resend": "再送信",
    "login.resendIn": "{seconds}秒後に再送信可能",
    "login.thirdParty": "または Google アカウントでログイン",
    "login.continueWithGoogle": "",
    "login.bindEmailTitle": "メールアドレスを紐づけ",
    "login.bindEmailDesc":
      "アカウント復元のためメールアドレスを紐づけてください",
    "login.bindNow": "今すぐ紐づける",
    "login.bindLater": "あとで",
    "login.bindSuccess": "メールアドレスを紐づけました",
    "login.loginSuccess": "ログインしました",
    "login.logoutSuccess": "ログアウトしました",

    // ログイン必要
    "loginRequired.title": "ログインが必要です",
    "loginRequired.message.recordLimit":
      "より多くの記録を安全に残すため、ログインしてください。",
    "loginRequired.message.monument":
      "功徳碑の全データを見るにはログインが必要です。",
    "loginRequired.message.detail":
      "履歴を複数端末で同期するにはログインしてください。",
    "loginRequired.goLogin": "ログインへ",
    "loginRequired.later": "あとで",

    // 削除確認
    "delete.confirm": "削除",
    "delete.cancel": "キャンセル",
    "delete.recordTitle": "記録を削除しますか？",
    "delete.recordText": "この記録は完全に削除され、元に戻せません。",
    "delete.accountTitle": "アカウントを削除しますか？",
    "delete.accountText": "すべてのデータが消去され、元に戻せません。",
    "delete.accountConfirm": "確認のため「DELETE」と入力してください",
    "delete.success": "削除しました",
    "delete.failed": "削除に失敗しました",

    // 通用
    "common.ok": "OK",
    "common.cancel": "キャンセル",
    "common.save": "保存",
    "common.edit": "編集",
    "common.delete": "削除",
    "common.close": "閉じる",
    "common.back": "戻る",
    "common.next": "次へ",
    "common.loading": "読み込み中...",
    "common.success": "成功しました",
    "common.failed": "失敗しました",
    "common.networkError": "ネットワークエラー",
    "common.retry": "再試行",

    // 数字
    "num.0": "零",
    "num.1": "一",
    "num.2": "二",
    "num.3": "三",
    "num.4": "四",
    "num.5": "五",
    "num.6": "六",
    "num.7": "七",
    "num.8": "八",
    "num.9": "九",
    "num.10": "十",
    "num.100": "百",
    "num.1000": "千",
    "num.10000": "万",

    // Splash
    "splash.title1": "功",
    "splash.title2": "過",
    "splash.title3": "格",
    "splash.tagline": "運命は自ら切り開く",
    "splash.logo": "凡",
    "splash.since": "SINCE 1606",
  },

  en: {
    // Home
    "home.title": "Home",
    "home.fateIndex": "Fate Index",
    "home.fateIndex.level": "Current level",
    "home.fateIndex.trend": "30-day trend",
    "home.todayGong": "Today's Merits",
    "home.todayGuo": "Today's Faults",
    "home.todayCard": "Today's Record",
    "home.aiSuggestion": "AI Reflection",
    "home.viewTodayList": "View today's records",
    "home.viewCalendar": "History calendar",
    "home.viewMonument": "Merit Monument",
    "home.recordGong": "Record Merit",
    "home.recordGuo": "Record Fault",
    "home.menu": "Menu",
    "home.weekTrend": "This Week",
    "home.viewMore": "View more",
    "home.dailyQuote":
      "A single good thought brings blessings; a single evil thought brings misfortune.",
    "home.quoteSource": "— Liao-Fan's Four Lessons",
    "todo.title": "Today's To-Do",
    "todo.add": "+ Add",
    "todo.addPrompt": "Add a to-do for today (keep it short)",
    "todo.empty": "No to-do for today, add one!",
    "reflection.title": "Daily Reflection",
    "reflection.placeholder": "Write one line of reflection or gratitude...",
    "reflection.save": "Save",
    "reflection.score.gong": "Today leans Merit",
    "reflection.score.neutral": "Neutral",
    "reflection.score.guo": "Today needs Correction",
    "reflection.saved": "Reflection saved for today",

    // Fate levels
    "fate.level.1": "Dim",
    "fate.level.2": "Glimmer",
    "fate.level.3": "Bright",
    "fate.level.4": "Radiant",
    "fate.level.5": "Brilliant",

    // Record
    "record.title": "Record",
    "record.createGong": "Record Merit",
    "record.createGuo": "Record Fault",
    "record.editTitle": "Edit Record",
    "record.category": "Category",
    "record.category.gong": "Merit",
    "record.category.guo": "Fault",
    "record.tabGong": "Merit",
    "record.tabGuo": "Fault",
    "record.selectScore": "Select Score",
    "record.score.1": "+1",
    "record.score.1.desc": "Kind words\nSmall help",
    "record.score.10": "+10",
    "record.score.10.desc": "Help in need\nStop wrongdoing",
    "record.score.30": "+30",
    "record.score.30.desc": "Save from danger\nHelp succeed",
    "record.score.100": "+100",
    "record.score.100.desc": "Save a life\nMajor impact",
    "record.score.1.guo": "-1",
    "record.score.1.guo.desc": "Careless mistakes\nImproper words and deeds",
    "record.score.10.guo": "-10",
    "record.score.10.guo.desc":
      "Harm others for self-gain\nBenefit at others' expense",
    "record.score.30.guo": "-30",
    "record.score.30.guo.desc":
      "Provoke others' anger\nCorrupt good intentions",
    "record.score.100.guo": "-100",
    "record.score.100.guo.desc":
      "Ruin others' future\nCause disaster and commit evil",
    "record.notePlaceholder": "Describe what you did...",
    "record.noteLabel": "Notes (optional)",
    "record.photo": "📷 Photo",
    "record.voice": "🎤 Voice",
    "record.voiceHint": "Long press to record, tap for voice input",
    "record.stopRecording": "Stop Recording",
    "record.save": "Save",
    "record.saving": "Saving...",
    "record.saveSuccess": "Saved!",
    "record.saveSuccessGuo": "Recorded",
    "record.saveFailed": "Save failed",
    "record.successText": "Well done!",
    "record.successTextGuo": "Reflection noted",
    "record.loginLimitTip": "Please log in to keep more records safely.",

    // Today list
    "today.title": "Today's Records",
    "today.subtitle": "All merits and faults today",
    "today.empty": "No records for today yet",
    "today.emptyDesc":
      "Start recording your merits and demerits to cultivate self-reflection",
    "today.goRecord": "Record",
    "today.hint": "← Swipe to delete",
    "today.totalGong": "Total merits today",
    "today.totalGuo": "Total faults today",

    // Calendar
    "calendar.title": "History Calendar",
    "calendar.monthGong": "Monthly merits",
    "calendar.monthGuo": "Monthly faults",
    "calendar.legendGong": "Merit",
    "calendar.legendGuo": "Fault",
    "calendar.noRecord": "No records this day",
    "calendar.week.sun": "Sun",
    "calendar.week.mon": "Mon",
    "calendar.week.tue": "Tue",
    "calendar.week.wed": "Wed",
    "calendar.week.thu": "Thu",
    "calendar.week.fri": "Fri",
    "calendar.week.sat": "Sat",

    // Day detail
    // "detail.title": "Day Detail",
    "detail.title": "Day Detail222222",
    "detail.totalGong": "Total merits",
    "detail.totalGuo": "Total faults",
    "detail.empty": "No records for this day",
    "detail.emptyDesc": "No records for this day yet",
    "detail.goRecord": "Record",
    "detail.backCalendar": "Back to Calendar",

    // Monument
    "monument.title": "Merit Monument",
    "monument.quote": "The past is gone, today is a new beginning",
    "monument.totalGong": "Total Merits",
    "monument.totalGuo": "Total Faults",
    "monument.gongUnit":
      "Good deeds that benefit others and the world, even if small, can accumulate merit and virtue.",
    "monument.guoUnit":
      "Harmful acts that benefit oneself and violate natural law, even if unintentional, require repentance and dissolution.",
    "monument.footer1": "A lifelong ledger of deeds",
    "monument.footer2": "May the fault column grow ever lighter",
    "monument.startDate": "Since",
    "monument.loginRequired": "Please log in to view your monument",
    "monument.goLogin": "Go to login",

    // Menu
    "menu.title": "Menu",
    "menu.user": "Practitioner",
    "menu.days": "{days} days recorded",
    "menu.calendar": "History Calendar",
    "menu.monument": "Merit Monument",
    "menu.book": "Liao-Fan's Four Lessons",
    "menu.reminder": "Daily Reminder",
    "menu.theme": "Theme",
    "menu.backup": "Backup & Restore",
    "menu.settings": "Settings",
    "menu.about": "About",
    "menu.footer": "Non-commercial · For self-cultivation",
    "menu.logout": "Log out",
    "menu.confirmLogoutTitle": "Log out?",
    "menu.confirmLogoutText": "You can log in again at any time.",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.language.zh": "简体中文",
    "settings.language.ja": "日本語",
    "settings.language.en": "English",
    "settings.theme": "Theme",
    "settings.theme.system": "System",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.account": "Account",
    "settings.email": "Email",
    "settings.notLoggedIn": "Not logged in",
    "settings.login": "Login",
    "settings.deleteAccount": "Delete Account",
    "settings.deleteAccountWarning":
      "All your data will be permanently deleted",
    "settings.privacy": "Privacy Policy",
    "settings.terms": "Terms of Service",
    "settings.version": "Version",

    // About
    "about.title": "About",
    "about.appName": "Ledger of Merit",
    "about.tagline": "Shape your own destiny",
    "about.description":
      "The Merit Ledger originates from Liao-Fan's Four Lessons, a traditional Chinese method of self-cultivation. By recording daily good deeds and faults, you develop the habit of self-reflection and transform your destiny.",
    "about.version": "Version",
    "about.privacy": "Privacy Policy",
    "about.terms": "Terms of Service",
    "about.contact": "Contact Us",
    "about.since": "SINCE 1606",

    // Login
    "login.title": "Login",
    "login.email": "Email",
    "login.emailPlaceholder": "Enter your email",
    "login.sendCode": "Send code",
    "login.code": "Verification code",
    "login.codePlaceholder": "Enter 6-digit code",
    "login.sendCodeSuccess": "Code sent to your email",
    "login.verify": "Verify",
    "login.verifyFailed": "Verification failed",
    "login.resend": "Resend",
    "login.resendIn": "Resend in {seconds}s",
    "login.thirdParty": "Or continue with Google",
    "login.continueWithGoogle": "",
    "login.bindEmailTitle": "Bind Email",
    "login.bindEmailDesc": "Bind an email to recover your account later",
    "login.bindNow": "Bind now",
    "login.bindLater": "Later",
    "login.bindSuccess": "Email bound successfully",
    "login.loginSuccess": "Login successful",
    "login.logoutSuccess": "Logged out",

    // Login required
    "loginRequired.title": "Login Required",
    "loginRequired.message.recordLimit":
      "Please log in to keep more records safely.",
    "loginRequired.message.monument":
      "Log in to view your full merit monument.",
    "loginRequired.message.detail": "Log in to sync history across devices.",
    "loginRequired.goLogin": "Go to login",
    "loginRequired.later": "Maybe later",

    // Delete confirm
    "delete.confirm": "Delete",
    "delete.cancel": "Cancel",
    "delete.recordTitle": "Delete record?",
    "delete.recordText": "This record will be permanently deleted.",
    "delete.accountTitle": "Delete account?",
    "delete.accountText":
      "All your data will be erased and cannot be recovered.",
    "delete.accountConfirm": "Type DELETE to confirm",
    "delete.success": "Deleted",
    "delete.failed": "Delete failed",

    // Common
    "common.ok": "OK",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.failed": "Failed",
    "common.networkError": "Network error, please try again",
    "common.retry": "Retry",

    // Numbers (English uses Arabic numerals)
    "num.0": "0",
    "num.1": "1",
    "num.2": "2",
    "num.3": "3",
    "num.4": "4",
    "num.5": "5",
    "num.6": "6",
    "num.7": "7",
    "num.8": "8",
    "num.9": "9",
    "num.10": "10",
    "num.100": "100",
    "num.1000": "1000",
    "num.10000": "10000",

    // Splash
    "splash.title1": "Ledger",
    "splash.title2": "of",
    "splash.title3": "Merit",
    "splash.tagline": "Shape your own destiny",
    "splash.logo": "凡",
    "splash.since": "SINCE 1606",
  },
};

// 支持的语言
const supportedLocales = ["zh", "ja", "en"];

// 获取当前语言
function getCurrentLocale() {
  // 优先使用保存的语言
  const saved = localStorage.getItem("ggg_language");
  if (saved && supportedLocales.includes(saved)) {
    return saved;
  }

  // 根据浏览器语言判断
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("ja")) return "ja";
  return "en";
}

// 设置语言
function setLocale(locale) {
  if (supportedLocales.includes(locale)) {
    localStorage.setItem("ggg_language", locale);
    document.documentElement.lang = locale;
    return true;
  }
  return false;
}

// 获取翻译文本
function t(key, params = {}) {
  const locale = getCurrentLocale();
  const dict = messages[locale] || messages["en"];
  let text = dict[key] || key;

  // 替换参数 {param}
  Object.keys(params).forEach((param) => {
    text = text.replace(new RegExp(`\\{${param}\\}`, "g"), params[param]);
  });

  return text;
}

// 数字转中文/日文
function toLocalNumber(num, locale) {
  locale = locale || getCurrentLocale();

  if (locale === "en") {
    return num.toString();
  }

  // 确保 num 是数字类型
  num = Number(num);
  if (isNaN(num) || num < 0) {
    return num.toString();
  }

  // 中文/日文数字转换（中文主题下始终使用中文小写数字）
  const numChars = {
    0: "零",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
  };

  // 辅助函数：处理 0-9999 的数字
  function convertSmallNumber(n) {
    if (n < 10) {
      return numChars[n];
    } else if (n < 100) {
      const tens = Math.floor(n / 10);
      const ones = n % 10;
      let result = "";
      if (tens > 1) result += numChars[tens];
      result += "十";
      if (ones > 0) result += numChars[ones];
      return result;
    } else if (n < 1000) {
      const hundreds = Math.floor(n / 100);
      const remainder = n % 100;
      let result = numChars[hundreds] + "百";
      if (remainder > 0) {
        if (remainder < 10) result += "零";
        result += convertSmallNumber(remainder);
      }
      return result;
    } else {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      let result = numChars[thousands] + "千";
      if (remainder > 0) {
        if (remainder < 100) result += "零";
        result += convertSmallNumber(remainder);
      }
      return result;
    }
  }

  // 处理大于 10000 的数字
  if (num < 10000) {
    return convertSmallNumber(num);
  } else {
    // 使用迭代方式处理大数字，避免无限递归
    let result = "";
    let remaining = num;

    // 处理万位以上的部分（亿、千万等）
    if (remaining >= 100000000) {
      const yi = Math.floor(remaining / 100000000);
      remaining = remaining % 100000000;
      result += convertSmallNumber(yi) + "亿";
    }

    if (remaining >= 10000) {
      const wan = Math.floor(remaining / 10000);
      remaining = remaining % 10000;
      result += convertSmallNumber(wan) + "万";
    }

    // 处理万位以下的部分
    if (remaining > 0) {
      if (remaining < 1000 && result.length > 0) result += "零";
      result += convertSmallNumber(remaining);
    }

    return result || "零";
  }
}

// 更新页面上所有带 data-i18n 属性的元素
function updatePageTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const params = el.getAttribute("data-i18n-params");
    const paramsObj = params ? JSON.parse(params) : {};
    el.textContent = t(key, paramsObj);
  });

  // 更新 placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  // 更新 title
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    el.title = t(key);
  });
}

// 导出
window.i18n = {
  messages,
  supportedLocales,
  getCurrentLocale,
  setLocale,
  t,
  toLocalNumber,
  updatePageTexts,
};
