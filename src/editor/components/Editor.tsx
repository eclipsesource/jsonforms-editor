import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../../core/renderers/DroppableLayout';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { useSchema, useUiSchema } from '../../core/context';

import { JsonForms } from '@jsonforms/react';
import React from 'react';
import { Typography } from '@material-ui/core';

export const Editor: React.FC = () => {
  const schema = useSchema();
  const uiSchema = useUiSchema();
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Editor
      </Typography>
      <JsonForms
        data={{}}
        schema={schema?.schema}
        uischema={uiSchema}
        renderers={[
          ...materialRenderers,
          DroppableHorizontalLayoutRegistration,
          DroppableVerticalLayoutRegistration,
        ]}
        cells={materialCells}
      />
    </>
  );
};
