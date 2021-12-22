module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/button-has-type': 'off',
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'arrow-parens': [2, 'as-needed'],
    'no-undef': 'off',
    'max-len': 'off',
  },
};
