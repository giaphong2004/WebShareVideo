import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        this.authService.setLoggedIn(true, this.username);
        this.router.navigate(['/home']);
      } else {
        alert('Incorrect Username and/or Password!');
      }
    });
  }
}