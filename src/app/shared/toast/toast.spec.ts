import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('dismiss', () => {
    it('should call toastService.show with empty message and info type', () => {
      const toastSpy = vi.spyOn(component.toastService, 'show');
      component.dismiss();
      expect(toastSpy).toHaveBeenCalledWith('', 'info');
    });

    it('should call toastService.show once', () => {
      const toastSpy = vi.spyOn(component.toastService, 'show');
      component.dismiss();
      expect(toastSpy).toHaveBeenCalledTimes(1);
    });
  });
});