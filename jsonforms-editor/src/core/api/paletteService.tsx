/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import React from 'react';

import {
  CategorizationIcon,
  GroupIcon,
  HorizontalIcon,
  LabelIcon,
  VerticalIcon,
} from '../icons';
import { EditorUISchemaElement } from '../model/uischema';
import {
  createCategorization,
  createLabel,
  createLayout,
} from '../util/generators/uiSchema';

export interface PaletteService {
  getPaletteElements(): PaletteElement[];
}

export interface PaletteElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  uiSchemaElementProvider: () => EditorUISchemaElement;
}

const paletteElements: PaletteElement[] = [
  {
    type: 'HorizontalLayout',
    label: 'Horizontal Layout',
    icon: <HorizontalIcon />,
    uiSchemaElementProvider: () => createLayout('HorizontalLayout'),
  } as PaletteElement,
  {
    type: 'VerticalLayout',
    label: 'Vertical Layout',
    icon: <VerticalIcon />,
    uiSchemaElementProvider: () => createLayout('VerticalLayout'),
  },
  {
    type: 'Group',
    label: 'Group',
    icon: <GroupIcon />,
    uiSchemaElementProvider: () => createLayout('Group'),
  },
  {
    type: 'Label',
    label: 'Label',
    icon: <LabelIcon />,
    uiSchemaElementProvider: () => createLabel(),
  },
  {
    type: 'Categorization',
    label: 'Categorization',
    icon: <CategorizationIcon />,
    uiSchemaElementProvider: () => createCategorization(),
  },
];

export class DefaultPaletteService implements PaletteService {
  getPaletteElements = () => paletteElements;
}
