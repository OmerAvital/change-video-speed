// Based off of https://www.joshwcomeau.com/react/prefers-reduced-motion/
import { useState, useRef } from 'react';
import { useEvent } from 'react-use';

const QUERY = '(prefers-reduced-motion: no-preference)';
const getInitialState = () => !window.matchMedia(QUERY).matches;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);
  const { current: mediaQueryList } = useRef(window.matchMedia(QUERY));
  useEvent('change', () => setPrefersReducedMotion(!mediaQueryList.matches), mediaQueryList);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
