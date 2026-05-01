import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PollService, Poll } from '../../services/poll.service';
import { VoteService } from '../../services/vote.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Loading poll...</p>
      </div>

      <div *ngIf="!isLoading && poll">
        <div class="poll-detail-card">
          <h2>{{ poll.title }}</h2>
          <p class="description">{{ poll.description }}</p>
          <p class="status" [class.closed]="poll.status === 'closed'">
            Status: <strong>{{ poll.status | uppercase }}</strong>
          </p>

          <div *ngIf="poll.status === 'active' && !isAdmin" class="voting-section">
            <h3>Cast Your Vote</h3>
            <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div *ngIf="hasVoted" class="alert alert-info">You have already voted on this poll</div>

            <div class="options-list" *ngIf="!hasVoted">
              <div *ngFor="let option of poll.options" class="option-item">
                <button
                  class="option-btn"
                  (click)="selectOption(option.id)"
                  [class.selected]="selectedOptionId === option.id"
                  [disabled]="isSubmittingVote"
                >
                  {{ option.optionText }}
                </button>
              </div>
            </div>

            <button
              *ngIf="!hasVoted"
              class="btn btn-primary"
              (click)="submitVote()"
              [disabled]="!selectedOptionId || isSubmittingVote"
            >
              {{ isSubmittingVote ? 'Submitting...' : 'Submit Vote' }}
            </button>
          </div>

          <div *ngIf="isAdmin && poll.status === 'active'" class="alert alert-info">
            Admins cannot vote in polls. You can manage polls from the Admin Panel.
          </div>

          <div *ngIf="poll.status === 'closed'" class="alert alert-warning">
            This poll has been closed and no longer accepting votes.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .poll-detail-card {
        background-color: white;
        border-radius: 0.5rem;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
      }

      h2 {
        margin-bottom: 1rem;
      }

      .description {
        font-size: 1.1rem;
        color: var(--secondary-color);
        margin-bottom: 1rem;
      }

      .status {
        padding: 0.5rem 1rem;
        background-color: var(--light-color);
        border-radius: 0.25rem;
        margin-bottom: 2rem;
        display: inline-block;
      }

      .status.closed {
        background-color: #ffe0e0;
        color: var(--danger-color);
      }

      .voting-section {
        margin-top: 2rem;
      }

      .voting-section h3 {
        margin-bottom: 1rem;
      }

      .options-list {
        margin: 1.5rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .option-item {
        display: flex;
      }

      .option-btn {
        flex: 1;
        padding: 1rem;
        border: 2px solid var(--border-color);
        background-color: white;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        text-align: left;
      }

      .option-btn:hover {
        border-color: var(--primary-color);
        background-color: rgba(0, 123, 255, 0.05);
      }

      .option-btn.selected {
        border-color: var(--primary-color);
        background-color: var(--primary-color);
        color: white;
      }

      .option-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PollDetailComponent implements OnInit {
  poll: Poll | null = null;
  isLoading = true;
  isSubmittingVote = false;
  selectedOptionId: string | null = null;
  hasVoted = false;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  constructor(
    private pollService: PollService,
    private voteService: VoteService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const pollId = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'admin';
    
    if (pollId) {
      this.loadPoll(pollId);
      this.checkIfVoted(pollId);
    }
  }

  loadPoll(pollId: string): void {
    this.pollService.getPollById(pollId).subscribe({
      next: (data) => {
        this.poll = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  checkIfVoted(pollId: string): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.voteService.getUserVoteOnPoll(user.id, pollId).subscribe({
        next: (vote) => {
          this.hasVoted = !!vote;
        },
      });
    }
  }

  selectOption(optionId: string): void {
    this.selectedOptionId = optionId;
  }

  submitVote(): void {
    if (!this.selectedOptionId || !this.poll) return;

    this.isSubmittingVote = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.voteService.createVote({ pollId: this.poll.id, optionId: this.selectedOptionId }).subscribe({
      next: () => {
        this.successMessage = 'Vote submitted successfully!';
        this.hasVoted = true;
        this.isSubmittingVote = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit vote';
        this.isSubmittingVote = false;
      },
    });
  }
}
