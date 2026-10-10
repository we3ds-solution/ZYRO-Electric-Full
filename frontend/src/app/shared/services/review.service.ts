import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../../products/models';

// Single Responsibility: Handle review operations only
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private mockReviews: Review[] = [
    {
      id: '1',
      productId: '1',
      userId: 'user1',
      userName: 'John D.',
      rating: 5,
      title: 'Excellent product',
      comment: 'Very satisfied with this purchase',
      helpful: 0,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  private reviewsSubject = new BehaviorSubject<Review[]>(this.mockReviews);
  reviews$ = this.reviewsSubject.asObservable();

  getReviewsByProductId(productId: string): Observable<Review[]> {
    const filtered = this.mockReviews.filter(r => r.productId === productId);
    return new Observable(observer => {
      observer.next(filtered);
      observer.complete();
    });
  }

  getAverageRating(productId: string): number {
    const productReviews = this.mockReviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  }

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockReviews.push(newReview);
    this.reviewsSubject.next(this.mockReviews);
  }

  deleteReview(reviewId: string): void {
    this.mockReviews = this.mockReviews.filter(r => r.id !== reviewId);
    this.reviewsSubject.next(this.mockReviews);
  }
}
