import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Subscription } from "rxjs";
import { UserModel } from "../../../models/user.model";
import { Router } from "@angular/router";
import { FirestoreService } from "../../../services/firestore.service";
import UserService from "../../../services/user.service";

@Component({
  selector: "app-user-reg",
  templateUrl: "./user-reg.component.html",
  styleUrl: "./user-reg.component.scss",
})
export class UserRegComponent implements OnInit, OnDestroy {
  regForm!: FormGroup;
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = "form-control";
  options = [
    "Mystery",
    "Fiction",
    "Fantasy",
    "Romance",
    "Historical",
    "Biography",
    "Religion",
    "Self-help",
    "Science",
    "Business",
    "Cooking",
    "Health",
  ];
  selectedOptions: string[] = [];
  subscriptions: Subscription[] = [];
  saveSubscription!: Subscription;
  showPassword = false;
  showConfirm = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.regForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
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
      favouriteGenres: new FormControl(""),
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

  togglePasswordVisibility(event: Event, field: "password" | "confirm") {
    event.preventDefault();
    if (field === "password") this.showPassword = !this.showPassword;
    else this.showConfirm = !this.showConfirm;
  }

  get userName(): AbstractControl | null {
    return this.regForm.get("userName");
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

  createUser() {
    if (this.regForm.valid) {
      const email = this.regForm.value.email;

      this.userService.checkIfUserExists(email).subscribe({
        next: (exists) => {
          if (exists) {
            // ha már létezik
            console.error("This email is already registered!");
            alert("This email is already registered!");
            this.regForm.reset();
          } else {
            // ha nem létezik, akkor létrehozzuk
            const user: UserModel = this.regForm.value;
            delete user.password; // jelszó nem kerülhet bele a Firestore adatbázisba

            this.saveSubscription = this.userService
              .createUser(user)
              .subscribe({
                next: (res) => {
                  console.log("Registration successful", res);
                  alert("Registration successful!");
                  this.router.navigate([""]);
                },
                error: (err) => {
                  console.error("Registration failed", err);
                  alert("Registration failed!");
                },
              });
          }
        },
        error: (err) => console.error("Error checking user existence", err),
      });
    }
  }

  public loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }
}
