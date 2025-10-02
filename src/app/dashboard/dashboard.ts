import { Component } from '@angular/core';
import {Chat} from '../chat/chat';
import {AddLekh} from '../add-lekh/add-lekh';

@Component({
  selector: 'app-dashboard',
  imports: [
    Chat,
    AddLekh
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
