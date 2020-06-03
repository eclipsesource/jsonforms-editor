/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch } from '../../core/context';
import { UI_SCHEMA_ELEMENT } from '../../core/dnd';
import { Actions } from '../../core/model';

const useStyles = makeStyles({
  root: (props: any) => ({
    padding: 10,
    fontSize: props.isOver ? '1.1em' : '1em',
    border: props.isOver ? '1px solid #D3D3D3' : 'none',
  }),
});

export const EmptyEditor: React.FC = () => {
  const dispatch = useDispatch();
  const [{ isOver, uiSchemaElement }, drop] = useDrop({
    accept: UI_SCHEMA_ELEMENT,
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
    <Typography ref={drop} className={classes.root} data-cy={`nolayout-drop`}>
      Drag and drop an element from the Palette to begin.
    </Typography>
  );
};
