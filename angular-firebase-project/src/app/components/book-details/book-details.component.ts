import { Component, OnDestroy, OnInit } from "@angular/core";
import { BooksService } from "../../services/books.service";
import { FirestoreService } from "../../services/firestore.service";
import { ActivatedRoute } from "@angular/router";
import { BookModel } from "../../models/book.model";
import { BookRatingModel } from "../../models/book-rating.model";
import { RatingModel } from "../../models/rating.model";
import { UserModel } from "../../models/user.model";
import { firstValueFrom, Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrl: "./book-details.component.scss",
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book?: BookModel;
  bookId?: string | null;
  UId?: string | null;
  user?: UserModel;
  isModalShown: boolean = false;
  public ratings: BookRatingModel[] = [];
  public averageBookRating: number = 0;
  bookStatus: string = "";
  subscriptions: Subscription[] = [];

  constructor(
    private bookService: BooksService,
    private firestoreService: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.authService.UId$.subscribe({
      next: (id) => (this.UId = id),
    });
  }

  async ngOnInit(): Promise<void> {
    this.bookId = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.bookId) {
      this.subscriptions.push(
        this.bookService.getBook(this.bookId).subscribe({
          next: (book: BookModel) => (this.book = book),
          error: (error) => console.log(error),
        })
      );

      let bookRatings: RatingModel[] = await firstValueFrom(
        this.firestoreService.getRatingsByBookId(this.bookId)
      );

      let ratingSum = 0;

      bookRatings.map((rating) => {
        ratingSum += rating.stars;

        this.subscriptions.push(
          this.firestoreService.getUser(rating.userId).subscribe({
            next: (user: UserModel) => {
              this.ratings.push({
                avatar: user.avatar,
                userName: user.userName,
                stars: rating.stars,
                remarkInText: rating.remarkInText,
              });
            },
          })
        );
      });

      this.averageBookRating = ratingSum / bookRatings.length;

      this.subscriptions.push(
        this.firestoreService.getUser(this.UId!).subscribe({
          next: (user) => {
            this.user = user;
            if (
              user.currentlyReading.some((book) => book.bookId === this.bookId)
            ) {
              this.bookStatus = "Currently Reading";
            }
            if (user.wishlist.includes(this.bookId!)) {
              this.bookStatus = "Wishlist";
            }
            if (user.readBooks.includes(this.bookId!)) {
              this.bookStatus = "Read";
            }
          },
        })
      );
    }
  }

  showModal() {
    this.isModalShown = !this.isModalShown;
  }

  setStatus(status: string): void {
    const oldStatus = this.bookStatus;
    this.bookStatus = status;
    if (oldStatus === "Currently Reading") {
      this.user!.currentlyReading = this.user!.currentlyReading.filter(
        (book) => book.bookId != this.bookId
      );
    }
    if (oldStatus === "Wishlist") {
      this.user!.wishlist = this.user!.wishlist.filter(
        (bookId) => bookId != this.bookId
      );
    }
    if (oldStatus === "Read") {
      this.user!.readBooks = this.user!.readBooks.filter(
        (bookId) => bookId != this.bookId
      );
    }

    if (this.bookStatus === "Currently Reading") {
      this.user?.currentlyReading.push({
        bookId: this.bookId!,
        currentPage: 0,
      });
    }
    if (this.bookStatus === "Wishlist") {
      this.user?.wishlist.push(this.bookId!);
    }
    if (this.bookStatus === "Read") {
      this.user?.readBooks.push(this.bookId!);
    }

    this.firestoreService.updateUser(this.user!);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
