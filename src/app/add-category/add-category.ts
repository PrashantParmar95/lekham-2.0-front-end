import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http-service';
import { Categories} from '../categories/categories';
import {ActivatedRoute, Router} from '@angular/router';
import {API_ENDPOINTS} from '../constants/endpoints';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './add-category.html',
  styleUrl: './add-category.css'
})
export class AddCategory {
  name = '';
  description = '';
  errorMessage = '';
  isSubmitting = false;

  @Output() categoryAdded = new EventEmitter<void>();
  @Output() closePopup = new EventEmitter<void>();
  @Output() closed = new EventEmitter<boolean>();



  constructor(private httpService: HttpService,private categories: Categories,private router: Router) { }
  submit() {
    if (!this.name.trim() || !this.description.trim()) {
      this.errorMessage = 'Both fields are required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      name: this.name.trim(),
      description: this.description.trim()
    };

    this.httpService.postSecured(API_ENDPOINTS.CATEGORY.ADD_CATEGORY, payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.success) {
          window.location.reload();
        } else {
          this.errorMessage = res.error || 'Failed to add category';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Server error';
      }
    });
  }

  cancel($event: PointerEvent) {
    this.closePopup.emit();
    this.categories.showAddPopup = false;
  }
}
