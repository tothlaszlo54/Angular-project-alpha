export interface BookModel {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  ISBN?: string;
  pageCount: number;
  imageLink: string;
  language: string;
  categories?: string[]; // hozzáadva TL
  price?: number;
  currency?: string;
  isEbook: boolean;
  currentPage?: number;
  // isEbook: boolean
}
