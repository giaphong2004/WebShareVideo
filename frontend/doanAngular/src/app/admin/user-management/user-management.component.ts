import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../service/user/user.service';


@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = []; // Danh sách người dùng
  // currentUser = { id: 0, name: '', email: '' }; // Dữ liệu người dùng hiện tại
  // isEdit = false; // Trạng thái chỉnh sửa

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers(); // Lấy danh sách người dùng khi khởi tạo
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  // onSubmit(): void {
  //   if (this.isEdit) {
  //     this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe(
  //       () => {
  //         this.getUsers();
  //         this.clearForm();
  //       },
  //       (error) => console.error(error)
  //     );
  //   } else {
  //     this.userService.addUser(this.currentUser).subscribe(
  //       () => {
  //         this.getUsers();
  //         this.clearForm();
  //       },
  //       (error) => console.error(error)
  //     );
  //   }
  // }

 
  deleteUser(user_id: number): void {
   
    this.userService.deleteUser(user_id).subscribe(() => {
      this.loadUsers(); // Reload categories after deletion
    });
  
}
 // editUser(user: any): void {
  //   this.currentUser = { ...user };
  //   this.isEdit = true;
  // }

  // clearForm(): void {
  //   this.currentUser = { id: 0, name: '', email: '' };
  //   this.isEdit = false;
  // }
}
