/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { SchemaElement } from '../model';
import { LinkedUISchemaElement } from '../model/uischema';

export type SelectedElement = WrappedSelectedElement | undefined;

interface WrappedSelectedElement {
  uiSchema: LinkedUISchemaElement;
  schema?: SchemaElement;
}
