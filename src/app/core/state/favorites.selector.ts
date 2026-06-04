import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InitialState } from "./favorites.reducer";

export const selectFavorites = createFeatureSelector<InitialState>('favorites')

export const selectFavoriteHouses = createSelector(
    selectFavorites,
    (state) => state.houses
)
export const selectFavoriteBooks = createSelector(
    selectFavorites,
    (state) => state.books
)
export const selectFavoriteCharacters = createSelector(
    selectFavorites,
    (state) => state.characters
)