import React from 'react';

interface FormattedJsonProps {
  object?: any;
}

export const FormattedJson: React.FC<FormattedJsonProps> = (object) => {
  return <pre>{JSON.stringify(object, null, 2)}</pre>;
};
