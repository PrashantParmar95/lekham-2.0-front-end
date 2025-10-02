import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgFor, NgClass, NgIf} from '@angular/common';
import { ChatService } from '../services/chat-service';
import {HttpService} from '../services/http-service'; // make sure this path is correct

interface ChatMessage {
  msg: string;
  isUserMessage: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgClass, FormsModule, NgIf],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  private chatService = inject(ChatService);
  private httpService = inject(HttpService);

  userInput: string = '';
  data_loading: boolean = false;

  messages: ChatMessage[] = [
    { msg: 'Hello! How can I help you?', isUserMessage: false },
    { msg: 'Tell me about Angular 17', isUserMessage: true }
  ];
  resultMsg: ChatMessage[] = [];

  sendMessage(): void {
    this.data_loading = true;
    const text = this.userInput.trim();
    if (!text) return;

    // Add user message to chat history
    this.messages.push({ msg: text, isUserMessage: true });
    this.userInput = '';

    this.httpService.postSecured('open-ai/prompt', { prompt: text }).subscribe({
      next: (rawResponse: any) => {
        try {
          // Handle stringified response if necessary
          const parsedResponse = typeof rawResponse === 'string'
            ? JSON.parse(rawResponse)
            : rawResponse;

          const choices = parsedResponse?.choices ?? [];

          if (!Array.isArray(choices)) {
            console.warn('Unexpected response format: choices is not an array', parsedResponse);
            return;
          }

          choices.forEach((choice: any) => {
            const content = choice?.message?.content?.trim();
            if (content) {
              this.messages.push({
                msg: content.replace(/\n/g, '<br>'),
                isUserMessage: false
              });
            }
          });

        } catch (e) {
          this.messages.push({
            msg: 'Something went wrong',
            isUserMessage: false
          });
        } finally {
          this.data_loading = false;
        }
      },

      error: (err) => {
        console.error('API error:', err);
        if(err.status === 401) {
          this.messages.push({
            msg: '<span >You are not logged in. Please <a href="/login">log<a> in to continue.</span>',
            isUserMessage: false
          });
        }else {
          this.messages.push({
            msg: '<span >Please check you internet connection</span>',
            isUserMessage: false
          });
        }
        this.data_loading = false;
      }
    });
  }

}
