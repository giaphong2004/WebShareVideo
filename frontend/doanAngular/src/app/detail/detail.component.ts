import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../../service/video/video.service';
import { ActivatedRoute } from '@angular/router';
import { title } from 'node:process';

@Component({
  selector: 'app-detail',
  standalone: false,

  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  videos: any;

  constructor(
    private videoService: VideoService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const video_id = this.route.snapshot.params['video_id'];
    console.log('Video ID:', video_id); // Kiểm tra ID có được lấy ra không

    this.videoService.getVideoById(video_id).subscribe((data) => {
      this.videos = data;
    });
  }
}
