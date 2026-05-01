import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container signup-container">
      <div class="signup-card">
        <h2>Create Account</h2>
        <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="Enter your full name" />
            <span *ngIf="name.invalid && name.touched" class="error">Name is required</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="Enter your email" />
            <span *ngIf="email.invalid && email.touched" class="error">Valid email is required</span>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Enter password (min 6 characters)" />
            <span *ngIf="password.invalid && password.touched" class="error">Password must be at least 6 characters</span>
          </div>

          <div class="form-group">
            <label>Select Your State</label>
            <select formControlName="state">
              <option value="">Choose a state...</option>
              <option *ngFor="let state of states" [value]="state">{{ state }}</option>
            </select>
            <span *ngIf="state.invalid && state.touched" class="error">State is required</span>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="signupForm.invalid || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>

          <p class="text-center">
            Already have an account? <a routerLink="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .signup-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
      }

      .signup-card {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h2 {
        text-align: center;
        margin-bottom: 2rem;
      }

      .error {
        color: var(--danger-color);
        font-size: 0.875rem;
        display: block;
        margin-top: 0.25rem;
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      p {
        margin-top: 1rem;
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  states = NIGERIAN_STATES;

  get name() {
    return this.signupForm.get('name')!;
  }
  get email() {
    return this.signupForm.get('email')!;
  }
  get password() {
    return this.signupForm.get('password')!;
  }
  get state() {
    return this.signupForm.get('state')!;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signUp(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Sign up failed';
          this.isLoading = false;
        },
      });
    }
  }
}
