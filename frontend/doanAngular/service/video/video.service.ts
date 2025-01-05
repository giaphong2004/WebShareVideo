import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api/video';
  private categoryUrl = 'http://localhost:3000/api/categories';
  private allVideosUrl = 'http://localhost:3000/api/videos';

  constructor(private http: HttpClient) {}

  // Hàm lấy danh sách video từ API
  getVideo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Hàm lấy danh sách tất cả video từ API
  getAllVideos(): Observable<any> {
    return this.http.get(this.allVideosUrl);
  }

  // Hàm lấy danh sách category từ API
  getCategories(): Observable<any> {
    return this.http.get(this.categoryUrl);
  }

  // Hàm lấy danh sách video theo category từ API
  getVideosByCategory(category_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category_id}`);
  }

  // Hàm lấy thông tin video theo id từ API
  getVideoById(video_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${video_id}`);
  }

  // Hàm lấy các video tương tự theo id từ API
  getSimilarVideos(video_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${video_id}/similar`);
  }

  // Hàm thêm video mới
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
