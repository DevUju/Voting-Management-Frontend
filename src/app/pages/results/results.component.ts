import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoteService, VoteResult } from '../../services/vote.service';
import { AuthService, User } from '../../services/auth.service';

const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Poll Results</h2>

      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Loading results...</p>
      </div>

      <div *ngIf="!isLoading && results.length > 0">
        <div class="filter-section">
          <label>Filter by State:</label>
          <select [(ngModel)]="selectedState" (change)="filterResults()">
            <option value="">All States</option>
            <option *ngFor="let state of states" [value]="state">{{ state }}</option>
          </select>
        </div>

        <div class="results-section">
          <div *ngFor="let result of displayedResults" class="result-item">
            <div class="result-header">
              <h3>{{ result.optionText }}</h3>
              <span class="vote-count">{{ result.totalVotes }} {{ result.totalVotes === 1 ? 'vote' : 'votes' }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getPercentage(result)"></div>
            </div>
            <div *ngIf="selectedState && result.stateBreakdown[selectedState]" class="state-info">
              {{ selectedState }}: {{ result.stateBreakdown[selectedState] }} votes
            </div>
          </div>
        </div>

        <div class="total-votes">
          <p>Total votes: {{ getTotalVotes() }}</p>
        </div>
      </div>

      <div *ngIf="!isLoading && results.length === 0" class="alert alert-info">
        No votes have been cast yet.
      </div>
    </div>
  `,
  styles: [
    `
      .filter-section {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .filter-section label {
        margin: 0;
        font-weight: 600;
      }

      .filter-section select {
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        min-width: 200px;
      }

      .results-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .result-item {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
      }

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .result-header h3 {
        margin: 0;
      }

      .vote-count {
        background-color: var(--light-color);
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-weight: 600;
        color: var(--primary-color);
      }

      .progress-bar {
        background-color: var(--light-color);
        border-radius: 0.25rem;
        height: 30px;
        overflow: hidden;
      }

      .progress-fill {
        background-color: var(--primary-color);
        height: 100%;
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 0.5rem;
        color: white;
        font-weight: 600;
      }

      .state-info {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: var(--secondary-color);
      }

      .total-votes {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-top: 2rem;
        font-weight: 600;
      }
    `,
  ],
})
export class ResultsComponent implements OnInit {
  results: VoteResult[] = [];
  displayedResults: VoteResult[] = [];
  isLoading = true;
  selectedState = '';
  states = NIGERIAN_STATES;
  currentUser: User | null = null;

  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const pollId = this.route.snapshot.paramMap.get('id');
    if (pollId) {
      this.loadResults(pollId);
    }
  }

  loadResults(pollId: string): void {
    this.voteService.getPollResults(pollId).subscribe({
      next: (data) => {
        this.results = data;
        this.displayedResults = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  filterResults(): void {
    if (this.selectedState) {
      const pollId = this.route.snapshot.paramMap.get('id');
      if (pollId) {
        this.voteService.getPollResultsByState(pollId, this.selectedState).subscribe({
          next: (data) => {
            this.displayedResults = data;
          },
        });
      }
    } else {
      this.displayedResults = this.results;
    }
  }

  getPercentage(result: VoteResult): number {
    const total = this.getTotalVotes();
    return total > 0 ? (result.totalVotes / total) * 100 : 0;
  }

  getTotalVotes(): number {
    return this.results.reduce((sum, result) => sum + result.totalVotes, 0);
  }
}
