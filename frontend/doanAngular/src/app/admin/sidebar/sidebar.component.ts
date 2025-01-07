import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../service/auth/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  constructor(private router: Router, private http: HttpClient,private authService: AuthService){}

  navigate(destination: string): void {
    if (destination === 'logout') {
      this.logout();
    } else {
      this.router.navigate([destination]);
    }
  }
//   logout(): void {
//     const confirmLogout = confirm('Are you sure you want to logout?');
//     if (confirmLogout) {
//       this.http.get('/logout').subscribe(
//         (response: any) => {
//           if (response.success) {
//             // Xóa token trong localStorage hoặc sessionStorage
//             localStorage.removeItem('authToken');
//             sessionStorage.removeItem('authToken');

//             // Chuyển hướng về trang đăng nhập
//             this.router.navigate(['/login']);
//             console.error('Logout failed:', response.message);
//           }
//         },
//         (error: any) => {
//           console.error('Logout error:', error);
//         }
//       );
//     }
  
// }

logout() {
  this.authService.logout();
}
}