/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
module.exports = {
  // prettier must always be the last entry to ensure all rules are compatible
  extends: ['react-app', 'prettier'],
  plugins: ['header', 'simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // use sorting of simple-import-sort and disable others
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/sort': 'error',
    // header
    'header/header': [
      2,
      'block',
      [
        '*',
        ' * ---------------------------------------------------------------------',
        ' * Copyright (c) 2021 EclipseSource Munich',
        ' * Licensed under MIT',
        ' * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE',
        ' * ---------------------------------------------------------------------',
        ' ',
      ],
    ],
  },
};
