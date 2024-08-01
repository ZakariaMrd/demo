import { PartialType } from '@nestjs/mapped-types';
import { CreateServicegroupDto} from "./create-servicegroup.dto";

export class UpdateServicegroupDto extends PartialType(CreateServicegroupDto) {}