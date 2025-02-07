module.exports = {
  testEnvironment: 'jsdom',  // jsdom環境を指定
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',  // TypeScriptもbabel-jestで変換
    '^.+\\.jsx?$': 'babel-jest',  // JSXもbabel-jestで変換
  },
 "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  // transformIgnorePatterns: [
  //   '/node_modules/(?!your-module-name)/',  // 必要なnode_modulesを指定して変換する
  // ],
};
