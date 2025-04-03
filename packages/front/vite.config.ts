/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import zipPack from 'vite-plugin-zip-pack';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), zipPack()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // 出力形式
      // 必要に応じて include/exclude を設定
      include: ['src/**/*.{ts,tsx}'], // Explicitly include src files
      exclude: [
        'src/setupTests.ts', // Exclude setup file
        'src/**/*.test.{ts,tsx}', // Exclude test files
        'src/mocks/**', // Exclude mocks directory
        // Add other patterns if needed, e.g., 'src/vite-env.d.ts'
      ],
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true, // ビルド前にdistを空にする
    rollupOptions: {
      input: {
        // content scriptのエントリーポイント
        index: resolve(__dirname, 'src/index.tsx'),
      },
      output: {
        entryFileNames: '[name].js', // 出力ファイル名を index.js に固定
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // index.html を生成しない
    // manifest.json は public ディレクトリからコピーされる
    // manifest: false, // Deprecated in Vite 5, use build.rollupOptions.output.assetFileNames instead if needed for assets
    copyPublicDir: true, // public ディレクトリをコピーする (デフォルトtrue)
  },
});
