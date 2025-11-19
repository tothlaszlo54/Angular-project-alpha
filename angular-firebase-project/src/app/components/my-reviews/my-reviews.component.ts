import { Component, OnDestroy, OnInit } from "@angular/core";
import { FirestoreService } from "../../services/firestore.service";
import { RatingModel, RatingWithBooks } from "../../models/rating.model";
import { UserModel } from "../../models/user.model";
import { BookModel } from "../../models/book.model";
import { BooksService } from "../../services/books.service";
import { forkJoin, map, mergeMap, Subscription } from "rxjs";

@Component({
  selector: "app-my-rewievs",
  templateUrl: "./my-reviews.component.html",
  styleUrl: "./my-reviews.component.scss",
})
export class MyRewievsComponent implements OnInit, OnDestroy {
  myReviews?: RatingWithBooks[];
  userId: string = "ku5ADtFcz0V8IR4jGjIt";
  user?: UserModel;
  book?: BookModel;
  subscriptions: Subscription[] = [];
  constructor(
    private firestoreService: FirestoreService,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.firestoreService
        .getRatings()
        .pipe(
          mergeMap((ratings: RatingModel[]) => {
            console.log("RATINGS: " + ratings);
            console.log("Ratings length:", ratings.length);

            const ratingsWithBooks$ = ratings.map((rating) =>
              this.booksService.getBook(rating.bookId).pipe(
                map(
                  (book: BookModel) => (
                    console.log("BOOK:" + book),
                    {
                      ...rating,
                      book,
                    }
                  )
                )
              )
            );

            return forkJoin(ratingsWithBooks$);
          })
        )
        .subscribe({
          next: (ratingsWithBooks: RatingWithBooks[]) => {
            this.myReviews = ratingsWithBooks;

            console.log(this.myReviews);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
