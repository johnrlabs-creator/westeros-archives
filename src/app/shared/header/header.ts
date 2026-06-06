import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FavoritesActions } from '../../core/state/favorites.action';
import { AuthApi } from '../../services/auth-api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header {
  router = inject(Router);
  store = inject(Store);
  authApi = inject(AuthApi);

  isMenuOpen = signal<boolean>(false);
  hideMenu = computed(() => {
    if (this.authApi.token() === null) {
      return true;
    } else {
      return false;
    }
  });

  navLinks = signal([
    { label: 'Houses', path: '/houses' },
    { label: 'Characters', path: '/characters' },
    { label: 'Books', path: '/books' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Logout', path: '/login' },
  ]);

  toggleMenu(): void {
    this.isMenuOpen.update((prev) => !prev);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout(path: string) {
    this.store.dispatch(FavoritesActions.logout());
    sessionStorage.removeItem('token');
    this.authApi.token.set(null);
    this.router.navigate([path]);
  }
}
