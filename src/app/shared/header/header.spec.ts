import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Header } from './header';
import { of } from 'rxjs';
import { provideStore } from '@ngrx/store';
import { favoritesReducer } from '../../core/state/favorites.reducer';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
         provideStore({ favorites: favoritesReducer }),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => '1' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleMenu', () => {
    it('should set isMenuOpen to true when it is false', () => {
      component.isMenuOpen.set(false);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(true);
    });

    it('should set isMenuOpen to false when it is true', () => {
      component.isMenuOpen.set(true);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('closeMenu', () => {
    it('should set isMenuOpen to false', () => {
      component.isMenuOpen.set(true);
      component.closeMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('home', () => {
    it('should navigate to /home', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.home();
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });
});
