import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  readonly #books = ['Angular Book', 'Basic TypeScript', 'CSS Fundamentals', 'DOM Manipulation'];

  loadBooks(filter: { query: string; order: 'asc' | 'desc' }): Observable<string[]> {
    let filteredBooks = this.#books.filter(book =>
      book.toLowerCase().includes(filter.query.toLowerCase())
    );

    filteredBooks.sort((a, b) => {
      const comparison = a.localeCompare(b);
      return filter.order === 'asc' ? comparison : -comparison;
    });

    return of(filteredBooks).pipe(
      delay(1000)
    );
  }
}
