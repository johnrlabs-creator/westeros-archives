import { createActionGroup, props } from "@ngrx/store";
import { BaseItem, FavoriteType } from "../models/list.model";


export const FavoritesActions = createActionGroup({
    source: 'Favorites',
    events: {
        'Add Favorites': props<{itemType: FavoriteType; item: BaseItem}>(),
        'Remove Favorites': props<{itemType: FavoriteType; item: BaseItem}>()
    }
})
 