import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChatItem {
  id: string;
  title: string;
  category: 'recent' | 'heute' | 'gestern';
}

export interface ToolItem {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  activeChatId = signal<string>('chat-1');
  userMenuOpen = signal<boolean>(false);

  chatSelected = output<string>();
  newChatClicked = output<void>();
  toolSelected = output<string>();

  recentChats = signal<ChatItem[]>([
    { id: 'chat-1', title: 'Neuer Chat', category: 'recent' },
    { id: 'chat-2', title: 'SQL Injection Basics', category: 'recent' },
    { id: 'chat-3', title: 'OSINT Recherche', category: 'recent' },
    { id: 'chat-4', title: 'Linux PrivEsc Tipps', category: 'recent' },
    { id: 'chat-5', title: 'Netzwerk Scan Hilfe', category: 'recent' },
  ]);

  tools = signal<ToolItem[]>([
    { id: 'code-analysis', name: 'Code Analyse', icon: 'code' },
    { id: 'vulnerability-scan', name: 'Vulnerability Scan', icon: 'shield' },
    { id: 'osint-recherche', name: 'OSINT Recherche', icon: 'search' },
    { id: 'pentesting-tipps', name: 'Pentesting Tipps', icon: 'wand' },
    { id: 'malware-analyse', name: 'Malware Analyse', icon: 'biohazard' },
    { id: 'security-news', name: 'Security News', icon: 'news' },
  ]);

  todayChats = signal<ChatItem[]>([
    { id: 'chat-6', title: 'Brute Force Attack verstehen', category: 'heute' },
    { id: 'chat-7', title: 'Wireshark Filter Hilfe', category: 'heute' },
  ]);

  yesterdayChats = signal<ChatItem[]>([
    { id: 'chat-8', title: 'Reverse Shell mit Python', category: 'gestern' },
    { id: 'chat-9', title: 'Nmap Scan Erklärung', category: 'gestern' },
  ]);

  selectChat(id: string) {
    this.activeChatId.set(id);
    this.chatSelected.emit(id);
  }

  createNewChat() {
    const newId = 'chat-' + Date.now();
    const newChat: ChatItem = {
      id: newId,
      title: 'Neuer Chat',
      category: 'recent',
    };
    this.recentChats.update((chats) => [newChat, ...chats]);
    this.activeChatId.set(newId);
    this.newChatClicked.emit();
  }

  selectTool(toolId: string) {
    this.toolSelected.emit(toolId);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
  }
}

