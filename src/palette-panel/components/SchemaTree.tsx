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
import { getIconForSchemaType } from '../../core/icons';
import {
  getChildren,
  getLabel,
  getPath,
  SchemaElement,
} from '../../core/model/schema';
import { LinkedUISchemaElement } from '../../core/model/uischema';
import { createControl } from '../../core/util/generators/uiSchema';
import { StyledTreeItem, StyledTreeView } from './Tree';

interface SchemaTreeItemProps {
  schemaElement: SchemaElement;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({ schemaElement }) => {
  const uiSchemaElement: LinkedUISchemaElement = createControl(
    `#${getPath(schemaElement)}`,
    schemaElement
  );
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.newUISchemaElement(uiSchemaElement, schemaElement),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const schemaElementPath = getPath(schemaElement);
  return (
    <div ref={drag} data-cy={`${schemaElementPath}-source`}>
      <StyledTreeItem
        key={schemaElementPath}
        nodeId={schemaElementPath}
        label={getLabel(schemaElement)}
        icon={React.createElement(getIconForSchemaType(schemaElement.type), {})}
        isDragging={isDragging}
      >
        {getChildren(schemaElement).map((child) => (
          <SchemaTreeItem schemaElement={child} key={getPath(child)} />
        ))}
      </StyledTreeItem>
    </div>
  );
};

export const SchemaTreeView: React.FC<{
  schema: SchemaElement | undefined;
}> = ({ schema }) => {
  if (schema === undefined) {
    return <NoSchema />;
  }
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Controls
      </Typography>
      <StyledTreeView defaultExpanded={['']}>
        <SchemaTreeItem schemaElement={schema} />
      </StyledTreeView>
    </>
  );
};

const NoSchema = () => <div>No schema available</div>;
