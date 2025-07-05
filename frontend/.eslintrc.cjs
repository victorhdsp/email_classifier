// .eslintrc.cjs
// eslint-disable-next-line @typescript-eslint/no-require-imports
const reactHooks = require('eslint-plugin-react-hooks')

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: [
    'react',
    'jsx-a11y',
    'security',
    'sonarjs',
    'import',
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
    'no-unsanitized',
  ],
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.scss', '*.css'],
      rules: {
        'at-rule-no-unknown': 'off',
      },
    },
  ],
}
