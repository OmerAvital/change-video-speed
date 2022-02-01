import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ColorScheme, defaultOptions, getStoredOptions, IStoredOptions, saveOptionsToStorage,
} from 'chrome/storage';
import { round } from 'utils';
import changeSpeed from 'chrome/changeSpeed';
import { updateScheme } from '../colorScheme';

interface SetSpeed {
  tabId?: number;
  speed: number;
}

const MIN_SPEED = 0.1;
const MAX_SPEED = 10;

export const fetchOptions = createAsyncThunk(
  'options/fetchOptions',
  async (): Promise<IStoredOptions> => {
    const opts = await getStoredOptions();
    updateScheme(opts.colorScheme);
    return opts;
  },
);

export const optionsSlice = createSlice({
  name: 'options',
  initialState: null as IStoredOptions | null,
  reducers: {
    setColorScheme(state, action: PayloadAction<ColorScheme>) {
      if (!state) return;
      state.colorScheme = action.payload;
    },
    setMin(state, action: PayloadAction<number>) {
      if (!state) return;
      const min = action.payload;
      if (min < MIN_SPEED) {
        state.min = MIN_SPEED;
        return;
      }
      if (min >= state.max) {
        state.min = state.max - 0.1;
        return;
      }
      state.min = min;
    },
    setMax(state, action: PayloadAction<number>) {
      if (!state) return;
      const max = action.payload;
      if (max > MAX_SPEED) {
        state.max = MAX_SPEED;
        return;
      }
      if (max <= state.min) {
        state.max = state.min + 0.1;
        return;
      }
      state.max = max;
    },
    /** Saves to storage. */
    setDeveloperMode(state, action: PayloadAction<boolean>) {
      if (!state) return;
      const developerMode = action.payload;
      state.developerMode = developerMode;
      void saveOptionsToStorage({ developerMode });
    },
    /** Saves to storage. */
    setSpeed(state, action: PayloadAction<SetSpeed>) {
      const { tabId, speed } = action.payload;
      if (!state || !tabId || speed < state.min || speed > state.max) return;

      state.speed[tabId] = round(speed, 1);
      void saveOptionsToStorage({ speed: state.speed });
      changeSpeed(tabId, speed);
    },
    setOptions(state, action: PayloadAction<Partial<IStoredOptions>>) {
      if (!state) return;
      (Object.keys(action.payload) as (keyof IStoredOptions)[]).forEach(key => {
        state[key] = action.payload[key] as never;
      });
    },
    /** Saves to storage. */
    resetOptions(state) {
      if (!state) return;
      state.colorScheme = defaultOptions.colorScheme;
      state.min = defaultOptions.min;
      state.max = defaultOptions.max;
      state.speed = defaultOptions.speed;
      void saveOptionsToStorage(state);
    },
    /** Saves to storage. */
    saveOptions(state) {
      if (!state) return;
      void saveOptionsToStorage(state);
    },
  },
  extraReducers: {
    [fetchOptions.fulfilled.type]: (state, action: PayloadAction<IStoredOptions>) => action.payload,
  },
});

export const {
  setColorScheme, setMin, setMax, setDeveloperMode, setSpeed, setOptions, resetOptions, saveOptions,
} = optionsSlice.actions;
export default optionsSlice.reducer;
