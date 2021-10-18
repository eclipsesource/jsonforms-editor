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

interface OkCancelDialogProps {
  open: boolean;
  title?: string;
  text: string;
  onOk: () => void;
  onCancel: () => void;
}

export const OkCancelDialog: React.FC<OkCancelDialogProps> = ({
  open,
  title = '',
  text,
  onOk,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary' data-cy='cancel-button'>
          Cancel
        </Button>
        <Button onClick={onOk} color='primary' autoFocus data-cy='ok-button'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
