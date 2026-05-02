import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoteService, VoteResult } from '../vote.service';
import { AuthService, User } from '../../auth/auth.service';

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
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
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
