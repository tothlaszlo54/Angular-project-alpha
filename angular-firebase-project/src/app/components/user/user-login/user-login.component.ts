import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.component.html",
  styleUrl: "./user-login.component.scss",
})
export class UserLoginComponent {
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  public message: string = "Please check your email and password!";
  showPassword = false;
  showConfirm = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(event: Event, field: "password" | "confirm") {
    event.preventDefault();
    if (field === "password") this.showPassword = !this.showPassword;
    else this.showConfirm = !this.showConfirm;
  }

  get email(): AbstractControl | null {
    return this.loginForm.get("email");
  }

  get password(): AbstractControl | null {
    return this.loginForm.get("password");
  }

  public login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log("Login successful", res);
      },
      error: (err) => {
        console.error("Login failed", err);
        alert("Login failed: " + this.message);
      },
      complete: () => this.router.navigate([""]),
    });
  }
}
