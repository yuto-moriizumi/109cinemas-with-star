import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run setup file before running tests
    setupFiles: ['./src/setupTests.ts'],
    environment: 'node', // Explicitly set the environment
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // 出力形式
      // カバレッジ計測対象のファイル
      include: ['src/**/*.ts'],
      // カバレッジ計測対象外のファイル
      exclude: [
        'src/**/*.test.ts', // テストファイル自体は除外
        'src/lambda.ts', // Lambdaハンドラーは現時点では除外 (必要に応じて含める)
        '**/__mocks__/*', // モックファイルを除外
      ],
    },
  },
});
