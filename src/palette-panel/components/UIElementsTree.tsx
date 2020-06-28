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

import { DndItems } from '../../core/dnd';
import { HorizontalIcon, VerticalIcon } from '../../core/icons';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { createLayout } from '../../core/util/generators/uiSchema';
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
}

export const UIElementsTree: React.FC<UIElementsTreeProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <Typography variant='h6' color='inherit' noWrap>
        Layouts
      </Typography>
      <StyledTreeView defaultExpanded={['']}>
        <UiSchemaTreeItem
          label='Horizontal Layout'
          icon={<HorizontalIcon />}
          uiSchemaElement={createLayout('HorizontalLayout')}
        />
        <UiSchemaTreeItem
          label='Vertical Layout'
          icon={<VerticalIcon />}
          uiSchemaElement={createLayout('VerticalLayout')}
        />
      </StyledTreeView>
    </div>
  );
};
