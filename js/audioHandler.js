/**
 * 功过格 App - 音频处理模块
 * Audio Handler Module for GongGuoGe App
 */

const AudioHandler = {
  // 最大录音时长（秒）
  MAX_DURATION: 60,

  // 音频格式
  AUDIO_FORMAT: "audio/mp3",

  // 当前录音状态
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  recordingStartTime: null,
  durationTimer: null,

  /**
   * 开始录音
   * @param {Function} onStart - 开始回调
   * @param {Function} onProgress - 进度回调 (duration: number) => void
   * @param {Function} onComplete - 完成回调 (audioBlob: Blob, duration: number) => void
   * @param {Function} onError - 错误回调 (error: string) => void
   */
  async startRecording(onStart, onProgress, onComplete, onError) {
    // 检查登录状态
    if (!this.checkLogin()) {
      onError && onError("请先登录");
      return;
    }

    // 优先使用 Android 桥接（如果可用）
    if (
      typeof window.AndroidBridge !== "undefined" &&
      typeof window.AndroidBridge.startRecording === "function"
    ) {
      try {
        // 设置回调函数供 Android 调用
        window._pendingRecordingStart = onStart;
        window._pendingRecordingProgress = onProgress;
        window._pendingRecordingComplete = onComplete;
        window._pendingRecordingError = onError;

        // 调用 Android 桥接
        const result = JSON.parse(window.AndroidBridge.startRecording());
        if (!result.success) {
          onError && onError(result.error || "录音启动失败");
          return;
        }
        // 成功启动，等待 Android 回调
        return;
      } catch (error) {
        console.warn("Android 桥接调用失败，使用 Web API:", error);
        // 继续使用 Web API
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 注意：浏览器原生不支持直接录制MP3，需要使用第三方库
      // 这里先使用 WebM 格式，然后转换为 MP3（需要后端支持或使用库）
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const duration = (Date.now() - this.recordingStartTime) / 1000;
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });

        // 转换为 MP3（需要后端支持或使用客户端库）
        this.convertToMP3(audioBlob)
          .then((mp3Blob) => {
            onComplete && onComplete(mp3Blob, duration);
          })
          .catch((error) => {
            console.warn("MP3转换失败，使用原始格式:", error);
            // 如果转换失败，使用原始格式
            onComplete && onComplete(audioBlob, duration);
          });

        // 停止所有音频轨道
        stream.getTracks().forEach((track) => track.stop());

        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordingStartTime = null;

        if (this.durationTimer) {
          clearInterval(this.durationTimer);
          this.durationTimer = null;
        }
      };

      this.mediaRecorder.onerror = (event) => {
        onError && onError("录音失败");
        this.stopRecording();
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      // 开始计时
      this.durationTimer = setInterval(() => {
        const duration = (Date.now() - this.recordingStartTime) / 1000;
        onProgress && onProgress(duration);

        // 达到最大时长自动停止
        if (duration >= this.MAX_DURATION) {
          this.stopRecording();
        }
      }, 100);

      onStart && onStart();
    } catch (error) {
      console.error("开始录音失败:", error);
      onError && onError("无法访问麦克风，请检查权限设置");
    }
  },

  /**
   * 停止录音
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    if (this.durationTimer) {
      clearInterval(this.durationTimer);
      this.durationTimer = null;
    }
  },

  /**
   * 将 WebM 转换为 MP3
   * 注意：浏览器端无法直接转换，需要：
   * 1. 使用后端API转换
   * 2. 使用客户端库（如 lamejs）
   * 这里先返回原始格式，实际项目中需要实现转换
   */
  async convertToMP3(audioBlob) {
    // 使用后端上传接口，它会自动将 M4A 转换为 MP3
    // 注意：后端返回的是 JSON（包含 URL），不是 Blob
    // 如果需要 Blob，需要从 URL 下载
    try {
      const formData = new FormData();
      // 根据 blob 类型确定文件名
      const fileName =
        audioBlob.type.includes("m4a") || audioBlob.type.includes("mp4")
          ? "recording.m4a"
          : "recording.webm";
      formData.append("audio", audioBlob, fileName);

      const token =
        window.api && window.api.isAuthenticated()
          ? localStorage.getItem("ggg_auth_token") || ""
          : "";

      const response = await fetch(
        `${window.api.config.BASE_URL}/api/upload/audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // 后端已经自动转换为 MP3 并上传
          // 从 URL 下载 MP3 Blob 返回给调用者
          const mp3Response = await fetch(data.data.url);
          if (mp3Response.ok) {
            const mp3Blob = await mp3Response.blob();
            // 保存 URL 到 blob，方便后续使用
            mp3Blob.url = data.data.url;
            return mp3Blob;
          }
        }
      }
    } catch (error) {
      console.warn("后端转换失败:", error);
    }

    // 如果后端转换失败，返回原始格式
    return audioBlob;
  },

  /**
   * 上传音频到服务器
   * @param {Blob} audioBlob - 音频文件
   * @returns {Promise<string>} 返回音频URL
   */
  async uploadAudio(audioBlob) {
    if (!window.api || !window.api.isAuthenticated()) {
      throw new Error("未登录，无法上传音频");
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");

    try {
      const response = await fetch(
        `${window.api.config.BASE_URL}/api/upload/audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              window.api && window.api.isAuthenticated()
                ? localStorage.getItem("ggg_auth_token") || ""
                : ""
            }`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("上传失败");
      }

      const data = await response.json();
      return data.url || data.data?.url;
    } catch (error) {
      console.error("上传音频失败:", error);
      // 如果上传失败，返回 base64 作为临时方案
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(audioBlob);
      });
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    return window.api && window.api.isAuthenticated();
  },
};

// 导出
window.audioHandler = AudioHandler;

// Android 桥接回调函数（由 Android 端调用）
window.onRecordingStart = function () {
  if (window._pendingRecordingStart) {
    window._pendingRecordingStart();
  }
};

window.onRecordingProgress = function (duration) {
  if (window._pendingRecordingProgress) {
    window._pendingRecordingProgress(duration);
  }
};

window.onRecordingComplete = function (audioData) {
  if (window._pendingRecordingComplete) {
    // audioData 格式：{ base64: string, duration: number }
    const base64Data = audioData.base64;
    // 检测 MIME 类型（Android 可能返回 audio/mp4 或 audio/m4a）
    const mimeMatch = base64Data.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : "audio/mp4";

    const byteString = atob(base64Data.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });

    // 如果是 M4A 格式，尝试转换为 MP3（通过后端）
    if (mimeType.includes("m4a") || mimeType.includes("mp4")) {
      window.audioHandler
        .convertToMP3(blob)
        .then((mp3Blob) => {
          window._pendingRecordingComplete(mp3Blob, audioData.duration);
          window._pendingRecordingStart = null;
          window._pendingRecordingProgress = null;
          window._pendingRecordingComplete = null;
          window._pendingRecordingError = null;
        })
        .catch((error) => {
          console.warn("MP3转换失败，使用原始格式:", error);
          // 如果转换失败，使用原始格式
          window._pendingRecordingComplete(blob, audioData.duration);
          window._pendingRecordingStart = null;
          window._pendingRecordingProgress = null;
          window._pendingRecordingComplete = null;
          window._pendingRecordingError = null;
        });
    } else {
      window._pendingRecordingComplete(blob, audioData.duration);
      window._pendingRecordingStart = null;
      window._pendingRecordingProgress = null;
      window._pendingRecordingComplete = null;
      window._pendingRecordingError = null;
    }
  }
};

window.onRecordingError = function (error) {
  if (window._pendingRecordingError) {
    window._pendingRecordingError(error);
    window._pendingRecordingStart = null;
    window._pendingRecordingProgress = null;
    window._pendingRecordingComplete = null;
    window._pendingRecordingError = null;
  }
};
