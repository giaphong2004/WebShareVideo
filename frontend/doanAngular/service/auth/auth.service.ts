import { Injectable } from '@angular/core';
import { HttpClient,withFetch }  from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string>('');

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentUsername() {
    return this.username.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage if available
    if (this.isLocalStorageAvailable()) {
      const loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
      const username = localStorage.getItem('username') || '';
      this.loggedIn.next(loggedIn);
      this.username.next(username);
    }
  }

  login(user: { username: string; password: string }) {
    return this.http.post('http://localhost:3000/auth', user).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loggedIn.next(true);
          this.username.next(user.username);
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem('loggedIn', JSON.stringify(true));
            localStorage.setItem('username', user.username);
          }
          this.router.navigate(['']);
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
          if (this.isLocalStorageAvailable()) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
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
