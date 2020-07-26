/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
if (process.env.REACT_APP_BUILD_FROM_SOURCE === 'true') {
  module.exports = require('./src/');
} else {
  module.exports = require('./dist/');
}
