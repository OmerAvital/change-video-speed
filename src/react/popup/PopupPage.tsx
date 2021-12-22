import React, { useEffect, useState } from 'react';
import { CogIcon as CogIconOutline } from '@heroicons/react/outline';
import { CogIcon as CogIconSolid } from '@heroicons/react/solid';
import Button from '../components/Button';
import { getScheme } from '../colorScheme';
import {
  DEFAULT_OPTIONS,
  DEFAULT_SPEED, getSpeed, getStoredOptions, IStoredOptions, setStoredOptions,
} from '../../storage';
import useEffectAsync from '../hooks/useEffectAsync';
import changeSpeed from '../../changeSpeed';

function OptionsBtn(): React.ReactElement {
  const [optionsHovering, setOptionsHovering] = useState(false);

  return (
    <a
      href={`chrome-extension://${chrome.runtime.id}/options.html`}
      target="_blank"
      className="aspect-square h-4 absolute bottom-2 right-2"
      rel="noreferrer"
      onMouseEnter={() => setOptionsHovering(true)}
      onMouseLeave={() => setOptionsHovering(false)}
      title="Options"
    >
      {optionsHovering
        ? <CogIconSolid className="fill-zinc-700 dark:fill-zinc-500" />
        : <CogIconOutline className="stroke-zinc-700 dark:stroke-zinc-500" />}
    </a>
  );
}

function PopupPage(): React.ReactElement {
  const [options, setOptions] = useState<IStoredOptions>();
  const [speed, setSpeed] = useState<number>();
  const [tabId, setTabId] = useState<number>();

  useEffect(getScheme, []);

  useEffectAsync(async () => {
    const { tabId: id, speed: s } = await getSpeed();
    setSpeed(s);
    setTabId(id);
    setOptions(await getStoredOptions());
  }, []);

  useEffect(() => {
    if (!tabId || !speed) return;
    changeSpeed(tabId, speed);
  }, [speed]);

  return (
    <div className="flex flex-col gap-2 items-center p-6 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-sans">
      <input
        type="range"
        id="speed"
        min={options?.min || DEFAULT_OPTIONS.min}
        max={options?.max || DEFAULT_OPTIONS.max}
        step="0.1"
        value={speed ?? DEFAULT_SPEED}
        onChange={ev => setSpeed(ev.target.valueAsNumber)}
        className="w-36 h-2 rounded-full shadow bg-white appearance-none dark:bg-zinc-700"
      />
      <label htmlFor="speed" className="text-base mt-1">
        {speed}
        x
      </label>
      <Button onClick={() => setSpeed(DEFAULT_SPEED)}>Reset</Button>
      <OptionsBtn />
    </div>
  );
}

export default PopupPage;
