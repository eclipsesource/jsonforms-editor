/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch } from '../../core/context';
import { NEW_UI_SCHEMA_ELEMENT } from '../../core/dnd';
import { Actions } from '../../core/model';

const useStyles = makeStyles({
  root: (props: any) => ({
    padding: 10,
    fontSize: props.isOver ? '1.1em' : '1em',
    border: props.isOver ? '1px solid #D3D3D3' : 'none',
    height: '100%',
  }),
});

export const EmptyEditor: React.FC = () => {
  const dispatch = useDispatch();
  const [{ isOver, uiSchemaElement }, drop] = useDrop({
    accept: NEW_UI_SCHEMA_ELEMENT,
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      uiSchemaElement: mon.getItem()?.uiSchemaElement,
    }),
    drop: (): any => {
      dispatch(Actions.setUiSchema(uiSchemaElement));
    },
  });
  const classes = useStyles({ isOver });
  return (
    <div ref={drop} className={classes.root}>
      <Typography data-cy={`nolayout-drop`}>
        Drag and drop an element from the Palette to begin.
      </Typography>
    </div>
  );
};
