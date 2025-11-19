import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BookModel } from "../models/book.model";
import { ToastService } from "./toast.service";

export interface CartItem {
  book: BookModel;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  constructor(private toastService: ToastService) {
    this.loadCartFromStorage();
  }

  // Cart content check
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Book add to Cart
  addToCart(book: BookModel): void {
    const existingItem = this.cartItems.find(
      (item) => item.book.id === book.id
    );

    if (existingItem) {
      existingItem.quantity++;
      this.toastService.showSuccess(
        `"${book.title}" quantity increased in cart!`
      );
    } else {
      this.cartItems.push({ book, quantity: 1 });
      this.toastService.showSuccess(`"${book.title}" added to cart!`);
    }

    this.updateCart();
  }

  // Book remove from Cart
  removeFromCart(bookId: string): void {
    const itemToRemove = this.cartItems.find((item) => item.book.id === bookId);
    this.cartItems = this.cartItems.filter((item) => item.book.id !== bookId);

    if (itemToRemove) {
      this.toastService.showInfo(
        `"${itemToRemove.book.title}" removed from cart.`
      );
    }

    this.updateCart();
  }

  // Quantity update
  updateQuantity(bookId: string, quantity: number): void {
    const item = this.cartItems.find((item) => item.book.id === bookId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeFromCart(bookId);
      } else {
        this.updateCart();
      }
    }
  }

  // Cart make empty
  clearCart(): void {
    if (this.cartItems.length > 0) {
      this.cartItems = [];
      this.toastService.showWarning("Cart cleared!");
      this.updateCart();
    }
  }

  // Cart item count
  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Total price calculation
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.book.price || 0) * item.quantity,
      0
    );
  }

  // Cart update and save
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  // Cart save to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }

  // Get current cart items synchronously (for order processing)
  getCurrentCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Cart load from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }
}
