import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styles: [`
    /* Clean fluid mobile drawer execution dropdown transition */
    .animate-slideDown {
      animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideDown {
      from { transform: translateY(-0.5rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class Header {
  // Navigation states managed safely with core Angular signals
  isMenuOpen = signal<boolean>(false);
  router = inject(Router)

  navLinks = signal([
    { label: 'Houses', path: '/houses' },
    { label: 'Characters', path: '/characters' },
    { label: 'Books', path: '/books' },
    { label: 'Favorites', path: '/favorites' }
  ]);

  toggleMenu(): void {
    this.isMenuOpen.update(prev => !prev);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  home() {
    this.router.navigate(['/home'])    
  }
}