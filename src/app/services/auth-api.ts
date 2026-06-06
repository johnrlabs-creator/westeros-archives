import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);
  token = signal<string | null>(sessionStorage.getItem('token')) // rehydrate token on refresh or browser url input
  username = signal<string | null>(null);

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/login', {username, password}).pipe(
      tap((res: any) => {
        this.username.set(username);
        this.token.set(res?.token),
        // keep the token in session to persist auth when refreshed
        // change to cookies/ httpOnly if to move to prod
        sessionStorage.setItem('token', res?.token) 
        sessionStorage.setItem('username', username) 
      })
    )
  }
 
  register(username: string, password: string) {
    return this.http.post('http://localhost:3000/register', {username, password});
  }
}
