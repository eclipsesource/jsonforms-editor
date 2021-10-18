/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
export const env = () => {
  const { REACT_APP_DEBUG: DEBUG = 'false', NODE_ENV } = process.env;
  return { NODE_ENV, DEBUG };
};
