import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMainComponent } from './store-main.component';

describe('StoreMainComponent', () => {
  let component: StoreMainComponent;
  let fixture: ComponentFixture<StoreMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
