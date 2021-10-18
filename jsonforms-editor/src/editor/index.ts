/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { materialRenderers } from '@jsonforms/material-renderers';

import { DroppableArrayControlRegistration } from '../core/renderers/DroppableArrayControl';
import { DroppableCategorizationLayoutRegistration } from '../core/renderers/DroppableCategorizationLayout';
import { DroppableCategoryLayoutRegistration } from '../core/renderers/DroppableCategoryLayout';
import { DroppableElementRegistration } from '../core/renderers/DroppableElement';
import { DroppableGroupLayoutRegistration } from '../core/renderers/DroppableGroupLayout';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../core/renderers/DroppableLayout';
import { EditorTab } from './components/EditorPanel';
import { ReactMaterialPreview } from './components/preview';

export * from './components/EditorPanel';
export { EditorElement } from './components/EditorElement';

export const defaultEditorTabs: EditorTab[] = [
  { name: 'Preview', Component: ReactMaterialPreview },
];

export const defaultEditorRenderers: JsonFormsRendererRegistryEntry[] = [
  ...materialRenderers,
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
  DroppableElementRegistration,
  DroppableGroupLayoutRegistration,
  DroppableCategoryLayoutRegistration,
  DroppableArrayControlRegistration,
  DroppableCategorizationLayoutRegistration,
];
