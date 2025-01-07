import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  standalone: false,
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  category: any = { category: '' };
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.categoryService.getCategoryById(this.id).subscribe((data: any) => {
        this.category = data;
      });
    }
  }

  saveCategory(): void {
    if (this.id) {
      this.categoryService.updateCategory(this.id, this.category).subscribe(() => {
        this.router.navigate(['/admin/category-list']);
      });
    } else {
      this.categoryService.addCategory(this.category).subscribe(() => {
        this.router.navigate(['/admin/category-list']);
      });
    }
  }
}
