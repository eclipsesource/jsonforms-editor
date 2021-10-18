/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { ControlProps, rankWith } from '@jsonforms/core';
import { ResolvedJsonFormsDispatch } from '@jsonforms/react';
import { omit } from 'lodash';
import React, { useMemo } from 'react';

import { EditorElement } from '../../editor/components/EditorElement';
import { EditorControl } from '../model/uischema';

interface DroppableElementProps extends ControlProps {
  uischema: EditorControl;
}
const DroppableElement: React.FC<DroppableElementProps> = ({
  uischema,
  schema,
  path,
  renderers,
  cells,
}) => {
  const editorUiSchema = useMemo(() => omit(uischema, ['rule']), [uischema]);
  return (
    <EditorElement wrappedElement={uischema}>
      <ResolvedJsonFormsDispatch
        uischema={editorUiSchema}
        schema={schema}
        path={path}
        renderers={renderers?.filter(
          (r) => r.renderer !== DroppableElementRenderer
        )}
        cells={cells}
      />
    </EditorElement>
  );
};
const DroppableElementRenderer = DroppableElement;
export const DroppableElementRegistration = {
  tester: rankWith(50, () => true),
  renderer: DroppableElementRenderer,
};
