/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  createStyles,
  fade,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
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
import { PaletteTransitionComponent } from './PaletteTransitionComponent';

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

const StyledTreeItem = withStyles((theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={PaletteTransitionComponent} />
));

interface SchemaTreeItemProps {
  schemaElement: SchemaElement;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({
  children,
  schemaElement,
}) => {
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
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {getChildren(schemaElement).map((child) => (
          <SchemaTreeItem schemaElement={child} key={getPath(child)} />
        ))}
      </StyledTreeItem>
    </div>
  );
};

const useStyles = makeStyles(
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 400,
    },
  })
);

export const SchemaTreeView: React.FC<{
  schema: SchemaElement | undefined;
}> = ({ schema }) => {
  const classes = useStyles();

  if (schema === undefined) {
    return <NoSchema />;
  }

  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Controls
      </Typography>
      <TreeView className={classes.root} defaultExpanded={['']}>
        <SchemaTreeItem schemaElement={schema} />
      </TreeView>
    </>
  );
};

const NoSchema = () => <div>No schema available</div>;
