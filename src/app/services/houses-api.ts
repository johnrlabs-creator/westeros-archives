import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { House } from '../core/models/houses.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HousesApi {

  http = inject(HttpClient)

  getHousesApi(): Observable<House[]> {
    return this.http.get<House[]>('https://anapioficeandfire.com/api/houses') // TODO: Remove to use List only for all items
  }
}
