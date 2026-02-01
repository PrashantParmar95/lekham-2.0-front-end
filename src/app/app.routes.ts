import { Routes } from '@angular/router';
import { LoginComponent} from './login/login';
import { Dashboard } from './dashboard/dashboard';
import {AddLekh} from './add-lekh/add-lekh';
import {Lekh} from './lekh/lekh';
import {Categories} from './categories/categories';
import {CategoryWithLekh} from './category-with-lekh/category-with-lekh';
import {Chat} from './chat/chat';
import {RegisterComponent} from './register/register';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent, // default route
  },{
    path: 'login',
    component: LoginComponent, // default route
  },{
    path: '*',
    component: LoginComponent, // default route
  },{
    path: 'dashboard',
    component: Dashboard, // redirect unknown paths to login
  },{
    path: 'add-lekh/:categoryId/:parentId',
    component: AddLekh, // redirect unknown paths to login
  },{
    path: 'lekh/:id',
    component: Lekh, // redirect unknown paths to login
  },{
    path: 'categories',
    component: Categories, // redirect unknown paths to login
  },{
    path: 'category-with-lekh/:id',
    component: CategoryWithLekh
},{
    path: 'category-with-lekh',
    component: Categories
  },
  {
    path: 'chat',
    component: Chat
  },{
    path: 'register',
    component: RegisterComponent
  }
];
