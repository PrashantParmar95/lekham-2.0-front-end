import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Route, Router, RouterLink} from '@angular/router';
import { HttpService} from '../services/http-service';
import { LoaderService } from '../services/loader';
import {API_ENDPOINTS} from '../constants/endpoints';

@Component({
  selector: 'app-category-with-lekh',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-with-lekh.html',
  styleUrls: ['./category-with-lekh.css']
})
export class CategoryWithLekh implements OnInit {

  private readonly http = inject(HttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);

  category: any;
  lekhList: any[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {

    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.fetchCategoryWithLekhs(categoryId);
    } else {
      this.error = '⚠️ Invalid category ID';
      this.loading = false;
    }
  }


  fetchCategoryWithLekhs(categoryId: number) {
    this.http.getSecured<any>(API_ENDPOINTS.LEKH.LIST_LEKH+`/${categoryId}`).subscribe({
      next: (res) => {
        this.category = res.data.category;
        this.lekhList = res.data.lekhList;
        this.loading = false;
      },
      error: () => {
        this.error = '⚠️ Failed to load category & lekhs';
        this.loading = false;
      }
    });
  }

  constructor(private router: Router) {

  }
  routeAddLekh(id: any, id2: any) {
        this.router.navigate(['/add-lekh', id, id2]);
  }
}
