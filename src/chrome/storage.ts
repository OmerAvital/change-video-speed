export type ColorScheme = 'auto' | 'light' | 'dark';
export type Speed = { [tabId: number]: number };

export interface IStoredOptions {
  colorScheme: ColorScheme;
  min: number;
  max: number;
  speed: Speed;
  developerMode: boolean;
}

export const defaultOptions: IStoredOptions = {
  colorScheme: 'auto',
  min: 0.5,
  max: 2,
  speed: {},
  developerMode: false,
};

export const DEFAULT_SPEED = 1;

export async function getStoredOptions(): Promise<IStoredOptions> {
  const data = await chrome.storage.local.get(Object.keys(defaultOptions));
  return {
    ...defaultOptions,
    ...data,
  };
}

export async function saveOptionsToStorage(data: Partial<IStoredOptions>): Promise<void> {
  await chrome.storage.local.set(data);
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

export async function removeSpeed(tabId: number): Promise<void> {
  const { speed } = await getStoredOptions();
  delete speed[tabId];
  await saveOptionsToStorage({ speed });
}
