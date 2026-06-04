import { Component, inject, input, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  dismiss() {
    this.toastService.show('', 'info'); // or expose a dismiss() on the service
  }
}
