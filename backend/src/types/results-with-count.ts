export interface ResultsWithCount<T> {
  readonly results: readonly T[];
  readonly count: number;
}
