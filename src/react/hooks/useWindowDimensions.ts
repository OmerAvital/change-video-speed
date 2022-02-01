import { useState } from 'react';
import { useEvent } from 'react-use';

const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEvent('resize', () => setWindowDimensions(getWindowDimensions()));
  return windowDimensions;
};

export default useWindowDimensions;
