import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogComponent } from './blog.component';
import { BLOG_POSTS } from './data';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blog posts from data.ts', () => {
    expect(component.blogPosts).toEqual(BLOG_POSTS);
    expect(component.blogPosts.length).toBe(6);
  });

  it('should have all blog posts with required properties', () => {
    component.blogPosts.forEach(post => {
      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.excerpt).toBeDefined();
      expect(post.author).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.category).toBeDefined();
      expect(post.readTime).toBeDefined();
    });
  });

  it('should have 6 blog posts', () => {
    expect(component.blogPosts.length).toBe(6);
  });

  it('should have blog posts with unique IDs', () => {
    const ids = component.blogPosts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have blog posts from August and July 2026', () => {
    const allDates = component.blogPosts.map(p => p.date).join(' ');
    expect(allDates).toContain('August');
    expect(allDates).toContain('July');
    expect(allDates).toContain('2026');
  });

  it('should have blog posts with various categories', () => {
    const categories = component.blogPosts.map(p => p.category);
    expect(categories).toContain('Women');
    expect(categories).toContain('Lifting');
    expect(categories).toContain('Running');
    expect(categories).toContain('Footwear');
    expect(categories).toContain('Size Guide');
    expect(categories).toContain('Summer');
  });

  it('should have blog posts by different authors', () => {
    const authors = component.blogPosts.map(p => p.author);
    expect(authors).toContain('Salma Adel');
    expect(authors).toContain('Omar Khaled');
    expect(authors).toContain('Karim Samy');
    expect(authors).toContain('Nour El-Din');
    expect(authors).toContain('Mariam Fathy');
    expect(authors).toContain('Haxel Team');
  });

  it('should have read times ranging from 5-10 minutes', () => {
    component.blogPosts.forEach(post => {
      const readTimeMatch = post.readTime.match(/\d+/);
      expect(readTimeMatch).toBeTruthy();
      if (readTimeMatch) {
        const minutes = parseInt(readTimeMatch[0]);
        expect(minutes).toBeGreaterThanOrEqual(5);
        expect(minutes).toBeLessThanOrEqual(10);
      }
    });
  });

  it('should have all titles starting with capital letter', () => {
    component.blogPosts.forEach(post => {
      expect(post.title).toMatch(/^[A-Z]/);
    });
  });

  it('should have all excerpts with meaningful content', () => {
    component.blogPosts.forEach(post => {
      expect(post.excerpt.length).toBeGreaterThan(20);
    });
  });

  it('should have blog post about Leggings', () => {
    const leggingsPost = component.blogPosts.find(p => 
      p.title.includes('Leggings')
    );
    expect(leggingsPost).toBeDefined();
  });

  it('should have blog post about Summer', () => {
    const travelPost = component.blogPosts.find(p => 
      p.category === 'Summer'
    );
    expect(travelPost).toBeDefined();
  });
});
