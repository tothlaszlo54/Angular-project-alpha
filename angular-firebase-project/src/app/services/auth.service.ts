import { Injectable } from "@angular/core";
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@angular/fire/auth";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  tap,
  throwError,
} from "rxjs";
import { ToastrService } from "ngx-toastr";
import { collection, Firestore } from "@angular/fire/firestore";

interface userAuthData {
  email: string;
  password: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private loggedInStatus: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  private UId: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  public get UId$(): Observable<string | null> {
    return this.UId.asObservable();
  }

  public get loggedInStatus$(): Observable<boolean | null> {
    return this.loggedInStatus.asObservable();
  }
  // guardhoz kell majd
  get loggedInStatusValue(): boolean | null {
    return this.loggedInStatus.value;
  }
  // guardhoz kell majd
  checkLoggedInStatus(): boolean {
    if (!this.loggedInStatusValue) {
      this.router.navigate(["registration-login"]);
    }
    return true;
  }

  private googleAuthProvider = new GoogleAuthProvider();

  constructor(
    private auth: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  registration(regData: userAuthData): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, regData.email, regData.password)
    ).pipe(
      tap((userCredential) => {
        console.log("user adatok: ", userCredential);
        this.loggedInStatus.next(true);
        this.UId.next(userCredential.user.uid);
        this.toastr.success("Successfully registrated and logged in!");
        this.router.navigate([""]);
      }),
      catchError((error) => {
        console.log(error);

        if (error?.code === "auth/email-already-in-use") {
          this.toastr.error("This email is already in use!");
        } else {
          this.toastr.error(error?.message ?? "Something went wrong!");
        }
        return error;
      })
    ) as Observable<UserCredential>;
  }

  login(loginData: userAuthData): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
    ).pipe(
      tap((userCredential) => {
        console.log("user adatok: ", userCredential);
        this.loggedInStatus.next(true);
        this.UId.next(userCredential.user.uid);
        this.toastr.success("Successfully logged in!");
        this.router.navigate([""]);
      }),
      catchError((error) => {
        this.toastr.error(error.message);
        return error;
      })
    ) as Observable<UserCredential>;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.loggedInStatus.next(false);
    this.UId.next(null);
    this.router.navigate([""]);
  }

  checkAuthState(): void {
    this.auth.onAuthStateChanged({
      next: (user) => {
        if (user) {
          console.log("Van user initkor: ", user);
          this.loggedInStatus.next(true);
          this.UId.next(user.uid);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  async loginWithGoogle(): Promise<void> {
    const user = await signInWithPopup(this.auth, this.googleAuthProvider);
    this.toastr.success("You logged in successfully!");
    console.log(user);
    this.router.navigate([""]);
  }
}
