import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDao } from 'src/shared/baseDao';
import { Servicegroup, ServicegroupDocument } from '../schemas/servicegroup.schema';

@Injectable()
export class ServicegroupDao extends BaseDao<ServicegroupDocument> {
  constructor(
    @InjectModel(Servicegroup.name)
    private readonly servicegroupModel: Model<ServicegroupDocument>,
  ) {
    super(servicegroupModel);
  }

  async findByField(fieldName: string, value: any): Promise<ServicegroupDocument> {
    return this.servicegroupModel.findOne({ [fieldName]: value }).exec();
  }


}
