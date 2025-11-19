import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCassaComponent } from './cart-cassa.component';

describe('CartCassaComponent', () => {
  let component: CartCassaComponent;
  let fixture: ComponentFixture<CartCassaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartCassaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCassaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
