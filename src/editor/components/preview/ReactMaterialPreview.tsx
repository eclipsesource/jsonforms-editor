/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { createAjv } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import React from 'react';

import { useExportSchema, useExportUiSchema } from '../../../core/util/hooks';
import { previewOptions } from './options';

export const ReactMaterialPreview: React.FC = () => {
  const schema = useExportSchema();
  const uischema = useExportUiSchema();

  const ajv = createAjv(previewOptions);
  return (
    <JsonForms
      ajv={ajv}
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={materialRenderers}
      cells={materialCells}
    />
  );
};
