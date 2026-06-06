import { createReducer, on } from '@ngrx/store';
import { BaseItem } from '../models/list.model';
import { FavoritesActions } from './favorites.action';

// export const initialState: Readonly<BaseItem[]> = [];

export interface InitialState {
  houses: BaseItem[];
  books: BaseItem[];
  characters: BaseItem[];
}

export const initialState: InitialState = {
  houses: [],
  books: [],
  characters: [],
};

export const favoritesReducer = createReducer(
  initialState,
  on(FavoritesActions.addFavorites, (state, { itemType, item }) => {
    const stateItems = state[itemType] || [];
    const isAlreadyAFavorite = stateItems.some((fav) => fav.url === item.url);

    if (!isAlreadyAFavorite) {
      return {
        ...state,
        [itemType]: [...stateItems, item],
      };
    } else {
      return state;
    }
  }),
  on(FavoritesActions.removeFavorites, (state, { itemType, item }) => {
    const stateItems = state[itemType] || [];
    return {
      ...state,
      [itemType]: stateItems.filter((fav) => fav.url !== item.url),
    };
  }),
  on(FavoritesActions.logout,() => initialState)
);
