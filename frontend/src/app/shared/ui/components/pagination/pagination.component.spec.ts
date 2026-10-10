import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { CommonModule } from '@angular/common';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default Inputs', () => {
    it('should default currentPage to 1', () => {
      expect(component.currentPage).toBe(1);
    });

    it('should default totalPages to 1', () => {
      expect(component.totalPages).toBe(1);
    });

    it('should default pagesVisible to 5', () => {
      expect(component.pagesVisible).toBe(5);
    });
  });

  describe('Page calculation', () => {
    it('should calculate pages array for small total', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      component.ngOnChanges({ currentPage: {} as any, totalPages: {} as any });
      expect(component.pages).toEqual([1, 2, 3]);
    });

    it('should calculate pages around current page for large total', () => {
      component.currentPage = 5;
      component.totalPages = 20;
      component.pagesVisible = 5;
      component.ngOnChanges({ currentPage: {} as any, totalPages: {} as any });
      expect(component.pages.length).toBe(5);
      expect(component.pages).toContain(5);
    });

    it('should not exceed totalPages in pages array', () => {
      component.currentPage = 19;
      component.totalPages = 20;
      component.pagesVisible = 5;
      component.ngOnChanges({ currentPage: {} as any, totalPages: {} as any });
      expect(Math.max(...component.pages)).toBeLessThanOrEqual(20);
    });
  });

  describe('onPrevious()', () => {
    it('should emit page - 1 when not on first page', () => {
      component.currentPage = 3;
      component.totalPages = 10;
      let emitted = 0;
      component.pageChange.subscribe((p: number) => emitted = p);
      component.onPrevious();
      expect(emitted).toBe(2);
    });

    it('should NOT emit when already on first page', () => {
      component.currentPage = 1;
      let emitted = false;
      component.pageChange.subscribe(() => emitted = true);
      component.onPrevious();
      expect(emitted).toBeFalse();
    });
  });

  describe('onNext()', () => {
    it('should emit page + 1 when not on last page', () => {
      component.currentPage = 3;
      component.totalPages = 10;
      let emitted = 0;
      component.pageChange.subscribe((p: number) => emitted = p);
      component.onNext();
      expect(emitted).toBe(4);
    });

    it('should NOT emit when already on last page', () => {
      component.currentPage = 10;
      component.totalPages = 10;
      let emitted = false;
      component.pageChange.subscribe(() => emitted = true);
      component.onNext();
      expect(emitted).toBeFalse();
    });
  });

  describe('onPageChange()', () => {
    it('should emit page number when different from current', () => {
      component.currentPage = 2;
      component.totalPages = 10;
      let emitted = 0;
      component.pageChange.subscribe((p: number) => emitted = p);
      component.onPageChange(5);
      expect(emitted).toBe(5);
    });

    it('should NOT emit when clicking current page', () => {
      component.currentPage = 3;
      component.totalPages = 10;
      let emitted = false;
      component.pageChange.subscribe(() => emitted = true);
      component.onPageChange(3);
      expect(emitted).toBeFalse();
    });

    it('should NOT emit for out-of-range page', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      let emitted = false;
      component.pageChange.subscribe(() => emitted = true);
      component.onPageChange(0);
      expect(emitted).toBeFalse();
    });
  });
});
