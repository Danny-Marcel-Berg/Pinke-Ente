import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new chat session when createNewChat is called', () => {
    const initialCount = service.chats().length;
    const newChat = service.createNewChat();

    expect(newChat).toBeTruthy();
    expect(newChat.title).toBe('Neuer Chat');
    expect(newChat.messages.length).toBe(0);
    expect(service.chats().length).toBe(initialCount + 1);
    expect(service.activeChatId()).toBe(newChat.id);
  });

  it('should extract the first 2-3 words as chat title from input', () => {
    expect(service.extractTitleFromInput('Wie analysiere ich eine Datei?')).toBe('Wie analysiere ich');
    expect(service.extractTitleFromInput('SQL Injection')).toBe('SQL Injection');
    expect(service.extractTitleFromInput('Hallo')).toBe('Hallo');
    expect(service.extractTitleFromInput('   Brute   Force   Attack   verstehen   ')).toBe('Brute Force Attack');
  });

  it('should update chat title with the first 2-3 words of input upon first message', () => {
    const newChat = service.createNewChat();
    expect(newChat.title).toBe('Neuer Chat');

    service.sendMessage('Was ist ein Pentest Report?');
    const updated = service.chats().find((c) => c.id === newChat.id);
    expect(updated?.title).toBe('Was ist ein');
  });
});
