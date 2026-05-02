import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PollService, Poll } from '../poll.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
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
