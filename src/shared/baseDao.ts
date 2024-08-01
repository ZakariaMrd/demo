import { Model, Document } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PaginationMetadata } from './index';
import { QueryOptionsDto } from './query-options.dto';
import {
  prepareSearchStage,
  prepareFilterStage,
  prepareNestedFilterStage,
  prepareNestedSelectStage,
} from './query-utils';

@Injectable()
export class BaseDao<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  /* async find(
    queryOptions: QueryOptionsDto,
  ): Promise<{ docs: T[]; metadata: PaginationMetadata }> {
    let pipeline: any[] = [];

    // Apply search stage first if present
    if (queryOptions.search) {
      pipeline.push(prepareSearchStage(this.model, queryOptions.search));
    }

    // Apply top-level filter stage early
    if (queryOptions.filter) {
      const topLevelFilterStage = prepareFilterStage(
        Object.keys(queryOptions.filter)
          .filter((f) => !f.includes('.'))
          .reduce((acc, field) => {
            acc[field] = queryOptions.filter[field];
            return acc;
          }, {} as Record<string, { values: any[] }>),
      );
      if (Object.keys(topLevelFilterStage.$match).length > 0) {
        pipeline.push(topLevelFilterStage);
      }
    }

    // Apply sort stage
    if (queryOptions.sort) {
      pipeline.push({ $sort: queryOptions.sort });
    }

    // Ensure page and limit are valid integers
    const page =
      queryOptions.page && !isNaN(queryOptions.page) ? queryOptions.page : 1;
    const limit =
      queryOptions.limit && !isNaN(queryOptions.limit)
        ? queryOptions.limit
        : 10;

    // Apply pagination (skip and limit)
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    // Prepare top-level projection stage to include only necessary fields
    let topLevelProjectStage: Record<string, any> = {};
    if (queryOptions.select) {
      topLevelProjectStage = queryOptions.select.reduce((acc, field) => {
        if (!field.includes('.')) {
          acc[field] = 1;
        }
        return acc;
      }, {} as Record<string, number>);
    }

    // Apply population stage last
    // Apply population stage with nested selection, filtering, and sorting
    if (queryOptions.populate) {
      queryOptions.populate.forEach((field) => {
        const lookupStage: any = {
          $lookup: {
            from: field,
            localField: field,
            foreignField: '_id',
            as: field,
            pipeline: [
              ...prepareNestedFilterStage(queryOptions.filter || {}, field),
              ...prepareNestedSelectStage(queryOptions.select || [], field),
            ],
          },
        };

        // Nested sorting
        if (queryOptions.sort) {
          const nestedSortFields = Object.keys(queryOptions.sort)
            .filter((f) => f.startsWith(`${field}.`))
            .reduce((acc, nestedField) => {
              const nestedFieldName = nestedField.replace(`${field}.`, '');
              acc[nestedFieldName] = queryOptions.sort[nestedField];
              return acc;
            }, {} as Record<string, number>);

          if (Object.keys(nestedSortFields).length > 0) {
            lookupStage.$lookup.pipeline.push({ $sort: nestedSortFields });
          }
        }

        pipeline.push(lookupStage, { $unwind: `$${field}` });

        // Combine top-level and nested projections
        if (queryOptions.select) {
          const nestedSelectFields = queryOptions.select
            .filter((f) => f.startsWith(`${field}.`))
            .map((f) => f.replace(`${field}.`, `${field}.`));

          if (nestedSelectFields.length > 0) {
            nestedSelectFields.forEach((nestedField) => {
              topLevelProjectStage[nestedField] = 1;
            });
          }
        }
      });
    }

    if (Object.keys(topLevelProjectStage).length > 0) {
      pipeline.push({ $project: topLevelProjectStage });
    }

    // Using $facet to perform pagination and count total documents in one go
    pipeline.push({
      $facet: {
        docs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        metadata: [
          { $count: 'totalDocs' },
          {
            $addFields: {
              page: page,
              limit: limit,
              totalPages: {
                $ceil: { $divide: ['$totalDocs', limit] },
              },
              next: {
                $cond: {
                  if: {
                    $lt: [
                      page,
                      {
                        $ceil: { $divide: ['$totalDocs', limit] },
                      },
                    ],
                  },
                  then: page + 1,
                  else: null,
                },
              },
              previous: {
                $cond: {
                  if: { $gt: [page, 1] },
                  then: page - 1,
                  else: null,
                },
              },
            },
          },
        ],
      },
    });

    // Ensure the pipeline is not empty
    if (pipeline.length === 0) {
      pipeline.push({ $match: {} }); // Default stage to ensure pipeline is not empty
    }

    const [result] = await this.model.aggregate(pipeline).exec();
    const { docs, metadata } = result;

    return {
      docs,
      metadata: metadata[0] || {
        page: page,
        limit: limit,
        totalDocs: 0,
        totalPages: 0,
        next: null,
        previous: null,
      },
    };

    // Execute the pipeline and count documents
    /* const totalDocs = await this.model.countDocuments({}).exec();
    const docs = await this.model.aggregate(pipeline).exec();
    const count = docs.length;
    const totalPages = Math.ceil(totalDocs / (queryOptions.limit || 10));
    const page = queryOptions.page || 1;
    const limit = queryOptions.limit || 10;

    const metadata: PaginationMetadata = {
      page,
      limit,
      count,
      totalDocs,
      totalPages,
      next: page < totalPages ? page + 1 : undefined,
      previous: page > 1 ? page - 1 : undefined,
    };

    return { docs, metadata }; 
  } */
  // old method
  /* async find(
    queryOptions: QueryOptionsDto,
  ): Promise<{ docs: T[]; metadata: PaginationMetadata }> {
    const pipeline: any[] = [];
  
    // Apply search stage if present
    if (queryOptions.search) {
      pipeline.push(prepareSearchStage(this.model, queryOptions.search));
    }
  
    // Apply top-level filter stage if present
    if (queryOptions.filter) {
      const filterStage = prepareFilterStage(queryOptions.filter);
      if (Object.keys(filterStage.$match).length > 0) {
        pipeline.push(filterStage);
      }
    }
  
    // Apply sort stage if present
    if (queryOptions.sort) {
      pipeline.push({ $sort: queryOptions.sort });
    }
  
    // Prepare top-level projection stage if necessary
    if (queryOptions.select) {
      const projectStage = queryOptions.select.reduce((acc, field) => {
        if (!field.includes('.')) {
          acc[field] = 1;
        }
        return acc;
      }, {} as Record<string, number>);
      if (Object.keys(projectStage).length > 0) {
        pipeline.push({ $project: projectStage });
      }
    }
  
    // Prepare population stages if necessary
    if (queryOptions.populate) {
      queryOptions.populate.forEach((field) => {
        const lookupStage: any = {
          $lookup: {
            from: field,
            localField: field,
            foreignField: '_id',
            as: field,
            pipeline: [
              ...prepareNestedFilterStage(queryOptions.filter || {}, field),
              ...prepareNestedSelectStage(queryOptions.select || [], field),
            ],
          },
        };
        pipeline.push(lookupStage, { $unwind: `$${field}` });
      });
    }
  
    // Set up pagination and metadata calculation using $facet
    const page = queryOptions.page && !isNaN(queryOptions.page) ? queryOptions.page : 1;
    const limit = queryOptions.limit && !isNaN(queryOptions.limit) ? queryOptions.limit : 10;
  
    pipeline.push({
      $facet: {
        docs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        metadata: [
          { $count: 'totalDocs' },
          {
            $addFields: {
              page: page,
              limit: limit,
              totalPages: { $ceil: { $divide: ['$totalDocs', limit] } },
              next: { $cond: { if: { $lt: [page, { $ceil: { $divide: ['$totalDocs', limit] } }] }, then: page + 1, else: null } },
              previous: { $cond: { if: { $gt: [page, 1] }, then: page - 1, else: null } },
            },
          },
        ],
      },
    });
  
    const [result] = await this.model.aggregate(pipeline).exec();
    const docs = result.docs || [];
    const metadata = result.metadata[0] || {
      totalDocs: 0,
      page,
      limit,
      totalPages: 0,
      next: null,
      previous: null,
    };
  
    return { docs, metadata };
  } */
  // seperation of the population and the facet
  async find(
    queryOptions: QueryOptionsDto,
  ): Promise<{ docs: T[]; metadata: PaginationMetadata }> {
    const pipeline: any[] = [];

    // Apply search stage if present
    if (queryOptions.search) {
      pipeline.push(prepareSearchStage(this.model, queryOptions.search));
    }

    // Apply filter stage
    if (queryOptions.filter) {
      const filterStage = prepareFilterStage(queryOptions.filter);
      pipeline.push(filterStage);
    }

    // Apply sort stage
    if (queryOptions.sort) {
      pipeline.push({ $sort: queryOptions.sort });
    }

    // Apply projection stage
    if (queryOptions.select) {
      const projectStage = queryOptions.select.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {} as Record<string, number>);
      pipeline.push({ $project: projectStage });
    }

    // Apply pagination and metadata using $facet
    const page = queryOptions.page ?? 1;
    const limit = queryOptions.limit ?? 10;

    pipeline.push({
      $facet: {
        docs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        metadata: [
          { $count: 'totalDocs' },
          {
            $addFields: {
              page: page,
              limit: limit,
              totalPages: { $ceil: { $divide: ['$totalDocs', limit] } },
              next: {
                $cond: {
                  if: {
                    $lt: [page, { $ceil: { $divide: ['$totalDocs', limit] } }],
                  },
                  then: page + 1,
                  else: null,
                },
              },
              previous: {
                $cond: { if: { $gt: [page, 1] }, then: page - 1, else: null },
              },
            },
          },
        ],
      },
    });

    // Execute the aggregation pipeline
    const [result] = await this.model.aggregate(pipeline).exec();
    let docs = result.docs || [];
    const metadata = result.metadata[0] || {
      totalDocs: 0,
      page,
      limit,
      totalPages: 0,
      next: null,
      previous: null,
    };

    // Post-processing population of documents
    if (queryOptions.populate) {
      docs = await this.model.populate(docs, {
        path: queryOptions.populate.join(' '),
      });
    }

    return { docs, metadata };
  }

  async create(data: any): Promise<T> {
    const createdModel = new this.model(data);
    return await createdModel.save();
  }

  async findById(
    id: string,
    queryOptions: QueryOptionsDto = {},
  ): Promise<T | null> {
    // Build the initial pipeline to find the document by its ID
    const pipeline: any[] = [
      { $match: { _id: new this.model.base.Types.ObjectId(id) } },
    ];

    try {
      // Apply additional filtering if specified
      if (queryOptions.filter) {
        const filterStage = prepareFilterStage(queryOptions.filter);
        if (Object.keys(filterStage.$match).length > 0) {
          pipeline.push(filterStage);
        }
      }

      // Apply field selection (projection) if specified
      if (queryOptions.select) {
        const projectStage = queryOptions.select.reduce((acc, field) => {
          acc[field] = 1;
          return acc;
        }, {} as Record<string, number>);
        if (Object.keys(projectStage).length > 0) {
          pipeline.push({ $project: projectStage });
        }
      }

      // Execute the aggregation pipeline to find the document
      const result = await this.model.aggregate(pipeline).exec();
      let doc = result.length > 0 ? result[0] : null;

      // Post-processing population of documents
      if (queryOptions.populate) {
        doc = await this.model.populate(doc, {
          path: queryOptions.populate.join(' '),
        });
      }
      return doc;
    } catch (error) {
      console.error('Error executing findById:', error);
      throw new Error('Internal server error');
    }
  }

  /* async findById(
    id: string,
    queryOptions: QueryOptionsDto = {},
  ): Promise<T | null> {
    const pipeline: any[] = [
      { $match: { _id: new this.model.base.Types.ObjectId(id) } },
    ];

    try {
      // Apply top-level filter stage
      if (queryOptions.filter) {
        const topLevelFilterStage = prepareFilterStage(
          Object.keys(queryOptions.filter || {})
            .filter((f) => !f.includes('.'))
            .reduce((acc, field) => {
              acc[field] = queryOptions.filter[field];
              return acc;
            }, {} as Record<string, { values: any[] }>),
        );
        if (Object.keys(topLevelFilterStage.$match).length > 0) {
          pipeline.push(topLevelFilterStage);
        }
      }

      // Prepare top-level projection stage to include only necessary fields
      let topLevelProjectStage: Record<string, any> = {};
      if (queryOptions.select) {
        topLevelProjectStage = queryOptions.select.reduce((acc, field) => {
          if (!field.includes('.')) {
            acc[field] = 1;
          }
          return acc;
        }, {} as Record<string, number>);
      }

      // Apply population stage with nested selection and filtering
      if (queryOptions.populate) {
        queryOptions.populate.forEach((field) => {
          const lookupStage: any = {
            $lookup: {
              from: field,
              localField: field,
              foreignField: '_id',
              as: field,
              pipeline: [
                ...prepareNestedFilterStage(queryOptions.filter || {}, field),
                ...prepareNestedSelectStage(queryOptions.select || [], field),
              ],
            },
          };

          pipeline.push(lookupStage, { $unwind: `$${field}` });

          // Combine top-level and nested projections
          if (queryOptions.select) {
            const nestedSelectFields = queryOptions.select
              .filter((f) => f.startsWith(`${field}.`))
              .map((f) => f.replace(`${field}.`, `${field}.`));

            if (nestedSelectFields.length > 0) {
              nestedSelectFields.forEach((nestedField) => {
                topLevelProjectStage[nestedField] = 1;
              });
            }
          }

          // console.log('Lookup Stage:', JSON.stringify(lookupStage, null, 2)); // Debug log
        });
      }

      if (Object.keys(topLevelProjectStage).length > 0) {
        pipeline.push({ $project: topLevelProjectStage });
      }

      //console.log('Final Pipeline:', JSON.stringify(pipeline, null, 2)); // Debug log

      const data = await this.model.aggregate(pipeline).exec();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      //console.error('Error executing pipeline:', error); // Log the specific error
      throw new Error('Internal server error');
    }
  } */

  /* async update(id: string, updateData: any): Promise<T> {
    return await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  } */

  async update(id: string, updateData: any): Promise<T> {
    if (!updateData.metadata) {
      updateData.metadata = {};
    }

    const existingDoc = await this.model.findById(id).exec();
    if (!existingDoc) {
      throw new Error('Document not found');
    }

    updateData.metadata.createdAt =
      (existingDoc as any).metadata?.createdAt || new Date();
    updateData.metadata.createdBy =
      (existingDoc as any).metadata?.createdBy || 'unknown';

    updateData.metadata.updatedAt = new Date();
    updateData.metadata.updatedBy = updateData.metadata.updatedBy || 'unknown';

    return await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateSections(id: string, sectionsList: any[]): Promise<T> {
    return await this.model
      .findByIdAndUpdate(
        id,
        { $set: { 'sections.list': sectionsList } },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<T> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
