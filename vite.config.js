import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // CSS를 하나의 파일로 번들링하여 미디어 쿼리 순서 보장
    cssMinify: 'esbuild', // esbuild로 CSS 최소화 (더 안정적)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // CSS 파일명 고정으로 캐싱 문제 방지
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'assets/index.[hash].css';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  css: {
    // CSS 후처리 최적화
    postcss: {
      // 미디어 쿼리 순서 유지
      plugins: [],
    },
    // CSS 모듈 비활성화 (전역 CSS 사용)
    modules: {
      generateScopedName: '[local]',
    },
  },
})
