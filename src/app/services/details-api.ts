import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '..';

@Injectable({
  providedIn: 'root',
})
export class DetailsApi {
  http = inject(HttpClient)


  getDetailsApi(listType: string, id: string) {
    return this.http.get(`${BASE_URL}${listType}/${id}`)
  }
}
