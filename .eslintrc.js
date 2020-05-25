module.exports = {
  // prettier must always be the last entry to ensure all rules are compatible
  extends: ['react-app', 'prettier'],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    // use sorting of simple-import-sort and disable others
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/sort': 'error',
  },
};
