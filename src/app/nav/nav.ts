import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {RouterLink} from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class NavComponent {
  websiteName = 'Lekham+';

  navItems = signal<NavItem[]>([
    {
      label: 'Home',
      icon: '🏠',
      route: '/home'
    },
    {
      label: 'Articles',
      icon: '📝',
      children: [
        { label: 'Technology', icon: '💻', route: '/articles/tech' },
        { label: 'History', icon: '📜', route: '/articles/history' },
        { label: 'Science', icon: '🔬', route: '/articles/science' }
      ]
    },
    {
      label: 'About',
      icon: 'ℹ️',
      route: '/about'
    }
  ]);

  user = signal<User>({
    name: 'Prashant Kumar',
    email: 'prashant@example.com',
    avatar: 'https://i.pravatar.cc/40' // sample avatar
  });

  showUserMenu = signal(false);
  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }
}
