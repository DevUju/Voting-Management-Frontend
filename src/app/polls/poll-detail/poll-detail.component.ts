import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PollService, Poll } from '../poll.service';
import { VoteService } from '../../votes/vote.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css'],
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
