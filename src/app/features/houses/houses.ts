import { Component, inject, OnInit, signal } from '@angular/core';
import { HousesApi } from '../../services/houses-api';
import { House } from '../../core/models/houses.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-houses',
  imports: [],
  templateUrl: './houses.html',
  styleUrl: './houses.css',
})
export class Houses implements OnInit {

  housesApiService = inject(HousesApi)
  houseList = signal<House[]>([])
  router = inject(Router)

  ngOnInit(): void {
    this.housesApiService.getHousesApi().subscribe(res => {
      console.log(res);
      this.houseList.set(res)
    })
  }

  itemClick(house: House) {
    this.router.navigate(['/details'])
  }
}
