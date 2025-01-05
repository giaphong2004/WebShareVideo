import { MessageService } from './../../../../service/message.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessage();
    }

    loadMessage(): void {
      this.messageService.getMessage().subscribe(data => {
      this.messages = data;
      });
      } 
}
