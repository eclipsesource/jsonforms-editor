import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('renders header', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/JSON Forms Editor/i);
  expect(titleElement).toBeInTheDocument();
});
