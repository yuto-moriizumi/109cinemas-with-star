import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
