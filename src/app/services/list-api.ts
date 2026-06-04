import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../core/models/list.model';
import { BASE_URL } from '..';

@Injectable({
  providedIn: 'root',
})
export class ListApi {
  private http = inject(HttpClient);

  getHouses(page: number, pageSize: number = 20): Observable<House[]> {
    return this.http.get<House[]>(BASE_URL, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
}
