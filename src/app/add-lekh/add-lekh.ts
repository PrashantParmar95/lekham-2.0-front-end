import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LekhRequestDto } from './lekh-request.model';
import {ContentWriter} from '../tools/content-writer/content-writer';
import {HttpService} from '../services/http-service';
import {ApiResponse} from '../responses/ApiResponse';
import {ActivatedRoute, Router} from '@angular/router';
import {JsonPipe} from '@angular/common';
@Component({
  selector: 'app-add-lekh',
  imports: [
    ReactiveFormsModule,
    ContentWriter,
    JsonPipe
  ],
  templateUrl: './add-lekh.html',
  styleUrl: './add-lekh.css'
})
  export class AddLekh implements OnInit {
  private http = inject(HttpService);
  categoryEndPoint: string = "category/list";
  addLekhEndPoint: string = "lekh/add";
  categoryId: string | null;
  matchedCategoryId= "0";
  parentId: string | null;
  lekhForm!: FormGroup;
  model: LekhRequestDto = new LekhRequestDto();
  categoryList:Category[]= [];
  constructor(private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.parentId = this.route.snapshot.paramMap.get('parentId');

    this.fetchAllCategory();
  }

  ngOnInit(): void {

    this.lekhForm = this.fb.group({
      title: [this.model.title, Validators.required],
      category: [this.model.category, Validators.required],
      parent: [this.parentId , Validators.required],
      content: [this.model.content, Validators.required],
      bgc: [this.model.bgc, Validators.required],
      txtc: [this.model.txtc, Validators.required],
      access: [this.model.access, Validators.required],
      priority: [this.model.priority]
    });

  }
    onSubmit() {

    this.http.postSecured(this.addLekhEndPoint, this.lekhForm.value).subscribe({
      next: (data) => {
          this.router.navigate(['/category-with-lekh',this.categoryId]);
      },error:(error) => {
        alert(error);
      }
    })
  }

  categoryMatch:boolean = false;
  fetchAllCategory() {
    this.http.getSecured<ApiResponse<Category[]>>(this.categoryEndPoint).subscribe({
      next: (res) => {
        this.categoryList = res.data || [];
        this.categoryList.forEach(category => {
          // @ts-ignore
          if(category.id == this.categoryId){
            this.categoryMatch = true;
            this.matchedCategoryId = category.id;
            this.lekhForm.get('category')?.setValue(this.matchedCategoryId);
            // this.lekhForm.get('category')?.disable();
          }
        })

      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.categoryList = [];
      }
    });
  }


}
