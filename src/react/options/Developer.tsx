import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { Switch, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoredOptions, IStoredOptions } from 'chrome/storage';
import { Card, CodeBlock, CustomSwitch } from 'components';
import { useWindowDimensions } from 'hooks';
import { AppDispatch, RootState } from 'redux/store';
import { setDeveloperMode } from 'redux/options';
import { useAsync } from 'react-use';

const Developer: FC = () => {
  const options = useSelector((opts: RootState) => opts.options) as IStoredOptions;
  const dispatch = useDispatch<AppDispatch>();

  const [savedOptions, setSavedOptions] = useState<IStoredOptions>();

  const [showSwitch, setShowSwitch] = useState(true);
  const timeoutId = useRef<number>();
  const isFirstRender = useRef(true);
  const { width } = useWindowDimensions();

  useAsync(async () => {
    if (isFirstRender.current) {
      setTimeout(() => { isFirstRender.current = false; }, 100);
    }

    setSavedOptions(await getStoredOptions());

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== 'local') return;
      const newOpts: Partial<IStoredOptions> = Object.fromEntries(
        Object.entries(changes).map(([key, { newValue }]) => [key, newValue]),
      );
      setSavedOptions(opts => ({ ...opts, ...newOpts } as IStoredOptions));
    });
  }, []);
  useEffect(() => {
    clearTimeout(timeoutId.current);
    if (options.developerMode) {
      setShowSwitch(false);
      return;
    }
    timeoutId.current = setTimeout(() => {
      setShowSwitch(true);
    }, 200) as unknown as number;
  }, [options.developerMode]);

  return (
    <>
      {/* Switch */}
      <Transition
        enter={isFirstRender.current ? '' : 'transition duration-150'}
        enterFrom="opacity-0"
        enterTo="opacity-full"
        show={showSwitch || width >= 1280}
        className="w-fit ml-auto  xl:absolute xl:top-0 xl:right-4"
      >
        <Switch.Group as={Card} className="flex items-center gap-3 py-2 px-3 rounded">
          <Switch.Label className="whitespace-nowrap">Developer Mode</Switch.Label>
          <CustomSwitch
            checked={options.developerMode}
            onChange={checked => dispatch(setDeveloperMode(checked))}
          />
        </Switch.Group>
      </Transition>

      <Transition
        enter={isFirstRender.current ? '' : 'transition duration-300'}
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-full translate-y-0"
        leave="transition duration-100"
        leaveFrom="opacity-full translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        show={Boolean(options.developerMode)}
      >
        <Card className="relative max-w-4xl mx-auto">
          {/* Switch */}
          {width < 1280 && (
            <Switch.Group
              as={Card}
              className="absolute top-4 right-4 flex items-center gap-3 w-fit py-2 px-3
                       rounded shadow-none border dark:border-zinc-700"
            >
              <Switch.Label className="whitespace-nowrap">Developer Mode</Switch.Label>
              <CustomSwitch
                checked={options.developerMode}
                onChange={checked => dispatch(setDeveloperMode(checked))}
              />
            </Switch.Group>
          )}

          <h2 className="text-xl font-bold">Developer</h2>

          <div className="mt-2">
            <h3 className="text-base">Saved Data</h3>
            <CodeBlock>
              {JSON.stringify(savedOptions, null, 2)}
            </CodeBlock>
          </div>
        </Card>
      </Transition>
    </>
  );
};

export default Developer;
