import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'doanAngular';
  isLoggedIn = false;
  username = '';

  constructor(public authService: AuthService, private router: Router) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUsername.subscribe(username => {
      this.username = username;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Handle logout logic if needed
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
        alert('Logout failed, please try again!');
      }
    });
  }
}