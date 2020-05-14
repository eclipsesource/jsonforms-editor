import React, { useContext } from 'react';

import { GitLabService } from '../api/gitlab';
import { SelectedElement } from '../selection';

export interface EditorContext {
  gitLabService: GitLabService;
  schema: any;
  setSchema: (schema: any) => void;
  uiSchema: any;
  setUiSchema: (uiSchema: any) => void;
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

export const useGitLabService = (): GitLabService => {
  const { gitLabService } = useEditorContext();
  return gitLabService;
};

export const useSchema = (): any => {
  const { schema } = useEditorContext();
  return schema;
};

export const useSelection = (): [
  SelectedElement,
  (selection: SelectedElement) => void
] => {
  const { selection, setSelection } = useEditorContext();
  return [selection, setSelection];
};
