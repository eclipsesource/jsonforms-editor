/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import JsonFormsEditor, {
  defaultEditorTabs,
  defaultSchemaDecorators,
  defaultSchemaProviders,
} from '@jsonforms/editor';
import React from 'react';

import { AngularMaterialPreview } from './AngularMaterialPreview';

export const App = () => (
  <JsonFormsEditor
    schemaProviders={defaultSchemaProviders}
    schemaDecorators={defaultSchemaDecorators}
    editorTabs={[
      ...defaultEditorTabs,
      { name: 'Preview (Angular)', Component: AngularMaterialPreview },
    ]}
  />
);
