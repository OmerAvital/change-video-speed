import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { CogIcon as CogIconOutline, PlusIcon, MinusIcon } from '@heroicons/react/outline';
import { CogIcon as CogIconSolid } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SPEED, getTabId } from 'chrome/storage';
import { AppDispatch, RootState } from 'redux/store';
import { fetchOptions, setSpeed } from 'redux/options';
import { Button, IconBtn } from 'components';
import { useAsync } from 'react-use';
import Developer from './Developer';
import { watchScheme } from '../colorScheme';

const OptionsBtn: FC = () => {
  const [hovering, setHovering] = useState(false);

  return (
    <button
      className="h-[1.125rem] w-[1.125rem] self-end"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => chrome.runtime.openOptionsPage()}
      title="Go to Options Page"
      type="button"
    >
      {hovering
        ? <CogIconSolid className="fill-zinc-700 dark:fill-zinc-500" />
        : <CogIconOutline className="stroke-zinc-700 dark:stroke-zinc-500" />}
    </button>
  );
};

const PopupPage: FC = () => {
  const options = useSelector((state: RootState) => state.options);
  const dispatch = useDispatch<AppDispatch>();

  const tabId = useRef(-1);
  const speed = (): number => options.speed[tabId.current] ?? DEFAULT_SPEED;

  useEffect(() => {
    watchScheme();
    void dispatch(fetchOptions());
  }, [dispatch]);
  useAsync(async () => {
    tabId.current = await getTabId() ?? -1;
  }, []);

  return (
    <div className="flex p-1">
      <Developer tabId={tabId.current} />

      <div className="mt-4 flex flex-col gap-2 items-center justify-items-center">
        <input
          type="range"
          id="speed"
          min={options.min}
          max={options.max}
          step="0.1"
          value={speed()}
          onChange={ev => {
            dispatch(setSpeed({ speed: ev.target.valueAsNumber, tabId: tabId.current }));
          }}
          className="mx-5 w-36 h-2 rounded-full shadow bg-white appearance-none dark:bg-zinc-700"
        />

        <div className="flex items-center">
          <IconBtn
            onClick={() => dispatch(setSpeed({ speed: speed() - 0.1, tabId: tabId.current }))}
            disabled={speed() <= options.min}
          >
            <MinusIcon />
          </IconBtn>
          <label htmlFor="speed" className="w-14 mt-1 text-sm text-center font-medium">
            {speed()}x
          </label>
          <IconBtn
            onClick={() => dispatch(setSpeed({ speed: speed() + 0.1, tabId: tabId.current }))}
            disabled={speed() >= options.max}
          >
            <PlusIcon />
          </IconBtn>
        </div>

        <Button onClick={() => dispatch(setSpeed({ speed: DEFAULT_SPEED, tabId: tabId.current }))}>
          Reset
        </Button>
        <OptionsBtn />
      </div>
    </div>
  );
};

export default PopupPage;
