/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import React from 'react';

import { GroupIcon, HorizontalIcon, VerticalIcon } from '../icons';
import { EditorUISchemaElement } from '../model/uischema';
import { createLayout } from '../util/generators/uiSchema';

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
];

export class ExamplePaletteService implements PaletteService {
  getPaletteElements = () => paletteElements;
}
