import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  // Hàm lấy danh sách người dùng từ API
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addUser(user: any): Observable<any> {
    // thêm dữ liệu vào server json-server
    return this.http.post(this.apiUrl, user); // trả về dữ liệu
  }

  updateUser(user_id: number, user: any): Observable<any> {
    // cập nhật dữ liệu vào server json-server
    return this.http.put(`${this.apiUrl}/${user_id}`, user); // trả về dữ liệu
  }

  deleteUser(user_id: number): Observable<any> {
    // xóa dữ liệu vào server json-server
    return this.http.delete(`${this.apiUrl}/${user_id}`); // trả về dữ liệu
  }

  getUserById(user_id: number): Observable<any> {
    // lấy dữ liệu từ server json-server theo id
    return this.http.get(`${this.apiUrl}/${user_id}`); // trả về dữ liệu
  }
  // Thêm phương thức để lấy thông tin người dùng hiện tại
  currentUserId(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }
}
