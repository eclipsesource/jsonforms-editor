/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { LabelElement, LayoutProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { TextField } from '@material-ui/core';
import React from 'react';

import { useDispatch } from '../context';
import { Actions } from '../model';
import { EditorUISchemaElement } from '../model/uischema';

const DroppableLabel: React.FC<LayoutProps> = (props) => {
  const { uischema } = props;
  const labelElement = uischema as LabelElement & EditorUISchemaElement;
  const dispatch = useDispatch();
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      Actions.updateUISchemaElement(labelElement.uuid, {
        text: event.target.value,
      })
    );
  };
  return (
    <TextField
      id='filled-name'
      label='Label'
      value={labelElement.text ?? ''}
      onChange={handleLabelChange}
      fullWidth
    />
  );
};

export const DroppableLabelRegistration = {
  tester: rankWith(45, uiTypeIs('Label')),
  renderer: withJsonFormsLayoutProps(DroppableLabel),
};
