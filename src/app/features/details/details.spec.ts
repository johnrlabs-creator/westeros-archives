import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Details } from './details';
import { provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { Book, Character, FavoriteType, House } from '../../core/models/list.model';
import { TYPES } from '../..';
import { FavoritesActions } from '../../core/state/favorites.action';
import { firstValueFrom } from 'rxjs';

describe('Details', () => {
  let component: Details;
  let fixture: ComponentFixture<Details>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [
        provideRouter([]),
        provideStore(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => '1' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('asArray', () => {
    it('should return a string array as-is', () => {
      expect(component.asArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should return an empty array as-is', () => {
      expect(component.asArray([])).toEqual([]);
    });

    it('should return non-array values as-is (no runtime check)', () => {
      expect(component.asArray(null)).toBeNull();
    });
  });

  it('should call location.back() when goBack is called', () => {
    const locationSpy = vi.spyOn(component['location'], 'back');
    component.goBack();
    expect(locationSpy).toHaveBeenCalled();
  });

  describe('isArray', () => {
    it('should return true for an array', () => {
      expect(component.isArray(['a', 'b'])).toBe(true);
    });

    it('should return false for a non-array', () => {
      expect(component.isArray('string')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for a url string', () => {
      expect(component.isUrl('https://example.com')).toBe(true);
    });

    it('should return false for a non-url string', () => {
      expect(component.isUrl('not-a-url')).toBe(false);
    });
  });

  describe('getItem', () => {
    it('should return house when listType is houses', () => {
      const mockHouse = { name: 'House Stark' } as House;
      component['listType'] = signal(TYPES.HOUSES);
      component.house.set(mockHouse);
      expect(component.getItem()).toEqual(mockHouse);
    });

    it('should return character when listType is characters', () => {
      const mockCharacter = { name: 'Jon Snow' } as Character;
      component['listType'] = signal(TYPES.CHARACTERS);
      component.character.set(mockCharacter);
      expect(component.getItem()).toEqual(mockCharacter);
    });

    it('should return book by default', () => {
      const mockBook = { name: 'A Game of Thrones' } as Book;
      component['listType'] = signal('unknown');
      component.book.set(mockBook);
      expect(component.getItem()).toEqual(mockBook);
    });
  });

  describe('formatKey', () => {
    it('should add space before capital letters', () => {
      expect(component.formatKey('camelCase')).toBe('Camel Case');
    });

    it('should capitalize the first letter', () => {
      expect(component.formatKey('firstName')).toBe('First Name');
    });

    it('should handle a single word with no capitals', () => {
      expect(component.formatKey('name')).toBe('Name');
    });
  });

  describe('addToFavorites', () => {
    it('should dispatch addFavorites action', () => {
      const store = TestBed.inject(Store);
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component['listType'] = signal(TYPES.HOUSES);
      component.addToFavorites();
      expect(dispatchSpy).toHaveBeenCalledWith(
        FavoritesActions.addFavorites({
          itemType: TYPES.HOUSES as FavoriteType,
          item: component.getItem(),
        }),
      );
    });

    it('should set isAddedToFavorites to true', () => {
      component.addToFavorites();
      expect(component.isAddedToFavorites).toBe(true);
    });

    it('should show success toast', () => {
      const toastSpy = vi.spyOn(component['toastService'], 'show');
      component.addToFavorites();
      expect(toastSpy).toHaveBeenCalledWith('Added to Favorites', 'success');
    });
  });

  describe('removeFromFavorites', () => {
    it('should dispatch removeFavorites action', () => {
      const store = TestBed.inject(Store);
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component['listType'] = signal(TYPES.HOUSES);
      component.removeFromFavorites();
      expect(dispatchSpy).toHaveBeenCalledWith(
        FavoritesActions.removeFavorites({
          itemType: TYPES.HOUSES as FavoriteType,
          item: component.getItem(),
        }),
      );
    });

    it('should set isAddedToFavorites to false', () => {
      component.isAddedToFavorites = true;
      component.removeFromFavorites();
      expect(component.isAddedToFavorites).toBe(false);
    });

    it('should show error toast', () => {
      const toastSpy = vi.spyOn(component['toastService'], 'show');
      component.removeFromFavorites();
      expect(toastSpy).toHaveBeenCalledWith('Removed from Favorites', 'error');
    });
  });

  describe('getCharacter', () => {
    it('should return of(null) when url is empty', async () => {
      const result = await firstValueFrom(component.getCharacter(''));
      expect(result).toBeNull();
    });

    it('should call detailsApiService.getCharacter with the extracted id', async () => {
      const mockCharacter = { name: 'Jon Snow' } as Character;
      const apiSpy = vi
        .spyOn(component['detailsApiService'], 'getCharacter')
        .mockReturnValue(of(mockCharacter));
      vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');

      const result = await firstValueFrom(
        component.getCharacter('https://anapioficeandfire.com/api/characters/1'),
      );
      expect(result).toEqual(mockCharacter);
      expect(apiSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('getCharacters', () => {
    it('should return of([]) when urls is empty', async () => {
      const result = await firstValueFrom(component.getCharacters([]));
      expect(result).toEqual([]);
    });

    it('should limit the number of requests', async () => {
      const mockCharacter = { name: 'Jon Snow' } as Character;
      vi.spyOn(component['detailsApiService'], 'getCharacter').mockReturnValue(of(mockCharacter));
      vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');

      const urls = Array(10).fill('https://anapioficeandfire.com/api/characters/1');
      const result = await firstValueFrom(component.getCharacters(urls));
      expect(result.length).toBe(5); // MORE_INFO_LIMIT = 5
    });
  });

  describe('getBook', () => {
    it('should return of(null) when url is empty', async () => {
      const result = await firstValueFrom(component.getBook(''));
      expect(result).toBeNull();
    });

    it('should call detailsApiService.getBook with the extracted id', async () => {
      const mockBook = { name: 'A Game of Thrones' } as Book;
      const apiSpy = vi
        .spyOn(component['detailsApiService'], 'getBook')
        .mockReturnValue(of(mockBook));
      vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');

      const result = await firstValueFrom(
        component.getBook('https://anapioficeandfire.com/api/books/1'),
      );
      expect(result).toEqual(mockBook);
      expect(apiSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('getBooks', () => {
    it('should return of([]) when urls is empty', async () => {
      const result = await firstValueFrom(component.getBooks([]));
      expect(result).toEqual([]);
    });

    it('should limit the number of requests', async () => {
      const mockBook = { name: 'A Game of Thrones' } as Book;
      vi.spyOn(component['detailsApiService'], 'getBook').mockReturnValue(of(mockBook));
      vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');

      const urls = Array(10).fill('https://anapioficeandfire.com/api/books/1');
      const result = await firstValueFrom(component.getBooks(urls));
      expect(result.length).toBe(5); // MORE_INFO_LIMIT = 5
    });
  });

  describe('getBookInfo', () => {
    it('should map characters and povCharacters to names', async () => {
      const mockBook = {
        name: 'A Game of Thrones',
        characters: ['https://anapioficeandfire.com/api/characters/1'],
        povCharacters: ['https://anapioficeandfire.com/api/characters/2'],
      } as Book;

      vi.spyOn(component, 'getCharacters')
        .mockResolvedValueOnce([{ name: 'Jon Snow' }] as any)
        .mockResolvedValueOnce([{ name: 'Arya Stark' }] as any);

      const result = await firstValueFrom(component.getBookInfo(mockBook));

      expect(result.characters).toEqual(['Jon Snow']);
      expect(result.povCharacters).toEqual(['Arya Stark']);
    });

    it('should fallback to "Unknown" when character name is missing', async () => {
      const mockBook = {
        name: 'A Game of Thrones',
        characters: ['https://anapioficeandfire.com/api/characters/1'],
        povCharacters: ['https://anapioficeandfire.com/api/characters/2'],
      } as Book;

      vi.spyOn(component, 'getCharacters')
        .mockReturnValueOnce(of([{ name: undefined }] as any))
        .mockReturnValueOnce(of([null] as any));

      const result = await firstValueFrom(component.getBookInfo(mockBook));

      expect(result.characters).toEqual(['Unknown']);
      expect(result.povCharacters).toEqual(['Unknown']);
    });

    it('should return empty arrays when no characters or povCharacters', async () => {
      const mockBook = {
        name: 'A Game of Thrones',
        characters: [],
        povCharacters: [],
      } as unknown as Book;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([]));

      const result = await firstValueFrom(component.getBookInfo(mockBook));

      expect(result.characters).toEqual([]);
      expect(result.povCharacters).toEqual([]);
    });
  });

  describe('getHouseRelations', () => {
    it('should map all house relations to names', async () => {
      const mockHouse = {
        name: 'House Stark',
        swornMembers: ['https://anapioficeandfire.com/api/characters/1'],
        founder: 'https://anapioficeandfire.com/api/characters/2',
        heir: 'https://anapioficeandfire.com/api/characters/3',
        currentLord: 'https://anapioficeandfire.com/api/characters/4',
        overlord: 'https://anapioficeandfire.com/api/characters/5',
      } as House;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([{ name: 'Jon Snow' }] as any));
      vi.spyOn(component, 'getCharacter').mockReturnValue(of({ name: 'Ned Stark' } as any));

      const result = await firstValueFrom(component.getHouseRelations(mockHouse));

      expect(result.swornMembers).toEqual(['Jon Snow']);
      expect(result.founder).toBe('Ned Stark');
      expect(result.heir).toBe('Ned Stark');
      expect(result.currentLord).toBe('Ned Stark');
      expect(result.overlord).toBe('Ned Stark');
    });

    it('should fallback to "Unknown" when names are missing', async () => {
      const mockHouse = {
        name: 'House Stark',
        swornMembers: ['https://anapioficeandfire.com/api/characters/1'],
        founder: 'https://anapioficeandfire.com/api/characters/2',
        heir: '',
        currentLord: '',
        overlord: '',
      } as House;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([null] as any));
      vi.spyOn(component, 'getCharacter').mockReturnValue(of(null));

      const result = await firstValueFrom(component.getHouseRelations(mockHouse));

      expect(result.swornMembers).toEqual(['Unknown']);
      expect(result.founder).toBe('Unknown');
      expect(result.heir).toBe('Unknown');
      expect(result.currentLord).toBe('Unknown');
      expect(result.overlord).toBe('Unknown');
    });
  });

  describe('getCharacterBio', () => {
    it('should map allegiances and books to names', async () => {
      const mockCharacter = {
        name: 'Jon Snow',
        allegiances: ['https://anapioficeandfire.com/api/houses/1'],
        books: ['https://anapioficeandfire.com/api/books/1'],
      } as Character;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([{ name: 'House Stark' }] as any));
      vi.spyOn(component, 'getBooks').mockReturnValue(of([{ name: 'A Game of Thrones' }] as any));

      const result = await firstValueFrom(component.getCharacterBio(mockCharacter));

      expect(result.allegiances).toEqual(['House Stark']);
      expect(result.books).toEqual(['A Game of Thrones']);
    });

    it('should fallback to "Unknown" when names are missing', async () => {
      const mockCharacter = {
        name: 'Jon Snow',
        allegiances: ['https://anapioficeandfire.com/api/houses/1'],
        books: ['https://anapioficeandfire.com/api/books/1'],
      } as Character;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([null] as any));
      vi.spyOn(component, 'getBooks').mockReturnValue(of([null] as any));

      const result = await firstValueFrom(component.getCharacterBio(mockCharacter));

      expect(result.allegiances).toEqual(['Unknown']);
      expect(result.books).toEqual(['Unknown']);
    });

    it('should return empty arrays when no allegiances or books', async () => {
      const mockCharacter = {
        name: 'Jon Snow',
        allegiances: [],
        books: [],
      } as unknown as Character;

      vi.spyOn(component, 'getCharacters').mockReturnValue(of([]));
      vi.spyOn(component, 'getBooks').mockReturnValue(of([]));

      const result = await firstValueFrom(component.getCharacterBio(mockCharacter));

      expect(result.allegiances).toEqual([]);
      expect(result.books).toEqual([]);
    });
  });

  describe('loadHouseDetails', () => {
    it('should set house signal with resolved house relations', () => {
      const mockHouse = { name: 'House Stark' } as House;

      vi.spyOn(component['detailsApiService'], 'getHouse').mockReturnValue(of(mockHouse));
      vi.spyOn(component, 'getHouseRelations').mockReturnValue(of(mockHouse));

      component.loadHouseDetails();

      expect(component.house()).toEqual(mockHouse);
    });

    it('should call getHouseRelations with the fetched house', () => {
      const mockHouse = { name: 'House Stark' } as House;
      const getHouseRelationsSpy = vi
        .spyOn(component, 'getHouseRelations')
        .mockReturnValue(of(mockHouse));

      vi.spyOn(component['detailsApiService'], 'getHouse').mockReturnValue(of(mockHouse));

      component.loadHouseDetails();

      expect(getHouseRelationsSpy).toHaveBeenCalledWith(mockHouse);
    });
  });

  describe('loadCharacterDetails', () => {
    it('should set character signal with resolved character bio', () => {
      const mockCharacter = { name: 'Jon Snow' } as Character;

      vi.spyOn(component['detailsApiService'], 'getCharacter').mockReturnValue(of(mockCharacter));
      vi.spyOn(component, 'getCharacterBio').mockReturnValue(of(mockCharacter));

      component.loadCharacterDetails();

      expect(component.character()).toEqual(mockCharacter);
    });

    it('should call getCharacterBio with the fetched character', () => {
      const mockCharacter = { name: 'Jon Snow' } as Character;
      const getCharacterBioSpy = vi
        .spyOn(component, 'getCharacterBio')
        .mockReturnValue(of(mockCharacter));

      vi.spyOn(component['detailsApiService'], 'getCharacter').mockReturnValue(of(mockCharacter));

      component.loadCharacterDetails();

      expect(getCharacterBioSpy).toHaveBeenCalledWith(mockCharacter);
    });
  });

  describe('loadBookDetails', () => {
    it('should set book signal with resolved book info', () => {
      const mockBook = { name: 'A Game of Thrones' } as Book;

      vi.spyOn(component['detailsApiService'], 'getBook').mockReturnValue(of(mockBook));
      vi.spyOn(component, 'getBookInfo').mockReturnValue(of(mockBook));

      component.loadBookDetails();

      expect(component.book()).toEqual(mockBook);
    });

    it('should call getBookInfo with the fetched book', () => {
      const mockBook = { name: 'A Game of Thrones' } as Book;
      const getBookInfoSpy = vi.spyOn(component, 'getBookInfo').mockReturnValue(of(mockBook));

      vi.spyOn(component['detailsApiService'], 'getBook').mockReturnValue(of(mockBook));

      component.loadBookDetails();

      expect(getBookInfoSpy).toHaveBeenCalledWith(mockBook);
    });
  });

  describe('ngOnInit', () => {
    it('should call getItemDetails on init', () => {
      const getItemDetailsSpy = vi.spyOn(component, 'getItemDetails');
      component.ngOnInit();
      expect(getItemDetailsSpy).toHaveBeenCalled();
    });
  });

  describe('getItemDetails', () => {
    it('should call loadHouseDetails when listType is houses', () => {
      const loadHouseDetailsSpy = vi
        .spyOn(component, 'loadHouseDetails')
        .mockImplementation(() => {});
      component['listType'] = signal(TYPES.HOUSES);
      component.getItemDetails();
      expect(loadHouseDetailsSpy).toHaveBeenCalled();
    });

    it('should call loadCharacterDetails when listType is characters', () => {
      const loadCharacterDetailsSpy = vi
        .spyOn(component, 'loadCharacterDetails')
        .mockImplementation(() => {});
      component['listType'] = signal(TYPES.CHARACTERS);
      component.getItemDetails();
      expect(loadCharacterDetailsSpy).toHaveBeenCalled();
    });

    it('should call loadBookDetails when listType is books', () => {
      const loadBookDetailsSpy = vi
        .spyOn(component, 'loadBookDetails')
        .mockImplementation(() => {});
      component['listType'] = signal(TYPES.BOOKS);
      component.getItemDetails();
      expect(loadBookDetailsSpy).toHaveBeenCalled();
    });

    it('should not call any load method when listType is unknown', () => {
      const loadHouseDetailsSpy = vi
        .spyOn(component, 'loadHouseDetails')
        .mockImplementation(() => {});
      const loadCharacterDetailsSpy = vi
        .spyOn(component, 'loadCharacterDetails')
        .mockImplementation(() => {});
      const loadBookDetailsSpy = vi
        .spyOn(component, 'loadBookDetails')
        .mockImplementation(() => {});
      component['listType'] = signal('unknown');
      component.getItemDetails();
      expect(loadHouseDetailsSpy).not.toHaveBeenCalled();
      expect(loadCharacterDetailsSpy).not.toHaveBeenCalled();
      expect(loadBookDetailsSpy).not.toHaveBeenCalled();
    });
  });
});
