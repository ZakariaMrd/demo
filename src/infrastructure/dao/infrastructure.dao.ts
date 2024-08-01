import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDao } from 'src/shared/baseDao';
import { Infrastructure, InfrastructureDocument } from '../schemas/infrastructure.schema';

@Injectable()
export class InfrastructureDao extends BaseDao<InfrastructureDocument> {
  constructor(
    @InjectModel(Infrastructure.name)
    private readonly infrastructureModel: Model<InfrastructureDocument>,
  ) {
    super(infrastructureModel);
  }

  async findByField(fieldName: string, value: any): Promise<InfrastructureDocument> {
    return this.infrastructureModel.findOne({ [fieldName]: value }).exec();
  }


}
