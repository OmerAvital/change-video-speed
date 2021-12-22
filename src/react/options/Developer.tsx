import React, { useEffect, useState } from 'react';
import { Switch, Transition } from '@headlessui/react';
import Card from '../components/Card';
import useEffectAsync from '../hooks/useEffectAsync';
import { getStoredOptions, IStoredOptions, setStoredOptions } from '../../storage';
import useWindowDimensions from '../hooks/useWindowDimentions';

function Developer(): React.ReactElement {
  const [options, setOptions] = useState<IStoredOptions>();
  const [showSwitch, setShowSwitch] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>();
  const { width } = useWindowDimensions();

  useEffectAsync(async () => {
    const data = await getStoredOptions();
    setOptions(data);

    chrome.storage.onChanged.addListener(async (changes, namespace) => {
      if (namespace !== 'local') return;
      const d = await getStoredOptions();
      setOptions(d);
    });
  }, []);

  useEffect(() => {
    clearTimeout(timeoutId);
    if (options?.developerMode) {
      setShowSwitch(!options?.developerMode);
      return;
    }
    setTimeoutId(setTimeout(() => setShowSwitch(!options?.developerMode), 300) as unknown as number);
  }, [options?.developerMode]);

  return (
    <>
      {(showSwitch || width > 1280) && (
        <Switch.Group as={Card} className="flex items-center gap-3 w-fit py-2 px-3 rounded ml-auto xl:absolute xl:top-0 xl:right-4">
          <Switch.Label className="whitespace-nowrap">Developer Mode</Switch.Label>
          <Switch
            checked={Boolean(options?.developerMode)}
            onChange={() => setStoredOptions({ developerMode: !options?.developerMode })}
            className={`w-11 h-6 rounded-full transition-colors duration-200 ${options?.developerMode ? 'bg-yellow-400 dark:bg-yellow-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
          >
            <span className={`block w-5 h-5 m-0.5 rounded-full shadow bg-white dark:bg-zinc-300 transition-transform duration-200 ${options?.developerMode ? 'translate-x-5' : ''}`} />
          </Switch>
        </Switch.Group>
      )}

      <Transition
        enter="transition duration-300"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-full translate-y-0"
        leave="transition duration-100"
        leaveFrom="opacity-full translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        show={Boolean(options?.developerMode)}
      >
        <Card className="relative">
          {width < 1280 && (
          <Switch.Group as={Card} className="absolute flex items-center gap-3 w-fit py-2 px-3 rounded top-4 right-4 shadow-none border dark:border-zinc-700">
            <Switch.Label className="whitespace-nowrap">Developer Mode</Switch.Label>
            <Switch
              checked={options?.developerMode || false}
              onChange={() => setStoredOptions({ developerMode: !options?.developerMode })}
              className={`w-11 h-6 rounded-full transition-colors duration-200 ${options?.developerMode ? 'bg-yellow-400 dark:bg-yellow-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
            >
              <span className={`block w-5 h-5 m-0.5 rounded-full shadow bg-white dark:bg-zinc-300 transition-transform duration-200 ${options?.developerMode ? 'translate-x-5' : ''}`} />
            </Switch>
          </Switch.Group>
          )}

          <h2 className="text-xl font-black">Developer</h2>

          <div className="mt-4">
            <h3 className="text-base">Saved Data</h3>
            <code
              className="block p-2 mt-2 rounded bg-zinc-100 border dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 select-text"
            >
              <pre className="mt-1">
                {JSON.stringify(options, null, 2)}
              </pre>
            </code>
          </div>
        </Card>
      </Transition>
    </>
  );
}

export default Developer;
