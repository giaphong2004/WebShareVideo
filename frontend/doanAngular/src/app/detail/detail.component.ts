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
  video: any; // Sử dụng tên biến video để nhất quán với template
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
        if (data) {
          this.video = data; // Truy cập đối tượng video
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.video.url_video);
        }
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
