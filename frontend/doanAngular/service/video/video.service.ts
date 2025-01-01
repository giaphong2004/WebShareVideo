import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api/video';

  constructor(private http: HttpClient) {}

  // Hàm lấy danh sách video dùng từ API
  getVideo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  addVideo(video: any): Observable<any> {
    // thêm dữ liệu vào server json-server
    return this.http.post(this.apiUrl, video); // trả về dữ liệu
  }
  updateVideo(video_id: number, video: any): Observable<any> {
    // cập nhật dữ liệu vào server json-server
    return this.http.put(`${this.apiUrl}/${video_id}`, video); // trả về dữ liệu
  }
  deleteVideo(video_id: number): Observable<any> {
    // xóa dữ liệu vào server json-server
    return this.http.delete(`${this.apiUrl}/${video_id}`); // trả về dữ liệu
  }
  getVideoById(video_id: number): Observable<any> {
    // lấy dữ liệu từ server json-server theo id
    return this.http.get(`${this.apiUrl}/${video_id}`); // trả về dữ liệu
  }
}
