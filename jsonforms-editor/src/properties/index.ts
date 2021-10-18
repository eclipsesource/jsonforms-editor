/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { materialRenderers } from '@jsonforms/material-renderers';

import { RuleEditorRendererRegistration } from './renderers/RuleEditorRenderer';

export { PropertiesPanel } from './components/PropertiesPanel';

export * from './schemaDecorators';
export * from './schemaProviders';
export * from './propertiesService';

export const defaultPropertyRenderers = [
  ...materialRenderers,
  RuleEditorRendererRegistration,
];
