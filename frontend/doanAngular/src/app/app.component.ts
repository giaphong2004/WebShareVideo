import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'doanAngular';

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout().subscribe(() => {
      // Handle logout logic if needed
    });
  }
}