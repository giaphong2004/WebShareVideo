import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: false,
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullname: string = '';
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onSubmit() {
    const user = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    this.http.post('http://localhost:3000/auth/register', user).subscribe(
      (response: any) => {
        console.log(response);
        if (response.success) {
          // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
          this.router.navigate(['/login']);
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error(error);
        alert('Đăng ký thất bại, vui lòng thử lại!');
      }
    );
  }
}