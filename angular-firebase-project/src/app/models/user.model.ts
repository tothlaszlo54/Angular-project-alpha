export interface UserModel {
  id?: string;
  UId?: string;
  email: string;
  userName: string;
  password?: string;
  favouriteGenres: string[];
  readBooks: string[];
  wishlist: string[];
  currentlyReading: { bookId: string; currentPage: number }[];
  avatar: AvatarEnum;
}

export enum AvatarEnum {
  black_boy = "black_boy",
  black_girl = "black_girl",
  blonde_boy = "blonde_boy",
  blonde_girl = "blonde_girl",
  brown_boy = "brown_boy",
  brown_girl = "brown_girl",
  regular_user = "regular_user",
}
