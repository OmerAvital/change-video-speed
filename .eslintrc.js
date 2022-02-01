module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    indent: ['error', 2],
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': 'off',
    'no-void': 'off',
    'no-param-reassign': 'off',

    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],

    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',

    'import/extensions': ['error', 'never', { json: 'always' }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/webpack.*.ts',
        '**/tailwind.config.js',
        '**/postcss.config.js',
      ],
      optionalDependencies: false,
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
  ],
};
