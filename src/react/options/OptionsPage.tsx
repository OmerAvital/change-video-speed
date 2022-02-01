import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';
import { fetchOptions, setOptions } from 'redux/options';
import { IStoredOptions } from 'chrome/storage';
import { clean } from 'utils';
import MainOptions from './MainOptions';
import Developer from './Developer';
import { updateScheme, watchScheme } from '../colorScheme';

const OptionsPage: FC = () => {
  const options = useSelector((state: RootState) => state.options);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    watchScheme();
    void dispatch(fetchOptions());

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== 'local') return;
      const newOpts: Partial<IStoredOptions> = Object.fromEntries(
        Object.entries(changes).map(([key, { newValue }]) => [key, newValue]),
      );
      dispatch(setOptions(newOpts));
    });
  }, []);
  useEffect(() => {
    if (options?.colorScheme) {
      updateScheme(options.colorScheme);
    }
  }, [options?.colorScheme]);

  return (
    <div className="min-w-fit max-w-4xl mx-auto p-7 space-y-4">
      {options && (
        <>
          <MainOptions />
          <Developer />
        </>
      )}
    </div>
  );
};
export default OptionsPage;
