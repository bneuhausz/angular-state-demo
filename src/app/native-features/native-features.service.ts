import { computed, inject, Injectable, signal } from "@angular/core";
import { BooksState } from "../book-state";
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BookService } from "../book.service";
import { FormControl } from "@angular/forms";

@Injectable()
export class NativeFeaturesService {
  readonly #bookService = inject(BookService);
  filterControl = new FormControl();
  orderControl = new FormControl<'asc' | 'desc'>('asc');

  readonly #state = signal<BooksState>({
    books: [],
    isLoading: false,
    filter: { query: '', order: 'asc' },
  });

  books = computed(() => this.#state().books);
  isLoading = computed(() => this.#state().isLoading);
  filter = computed(() => this.#state().filter);
  booksCount = computed(() => this.books().length);

  getFilteredBooks$ = new Subject()
    .pipe(
      takeUntilDestroyed(),
      startWith(null),
      tap(() => this.#state.update((state) => ({
        ...state,
        isLoading: true,
      }))),
      switchMap(() => this.#bookService.loadBooks(this.filter())),
    );

  updateQuery$ = this.filterControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap((query) => this.#state.update((state) => ({
        ...state,
        isLoading: true,
        filter: { ...state.filter, query }
      }))),
      switchMap(() => this.getFilteredBooks$),
    );

  updateOrder$ = this.orderControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      tap((order) => this.#state.update((state) => ({
        ...state,
        isLoading: true,
        filter: { ...state.filter, order: order! }
      }))),
      switchMap(() => this.getFilteredBooks$),
    );

  constructor() {
    this.getFilteredBooks$.subscribe((books) => {
      this.#state.update((state) => ({
        ...state,
        books,
        isLoading: false,
      }));
    });

    this.updateQuery$.subscribe((books) => {
      this.#state.update((state) => ({
        ...state,
        books,
        isLoading: false,
      }));
    });

    this.updateOrder$.subscribe((books) => {
      this.#state.update((state) => ({
        ...state,
        books,
        isLoading: false,
      }));
    });
  }
}
