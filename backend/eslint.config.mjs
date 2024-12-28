import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // 対象ファイルのパターンを指定
  },
  {
    languageOptions: {
      parser: tsparser, // TypeScript用パーサーを指定
      globals: globals.browser, // グローバル変数の設定
    },
  },
  pluginJs.configs.recommended, // ESLintの推奨設定を拡張
  {
    plugins: { "@typescript-eslint": tseslint, prettier: prettierPlugin }, // PrettierとTypeScript ESLintプラグインを追加
  },
  ...tseslint.configs.recommended, // TypeScript ESLintの推奨設定を拡張
  prettierConfig, // Prettierの設定を追加
  {
    rules: {
      // PrettierのルールをESLintでエラーとして扱う
      "prettier/prettier": "error",
      // その他のカスタムルールの定義
      semi: ["error", "never"], // セミコロンを常に使用
      quotes: ["error", "single"], // シングルクオートを使用
      "no-console": "off", // コンソールの使用を許可（デフォルトは警告）
      "@typescript-eslint/no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }], // 未使用変数の警告
    },
  },
];
