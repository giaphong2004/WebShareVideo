import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInStatus = false;
  private username: string = '';

  constructor(private http: HttpClient, private router: Router) {
    if (this.isLocalStorageAvailable()) {
      this.loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
      this.username = localStorage.getItem('username') || '';
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/auth', { username, password });
  }

  logout(): Observable<any> {
    this.loggedInStatus = false;
    this.username = '';
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
    }
    return this.http.get('http://localhost:3000/logout');
  }

  setLoggedIn(value: boolean, username: string) {
    this.loggedInStatus = value;
    this.username = username;
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedIn', JSON.stringify(value));
      localStorage.setItem('username', username);
    }
  }

  isLoggedIn() {
    return this.loggedInStatus;
  }

  getUsername() {
    return this.username;
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