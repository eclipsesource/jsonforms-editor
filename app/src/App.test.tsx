/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { act, render } from '@testing-library/react';
import React from 'react';

import { App } from './App';

test('renders header', async () => {
  // components with 'useEffect' need to be awaited
  const container = render(<div />);
  await act(async () => {
    render(<App />, container);
  });
  const titleElement = container.getByText(/JSON Forms Editor/i);
  expect(titleElement).toBeInTheDocument();
});
