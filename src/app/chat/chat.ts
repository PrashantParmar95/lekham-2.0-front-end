import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { HttpService } from '../services/http-service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {API_ENDPOINTS} from '../constants/endpoints';

interface ChatMessage {
  msg: string;
  isUserMessage: boolean;
  showResend?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, FormsModule, DragDropModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  private httpService = inject(HttpService);

  @Output() answer = new EventEmitter<string>();

  userInput: string = '';
  data_loading: boolean = false;
  isOpen: boolean = false;

  messages: ChatMessage[] = [
    { msg: 'Hello! How can I help you today?', isUserMessage: false }
  ];

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  /** Send message */
  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    // Add user message
    this.messages.push({ msg: text, isUserMessage: true });
    this.userInput = '';
    this.data_loading = true;

    // Call AI service
    this.httpService.postSecured(API_ENDPOINTS.OPEN_AI.ADD_AI, { prompt: text }).subscribe({
      next: (rawResponse: any) => {
        this.data_loading = false;
        try {
          const parsedResponse = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;
          const choices = parsedResponse?.choices ?? [];

          choices.forEach((choice: any) => {
            const content = choice?.message?.content?.trim();
            if (content) {
              this.messages.push({
                msg: content.replace(/\n/g, '<br>'),
                isUserMessage: false
              });
              this.answer.emit(content);
            }
          });
        } catch {
          this.messages.push({ msg: 'Something went wrong', isUserMessage: false });
        }
      },
      error: () => {
        this.data_loading = false;
        this.messages.push({ msg: 'Error fetching AI response', isUserMessage: false });
      }
    });
  }

  copyMessage(msg: string, index: number) {
    navigator.clipboard.writeText(msg.replace(/<br>/g, '\n')).then(() => {
      this.messages[index].showResend = true;
    });
  }

  resendMessage(msg: string) {
    this.userInput = msg.replace(/<br>/g, '\n');
  }

  closePopup(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('chat-overlay')) {
      this.isOpen = false;
    }
  }

  handleEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    this.sendMessage();
  }
}
