import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginPage } from './login-page';
import { AuthApi } from '../../services/auth-api';
import { ToastService } from '../../services/toast-service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([{ path: '**', component: LoginPage }]),
        {
          provide: AuthApi,
          useValue: {
            login: vi.fn().mockReturnValue(of({})),
            register: vi.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize loginForm and registerForm', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.registerForm).toBeDefined();
    });
  });

  describe('initForm', () => {
    it('should require username and password on loginForm', () => {
      component.loginForm.setValue({ username: '', password: '' });
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should require password minlength of 5 on registerForm', () => {
      component.registerForm.setValue({ username: 'user', password: '123' });
      expect(component.registerForm.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be valid when all fields are filled correctly', () => {
      component.loginForm.setValue({ username: 'user', password: 'password123' });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('onLogin', () => {
    it('should call login api when form is valid', () => {
      const loginSpy = vi.spyOn(component.loginApiService, 'login').mockReturnValue(of({}));
      component.loginForm.setValue({ username: 'user', password: 'password123' });
      component.onLogin();
      expect(loginSpy).toHaveBeenCalledWith('user', 'password123');
    });

    it('should navigate to /home on success', async () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(component.loginApiService, 'login').mockReturnValue(of({}));
      component.loginForm.setValue({ username: 'user', password: 'password123' });
      component.onLogin();
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });

    it('should mark form as touched when invalid', () => {
      const markSpy = vi.spyOn(component.loginForm, 'markAllAsTouched');
      component.onLogin();
      expect(markSpy).toHaveBeenCalled();
    });
  });

  describe('switchView', () => {
    it('should toggle register signal', () => {
      component.switchView();
      expect(component.register()).toBe(true);
    });

    it('should reset both forms', () => {
      const loginResetSpy = vi.spyOn(component.loginForm, 'reset');
      const registerResetSpy = vi.spyOn(component.registerForm, 'reset');
      component.switchView();
      expect(loginResetSpy).toHaveBeenCalled();
      expect(registerResetSpy).toHaveBeenCalled();
    });

    it('should toggle back to false on second call', () => {
      component.switchView();
      component.switchView();
      expect(component.register()).toBe(false);
    });
  });

  describe('onRegister', () => {
    it('should call register api when form is valid', () => {
      const registerSpy = vi.spyOn(component.loginApiService, 'register').mockReturnValue(of({}));
      component.registerForm.setValue({ username: 'user', password: 'password123' });
      component.onRegister();
      expect(registerSpy).toHaveBeenCalledWith('user', 'password123');
    });

    it('should show error toast when password is too short', () => {
      const toastSpy = vi.spyOn(component['toastService'], 'show');
      component.registerForm.setValue({ username: 'user', password: '123' });
      component.onRegister();
      expect(toastSpy).toHaveBeenCalledWith('Password must be atleast 5 characters to register', 'error');
    });

    it('should show error toast on api error', () => {
      const toastSpy = vi.spyOn(component['toastService'], 'show');
      vi.spyOn(component.loginApiService, 'register').mockReturnValue(
        throwError(() => ({ error: { message: 'Username taken' } })),
      );
      component.registerForm.setValue({ username: 'user', password: 'password123' });
      component.onRegister();
      expect(toastSpy).toHaveBeenCalledWith('Username taken', 'error');
    });
  });
});