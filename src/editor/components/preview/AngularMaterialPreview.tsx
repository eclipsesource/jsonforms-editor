/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import React from 'react';

import { useExportSchema, useExportUiSchema } from '../../../core/util/hooks';
import { previewOptions } from './options';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ng-jsonforms': any;
    }
  }
}

export const AngularMaterialPreview: React.FC = () => {
  const schema = useExportSchema();
  const uiSchema = useExportUiSchema();

  const inputSchema = JSON.stringify(schema);
  const inputUISchema = JSON.stringify(uiSchema);
  const options = JSON.stringify(previewOptions);

  return inputUISchema && inputSchema ? (
    <div>
      <ng-jsonforms
        options={options}
        schema={inputSchema}
        uischema={inputUISchema}
      ></ng-jsonforms>
    </div>
  ) : null;
};
