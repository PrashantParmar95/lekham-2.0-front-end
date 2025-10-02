import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../services/loader';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
  isLoading$!: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loaderState$;
  }
}
