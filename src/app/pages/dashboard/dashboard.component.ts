import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollService, Poll } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Active Polls</h2>
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Loading polls...</p>
      </div>

      <div *ngIf="!isLoading && polls.length === 0" class="alert alert-info">
        No active polls available at the moment.
      </div>

      <div *ngIf="!isLoading && polls.length > 0" class="polls-grid">
        <div *ngFor="let poll of polls" class="poll-card">
          <h3>{{ poll.title }}</h3>
          <p class="description">{{ poll.description }}</p>
          <p class="text-muted">{{ poll.options.length }} options</p>
          <div class="poll-actions">
            <a *ngIf="!isAdmin" [routerLink]="['/poll', poll.id]" class="btn btn-primary">Vote</a>
            <a [routerLink]="['/results', poll.id]" class="btn btn-secondary">View Results</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .polls-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }

      .poll-card {
        background-color: white;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .poll-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .poll-card h3 {
        margin-bottom: 0.5rem;
      }

      .description {
        margin: 0.5rem 0 1rem 0;
        color: var(--secondary-color);
      }

      .poll-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .btn {
        flex: 1;
        text-align: center;
        margin: 0;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  polls: Poll[] = [];
  isLoading = true;
  isAdmin = false;

  constructor(private pollService: PollService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'admin';
    this.loadPolls();
  }

  loadPolls(): void {
    this.pollService.getActivePolls().subscribe({
      next: (data) => {
        this.polls = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
