import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.scss",
})
export class SearchBarComponent {
  searchTerm: string = "";

  @Output() clickEvent = new EventEmitter<string>();

  search() {
    this.clickEvent.emit(this.searchTerm);
  }
  onSearchTermChange(term: string) {
    if (term.trim() === "") {
      // Ha a mező üres, küldjünk jelzést a szülőnek
      this.clickEvent.emit("");
    }
  }
}
