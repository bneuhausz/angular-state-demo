import { signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from "@angular/core";
import { BookService } from "../book.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from '@ngrx/operators';

type BooksState = {
  books: string[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BooksState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BooksStore = signalStore(
  withDevtools('BooksStore'),
  withState(initialState),
  withComputed(({ books }) => ({
    booksCount: computed(() => books().length),
  })),
  withMethods((store, booksService = inject(BookService)) => ({
    updateQuery(query: string): void {
      updateState(store, 'updateQuery', (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      updateState(store, 'updateOrder', (state) => ({ filter: { ...state.filter, order } }));
    },
    loadBooks: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'loading', { isLoading: true })),
        switchMap(() => {
          return booksService.loadBooks(store.filter()).pipe(
            tapResponse({
              next: (books: string[]) => updateState(store, 'getByQuery', { books }),
              error: console.error,
              finalize: () => updateState(store, 'loading done', { isLoading: false }),
            })
          );
        })
      )
    ),
  }))
);
