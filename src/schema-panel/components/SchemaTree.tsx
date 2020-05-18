import { SchemaElement, SchemaElementType } from '../../core/model/schema';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import {
  createStyles,
  fade,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React from 'react';
import { SelectedElement } from '../../core/selection';
import { TransitionProps } from '@material-ui/core/transitions';
import TreeView from '@material-ui/lab/TreeView';
import { useSelection } from '../../core/context';

const ObjectIcon = ListAltIcon;
const ArrayIcon = QueueOutlinedIcon;
const PrimitiveIcon = LabelOutlinedIcon;
const OtherIcon = RadioButtonUncheckedIcon;

const getIconForType = (type: SchemaElementType) => {
  switch (type) {
    case 'Object':
      return ObjectIcon;
    case 'Array':
      return ArrayIcon;
    case 'Primitive':
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

const toTreeViewItem = (
  treeItem: SchemaElement,
  setSelection: (selection: SelectedElement) => void
) => (
  <StyledTreeItem
    key={treeItem.path}
    nodeId={treeItem.path}
    label={treeItem.label}
    icon={React.createElement(getIconForType(treeItem.type), {})}
    onLabelClick={() => setSelection(treeItem)}
  >
    {treeItem.children.map((child) => toTreeViewItem(child, setSelection))}
  </StyledTreeItem>
);

const useStyles = makeStyles(
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 400,
    },
  })
);

export const SchemaTreeView: React.FC<{ schema: any }> = ({ schema }) => {
  const classes = useStyles();
  const [, setSelection] = useSelection();

  if (!schema && schema !== false) {
    return <NoSchema />;
  }

  return (
    <TreeView className={classes.root} defaultExpanded={['']}>
      {toTreeViewItem(schema, setSelection)}
    </TreeView>
  );
};

const NoSchema = () => <div>No schema available</div>;
