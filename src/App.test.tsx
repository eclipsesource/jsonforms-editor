import App from './App';
import React from 'react';
import { render } from '@testing-library/react';

test('renders header', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/JSON Forms Editor/i);
  expect(titleElement).toBeInTheDocument();
});
