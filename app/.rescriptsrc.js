const { appendWebpackPlugin, edit, getPaths } = require('@rescripts/utilities');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const isBabelLoader = (inQuestion) =>
  inQuestion &&
  inQuestion.loader &&
  inQuestion.loader.includes('babel-loader') &&
  inQuestion.include &&
  inQuestion.include.includes('app');

const addLibrarySrc = (babelLoader) => {
  babelLoader.include = [
    babelLoader.include,
    babelLoader.include.replace('app/src', 'jsonforms-editor/src'),
  ];
  return babelLoader;
};

const addLibrarySrcWhenSpecified = () => (config) => {
  if (process.env.REACT_APP_BUILD_FROM_SOURCE === 'true') {
    const babelLoaderPaths = getPaths(isBabelLoader, config);
    return edit(addLibrarySrc, babelLoaderPaths, config);
  }
  return config;
};

module.exports = [
  appendWebpackPlugin(
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json'],
    })
  ),
  addLibrarySrcWhenSpecified(),
];
