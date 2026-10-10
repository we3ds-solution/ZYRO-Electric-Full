import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchesComponent } from './branches.component';
import { MOCK_BRANCHES } from './mock-branches';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BranchesComponent', () => {
  let component: BranchesComponent;
  let fixture: ComponentFixture<BranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BranchesComponent],
      imports: [CommonModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BranchesComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load all branches from mock data', () => {
      expect(component.branches.length).toBe(MOCK_BRANCHES.length);
    });

    it('should set default preferred branch to b-001 when no saved preference', () => {
      expect(component.preferredBranchId).toBe('b-001');
    });

    it('should restore preferred branch from localStorage on init', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('b-003');
      component.ngOnInit();
      expect(component.preferredBranchId).toBe('b-003');
    });

    it('should apply filters on init and populate filteredBranches', () => {
      expect(component.filteredBranches.length).toBeGreaterThan(0);
    });

    it('should default selectedCity to "All"', () => {
      expect(component.selectedCity).toBe('All');
    });

    it('should default selectedService to "All"', () => {
      expect(component.selectedService).toBe('All');
    });
  });

  describe('applyFilters()', () => {
    it('should return all branches when no filters applied', () => {
      component.searchQuery = '';
      component.selectedCity = 'All';
      component.selectedService = 'All';
      component.applyFilters();
      expect(component.filteredBranches.length).toBe(component.branches.length);
    });

    it('should filter branches by name search', () => {
      const firstBranch = component.branches[0];
      component.searchQuery = firstBranch.name.substring(0, 4);
      component.applyFilters();
      expect(component.filteredBranches.some(b => b.name.toLowerCase().includes(component.searchQuery.toLowerCase()))).toBeTrue();
    });

    it('should filter branches by city search', () => {
      const cityBranch = component.branches[0];
      component.searchQuery = cityBranch.city;
      component.applyFilters();
      expect(component.filteredBranches.every(b => b.city.toLowerCase().includes(cityBranch.city.toLowerCase()))).toBeTrue();
    });

    it('should filter branches by zip code search', () => {
      const branch = component.branches[0];
      component.searchQuery = branch.zipCode;
      component.applyFilters();
      expect(component.filteredBranches.some(b => b.zipCode.includes(branch.zipCode))).toBeTrue();
    });

    it('should filter by selected city', () => {
      const city = component.branches[0].city;
      component.selectedCity = city;
      component.applyFilters();
      expect(component.filteredBranches.every(b => b.city === city)).toBeTrue();
    });

    it('should filter by selected service', () => {
      const service = component.branches[0].services[0];
      component.selectedService = service;
      component.applyFilters();
      expect(component.filteredBranches.every(b => b.services.includes(service))).toBeTrue();
    });

    it('should return empty array when no branches match', () => {
      component.searchQuery = 'XXXXXXXXNONEXISTENT';
      component.applyFilters();
      expect(component.filteredBranches.length).toBe(0);
    });
  });

  describe('onSearchChange()', () => {
    it('should call applyFilters', () => {
      spyOn(component, 'applyFilters');
      component.onSearchChange();
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('selectCity()', () => {
    it('should update selectedCity and apply filters', () => {
      spyOn(component, 'applyFilters');
      component.selectCity('New Cairo');
      expect(component.selectedCity).toBe('New Cairo');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('selectService()', () => {
    it('should update selectedService and apply filters', () => {
      spyOn(component, 'applyFilters');
      component.selectService('Size Exchange');
      expect(component.selectedService).toBe('Size Exchange');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('openBranchDetails()', () => {
    it('should set selectedBranch to given branch', () => {
      const branch = component.branches[0];
      component.openBranchDetails(branch);
      expect(component.selectedBranch).toBe(branch);
    });
  });

  describe('closeBranchDetails()', () => {
    it('should set selectedBranch to null', () => {
      component.selectedBranch = component.branches[0];
      component.closeBranchDetails();
      expect(component.selectedBranch).toBeNull();
    });
  });

  describe('setPreferredBranch()', () => {
    it('should update preferredBranchId', () => {
      component.setPreferredBranch('b-002');
      expect(component.preferredBranchId).toBe('b-002');
    });

    it('should save to localStorage', () => {
      component.setPreferredBranch('b-003');
      expect(localStorage.setItem).toHaveBeenCalledWith('haxel_preferred_branch', 'b-003');
    });

    it('should stop event propagation if event provided', () => {
      const event = jasmine.createSpyObj('Event', ['stopPropagation']);
      component.setPreferredBranch('b-001', event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('getPreferredBranch()', () => {
    it('should return the branch matching preferredBranchId', () => {
      const branch = component.branches[0];
      component.preferredBranchId = branch.id;
      const result = component.getPreferredBranch();
      expect(result).toEqual(branch);
    });

    it('should return undefined if no match', () => {
      component.preferredBranchId = 'NONEXISTENT';
      expect(component.getPreferredBranch()).toBeUndefined();
    });
  });

  describe('Cities and Services lists', () => {
    it('should contain "All" as first city option', () => {
      expect(component.cities[0]).toBe('All');
    });

    it('should contain "All" as first service option', () => {
      expect(component.servicesList[0]).toBe('All');
    });

    it('should have at least 2 city options', () => {
      expect(component.cities.length).toBeGreaterThanOrEqual(2);
    });

    it('should have at least 2 service options', () => {
      expect(component.servicesList.length).toBeGreaterThanOrEqual(2);
    });
  });
});
