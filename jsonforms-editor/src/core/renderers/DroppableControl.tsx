/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { ControlProps, isControl, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import { EditableControl } from '../components';
import { EditorControl } from '../model/uischema';

interface DroppableControlProps extends ControlProps {
  uischema: EditorControl;
}
const DroppableControl: React.FC<DroppableControlProps> = ({ uischema }) => {
  return <EditableControl uischema={uischema} />;
};

export const DroppableControlRegistration = {
  tester: rankWith(40, isControl), // less than DroppableElement
  renderer: withJsonFormsControlProps(
    DroppableControl as React.FC<ControlProps>
  ),
};
