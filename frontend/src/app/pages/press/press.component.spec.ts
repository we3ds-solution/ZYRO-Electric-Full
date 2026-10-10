import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressComponent } from './press.component';
import { PRESS_RELEASES, MEDIA_CONTACTS } from './data';

describe('PressComponent', () => {
  let component: PressComponent;
  let fixture: ComponentFixture<PressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PressComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(PressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load press releases from data.ts', () => {
    expect(component.pressReleases).toEqual(PRESS_RELEASES);
    expect(component.pressReleases.length).toBe(4);
  });

  it('should load media contacts from data.ts', () => {
    expect(component.mediaContacts).toEqual(MEDIA_CONTACTS);
    expect(component.mediaContacts.length).toBe(1);
  });

  it('should have all press releases with required properties', () => {
    component.pressReleases.forEach(release => {
      expect(release.title).toBeDefined();
      expect(release.date).toBeDefined();
      expect(release.summary).toBeDefined();
      expect(release.category).toBeDefined();
    });
  });

  it('should have all media contacts with required properties', () => {
    component.mediaContacts.forEach(contact => {
      expect(contact.name).toBeDefined();
      expect(contact.title).toBeDefined();
      expect(contact.email).toBeDefined();
      expect(contact.phone).toBeDefined();
    });
  });

  it('should have 4 press releases', () => {
    expect(component.pressReleases.length).toBe(4);
  });

  it('should have press release categories: Drop, Footwear, Collection, Milestone', () => {
    const categories = component.pressReleases.map(r => r.category);
    expect(categories).toContain('Drop');
    expect(categories).toContain('Footwear');
    expect(categories).toContain('Collection');
    expect(categories).toContain('Milestone');
  });

  it('should have Drop release in August 2026', () => {
    const dropRelease = component.pressReleases.find(r => r.category === 'Drop');
    expect(dropRelease).toBeDefined();
    if (dropRelease) {
      expect(dropRelease.date).toContain('August');
      expect(dropRelease.date).toContain('2026');
    }
  });

  it('should have Footwear release in July 2026', () => {
    const footwearRelease = component.pressReleases.find(r => r.category === 'Footwear');
    expect(footwearRelease).toBeDefined();
    if (footwearRelease) {
      expect(footwearRelease.date).toContain('July');
      expect(footwearRelease.date).toContain('2026');
    }
  });

  it('should have Collection release mentioning lifting', () => {
    const collectionRelease = component.pressReleases.find(r => r.category === 'Collection');
    expect(collectionRelease).toBeDefined();
    if (collectionRelease) {
      expect(collectionRelease.summary.toLowerCase()).toContain('lift');
    }
  });

  it('should have Milestone release mentioning bestsellers', () => {
    const milestoneRelease = component.pressReleases.find(r => r.category === 'Milestone');
    expect(milestoneRelease).toBeDefined();
    if (milestoneRelease) {
      expect(milestoneRelease.summary.toLowerCase()).toContain('bestseller');
    }
  });

  it('should have media contact Haxel Support with Customer Care title', () => {
    const supportContact = component.mediaContacts.find(c => c.name === 'Haxel Support');
    expect(supportContact).toBeDefined();
    if (supportContact) {
      expect(supportContact.title).toContain('Customer Care');
    }
  });

  it('should have media contact with email address', () => {
    component.mediaContacts.forEach(contact => {
      expect(contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('should have media contact with phone number', () => {
    component.mediaContacts.forEach(contact => {
      // Phone should have digits (allowing +, -, space, parens for formatting)
      expect(contact.phone).toMatch(/^[\d+\-\s\w()]+$/);
    });
  });

  it('should have all press releases with meaningful summaries', () => {
    component.pressReleases.forEach(release => {
      expect(release.summary.length).toBeGreaterThan(10);
    });
  });

  it('should have Footwear release mentioning comfort', () => {
    const footwearRelease = component.pressReleases.find(r => r.category === 'Footwear');
    if (footwearRelease) {
      expect(footwearRelease.summary.toLowerCase()).toContain('comfort');
    }
  });
});
