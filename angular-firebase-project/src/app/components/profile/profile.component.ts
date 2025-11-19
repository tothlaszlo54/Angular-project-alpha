import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AvatarEnum, UserModel } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { FirestoreService } from "../../services/firestore.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  public currentUser?: UserModel;
  avatarOptions: AvatarEnum[] = [
    AvatarEnum.black_boy,
    AvatarEnum.black_girl,
    AvatarEnum.blonde_boy,
    AvatarEnum.blonde_girl,
    AvatarEnum.brown_boy,
    AvatarEnum.brown_girl,
  ];
  constructor(
    private router: Router,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}
  ngOnInit(): void {
    this.router.navigate(["/profile/profile-info"]);

    this.authService.UId$.subscribe((uid) => {
      if (uid) {
        this.firestoreService.getUser(uid).subscribe((user) => {
          this.currentUser = user;
        });
      }
    });
  }

  get avatarPath(): string {
    return this.currentUser && this.currentUser.avatar
      ? `assets/${this.currentUser.avatar}.png`
      : "assets/regular_user.png";
  }

  setAvatar(avatar: AvatarEnum) {
    const updatedUser = { ...this.currentUser!, avatar: avatar };
    this.firestoreService.updateUser(updatedUser).subscribe({
      next: () => (this.currentUser!.avatar = avatar),
    });
  }

  navigateTo(route: string, shelfName?: string): void {
    if (route === "bookshelf") {
      this.router.navigate([`/profile/bookshelf/${shelfName}`]);
    }
    if (route === "profile-info") {
      this.router.navigate(["/profile/profile-info"]);
    }
    if (route === "reviews") {
      this.router.navigate(["/profile/reviews"]);
    }
  }
}
