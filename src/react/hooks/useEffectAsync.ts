import { useEffect, useCallback, DependencyList } from 'react';

const useEffectAsync = (effect: () => void, deps: DependencyList): void => {
  const callback = useCallback(effect, deps);

  useEffect(callback, deps);
};

export default useEffectAsync;
