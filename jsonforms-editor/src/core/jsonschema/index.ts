/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import rule from './specification/rule.json';
import schema from './specification/schema.json';

interface SchemaInformation {
  uri: string;
  schema: any;
}

export const jsonSchemaDraft7 = {
  uri: 'http://json-schema.org/draft-07/schema',
  schema: schema,
};

export const ruleSchema = {
  uri: 'http://jsonforms.io/uischema/rule',
  schema: rule,
};
