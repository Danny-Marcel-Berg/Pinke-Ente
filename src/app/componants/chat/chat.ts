import { Component, inject, computed } from '@angular/core';
import { ChatInput } from '../chat-input/chat-input';
import { ChatWindow } from '../chat-window/chat-window';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatInput, ChatWindow],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  protected readonly chatService = inject(ChatService);

  activeChat = this.chatService.activeChat;
  messages = computed(() => this.activeChat()?.messages ?? []);
  isTyping = this.chatService.isTyping;

  handleSendMessage(text: string): void {
    this.chatService.sendMessage(text);
  }

  handleQuickPrompt(promptText: string): void {
    this.chatService.sendQuickPrompt(promptText);
  }

  startNewChat(): void {
    this.chatService.createNewChat();
  }
}

