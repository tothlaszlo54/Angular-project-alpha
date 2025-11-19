import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BookModel } from "../../models/book.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrl: "./carousel.component.scss",
})
export class CarouselComponent {
  @ViewChild("carousel")
  carousel!: ElementRef<HTMLDivElement>;

  @Input() books: BookModel[] = [];

  private scrollAmount = 200;

  constructor(private router: Router) {}

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: "smooth",
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: "smooth",
    });
  }

  navigateBookDetails(bookid: string): void {
    this.router.navigate(["books/" + bookid]);
  }
}
