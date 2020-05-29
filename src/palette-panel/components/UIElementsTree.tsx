/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout, UISchemaElement } from '@jsonforms/core';
import Collapse from '@material-ui/core/Collapse';
import {
  createStyles,
  fade,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import HeightIcon from '@material-ui/icons/Height';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { useDrag } from 'react-dnd';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

import { DndItems } from '../../core/dnd';

const useStyles = makeStyles(
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 400,
    },
  })
);

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
  uiSchemaElement: UISchemaElement;
  label: string;
  icon?: React.ReactNode;
}

const SchemaTreeItem: React.FC<SchemaTreeItemProps> = ({
  uiSchemaElement,
  label,
  icon,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.dragUISchemaElement(uiSchemaElement),
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
        style={{ opacity: isDragging ? 0.5 : 1 }}
      ></StyledTreeItem>
    </div>
  );
};

const createLayout = (type: string): Layout => ({
  type: type,
  elements: [],
});

const HorizontalIcon = <HeightIcon style={{ transform: 'rotate(90deg)' }} />;
const VerticalIcon = <HeightIcon />;

export const UIElementsTree: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Layouts
      </Typography>
      <TreeView className={classes.root} defaultExpanded={['']}>
        <SchemaTreeItem
          label='Horizontal Layout'
          icon={HorizontalIcon}
          uiSchemaElement={createLayout('HorizontalLayout')}
        />
        <SchemaTreeItem
          label='Vertical Layout'
          icon={VerticalIcon}
          uiSchemaElement={createLayout('VerticalLayout')}
        />
      </TreeView>
    </>
  );
};
