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
  constructor(private videoService: VideoService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllVideos();
  }
  // Hàm xóa video
  deleteVideo(video_id: number) {
    console.log('Deleting video with ID:', video_id); // Log video_id
  
    this.videoService.deleteVideo(video_id).subscribe(() => {
      // Cập nhật danh sách video sau khi xóa
      console.log('Video deleted successfully'); // Log success message
      this.successMessage = 'Video đã được thêm thành công!';
      this.videos = this.videos.filter(video => video.video_id !== video_id);
      console.log('Updated video list:', this.videos); // Log updated video list
      this.loadAllVideos();
    }, error => {
      console.error('Error deleting video:', error); // Log error message
    });
  }
// Hàm lấy danh sách video từ VideoService
loadAllVideos() {
  this.videoService.getVideo().subscribe((data) => {
    this.videos = data;
    this.cdr.detectChanges(); // Phát hiện và cập nhật thay đổi
  }, error => {
    console.error('There was an error!', error);
  });
}
  
}
