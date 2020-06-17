/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { Grid, IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useDrag } from 'react-dnd';

import { OkCancelDialog } from '../../core/components/OkCancelDialog';
import { useDispatch, useSchema, useSelection } from '../../core/context';
import { DndItems } from '../../core/dnd';
import { UISchemaIcon } from '../../core/icons';
import { Actions } from '../../core/model';
import {
  getUISchemaPath,
  hasChildren,
  LinkedUISchemaElement,
} from '../../core/model/uischema';
import { getFromPath } from '../../core/util/clone';

export interface EditorElementProps {
  wrappedElement: LinkedUISchemaElement;
  onHoverCallback?: (isHover: boolean) => void;
}

const useEditorElementStyles = makeStyles((theme) => ({
  editorElement: {
    border: '1px solid #d3d3d3',
    padding: theme.spacing(1),
    opacity: 1,
    backgroundColor: '#fafafa',
  },
  elementDragging: {
    opacity: 0.5,
  },
  elementSelected: {
    border: '1px solid #a9a9a9',
    backgroundColor: 'rgba(63, 81, 181, 0.08)',
  },
  elementHeader: {
    '&:hover $elementControls': {
      opacity: 1,
    },
  },
  elementControls: {
    opacity: 0,
  },
}));

export const EditorElement: React.FC<EditorElementProps> = ({
  wrappedElement,
  children,
}) => {
  const schema = useSchema();
  const elementSchemaPathString = wrappedElement.linkedSchemaElements?.find(
    (schemaElement) => schemaElement !== undefined
  );
  const elementSchemaPath = elementSchemaPathString?.split('/');
  const elementSchema = elementSchemaPath
    ? getFromPath(schema, elementSchemaPath)
    : undefined;

  const [openConfirmRemoveDialog, setOpenConfirmRemoveDialog] = React.useState(
    false
  );
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.moveUISchemaElement(wrappedElement, elementSchema),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [selection, setSelection] = useSelection();
  const classes = useEditorElementStyles();
  const uiPath = getUISchemaPath(wrappedElement);
  const dispatch = useDispatch();
  const isSelected = selection?.uiSchema === wrappedElement;
  return (
    <Grid
      item
      container
      wrap='nowrap'
      direction='column'
      data-cy={`editorElement-${uiPath}`}
      className={`${classes.editorElement} ${
        isDragging ? classes.elementDragging : ''
      } ${isSelected ? classes.elementSelected : ''}`}
      ref={drag}
      onClick={(event) => {
        event.stopPropagation();
        setSelection({ schema: elementSchema, uiSchema: wrappedElement });
      }}
    >
      <Grid
        item
        container
        direction='row'
        wrap='nowrap'
        className={classes.elementHeader}
        data-cy={`editorElement-${uiPath}-header`}
      >
        <Grid item container alignItems='center' xs>
          <UISchemaIcon type={wrappedElement.type} />
        </Grid>
        <Grid
          item
          container
          className={classes.elementControls}
          justify='flex-end'
          alignItems='center'
          xs
        >
          <IconButton
            data-cy={`editorElement-${uiPath}-removeButton`}
            size='small'
            onClick={() => {
              hasChildren(wrappedElement)
                ? setOpenConfirmRemoveDialog(true)
                : dispatch(Actions.removeUiSchemaElement(wrappedElement));
            }}
          >
            <DeleteIcon />
          </IconButton>

          <OkCancelDialog
            open={openConfirmRemoveDialog}
            text={'Remove element and all its contents from the UI Schema?'}
            onOk={() => {
              dispatch(Actions.removeUiSchemaElement(wrappedElement));
              setOpenConfirmRemoveDialog(false);
            }}
            onCancel={() => setOpenConfirmRemoveDialog(false)}
          />
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
};
