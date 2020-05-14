import React from 'react';

interface FormattedJsonProps {
  object: any;
}

export const FormattedJson: React.FC<FormattedJsonProps> = (object: any) => {
  return <pre>{JSON.stringify(object, null, 2)}</pre>;
};
