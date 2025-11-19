import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyRewievsComponent } from "./my-reviews.component";

describe("MyRewievsComponent", () => {
  let component: MyRewievsComponent;
  let fixture: ComponentFixture<MyRewievsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRewievsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyRewievsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
