import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) { }

  addComment(comment: { videoId: number, username: string, text: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/addComment`, comment);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteComment/${commentId}`);
  }

  updateComment(commentId: number, newText: string): Observable<any> {
    const updatedComment = { text: newText };
    return this.http.put(`${this.apiUrl}/updateComment/${commentId}`, updatedComment);
  }

  getComments(videoId: number): Observable<{ id: number, username: string, text: string }[]> {
    return this.http.get<{ id: number, username: string, text: string }[]>(`${this.apiUrl}/${videoId}`);
  }
}