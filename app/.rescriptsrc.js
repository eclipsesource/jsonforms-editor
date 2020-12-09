const {
  appendWebpackPlugin,
  editWebpackPlugin,
  edit,
  getPaths,
} = require('@rescripts/utilities');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const includesAppSrc = (inQuestion) => {
  return (
    inQuestion &&
    inQuestion.include &&
    typeof inQuestion.include.includes === 'function' &&
    inQuestion.include.includes('app/src')
  );
};

const addLibrarySrc = (loader) => {
  loader.include = [
    loader.include,
    loader.include.replace('app/src', 'jsonforms-editor/src'),
  ];
  return loader;
};

const adaptAppSources = () => (config) => {
  const paths = getPaths(includesAppSrc, config);
  return edit(addLibrarySrc, paths, config);
};

const reportTypeCheckOnFilesOutsideOfApp = () => (config) =>
  editWebpackPlugin(
    (plugin) => {
      plugin.reportFiles.unshift('../**');
      return plugin;
    },
    'ForkTsCheckerWebpackPlugin',
    config
  );

const addMonacoPlugin = () => (config) =>
  appendWebpackPlugin(
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json'],
    }),
    config
  );

module.exports = [
  addMonacoPlugin(),
  adaptAppSources(),
  reportTypeCheckOnFilesOutsideOfApp(),
];
