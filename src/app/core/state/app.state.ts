import { ActionReducerMap } from '@ngrx/store';
import { favoritesReducer, InitialState } from './favorites.reducer';

export interface AppState {
  favorites: InitialState
}

export const appReducers: ActionReducerMap<AppState> = {
    favorites: favoritesReducer
}