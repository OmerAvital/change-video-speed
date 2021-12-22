import { DEFAULT_OPTIONS, IStoredOptions, setStoredOptions } from '../../storage';
import { schemes } from '../colorScheme';

export enum OptionsActionTypes {
  SET_OPTIONS = 'SET_OPTIONS',
  SET_COLOR_SCHEME = 'SET_COLOR_SCHEME',
  SET_MIN = 'SET_MIN',
  SET_MAX = 'SET_MAX',
  TOGGLE_DEVELOPER_MODE = 'TOGGLE_DEVELOPER_MODE',
  RESET_OPTIONS = 'RESET_OPTIONS',
}

const MIN = 0.1;
const MAX = 10;

export interface IAction {
  type: OptionsActionTypes;
  payload?: Partial<IStoredOptions>;
}

export function optionsReducer(state: IStoredOptions, action: IAction) {
  const {
    colorScheme, min, max,
  } = action.payload || {};
  switch (action.type) {
    case OptionsActionTypes.SET_COLOR_SCHEME:
      if (!colorScheme || schemes.indexOf(colorScheme) === -1) return state;
      return { ...state, colorScheme };

    case OptionsActionTypes.SET_MIN:
      if (!min) return state;
      if (min < MIN) return { ...state, min: MIN };
      if (min > state.max) return { ...state, min: state.max - 0.1 };
      return { ...state, min };

    case OptionsActionTypes.SET_MAX:
      if (!max) return state;
      if (max > MAX) return { ...state, max: MAX };
      if (max < state.min) return { ...state, max: state.min + 0.1 };
      return { ...state, max };

    case OptionsActionTypes.SET_OPTIONS:
      return { ...state, ...action.payload };

    case OptionsActionTypes.TOGGLE_DEVELOPER_MODE:
      setStoredOptions({ developerMode: !state.developerMode });
      return { ...state, developerMode: !state.developerMode };

    case OptionsActionTypes.RESET_OPTIONS:
      return DEFAULT_OPTIONS;

    default:
      return state;
  }
}
