import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers(); // Lấy danh sách người dùng khi khởi tạo
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  deleteUser(user_id: number): void {
    this.userService.deleteUser(user_id).subscribe(() => {
      this.loadUsers(); // Reload users after deletion
    });
  }
}
