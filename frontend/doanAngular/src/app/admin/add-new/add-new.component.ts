import { CategoryService } from './../../../../service/category.service';
import { Component } from '@angular/core';
import { VideoService } from '../../../../service/video/video.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-new',
  standalone: false,
  
  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.css'
})
export class AddNewComponent {
 video: any = {};
 successMessage: string | null = null;
 errorMessage: string | null = null;
 categories: any[] = [];
  constructor(private videoService: VideoService, private router: Router,private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
   }

  onSubmit(): void {
    this.videoService.addVideo(this.video).subscribe({
      next: (response) => {
        this.successMessage = 'Video đã được thêm thành công!';
        setTimeout(() => this.router.navigate(['/admin/content']), 500); // Quay lại danh sách video sau 2 giây
      },
      error: (error) => {
        this.errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
      }
    });
  }
  loadCategories() {
    this.CategoryService.getCategories().subscribe((data) => {
      this.categories = data;
    }, error => {
      console.error('There was an error!', error);
    });
  }
}
