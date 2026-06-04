import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../core/models/list.model';

@Injectable({
  providedIn: 'root',
})
export class ListApi {
    private http = inject(HttpClient);
  private apiUrl = 'https://anapioficeandfire.com';

  // Fetches a specific page with a max pageSize of 50
  getHouses(page: number, pageSize: number = 20): Observable<House[]> {
    return this.http.get<House[]>(this.apiUrl, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
}
