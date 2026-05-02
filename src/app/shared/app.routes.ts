import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { DashboardComponent } from '../polls/dashboard/dashboard.component';
import { PollDetailComponent } from '../polls/poll-detail/poll-detail.component';
import { ResultsComponent } from '../votes/results/results.component';
import { AdminPanelComponent } from '../polls/admin-panel/admin-panel.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard, adminGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'poll/:id', component: PollDetailComponent, canActivate: [authGuard] },
  { path: 'results/:id', component: ResultsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, adminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
