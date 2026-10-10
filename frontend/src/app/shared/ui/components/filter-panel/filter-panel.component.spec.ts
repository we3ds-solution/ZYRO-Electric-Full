import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPanelComponent, FilterGroup } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  const mockFilterGroups: FilterGroup[] = [
    {
      id: 'category',
      name: 'Category',
      type: 'checkbox',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' }
      ]
    },
    {
      id: 'price',
      name: 'Price Range',
      type: 'price-range',
      minValue: 0,
      maxValue: 1000,
      currentMin: 10,
      currentMax: 500
    },
    {
      id: 'rating',
      name: 'Rating',
      type: 'rating'
    },
    {
      id: 'brand',
      name: 'Brand',
      type: 'select',
      options: [
        { label: 'Brand A', value: 'brandA' },
        { label: 'Brand B', value: 'brandB' }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPanelComponent ],
      imports: [ FormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component.filterGroups = JSON.parse(JSON.stringify(mockFilterGroups)); // deep copy
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize checkedValues for checkbox and rating types', () => {
      component.ngOnInit();
      expect(component.checkedValues.has('category')).toBeTrue();
      expect(component.checkedValues.has('rating')).toBeTrue();
      expect(component.checkedValues.has('price')).toBeFalse();
      expect(component.checkedValues.has('brand')).toBeFalse();
    });
  });

  describe('Select Dropdown Methods', () => {
    it('should toggle select dropdown', () => {
      expect(component.isSelectOpen('brand')).toBeFalse();
      
      component.toggleSelectDropdown('brand');
      expect(component.isSelectOpen('brand')).toBeTrue();
      
      component.toggleSelectDropdown('brand');
      expect(component.isSelectOpen('brand')).toBeFalse();
    });

    it('should close select dropdown', () => {
      component.toggleSelectDropdown('brand');
      expect(component.isSelectOpen('brand')).toBeTrue();
      
      component.closeSelectDropdown('brand');
      expect(component.isSelectOpen('brand')).toBeFalse();
    });

    it('should select group option, emit event, and close dropdown', () => {
      spyOn(component.filterChange, 'emit');
      const group = component.filterGroups.find(g => g.id === 'brand')!;
      
      component.openDropdowns.add('brand');
      component.selectGroupOption(group, 'brandA');
      
      expect(group.currentValue).toBe('brandA');
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'brand', value: 'brandA' });
      expect(component.isSelectOpen('brand')).toBeFalse();
    });

    it('should get correct select label', () => {
      const group = component.filterGroups.find(g => g.id === 'brand')!;
      
      // when no currentValue
      expect(component.getSelectSelectedLabel(group)).toBe('All Brand');
      
      // when valid currentValue
      group.currentValue = 'brandA';
      expect(component.getSelectSelectedLabel(group)).toBe('Brand A');
      
      // when invalid currentValue
      group.currentValue = 'invalid';
      expect(component.getSelectSelectedLabel(group)).toBe('All Brand');
    });
  });

  describe('Filter Change Methods', () => {
    it('should emit filter change', () => {
      spyOn(component.filterChange, 'emit');
      component.onFilterChange('testId', 'testValue');
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'testId', value: 'testValue' });
    });

    it('should handle checkbox change', () => {
      spyOn(component.filterChange, 'emit');
      
      // Check
      const eventCheck = { target: { checked: true } } as unknown as Event;
      component.onCheckboxChange('category', 'electronics', eventCheck);
      
      expect(component.isChecked('category', 'electronics')).toBeTrue();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'category', value: ['electronics'] });
      
      // Check another
      component.onCheckboxChange('category', 'clothing', eventCheck);
      expect(component.isChecked('category', 'clothing')).toBeTrue();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'category', value: ['electronics', 'clothing'] });
      
      // Uncheck
      const eventUncheck = { target: { checked: false } } as unknown as Event;
      component.onCheckboxChange('category', 'electronics', eventUncheck);
      expect(component.isChecked('category', 'electronics')).toBeFalse();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'category', value: ['clothing'] });
    });

    it('should initialize checked values map if missing in onCheckboxChange', () => {
      spyOn(component.filterChange, 'emit');
      component.checkedValues.clear(); // Simulate missing map
      
      const eventCheck = { target: { checked: true } } as unknown as Event;
      component.onCheckboxChange('category', 'electronics', eventCheck);
      
      expect(component.isChecked('category', 'electronics')).toBeTrue();
    });

    it('should handle rating change', () => {
      spyOn(component.filterChange, 'emit');
      
      // Check
      const eventCheck = { target: { checked: true } } as unknown as Event;
      component.onRatingChange('rating', 4, eventCheck);
      
      expect(component.isChecked('rating', 4)).toBeTrue();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'rating', value: 4 });
      
      // Check another (should clear previous)
      component.onRatingChange('rating', 5, eventCheck);
      expect(component.isChecked('rating', 4)).toBeFalse();
      expect(component.isChecked('rating', 5)).toBeTrue();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'rating', value: 5 });
      
      // Uncheck
      const eventUncheck = { target: { checked: false } } as unknown as Event;
      component.onRatingChange('rating', 5, eventUncheck);
      expect(component.isChecked('rating', 5)).toBeFalse();
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'rating', value: 0 });
    });

    it('should initialize checked values map if missing in onRatingChange', () => {
      spyOn(component.filterChange, 'emit');
      component.checkedValues.clear(); // Simulate missing map
      
      const eventCheck = { target: { checked: true } } as unknown as Event;
      component.onRatingChange('rating', 4, eventCheck);
      
      expect(component.isChecked('rating', 4)).toBeTrue();
    });

    it('should handle price range change', () => {
      spyOn(component.filterChange, 'emit');
      component.onPriceRangeChange('price');
      expect(component.filterChange.emit).toHaveBeenCalledWith({ filterId: 'price', value: { min: 10, max: 500 } });
    });

    it('should not emit if price group is not found', () => {
      spyOn(component.filterChange, 'emit');
      component.onPriceRangeChange('non-existent');
      expect(component.filterChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('isChecked', () => {
    it('should return false if filter group is not in checkedValues', () => {
      component.checkedValues.clear();
      expect(component.isChecked('category', 'electronics')).toBeFalse();
    });
  });

  describe('onReset', () => {
    it('should reset all filters and emit event', () => {
      spyOn(component.panelReset, 'emit');
      
      // Setup some state
      component.checkedValues.get('category')?.add('electronics');
      component.openDropdowns.add('brand');
      const brandGroup = component.filterGroups.find(g => g.id === 'brand')!;
      brandGroup.currentValue = 'brandA';
      
      const priceGroup = component.filterGroups.find(g => g.id === 'price')!;
      priceGroup.currentMin = 50;
      priceGroup.currentMax = 200;

      component.onReset();
      
      // Check state is reset
      expect(component.checkedValues.size).toBe(0);
      expect(component.openDropdowns.size).toBe(0);
      
      expect(brandGroup.currentValue).toBe('');
      expect(priceGroup.currentMin).toBe(0); // from minValue
      expect(priceGroup.currentMax).toBe(1000); // from maxValue
      
      expect(component.panelReset.emit).toHaveBeenCalled();
    });
  });
});
