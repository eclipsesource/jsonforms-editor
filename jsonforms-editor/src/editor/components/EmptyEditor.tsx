/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch, usePaletteService } from '../../core/context';
import { NEW_UI_SCHEMA_ELEMENT } from '../../core/dnd';
import { Actions } from '../../core/model';

const useStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    padding: 10,
    fontSize: props.isOver ? '1.1em' : '1em',
    border: props.isOver ? '1px solid #D3D3D3' : 'none',
    height: '100%',
  }),
  speedDial: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

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
  const paletteService = usePaletteService();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles({ isOver });
  return (
    <div ref={drop} className={classes.root}>
      <Typography data-cy={`nolayout-drop`}>
        Drag and drop an element from the Palette to begin.
      </Typography>
      <SpeedDial
        ariaLabel='SpeedDial openIcon example'
        className={classes.speedDial}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction={'right'}
      >
        {paletteService
          .getPaletteElements()
          .map(({ type, label, icon, uiSchemaElementProvider }) => (
            <SpeedDialAction
              key={type}
              color='primary'
              icon={icon as any}
              tooltipTitle={label}
              onClick={() => {
                dispatch(Actions.setUiSchema(uiSchemaElementProvider()));
                handleClose();
              }}
            />
          ))}
      </SpeedDial>
    </div>
  );
};
