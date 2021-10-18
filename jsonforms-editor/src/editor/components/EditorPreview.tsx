/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import React from 'react';

import { useExportSchema, useExportUiSchema } from '../../core/util/hooks';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ng-jsonforms': any;
    }
  }
}

export const EditorPreview: React.FC = () => {
  const schema = useExportSchema();
  const uiSchema = useExportUiSchema();

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
