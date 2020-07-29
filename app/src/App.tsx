/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import JsonFormsEditor, {
  defaultSchemaDecorators,
  propertySchemaProvider,
} from '@jsonforms/editor/src';
import React from 'react';

export const App = () => (
  <JsonFormsEditor
    schemaProviders={[propertySchemaProvider]}
    schemaDecorators={defaultSchemaDecorators}
  />
);
