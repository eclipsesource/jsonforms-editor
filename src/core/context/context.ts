import React, { useContext } from 'react';

import { EditorAction } from '../model/actions';
import { LinkedUISchemaElement } from '../model/uischema';
import { SchemaElement } from '../model';
import { SchemaService } from '../api/schemaService';
import { SelectedElement } from '../selection';

export interface EditorContext {
  schemaService: SchemaService;
  schema: SchemaElement | undefined;
  uiSchema: LinkedUISchemaElement | undefined;
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

export const useGitLabService = (): SchemaService => {
  const { schemaService } = useEditorContext();
  return schemaService;
};

export const useSchema = (): SchemaElement | undefined => {
  const { schema } = useEditorContext();
  return schema;
};

export const useUiSchema = (): LinkedUISchemaElement | undefined => {
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
