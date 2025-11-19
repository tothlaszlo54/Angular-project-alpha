import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-genre-selector",
  templateUrl: "./genre-selector.component.html",
  styleUrls: ["./genre-selector.component.scss"],
})
export class GenreSelectorComponent {
  @Output() genreSelected = new EventEmitter<string>();

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  genres = [
    { name: "Fiction", icon: "📚" },
    { name: "Mystery ", icon: "🕵️‍♂️" }, //& Thriller
    { name: "Fantasy ", icon: "🧙‍♂️" }, //& Science Fiction
    { name: "Romance", icon: "❤️" },
    { name: "Historical", icon: "🏰" },
    { name: "Biography ", icon: "👤" }, //& Memoir
    { name: "Religion ", icon: "🛐" }, //& Spirituality
    { name: "Self-Help", icon: "🌱" },
    { name: "Science ", icon: "🔬" }, //& Math
    { name: "Business", icon: "💼" }, // & Economics
    { name: "Cooking", icon: "🍳" },
    { name: "Health", icon: "🧘‍♂️" }, //, Mind & Body
  ];

  selectGenre(genre: string) {
    this.genreSelected.emit(genre);
  }
}
