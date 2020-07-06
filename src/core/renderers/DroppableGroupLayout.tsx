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
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';

import { EditorElement } from '../../editor/components/EditorElement';
import { EditorLayout } from '../model/uischema';
import { DroppableLayoutContent } from './DroppableLayout';

const useStyles = makeStyles((theme) => ({
  groupLabel: {
    padding: theme.spacing(2),
    alignItems: 'baseline',
  },
  labelPlaceholder: {
    fontStyle: 'italic',
    fontWeight: 'lighter',
    color: '#9e9e9e',
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
            <Grid
              container
              direction='row'
              spacing={1}
              className={classes.groupLabel}
            >
              <Grid item>
                <Typography>Label:</Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={`${
                    groupLayout.label ? '' : classes.labelPlaceholder
                  }`}
                  variant='h6'
                >
                  {groupLayout.label ?? 'no label'}
                </Typography>
              </Grid>
            </Grid>
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
