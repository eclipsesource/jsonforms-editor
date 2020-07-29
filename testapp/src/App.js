import React from 'react';

import JsonFormsEditor, {
  defaultSchemaDecorators,
  propertySchemaProvider,
} from '@jsonforms/editor';

export const App = () => (
  <JsonFormsEditor
    schemaProviders={[propertySchemaProvider]}
    schemaDecorators={defaultSchemaDecorators}
  />
);

export default App;
