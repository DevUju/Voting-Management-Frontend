import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.token$;
  menuOpen = false;
  isAdmin$ = this.authService.currentUser$.pipe(
    map((user: any) => user?.role === "admin"),
  );

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
