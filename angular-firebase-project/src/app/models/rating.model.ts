import { BookModel } from "./book.model";

export interface RatingModel {
  id?: string;
  bookId: string;
  remarkInText: string;
  stars: number;
  userId: string;
}

export interface RatingWithBooks extends RatingModel {
  book: BookModel;
}
