import { ComponentFixture, TestBed } from '@angular/core/testing';
import { List } from './list';
import { provideRouter, Router } from '@angular/router';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideStore } from '@ngrx/store';
import { favoritesReducer } from '../../core/state/favorites.reducer';
import { BaseItem } from '../../core/models/list.model';
import { signal } from '@angular/core';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideStore({ favorites: favoritesReducer }),
        provideRouter([{ path: '**', component: List }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    await router.navigate(['/houses']);

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush any pending HTTP requests
    httpMock.match(() => true).forEach((req) => req.flush([]));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('seeDetails', () => {
    it('should navigate to the correct route', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');
      component['listType'] = signal('houses');
      component.seeDetails({ url: 'https://anapioficeandfire.com/api/houses/1' } as BaseItem);

      expect(navigateSpy).toHaveBeenCalledWith(['/', component.listType(), '1']);
    });

    it('should extract the id from the item url', () => {
      const getItemIdSpy = vi.spyOn(component['urlUtils'], 'getItemIdFromUrl').mockReturnValue('1');
      vi.spyOn(TestBed.inject(Router), 'navigate');
      component['listType'] = signal('houses');
      component.seeDetails({ url: 'https://anapioficeandfire.com/api/houses/1' } as BaseItem);

      expect(getItemIdSpy).toHaveBeenCalledWith('https://anapioficeandfire.com/api/houses/1');
    });
  });

  describe('nextPage', () => {
    it('should increment currentPage by 1', () => {
      component.currentPage.set(1);
      component.nextPage();
      expect(component.currentPage()).toBe(2);
    });
  });

  describe('prevPage', () => {
    it('should decrement currentPage by 1 when page is greater than 1', () => {
      component.currentPage.set(3);
      component.prevPage();
      expect(component.currentPage()).toBe(2);
    });

    it('should not decrement currentPage when page is 1', () => {
      component.currentPage.set(1);
      component.prevPage();
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('search', () => {
    it('should set searchQuery from input event', () => {
      const event = { target: { value: 'Stark' } } as unknown as Event;
      component.search(event);
      expect(component.searchQuery()).toBe('Stark');
    });

    it('should reset currentPage to 1 on search', () => {
      component.currentPage.set(5);
      const event = { target: { value: 'Stark' } } as unknown as Event;
      component.search(event);
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('hasNextPage', () => {
    it('should return true when Link header contains rel="next"', () => {
      const mockHeaders = new HttpHeaders({
        Link: '<https://anapioficeandfire.com/api/houses?page=2>; rel="next"',
      });
      vi.spyOn(component.data, 'headers').mockReturnValue(mockHeaders);

      expect(component.hasNextPage()).toBe(true);
    });

    it('should return false when Link header does not contain rel="next"', () => {
      const mockHeaders = new HttpHeaders({
        Link: '<https://anapioficeandfire.com/api/houses?page=1>; rel="prev"',
      });
      vi.spyOn(component.data, 'headers').mockReturnValue(mockHeaders);

      expect(component.hasNextPage()).toBe(false);
    });

    it('should return false when Link header is absent', () => {
      vi.spyOn(component.data, 'headers').mockReturnValue(undefined);

      expect(component.hasNextPage()).toBe(false);
    });
  });
});
