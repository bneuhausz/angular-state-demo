import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BooksStore } from './books.store';

@Component({
  selector: 'app-ngrx-signal-store',
  imports: [JsonPipe, ReactiveFormsModule],
  providers: [BooksStore],
  template: `
    <p>
      <input [formControl]="filterControl" />
      <select [formControl]="orderControl">
        <option value="asc">asc</option>
        <option value="desc">desc</option>
      </select>
    </p>
    <p>
      {{ store.isLoading() ? 'loading...' : (store.books() | json) }}
    </p>
    <p>
      Total books: {{ store.booksCount() }}
    </p>
  `,
  styles: ``
})
export default class NgrxSignalStoreComponent implements OnInit {
  readonly store = inject(BooksStore);

  filterControl = new FormControl<string>('', { nonNullable: true });
  orderControl = new FormControl<'asc' | 'desc'>('asc', { nonNullable: true });

  ngOnInit(): void {
    this.store.loadBooks();

    this.filterControl.valueChanges.subscribe(query => {
      this.store.updateQuery(query);
      this.store.loadBooks();
    });

    this.orderControl.valueChanges.subscribe(order => {
      this.store.updateOrder(order);
      this.store.loadBooks();
    });
  }
}
