/**
 * 功过格 App - 图片处理模块
 * Image Handler Module for GongGuoGe App
 */

const ImageHandler = {
  // 最大图片数量
  MAX_IMAGES: 3,
  
  // 最大尺寸（720p）
  MAX_WIDTH: 1280,
  MAX_HEIGHT: 720,
  
  // 最大文件大小（500KB）
  MAX_FILE_SIZE: 500 * 1024,
  
  // 压缩质量（0-1）
  COMPRESS_QUALITY: 0.8,

  /**
   * 选择图片
   * @param {Function} onSelect - 选择完成回调 (images: Array<{file: File, dataUrl: string, preview: string}>) => void
   * @param {Function} onError - 错误回调 (error: string) => void
   */
  selectImages(onSelect, onError) {
    // 检查登录状态
    if (!this.checkLogin()) {
      onError && onError('请先登录');
      return;
    }

    // 优先使用 Android 桥接（如果可用）
    if (typeof window.AndroidBridge !== 'undefined' && window.AndroidBridge.selectImages) {
      try {
        // 设置回调函数供 Android 调用
        window._pendingImageCallback = onSelect;
        window._pendingImageError = onError;
        
        // 调用 Android 桥接
        window.AndroidBridge.selectImages(3);
        return;
      } catch (error) {
        console.warn('Android 桥接调用失败，使用 Web API:', error);
      }
    }

    // 使用 Web API
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      
      if (files.length === 0) {
        return;
      }
      
      if (files.length > this.MAX_IMAGES) {
        onError && onError(`最多只能选择 ${this.MAX_IMAGES} 张图片`);
        return;
      }
      
      try {
        const images = [];
        for (const file of files) {
          // 检查文件大小
          if (file.size > 10 * 1024 * 1024) { // 原始文件最大10MB
            onError && onError('图片文件过大，请选择小于10MB的图片');
            return;
          }
          
          // 压缩图片
          const compressed = await this.compressImage(file);
          images.push(compressed);
        }
        
        onSelect && onSelect(images);
      } catch (error) {
        console.error('处理图片失败:', error);
        onError && onError('处理图片失败，请重试');
      }
    };
    
    input.click();
  },

  /**
   * 压缩图片
   * @param {File} file - 原始图片文件
   * @returns {Promise<{file: File, dataUrl: string, preview: string}>}
   */
  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // 计算压缩后的尺寸
          let width = img.width;
          let height = img.height;
          
          if (width > this.MAX_WIDTH || height > this.MAX_HEIGHT) {
            const ratio = Math.min(
              this.MAX_WIDTH / width,
              this.MAX_HEIGHT / height
            );
            width = width * ratio;
            height = height * ratio;
          }
          
          // 创建 canvas 进行压缩
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // 转换为 Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('图片压缩失败'));
                return;
              }
              
              // 如果压缩后仍然太大，降低质量
              if (blob.size > this.MAX_FILE_SIZE) {
                canvas.toBlob(
                  (smallBlob) => {
                    if (!smallBlob) {
                      reject(new Error('图片压缩失败'));
                      return;
                    }
                    
                    const compressedFile = new File(
                      [smallBlob],
                      file.name,
                      { type: 'image/jpeg' }
                    );
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                    const preview = URL.createObjectURL(compressedFile);
                    
                    resolve({
                      file: compressedFile,
                      dataUrl,
                      preview,
                      originalName: file.name
                    });
                  },
                  'image/jpeg',
                  0.6
                );
              } else {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: 'image/jpeg' }
                );
                
                const dataUrl = canvas.toDataURL('image/jpeg', this.COMPRESS_QUALITY);
                const preview = URL.createObjectURL(compressedFile);
                
                resolve({
                  file: compressedFile,
                  dataUrl,
                  preview,
                  originalName: file.name
                });
              }
            },
            'image/jpeg',
            this.COMPRESS_QUALITY
          );
        };
        
        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsDataURL(file);
    });
  },

  /**
   * 上传图片到服务器
   * @param {File} file - 图片文件
   * @returns {Promise<string>} 返回图片URL
   */
  async uploadImage(file) {
    if (!window.api || !window.api.isAuthenticated()) {
      throw new Error('未登录，无法上传图片');
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // 这里需要后端提供上传接口
      // 暂时返回一个占位符
      const response = await fetch(`${window.api.config.BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.api && window.api.isAuthenticated() ? (localStorage.getItem('ggg_auth_token') || '') : ''}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('上传失败');
      }
      
      const data = await response.json();
      return data.url || data.data?.url;
    } catch (error) {
      console.error('上传图片失败:', error);
      // 如果上传失败，返回 base64 作为临时方案
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    return window.api && window.api.isAuthenticated();
  },

  /**
   * 释放预览URL
   * @param {string} previewUrl - 预览URL
   */
  revokePreview(previewUrl) {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }
};

// 导出
window.imageHandler = ImageHandler;

// Android 桥接回调函数（由 Android 端调用）
window.onImagesSelected = function(images) {
  if (window._pendingImageCallback) {
    // 将 Android 返回的 base64 数据转换为 File 对象
    const imageFiles = images.map(function(imageData) {
      // imageData 格式：{ base64: string, name: string }
      const byteString = atob(imageData.base64.split(',')[1]);
      const mimeString = imageData.base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], imageData.name || 'image.jpg', { type: mimeString });
      
      return {
        file: file,
        dataUrl: imageData.base64,
        preview: imageData.base64,
        originalName: imageData.name || 'image.jpg'
      };
    });
    
    window._pendingImageCallback(imageFiles);
    window._pendingImageCallback = null;
    window._pendingImageError = null;
  }
};

window.onImagesError = function(error) {
  if (window._pendingImageError) {
    window._pendingImageError(error);
    window._pendingImageCallback = null;
    window._pendingImageError = null;
  }
};

