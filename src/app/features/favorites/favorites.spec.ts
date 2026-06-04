import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Favorites } from './favorites';
import { provideRouter, Router } from '@angular/router';
import { provideStore, Store } from '@ngrx/store';
import { favoritesReducer } from '../../core/state/favorites.reducer';
import { BaseItem, FavoriteType } from '../../core/models/list.model';
import { FavoritesActions } from '../../core/state/favorites.action';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favorites],
       providers: [
        provideStore({ favorites: favoritesReducer }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('viewDetails', () => {
  it('should navigate to the correct route', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');

    component.viewDetails({ url: 'https://anapioficeandfire.com/api/houses/1' });

    expect(navigateSpy).toHaveBeenCalledWith(['/', component.activeTab(), '1']);
  });

  it('should extract the id from the item url', () => {
    const getItemIdSpy = vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');
    vi.spyOn(TestBed.inject(Router), 'navigate');

    component.viewDetails({ url: 'https://anapioficeandfire.com/api/houses/1' });

    expect(getItemIdSpy).toHaveBeenCalledWith('https://anapioficeandfire.com/api/houses/1');
  });
});

describe('removeFavorite', () => {
  it('should dispatch removeFavorites action', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const mockItem = { name: 'House Stark' };

    component.removeFavorite(mockItem, 'houses');

    expect(dispatchSpy).toHaveBeenCalledWith(
      FavoritesActions.removeFavorites({
        itemType: 'houses' as FavoriteType,
        item: mockItem as unknown as BaseItem,
      }),
    );
  });

  it('should show error toast', () => {
    const toastSpy = vi.spyOn(component['toastService'], 'show');

    component.removeFavorite({ name: 'House Stark' }, 'houses');

    expect(toastSpy).toHaveBeenCalledWith('Removed from Favorites', 'error');
  });
});
});
