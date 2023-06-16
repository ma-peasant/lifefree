module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    quotes: [1, 'single'],
    'no-undef': 0,
    semi: 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 0,
    'vue/no-deprecated-slot-attribute': 0,
    'vue/no-deprecated-v-on-native-modifier': 0,
    'prefer-const': 0
    /*  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
     '@typescript-eslint/camelcase': 0,
     '@typescript-eslint/no-explicit-any': 0,
     'no-irregular-whitespace': 2,
     'no-case-declarations': 0,
     
     'eol-last': 1,
     'block-scoped-var': 2,
     'no-dupe-keys': 2,
     'no-extra-semi': 2,
     'no-multiple-empty-lines': [1, { max: 1, maxEOF: 1 }],
     'no-trailing-spaces': 1,
     'semi-spacing': [2, { before: false, after: true }],
     'no-unreachable': 1,
     'space-infix-ops': 1,
     'spaced-comment': 1,
     'no-var': 2,
     'no-multi-spaces': 2,
     'comma-spacing': 1 */
  }
}