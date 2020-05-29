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
import { Typography } from '@material-ui/core';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch, useUiSchema } from '../../core/context';
import { UI_SCHEMA_ELEMENT } from '../../core/dnd';
import { Actions } from '../../core/model';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../../core/renderers/DroppableLayout';
import { useExportSchema } from '../../core/util/hooks';
const NoUISchemaComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [{ isOver, uiSchemaElement }, drop] = useDrop({
    accept: UI_SCHEMA_ELEMENT,
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      uiSchemaElement: mon.getItem()?.uiSchemaElement,
    }),
    drop: (): any => {
      dispatch(Actions.setUiSchema(uiSchemaElement));
    },
  });
  return (
    <Typography
      ref={drop}
      style={{
        padding: 10,
        fontSize: isOver ? '1.1em' : '1em',
        border: isOver ? '1px solid #D3D3D3' : 'none',
      }}
      data-cy={`nolayout-drop`}
    >
      Drag and drop a layout element to begin.
    </Typography>
  );
};
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
    <NoUISchemaComponent />
  );
};
