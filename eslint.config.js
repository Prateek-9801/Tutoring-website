// ESLint v9 flat config for HTML/CSS/JS project
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        localStorage: 'readonly',
        pageYOffset: 'readonly',
        innerHeight: 'readonly',
        scrollTo: 'readonly',
      },
    },
    rules: {
      // Possible Problems
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-constant-condition': 'warn',

      // Suggestions
      'no-var': 'warn',
      'prefer-const': 'warn',
      eqeqeq: ['warn', 'always'],
      curly: ['warn', 'all'],
      'no-console': 'off', // Allow console for debugging
    },
  },
  // Disable ESLint rules that conflict with Prettier
  eslintConfigPrettier,
];
