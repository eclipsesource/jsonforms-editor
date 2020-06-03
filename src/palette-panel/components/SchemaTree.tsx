/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import Typography from '@material-ui/core/Typography';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React from 'react';
import { useDrag } from 'react-dnd';

import { useSelection } from '../../core/context';
import { DndItems } from '../../core/dnd';
import {
  ARRAY,
  getChildren,
  getLabel,
  getPath,
  OBJECT,
  PRIMITIVE,
  SchemaElement,
  SchemaElementType,
} from '../../core/model/schema';
import { LinkedUISchemaElement } from '../../core/model/uischema';
import { createControl } from '../../core/util/generators/uiSchema';
import { StyledTreeItem, StyledTreeView } from './Tree';

const ObjectIcon = ListAltIcon;
const ArrayIcon = QueueOutlinedIcon;
const PrimitiveIcon = LabelOutlinedIcon;
const OtherIcon = RadioButtonUncheckedIcon;

const getIconForType = (type: SchemaElementType) => {
  switch (type) {
    case OBJECT:
      return ObjectIcon;
    case ARRAY:
      return ArrayIcon;
    case PRIMITIVE:
      return PrimitiveIcon;
    default:
      return OtherIcon;
  }
};

interface SchemaTreeItemProps {
  schemaElement: SchemaElement;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({ schemaElement }) => {
  const uiSchemaElement: LinkedUISchemaElement = createControl(
    `#${getPath(schemaElement)}`
  );
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.dragUISchemaElement(uiSchemaElement),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [, setSelection] = useSelection();
  const schemaElementPath = getPath(schemaElement);
  return (
    <div ref={drag} data-cy={`${schemaElementPath}-source`}>
      <StyledTreeItem
        key={schemaElementPath}
        nodeId={schemaElementPath}
        label={getLabel(schemaElement)}
        icon={React.createElement(getIconForType(schemaElement.type), {})}
        onLabelClick={() => setSelection(schemaElement)}
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
