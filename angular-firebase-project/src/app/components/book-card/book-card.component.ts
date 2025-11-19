import { Component, Input } from "@angular/core";
import { BookModel } from "../../models/book.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-book-card",
  templateUrl: "./book-card.component.html",
  styleUrl: "./book-card.component.scss",
})
export class BookCardComponent {
  @Input() book!: BookModel;

  constructor(private router: Router) {}

  navigateBookDetails(bookid: string): void {
    this.router.navigate(["books/" + bookid]);
  }
}
