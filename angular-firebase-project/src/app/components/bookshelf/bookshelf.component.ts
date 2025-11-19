import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BooksService } from "../../services/books.service";
import { UserModel } from "../../models/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { BookModel } from "../../models/book.model";
import { forkJoin, Subscription } from "rxjs";
import { FirestoreService } from "../../services/firestore.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-bookshelf",
  templateUrl: "./bookshelf.component.html",
  styleUrl: "./bookshelf.component.scss",
})
export class BookshelfComponent implements OnInit, OnDestroy {
  UId?: string | null;
  currentPage: string = "";
  books: BookModel[] = [];
  subscriptions: Subscription[] = [];
  page: number = 1;
  maxPages: number = 1;
  pageSize: number = 12;
  shelfName?: "currentlyReading" | "wishlist" | "readBooks";
  modalBook?: BookModel;
  updatedBook?: BookModel;

  constructor(
    private firestoreService: FirestoreService,
    private bookService: BooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.UId$.subscribe({
      next: (id) => (this.UId = id),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        this.books = [];
        this.shelfName = params["shelfName"] as
          | "currentlyReading"
          | "wishlist"
          | "readBooks";
        if (this.shelfName === "currentlyReading") {
          this.subscriptions.push(
            this.firestoreService.getUser(this.UId!).subscribe({
              next: (user: UserModel) => {
                const bookList: { bookId: string; currentPage: number }[] =
                  user.currentlyReading;
                this.subscriptions.push(
                  forkJoin(
                    bookList.map((book) =>
                      this.bookService.getBook(book.bookId)
                    )
                  ).subscribe({
                    next: (books: BookModel[]) => {
                      books = books.map((book) => {
                        return {
                          ...book,
                          currentPage: bookList.find(
                            (x) => x.bookId === book.id
                          )?.currentPage,
                        };
                      });
                      this.books = books;
                      this.maxPages = Math.ceil(books.length / this.pageSize);
                    },
                  })
                );
              },
            })
          );
        } else if (this.shelfName === "wishlist") {
          this.subscriptions.push(
            this.firestoreService.getUser(this.UId!).subscribe({
              next: (user: UserModel) => {
                const bookList: string[] = user.wishlist;
                this.subscriptions.push(
                  forkJoin(
                    bookList.map((book) => this.bookService.getBook(book))
                  ).subscribe({
                    next: (books: BookModel[]) => {
                      this.books = books;
                      this.maxPages = Math.ceil(books.length / this.pageSize);
                    },
                  })
                );
              },
            })
          );
        } else {
          this.subscriptions.push(
            this.firestoreService.getUser(this.UId!).subscribe({
              next: (user: UserModel) => {
                const bookList: string[] = user.readBooks;
                this.subscriptions.push(
                  forkJoin(
                    bookList.map((book) => this.bookService.getBook(book))
                  ).subscribe({
                    next: (books: BookModel[]) => {
                      this.books = books;
                      this.maxPages = Math.ceil(books.length / this.pageSize);
                    },
                  })
                );
              },
            })
          );
        }
      })
    );
  }

  setPage(page: number): void {
    this.page = page;
  }
  navigateOrSetModal(book: BookModel): void {
    if (this.shelfName !== "currentlyReading") {
      this.router.navigate(["books/" + book.id]);
    } else {
      this.modalBook = book;
    }
  }

  setCurrentPage(page: string, bookId: string) {
    console.log(bookId);
    this.subscriptions.push(
      this.firestoreService.getUser(this.UId!).subscribe({
        next: (user) => {
          const updatedUser: UserModel = {
            ...user,
            currentlyReading: user.currentlyReading.map((book) =>
              book.bookId === bookId
                ? { ...book, currentPage: Number(page) }
                : book
            ),
          };
          this.subscriptions.push(
            this.firestoreService.updateUser(updatedUser).subscribe({
              next: () => console.log("update completed"),
            })
          );
        },
      })
    );
    this.subscriptions.push(
      this.bookService.getBook(bookId).subscribe({
        next: (book) => {
          this.modalBook = { ...book, currentPage: Number(page) };
          const index = this.books.findIndex(
            (book) => book.id === this.modalBook!.id
          );

          if (index !== -1) {
            this.books[index] = this.modalBook;
          }
        },
      })
    );
    this.currentPage = "";
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
