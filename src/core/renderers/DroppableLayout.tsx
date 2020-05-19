import { Grid, makeStyles } from '@material-ui/core';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  Layout,
  LayoutProps,
  UISchemaElement,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import {
  ResolvedJsonFormsDispatch,
  withJsonFormsLayoutProps,
} from '@jsonforms/react';

import { Actions } from '../model';
import React from 'react';
import { SCHEMA_ELEMENT } from '../dnd';
import { getUISchemaPath } from '../model/uischema';
import { isPathError } from '../util/clone';
import { useDispatch } from '../context';
import { useDrop } from 'react-dnd';

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
  return (
    <Grid container direction={direction} spacing={direction === 'row' ? 2 : 0}>
      {renderLayoutElementsWithDrops(layout, schema, path, renderers, cells)}
    </Grid>
  );
};

const renderLayoutElementsWithDrops = (
  layout: Layout,
  schema: JsonSchema,
  path: string,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  return (
    <>
      <Grid item key={`${path}-${0}-drop`} xs>
        <DropPoint index={0} layout={layout} />
      </Grid>
      {layout.elements.map((child, index) => (
        <React.Fragment key={`${path}-${index}-fragment`}>
          <Grid item key={`${path}-${index}`} xs>
            <ResolvedJsonFormsDispatch
              uischema={child}
              schema={schema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          </Grid>
          <Grid item key={`${path}-${index + 1}-drop`} xs>
            <DropPoint index={index + 1} layout={layout} />
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  dropPoint: {
    textAlign: 'center',
  },
}));

interface DropPointProps {
  layout: Layout;
  index: number;
}

const DropPoint: React.FC<DropPointProps> = ({ layout, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [{ isOver, schemaElement }, drop] = useDrop({
    accept: SCHEMA_ELEMENT,
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      schemaElement: mon.getItem()?.schemaElement,
    }),
    drop: (): any => {
      dispatch(Actions.addSchemaElementToLayout(schemaElement, layout, index));
    },
  });

  return (
    <div
      ref={drop}
      className={classes.dropPoint}
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
