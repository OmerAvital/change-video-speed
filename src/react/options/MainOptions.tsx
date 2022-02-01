import React, { FC } from 'react';
import { Tab } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { toTitleCase } from 'utils';
import { Button, Card, NumberInput } from 'components';
import { IStoredOptions } from 'chrome/storage';
import { AppDispatch, RootState } from 'redux/store';
import {
  resetOptions, setColorScheme, setMax, setMin, setOptions, saveOptions,
} from 'redux/options';
import { schemes } from '../colorScheme';

const ColorTab: FC = ({ children }) => (
  <Tab className="w-[calc(100%/3-0.5rem)] py-1 mx-1 my-1 rounded-full text-sm focus-visible:outline-yellow-400">
    {children}
  </Tab>
);

const colorSelectorWidth = 4 * schemes.length; // rem

const MainOptions: FC = () => {
  const {
    max, min, colorScheme,
  } = useSelector((opts: RootState) => opts.options) as IStoredOptions;
  const dispatch = useDispatch<AppDispatch>();

  const handleColorSchemeChange = (scheme: number) => {
    dispatch(setColorScheme(schemes[scheme]));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    dispatch(saveOptions());
  };

  const handleReset = () => {
    dispatch(resetOptions());
  };

  return (
    <main>
      <Card>
        <div className="pb-4 mb-6 border-b border-b-yellow-300/50 dark:border-b-yellow-700/50">
          <h1 className="text-3xl text-center font-semibold">Change Video Speed</h1>
          <p className="text-2xl text-center text-yellow-400 dark:text-yellow-600">Options</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit} onReset={handleReset}>
          <div className="flex items-stretch justify-evenly">
            <NumberInput
              id="min"
              name="min"
              label="Min"
              value={min}
              // avoid value checking until blur
              onChange={m => dispatch(setOptions({ min: m }))}
              onBlur={m => dispatch(setMin(m))}
              min={0}
              className="invalid:text-white dark:invalid:text-zinc-700"
            />
            <NumberInput
              id="max"
              name="max"
              label="Max"
              value={max}
              // avoid value checking until blur
              onChange={m => dispatch(setOptions({ max: m }))}
              onBlur={m => dispatch(setMax(m))}
              min={0}
              className="invalid:text-white dark:invalid:text-zinc-700"
            />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-base">Appearance</span>
            <div
              className="relative flex z-0 mt-1.5 bg-white rounded-full shadow-sm
                         dark:bg-zinc-700 dark:shadow-zinc-900"
              style={{ width: `${colorSelectorWidth}rem` }}
            >
              <Tab.Group
                key={colorScheme}
                defaultIndex={schemes.indexOf(colorScheme)}
                onChange={handleColorSchemeChange}
              >
                <Tab.List className="flex w-full">
                  {schemes.map(scheme => <ColorTab key={scheme}>{toTitleCase(scheme)}</ColorTab>)}
                </Tab.List>
              </Tab.Group>
              <div
                className="absolute top-0 left-0 m-1 h-[calc(100%-0.5rem)] -z-10
                           rounded-full bg-yellow-400/50 dark:bg-yellow-500/50 transition-transform duration-150"
                style={{
                  transform: `translateX(${schemes.indexOf(colorScheme) * (colorSelectorWidth / schemes.length)}rem)`,
                  width: `${colorSelectorWidth / schemes.length - 0.5}rem`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-evenly space-x-3">
            <Button className="text-[1rem]" type="submit">Save</Button>
            <Button className="text-[1rem]" type="reset">Reset</Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

export default MainOptions;
