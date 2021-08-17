/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Category, LayoutProps, rankWith, uiTypeIs } from '@jsonforms/core';
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

import { EditorLayout } from '../model/uischema';
import { DroppableLayout } from './DroppableLayout';

const useStyles = makeStyles((theme) => ({
  categoryLabel: {
    padding: theme.spacing(2),
    alignItems: 'baseline',
  },
  labelPlaceholder: {
    fontStyle: 'italic',
    fontWeight: 'lighter',
    color: '#9e9e9e',
  },
  categoryLabelInput: {
    fontSize: theme.typography.h6.fontSize,
  },
}));

const CategoryLayout: React.FC<LayoutProps> = (props) => {
  const { uischema } = props;
  const categoryLayout = uischema as Category & EditorLayout;
  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        component={() => (
          <Grid
            container
            direction='row'
            spacing={1}
            className={classes.categoryLabel}
          >
            <Grid item>
              <Typography>Label:</Typography>
            </Grid>
            <Grid item>
              <Typography
                className={`${
                  categoryLayout.label ? '' : classes.labelPlaceholder
                }`}
                variant='h6'
              >
                {categoryLayout.label ?? 'no label'}
              </Typography>
            </Grid>
          </Grid>
        )}
      ></CardHeader>
      <CardContent>
        <DroppableLayout
          {...props}
          layout={categoryLayout}
          direction={'column'}
        />
      </CardContent>
    </Card>
  );
};

export const DroppableCategoryLayoutRegistration = {
  tester: rankWith(45, uiTypeIs('Category')),
  renderer: withJsonFormsLayoutProps(CategoryLayout),
};
