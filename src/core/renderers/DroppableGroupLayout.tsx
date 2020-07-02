/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { GroupLayout, LayoutProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React from 'react';

import { EditorElement } from '../../editor/components/EditorElement';
import { EditorLayout } from '../model/uischema';
import { DroppableLayoutContent } from './DroppableLayout';

const useStyles = makeStyles((theme) => ({
  groupLabel: {
    padding: theme.spacing(2),
  },
  groupLabelInput: {
    fontSize: theme.typography.h6.fontSize,
  },
}));

const Group: React.FC<LayoutProps> = (props) => {
  const { uischema } = props;
  const groupLayout = uischema as GroupLayout & EditorLayout;
  const classes = useStyles();
  return (
    <EditorElement wrappedElement={groupLayout}>
      <Card>
        <CardHeader
          component={() => (
            <TextField
              value={groupLayout.label ?? ''}
              placeholder='Label'
              InputProps={{
                classes: {
                  input: classes.groupLabelInput,
                },
                readOnly: true,
              }}
              className={classes.groupLabel}
            />
          )}
        ></CardHeader>
        <CardContent>
          <DroppableLayoutContent
            {...props}
            layout={groupLayout}
            direction={'column'}
          />
        </CardContent>
      </Card>
    </EditorElement>
  );
};

export const DroppableGroupLayoutRegistration = {
  tester: rankWith(10, uiTypeIs('Group')),
  renderer: withJsonFormsLayoutProps(Group),
};
