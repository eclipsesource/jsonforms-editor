/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

interface ErrorDialogProps {
  open: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  title,
  text,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
