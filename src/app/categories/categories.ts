import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService} from '../services/http-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: Category[] = [];
  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getSecured<CategoryResponse>('category/list').subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = res.data;
        } else {
          this.errorMessage = res.message || 'Failed to fetch categories';
        }
      },
      error: () => {
        this.errorMessage = 'Error fetching categories';
      }
    });
  }

  openCategory(category : string){

  }

  addCategory(){}
}
