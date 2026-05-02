import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAuthenticated$ = this.authService.token$;
  isAdmin$ = this.authService.currentUser$.pipe(
    map((user: any) => user?.role === 'admin'),
  );

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
