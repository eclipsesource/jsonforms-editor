/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloudDownload from '@material-ui/icons/CloudDownload';
import React, { useState } from 'react';

import { useExportSchema, useExportUiSchema } from '../util/hooks';
import { ExportDialog } from './ExportDialog';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  })
);

export const Header: React.FC = () => {
  const classes = useStyles();
  const schema = useExportSchema();
  const uiSchema = useExportUiSchema();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const openDownloadDialog = () => setOpen(true);

  return (
    <AppBar position='static' elevation={0}>
      <Toolbar>
        <Typography
          variant='h6'
          color='inherit'
          noWrap
          className={classes.title}
        >
          JSON Forms Editor
        </Typography>
        <IconButton
          aria-label={`Download`}
          onClick={openDownloadDialog}
          color='inherit'
        >
          <CloudDownload />
        </IconButton>
      </Toolbar>
      {open && (
        <ExportDialog
          open={open}
          onClose={onClose}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
    </AppBar>
  );
};
