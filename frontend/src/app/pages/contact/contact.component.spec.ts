import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { CONTACT_METHODS } from './data';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contact methods from data.ts', () => {
    expect(component.contactMethods).toEqual(CONTACT_METHODS);
    expect(component.contactMethods.length).toBe(4);
  });

  it('should have submitted initially false', () => {
    expect(component.submitted).toBeFalsy();
  });

  it('should initialize contact form with all fields', () => {
    expect(component.contactForm.get('name')).toBeDefined();
    expect(component.contactForm.get('email')).toBeDefined();
    expect(component.contactForm.get('subject')).toBeDefined();
    expect(component.contactForm.get('message')).toBeDefined();
    expect(component.contactForm.get('category')).toBeDefined();
  });

  it('should have contact methods with required properties', () => {
    component.contactMethods.forEach(method => {
      expect(method.title).toBeDefined();
      expect(method.icon).toBeDefined();
      expect(method.primary).toBeDefined();
      expect(method.secondary).toBeDefined();
    });
  });

  it('should have contact methods: Email, Phone, Live Chat, Social Media', () => {
    const titles = component.contactMethods.map(m => m.title);
    expect(titles).toContain('Email');
    expect(titles).toContain('Phone');
    expect(titles).toContain('Live Chat');
    expect(titles).toContain('Social Media');
  });

  it('should validate form - name required', () => {
    const nameControl = component.contactForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();
  });

  it('should validate form - email required and valid format', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should validate form - subject required and min length 5', () => {
    const subjectControl = component.contactForm.get('subject');
    subjectControl?.setValue('test');
    expect(subjectControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate form - message required and min length 10', () => {
    const messageControl = component.contactForm.get('message');
    messageControl?.setValue('short');
    expect(messageControl?.hasError('minlength')).toBeTruthy();
  });

  it('should set submitted true on submit attempt', () => {
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
  });

  it('should reject invalid form on submit', () => {
    component.contactForm.reset();
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should accept valid form on submit', () => {
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message for the contact form',
      category: 'general'
    });
    expect(component.contactForm.valid).toBeTruthy();
  });
});
