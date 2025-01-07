import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-user-form',
  standalone: false,
  
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit{
  user: any = { user: '' };
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.userService.getUserById(this.id).subscribe((data: any) => {
        this.user = data;
      });
    }
  }


  saveUser(): void {
    if (this.id) {
      this.userService.updateUser(this.id, this.user).subscribe(() => {
        this.router.navigate(['/admin/user-management']);
      });
    } else {
      this.userService. addUser(this.user).subscribe(() => {
        this.router.navigate(['/admin/user-management']);
      });
    }
  }
}
