/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import React from 'react';

import { useExportSchema, useExportUiSchema } from '../../../core/util/hooks';

export const ReactMaterialPreview: React.FC = () => {
  const schema = useExportSchema();
  const uischema = useExportUiSchema();

  return (
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={materialRenderers}
      cells={materialCells}
    />
  );
};
