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

const addLibrarySrcInBabelLoader = () => (config) => {
  const babelLoaderPaths = getPaths(isBabelLoader, config);
  return edit(addLibrarySrc, babelLoaderPaths, config);
};

module.exports = [
  appendWebpackPlugin(
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json'],
    })
  ),
  addLibrarySrcInBabelLoader(),
];
