import { NgStyle } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-stars",
  templateUrl: "./stars.component.html",
  styleUrls: ["./stars.component.scss"],
})
export class StarsComponent {
  @Input() stars: number = 0;
  @Input() size: string = "";
}
