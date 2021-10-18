/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  generateEmptyData,
  previewOptions,
  useExportSchema,
  useExportUiSchema,
  useSchema,
} from '@jsonforms/editor';
import React, { useMemo } from 'react';

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
  const editorSchema = useSchema();
  const data = useMemo(
    () => (editorSchema ? generateEmptyData(editorSchema) : {}),
    [editorSchema]
  );
  const inputSchema = JSON.stringify(schema);
  const inputUISchema = JSON.stringify(uiSchema);
  const inputData = JSON.stringify(data);
  const options = JSON.stringify(previewOptions);

  return inputUISchema && inputSchema ? (
    <div>
      <ng-jsonforms
        options={options}
        schema={inputSchema}
        uischema={inputUISchema}
        data={inputData}
      ></ng-jsonforms>
    </div>
  ) : null;
};
