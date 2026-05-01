import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="profile-card">
        <h2>User Profile</h2>
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>

        <div *ngIf="!isLoading && user">
          <div class="profile-info">
            <div class="info-item">
              <label>Name</label>
              <p>{{ user.name }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ user.email }}</p>
            </div>
            <div class="info-item">
              <label>State</label>
              <p>{{ user.state }}</p>
            </div>
            <div class="info-item">
              <label>Role</label>
              <p>
                <span class="badge" [class.admin]="user.role === 'admin'">{{ user.role | uppercase }}</span>
              </p>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading && !user" class="alert alert-danger">
          Failed to load profile information.
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-card {
        background-color: white;
        border-radius: 0.5rem;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin-top: 0;
        margin-bottom: 2rem;
      }

      .profile-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .info-item {
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
      }

      .info-item:last-child {
        border-bottom: none;
      }

      .info-item label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--secondary-color);
      }

      .info-item p {
        margin: 0;
        font-size: 1.1rem;
      }

      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background-color: var(--light-color);
        border-radius: 0.25rem;
        font-weight: 600;
        color: var(--primary-color);
      }

      .badge.admin {
        background-color: #fff3cd;
        color: #856404;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
