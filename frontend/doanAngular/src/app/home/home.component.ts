import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../../service/video/video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  video: any[] = [];
  categories: any[] = [];
  filteredVideos: any[] = [];
  selectedCategory: number | null = null;
  noVideosMessage: string = '';

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.loadAllVideos();
    this.loadCategories();
  }

  loadAllVideos() {
    this.videoService.getAllVideos().subscribe((data) => {
      this.video = data;
      this.filteredVideos = data; // Hiển thị tất cả video ban đầu
    });
  }

  loadCategories() {
    this.videoService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  filterVideosByCategory(category_id: number | null) {
    this.selectedCategory = category_id;
    if (category_id === null) {
      this.loadAllVideos();
      this.noVideosMessage = '';
    } else {
      this.videoService.getVideosByCategory(category_id).subscribe((data) => {
        this.filteredVideos = data;
        if (this.filteredVideos.length === 0) {
          this.noVideosMessage = 'Không có bài nào thuộc loại này';
        } else {
          this.noVideosMessage = '';
        }
      }, error => {
        console.error('There was an error!', error);
        this.noVideosMessage = 'Không có bài nào thuộc loại này';
      });
    }
  }
}
