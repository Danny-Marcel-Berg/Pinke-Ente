import { Component, ElementRef, ViewChild, input, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatMessage } from '../chat/chat.model';

@Component({
  selector: 'app-chat-window',
  imports: [DatePipe],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
})
export class ChatWindow {
  messages = input<ChatMessage[]>([]);
  isTyping = input<boolean>(false);

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  copiedId = signal<string | null>(null);

  constructor() {
    effect(() => {
      // Track messages and isTyping to trigger scroll
      this.messages();
      this.isTyping();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  copyMessage(msg: ChatMessage): void {
    navigator.clipboard.writeText(msg.text).then(() => {
      this.copiedId.set(msg.id);
      setTimeout(() => {
        if (this.copiedId() === msg.id) {
          this.copiedId.set(null);
        }
      }, 2000);
    });
  }
}
