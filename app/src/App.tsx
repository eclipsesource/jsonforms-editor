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

export const App = () => (
  <JsonFormsEditor
    schemaProviders={defaultSchemaProviders}
    schemaDecorators={defaultSchemaDecorators}
    editorTabs={[
      { name: 'Preview (React)', Component: ReactMaterialPreview },
      { name: 'Preview (Angular)', Component: AngularMaterialPreview },
    ]}
    footer={Footer}
  />
);
