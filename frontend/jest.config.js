module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // 'src'ディレクトリに限定
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**", // カバレッジレポートディレクトリを除外
    "!**/*.config.js", // 設定ファイルを除外
    "!**/_app.tsx", // Next.jsのシステムファイルを除外
    "!**/_document.tsx",
  ],
  // キャッシュを有効にする
  cache: true,
  // 変更されたファイルのみテストする（watchモード時）
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.git/",
    "<rootDir>/coverage/",
  ],
  // 並列実行を最適化
  maxWorkers: "50%", // CPUコアの半分を使用
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          "@babel/preset-typescript",
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
