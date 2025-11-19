import { Component, OnInit } from "@angular/core";
import { BooksService } from "../../services/books.service";
import { BookModel } from "../../models/book.model";
import { RatingModel } from "../../models/rating.model";
import { FirestoreService } from "../../services/firestore.service";
import { CartService } from "../../services/cart.service";
import { map, Observable, switchMap, forkJoin, filter } from "rxjs";

@Component({
  selector: "app-store-main",
  templateUrl: "./store-main.component.html",
  styleUrl: "./store-main.component.scss",
})
export class StoreMainComponent implements OnInit {
  books$?: Observable<RatingModel[]>;
  mostWantedBooks: BookModel[] = [];
  mWBooks?: BookModel;

  ebooks$?: Observable<BookModel[]>;

  constructor(
    private firestoreService: FirestoreService,
    private booksService: BooksService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.books$ = this.firestoreService.getRatings();
    this.ebooks$ = this.booksService.getEbooks();

    const books$ = this.books$.pipe(
      map((ratings) => ratings.map((rating) => rating.bookId)),
      switchMap((bookIds) =>
        forkJoin(bookIds.map((id) => this.booksService.getBook(id)))
      )
    );
    books$.subscribe((books) => {
      this.mostWantedBooks = books;
      this.getRandomBook();
    });
  }

  getRandomBook(): void {
    let id = Math.floor(Math.random() * this.mostWantedBooks.length);
    this.mWBooks = this.mostWantedBooks[id];
  }

  getEbooks(): void {
    if (!this.ebooks$) {
      return;
    }
    this.ebooks$ = this.booksService
      .getEbooks()
      .pipe(
        map((ebooks) => ebooks.sort((a, b) => a.title.localeCompare(b.title)))
      );
  }

  addToCart(book: BookModel): void {
    this.cartService.addToCart(book);
  }
}
