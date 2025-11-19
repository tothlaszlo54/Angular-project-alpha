import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserComponent } from "./components/user/user.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ProfileInfoComponent } from "./components/profile-info/profile-info.component";
import { BookshelfComponent } from "./components/bookshelf/bookshelf.component";
import { MyRewievsComponent } from "./components/my-reviews/my-reviews.component";
import { BookDetailsComponent } from "./components/book-details/book-details.component";
import { StoreMainComponent } from "./components/store-main/store-main.component";
import { CartCassaComponent } from "./components/cart-cassa/cart-cassa.component";
import { DiscoverMainComponent } from "./components/discover-main/discover-main.component";
import { HomeComponent } from "./components/home/home.component";
import { authGuard } from "./guard/auth.guard";

const routes: Routes = [
  { path: "registration-login", component: UserComponent },
  { path: "books/:id", component: BookDetailsComponent },
  { path: "store", component: StoreMainComponent },
  { path: "discover", component: DiscoverMainComponent },
  { path: "placeorder", component: CartCassaComponent },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      { path: "profile-info", component: ProfileInfoComponent },
      {
        path: "bookshelf/:shelfName",
        component: BookshelfComponent,
      },
      { path: "reviews", component: MyRewievsComponent },
    ],
  },
  { path: "", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
