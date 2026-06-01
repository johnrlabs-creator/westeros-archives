import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { BaseItem } from '../../core/models/list.model';
import { UrlUtils } from '../../core/utils/url.utils';

const BASE_URL = 'https://anapioficeandfire.com/api';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List  {
  router = inject(Router);
  urlUtils = inject(UrlUtils);


  listType = toSignal(
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.split('/')[1]),
    ),
  );

  data = httpResource<any[]>(() => 
    `https://anapioficeandfire.com/api/${this.listType()}`
  )

  seeDetails(item: BaseItem) {
    const id = this.urlUtils.getItemIdFromUrl(item.url);
    this.router.navigate(['/', this.listType(), id]);
    // TODO: Change to store in state then get state in Details page to fetch item.url
  }

}
