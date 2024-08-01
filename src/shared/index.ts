export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string[];
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  count: number;
  totalDocs: number;
  totalPages: number;
  next?: number;
  previous?: number;
}

export const regexSearchQuery = (
  fields: string[],
  searchParam: string,
  query?: Record<string, any>,
) => {
  const mappedFields = fields.map((field: string) => {
    return { [field]: { $regex: new RegExp(searchParam), $options: 'i' } };
  });

  delete query.search;

  return {
    $or: mappedFields,
    ...query,
  };
};
