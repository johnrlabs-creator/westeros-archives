import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFavoriteBooks, selectFavoriteCharacters, selectFavoriteHouses } from '../../core/state/favorites.selector';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UrlUtils } from '../../core/utils/url.utils';
import { Book, Character, FavoriteType, House } from '../../core/models/list.model';
import { FavoritesActions } from '../../core/state/favorites.action';
import { ToastService } from '../../services/toast-service';
@Component({
  selector: 'app-favorites',
  imports: [AsyncPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {

  store = inject(Store)
  router = inject(Router)
  urlUtils = inject(UrlUtils)
  toastService = inject(ToastService)

  houses$ = this.store.select(selectFavoriteHouses)
  characters$ = this.store.select(selectFavoriteCharacters)
  books$ = this.store.select(selectFavoriteBooks)

  activeTab = signal<string>('houses');

  viewDetails(item: any) {
    const id = this.urlUtils.getItemIdFromUrl(item.url);
    this.router.navigate(['/', this.activeTab(), id]);
  }

  removeFavorite(item: any, type: string) {
     this.store.dispatch(
          FavoritesActions.removeFavorites({
            itemType: type as FavoriteType,
            item: item,
          }),
        );
        this.toastService.show('Removed from Favorites', 'error');
  }
}
