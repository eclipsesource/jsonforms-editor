/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Button, Collapse } from '@material-ui/core';
import React, { useState } from 'react';
export interface ShowMoreLessProps {
  className?: string;
}

export const ShowMoreLess: React.FC<ShowMoreLessProps> = ({
  className,
  children,
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className={className}>
      <Collapse in={showMore}>{children}</Collapse>
      <Button
        size='small'
        onClick={() => {
          setShowMore((oldState) => !oldState);
        }}
      >
        {showMore ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
};
