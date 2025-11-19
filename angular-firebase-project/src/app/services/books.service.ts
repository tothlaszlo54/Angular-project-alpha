import { BookModel } from "./../models/book.model";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BooksService {
  constructor(private http: HttpClient) {}

  private readonly BOOK_URL: string =
    "https://www.googleapis.com/books/v1/volumes";

  private readonly key: string = "AIzaSyCbXtty5kSQjaz1dBt_OLo7O8IJBxTO9bI";

  mapBook(book: Observable<any>): Observable<BookModel> {
    return book.pipe(
      map((value) => {
        return {
          id: value.id,
          title: value.volumeInfo.title,
          authors: value.volumeInfo.authors,
          publisher: value.volumeInfo.publisher,
          publishedDate: value.volumeInfo.publishedDate,
          description: value.volumeInfo.description,
          ISBN: value.volumeInfo.industryIdentifiers
            ? value.volumeInfo.industryIdentifiers[1].identifier
            : undefined,
          pageCount: value.volumeInfo.pageCount,
          imageLink: value.volumeInfo.imageLinks.thumbnail,
          language: value.volumeInfo.language,
          categories: value.volumeInfo.categories,
          price: value.saleInfo?.listPrice?.amount,
          currency: value.saleInfo?.listPrice?.currencyCode,
          isEbook: value.saleInfo?.isEbook,
        };
      })
    );
  }

  //GET

  //   A maxResults (max érték: 40) határozza meg, hogy mennyi könyvet kapj egyszerre.
  // A startIndex segít a lapozásnál (pl. 0–23, 24–47, stb.).
  getBooks(
    param: string,
    startIndex: number = 0,
    maxResults: number = 24
  ): Observable<BookModel[]> {
    return this.http.get<any>(this.BOOK_URL, {
      params: {
        key: this.key,
        q: param,
        startIndex: startIndex,
        maxResults: maxResults,
      },
    });
  }

  getBook(id: string): Observable<BookModel> {
    return this.mapBook(
      this.http.get(`${this.BOOK_URL}/${id}`, {
        params: { key: this.key },
      })
    );
  }

  getEbooks(): Observable<BookModel[]> {
    return this.http
      .get<any>(this.BOOK_URL, {
        params: { key: this.key, q: "ebooks", maxResults: 40 },
      })
      .pipe(
        map((response) => {
          const items = response.items || [];
          // Véletlenszerűen kiválasztunk 25 könyvet
          const rndSelectedBooks = items.sort(() => 0.5 - Math.random());
          const pricedBooks = rndSelectedBooks.filter(
            (item: any) =>
              item.saleInfo.listPrice && item.saleInfo.listPrice.amount !== 0
          );
          const selected = pricedBooks.slice(0, 25);
          // Átalakítjuk BookModel-re és isEbook: true hozzáadva
          return selected.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            ISBN: item.volumeInfo.industryIdentifiers?.[1]?.identifier,
            pageCount: item.volumeInfo.pageCount,
            imageLink: item.volumeInfo.imageLinks.thumbnail,
            language: item.volumeInfo.language,
            price: item.saleInfo?.listPrice?.amount,
            currency: item.saleInfo?.listPrice?.currencyCode,
            isEbook: true,
          }));
        })
      );
  }
}
