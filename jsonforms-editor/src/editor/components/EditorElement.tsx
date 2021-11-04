/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useDrag } from 'react-dnd';

import { OkCancelDialog } from '../../core/components/OkCancelDialog';
import { useDispatch, useSchema, useSelection } from '../../core/context';
import { DndItems } from '../../core/dnd';
import { SchemaIcon, UISchemaIcon } from '../../core/icons';
import { Actions } from '../../core/model';
import {
  EditorUISchemaElement,
  getUISchemaPath,
  hasChildren,
} from '../../core/model/uischema';
import { isEditorControl, tryFindByUUID } from '../../core/util/schemasUtil';

const useEditorElementStyles = makeStyles((theme) => ({
  editorElement: {
    border: '1px solid #d3d3d3',
    padding: theme.spacing(1),
    opacity: 1,
    backgroundColor: '#fafafa',
    width: '100%',
    alignSelf: 'baseline',
    minWidth: 'fit-content',
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
  rule: {
    fontWeight: 'bolder',
    color: theme.palette.text.primary,
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  ruleEffect: { fontStyle: 'italic', color: theme.palette.text.secondary },
}));

export interface EditorElementProps {
  wrappedElement: EditorUISchemaElement;
  elementIcon?: React.ReactNode;
}

export const EditorElement: React.FC<EditorElementProps> = ({
  wrappedElement,
  elementIcon,
  children,
}) => {
  const schema = useSchema();
  const [selection, setSelection] = useSelection();
  const dispatch = useDispatch();
  const [openConfirmRemoveDialog, setOpenConfirmRemoveDialog] =
    React.useState(false);
  const elementSchema = tryFindByUUID(
    schema,
    wrappedElement.linkedSchemaElement
  );
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.moveUISchemaElement(wrappedElement, elementSchema),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const classes = useEditorElementStyles();

  const uiPath = getUISchemaPath(wrappedElement);
  const isSelected = selection?.uuid === wrappedElement.uuid;
  const ruleEffect = wrappedElement.rule?.effect.toLocaleUpperCase();

  const icon =
    elementIcon ??
    (elementSchema ? (
      <SchemaIcon type={elementSchema.type} />
    ) : (
      <UISchemaIcon type={wrappedElement.type} />
    ));
  return (
    <Grid
      item
      data-cy={`editorElement-${uiPath}`}
      className={`${classes.editorElement} ${
        isDragging ? classes.elementDragging : ''
      } ${isSelected ? classes.elementSelected : ''}`}
      ref={drag}
      onClick={(event) => {
        event.stopPropagation();
        const newSelection = { uuid: wrappedElement.uuid };
        setSelection(newSelection);
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
          {icon}
          {ruleEffect ? (
            <Grid
              item
              container
              direction='row'
              alignItems='center'
              wrap='nowrap'
              xs
            >
              <Typography variant='subtitle2' className={classes.rule}>
                {'R'}
              </Typography>
              <Typography
                variant='caption'
                className={classes.ruleEffect}
              >{`(${ruleEffect})`}</Typography>
            </Grid>
          ) : null}
          {isEditorControl(wrappedElement) && (
            <Grid
              item
              container
              direction='row'
              alignItems='center'
              wrap='nowrap'
              xs
            >
              <Typography variant='caption' className={classes.ruleEffect}>
                {wrappedElement.scope}
              </Typography>
            </Grid>
          )}
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
                : dispatch(Actions.removeUiSchemaElement(wrappedElement.uuid));
            }}
          >
            <DeleteIcon />
          </IconButton>

          <OkCancelDialog
            open={openConfirmRemoveDialog}
            text={'Remove element and all its contents from the UI Schema?'}
            onOk={() => {
              dispatch(Actions.removeUiSchemaElement(wrappedElement.uuid));
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
