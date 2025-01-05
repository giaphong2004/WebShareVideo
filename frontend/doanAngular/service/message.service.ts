import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/contact-messages';
  constructor(private http: HttpClient) { }

  getMessage(): Observable<any> {
    return this.http.get(this.apiUrl);
    }
}
