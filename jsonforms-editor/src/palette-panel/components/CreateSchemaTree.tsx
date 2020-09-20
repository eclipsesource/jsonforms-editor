/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonSchema } from '@jsonforms/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDrag } from 'react-dnd';
import { v4 as uuid } from 'uuid';

import { DndItems } from '../../core/dnd';
import { StyledTreeItem, StyledTreeView } from './Tree';

interface CreateSchemaTreeProps {
  schema: JsonSchema;
  label: string;
  icon?: React.ReactNode;
}

const CreateSchemaTreeItem: React.FC<CreateSchemaTreeProps> = ({
  schema,
  label,
  icon,
}) => {
  const uiSchemaElement = {
    type: 'Control',
    uuid: uuid(),
  };
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.newSchemaElement(uiSchemaElement, schema),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  if (!schema.type || Array.isArray(schema.type)) {
    return <></>;
  }
  return (
    <div ref={drag} data-cy={`${schema.type}-source`}>
      <StyledTreeItem
        key={schema.type}
        nodeId={schema.type}
        label={label}
        icon={icon}
        isDragging={isDragging}
      ></StyledTreeItem>
    </div>
  );
};

export const CreateSchemaTree: React.FC<{}> = () => {
  return (
    <div>
      <Typography variant='h6' color='inherit' noWrap>
        Create Schema
      </Typography>
      <StyledTreeView defaultExpanded={['']}>
        <CreateSchemaTreeItem
          schema={{ type: 'string' }}
          label='String'
        ></CreateSchemaTreeItem>
        <CreateSchemaTreeItem
          schema={{ type: 'boolean' }}
          label='Boolean'
        ></CreateSchemaTreeItem>
        <CreateSchemaTreeItem
          schema={{ type: 'integer' }}
          label='Integer'
        ></CreateSchemaTreeItem>
        <CreateSchemaTreeItem
          schema={{ type: 'number' }}
          label='Number'
        ></CreateSchemaTreeItem>
      </StyledTreeView>
    </div>
  );
};
