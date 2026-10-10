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

  it('should have press release categories: Launch, Expansion, Funding, Milestone', () => {
    const categories = component.pressReleases.map(r => r.category);
    expect(categories).toContain('Launch');
    expect(categories).toContain('Expansion');
    expect(categories).toContain('Funding');
    expect(categories).toContain('Milestone');
  });

  it('should have Launch release in August 2026', () => {
    const launchRelease = component.pressReleases.find(r => r.category === 'Launch');
    expect(launchRelease).toBeDefined();
    if (launchRelease) {
      expect(launchRelease.date).toContain('August');
      expect(launchRelease.date).toContain('2026');
    }
  });

  it('should have Expansion release in July 2026', () => {
    const expansionRelease = component.pressReleases.find(r => r.category === 'Expansion');
    expect(expansionRelease).toBeDefined();
    if (expansionRelease) {
      expect(expansionRelease.date).toContain('July');
      expect(expansionRelease.date).toContain('2026');
    }
  });

  it('should have Funding release mentioning $10M', () => {
    const fundingRelease = component.pressReleases.find(r => r.category === 'Funding');
    expect(fundingRelease).toBeDefined();
    if (fundingRelease) {
      expect(fundingRelease.summary).toContain('$10M');
    }
  });

  it('should have Milestone release mentioning 100,000 customers', () => {
    const milestoneRelease = component.pressReleases.find(r => r.category === 'Milestone');
    expect(milestoneRelease).toBeDefined();
    if (milestoneRelease) {
      expect(milestoneRelease.summary).toContain('100,000');
    }
  });

  it('should have media contact Sarah Johnson with VP Marketing title', () => {
    const sarahContact = component.mediaContacts.find(c => c.name === 'Sarah Johnson');
    expect(sarahContact).toBeDefined();
    if (sarahContact) {
      expect(sarahContact.title).toContain('VP Marketing');
    }
  });

  it('should have media contact with email address', () => {
    component.mediaContacts.forEach(contact => {
      expect(contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('should have media contact with phone number', () => {
    component.mediaContacts.forEach(contact => {
      // Phone should have digits or letters (allowing +, -, space for formatting)
      expect(contact.phone).toMatch(/^[\d+\-\s\w]+$/);
    });
  });

  it('should have all press releases with meaningful summaries', () => {
    component.pressReleases.forEach(release => {
      expect(release.summary.length).toBeGreaterThan(10);
    });
  });

  it('should have Expansion release mentioning 150+ countries', () => {
    const expansionRelease = component.pressReleases.find(r => r.category === 'Expansion');
    if (expansionRelease) {
      expect(expansionRelease.summary).toContain('150+');
    }
  });
});
