import React, { useReducer, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import NumberInput from '../components/NumberInput';
import Button from '../components/Button';
import { updateScheme, schemes, getScheme } from '../colorScheme';
import useEffectAsync from '../hooks/useEffectAsync';
import { toTitleCase } from '../../utils';
import {
  DEFAULT_OPTIONS, getStoredOptions, IStoredOptions, setStoredOptions,
} from '../../storage';
import { OptionsActionTypes, optionsReducer } from './optionsReducer';
import Card from '../components/Card';
import Developer from './Developer';

interface ColorTabProps {
  children: React.ReactNode | React.ReactNode[];
}

function ColorTab({ children }: ColorTabProps): React.ReactElement {
  return (
    <Tab className="w-[calc(100%/3-0.5rem)] py-1 mx-1 my-1 rounded-full text-sm focus-visible:outline-yellow-400">
      {children}
    </Tab>
  );
}

const colorSelectorWidth = 4 * schemes.length; // rem
const initialOptions: IStoredOptions = {
  ...DEFAULT_OPTIONS,
  min: -1,
  max: -1,
};

function OptionsPage(): React.ReactElement {
  const [state, dispatch] = useReducer(optionsReducer, initialOptions);

  useEffect(getScheme, []);
  useEffectAsync(async () => {
    const data = await getStoredOptions();
    dispatch({ type: OptionsActionTypes.SET_OPTIONS, payload: data });
  }, []);

  const handleColorSchemeChange = (scheme: number) => {
    const colorScheme = schemes[scheme];
    dispatch({ type: OptionsActionTypes.SET_COLOR_SCHEME, payload: { colorScheme } });
    updateScheme(colorScheme);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Don't overwrite the stored speed and developerMode options
    setStoredOptions({
      min: state.min,
      max: state.max,
      colorScheme: state.colorScheme,
    });
  };

  const handleReset = () => {
    dispatch({ type: OptionsActionTypes.RESET_OPTIONS });
    // Don't overwrite the stored speed and developerMode options
    setStoredOptions({
      max: DEFAULT_OPTIONS.max,
      min: DEFAULT_OPTIONS.min,
      colorScheme: DEFAULT_OPTIONS.colorScheme,
    });
    updateScheme(DEFAULT_OPTIONS.colorScheme);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-700 font-sans dark:bg-zinc-900 dark:text-zinc-300 select-none">
      <div className="max-w-3xl min-w-fit mx-auto p-7 space-y-4">
        <main>
          <Card>
            <div className="pb-4 mb-6 border-b border-b-yellow-300/50 dark:border-b-yellow-700/50">
              <h1 className="text-3xl text-center font-black">Change Video Speed</h1>
              <p className="text-2xl text-center text-yellow-400 dark:text-yellow-600">Options</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit} onReset={handleReset}>
              <div className="flex items-stretch justify-evenly">
                <NumberInput
                  id="min"
                  name="min"
                  label="Min"
                  value={state.min}
                  onChange={min => dispatch({ type: OptionsActionTypes.SET_OPTIONS, payload: { min } })}
                  onBlur={min => dispatch({ type: OptionsActionTypes.SET_MIN, payload: { min } })}
                  min={0}
                  className="invalid:text-white dark:invalid:text-zinc-700"
                />
                <NumberInput
                  id="max"
                  name="max"
                  label="Max"
                  value={state.max}
                  onChange={max => dispatch({ type: OptionsActionTypes.SET_OPTIONS, payload: { max } })}
                  onBlur={max => dispatch({ type: OptionsActionTypes.SET_MAX, payload: { max } })}
                  min={0}
                  className="invalid:text-white dark:invalid:text-zinc-700"
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-base">Appearance</span>
                {/* Setting key to state to rerender every time the state changes and go to the default index. */}
                {/* This enables programmatically changing which one is chosen. */}
                {/* https://github.com/tailwindlabs/headlessui/discussions/742#discussioncomment-1661403 */}
                <Tab.Group key={state.colorScheme} defaultIndex={schemes.indexOf(state.colorScheme)} onChange={handleColorSchemeChange}>
                  <Tab.List
                    className="relative flex z-0 mt-1.5 bg-white rounded-full shadow-sm dark:bg-zinc-700 dark:shadow-zinc-900"
                    style={{ width: `${colorSelectorWidth}rem` }}
                  >
                    {schemes.map(scheme => <ColorTab key={scheme}>{toTitleCase(scheme)}</ColorTab>)}
                    <div
                      className="absolute -z-10 top-0 left-0 m-1 h-[calc(100%-0.5rem)] rounded-full bg-yellow-400/50 transition-transform duration-150"
                      style={{
                        transform: `translateX(${schemes.indexOf(state.colorScheme) * (colorSelectorWidth / schemes.length)}rem)`,
                        width: `${colorSelectorWidth / schemes.length - 0.5}rem`,
                      }}
                    />
                  </Tab.List>
                </Tab.Group>
              </div>

              <div className="flex justify-evenly">
                <Button className="text-[1rem]" type="submit">Save</Button>
                <Button className="text-[1rem]" type="reset">Reset</Button>
              </div>
            </form>
          </Card>
        </main>

        <Developer />
      </div>
    </div>
  );
}
export default OptionsPage;
