import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from 'path';
import dts from "vite-plugin-dts";
// 注意：导入 package.json 可能在某些环境下有问题，如果构建出错可以考虑删除
// import * as packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    dts({
      include: ["./src/tauri-controls"],
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 为 Vue 添加别名，确保生产构建时能正确解析
      // 这对于解决 "Failed to resolve module specifier 'vue'" 错误很重要
      'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    }
  },
  base: './', // 对于 Tauri 应用，相对路径是正确的
  build: {
    // 移除了 lib 配置，现在构建的是应用
    rollupOptions: {
      // 显式指定入口 HTML 文件，确保 Vite 能正确处理
      input: resolve(__dirname, 'index.html'), // 确保路径正确
      // 如果你的项目不是库，而是应用，通常不需要 external 这些依赖
      // 注释掉 external 配置，让 Vite 将依赖打包进去
      // external: [...Object.keys(packageJson.peerDependencies)],
      // plugins: [terser()], // Vite 默认已集成压缩，通常无需显式配置 terser
      output: {
        // 以下 globals 和 intro 通常在构建库时使用，构建应用时可以注释掉
        /*
        globals: {
          vue: "Vue",
          "@tauri-apps/plugin-os": "pluginOs",
          "tailwind-merge": "tailwindMerge",
          "@tauri-apps/plugin-window": "pluginWindow",
        },
        intro: 'import "./style.css";',
        */
        // plugins: [terser()], // 同上，无需重复配置
      },
    },
  },
  clearScreen: false,
  server: {
    port: 1412,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
}))