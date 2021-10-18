/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Hidden from '@material-ui/core/Hidden';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Cancel from '@material-ui/icons/Cancel';
import React, { useState } from 'react';

import { FormattedJson } from './Formatted';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    title: {
      textAlign: 'center',
    },
    content: {
      maxHeight: '90vh',
      height: '90vh',
    },
  })
);

export interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  schema: any;
  uiSchema: any;
}
export const ExportDialog = ({
  open,
  onClose,
  schema,
  uiSchema,
}: ExportDialogProps) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='export-dialog-title'
      aria-describedby='export-dialog-description'
      maxWidth='md'
      fullWidth
    >
      <DialogTitle className={classes.title} id='export-dialog-title'>
        {'Export'}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label='Schema' />
          <Tab label='UI Schema' />
        </Tabs>
        <Hidden xsUp={selectedTab !== 0}>
          <FormattedJson object={schema} />
        </Hidden>
        <Hidden xsUp={selectedTab !== 1}>
          <FormattedJson object={uiSchema} />
        </Hidden>
      </DialogContent>
      <DialogActions>
        <Button
          aria-label={'Close'}
          variant='contained'
          color='primary'
          className={classes.button}
          startIcon={<Cancel />}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
