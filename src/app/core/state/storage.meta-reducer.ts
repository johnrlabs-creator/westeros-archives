import { ActionReducer } from '@ngrx/store';
import { AppState } from './app.state';

const STORAGE_KEY = 'app_state';

export function storageMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    if (state === undefined) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return reducer(JSON.parse(stored), action);
      }
    }

    const nextState = reducer(state, action);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      favorites: nextState.favorites,
    }));

    return nextState;
  };
}