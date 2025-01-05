import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  standalone: false,
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  video: any = {
    title: '',
    description: '',
    url: ''
  };
  video_id: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Lấy ID từ URL (nếu có)
    this.video_id = this.route.snapshot.paramMap.get('id');
    if (this.video_id) {
      // Giả lập API lấy video theo ID (thay thế bằng API thực tế)
      this.loadVideo(this.video_id);
    }
  }

  loadVideo(video_id: string): void {
    // Lấy thông tin video từ API hoặc service
    // Dữ liệu giả lập:
    const mockVideo = {
      id: video_id,
      title: 'Sample Video',
      description: 'This is a sample video description.',
      url: 'https://example.com/sample-video.mp4'
    };
    this.video = mockVideo;
  }

  saveVideo(): void {
    if (this.video_id) {
      // Cập nhật video
      console.log('Updating video:', this.video);
      alert('Video updated successfully!');
    } else {
      // Thêm video mới
      console.log('Adding new video:', this.video);
      alert('Video added successfully!');
    }
    // Chuyển hướng sau khi lưu
    this.router.navigate(['/videos']);
  }
}