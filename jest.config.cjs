module.exports = {
  // Use the preset for MongoDB integration with Jest
  preset: "@shelf/jest-mongodb",

  // Paths for custom global setup and teardown scripts
  globalSetup: "./tests/jest/globalSetup.js",
  globalTeardown: "./tests/jest/globalTeardown.js",

  setupFiles: ["./tests/jest/setupEnv.js"],

  // File(s) that will be executed after the environment is set up
  setupFilesAfterEnv: [
    "./tests/jest/setupFile.js"
  ],

  // Additional Jest configuration settings
  testEnvironment: 'node', // Ensures Jest uses the correct environment for Express apps
  verbose: true, // Enables detailed test reporting
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // List of file extensions for modules
  testMatch: ['**/tests/**/*.test.js'], // Pattern to match test files
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // Babel transformation for JavaScript/TypeScript files
  }
};
