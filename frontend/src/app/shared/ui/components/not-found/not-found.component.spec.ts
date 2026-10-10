import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiNotFoundComponent } from './not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('UiNotFoundComponent', () => {
  let component: UiNotFoundComponent;
  let fixture: ComponentFixture<UiNotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiNotFoundComponent],
      imports: [RouterTestingModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiNotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should have a default message', () => {
      expect(component.message).toContain('page you are looking for');
    });

    it('should have errorCode set to 404_NOT_FOUND', () => {
      expect(component.errorCode).toBe('404_NOT_FOUND');
    });

    it('should have a timestamp set', () => {
      expect(component.timestamp).toBeTruthy();
    });
  });

  describe('goHome()', () => {
    it('should navigate to "/"', () => {
      spyOn(router, 'navigate');
      component.goHome();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('goProducts()', () => {
    it('should navigate to "/products"', () => {
      spyOn(router, 'navigate');
      component.goProducts();
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });
});
