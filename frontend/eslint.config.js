import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node, // Node.js globals
        vi: 'readonly', // Vitest global
        describe: 'readonly', // Jest/Vitest global
        beforeEach: 'readonly', // Jest/Vitest global
        it: 'readonly', // Jest/Vitest global
        expect: 'readonly', // Jest/Vitest global
        test: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off', // Disable the unknown property rule
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': [
        'error',
        {
          vars: 'all', // Check all variables
          args: 'after-used', // Only check arguments after they are used
          ignoreRestSiblings: true, // Ignore rest siblings
          varsIgnorePattern: '^_|React', // Ignore variables starting with _ and React
        },
      ],
    },
  },
];
