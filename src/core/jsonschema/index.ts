/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import schema from './specification/schema.json';

interface SchemaInformation {
  uri: string;
  schema: any;
}

export const jsonSchemaDraft7 = {
  uri: 'http://json-schema.org/draft-07/schema',
  schema: schema,
};
