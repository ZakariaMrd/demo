import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDao } from 'src/shared/baseDao';
import { Provider, ProviderDocument } from '../schemas/provider.schema';

@Injectable()
export class ProviderDao extends BaseDao<ProviderDocument> {
  constructor(
    @InjectModel(Provider.name)
    private readonly providerModel: Model<ProviderDocument>,
  ) {
    super(providerModel);
  }

  async findByField(fieldName: string, value: any): Promise<ProviderDocument> {
    return this.providerModel.findOne({ [fieldName]: value }).exec();
  }


}
