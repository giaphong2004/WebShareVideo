import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../../service/video/video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  video: any; // Đổi tên biến từ videos thành video để rõ ràng hơn
  safeUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const video_id = params['video_id'];
      this.loadVideo(video_id);
    });
  }

  loadVideo(video_id: number) {
    this.videoService.getVideoById(video_id).subscribe(
      data => {
        console.log('Video data:', data); // Thêm log để kiểm tra dữ liệu
        if (data && data.length > 0) {
          this.video = data[0]; // Truy cập đối tượng video đầu tiên trong mảng
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.video.url_video);
        }
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
