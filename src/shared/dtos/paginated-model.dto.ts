export class PaginatedModelDto<T> {
  docs: T[];
  meta: {
    page: number;
    limit: number;
    count: number;
    totalPages: number;
    totalDocs: number;
    next: number | null;
    previous: number | null;
  };
}
