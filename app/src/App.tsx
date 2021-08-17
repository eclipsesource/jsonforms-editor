/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import JsonFormsEditor, {
  defaultSchemaDecorators,
  defaultSchemaProviders,
  ReactMaterialPreview,
} from '@jsonforms/editor/src';
import React from 'react';

import { AngularMaterialPreview } from './components/AngularMaterialPreview';
import { Footer } from './components/Footer';
import { ExampleSchemaService } from './core/schemaService';

const schemaService = new ExampleSchemaService();
export const App = () => (
  <JsonFormsEditor
    schemaService={schemaService}
    schemaProviders={defaultSchemaProviders}
    schemaDecorators={defaultSchemaDecorators}
    previewTabs={[
      { name: 'Preview (React)', Component: ReactMaterialPreview },
      { name: 'Preview (Angular)', Component: AngularMaterialPreview },
    ]}
    footer={Footer}
  />
);
