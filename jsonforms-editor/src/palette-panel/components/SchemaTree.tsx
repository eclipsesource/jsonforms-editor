/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDrag } from 'react-dnd';

import { DndItems } from '../../core/dnd';
import { SchemaIcon } from '../../core/icons';
import {
  getChildren,
  getLabel,
  getPath,
  isArrayElement,
  isObjectElement,
  SchemaElement,
} from '../../core/model/schema';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { createControl } from '../../core/util/generators/uiSchema';
import { StyledTreeItem, StyledTreeView } from './Tree';

interface SchemaTreeItemProps {
  schemaElement: SchemaElement;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({ schemaElement }) => {
  const uiSchemaElement: EditorUISchemaElement = createControl(schemaElement);

  const [{ isDragging }, drag] = useDrag({
    item: DndItems.newUISchemaElement(uiSchemaElement, schemaElement.uuid),
    canDrag: () => {
      return schemaElement.schema.type !== 'object';
    },
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
        icon={<SchemaIcon type={schemaElement.type} />}
        isDragging={isDragging}
      >
        {getChildrenToRender(schemaElement).map((child) => (
          <SchemaTreeItem schemaElement={child} key={getPath(child)} />
        ))}
      </StyledTreeItem>
    </div>
  );
};

const getChildrenToRender = (schemaElement: SchemaElement) => {
  return getChildren(schemaElement).flatMap((child) => {
    // if the child is the only item of an array, use its children instead
    if (
      isObjectElement(child) &&
      isArrayElement(child.parent) &&
      child.parent.items === child
    ) {
      return getChildren(child);
    }
    return [child];
  });
};

export const SchemaTreeView: React.FC<{
  schema: SchemaElement | undefined;
}> = ({ schema }) => (
  <>
    <Typography variant='h6' color='inherit' noWrap>
      Controls
    </Typography>
    {schema !== undefined ? (
      <StyledTreeView defaultExpanded={['']}>
        <SchemaTreeItem schemaElement={schema} />
      </StyledTreeView>
    ) : (
      <NoSchema />
    )}
  </>
);

const NoSchema = () => <div>No JSON Schema available</div>;
