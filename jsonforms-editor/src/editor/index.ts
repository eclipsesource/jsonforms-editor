/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { materialRenderers } from '@jsonforms/material-renderers';

import { DroppableArrayControlRegistration } from '../core/renderers/DroppableArrayControl';
import { DroppableElementRegistration } from '../core/renderers/DroppableElement';
import { DroppableGroupLayoutRegistration } from '../core/renderers/DroppableGroupLayout';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../core/renderers/DroppableLayout';
import { ReactMaterialPreview } from './components/preview';
import { PreviewTab } from './interface';

export * from './components/EditorPanel';
export { EditorElement } from './components/EditorElement';

export * from './interface';
export const defaultPreviewTabs: PreviewTab[] = [
  { name: 'Preview', Component: ReactMaterialPreview },
];

export const defaultEditorRenderers: JsonFormsRendererRegistryEntry[] = [
  ...materialRenderers,
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
  DroppableElementRegistration,
  DroppableGroupLayoutRegistration,
  DroppableArrayControlRegistration,
];
