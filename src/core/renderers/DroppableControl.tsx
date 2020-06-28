/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { ControlProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { ResolvedJsonFormsDispatch } from '@jsonforms/react';
import React from 'react';

import { EditorElement } from '../../editor/components/EditorElement';
import { EditorControl } from '../model/uischema';

interface DroppableControlProps extends ControlProps {
  uischema: EditorControl;
}
const DroppableControl: React.FC<DroppableControlProps> = ({
  uischema,
  schema,
  path,
  renderers,
  cells,
}) => {
  return (
    <EditorElement wrappedElement={uischema}>
      <ResolvedJsonFormsDispatch
        uischema={uischema}
        schema={schema}
        path={path}
        renderers={renderers?.filter(
          (r) => r.renderer !== DroppableControlRenderer
        )}
        cells={cells}
      />
    </EditorElement>
  );
};
const DroppableControlRenderer = DroppableControl;
export const DroppableControlRegistration = {
  tester: rankWith(1000, uiTypeIs('Control')),
  renderer: DroppableControlRenderer,
};
