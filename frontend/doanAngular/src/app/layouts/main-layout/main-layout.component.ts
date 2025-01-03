import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  title = 'doanAngular';
  isLoggedIn = false;
  username = '';

  isDropdownVisible: boolean = false; // Trạng thái của dropdown (hiển thị hay không)

  // Toggle hiển thị dropdown khi bấm vào avatar
  toggleDropdown() {
    console.log('Dropdown toggled');
    this.isDropdownVisible = !this.isDropdownVisible;
    console.log('Dropdown visible:', this.isDropdownVisible);
  }

  constructor(public authService: AuthService, private router: Router) {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUsername.subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
