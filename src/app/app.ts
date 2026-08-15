import { Component, signal } from '@angular/core';
import { Sidebar } from './componants/sidebar/sidebar';
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

