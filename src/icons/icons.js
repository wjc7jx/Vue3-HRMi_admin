// src/icons/icons.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      // 默认导入方式为 'component'，这样导入的 SVG 将作为 Vue 组件
      defaultImport: 'component',
      // 运行时导入，使得 SVG 可以在组件中以动态方式使用
      runtimeImport: true,
    }),
  ],
});

// 导入所有 SVG 文件
const svgRequire = import.meta.globEager('./*.svg');

// 这里你可以添加额外的处理语句，但不是必须的

// // 遍历所有导入的 SVG 文件
// Object.keys(svgRequire).forEach((path) => {
//   // svgRequire[path] 是每个 SVG 文件的默认导出，通常是一个包含 SVG 标签的字符串
//   // 你可以在这里进行额外的处理，比如设置 class、style 等
// });
