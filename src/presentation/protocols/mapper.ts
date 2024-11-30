export interface Mapper<D, U> {
  toUseCase(data: D): U;
}
