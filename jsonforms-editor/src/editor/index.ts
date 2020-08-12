/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { EditorTab } from './components/EditorPanel';
import { ReactMaterialPreview } from './components/preview';

export { EditorPanel } from './components/EditorPanel';

export type { EditorTab } from './components/EditorPanel';

export const defaultEditorTabs: EditorTab[] = [
  { name: 'Preview', Component: ReactMaterialPreview },
];
