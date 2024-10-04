const config= {
  preset: "@shelf/jest-mongodb",
  globalSetup: "./src/tests/jest/globalSetup.js",
  globalTeardown: "./src/tests/jest/globalTeardown.js",
  setupFilesAfterEnv: [
    "./src/tests/jest/setupFile.js"]
};

export default config;
