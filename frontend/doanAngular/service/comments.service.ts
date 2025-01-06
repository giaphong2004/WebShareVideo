import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) {}

  addComment(
    user_id: number,
    video_id: number,
    comment: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/addComment`, {
      comment,
      user_id,
      video_id,
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteComment/${commentId}`);
  }

  updateComment(commentId: number, newText: string): Observable<any> {
    const updatedComment = { text: newText };
    return this.http.put(
      `${this.apiUrl}/updateComment/${commentId}`,
      updatedComment
    );
  }

  // getComments(video_id: number): Observable<{ id: number, username: string, text: string }[]> {
  //   return this.http.get<{ id: number, username: string, text: string }[]>(`${this.apiUrl}/${video_id}`);
  // }
  getComments(
    videoId: number
  ): Observable<{ comment: string; video_id: number; user_uname: string }[]> {
    return this.http.get<
      { comment: string; video_id: number; user_uname: string }[]
    >(`${this.apiUrl}/${videoId}`);
  }
}
