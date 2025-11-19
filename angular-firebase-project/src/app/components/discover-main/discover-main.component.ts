import { filter } from "rxjs";
import { BooksService } from "./../../services/books.service";
import { Component, OnInit } from "@angular/core";
import { BookModel } from "../../models/book.model";

@Component({
  selector: "app-discover-main",
  templateUrl: "./discover-main.component.html",
  styleUrl: "./discover-main.component.scss",
})
export class DiscoverMainComponent implements OnInit {
  searchOrGenreButtonClicked = false;
  exactMatchBook?: BookModel;

  selectedGenre: string = "";

  relatedBooks: BookModel[] = [];

  //Carousel
  newReleases: BookModel[] = [];
  mostPopular: BookModel[] = [];
  bestForYou: BookModel[] = [];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadNewReleases();
    this.loadMostPopular();
    this.loadBestForYou();
  }

  private loadNewReleases() {
    this.booksService
      .getBooks("novel&orderBy=newest")
      .subscribe((result: any) => {
        const items = result.items || [];

        // Rendezés a kiadási dátum szerint csökkenő sorrendben
        const sortedItems = items.sort((a: any, b: any) => {
          const dateA = a.volumeInfo?.publishedDate || "0000-01-01";
          const dateB = b.volumeInfo?.publishedDate || "0000-01-01";

          // YYYY-MM-DD, YYYY-MM vagy YYYY formátum kezelése
          const timeA = new Date(dateA).getTime();
          const timeB = new Date(dateB).getTime();

          return timeB - timeA; // legújabb elöl
        });

        this.newReleases = sortedItems
          .slice(0, 24)
          .map((item: any) => this.mapItemToBook(item));
      });
  }

  private loadMostPopular() {
    //bestseller vagy rating count szerint kereshetünk
    this.booksService.getBooks("subject:mystery").subscribe((result: any) => {
      const items = result.items || [];

      // Rendezés a kiadási dátum szerint csökkenő sorrendben
      const sortedItems = items.sort((a: any, b: any) => {
        const dateA = a.volumeInfo?.publishedDate || "0000-01-01";
        const dateB = b.volumeInfo?.publishedDate || "0000-01-01";

        // YYYY-MM-DD, YYYY-MM vagy YYYY formátum kezelése
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();

        return timeB - timeA; // legújabb elöl
      });

      this.mostPopular = sortedItems
        .filter(
          (i: any) => i.volumeInfo?.title && i.volumeInfo?.imageLinks?.thumbnail
        )
        .slice(0, 24)
        .map((item: any) => this.mapItemToBook(item));
    });
  }

  private loadBestForYou() {
    // pl. kedvenc műfaj alapján (ha van bejelentkezett user)
    // most csak egy sima keresés példaként:
    this.booksService.getBooks("subject:romance").subscribe((result: any) => {
      const items = result.items || [];
      this.bestForYou = items
        .slice(0, 24)
        .map((item: any) => this.mapItemToBook(item));
    });
  }

  resetView() {
    this.searchOrGenreButtonClicked = false;
    this.exactMatchBook = undefined;
    this.relatedBooks = [];
    this.selectedGenre = "";
  }

  searchClicked(param: string) {
    this.selectedGenre = "";
    if (!param || param.trim() === "") {
      // Ha a kereső üres, állítsuk vissza a korábbi nézetet
      this.resetView();

      return;
    }

    this.booksService.getBooks(param, 0, 24).subscribe((result: any) => {
      const items = result.items || [];

      // Szűrés a képpel és címmel rendelkező könyvekre
      const filtered = items.filter(
        (i: any) => i.volumeInfo?.title && i.volumeInfo?.imageLinks?.thumbnail
      );

      if (filtered.length > 0) {
        // Pontos találat és az első műfaj elmentése
        this.exactMatchBook = this.mapItemToBook(filtered[0]);
        const firstGenre = this.exactMatchBook.categories?.[0];

        // Kapcsolódó könyvek lekérése az első műfaj alapján
        if (firstGenre) {
          this.booksService
            .getBooks(`subject:${firstGenre}`)
            .subscribe((genreResult: any) => {
              const genreItems = genreResult.items || [];
              const filtered2 = genreItems.filter(
                (i: any) =>
                  i.volumeInfo?.title && i.volumeInfo?.imageLinks?.thumbnail
              );

              // relatedBooks-ba elmentjük a pontos találaton kívüli könyveket
              this.relatedBooks = filtered2
                .filter((i: any) => i.id !== this.exactMatchBook?.id)
                .slice(0, 24)
                .map((item: any) => this.mapItemToBook(item));
            });
        } else {
          this.relatedBooks = [];
        }
      } else {
        this.exactMatchBook = undefined;
        this.relatedBooks = [];
      }
      this.searchOrGenreButtonClicked = true;
    });
  }

  genreClicked(genre: string) {
    // Választott műfaj elmentése
    this.selectedGenre = genre;

    // Kapcsolódó könyvek lekérése a műfaj alapján
    this.booksService
      .getBooks(`subject:${genre}`, 0, 24)
      .subscribe((result: any) => {
        const items = result.items || [];
        this.exactMatchBook = undefined; // nincs pontos találat

        //relatedBooks feltöltése
        this.relatedBooks = items
          .slice(0, 24) // max. 24 találat
          .map((item: any) => this.mapItemToBook(item));

        this.searchOrGenreButtonClicked = true;
      });
  }

  private mapItemToBook(item: any): BookModel {
    return {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      ISBN: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      pageCount: item.volumeInfo.pageCount,
      imageLink: item.volumeInfo.imageLinks?.thumbnail,
      language: item.volumeInfo.language,
      categories: item.volumeInfo.categories,
      price: item.saleInfo?.listPrice?.amount,
      currency: item.saleInfo?.listPrice?.currencyCode,
      isEbook: item.saleInfo?.isEbook,
    };
  }
}
