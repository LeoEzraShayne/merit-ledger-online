/**
 * 功过格 App - 弹窗系统
 * Modal System for GongGuoGe App
 */

// 弹窗容器 ID
const MODAL_CONTAINER_ID = "modal-container";

// 创建弹窗容器
function ensureModalContainer() {
  let container = document.getElementById(MODAL_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = MODAL_CONTAINER_ID;
    document.body.appendChild(container);
  }
  return container;
}

// 基础弹窗模板
function createModalHTML(id, content, options = {}) {
  const { showClose = true, clickOutsideToClose = true } = options;

  return `
    <div id="${id}" class="modal-overlay" data-click-outside="${clickOutsideToClose}">
      <div class="modal-content">
        ${
          showClose
            ? `
          <button class="modal-close" data-action="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        `
            : ""
        }
        ${content}
      </div>
    </div>
  `;
}

// 显示弹窗
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
  }
}

// 隐藏弹窗
function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("show");
    // 动画结束后移除
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// 隐藏所有弹窗
function hideAllModals() {
  document.querySelectorAll(".modal-overlay.show").forEach((modal) => {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  });
}

// 绑定弹窗事件
function bindModalEvents(id, callbacks = {}) {
  const modal = document.getElementById(id);
  if (!modal) return;

  // 点击遮罩关闭
  if (modal.dataset.clickOutside === "true") {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal(id);
        callbacks.onClose?.();
      }
    });
  }

  // 关闭按钮
  modal.querySelectorAll('[data-action="close"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      hideModal(id);
      callbacks.onClose?.();
    });
  });

  // 自定义动作
  modal.querySelectorAll("[data-action]").forEach((btn) => {
    const action = btn.dataset.action;
    if (action !== "close" && callbacks[action]) {
      btn.addEventListener("click", () => callbacks[action]());
    }
  });
}

/* ===== 1. 登录弹窗 ===== */
function showLoginModal(callbacks = {}) {
  const id = "login-modal";
  const t = window.i18n?.t || ((k) => k);

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("login.title")}</h2>
    </div>
    <div class="modal-body">
      <div class="login-tabs">
        <button class="login-tab active" data-tab="email">${t(
          "login.email"
        )}</button>
        <button class="login-tab" data-tab="third">${t(
          "login.thirdParty"
        )}</button>
      </div>
      
      <div class="login-panel active" data-panel="email">
        <div class="form-group">
          <label>${t("login.email")}</label>
          <input type="email" class="input" id="login-email" placeholder="${t(
            "login.emailPlaceholder"
          )}">
        </div>
        <button class="btn btn-primary btn-block" id="send-code-btn">${t(
          "login.sendCode"
        )}</button>
      </div>
      
      <div class="login-panel" data-panel="third">
        <div class="third-party-grid" id="third-party-buttons">
          <!-- Only Google Sign-In is visible; other providers are kept in code but hidden for future use -->
          <button class="third-party-btn" data-provider="google">
            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content);

  // 根据市场配置显示/隐藏第三方登录按钮
  updateThirdPartyButtons(id);

  // 绑定事件
  bindModalEvents(id, callbacks);

  // Tab 切换
  const modal = document.getElementById(id);
  modal.querySelectorAll(".login-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      modal
        .querySelectorAll(".login-tab")
        .forEach((t) => t.classList.remove("active"));
      modal
        .querySelectorAll(".login-panel")
        .forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      modal
        .querySelector(`[data-panel="${tab.dataset.tab}"]`)
        .classList.add("active");
    });
  });

  // 邮箱输入框验证（实时验证）
  const emailInput = modal.querySelector("#login-email");
  if (window.validator && emailInput) {
    // 实时验证：输入时自动验证，显示错误提示
    window.validator.bindInputValidation(emailInput, "email");
  }

  // 发送验证码
  modal.querySelector("#send-code-btn").addEventListener("click", async () => {
    const email = emailInput.value.trim();

    // 验证邮箱
    if (window.validator) {
      const emailResult = window.validator.validateField(email, "email");
      if (!emailResult.valid) {
        window.validator.showError(emailInput, emailResult.message);
        return;
      }
      window.validator.clearError(emailInput);
    } else {
      // 降级验证
      if (!email) {
        alert("请输入邮箱");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("请输入有效的邮箱地址");
        return;
      }
    }

    const btn = modal.querySelector("#send-code-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "发送中...";

    let receivedCode = null; // 存储接收到的验证码

    try {
      if (window.api) {
        const result = await window.api.sendCode(email);
        if (result.success) {
          // 开发环境下保存验证码
          if (result.code) {
            receivedCode = result.code;
          }
          hideModal(id);
          showEmailCodeModal({ email, code: receivedCode, ...callbacks });
        } else {
          alert(result.message || "发送失败");
        }
      } else {
        // 降级：直接显示验证码弹窗
        hideModal(id);
        showEmailCodeModal({ email, ...callbacks });
      }
    } catch (error) {
      alert(error.message || "发送验证码失败");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  // 第三方登录
  modal.querySelectorAll(".third-party-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const provider = btn.dataset.provider;
      btn.disabled = true;

      try {
        // 调用第三方登录
        await handleThirdPartyLogin(provider, callbacks);
      } catch (error) {
        console.error("第三方登录失败:", error);
        alert(error.message || "第三方登录失败，请重试");
      } finally {
        btn.disabled = false;
      }
    });
  });

  showModal(id);
}

/* ===== 2. 邮箱验证码弹窗 ===== */
function showEmailCodeModal(options = {}) {
  const id = "email-code-modal";
  const t = window.i18n?.t || ((k) => k);
  const { email, code } = options;

  // 开发环境下显示验证码提示
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168");

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("login.code")}</h2>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${t("login.sendCodeSuccess")}</p>
      <p class="modal-email">${email}</p>
      
      ${
        isDev && code
          ? `
        <div class="dev-code-hint" style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 12px; margin: 12px 0; text-align: center;">
          <div style="font-size: 12px; color: #856404; margin-bottom: 4px;">开发环境验证码：</div>
          <div style="font-size: 24px; font-weight: bold; color: #856404; letter-spacing: 4px;">${code}</div>
        </div>
      `
          : ""
      }
      
      <div class="code-inputs-wrapper">
        <div class="code-inputs">
          <input type="text" maxlength="1" class="code-input" data-index="0" inputmode="numeric" pattern="[0-9]*">
          <input type="text" maxlength="1" class="code-input" data-index="1" inputmode="numeric" pattern="[0-9]*">
          <input type="text" maxlength="1" class="code-input" data-index="2" inputmode="numeric" pattern="[0-9]*">
          <input type="text" maxlength="1" class="code-input" data-index="3" inputmode="numeric" pattern="[0-9]*">
          <input type="text" maxlength="1" class="code-input" data-index="4" inputmode="numeric" pattern="[0-9]*">
          <input type="text" maxlength="1" class="code-input" data-index="5" inputmode="numeric" pattern="[0-9]*">
        </div>
        <div class="code-error-msg" id="code-error-msg" style="display: none;"></div>
      </div>
      
      <button class="btn btn-primary btn-block" id="verify-code-btn">${t(
        "login.verify"
      )}</button>
      <button class="btn btn-ghost btn-block" id="resend-btn">${t(
        "login.resend"
      )}</button>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content);

  bindModalEvents(id, options);

  const modal = document.getElementById(id);

  // 验证码输入框自动跳转和验证
  const codeInputs = modal.querySelectorAll(".code-input");
  codeInputs.forEach((input, index) => {
    // 只允许输入数字
    input.addEventListener("input", (e) => {
      const value = e.target.value.replace(/\D/g, ""); // 只保留数字
      e.target.value = value ? value[0] : ""; // 只保留第一个数字

      // 验证单个输入框
      if (window.validator) {
        const result = window.validator.validateField(value, "code", {
          minLength: 1,
          maxLength: 1,
          pattern: /^\d$/,
        });
        if (!result.valid && value) {
          window.validator.showError(input, "请输入数字");
        } else {
          window.validator.clearError(input);
        }
      }

      // 自动跳转到下一个输入框
      if (value && index < 5) {
        codeInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      // 阻止非数字输入
      if (
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Tab" &&
        !e.key.match(/^\d$/) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
      }

      // Backspace 处理
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        codeInputs[index - 1].focus();
        codeInputs[index - 1].value = "";
      }
    });

    // 粘贴处理
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pastedData = (e.clipboardData || window.clipboardData).getData(
        "text"
      );
      const numbers = pastedData.replace(/\D/g, "").slice(0, 6);

      if (numbers.length > 0) {
        numbers.split("").forEach((num, i) => {
          if (index + i < 6) {
            codeInputs[index + i].value = num;
          }
        });
        // 聚焦到最后一个填充的输入框
        const lastIndex = Math.min(index + numbers.length - 1, 5);
        codeInputs[lastIndex].focus();
      }
    });
  });

  // 验证
  modal
    .querySelector("#verify-code-btn")
    .addEventListener("click", async () => {
      const code = Array.from(codeInputs)
        .map((i) => i.value)
        .join("");

      // 验证验证码
      const codeErrorMsg = modal.querySelector("#code-error-msg");

      if (window.validator) {
        const codeResult = window.validator.validateField(code, "code");
        if (!codeResult.valid) {
          // 显示错误提示（在输入框下方）
          if (codeErrorMsg) {
            codeErrorMsg.textContent = codeResult.message;
            codeErrorMsg.style.display = "block";
          }
          // 高亮所有输入框
          codeInputs.forEach((input) => {
            input.classList.add("input-error");
          });
          codeInputs[0].focus();
          return;
        }
        // 验证通过，清除错误
        if (codeErrorMsg) {
          codeErrorMsg.style.display = "none";
        }
        codeInputs.forEach((input) => {
          input.classList.remove("input-error");
        });
      } else {
        // 降级验证
        if (code.length !== 6) {
          if (codeErrorMsg) {
            codeErrorMsg.textContent = "请输入6位验证码";
            codeErrorMsg.style.display = "block";
          }
          codeInputs[0].focus();
          return;
        }
        if (!/^\d{6}$/.test(code)) {
          if (codeErrorMsg) {
            codeErrorMsg.textContent = "验证码必须是6位数字";
            codeErrorMsg.style.display = "block";
          }
          codeInputs[0].focus();
          return;
        }
        // 验证通过
        if (codeErrorMsg) {
          codeErrorMsg.style.display = "none";
        }
      }

      const btn = modal.querySelector("#verify-code-btn");
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "验证中...";

      try {
        if (window.api) {
          const result = await window.api.login(email, code);
          if (result.success && result.data) {
            hideModal(id);
            // 触发登录成功回调
            options.onSuccess?.(result.data.user);
            // 初始化数据同步
            if (window.store && window.store.init) {
              await window.store.init();
            }
          } else {
            alert(result.message || "验证失败");
          }
        } else {
          // 降级：模拟登录
          const user = window.store?.mockLogin(email);
          hideModal(id);
          options.onSuccess?.(user);
        }
      } catch (error) {
        alert(error.message || "验证失败");
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });

  // 重发验证码
  modal.querySelector("#resend-btn").addEventListener("click", async () => {
    const btn = modal.querySelector("#resend-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "发送中...";

    try {
      if (window.api) {
        const result = await window.api.sendCode(email);
        if (result.success) {
          alert("验证码已重新发送");
        } else {
          alert(result.message || "发送失败");
        }
      }
    } catch (error) {
      alert(error.message || "发送失败");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  showModal(id);
}

/* ===== 3. 绑定邮箱弹窗 ===== */
function showBindEmailModal(options = {}) {
  const id = "bind-email-modal";
  const t = window.i18n?.t || ((k) => k);

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("login.bindEmailTitle")}</h2>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${t("login.bindEmailDesc")}</p>
      
      <div class="form-group">
        <label>${t("login.email")}</label>
        <input type="email" class="input" id="bind-email" placeholder="${t(
          "login.emailPlaceholder"
        )}">
      </div>
      
      <button class="btn btn-primary btn-block" data-action="bind">${t(
        "login.bindNow"
      )}</button>
      <button class="btn btn-ghost btn-block" data-action="later">${t(
        "login.bindLater"
      )}</button>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content, {
    clickOutsideToClose: false,
  });

  // 邮箱输入框验证
  const bindEmailInput = document.getElementById("bind-email");
  if (window.validator && bindEmailInput) {
    window.validator.bindInputValidation(bindEmailInput, "email");
  }

  bindModalEvents(id, {
    bind: () => {
      const email = bindEmailInput.value.trim();

      // 验证邮箱
      if (window.validator) {
        const emailResult = window.validator.validateField(email, "email");
        if (!emailResult.valid) {
          window.validator.showError(bindEmailInput, emailResult.message);
          return;
        }
        window.validator.clearError(bindEmailInput);
      } else {
        if (!email) {
          alert("请输入邮箱");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("请输入有效的邮箱地址");
          return;
        }
      }

      if (email) {
        hideModal(id);
        options.onSuccess?.();
      }
    },
    later: () => {
      hideModal(id);
      options.onSuccess?.();
    },
    ...options,
  });

  showModal(id);
}

/* ===== 4. 登录提示弹窗 ===== */
function showLoginRequiredModal(options = {}) {
  const id = "login-required-modal";
  const t = window.i18n?.t || ((k) => k);
  const { messageType = "recordLimit" } = options;

  const messages = {
    recordLimit: t("loginRequired.message.recordLimit"),
    monument: t("loginRequired.message.monument"),
    detail: t("loginRequired.message.detail"),
  };

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("loginRequired.title")}</h2>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${messages[messageType]}</p>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="later">${t(
          "loginRequired.later"
        )}</button>
        <button class="btn btn-primary" data-action="login">${t(
          "loginRequired.goLogin"
        )}</button>
      </div>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content);

  bindModalEvents(id, {
    later: () => {
      hideModal(id);
      options.onLater?.();
    },
    login: () => {
      hideModal(id);
      showLoginModal(options);
    },
    ...options,
  });

  showModal(id);
}

/* ===== 5. 删除记录确认弹窗 ===== */
function showDeleteRecordModal(options = {}) {
  const id = "delete-record-modal";
  const t = window.i18n?.t || ((k) => k);

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("delete.recordTitle")}</h2>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${t("delete.recordText")}</p>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">${t(
          "delete.cancel"
        )}</button>
        <button class="btn btn-danger" data-action="confirm">${t(
          "delete.confirm"
        )}</button>
      </div>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content);

  bindModalEvents(id, {
    cancel: () => {
      hideModal(id);
      options.onCancel?.();
    },
    confirm: () => {
      hideModal(id);
      options.onConfirm?.();
    },
    ...options,
  });

  showModal(id);
}

/* ===== 6. 删除账号确认弹窗 ===== */
function showDeleteAccountModal(options = {}) {
  const id = "delete-account-modal";
  const t = window.i18n?.t || ((k) => k);

  const content = `
    <div class="modal-header">
      <h2 class="modal-title">${t("delete.accountTitle")}</h2>
    </div>
    <div class="modal-body">
      <p class="modal-desc modal-warning">${t("delete.accountText")}</p>
      
      <div class="form-group">
        <label>${t("delete.accountConfirm")}</label>
        <input type="text" class="input" id="delete-confirm-input" placeholder="DELETE">
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">${t(
          "delete.cancel"
        )}</button>
        <button class="btn btn-danger" data-action="confirm" id="delete-account-btn" disabled>${t(
          "delete.confirm"
        )}</button>
      </div>
    </div>
  `;

  const container = ensureModalContainer();
  container.innerHTML = createModalHTML(id, content, {
    clickOutsideToClose: false,
  });

  const modal = document.getElementById(id);
  const input = modal.querySelector("#delete-confirm-input");
  const confirmBtn = modal.querySelector("#delete-account-btn");

  // 输入框验证（只保留一次）
  if (window.validator && input) {
    window.validator.bindInputValidation(input, "deleteConfirm", {
      message: "请输入 DELETE 确认删除",
    });
  }

  input.addEventListener("input", () => {
    const value = input.value.trim();
    confirmBtn.disabled = value !== "DELETE";
  });

  bindModalEvents(id, {
    cancel: () => {
      hideModal(id);
      options.onCancel?.();
    },
    confirm: () => {
      const value = input.value.trim();

      // 验证（实时验证已绑定，这里只做最终检查）
      if (window.validator) {
        const result = window.validator.validateField(value, "deleteConfirm");
        if (!result.valid) {
          // 显示错误提示（输入框下方）
          window.validator.showError(input, result.message);
          input.focus();
          return;
        }
        // 验证通过，清除错误
        window.validator.clearError(input);
      } else {
        if (value !== "DELETE") {
          alert("请输入 DELETE 确认删除");
          return;
        }
      }

      if (value === "DELETE") {
        hideModal(id);
        options.onConfirm?.();
      }
    },
    ...options,
  });

  showModal(id);
}

// 弹窗样式
const modalStyles = `
<style>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  padding: 20px;
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 320px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  transition: transform var(--transition-normal) cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity var(--transition-normal);
  box-shadow: 0 20px 60px var(--color-shadow-dark);
}

.modal-overlay.show .modal-content {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-border-light);
  color: var(--color-text);
}

.modal-header {
  padding: 24px 24px 0;
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 1px;
}

.modal-body {
  padding: 20px 24px 24px;
}

.modal-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6;
}

.modal-warning {
  color: var(--color-accent-red);
}

.modal-email {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions .btn {
  flex: 1;
}

/* 登录 Tab */
.login-tabs {
  display: flex;
  gap: 0;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 20px;
}

.login-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: calc(var(--radius-md) - 2px);
  transition: all var(--transition-normal);
}

.login-tab.active {
  background: var(--color-bg-card);
  color: var(--color-text);
  box-shadow: 0 2px 4px var(--color-shadow-dark);
}

.login-panel {
  display: none;
}

.login-panel.active {
  display: block;
}

/* 第三方登录 */
.third-party-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.third-party-btn {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.third-party-btn:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

/* 验证码输入 */
.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.code-input {
  width: 40px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  font-family: inherit;
}

.code-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-shadow);
}

/* 表单 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}
</style>
`;

// 注入样式
function injectModalStyles() {
  if (!document.getElementById("modal-styles")) {
    const styleEl = document.createElement("div");
    styleEl.id = "modal-styles";
    styleEl.innerHTML = modalStyles;
    document.head.appendChild(styleEl.querySelector("style"));
  }
}

// 初始化
function initModals() {
  injectModalStyles();
}

// 导出
window.modals = {
  showModal,
  hideModal,
  hideAllModals,
  showLoginModal,
  showEmailCodeModal,
  showBindEmailModal,
  showLoginRequiredModal,
  showDeleteRecordModal,
  showDeleteAccountModal,
  initModals,
};

/**
 * 处理第三方登录
 * Refactored: Only Google Sign-In is currently supported; other providers are disabled
 * @param {string} provider - 登录提供商 (currently only 'google' is supported)
 * @param {object} callbacks - 回调函数
 */
async function handleThirdPartyLogin(provider, callbacks = {}) {
  // Only Google is enabled; other providers will be rejected
  if (provider !== "google") {
    throw new Error(`不支持的登录方式: ${provider}. 仅支持 Google 登录`);
  }
  // 检查是否在Android WebView中
  if (
    window.AndroidBridge &&
    typeof window.AndroidBridge.thirdPartyLogin === "function"
  ) {
    // Android端处理
    try {
      const result = JSON.parse(window.AndroidBridge.thirdPartyLogin(provider));
      if (!result.success) {
        throw new Error(result.error || "第三方登录失败");
      }

      // Android端会通过回调返回token和用户信息
      // 等待Android端的回调
      return new Promise((resolve, reject) => {
        window._pendingThirdPartyLogin = {
          resolve: (token, userData) => {
            // 调用后端API完成登录
            completeThirdPartyLogin(provider, token, userData, callbacks)
              .then(resolve)
              .catch(reject);
          },
          reject,
          provider,
        };
      });
    } catch (error) {
      console.error("Android第三方登录失败:", error);
      throw error;
    }
  }

  // Web端处理
  try {
    // 对于Web端，需要实现OAuth流程
    // 这里先实现一个简化版本，实际需要：
    // 1. 跳转到第三方授权页面
    // 2. 获取授权码
    // 3. 用授权码换取token
    // 4. 调用后端API登录

    // Web端第三方登录（需要配置相应的OAuth客户端）
    // 注意：Web端实现较复杂，建议优先使用Android端
    alert(`${provider} 登录功能在Web端暂未实现，请在Android应用中使用`);
  } catch (error) {
    console.error("第三方登录失败:", error);
    throw error;
  }
}

/**
 * Google登录（Web端）
 */
async function handleGoogleLogin(callbacks = {}) {
  // 确保配置已加载
  if (typeof window !== "undefined" && window.ensureConfigLoaded) {
    await window.ensureConfigLoaded();
  } else if (!window.GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID 未配置，无法使用 Google 登录功能");
  }

  // 使用Google Sign-In API
  // 需要先加载Google Sign-In库
  if (typeof gapi === "undefined") {
    // 动态加载Google Sign-In库
    await loadGoogleSignIn();
  }

  // 初始化Google Sign-In
  await new Promise((resolve, reject) => {
    if (!window.GOOGLE_CLIENT_ID) {
      reject(new Error("Google Client ID 未配置"));
      return;
    }

    gapi.load("auth2", () => {
      gapi.auth2
        .init({
          client_id: window.GOOGLE_CLIENT_ID,
        })
        .then(resolve)
        .catch(reject);
    });
  });

  // 发起登录
  const authInstance = gapi.auth2.getAuthInstance();
  const googleUser = await authInstance.signIn();
  const idToken = googleUser.getAuthResponse().id_token;
  const profile = googleUser.getBasicProfile();

  // 调用后端API
  const response = await fetch(
    `${window.api.config.BASE_URL}/api/auth/third-party`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        idToken: idToken,
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl(),
      }),
    }
  );

  const data = await response.json();

  if (data.success) {
    // 保存token
    localStorage.setItem("ggg_auth_token", data.data.token);

    // 更新用户信息
    if (window.store) {
      window.store.setUser(data.data.user);
    }

    // 触发登录成功回调
    callbacks.onSuccess && callbacks.onSuccess(data.data);

    // 关闭弹窗
    hideAllModals();
  } else {
    throw new Error(data.message || "登录失败");
  }
}

/**
 * 加载Google Sign-In库
 */
function loadGoogleSignIn() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="accounts.google.com"]')) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 完成第三方登录（调用后端API）
 */
async function completeThirdPartyLogin(
  provider,
  idToken,
  userData,
  callbacks = {}
) {
  try {
    const response = await fetch(
      `${window.api.config.BASE_URL}/api/auth/third-party`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: provider,
          idToken: idToken,
          name: userData.name || null,
          email: userData.email || null,
          avatar: userData.avatar || null,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      // 保存token
      localStorage.setItem("ggg_auth_token", data.data.token);

      // 更新用户信息
      if (window.store) {
        window.store.setUser(data.data.user);
      }

      // 触发登录成功回调
      callbacks.onSuccess && callbacks.onSuccess(data.data);

      // 关闭弹窗
      hideAllModals();

      return data.data;
    } else {
      throw new Error(data.message || "登录失败");
    }
  } catch (error) {
    console.error("第三方登录失败:", error);
    throw error;
  }
}

// Android端第三方登录回调
window.onThirdPartyLoginSuccess = function (token, userData) {
  if (window._pendingThirdPartyLogin) {
    // userData 可能是字符串（JSON）或对象
    let userDataObj = userData;
    if (typeof userData === "string") {
      try {
        userDataObj = JSON.parse(userData);
      } catch (e) {
        console.error("解析用户数据失败:", e);
        userDataObj = {};
      }
    }

    // 调用 resolve，它会触发 completeThirdPartyLogin
    if (window._pendingThirdPartyLogin.resolve) {
      window._pendingThirdPartyLogin.resolve(token, userDataObj);
    }
    window._pendingThirdPartyLogin = null;
  }
};

window.onThirdPartyLoginError = function (error) {
  if (window._pendingThirdPartyLogin) {
    window._pendingThirdPartyLogin.reject(new Error(error));
    window._pendingThirdPartyLogin = null;
  }
};

/**
 * 根据市场配置更新第三方登录按钮显示
 * Refactored: Only Google Sign-In is visible; other providers are disabled
 */
function updateThirdPartyButtons(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const buttonsContainer = modal.querySelector("#third-party-buttons");
  if (!buttonsContainer) return;

  // Only show Google Sign-In button
  // Other providers (WeChat, QQ, Facebook, X, Line) are kept in code but hidden for future use
  buttonsContainer.querySelectorAll(".third-party-btn").forEach((btn) => {
    const provider = btn.dataset.provider;
    if (provider === "google") {
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  });

  // If no Google button is found, hide the entire panel
  const googleButton = buttonsContainer.querySelector(
    '[data-provider="google"]'
  );
  if (!googleButton || googleButton.style.display === "none") {
    const thirdPanel = modal.querySelector('[data-panel="third"]');
    if (thirdPanel) {
      thirdPanel.style.display = "none";
    }
  }
}
