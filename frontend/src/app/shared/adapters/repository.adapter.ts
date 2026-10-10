// Liskov Substitution & Dependency Inversion: Create adapters for existing services to comply with repository interfaces

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReadRepository, IWriteRepository } from '../interfaces/repositories';

/**
 * Generic Repository Adapter
 * Adapts any service to implement IReadRepository
 * Ensures Liskov substitution for repository operations
 * DIP: Properly typed to enforce IReadRepository<T> contract
 */
@Injectable({ providedIn: 'root' })
export class RepositoryAdapter<T> implements IReadRepository<T> {
  private _service: IReadRepository<T> | null = null;

  set service(value: IReadRepository<T>) {
    this._service = value;
  }

  getAll(): Observable<T[]> {
    return this._service?.getAll() || new Observable(obs => obs.complete());
  }

  getById(id: string): Observable<T | undefined> {
    return this._service?.getById(id) || new Observable(obs => obs.complete());
  }

  search(query: string): Observable<T[]> {
    return this._service?.search(query) || new Observable(obs => obs.complete());
  }
}

/**
 * Generic Write Repository Adapter
 * Ensures write operations comply with repository contracts
 * DIP: Properly typed to enforce IWriteRepository<T> contract
 */
@Injectable({ providedIn: 'root' })
export class WriteRepositoryAdapter<T> implements IWriteRepository<T> {
  private _service: IWriteRepository<T> | null = null;

  set service(value: IWriteRepository<T>) {
    this._service = value;
  }

  save(item: T): Observable<T> {
    return this._service?.save(item) || new Observable(obs => obs.complete());
  }

  update(id: string, item: Partial<T>): Observable<T> {
    return this._service?.update(id, item) || new Observable(obs => obs.complete());
  }

  delete(id: string): Observable<void> {
    return this._service?.delete(id) || new Observable(obs => obs.complete());
  }
}
