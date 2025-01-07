import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../../../service/video/video.service';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  standalone: false,
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  video: any = {
    title: '',
    url_video: '',
    cover_url: '',
    detail: '',
    cate_id: ''
  };
  video_id: number | null = null;
  categories: any[] = []; // Assuming you have categories to select from

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.video_id = +this.route.snapshot.params['video_id'];
    this.videoService.getVideoById(this.video_id).subscribe((data: any) => {
      this.video = data;
    });

    // Load categories
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  saveVideo(): void {
    if (this.video_id !== null) {
      this.videoService.updateVideo(this.video_id, this.video).subscribe(() => {
        this.router.navigate(['/admin/content']);
      });
    } else {
      console.error('Video ID is null');
    }
  }
}