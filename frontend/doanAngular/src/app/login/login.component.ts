import { Component } from '@angular/core';
import { HttpClient, withFetch } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(user);
  }
}
