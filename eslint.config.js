import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default tseslint.config(
  // グローバル無視設定
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'build/**',
      'coverage/**',
      'packages/api/undefined/**', // apiパッケージ内の不要なディレクトリ
    ],
  },

  // ルートおよび共通設定 (JSファイル向け)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        es2021: true,
      },
    },
    rules: {
      // 基本的な推奨ルール (ESLint v9では明示的な指定が推奨される場合がある)
      // 'no-unused-vars': 'warn',
      // 'no-console': 'warn',
    },
  },

  // Prettier連携
  eslintPluginPrettierRecommended,

  // packages/api (TypeScript) 設定
  {
    files: ['packages/api/**/*.ts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: ['./packages/api/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // API固有のルール (必要に応じて)
    },
  },

  // packages/front (TypeScript, React) 設定
  {
    // src ディレクトリ内の ts/tsx ファイルのみを対象とする
    files: ['packages/front/src/**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
      // react/recommended は plugin オブジェクトで設定するため不要
      // react-hooks/recommended も plugin オブジェクトで設定
    ],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./packages/front/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, // ブラウザ環境のグローバル変数を有効化
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // React 17+
      // フロントエンド固有のルール (必要に応じて)
      '@typescript-eslint/no-unused-vars': 'warn', // 未使用変数を警告に
    },
  }
);
