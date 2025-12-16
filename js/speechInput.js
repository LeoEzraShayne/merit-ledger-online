/**
 * 功过格 App - 语音输入模块
 * Speech Input Module for GongGuoGe App
 */

const SpeechInput = {
  recognition: null,
  isListening: false,
  currentLanguage: 'zh-CN',

  /**
   * 初始化语音识别
   */
  init() {
    // 检查浏览器支持
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('浏览器不支持语音识别');
      return false;
    }
    
    this.recognition = new SpeechRecognition();
    this.updateLanguage();
    
    // 配置识别参数
    this.recognition.continuous = true; // 持续识别
    this.recognition.interimResults = true; // 返回临时结果
    
    return true;
  },

  /**
   * 根据当前语言设置识别语言
   */
  updateLanguage() {
    if (!this.recognition) return;
    
    const locale = window.i18n?.getCurrentLocale() || 'zh';
    
    // 语言映射
    const languageMap = {
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'en': 'en-US'
    };
    
    this.currentLanguage = languageMap[locale] || 'zh-CN';
    this.recognition.lang = this.currentLanguage;
  },

  /**
   * 开始语音输入
   * @param {Function} onResult - 识别结果回调 (text: string, isFinal: boolean) => void
   * @param {Function} onError - 错误回调 (error: string) => void
   */
  start(onResult, onError) {
    // 检查登录状态
    if (!this.checkLogin()) {
      onError && onError('请先登录');
      return;
    }

    // 优先使用 Android 桥接（如果可用）
    if (typeof window.AndroidBridge !== 'undefined' && window.AndroidBridge.startSpeechRecognition) {
      try {
        // 设置回调函数供 Android 调用
        window._pendingSpeechResult = onResult;
        window._pendingSpeechError = onError;
        
        // 获取当前语言
        const locale = window.i18n?.getCurrentLocale() || 'zh';
        const languageMap = {
          'zh': 'zh-CN',
          'ja': 'ja-JP',
          'en': 'en-US'
        };
        const language = languageMap[locale] || 'zh-CN';
        
        // 调用 Android 桥接
        window.AndroidBridge.startSpeechRecognition(language);
        return;
      } catch (error) {
        console.warn('Android 桥接调用失败，使用 Web API:', error);
      }
    }

    if (!this.recognition) {
      if (!this.init()) {
        onError && onError('浏览器不支持语音识别');
        return;
      }
    }
    
    if (this.isListening) {
      this.stop();
    }
    
    this.updateLanguage();
    
    let finalText = '';
    
    this.recognition.onresult = (event) => {
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }
      
      // 返回最终结果和临时结果
      onResult && onResult(finalText + interimText, finalText.length > 0);
    };
    
    this.recognition.onerror = (event) => {
      let errorMsg = '语音识别失败';
      
      switch (event.error) {
        case 'no-speech':
          errorMsg = '未检测到语音，请重试';
          break;
        case 'audio-capture':
          errorMsg = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorMsg = '麦克风权限被拒绝';
          break;
        case 'network':
          errorMsg = '网络错误';
          break;
      }
      
      onError && onError(errorMsg);
      this.isListening = false;
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      
      // 如果有最终文本，返回
      if (finalText) {
        onResult && onResult(finalText, true);
      }
    };
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('启动语音识别失败:', error);
      onError && onError('启动语音识别失败');
    }
  },

  /**
   * 停止语音输入
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    return window.api && window.api.isAuthenticated();
  }
};

// 导出
window.speechInput = SpeechInput;

// Android 桥接回调函数（由 Android 端调用）
window.onSpeechResult = function(text, isFinal) {
  if (window._pendingSpeechResult) {
    window._pendingSpeechResult(text, isFinal || false);
  }
};

window.onSpeechError = function(error) {
  if (window._pendingSpeechError) {
    window._pendingSpeechError(error);
    window._pendingSpeechResult = null;
    window._pendingSpeechError = null;
  }
};

