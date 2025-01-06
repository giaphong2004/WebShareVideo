import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string>('');
  private role = new BehaviorSubject<string>('');

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentUsername() {
    return this.username.asObservable();
  }

  get currentRole() {
    return this.role.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage if available
    if (this.isLocalStorageAvailable()) {
      const loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
      const username = localStorage.getItem('username') || '';
      const role = localStorage.getItem('role') || '';
      this.loggedIn.next(loggedIn);
      this.username.next(username);
      this.role.next(role);
    }
  }

  login(user: { username: string; password: string }) {
    return this.http.post('http://localhost:3000/auth', user).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loggedIn.next(true);
          this.username.next(user.username);
          this.role.next(response.role);
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem('loggedIn', JSON.stringify(true));
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', response.role);
          }
          // Điều hướng dựa trên vai trò của người dùng
          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error(error);
        alert('Đăng nhập thất bại, vui lòng thử lại!');
      },
    });
  }

  logout() {
    return this.http.get('http://localhost:3000/logout').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loggedIn.next(false);
          this.username.next('');
          this.role.next('');
          if (this.isLocalStorageAvailable()) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
          }
          this.router.navigate(['/login']);
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('Đăng xuất thất bại, vui lòng thử lại!');
      },
    });
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
