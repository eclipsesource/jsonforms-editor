/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { Editor } from './Editor';

export interface PreviewTab {
  name: string;
  Component: React.ComponentType;
}

interface EditorPanelProps {
  editorRenderers: JsonFormsRendererRegistryEntry[];
}
export const EditorPanel: React.FC<EditorPanelProps> = ({
  editorRenderers,
}) => {
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Editor
      </Typography>
      <Editor editorRenderers={editorRenderers} />
    </>
  );
};
