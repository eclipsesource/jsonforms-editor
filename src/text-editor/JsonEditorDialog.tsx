import { DialogContent, Fade, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    dialogContent: {
      height: '90vh',
      overflow: 'hidden',
      marginTop: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface JsonEditorDialogProps {
  open: boolean;
  title: string;
  initialContent: any;
  onApply: (newContent: any) => void;
  onCancel: () => void;
}

export const JsonEditorDialog: React.FC<JsonEditorDialogProps> = ({
  open,
  title,
  initialContent,
  onApply,
  onCancel,
}) => {
  const classes = useStyles();
  const [content, setContent] = useState(initialContent);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      maxWidth='lg'
      fullWidth
    >
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onCancel}
            aria-label='cancel'
            data-cy='cancel'
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' noWrap>
            {title} Text Edit
          </Typography>
          <Button
            variant='contained'
            onClick={() => onApply(content)}
            data-cy='apply'
          >
            Apply
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <MonacoEditor
          language='json'
          value={content}
          onChange={(newContent) => setContent(newContent)}
          editorDidMount={(editor) => editor.focus()}
        />
      </DialogContent>
    </Dialog>
  );
};
