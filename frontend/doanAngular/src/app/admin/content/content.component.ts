import { VideoService } from './../../../../service/video/video.service';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: false,
  
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  videos: any[] = []; // Khai báo thuộc tính videos
  successMessage: string | null = null;
  errorMessage: string | null = null;

  video: any = {
    title: '',
    description: '',
    url: ''
  };
  video_id: string | null = null;

  constructor(private videoService: VideoService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllVideos();
  }
  // Hàm xóa video
  deleteVideo(id: number): void {
   
    this.videoService.deleteVideo(id).subscribe(() => {
      this.loadAllVideos(); // Reload categories after deletion
    });
  
}
// Hàm lấy danh sách video từ VideoService
loadAllVideos() {
  this.videoService.getVideo().subscribe((data) => {
    this.videos = data;
  });
}
  
}
