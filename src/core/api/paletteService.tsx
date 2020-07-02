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
  getPaletteElements(): Map<string, PaletteElement[]>;
}

export interface PaletteElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  uiSchemaElement: EditorUISchemaElement;
}

const paletteElements: Map<string, PaletteElement[]> = new Map([
  [
    'Layouts',
    [
      {
        type: 'HorizontalLayout',
        label: 'Horizontal Layout',
        icon: <HorizontalIcon />,
        uiSchemaElement: createLayout('HorizontalLayout'),
      } as PaletteElement,
      {
        type: 'VerticalLayout',
        label: 'Vertical Layout',
        icon: <VerticalIcon />,
        uiSchemaElement: createLayout('VerticalLayout'),
      },
      {
        type: 'Group',
        label: 'Group',
        icon: <GroupIcon />,
        uiSchemaElement: createLayout('Group'),
      },
    ],
  ],
]);

export class ExamplePaletteService implements PaletteService {
  getPaletteElements = () => paletteElements;
}
