import { Component, OnDestroy, OnInit } from "@angular/core";
import { FirestoreService } from "../../services/firestore.service";
import { UserModel } from "../../models/user.model";
import { Subscription } from "rxjs";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrl: "./profile-info.component.scss",
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  user?: UserModel;
  UId?: string | null;
  subscriptions: Subscription[] = [];
  regForm!: FormGroup;
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = "form-control";
  options = [
    "Business",
    "Comics",
    "Crime",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Romance",
    "Science",
    "Sports",
    "Thriller",
  ];

  selectedOptions: string[] = [];
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.authService.UId$.subscribe({
      next: (id) => (this.UId = id),
    });
  }

  ngOnInit(): void {
    this.firestoreService.getUser(this.UId!).subscribe({
      next: (user) => (this.user = user),
    });
    this.regForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ]),
      favGenres: new FormControl(""),
      grid: new FormControl(false, Validators.requiredTrue),
    });
  }
  checkPasswords() {
    this.isConfirmPasswordDirty = true;
    const pass = this.password?.value ?? "";
    const conf = this.confirmPassword?.value ?? "";
    this.passwordsMatching = pass === conf;
    this.confirmPasswordClass = this.passwordsMatching
      ? "form-control is-valid"
      : "form-control is-invalid";
  }

  get email(): AbstractControl | null {
    return this.regForm.get("email");
  }

  get password(): AbstractControl | null {
    return this.regForm.get("password");
  }

  get confirmPassword(): AbstractControl | null {
    return this.regForm.get("confirmPassword");
  }

  // createUser() {
  //   if (this.regForm.valid) {
  //     delete this.regForm.value.confirmPassword;
  //     delete this.regForm.value.password;
  //     const user: UserModel = this.regForm.value;
  //     this.firestoreService.addUser(user).subscribe({
  //       next: (res) => {
  //         console.log("Registration successful", res);
  //       },
  //       error: (err) => {
  //         console.error("Registration failed", err);
  //       },
  //     });
  //     this.regForm.reset();
  //   }
  // }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
