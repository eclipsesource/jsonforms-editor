/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { UISchemaElement } from '@jsonforms/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { useDrag } from 'react-dnd';

import { DndItems } from '../../core/dnd';
import { HorizontalIcon, VerticalIcon } from '../../core/icons';
import { createLayout } from '../../core/util/generators/uiSchema';
import { PaletteTransitionComponent } from './PaletteTransitionComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 400,
    margin: '0 0 10px 0',
  },
  schemaTreeItem: (props: any) => ({
    opacity: props.isDragging ? 0.5 : 1,
  }),
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
}));

const StyledTreeItem: React.FC<TreeItemProps> = (props) => (
  <TreeItem {...props} TransitionComponent={PaletteTransitionComponent} />
);

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
  const classes = useStyles({ isDragging });
  return (
    <div ref={drag} data-cy={`${uiSchemaElement.type}-source`}>
      <StyledTreeItem
        key={uiSchemaElement.type}
        nodeId={uiSchemaElement.type}
        label={label}
        icon={icon}
        className={classes.schemaTreeItem}
      ></StyledTreeItem>
    </div>
  );
};

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
          icon={<HorizontalIcon />}
          uiSchemaElement={createLayout('HorizontalLayout')}
        />
        <SchemaTreeItem
          label='Vertical Layout'
          icon={<VerticalIcon />}
          uiSchemaElement={createLayout('VerticalLayout')}
        />
      </TreeView>
    </>
  );
};
