import { AvatarEnum } from "./user.model";

export interface BookRatingModel {
  avatar: AvatarEnum;
  userName: string;
  stars: number;
  remarkInText: string;
}
