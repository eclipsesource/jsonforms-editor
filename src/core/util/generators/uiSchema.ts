/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';

import { SchemaElement } from '../../model';

export const createControl = (
  scope: string,
  schema: SchemaElement
): ControlElement => {
  return {
    type: 'Control',
    scope: scope,
  };
};

export const createLayout = (type: string): Layout => ({
  type: type,
  elements: [],
});
