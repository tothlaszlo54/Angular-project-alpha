import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CartItem, CartService } from "../../services/cart.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart-cassa",
  templateUrl: "./cart-cassa.component.html",
  styleUrl: "./cart-cassa.component.scss",
})
export class CartCassaComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  orderData = {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardOwner: "",
    email: "",
  };

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

  onSubmit(form: any) {
    if (form.valid) {
      const currentCartItems = this.cartService.getCurrentCartItems();

      if (currentCartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      console.log("Order submitted:", this.orderData);
      console.log("Cart items:", currentCartItems);
      alert("Order placed successfully!");

      // Clear the cart after successful order
      this.cartService.clearCart();

      // Navigate back to store or home
      this.router.navigate(["/store"]);

      form.reset();
    }
  }
}
