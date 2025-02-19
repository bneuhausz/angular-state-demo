export type BooksState = {
  books: string[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};
