import { computed, inject, Injectable, signal } from "@angular/core";
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BookService } from "../book.service";
import { FormControl } from "@angular/forms";

type BooksState = {
  books: string[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

@Injectable()
export class NativeWithReduxDevtoolsFeaturesService {
  readonly #devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect()
    : null;

  readonly #bookService = inject(BookService);
  filterControl = new FormControl<string>('', { nonNullable: true });
  orderControl = new FormControl<'asc' | 'desc'>('asc', { nonNullable: true });

  readonly #state = signal<BooksState>({
    books: [],
    isLoading: false,
    filter: { query: '', order: 'asc' },
  });

  books = computed(() => this.#state().books);
  isLoading = computed(() => this.#state().isLoading);
  filter = computed(() => this.#state().filter);
  booksCount = computed(() => this.books().length);

  filterChanges$ = merge(
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(query => ({ query }))
    ),
    this.orderControl.valueChanges.pipe(
      map(order => ({ order }))
    )
  ).pipe(
    takeUntilDestroyed(),
    startWith(this.#state().filter),
    tap(filter =>
      {
        this.#state.update(state => ({...state, isLoading: true, filter: { ...state.filter, ...filter }}));
        if (this.#devTools) {
          this.#devTools.send('FILTER_CHANGED', this.#state());
        }
      }
    ),
    switchMap(() => this.#bookService.loadBooks(this.filter())),
    tap(books =>
      {
        this.#state.update(state => ({...state, books, isLoading: false}));
        if (this.#devTools) {
          this.#devTools.send('BOOKS_LOADED', this.#state());
        }
      }
    )
  );

  constructor() {
    if (this.#devTools) {
      this.#devTools.init(this.#state);
    }

    this.filterChanges$.subscribe();
  }
}
