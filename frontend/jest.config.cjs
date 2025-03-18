module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};