import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './services/auth.guard';
import { BoardComponent } from './pages/board/board.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'boards/:userId',
    loadComponent: () => import('./pages/boards/boards.component').then(m => m.BoardsComponent),
  
  },
  { path: 'boards/:userId/:id', 
    loadComponent: () => import('./pages/board/board.component').then(m => m.BoardComponent),
   } 
];