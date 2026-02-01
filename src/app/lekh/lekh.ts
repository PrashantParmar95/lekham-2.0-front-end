import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LekhResponse } from './lekh.model';
import { HttpService} from '../services/http-service';
import {ActivatedRoute} from '@angular/router';
import {API_ENDPOINTS} from '../constants/endpoints';

@Component({
  selector: 'app-lekh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lekh.html',
  styleUrl: './lekh.css'
})
export class Lekh implements OnInit {
  lekh?: LekhResponse['data'];
  errorMessage = '';

  constructor(private httpService: HttpService,private route: ActivatedRoute) {}// @ts-ignore

  ngOnInit(): void {
    const lekhId = this.route.snapshot.paramMap.get('id');

    this.httpService.getSecured<LekhResponse>(API_ENDPOINTS.LEKH.MAIN+`/${lekhId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.lekh = res.data;
        } else {
          this.errorMessage = res.message || 'Failed to fetch lekh';
        }
      },
      error: () => {
        this.errorMessage = 'Error fetching lekh';
      }
    });
  }
}
