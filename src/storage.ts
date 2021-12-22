export type ColorScheme = 'auto' | 'light' | 'dark';

/**
 * { tabId: speed }
 */
export type Speed = Record<number, number>;

export interface TabSpeed {
  tabId: number;
  speed: number;
}

export interface IStoredOptions {
  colorScheme: ColorScheme;
  min: number;
  max: number;
  speed: Speed;
  developerMode: boolean;
}

export const DEFAULT_OPTIONS: IStoredOptions = {
  colorScheme: 'auto',
  min: 0.5,
  max: 2,
  speed: {},
  developerMode: false,
};

export const DEFAULT_SPEED = 1;

export async function getStoredOptions(): Promise<IStoredOptions> {
  const data = await chrome.storage.local.get(Object.keys(DEFAULT_OPTIONS));
  return {
    ...DEFAULT_OPTIONS,
    ...data,
  };
}

// eslint-disable-next-line no-unused-vars
export async function setStoredOptions(data: Partial<IStoredOptions> | ((currentData: IStoredOptions) => Partial<IStoredOptions>)): Promise<void> {
  let theData = data;
  if (typeof data === 'function') {
    const currentData = await getStoredOptions();
    theData = data(currentData);
  }
  await chrome.storage.local.set(theData);
}

export async function getTabId(): Promise<number> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
      if (!id) {
        reject(new Error('No active tab'));
        return;
      }
      resolve(id);
    });
  });
}

export async function getSpeed(): Promise<TabSpeed> {
  const { speed } = await getStoredOptions();
  const tabId = await getTabId();
  return { tabId, speed: speed[tabId] || DEFAULT_SPEED };
}

export async function setSpeed(tabId: number, speed: number) {
  await setStoredOptions(currentData => {
    const newSpeed = { ...currentData.speed, [tabId]: speed };
    return { ...currentData, speed: newSpeed };
  });
}

export async function removeSpeed(tabId: number) {
  await setStoredOptions(currentData => {
    const newSpeed = { ...currentData.speed };
    delete newSpeed[tabId];
    return { ...currentData, speed: newSpeed };
  });
}
