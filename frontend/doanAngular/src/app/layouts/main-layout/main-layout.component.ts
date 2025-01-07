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
  isLoggedIn: boolean = false;
  username: string = '';
  filteredVideos: any[] = [];
  selectedCategory: number | null = null;
  noVideosMessage: string = '';
  categories: any[] = [];
<<<<<<< HEAD
  isDropdownVisible: boolean = false;
=======
  isDropdownVisible: boolean = false; 
  role: string = '';
>>>>>>> 618a5f50279ed447a1383bdf6336458055fc7878

  constructor(
    private authService: AuthService,
    private router: Router,
    
    private videoService: VideoService // Inject VideoService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllVideos();
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUsername.subscribe((username) => {
      this.username = username;
    });
    this.authService.currentRole.subscribe((role) => {
      this.role = role;
    });
  }

  // Toggle hiển thị dropdown khi bấm vào avatar
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
    console.log('Dropdown toggled');
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
