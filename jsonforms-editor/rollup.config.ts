/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-import-css';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = require('./package.json');

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [typescript(), css(), json(), visualizer({ open: false })],
  external: [
    ...Object.keys(packageJson.dependencies),
    /^@material-ui\/.*/,
    'react-reflex/styles.css',
    'monaco-editor/esm/vs/editor/editor.api',
    'react-spring/web.cjs',
  ],
};

export default config;
