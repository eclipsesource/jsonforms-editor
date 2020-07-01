/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDrag } from 'react-dnd';

import { PaletteElement } from '../../core/api/paletteService';
import { DndItems } from '../../core/dnd';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { StyledTreeItem, StyledTreeView } from './Tree';

interface UiSchemaTreeItemProps {
  uiSchemaElement: EditorUISchemaElement;
  label: string;
  icon?: React.ReactNode;
}

const UiSchemaTreeItem: React.FC<UiSchemaTreeItemProps> = ({
  uiSchemaElement,
  label,
  icon,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.newUISchemaElement(uiSchemaElement),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div ref={drag} data-cy={`${uiSchemaElement.type}-source`}>
      <StyledTreeItem
        key={uiSchemaElement.type}
        nodeId={uiSchemaElement.type}
        label={label}
        icon={icon}
        isDragging={isDragging}
      ></StyledTreeItem>
    </div>
  );
};

interface UIElementsTreeProps {
  className?: string;
  elements: Map<string, PaletteElement[]>;
}

export const UIElementsTree: React.FC<UIElementsTreeProps> = ({
  className,
  elements,
}) => {
  return (
    <div className={className}>
      {Array.from(elements).map((value) => {
        const category = value[0];
        const paletteElements = value[1];
        return (
          <div key={`container-${category}`}>
            <Typography variant='h6' color='inherit' noWrap>
              {category}
            </Typography>
            <StyledTreeView defaultExpanded={['']}>
              {paletteElements.map(({ type, label, icon, uiSchemaElement }) => (
                <UiSchemaTreeItem
                  key={`treeitem-${type}`}
                  label={label}
                  icon={icon}
                  uiSchemaElement={uiSchemaElement}
                />
              ))}
            </StyledTreeView>
          </div>
        );
      })}
    </div>
  );
};
