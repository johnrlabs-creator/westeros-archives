import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { DetailsApi } from '../../services/details-api';
import { BaseItem, FavoriteType } from '../../core/models/list.model';
import { Store } from '@ngrx/store';
import { FavoritesActions } from '../../core/state/favorites.action';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  router = inject(Router);
  detailsApiService = inject(DetailsApi);
  route = inject(ActivatedRoute);
  store = inject(Store);

  item: any;

  listType = toSignal(
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.split('/')[1]),
    ),
  );

  id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id')!)), { initialValue: '' });

  ngOnInit(): void {
    console.log(this.listType());
    this.getItemDetails();
  }

  getItemDetails() {
    this.detailsApiService.getDetailsApi(this.listType()!, this.id()).subscribe((res) => {
      console.log('res: ', res);
      this.item = res;
    });
  }

  addToFavorites() {
    this.store.dispatch(
      FavoritesActions.addFavorites({
        itemType: this.listType() as FavoriteType,
        item: this.item,
      }),
    );
    console.log('add to fav: ', this.listType(), this.item);
  }

  removeFromFavorites() {
    this.store.dispatch(
      FavoritesActions.removeFavorites({
        itemType: this.listType() as FavoriteType,
        item: this.item,
      }),
    );
  }
}
