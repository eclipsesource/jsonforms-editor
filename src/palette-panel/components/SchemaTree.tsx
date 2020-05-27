/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import Collapse from '@material-ui/core/Collapse';
import {
  createStyles,
  fade,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { useDrag } from 'react-dnd';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

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

const TransitionComponent = (props: TransitionProps) => {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
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
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

interface SchemaTreeItemProps {
  schemaElement: SchemaElement;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({
  children,
  schemaElement,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.dragSchemaElement(schemaElement),
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
    <TreeView className={classes.root} defaultExpanded={['']}>
      <SchemaTreeItem schemaElement={schema} />
    </TreeView>
  );
};

const NoSchema = () => <div>No schema available</div>;
