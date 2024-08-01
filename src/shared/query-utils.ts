// query-utils.ts

export function prepareSearchStage(model: any, search: string): any {
  if (!search || typeof search !== 'string' || search.trim() === '') {
    return {};
  }

  // Helper function to recursively find searchable fields
  function findSearchableFields(
    schemaPart: any,
    pathPrefix: string = '',
  ): string[] {
    return Object.entries(schemaPart).flatMap(([key, schemaType]) => {
      const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

      // Type assertions to clarify the structure for TypeScript
      const typeInstance = (schemaType as any).instance;
      const nestedSchema = (schemaType as any).schema;

      if (typeInstance === 'String' || typeInstance === 'ObjectID') {
        return fullPath;
      } else if (typeInstance === 'Embedded' && nestedSchema) {
        return findSearchableFields(nestedSchema.paths, fullPath);
      }

      return [];
    });
  }

  // Recursively find searchable fields in the schema
  const searchFields = findSearchableFields(model.schema.paths);

  // If no fields are suitable for searching, return an empty match stage
  if (searchFields.length === 0) {
    return { $match: {} };
  }

  // Build the $or array with conditions for each searchable field
  const searchConditions = searchFields.map((field) => ({
    [field]: { $regex: search, $options: 'i' },
  }));

  return { $match: { $or: searchConditions } };
}

export function prepareFilterStage(
  filter: Record<string, { values: any[] }>,
): any {
  const matchStage: Record<string, any> = {};

  if (!filter) return { $match: matchStage };

  Object.keys(filter).forEach((field) => {
    const filterDetails = filter[field];
    if (filterDetails && Array.isArray(filterDetails.values)) {
      matchStage[field] = { $in: filterDetails.values };
    }
  });

  return { $match: matchStage };
}

export function prepareNestedFilterStage(
  filter: Record<string, { values: any[] }>,
  field: string,
): any[] {
  if (!filter) return [];

  const nestedFilterConditions = Object.keys(filter)
    .filter((f) => f.startsWith(`${field}.`))
    .reduce((acc, nestedField) => {
      const nestedFieldName = nestedField.replace(`${field}.`, '');
      acc[nestedFieldName] = { $in: filter[nestedField].values };
      return acc;
    }, {} as Record<string, any>);

  if (Object.keys(nestedFilterConditions).length > 0) {
    return [{ $match: nestedFilterConditions }];
  }
  return [];
}

export function prepareNestedSelectStage(
  select: string[],
  field: string,
): any[] {
  if (!select) return [];

  const nestedSelectFields = select
    .filter((f) => f.startsWith(`${field}.`))
    .map((f) => f.replace(`${field}.`, ''));

  if (nestedSelectFields.length > 0) {
    const projectStage = nestedSelectFields.reduce((acc, nestedField) => {
      acc[nestedField] = 1;
      return acc;
    }, {} as Record<string, number>);
    return [{ $project: projectStage }];
  }
  return [];
}
