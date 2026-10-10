import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';
import { AUTH_SERVICE_TOKEN, ORDER_SERVICE_TOKEN } from '../../shared/interfaces/dependency-injection';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockAuthService = {
    getUserProfile: () => of(null)
  };

  const mockOrderService = {
    getOrders: () => of({ items: [], total: 0, page: 1, limit: 50 })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: AUTH_SERVICE_TOKEN, useValue: mockAuthService },
        { provide: ORDER_SERVICE_TOKEN, useValue: mockOrderService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
