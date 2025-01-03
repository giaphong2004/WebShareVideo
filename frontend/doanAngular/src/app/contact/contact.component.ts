import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: false,
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const contactForm = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    // Gửi dữ liệu form đến máy chủ
    this.http.post('http://localhost:3000/api/contact', contactForm).subscribe({
      next: (response: any) => {
        alert('Message sent successfully!');
        this.router.navigate(['/']); // Điều hướng đến trang chủ sau khi gửi thành công
      },
      error: (error) => {
        console.error('Failed to send message', error);
        alert('Failed to send message, please try again!');
      }
    });
  }
}
