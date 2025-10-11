import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService} from '../services/http-service';
import {RouterLink} from '@angular/router';
import { AddCategory} from '../add-category/add-category';
import {API_ENDPOINTS} from '../constants/endpoints';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, AddCategory],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: Category[] = [];
  errorMessage = '';
  showAddPopup = false;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
   this.loadCategories();
  }


  loadCategories() {
    this.httpService.getSecured<CategoryResponse>(API_ENDPOINTS.CATEGORY.LIST_CATEGORY).subscribe({
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

  addCategory() {
    this.showAddPopup = true;
  }

  onCategoryAdded() {
    this.loadCategories(); // reload after add
  }

  closePopup() {
    this.showAddPopup = false;
  }

  onPopupClosed(refresh: boolean) {
    alert("test");
  }


}
