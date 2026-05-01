import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app">
      <nav class="navbar">
        <div class="container">
          <div class="nav-brand">
            <h1>Poll & Voting System</h1>
          </div>
          <div class="nav-menu">
            <a routerLink="/dashboard" *ngIf="isAuthenticated$ | async">Dashboard</a>
            <a routerLink="/admin" *ngIf="(isAuthenticated$ | async) && (isAdmin$ | async)">Admin</a>
            <a routerLink="/profile" *ngIf="isAuthenticated$ | async">Profile</a>
            <a routerLink="/login" *ngIf="!(isAuthenticated$ | async)">Login</a>
            <a routerLink="/signup" *ngIf="!(isAuthenticated$ | async)">Sign Up</a>
            <button (click)="logout()" *ngIf="isAuthenticated$ | async" class="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .navbar {
        background-color: var(--dark-color);
        color: white;
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .navbar .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .nav-brand h1 {
        margin: 0;
        font-size: 1.5rem;
      }

      .nav-menu {
        display: flex;
        gap: 2rem;
        align-items: center;
      }

      .nav-menu a {
        color: white;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .nav-menu a:hover {
        color: var(--primary-color);
      }

      .nav-menu button {
        background-color: var(--primary-color);
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .nav-menu button:hover {
        background-color: #0056b3;
      }

      main {
        flex: 1;
        padding: 2rem 0;
      }

      @media (max-width: 768px) {
        .nav-menu {
          gap: 1rem;
          flex-wrap: wrap;
        }

        .nav-brand h1 {
          font-size: 1.2rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  isAuthenticated$ = this.authService.token$;
  isAdmin$ = this.authService.currentUser$.pipe(
    map((user: any) => user?.role === 'admin'),
  );

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
