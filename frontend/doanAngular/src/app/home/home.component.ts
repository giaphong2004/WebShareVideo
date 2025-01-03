import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../../service/video/video.service';
@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  video: any[] = [];
  constructor(private videoService: VideoService) {}
  ngOnInit(): void {
    this.loadVideo();
  }
  loadVideo() {
    this.videoService.getVideo().subscribe((data) => {
      this.video = data;
    });
  }
}
