import { Component } from '@angular/core';
import { ChatInput } from "../chat-input/chat-input";
@Component({
  selector: 'app-chat',
  imports: [ChatInput],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

}
