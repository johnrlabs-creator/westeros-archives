import { Injectable, signal } from '@angular/core';
export interface ToastData {
  message: string;
  type: 'success' | 'info' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toast = signal<ToastData | null>(null);
  toast = this._toast.asReadonly();

  show(message: string, type: ToastData['type'] = 'success') {
    this._toast.set({ message, type });

    setTimeout(() => this._toast.set(null), 4000);
  }

  dismiss() {
  this._toast.set(null);
}
}
