import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '..';
import { Observable } from 'rxjs';
import { Book, Character, House } from '../core/models/list.model';

@Injectable({
  providedIn: 'root',
})
export class DetailsApi {
  http = inject(HttpClient)


  getDetailsApi(listType: string, id: string) {
    return this.http.get(`${BASE_URL}${listType}/${id}`)
  }
  getHouse(id: string): Observable<House> {
    return this.http.get<House>(`${BASE_URL}houses/${id}`)
  }
  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${BASE_URL}books/${id}`)
  }
  getCharacter(id: string): Observable<Character> {
    return this.http.get<Character>(`${BASE_URL}characters/${id}`)
  }

  getOverlord() {
    return this.http.get<Character>
  }
}
