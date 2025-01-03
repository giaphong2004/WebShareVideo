import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: false,
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    const user = {
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:3000/auth/register', user).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Registration successful!');
          this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Registration failed', error);
        alert('Registration failed, please try again!');
      }
    });
  }
}
