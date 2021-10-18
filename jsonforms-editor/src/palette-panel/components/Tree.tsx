/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  createStyles,
  fade,
  styled,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { TransitionProps } from '@material-ui/core/transitions';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

const PaletteTransitionComponent = (props: TransitionProps) => {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
      filter: 'blur(0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
      filter: 'blur(0)',
    },
  });
  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};

export const StyledTreeView = styled(TreeView)({ flexGrow: 1, maxWidth: 400 });

const treeItemStyles = (theme: Theme) =>
  createStyles({
    root: (props: { isDragging: boolean }) => ({
      opacity: props.isDragging ? 0.5 : 1,
    }),
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  });

interface StyledTreeItemProps extends WithStyles<typeof treeItemStyles> {
  isDragging: boolean;
}

export const StyledTreeItem = withStyles(treeItemStyles)(
  ({ isDragging, ...props }: StyledTreeItemProps & TreeItemProps) => (
    <TreeItem {...props} TransitionComponent={PaletteTransitionComponent} />
  )
);
