/**
 * 表单验证工具模块
 * Form Validator Module
 * 
 * 统一的表单验证规则系统
 */

/**
 * 验证规则定义
 */
const VALIDATION_RULES = {
  // 邮箱验证
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址',
    required: true
  },
  
  // 验证码（6位数字）
  code: {
    pattern: /^\d{6}$/,
    message: '请输入6位数字验证码',
    required: true,
    minLength: 6,
    maxLength: 6
  },
  
  // 备注/笔记（可选，最大500字符）
  note: {
    maxLength: 500,
    message: '备注不能超过500个字符',
    required: false
  },
  
  // 记录类型
  recordType: {
    pattern: /^(gong|guo)$/,
    message: '记录类型必须是"功"或"过"',
    required: true
  },
  
  // 分值（1-1000）
  score: {
    pattern: /^\d+$/,
    message: '分值必须是正整数',
    required: true,
    min: 1,
    max: 1000
  },
  
  // 删除确认（DELETE）
  deleteConfirm: {
    pattern: /^DELETE$/,
    message: '请输入 DELETE 确认删除',
    required: true
  }
};

/**
 * 验证单个字段
 * @param {string} value - 要验证的值
 * @param {string} ruleName - 规则名称
 * @param {object} customRule - 自定义规则（可选）
 * @returns {object} { valid: boolean, message: string }
 */
function validateField(value, ruleName, customRule = {}) {
  const rule = { ...VALIDATION_RULES[ruleName], ...customRule };
  
  // 转换为字符串进行验证
  const strValue = String(value || '').trim();
  
  // 必填验证
  if (rule.required && !strValue) {
    return {
      valid: false,
      message: rule.message || `${ruleName} 不能为空`
    };
  }
  
  // 如果非必填且为空，直接通过
  if (!rule.required && !strValue) {
    return { valid: true, message: '' };
  }
  
  // 最小长度验证
  if (rule.minLength && strValue.length < rule.minLength) {
    return {
      valid: false,
      message: `${rule.message || ruleName} 至少需要 ${rule.minLength} 个字符`
    };
  }
  
  // 最大长度验证
  if (rule.maxLength && strValue.length > rule.maxLength) {
    return {
      valid: false,
      message: `${rule.message || ruleName} 不能超过 ${rule.maxLength} 个字符`
    };
  }
  
  // 正则表达式验证
  if (rule.pattern && !rule.pattern.test(strValue)) {
    return {
      valid: false,
      message: rule.message || `${ruleName} 格式不正确`
    };
  }
  
  // 数值范围验证
  if (rule.min !== undefined || rule.max !== undefined) {
    const numValue = parseInt(strValue);
    if (isNaN(numValue)) {
      return {
        valid: false,
        message: rule.message || `${ruleName} 必须是数字`
      };
    }
    if (rule.min !== undefined && numValue < rule.min) {
      return {
        valid: false,
        message: `${rule.message || ruleName} 不能小于 ${rule.min}`
      };
    }
    if (rule.max !== undefined && numValue > rule.max) {
      return {
        valid: false,
        message: `${rule.message || ruleName} 不能大于 ${rule.max}`
      };
    }
  }
  
  return { valid: true, message: '' };
}

/**
 * 验证表单
 * @param {object} formData - 表单数据对象 { fieldName: value }
 * @param {object} rules - 规则映射 { fieldName: ruleName }
 * @returns {object} { valid: boolean, errors: object }
 */
function validateForm(formData, rules) {
  const errors = {};
  let isValid = true;
  
  for (const [fieldName, ruleName] of Object.entries(rules)) {
    const value = formData[fieldName];
    const result = validateField(value, ruleName);
    
    if (!result.valid) {
      errors[fieldName] = result.message;
      isValid = false;
    }
  }
  
  return { valid: isValid, errors };
}

/**
 * 实时验证输入框（绑定到 input 事件）
 * @param {HTMLElement} input - 输入框元素
 * @param {string} ruleName - 规则名称
 * @param {function} onValidate - 验证回调 (valid, message) => void
 */
function bindInputValidation(input, ruleName, onValidate) {
  if (!input || !ruleName) return;
  
  // 确保输入框的父元素有相对定位（用于错误信息定位）
  const parent = input.parentElement;
  if (parent && getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  
  // 移除之前的验证类
  const removeValidationClasses = () => {
    input.classList.remove('input-error', 'input-valid');
    const errorMsg = input.parentElement?.querySelector('.input-error-msg');
    if (errorMsg) errorMsg.remove();
  };
  
  // 显示错误信息
  const showError = (message) => {
    removeValidationClasses();
    input.classList.add('input-error');
    
    // 检查是否已存在错误信息
    let errorMsg = input.parentElement?.querySelector('.input-error-msg');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'input-error-msg';
      // 插入到输入框后面
      input.parentElement?.insertBefore(errorMsg, input.nextSibling);
    }
    errorMsg.textContent = message;
    
    if (onValidate) onValidate(false, message);
  };
  
  // 显示成功状态
  const showSuccess = () => {
    removeValidationClasses();
    input.classList.add('input-valid');
    if (onValidate) onValidate(true, '');
  };
  
  // 验证函数
  const validate = () => {
    const value = input.value.trim();
    const result = validateField(value, ruleName);
    
    if (result.valid) {
      // 验证通过：清除错误，显示成功状态（可选）
      showSuccess();
    } else {
      // 验证失败：显示错误信息
      // 实时验证：有值就显示错误，空值且未聚焦时不显示
      if (value) {
        // 有值：立即显示错误
        showError(result.message);
      } else if (document.activeElement === input) {
        // 正在输入但为空：不显示错误（避免干扰输入）
        removeValidationClasses();
      } else {
        // 失去焦点且为空：显示错误（如果必填）
        if (VALIDATION_RULES[ruleName]?.required) {
          showError(result.message);
        } else {
          removeValidationClasses();
        }
      }
    }
  };
  
  // 绑定事件
  input.addEventListener('input', validate);
  input.addEventListener('blur', validate);
  input.addEventListener('focus', () => {
    // 聚焦时重新验证，清除之前的错误状态
    const value = input.value.trim();
    if (value) {
      validate();
    }
  });
  
  // 初始验证（如果有值）
  if (input.value) {
    validate();
  }
}

/**
 * 清除输入框验证状态
 * @param {HTMLElement} input - 输入框元素
 */
function clearValidation(input) {
  if (!input) return;
  input.classList.remove('input-error', 'input-valid');
  const errorMsg = input.parentElement?.querySelector('.input-error-msg');
  if (errorMsg) errorMsg.remove();
}

/**
 * 显示错误提示
 * @param {HTMLElement} element - 元素
 * @param {string} message - 错误信息
 */
function showError(element, message) {
  if (!element) return;
  
  element.classList.add('input-error');
  
  // 移除旧的错误信息
  const oldError = element.parentElement?.querySelector('.input-error-msg');
  if (oldError) oldError.remove();
  
  // 添加新的错误信息
  const errorMsg = document.createElement('div');
  errorMsg.className = 'input-error-msg';
  errorMsg.textContent = message;
  element.parentElement?.appendChild(errorMsg);
}

/**
 * 清除错误提示
 * @param {HTMLElement} element - 元素
 */
function clearError(element) {
  if (!element) return;
  element.classList.remove('input-error');
  const errorMsg = element.parentElement?.querySelector('.input-error-msg');
  if (errorMsg) errorMsg.remove();
}

// 导出
window.validator = {
  validateField,
  validateForm,
  bindInputValidation,
  clearValidation,
  showError,
  clearError,
  rules: VALIDATION_RULES
};

