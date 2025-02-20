import { computed, Injectable, signal } from "@angular/core";
import { GlobalState } from "./global-state";
import { Subject, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  readonly #state = signal<GlobalState>({
    backgroundColor: 'white'
  });

  backgroundColor = computed(() => this.#state().backgroundColor);
  fontColor = computed(() => this.backgroundColor() === 'white' ? 'black' : 'white');

  backgroundColorChanged$ = new Subject<void>();
  readonly #changeBackgroundColor$ = this.backgroundColorChanged$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update(state => ({
          ...state,
          backgroundColor: state.backgroundColor === 'white' ? 'black' : 'white'
        }));
        localStorage.setItem('backgroundColor', this.#state().backgroundColor);
      })
    );

  constructor() {
    this.#changeBackgroundColor$.subscribe();
    if(localStorage.getItem('backgroundColor')) {
      this.#state.update(state => ({
        ...state,
        backgroundColor: localStorage.getItem('backgroundColor')!
      }));
    }
  }
}
