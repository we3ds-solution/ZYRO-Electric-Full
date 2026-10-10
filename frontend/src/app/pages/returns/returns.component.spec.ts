import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnsComponent } from './returns.component';
import { RETURN_WINDOW, FREE_RETURN_CONDITIONS, RETURN_PROCESS_STEPS } from './data';

describe('ReturnsComponent', () => {
  let component: ReturnsComponent;
  let fixture: ComponentFixture<ReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnsComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have returnWindow set to 30 days from delivery', () => {
    expect(component.returnWindow).toBe(RETURN_WINDOW);
    expect(component.returnWindow).toBe('30 days from delivery');
  });

  it('should load free return conditions from data.ts', () => {
    expect(component.freeReturnConditions).toEqual(FREE_RETURN_CONDITIONS);
    expect(component.freeReturnConditions.length).toBe(4);
  });

  it('should load process steps from data.ts', () => {
    expect(component.processSteps).toEqual(RETURN_PROCESS_STEPS);
    expect(component.processSteps.length).toBe(5);
  });

  it('should have all free return conditions as strings', () => {
    component.freeReturnConditions.forEach(condition => {
      expect(typeof condition).toBe('string');
      expect(condition.length).toBeGreaterThan(0);
    });
  });

  it('should have free return conditions including defective, wrong item, Prime, and 30 days', () => {
    const conditions = component.freeReturnConditions.join(' ');
    expect(conditions).toContain('defective');
    expect(conditions).toContain('wrong');
    expect(conditions).toContain('Prime');
    expect(conditions).toContain('30 days');
  });

  it('should have all process steps with required properties', () => {
    component.processSteps.forEach(step => {
      expect(step.step).toBeDefined();
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
    });
  });

  it('should have 5 return process steps', () => {
    expect(component.processSteps.length).toBe(5);
  });

  it('should have process steps numbered 1-5 in order', () => {
    component.processSteps.forEach((step, index) => {
      expect(step.step).toBe(index + 1);
    });
  });

  it('should have process steps: Initiate, Get Authorization, Ship, Inspection, Refund', () => {
    const titles = component.processSteps.map(s => s.title);
    expect(titles).toContain('Initiate Return');
    expect(titles).toContain('Get Authorization');
    expect(titles).toContain('Ship Item');
    expect(titles).toContain('Inspection');
    expect(titles).toContain('Refund');
  });

  it('should have Initiate Return as first step', () => {
    expect(component.processSteps[0].title).toBe('Initiate Return');
  });

  it('should have Refund as last step', () => {
    expect(component.processSteps[component.processSteps.length - 1].title).toBe('Refund');
  });

  it('should have all process steps with descriptions', () => {
    component.processSteps.forEach(step => {
      expect(step.description.length).toBeGreaterThan(0);
    });
  });
});
