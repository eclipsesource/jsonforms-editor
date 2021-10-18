/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, LabelElement, Layout } from '@jsonforms/core';
import { v4 as uuid } from 'uuid';

import { getScope, SchemaElement } from '../../model';
import {
  CategorizationLayout,
  EditorCategoryElement,
  EditorUISchemaElement,
} from '../../model/uischema';

export const createControl = (
  schemaElement: SchemaElement
): ControlElement & EditorUISchemaElement => {
  return createControlWithScope(`#${getScope(schemaElement)}`);
};

export const createControlWithScope = (
  scope: string
): ControlElement & EditorUISchemaElement => {
  return {
    type: 'Control',
    scope: scope,
    uuid: uuid(),
  } as ControlElement & EditorUISchemaElement;
};

export const createLayout = (type: string): Layout & EditorUISchemaElement => {
  return {
    type: type,
    elements: [],
    uuid: uuid(),
  } as Layout & EditorUISchemaElement;
};

export const createLabel = (
  text?: string
): LabelElement & EditorUISchemaElement => {
  return {
    type: 'Label',
    text: text,
    uuid: uuid(),
  } as LabelElement & EditorUISchemaElement;
};

export const createCategory = (label?: string): EditorCategoryElement => {
  return {
    type: 'Category',
    elements: [],
    label: label,
    uuid: uuid(),
  } as EditorCategoryElement;
};

export const createCategorization = (label?: string): CategorizationLayout => {
  return {
    type: 'Categorization',
    label: label,
    uuid: uuid(),
    elements: [],
  } as CategorizationLayout;
};
