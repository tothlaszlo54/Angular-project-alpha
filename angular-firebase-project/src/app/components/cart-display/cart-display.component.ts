import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";
import { CartItem, CartService } from "../../services/cart.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart-display",
  templateUrl: "./cart-display.component.html",
  styleUrl: "./cart-display.component.scss",
})
export class CartDisplayComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {}

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTotalItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  increaseQuantity(bookId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(bookId, currentQuantity + 1);
  }

  decreaseQuantity(bookId: string, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(bookId, currentQuantity - 1);
    }
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(bookId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToPlaceOrder(): void {
    this.router.navigate(["/placeorder"]);
  }
}
