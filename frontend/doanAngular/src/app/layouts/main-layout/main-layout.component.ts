import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth/auth.service';
import { VideoService } from '../../../../service/video/video.service'; // Import VideoService

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  title = 'doanAngular';
  isLoggedIn = false;
  username = '';
  filteredVideos: any[] = [];
  selectedCategory: number | null = null;
  noVideosMessage: string = '';
  categories: any[] = [];
  isDropdownVisible: boolean = false; // Trạng thái của dropdown (hiển thị hay không)

  constructor(
    public authService: AuthService,
    private router: Router,
    private videoService: VideoService // Inject VideoService
  ) {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUsername.subscribe((username) => {
      this.username = username;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllVideos();
  }

  // Toggle hiển thị dropdown khi bấm vào avatar
  toggleDropdown() {
    console.log('Dropdown toggled');
    this.isDropdownVisible = !this.isDropdownVisible;
    console.log('Dropdown visible:', this.isDropdownVisible);
  }

  // Hàm lấy danh sách tất cả video từ VideoService
  loadAllVideos() {
    this.videoService.getAllVideos().subscribe((data) => {
      this.filteredVideos = data;
    }, error => {
      console.error('There was an error!', error);
    });
  }

  // Hàm lấy danh sách category từ VideoService
  loadCategories() {
    this.videoService.getCategories().subscribe((data) => {
      this.categories = data;
    }, error => {
      console.error('There was an error!', error);
    });
  }

  // Hàm lọc video theo category
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

  logout() {
    this.authService.logout();
  }
}
