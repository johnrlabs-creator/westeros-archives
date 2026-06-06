import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../../services/auth-api';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  loginApiService = inject(AuthApi);
  router = inject(Router);
  toastService = inject(ToastService);

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoading = signal<boolean>(false);
  register = signal<boolean>(false);

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { username, password } = this.loginForm.value;
      this.loginApiService
        .login(username, password)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.toastService.show(err?.error?.message, 'error');
            console.error(err);
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  switchView() {
    this.register.set(!this.register());

    this.loginForm.reset();
    this.registerForm.reset();
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const { username, password } = this.registerForm.value;
      this.loginApiService
        .register(username, password)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.toastService.show('User is added to the scrolls / User has been registered');
            setTimeout(() => {
              this.register.set(false)
            }, 500);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.toastService.show(err?.error?.message, 'error');
            console.error(err);
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.get('password')?.hasError('minlength')) {
        this.toastService.show('Password must be atleast 5 characters to register', 'error');
      }
    }
  }
}
