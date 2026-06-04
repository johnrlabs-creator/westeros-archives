import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, forkJoin, map, of, switchMap } from 'rxjs';
import { DetailsApi } from '../../services/details-api';
import { Book, Character, FavoriteType, House, Types } from '../../core/models/list.model';
import { Store } from '@ngrx/store';
import { FavoritesActions } from '../../core/state/favorites.action';
import { TYPES } from '../..';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { UrlUtils } from '../../core/utils/url.utils';
import { ToastService } from '../../services/toast-service';
import { Location } from '@angular/common';

// Limit more info to display to avoid heavy load on http requests
const MORE_INFO_LIMIT = 5;

@Component({
  selector: 'app-details',
  imports: [KeyValuePipe, TitleCasePipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  router = inject(Router);
  detailsApiService = inject(DetailsApi);
  route = inject(ActivatedRoute);
  store = inject(Store);
  urlUtils = inject(UrlUtils);
  destroyRef = inject(DestroyRef);
  toastService = inject(ToastService);
  location = inject(Location);

  house = signal<House>(<House>{});
  character = signal<Character>(<Character>{});
  book = signal<Book>(<Book>{});
  showToast = signal<boolean>(false);

  isAddedToFavorites: boolean = false;

  listType = toSignal(
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.split('/')[1]),
    ),
  );

  id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id')!)), { initialValue: '' });

  ngOnInit(): void {
    this.getItemDetails();
  }

  getItemDetails() {
    switch (this.listType()) {
      case TYPES.HOUSES:
        return this.loadHouseDetails();
      case TYPES.CHARACTERS:
        return this.loadCharacterDetails();
      case TYPES.BOOKS:
        return this.loadBookDetails();
    }
  }

  loadHouseDetails() {
    this.detailsApiService
      .getHouse(this.id())
      .pipe(
        switchMap((house) => this.getHouseRelations(house)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((house) => this.house.set(house));
  }

  loadCharacterDetails() {
    this.detailsApiService
      .getCharacter(this.id())
      .pipe(
        switchMap((character) => this.getCharacterBio(character)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((character) => this.character.set(character));
  }

  loadBookDetails() {
    this.detailsApiService
      .getBook(this.id())
      .pipe(
        switchMap((book) => this.getBookInfo(book)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((book) => {
        this.book.set(book as Book);
      });
  }

  getHouseRelations(house: House) {
    return forkJoin({
      swornMembers: this.getCharacters(house.swornMembers),
      founder: this.getCharacter(house.founder),
      heir: this.getCharacter(house.heir),
      currentLord: this.getCharacter(house.currentLord),
      overlord: this.getCharacter(house.overlord),
    }).pipe(
      map(({ swornMembers, founder, heir, currentLord, overlord }) => ({
        ...house,
        swornMembers: swornMembers.map((m) => m?.name ?? 'Unknown'),
        founder: founder?.name ?? 'Unknown',
        heir: heir?.name ?? 'Unknown',
        currentLord: currentLord?.name ?? 'Unknown',
        overlord: overlord?.name ?? 'Unknown',
      })),
    );
  }

  getCharacterBio(character: Character) {
    return forkJoin({
      allegiances: this.getCharacters(character.allegiances),
      books: this.getBooks(character.books),
    }).pipe(
      map(({ allegiances, books }) => ({
        ...character,
        allegiances: allegiances.map((m) => m?.name ?? 'Unknown'),
        books: books.map((m) => m?.name ?? 'Unknown'),
      })),
    );
  }

  getBookInfo(book: Book) {
    return forkJoin({
      characters: this.getCharacters(book.characters),
      povCharacters: this.getCharacters(book.povCharacters),
    }).pipe(
      map(({ characters, povCharacters }) => ({
        ...book,
        characters: characters.map((m) => m?.name ?? 'Unknown'),
        povCharacters: povCharacters.map((m) => m?.name ?? 'Unknown'),
      })),
    );
  }

  getCharacter(url: string) {
    if (!url) return of(null);
    return this.detailsApiService.getCharacter(this.urlUtils.getItemIdFromUrl(url));
  }

  getCharacters(urls: string[], limit = MORE_INFO_LIMIT) {
    const limited = (urls ?? []).slice(0, limit);
    return limited.length ? forkJoin(limited.map((url) => this.getCharacter(url))) : of([]);
  }

  getBook(url: string) {
    if (!url) return of(null);
    return this.detailsApiService.getBook(this.urlUtils.getItemIdFromUrl(url));
  }
  getBooks(urls: string[], limit = MORE_INFO_LIMIT) {
    const limited = (urls ?? []).slice(0, limit);
    return limited.length ? forkJoin(limited.map((url) => this.getBook(url))) : of([]);
  }

  addToFavorites() {
    this.store.dispatch(
      FavoritesActions.addFavorites({
        itemType: this.listType() as FavoriteType,
        item: this.getItem(),
      }),
    );
    this.toastService.show('Added to Favorites', 'success');

    this.isAddedToFavorites = true;
  }

  removeFromFavorites() {
    this.store.dispatch(
      FavoritesActions.removeFavorites({
        itemType: this.listType() as FavoriteType,
        item: this.getItem(),
      }),
    );
    this.toastService.show('Removed from Favorites', 'error');

    this.isAddedToFavorites = false;
  }

  getItem() {
    switch (this.listType()) {
      case TYPES.HOUSES:
        return this.house();
      case TYPES.CHARACTERS:
        return this.character();
      default:
        return this.book();
    }
  }

  formatKey(key: string): string {
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  isUrl(val: any): boolean {
    return typeof val === 'string' && val.startsWith('http');
  }

  asArray(value: unknown): string[] {
    return value as string[];
  }

  goBack() {
    this.location.back();
  }
}
