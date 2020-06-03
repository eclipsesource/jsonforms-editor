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

import { useUiSchema } from '../../core/context';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../../core/renderers/DroppableLayout';
import { useExportSchema } from '../../core/util/hooks';
import { EmptyEditor } from './EmptyEditor';

export const Editor: React.FC = () => {
  const schema = useExportSchema();
  const uiSchema = useUiSchema();

  return uiSchema ? (
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uiSchema}
      renderers={[
        ...materialRenderers,
        DroppableHorizontalLayoutRegistration,
        DroppableVerticalLayoutRegistration,
      ]}
      cells={materialCells}
    />
  ) : (
    <EmptyEditor />
  );
};
