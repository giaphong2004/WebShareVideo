import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullname: string = '';
  username: string = '';
  password: string = '';
  onSubmit() {
    console.log('Fullname:', this.fullname);
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    // thuc hien logic dang ky
}
}