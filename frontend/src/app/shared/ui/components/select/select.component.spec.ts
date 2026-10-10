import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default Inputs', () => {
    it('should default title to empty string', () => {
      expect(component.title).toBe('');
    });

    it('should default data array to empty', () => {
      expect(component.data).toEqual([]);
    });
  });

  describe('detectChanges()', () => {
    it('should emit selectedValue when detectChanges is called', () => {
      let emitted: unknown = null;
      component.selectedValue.subscribe((val: unknown) => emitted = val);
      const mockEvent = { target: { value: 'electronics' } };
      component.detectChanges(mockEvent);
      expect(emitted).toEqual(mockEvent);
    });
  });
});
