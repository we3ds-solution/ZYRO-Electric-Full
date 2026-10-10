import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CareersComponent } from './careers.component';
import { CAREER_JOBS, CAREER_BENEFITS } from './data';

describe('CareersComponent', () => {
  let component: CareersComponent;
  let fixture: ComponentFixture<CareersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareersComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(CareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load jobs from data.ts', () => {
    expect(component.jobs).toEqual(CAREER_JOBS);
    expect(component.jobs.length).toBe(6);
  });

  it('should load benefits from data.ts', () => {
    expect(component.benefits).toEqual(CAREER_BENEFITS);
    expect(component.benefits.length).toBe(6);
  });

  it('should have selectedJob initially null', () => {
    expect(component.selectedJob).toBeNull();
  });

  it('should have all jobs with required properties', () => {
    component.jobs.forEach(job => {
      expect(job.id).toBeDefined();
      expect(job.title).toBeDefined();
      expect(job.department).toBeDefined();
      expect(job.location).toBeDefined();
      expect(job.level).toBeDefined();
      expect(job.salary).toBeDefined();
      expect(job.type).toBeDefined();
    });
  });

  it('should have all benefits with required properties', () => {
    component.benefits.forEach(benefit => {
      expect(benefit.icon).toBeDefined();
      expect(benefit.title).toBeDefined();
      expect(benefit.description).toBeDefined();
    });
  });

  it('should have at least one senior position', () => {
    const seniorJobs = component.jobs.filter(j => j.level === 'Senior');
    expect(seniorJobs.length).toBeGreaterThan(0);
  });

  it('should have at least one remote position', () => {
    const remoteJobs = component.jobs.filter(j => j.location.includes('Remote'));
    expect(remoteJobs.length).toBeGreaterThan(0);
  });

  it('should have job departments: Engineering, Product, Design, Operations', () => {
    const departments = new Set(component.jobs.map(j => j.department));
    expect(departments.has('Engineering')).toBeTruthy();
    expect(departments.has('Product')).toBeTruthy();
    expect(departments.has('Design')).toBeTruthy();
    expect(departments.has('Operations')).toBeTruthy();
  });

  it('should have benefit titles including Salary, Health Insurance, Learning', () => {
    const titles = component.benefits.map(b => b.title);
    expect(titles).toContain('Competitive Salary');
    expect(titles).toContain('Health Insurance');
    expect(titles).toContain('Learning & Development');
  });

  it('should have unique job IDs', () => {
    const ids = component.jobs.map(j => j.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
