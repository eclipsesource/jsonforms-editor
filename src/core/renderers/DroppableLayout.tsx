/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  Layout,
  LayoutProps,
  rankWith,
  UISchemaElement,
  uiTypeIs,
} from '@jsonforms/core';
import {
  ResolvedJsonFormsDispatch,
  withJsonFormsLayoutProps,
} from '@jsonforms/react';
import { Grid, makeStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Height from '@material-ui/icons/Height';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch } from '../context';
import { SCHEMA_ELEMENT, UI_SCHEMA_ELEMENT } from '../dnd';
import { Actions } from '../model';
import { getUISchemaPath } from '../model/uischema';
import { isPathError } from '../util/clone';

const useStyles = makeStyles((theme) => ({
  dropPointContent: {
    textAlign: 'center',
  },
  dropPoint: {
    padding: '10',
    width: '3em',
    maxWidth: '3em',
    minWidth: '3em',
    margin: 'auto',
  },
  renderedContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  droppableLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #D3D3D3',
    padding: '20',
  },
  uiElementIcon: {
    alignSelf: 'flex-start',
  },
}));

interface DroppableLayoutProps {
  schema: JsonSchema;
  layout: Layout;
  path: string;
  direction: 'row' | 'column';
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

const DroppableLayout: React.FC<DroppableLayoutProps> = ({
  schema,
  layout,
  path,
  direction,
  renderers,
  cells,
}) => {
  const classes = useStyles();
  return (
    <Grid container wrap='nowrap' className={classes.droppableLayout} xs>
      <Grid item key={`${path}-${0}-icon`} className={classes.uiElementIcon}>
        {getLayoutIcon(layout)}
      </Grid>
      <Grid
        container
        item
        direction={direction}
        spacing={direction === 'row' ? 2 : 0}
        xs
      >
        {renderLayoutElementsWithDrops(
          layout,
          schema,
          path,
          classes,
          renderers,
          cells
        )}
      </Grid>
    </Grid>
  );
};
const getLayoutIcon = (layout: Layout) =>
  layout.type === 'HorizontalLayout' ? (
    <Height style={{ transform: 'rotate(90deg)' }} />
  ) : (
    <Height />
  );

const renderLayoutElementsWithDrops = (
  layout: Layout,
  schema: JsonSchema,
  path: string,
  classes: ClassNameMap<any>,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  return (
    <>
      <Grid item key={`${path}-${0}-drop`} className={classes.dropPoint} xs>
        <DropPoint index={0} layout={layout} />
      </Grid>
      {layout.elements.map((child, index) => (
        <React.Fragment key={`${path}-${index}-fragment`}>
          <Grid
            item
            key={`${path}-${index}`}
            className={classes.renderedContent}
            xs
          >
            <ResolvedJsonFormsDispatch
              uischema={child}
              schema={schema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          </Grid>
          <Grid
            item
            className={classes.dropPoint}
            key={`${path}-${index + 1}-drop`}
            xs
          >
            <DropPoint index={index + 1} layout={layout} />
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

interface DropPointProps {
  layout: Layout;
  index: number;
}

const DropPoint: React.FC<DropPointProps> = ({ layout, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [{ isOver, schemaElement, uiSchemaElement }, drop] = useDrop({
    accept: [SCHEMA_ELEMENT, UI_SCHEMA_ELEMENT],
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      schemaElement: mon.getItem()?.schemaElement,
      uiSchemaElement: mon.getItem()?.uiSchemaElement,
    }),
    drop: (): any => {
      if (schemaElement) {
        dispatch(
          Actions.addSchemaElementToLayout(schemaElement, layout, index)
        );
      } else if (uiSchemaElement) {
        dispatch(
          Actions.addUISchemaElementToLayout(uiSchemaElement, layout, index)
        );
      }
    },
  });

  return (
    <div
      ref={drop}
      className={classes.dropPointContent}
      style={{ fontSize: isOver ? '2em' : '1em' }}
      data-cy={`${getDataPath(layout)}-drop-${index}`}
    >
      [ ]
    </div>
  );
};

const getDataPath = (uischema: UISchemaElement): string => {
  const path = getUISchemaPath(uischema);
  if (isPathError(path)) {
    console.error('Could not calculate data-cy path for DropPoint', path);
    return '';
  }
  return path;
};

const createRendererInDirection = (direction: 'row' | 'column') => ({
  uischema,
  path,
  ...props
}: LayoutProps) => {
  const layout = uischema as Layout;
  return (
    <DroppableLayout
      {...props}
      path={path}
      layout={layout}
      direction={direction}
    />
  );
};

export const DroppableHorizontalLayoutRegistration = {
  tester: rankWith(10, uiTypeIs('HorizontalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('row')),
};
export const DroppableVerticalLayoutRegistration = {
  tester: rankWith(10, uiTypeIs('VerticalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('column')),
};
