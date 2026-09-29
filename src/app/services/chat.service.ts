import { Injectable, signal, computed } from '@angular/core';
import { ChatMessage, ChatSession } from '../componants/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private initialSessions: ChatSession[] = [
    {
      id: 'chat-new-1',
      title: 'Neuer Chat',
      messages: [],
      createdAt: new Date(),
      isDefaultTitle: true,
    },
    {
      id: 'chat-sqli',
      title: 'SQL Injection Basics',
      messages: [
        {
          id: 'sqli-1',
          sender: 'user',
          text: 'Erkläre mir die Grundlagen von SQL Injection und wie man Prepared Statements nutzt.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'sent',
        },
        {
          id: 'sqli-2',
          sender: 'assistant',
          text: `🦆 **SQL Injection (SQLi) Grundlagen:**\n\nSQL Injection entsteht, wenn Benutzereingaben unbereinigt direkt in SQL-Queries konkateniert werden.\n\n### Beispiel (Verwundbar):\n\`\`\`sql\nSELECT * FROM users WHERE username = '\` + input + \`' AND password = '...';\n\`\`\`\n\n### Gegenmaßnahme: Prepared Statements / Parameterized Queries\n\`\`\`typescript\nconst stmt = db.prepare('SELECT * FROM users WHERE username = ?');\nconst user = stmt.get(inputUsername);\n\`\`\`\n\nDurch Parameterbindung interpretiert die SQL-Engine Eingaben stets als Datenwert und niemals als ausführbaren SQL-Code.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 59),
          status: 'sent',
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isDefaultTitle: false,
    },
    {
      id: 'chat-osint',
      title: 'OSINT Recherche',
      messages: [
        {
          id: 'osint-1',
          sender: 'user',
          text: 'Welche OSINT Werkzeuge empfiehlst du für ein Assessment?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          status: 'sent',
        },
        {
          id: 'osint-2',
          sender: 'assistant',
          text: `🦆 **OSINT Recherche & Reconnaissance:**\n\nFür passive Aufklärung empfehle ich folgende Tool-Kategorien:\n\n• **Domain & DNS:** Amass, Sublist3r, crt.sh, SecurityTrails\n• **Network & Assets:** Shodan, Censys, FOFA\n• **Social & Email:** theHarvester, Hunter.io, Sherlock\n• **Frameworks:** Maltego, SpiderFoot\n\nHalte dich stets an die rechtlichen Rahmenbedingungen und Scope-Vereinbarungen!`,
          timestamp: new Date(Date.now() - 1000 * 60 * 58),
          status: 'sent',
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isDefaultTitle: false,
    },
    {
      id: 'chat-privesc',
      title: 'Linux PrivEsc Tipps',
      messages: [
        {
          id: 'privesc-1',
          sender: 'user',
          text: 'Wie überprüfe ich SUID-Binaries auf einem Linux Server?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          status: 'sent',
        },
        {
          id: 'privesc-2',
          sender: 'assistant',
          text: `🦆 **SUID Binary Audit:**\n\nNutze folgenden Befehl, um SUID-Dateien aufzuspüren:\n\n\`\`\`bash\nfind / -perm -u=s -type f 2>/dev/null\n\`\`\`\n\nPrüfe die gefundenen Binaries anschließend auf **GTFOBins** nach bekannten Exploit- oder Escaping-Möglichkeiten.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          status: 'sent',
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isDefaultTitle: false,
    },
    {
      id: 'chat-netscan',
      title: 'Netzwerk Scan Hilfe',
      messages: [
        {
          id: 'netscan-1',
          sender: 'user',
          text: 'Was ist der Unterschied zwischen Nmap -sS und -sT?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
          status: 'sent',
        },
        {
          id: 'netscan-2',
          sender: 'assistant',
          text: `🦆 **Nmap Scan Typen:**\n\n• **\`-sS\` (TCP SYN Stealth Scan):** Sendet SYN-Pakete, schließt den 3-Way-Handshake aber mit RST ab. Wird oft nicht in standardmäßigen Anwendungs-Logs verzeichnet. Benötigt Root/Admin-Rechte.\n• **\`-sT\` (TCP Connect Scan):** Führt den vollständigen 3-Way-Handshake über das OS aus. Funktioniert ohne Root-Rechte, hinterlässt aber deutlich mehr Spuren in Logdateien.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29),
          status: 'sent',
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      isDefaultTitle: false,
    },
  ];

  chats = signal<ChatSession[]>(this.initialSessions);
  activeChatId = signal<string>('chat-new-1');
  isTyping = signal<boolean>(false);

  activeChat = computed(() => {
    const list = this.chats();
    const currentId = this.activeChatId();
    return list.find((c) => c.id === currentId) ?? list[0] ?? null;
  });

  /**
   * Generates a chat title from the first 2-3 words of the input string.
   */
  extractTitleFromInput(inputText: string): string {
    const cleaned = inputText
      .replace(/[^\p{L}\p{N}\s_-]/gu, '') // Keep letters, numbers, spaces, underscores, dashes
      .trim()
      .replace(/\s+/g, ' ');

    if (!cleaned) {
      const fallback = inputText.trim().replace(/\s+/g, ' ');
      if (!fallback) return 'Neuer Chat';
      const fallbackWords = fallback.split(' ').slice(0, 3);
      return fallbackWords.join(' ');
    }

    const words = cleaned.split(' ');
    // Pick first 2-3 words (up to 3 words)
    const titleWords = words.slice(0, 3);
    return titleWords.join(' ');
  }

  /**
   * Creates a new chat session, sets it active, and adds it to the list.
   */
  createNewChat(): ChatSession {
    const newSession: ChatSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'chat-' + Date.now(),
      title: 'Neuer Chat',
      messages: [],
      createdAt: new Date(),
      isDefaultTitle: true,
    };

    this.chats.update((current) => [newSession, ...current]);
    this.activeChatId.set(newSession.id);
    this.isTyping.set(false);
    return newSession;
  }

  /**
   * Selects an active chat by ID.
   */
  selectChat(chatId: string): void {
    if (this.chats().some((c) => c.id === chatId)) {
      this.activeChatId.set(chatId);
      this.isTyping.set(false);
    }
  }

  /**
   * Deletes a chat session by ID.
   */
  deleteChat(chatId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.chats.update((current) => {
      const filtered = current.filter((c) => c.id !== chatId);
      return filtered;
    });

    // If the active chat was deleted, switch to the first remaining or create a new one
    if (this.activeChatId() === chatId) {
      const remaining = this.chats();
      if (remaining.length > 0) {
        this.activeChatId.set(remaining[0].id);
      } else {
        this.createNewChat();
      }
    }
  }

  /**
   * Sends a message to the active chat session and updates the title if it's the first message.
   */
  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    let current = this.activeChat();
    if (!current) {
      current = this.createNewChat();
    }

    const currentChatId = current.id;
    const shouldUpdateTitle = current.isDefaultTitle || current.messages.length === 0 || current.title === 'Neuer Chat';
    const newTitle = shouldUpdateTitle ? this.extractTitleFromInput(trimmed) : current.title;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
      status: 'sent',
    };

    // Update active chat with new title & user message
    this.chats.update((sessions) =>
      sessions.map((s) => {
        if (s.id === currentChatId) {
          return {
            ...s,
            title: newTitle,
            isDefaultTitle: false,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    this.isTyping.set(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText = this.generateBotResponse(trimmed);
      const botMessage: ChatMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
        status: 'sent',
      };

      this.chats.update((sessions) =>
        sessions.map((s) => {
          if (s.id === currentChatId) {
            return {
              ...s,
              messages: [...s.messages, botMessage],
            };
          }
          return s;
        })
      );

      this.isTyping.set(false);
    }, 1000);
  }

  /**
   * Triggers a quick prompt action.
   */
  sendQuickPrompt(promptText: string): void {
    this.sendMessage(promptText);
  }

  private generateBotResponse(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes('vulnerability') || lower.includes('schwachstelle') || lower.includes('scan')) {
      return `🦆 **Vulnerability Scan Analyse gestartet:**\n\nIch kann deine Zielsysteme oder IP-Bereiche auf bekannte CVEs, offene Ports und Fehlkonfigurationen analysieren.\n\n• **Empfohlene Tools:** Nmap, Nuclei, OpenVAS\n• **Schritt 1:** Port-Enumeration & Service Detection\n• **Schritt 2:** CVE-Matching und Exploit-Plausibilitätsprüfung\n\nGib mir gerne eine Ziel-Domain oder Konfigurationsdatei zum Prüfen!`;
    }

    if (lower.includes('malware') || lower.includes('analyse') || lower.includes('datei') || lower.includes('sample')) {
      return `🦆 **Malware-Analyse Modul bereit:**\n\nIch analysiere verdächtige Hashes (MD5, SHA256), Binaries, Skripte oder Makros.\n\n• **Statische Analyse:** String-Extraction, PE-Header, Entropie-Checks\n• **Dynamische Analyse:** Sandbox-Verhalten, Registry-Keys, Netzwerk-Callbacks\n\nLade ein Code-Snippet hoch oder nenne mir den Hash zur Prüfung.`;
    }

    if (lower.includes('threat') || lower.includes('bedrohung') || lower.includes('ioc')) {
      return `🦆 **Threat Intelligence Feeds aktiv:**\n\nAktuelle Bedrohungslage und IoCs (Indicators of Compromise):\n\n• Überwachung von APT-Gruppen & aktuellen CVE-Trends\n• Korrelation von IP-Reputationen und C2-Servern\n• MITRE ATT&CK Mapping für Angriffsmuster\n\nWelche Bedrohung oder welcher Threat Actor soll genauer untersucht werden?`;
    }

    if (lower.includes('osint') || lower.includes('search') || lower.includes('quelle') || lower.includes('recherche')) {
      return `🦆 **OSINT Recherche initialisiert:**\n\nRecherche über offene Quellen und digitale Fußabdrücke:\n\n• DNS-Records, Subdomain Enumeration & WHOIS Daten\n• Shodan / Censys Asset Discovery\n• Breach Data & Leak-Prüfungen\n\nWelches Ziel oder welche Organisation möchtest du aufklären?`;
    }

    if (lower.includes('brute') || lower.includes('hydra') || lower.includes('password') || lower.includes('passwort')) {
      return `🦆 **Brute Force & Authentication Security:**\n\n• **Mechanismen:** Dictionary Attacks, Rule-based Hybrid Attacks\n• **Tools:** Hydra, Medusa, Hashcat, John the Ripper\n• **Verteidigung:** Rate-Limiting, Account Lockout, MFA, Fail2ban\n\nWie lautet dein konkreter Testfall?`;
    }

    if (lower.includes('wireshark') || lower.includes('pcap') || lower.includes('filter') || lower.includes('netzwerk')) {
      return `🦆 **Netzwerkanalyse & Wireshark:**\n\n• **Wichtige Filter:** \`http.request.method == "POST"\`, \`tcp.flags.syn == 1 and tcp.flags.ack == 0\`, \`dns.flags.response == 0\`\n• **Security Checks:** Unverschlüsselter Klartext-Traffic, DNS Tunneling, ARP Spoofing Anomalien.\n\nBeschreibe das verdächtige Verhalten oder füge Paket-Details ein!`;
    }

    if (lower.includes('reverse') || lower.includes('shell') || lower.includes('payload')) {
      return `🦆 **Reverse Shell Analyse:**\n\n• **Konzept:** Zielsystem initiiert eine ausgehende TCP-Verbindung zurück zum Angreifer-Listener (\`nc -lvnp <port>\`), um Firewall-Ingress-Regeln zu umgehen.\n• **Sicherheitsperspektive:** Überwache ausgehenden Traffic auf unübliche Ports und blockiere unautorisierte Subprozess-Spawns.`;
    }

    return `🦆 **Pinke Ente ist am Start!**\n\nIch habe deine Anfrage erhalten: "${prompt}".\n\nAls spezialisierter Pentesting- und Cybersecurity-Assistent unterstütze ich dich bei Sicherheitsanalysen, Exploit-Verständnis, Code-Audits und OSINT-Aufgaben.\n\nWie soll der nächste Schritt aussehen?`;
  }
}
