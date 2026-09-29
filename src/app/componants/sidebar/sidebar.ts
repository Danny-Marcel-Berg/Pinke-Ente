import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly chatService = inject(ChatService);

  onNewChat(): void {
    this.chatService.createNewChat();
  }

  onSelectChat(chatId: string): void {
    this.chatService.selectChat(chatId);
  }

  onDeleteChat(chatId: string, event: Event): void {
    this.chatService.deleteChat(chatId, event);
  }

  onToolClick(toolName: string): void {
    this.chatService.sendQuickPrompt(`Starte ein Modul für ${toolName} und erkläre mir die Vorgehensweise.`);
  }

  onHistoryClick(title: string): void {
    this.chatService.sendQuickPrompt(title);
  }
}