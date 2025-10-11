import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LekhRequestDto } from './lekh-request.model';
import { ContentWriter } from '../tools/content-writer/content-writer';
import { HttpService } from '../services/http-service';
import { ApiResponse } from '../responses/ApiResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe, CommonModule } from '@angular/common';
import {API_ENDPOINTS} from '../constants/endpoints';

@Component({
  selector: 'app-add-lekh',
  standalone: true,
  imports: [ReactiveFormsModule, ContentWriter, CommonModule],
  templateUrl: './add-lekh.html',
  styleUrl: './add-lekh.css'
})
export class AddLekh implements OnInit {
  private http = inject(HttpService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId: string | null;
  parentId: string | null;
  matchedCategoryId = "0";
  lekhForm!: FormGroup;
  model: LekhRequestDto = new LekhRequestDto();
  categoryList: Category[] = [];
  categoryMatch: boolean = false;

  constructor() {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.parentId = this.route.snapshot.paramMap.get('parentId');
    this.fetchAllCategory();
  }

  ngOnInit(): void {
    this.lekhForm = this.fb.group({
      title: [this.model.title, Validators.required],
      category: [this.model.category || 0, Validators.required],
      parent: [this.parentId, Validators.required],
      content: [this.model.content, Validators.required],
      bgc: [this.model.bgc || '#ffffff', Validators.required],
      txtc: [this.model.txtc || '#000000', Validators.required],
      access: [this.model.access || 'PUBLIC', Validators.required],
      priority: [this.model.priority]
    });
  }

  onSubmit() {
    if (this.lekhForm.invalid) return;

    this.http.postSecured(API_ENDPOINTS.LEKH.ADD_LEKH, this.lekhForm.value).subscribe({
      next: () => {
        this.router.navigate(['/category-with-lekh', this.categoryId]);
      },
      error: (error) => {
        alert(error);
      }
    });
  }

  onReset() {
    this.lekhForm.reset({
      title: '',
      category: 0,
      parent: this.parentId,
      content: '',
      bgc: '#ffffff',
      txtc: '#000000',
      access: 'PUBLIC',
      priority: ''
    });
  }

  fetchAllCategory() {
    this.http.getSecured<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORY.LIST_CATEGORY).subscribe({
      next: (res) => {
        this.categoryList = res.data || [];
        this.categoryList.forEach(category => {
          // @ts-ignore
          if (category.id == this.categoryId) {
            this.categoryMatch = true;
            this.matchedCategoryId = category.id;
            this.lekhForm.get('category')?.setValue(this.matchedCategoryId);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.categoryList = [];
      }
    });
  }
}
