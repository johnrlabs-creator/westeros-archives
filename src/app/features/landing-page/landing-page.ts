import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthApi } from '../../services/auth-api';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  authApi = inject(AuthApi);

  username = computed(() => this.authApi.username() ?? sessionStorage.getItem('username'));
}
