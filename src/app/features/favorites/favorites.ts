import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFavoriteBooks, selectFavoriteCharacters, selectFavoriteHouses } from '../../core/state/favorites.selector';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-favorites',
  imports: [AsyncPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit{

  store = inject(Store)

  houses$ = this.store.select(selectFavoriteHouses)
  characters$ = this.store.select(selectFavoriteCharacters)
  books$ = this.store.select(selectFavoriteBooks)

  ngOnInit(): void {
    
  }
}
