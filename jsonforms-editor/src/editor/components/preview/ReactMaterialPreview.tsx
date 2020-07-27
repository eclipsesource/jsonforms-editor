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
import React, { useMemo } from 'react';

import { generateEmptyData } from '../../../core/model';
import { useExportSchema, useExportUiSchema } from '../../../core/util/hooks';
import { previewOptions } from './options';

export const ReactMaterialPreview: React.FC = () => {
  const schema = useExportSchema();
  const uischema = useExportUiSchema();
  const previewData = useMemo(() => generateEmptyData(schema), [schema]);
  const ajv = createAjv(previewOptions);
  return (
    <JsonForms
      ajv={ajv}
      data={previewData}
      schema={schema}
      uischema={uischema}
      renderers={materialRenderers}
      cells={materialCells}
    />
  );
};
