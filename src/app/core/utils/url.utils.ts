import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlUtils {

  public getItemIdFromUrl(url: string): string {
    return url.split('/').pop()!;
  }
}
