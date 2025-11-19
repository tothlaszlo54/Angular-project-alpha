import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastSubject.asObservable();
  private idCounter = 0;

  showSuccess(message: string, duration: number = 4000) {
    this.addToast({
      id: this.idCounter++,
      message,
      type: "success",
      duration,
    });
  }

  showError(message: string, duration: number = 5000) {
    this.addToast({
      id: this.idCounter++,
      message,
      type: "error",
      duration,
    });
  }

  showWarning(message: string, duration: number = 4000) {
    this.addToast({
      id: this.idCounter++,
      message,
      type: "warning",
      duration,
    });
  }

  showInfo(message: string, duration: number = 4000) {
    this.addToast({
      id: this.idCounter++,
      message,
      type: "info",
      duration,
    });
  }

  private addToast(toast: ToastMessage) {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, toast]);

    // Autoclose
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: number) {
    const currentToasts = this.toastSubject.value;
    const filteredToasts = currentToasts.filter((toast) => toast.id !== id);
    this.toastSubject.next(filteredToasts);
  }
}
