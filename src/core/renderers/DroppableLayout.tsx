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
import React from 'react';
import { useDrop } from 'react-dnd';

import { useDispatch } from '../context';
import { UI_SCHEMA_ELEMENT } from '../dnd';
import { HorizontalIcon, VerticalIcon } from '../icons';
import { Actions } from '../model';
import { getUISchemaPath } from '../model/uischema';
import { isPathError } from '../util/clone';

const useLayoutStyles = makeStyles((theme) => ({
  dropPointGridItem: {
    padding: theme.spacing(1),
    width: '3em',
    maxWidth: '3em',
    minWidth: '3em',
    margin: 'auto',
  },
  jsonformsGridItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  droppableLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #D3D3D3',
    padding: theme.spacing(1),
  },
  iconGridItem: {
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
  const classes = useLayoutStyles();
  return (
    <Grid container wrap='nowrap' className={classes.droppableLayout} xs>
      <Grid item key={`${path}-${0}-icon`} className={classes.iconGridItem}>
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
  layout.type === 'HorizontalLayout' ? <HorizontalIcon /> : <VerticalIcon />;

const renderLayoutElementsWithDrops = (
  layout: Layout,
  schema: JsonSchema,
  path: string,
  classes: Record<'dropPointGridItem' | 'jsonformsGridItem', string>,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  return (
    <>
      <Grid
        item
        key={`${path}-${0}-drop`}
        className={classes.dropPointGridItem}
        xs
      >
        <DropPoint index={0} layout={layout} />
      </Grid>
      {layout.elements.map((child, index) => (
        <React.Fragment key={`${path}-${index}-fragment`}>
          <Grid
            item
            key={`${path}-${index}`}
            className={classes.jsonformsGridItem}
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
            className={classes.dropPointGridItem}
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

const useDropPointStyles = makeStyles({
  dropPoint: (props: { isOver: boolean }) => ({
    textAlign: 'center',
    fontSize: props.isOver ? '2em' : '1em',
  }),
});

const DropPoint: React.FC<DropPointProps> = ({ layout, index }) => {
  const dispatch = useDispatch();
  const [{ isOver, uiSchemaElement, schema }, drop] = useDrop({
    accept: [UI_SCHEMA_ELEMENT],
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      uiSchemaElement: mon.getItem()?.uiSchemaElement,
      schema: mon.getItem()?.schema,
    }),
    drop: (): any =>
      schema
        ? dispatch(
            Actions.addScopedElementToLayout(
              uiSchemaElement,
              layout,
              index,
              schema
            )
          )
        : dispatch(
            Actions.addUnscopedElementToLayout(uiSchemaElement, layout, index)
          ),
  });

  const classes = useDropPointStyles({ isOver });
  return (
    <div
      ref={drop}
      className={classes.dropPoint}
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
