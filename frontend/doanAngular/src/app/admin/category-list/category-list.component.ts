import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  deleteCategory(id: number): void {
   
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories(); // Reload categories after deletion
      });
    
  }
}
