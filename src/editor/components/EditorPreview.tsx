/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import React from 'react';

import { useUiSchema } from '../../core/context';
import { buildUiSchema } from '../../core/model/uischema';
import { useExportSchema } from '../../core/util/hooks';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ng-jsonforms': any;
    }
  }
}

export const EditorPreview: React.FC = () => {
  const schema = useExportSchema();
  const editorUISchema = useUiSchema();
  const uiSchema = editorUISchema ? buildUiSchema(editorUISchema) : undefined;

  const inputSchema = JSON.stringify(schema);
  const inputUISchema = JSON.stringify(uiSchema);

  return inputUISchema && inputSchema ? (
    <div>
      <ng-jsonforms
        uischema={inputUISchema}
        schema={inputSchema}
      ></ng-jsonforms>
    </div>
  ) : null;
};
