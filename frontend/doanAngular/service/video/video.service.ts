import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api/video';

  constructor(private http: HttpClient) {}

  // Hàm lấy danh sách video từ API
  getVideo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Hàm lấy thông tin video theo id từ API
  getVideoById(video_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${video_id}`);
  }

  addVideo(video: any): Observable<any> {
    return this.http.post(this.apiUrl, video);
  }

  updateVideo(video_id: number, video: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${video_id}`, video);
  }

  deleteVideo(video_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${video_id}`);
  }
}
