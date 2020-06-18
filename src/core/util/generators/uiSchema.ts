/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { v4 as uuid } from 'uuid';

import { getPath, SchemaElement } from '../../model';
import { LinkedUISchemaElement } from '../../model/uischema';
export const createControl = (
  schemaElement: SchemaElement
): LinkedUISchemaElement => {
  const scope = `#${getPath(schemaElement)}`;
  const newControl = {
    type: 'Control',
    scope: scope,
    uuid: uuid(),
  };
  return newControl;
};

export const createLayout = (type: string): LinkedUISchemaElement => {
  const newLayout = {
    type: type,
    elements: [],
    uuid: uuid(),
  };
  return newLayout;
};
