import { Component,OnInit} from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
@Component({
  selector: 'app-admin-layout',
  standalone: false,
  
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUsername.subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.authService.logout();
  }
}
