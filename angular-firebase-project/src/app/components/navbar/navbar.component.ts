import { Component, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { AuthService } from "../../services/auth.service";
import { UserModel } from "../../models/user.model";
import { FirestoreService } from "../../services/firestore.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit {
  public loggedInStatus$ = this.authService.loggedInStatus$;
  public currentUser?: UserModel;
  public loggedIn!: boolean | null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInStatus$.subscribe((status) => {
      this.loggedIn = status;
    });

    this.authService.UId$.subscribe((uid) => {
      if (uid) {
        this.firestoreService.getUser(uid).subscribe((user) => {
          this.currentUser = user;
        });
      }
    });
  }

  get avatarPath(): string {
    // ha van avatar a Firestore-ban, azt használjuk, különben a defaultot
    return this.currentUser && this.loggedIn && this.currentUser.avatar
      ? `assets/${this.currentUser.avatar}.png`
      : "assets/regular_user.png";
  }

  async logout() {
    await this.authService.logout();
  }
}
