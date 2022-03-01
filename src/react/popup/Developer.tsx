import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { DEFAULT_SPEED } from 'chrome/storage';

interface DeveloperProps {
  tabId: number;
}

interface ItemProps {
  label: string | number | undefined;
  value: string | number | undefined;
}

const Item: FC<ItemProps> = ({ label, value }) => (
  <div>
    <span className="font-bold">{label}: </span>
    <span>{value}</span>
  </div>
);

const Developer: FC<DeveloperProps> = ({ tabId }) => {
  const options = useSelector((state: RootState) => state.options);

  if (!options.developerMode) return null;
  return (
    <div className="w-28 px-1 py-1.5 border-r border-zinc-300 dark:border-zinc-600">
      <span className="block mb-1 font-semibold underline">Developer</span>
      <Item label="Tab id" value={tabId} />
      <Item
        label="Speed"
        value={options.speed[tabId] ?? DEFAULT_SPEED}
      />
      <Item
        label="Saved"
        value={options.speed[tabId] === undefined ? 'no' : 'yes'}
      />
      <Item label="Min" value={options.min} />
      <Item label="Max" value={options.max} />
    </div>
  );
};

export default Developer;
