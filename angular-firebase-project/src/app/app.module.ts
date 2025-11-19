import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { UserComponent } from "./components/user/user.component";
import { UserRegComponent } from "./components/user/user-reg/user-reg.component";
import { ToastrModule } from "ngx-toastr";
import { UserLoginComponent } from "./components/user/user-login/user-login.component";
import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { BookshelfComponent } from "./components/bookshelf/bookshelf.component";
import { ProfileInfoComponent } from "./components/profile-info/profile-info.component";
import { MyRewievsComponent } from "./components/my-reviews/my-reviews.component";
import { FooterComponent } from "./components/footer/footer.component";
import { StoreMainComponent } from "./components/store-main/store-main.component";
import { CartCassaComponent } from "./components/cart-cassa/cart-cassa.component";
import { BookCardComponent } from "./components/book-card/book-card.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { GenreSelectorComponent } from "./components/genre-selector/genre-selector.component";
import { HeroComponent } from "./components/hero/hero.component";
import { DiscoverMainComponent } from "./components/discover-main/discover-main.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { provideHttpClient } from "@angular/common/http";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { StarsComponent } from "./components/stars/stars.component";
import { BookDetailsComponent } from "./components/book-details/book-details.component";
import { ToastComponent } from "./components/toast/toast.component";
import { CartDisplayComponent } from "./components/cart-display/cart-display.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    BookDetailsComponent,
    StarsComponent,
    ProfileComponent,
    BookshelfComponent,
    ProfileInfoComponent,
    MyRewievsComponent,
    FooterComponent,
    StoreMainComponent,
    CartCassaComponent,
    CartDisplayComponent,
    BookCardComponent,
    CarouselComponent,
    GenreSelectorComponent,
    HeroComponent,
    DiscoverMainComponent,
    SearchBarComponent,
    StarsComponent,
    BookDetailsComponent,
    NavbarComponent,
    HomeComponent,
    UserComponent,
    UserRegComponent,
    UserLoginComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    ToastrModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
  ],

  providers: [
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        // The web app's Firebase configuration
      })
    ),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
