/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { act, render } from '@testing-library/react';
import React from 'react';

import { JsonFormsEditor } from './JsonFormsEditor';
import { defaultSchemaDecorators } from './properties/schemaDecorators';
import { propertySchemaProvider } from './properties/schemaProviders';

test('renders header', async () => {
  // components with 'useEffect' need to be awaited
  const container = render(<div />);
  await act(async () => {
    render(
      <JsonFormsEditor
        schemaProviders={[propertySchemaProvider]}
        schemaDecorators={defaultSchemaDecorators}
      />,
      container
    );
  });
  const titleElement = container.getByText(/JSON Forms Editor/i);
  expect(titleElement).toBeInTheDocument();
});
