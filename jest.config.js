module.exports = {
    modulePaths: ['<rootDir>'],
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'json'],
    transform: {
        '^.+\\.(js|jsx)?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/src/**/*.test.[jt]s?(x)'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/out/', '<rootDir>/example/'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};

// module.exports = {
//   testEnvironment: 'node',
//   testMatch: [
//       '<rootDir>/**/*.test.(js|jsx|ts|tsx)', '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))'
//   ],
//   transformIgnorePatterns: ['<rootDir>/node_modules/']
// };
