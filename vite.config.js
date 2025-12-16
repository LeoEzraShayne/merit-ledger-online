import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0", // 监听所有网络接口，允许局域网访问
    port: 5173,
    strictPort: false, // 如果端口被占用，自动尝试下一个端口
  },

  // 构建配置
  build: {
    rollupOptions: {
      // 多页面应用：构建所有 HTML 文件
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "home.html"),
        record: resolve(__dirname, "record.html"),
        calendar: resolve(__dirname, "calendar.html"),
        today_list: resolve(__dirname, "today_list.html"),
        day_detail: resolve(__dirname, "day_detail.html"),
        monument: resolve(__dirname, "monument.html"),
        settings: resolve(__dirname, "settings.html"),
        about: resolve(__dirname, "about.html"),
        splash: resolve(__dirname, "splash.html"),
        "terms-of-service": resolve(__dirname, "terms-of-service.html"),
        "terms-of-service-en": resolve(__dirname, "terms-of-service-en.html"),
        "terms-of-service-ja": resolve(__dirname, "terms-of-service-ja.html"),
        "privacy-policy": resolve(__dirname, "privacy-policy.html"),
        "privacy-policy-en": resolve(__dirname, "privacy-policy-en.html"),
        "privacy-policy-ja": resolve(__dirname, "privacy-policy-ja.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          // CSS 文件保持原样
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
