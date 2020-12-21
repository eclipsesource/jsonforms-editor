/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import React, { useContext } from 'react';

import { PropertiesService } from '../../properties/propertiesService';
import { PaletteService } from '../api/paletteService';
import { SchemaService } from '../api/schemaService';
import { SchemaElement } from '../model';
import { EditorAction } from '../model/actions';
import { EditorUISchemaElement } from '../model/uischema';
import { SelectedElement } from '../selection';

export interface EditorContext {
  schemaService: SchemaService;
  paletteService: PaletteService;
  propertiesService: PropertiesService;
  schema: SchemaElement | undefined;
  uiSchema: EditorUISchemaElement | undefined;
  dispatch: (action: EditorAction) => void;
  selection: SelectedElement;
  setSelection: (selection: SelectedElement) => void;
}

/**We always use a provider so default can be undefined*/
const defaultContext: any = undefined;

export const EditorContextInstance = React.createContext<EditorContext>(
  defaultContext
);

export const useEditorContext = (): EditorContext =>
  useContext(EditorContextInstance);
export interface DrawerContext {
  open: boolean;
  openDrawer: () => void;
}
export const DrawerContextInstance = React.createContext<DrawerContext>(
  defaultContext
);

export const useDrawerContext = (): DrawerContext =>
  useContext(DrawerContextInstance);

export const useGitLabService = (): SchemaService => {
  const { schemaService } = useEditorContext();
  return schemaService;
};

export const useSchema = (): SchemaElement | undefined => {
  const { schema } = useEditorContext();
  return schema;
};

export const useUiSchema = (): EditorUISchemaElement | undefined => {
  const { uiSchema } = useEditorContext();
  return uiSchema;
};

export const useSelection = (): [
  SelectedElement,
  (selection: SelectedElement) => void
] => {
  const { selection, setSelection } = useEditorContext();
  return [selection, setSelection];
};

export const useDispatch = (): ((action: EditorAction) => void) => {
  const { dispatch } = useEditorContext();
  return dispatch;
};

export const usePaletteService = (): PaletteService => {
  const { paletteService } = useEditorContext();
  return paletteService;
};

export const usePropertiesService = (): PropertiesService => {
  const { propertiesService } = useEditorContext();
  return propertiesService;
};
