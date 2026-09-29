import { Component, output, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  disabled = input<boolean>(false);
  placeholder = input<string>('Stelle eine Frage oder beschreibe, was du brauchst...');

  messageSent = output<string>();

  inputText = signal<string>('');
  webSearchActive = signal<boolean>(false);
  codeInterpreterActive = signal<boolean>(false);

  toggleWebSearch(): void {
    this.webSearchActive.update((val) => !val);
  }

  toggleCodeInterpreter(): void {
    this.codeInterpreterActive.update((val) => !val);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const text = this.inputText().trim();
    if (!text || this.disabled()) {
      return;
    }

    this.messageSent.emit(text);
    this.inputText.set('');
  }
}
