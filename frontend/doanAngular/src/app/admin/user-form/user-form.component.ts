import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';
  
@Component({
  selector: 'app-user-form',
  standalone: false,

  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: any = { user: '', email: '', password: '' };
  id: number | null = null;

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id = +this.router.snapshot.params['id'];
    if (this.id) {
      this.userService.getUserById(this.id).subscribe((data: any) => {
        this.user = data;
      });
    }
  }

  saveUser() {
    if (this.id) {
      this.userService
        .updateUser(this.user, this.id.toString())
        .subscribe(() => {
          this.route.navigate(['/admin/user-management']);
        });
    } else {
      this.userService.addUser(this.user).subscribe(() => {
        this.route.navigate(['/admin/user-management']);
      });
    }
  }
}
