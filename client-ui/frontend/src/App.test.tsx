import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Header component', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Evenemangskalendern/i);
  expect(linkElement).toBeInTheDocument();
});
