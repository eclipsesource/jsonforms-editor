import { useEffect, useRef, useState } from 'react';

/**
 * Transforms the given element whenever it changes.
 */
export const useTransform = <T1, T2>(
  element: T1,
  transform: (el: T1) => T2
) => {
  const [transformedElement, setTransformedElement] = useState(
    transform(element)
  );
  useEffectAfterInit(() => setTransformedElement(transform(element)), [
    element,
    transform,
  ]);
  return transformedElement;
};

/**
 * Hook similar to `useEffect` with the difference that the effect
 * is only executed from the second call onwards.
 */
const useEffectAfterInit = (effect: () => void, dependencies: Array<any>) => {
  const firstExecution = useRef(true);
  useEffect(() => {
    if (firstExecution.current) {
      firstExecution.current = false;
      return;
    }
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
};
