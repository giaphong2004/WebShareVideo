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
  addCategory(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }
  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
