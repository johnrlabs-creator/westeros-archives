import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { BaseItem, House } from '../../core/models/list.model';
import { UrlUtils } from '../../core/utils/url.utils';
import { BASE_URL, TYPES } from '../..';
import { Loader } from '../../shared/loader/loader';

@Component({
  selector: 'app-list',
  imports: [Loader],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  router = inject(Router);
  urlUtils = inject(UrlUtils);

  types = TYPES;
  currentPage = signal<number>(1);
  pageSize = 20;
  houses = signal<House[]>([]);
  searchQuery = signal<string>('');
  searchInput = signal('');

  listType = toSignal(
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.split('/')[1]),
    ),
  );

  data = httpResource<any[]>(() => ({
    url: `${BASE_URL}${this.listType()}`,
    params: {
      page: this.currentPage().toString(),
      pageSize: this.pageSize.toString(),
      ...(this.searchQuery() && { name: this.searchQuery() }),
    },
  }));

  hasNextPage = computed(() => {
    // Fetches the raw Link header from the response
    // Returns true if 'rel="next"' exists inside the string
    // See documentation AnApiOfIceAndFire/wiki for link header
    const linkHeader = this.data.headers()?.get('Link') || '';
    return linkHeader.includes('rel="next"');
  });

  seeDetails(item: BaseItem) {
    const id = this.urlUtils.getItemIdFromUrl(item.url);
    this.router.navigate(['/', this.listType(), id]);
  }

  nextPage() {
    this.currentPage.update((page) => page + 1);
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  onSearch() {
    if (this.searchInput()) {
      this.searchQuery.set(this.searchInput());
    }
  }

  onClearSearch() {
    this.searchInput.set('');
    this.searchQuery.set(this.searchInput());
  }
}
