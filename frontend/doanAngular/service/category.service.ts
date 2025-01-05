import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:3000/api/categories'; // URL API

  constructor(private http: HttpClient) { }

  // Hàm lấy danh sách category từ API
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
