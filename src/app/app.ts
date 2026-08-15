import { Component, signal } from '@angular/core';
import { Sidebar } from './componants/sidebar/sidebar';
import { ChatInput } from "./componants/chat-input/chat-input";
import { Chat } from "./componants/chat/chat";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pinke_ente');
}

