import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PollService, Poll } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="admin-layout">
        <div class="create-poll-section">
          <h2>Create New Poll</h2>
          <form [formGroup]="createPollForm" (ngSubmit)="onCreatePoll()">
            <div class="form-group">
              <label>Poll Title</label>
              <input type="text" formControlName="title" placeholder="Enter poll title" />
              <span *ngIf="title.invalid && title.touched" class="error">Title is required</span>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea formControlName="description" placeholder="Enter poll description"></textarea>
              <span *ngIf="description.invalid && description.touched" class="error">Description is required</span>
            </div>

            <div class="form-group">
              <label>Options (2-4 options required)</label>
              <div *ngFor="let i of [0, 1, 2, 3]; let last = last" class="option-input">
                <input
                  type="text"
                  [formControl]="getOptionControl(i)"
                  placeholder="Option {{ i + 1 }}"
                  [required]="i < 2"
                />
              </div>
              <span *ngIf="optionsError" class="error">{{ optionsError }}</span>
            </div>

            <div *ngIf="createErrorMessage" class="alert alert-danger">{{ createErrorMessage }}</div>
            <div *ngIf="createSuccessMessage" class="alert alert-success">{{ createSuccessMessage }}</div>

            <button type="submit" class="btn btn-primary" [disabled]="createPollForm.invalid || isCreatingPoll">
              {{ isCreatingPoll ? 'Creating...' : 'Create Poll' }}
            </button>
          </form>
        </div>

        <div class="polls-management-section">
          <h2>Manage Polls</h2>
          <div *ngIf="isLoadingPolls" class="loading">
            <div class="spinner"></div>
            <p>Loading polls...</p>
          </div>

          <div *ngIf="!isLoadingPolls && allPolls.length === 0" class="alert alert-info">
            No polls created yet.
          </div>

          <div *ngIf="!isLoadingPolls && allPolls.length > 0" class="polls-list">
            <div *ngFor="let poll of allPolls" class="poll-item">
              <div class="poll-info">
                <h3>{{ poll.title }}</h3>
                <p class="description">{{ poll.description }}</p>
                <p class="status" [class.closed]="poll.status === 'closed'">
                  Status: <strong>{{ poll.status | uppercase }}</strong>
                </p>
              </div>
              <div class="poll-actions">
                <button
                  (click)="closePoll(poll.id)"
                  *ngIf="poll.status === 'active'"
                  class="btn btn-warning"
                  [disabled]="isUpdatingPoll"
                >
                  Close
                </button>
                <button (click)="deletePoll(poll.id)" class="btn btn-danger" [disabled]="isUpdatingPoll">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .create-poll-section,
      .polls-management-section {
        background-color: white;
        padding: 2rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
      }

      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
      }

      .option-input {
        margin-bottom: 0.5rem;
      }

      .option-input input {
        width: 100%;
      }

      .error {
        color: var(--danger-color);
        font-size: 0.875rem;
        display: block;
        margin-top: 0.25rem;
      }

      .polls-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .poll-item {
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 0.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .poll-info {
        flex: 1;
      }

      .poll-info h3 {
        margin: 0 0 0.5rem 0;
      }

      .description {
        margin: 0.25rem 0;
        color: var(--secondary-color);
        font-size: 0.9rem;
      }

      .status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background-color: var(--light-color);
        border-radius: 0.25rem;
        font-size: 0.85rem;
        margin-top: 0.5rem;
      }

      .status.closed {
        background-color: #ffe0e0;
        color: var(--danger-color);
      }

      .poll-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        margin: 0;
        white-space: nowrap;
      }

      @media (max-width: 768px) {
        .admin-layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminPanelComponent implements OnInit {
  createPollForm: FormGroup;
  allPolls: Poll[] = [];
  isCreatingPoll = false;
  isLoadingPolls = true;
  isUpdatingPoll = false;
  createErrorMessage = '';
  createSuccessMessage = '';
  optionsError = '';

  get title() {
    return this.createPollForm.get('title')!;
  }
  get description() {
    return this.createPollForm.get('description')!;
  }

  constructor(
    private fb: FormBuilder,
    private pollService: PollService,
    private authService: AuthService,
  ) {
    this.createPollForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control(''),
        this.fb.control(''),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadPolls();
  }

  getOptionControl(index: number): FormControl {
    const optionsArray = this.createPollForm.get('options') as FormArray;
    return optionsArray.at(index) as FormControl;
  }

  loadPolls(): void {
    this.pollService.getAllPolls().subscribe({
      next: (data) => {
        this.allPolls = data;
        this.isLoadingPolls = false;
      },
      error: () => {
        this.isLoadingPolls = false;
      },
    });
  }

  onCreatePoll(): void {
    console.log('Form valid:', this.createPollForm.valid);
    console.log('Form value:', this.createPollForm.value);
    console.log('Form errors:', this.createPollForm.errors);
    
    if (this.createPollForm.valid) {
      const optionsArray = this.createPollForm.get('options') as FormArray;
      const options = optionsArray.value.filter((opt: string) => opt.trim());

      if (options.length < 2 || options.length > 4) {
        this.optionsError = 'Poll must have between 2 and 4 options';
        return;
      }

      this.optionsError = '';
      this.isCreatingPoll = true;
      this.createErrorMessage = '';
      this.createSuccessMessage = '';

      const request = {
        title: this.createPollForm.value.title,
        description: this.createPollForm.value.description,
        options,
      };

      this.pollService.createPoll(request).subscribe({
        next: () => {
          this.createSuccessMessage = 'Poll created successfully!';
          this.createPollForm.reset();
          this.loadPolls();
          this.isCreatingPoll = false;
        },
        error: (err) => {
          console.error('Create poll error:', err);
          this.createErrorMessage = err.error?.message || err.message || 'Failed to create poll';
          this.isCreatingPoll = false;
        },
      });
    } else {
      console.log('Form is invalid, cannot submit');
    }
  }

  closePoll(pollId: string): void {
    this.isUpdatingPoll = true;
    this.pollService.closePoll(pollId).subscribe({
      next: () => {
        this.loadPolls();
        this.isUpdatingPoll = false;
      },
      error: () => {
        this.isUpdatingPoll = false;
      },
    });
  }

  deletePoll(pollId: string): void {
    if (confirm('Are you sure you want to delete this poll?')) {
      this.isUpdatingPoll = true;
      this.pollService.deletePoll(pollId).subscribe({
        next: () => {
          this.loadPolls();
          this.isUpdatingPoll = false;
        },
        error: () => {
          this.isUpdatingPoll = false;
        },
      });
    }
  }
}
