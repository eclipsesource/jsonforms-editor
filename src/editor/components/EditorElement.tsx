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
import { useDispatch, useSchema } from '../../core/context';
import { DndItems } from '../../core/dnd';
import { getIconForUISchemaType } from '../../core/icons';
import { Actions } from '../../core/model';
import {
  getUISchemaPath,
  LinkedUISchemaElement,
} from '../../core/model/uischema';
import { getFromPath } from '../../core/util/clone';

export interface EditorElementProps {
  wrappedElement: LinkedUISchemaElement;
  onHoverCallback?: (isHover: boolean) => void;
}

const useEditorElementStyles = makeStyles((theme) => ({
  editorElement: (props: { isDragging: boolean }) => ({
    border: '1px solid #D3D3D3',
    padding: theme.spacing(1),
    opacity: props.isDragging ? 0.5 : 1,
  }),
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
  const classes = useEditorElementStyles({ isDragging });
  const uiPath = getUISchemaPath(wrappedElement);
  const dispatch = useDispatch();

  return (
    <Grid
      item
      container
      wrap='nowrap'
      direction='column'
      key={`editorElement-${uiPath}`}
      data-cy={`editorElement-${uiPath}`}
      className={classes.editorElement}
      ref={drag}
    >
      <Grid
        container
        item
        direction='row'
        className={classes.elementHeader}
        key={`editorElement-${uiPath}-header`}
        data-cy={`editorElement-${uiPath}-header`}
        xs={12}
      >
        <Grid item key={`editorElement-${uiPath}-icon`} xs={6}>
          {React.createElement(getIconForUISchemaType(wrappedElement.type), {})}
        </Grid>
        <Grid
          item
          container
          key={`editorElement-${uiPath}-elementControls`}
          className={classes.elementControls}
          justify='flex-end'
          alignItems='center'
          xs={6}
        >
          <IconButton
            key={`editorElement-${uiPath}-removeIcon`}
            data-cy={`editorElement-${uiPath}-removeIcon`}
            size='small'
            onClick={() => setOpenConfirmRemoveDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
          {openConfirmRemoveDialog && (
            <OkCancelDialog
              open
              text={'Remove element and all its contents from the UI Schema?'}
              onOk={() => {
                dispatch(Actions.removeUiSchemaElement(wrappedElement));
                setOpenConfirmRemoveDialog(false);
              }}
              onCancel={() => setOpenConfirmRemoveDialog(false)}
            />
          )}
        </Grid>
      </Grid>

      {children}
    </Grid>
  );
};
