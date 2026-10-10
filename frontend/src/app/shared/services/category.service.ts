import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../home/models';

// Single Responsibility: Handle category operations only
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private mockCategories: Category[] = [
    { id: 'men', name: 'Men', icon: 'shirt', productCount: 0 },
    { id: 'women', name: 'Women', icon: 'sparkles', productCount: 0 },
    { id: 't-shirts-tops', name: 'T-Shirts & Tops', icon: 'shirt', productCount: 0 },
    { id: 'shorts', name: 'Shorts', icon: 'scissors', productCount: 0 },
    { id: 'leggings-flared', name: 'Leggings & Flared', icon: 'person-standing', productCount: 0 },
    { id: 'sports-bras', name: 'Sports Bras', icon: 'heart', productCount: 0 },
    { id: 'footwear', name: 'Footwear', icon: 'footprints', productCount: 0 },
    { id: 'running', name: 'Running', icon: 'zap', productCount: 0 },
    { id: 'lifting', name: 'Lifting', icon: 'dumbbell', productCount: 0 },
    { id: 'lifestyle', name: 'Lifestyle', icon: 'sun', productCount: 0 }
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>(this.mockCategories);
  categories$ = this.categoriesSubject.asObservable();

  getAll(): Observable<Category[]> {
    return this.categories$;
  }

  getById(categoryId: string): Category | undefined {
    return this.mockCategories.find(c => c.id === categoryId);
  }

  search(query: string): Observable<Category[]> {
    const filtered = this.mockCategories.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    return new Observable(observer => {
      observer.next(filtered);
      observer.complete();
    });
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockCategories.push(newCategory);
    this.categoriesSubject.next(this.mockCategories);
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories[index] = { ...this.mockCategories[index], ...updates };
      this.categoriesSubject.next(this.mockCategories);
    }
  }

  deleteCategory(id: string): void {
    this.mockCategories = this.mockCategories.filter(c => c.id !== id);
    this.categoriesSubject.next(this.mockCategories);
  }
}
