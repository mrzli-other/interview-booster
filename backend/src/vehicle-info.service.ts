import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { VehicleInfo } from './types/vehicle-info';
import { PaginationData } from './types/pagination-data';
import { VehicleInfoFilter } from './types/vehicle-info-filter';
import { CreateVehicleInfoRequest } from './types/create-vehicle-info-request';

@Injectable()
export class VehicleInfoService {
  constructor(private prisma: PrismaService) {
  }

  async count(): Promise<number> {
    return this.prisma.vehicleInfo.count();
  }

  async vehicleInfos(
    paginationData: PaginationData,
    vehicleInfoFilter: VehicleInfoFilter
  ): Promise<readonly VehicleInfo[]> {
    const list = await this.prisma.vehicleInfo.findMany({
      skip: paginationData.offset,
      take: paginationData.limit,
      where: {
        make: { contains: vehicleInfoFilter.make, mode: 'insensitive' },
        model: { contains: vehicleInfoFilter.model, mode: 'insensitive' },
        year: { equals: vehicleInfoFilter.year }
      }
    });

    return list.map((item) => ({
      id: item.id,
      make: item.make,
      model: item.model,
      year: item.year
    }));
  }

  async createVehicleInfo(data: CreateVehicleInfoRequest): Promise<CreateVehicleInfoResult> {
    const existingEntry = await this.prisma.vehicleInfo.findUnique({
      where: {
        VehicleInfo_unique_make_model_year: {
          make: data.make,
          model: data.model,
          year: data.year
        }
      },
    });
    console.log(existingEntry);

    if (existingEntry) {
      return CreateVehicleInfoResult.ErrorAlreadyExists;
    }

    await this.prisma.vehicleInfo.create({
      data: {
        make: data.make,
        model: data.model,
        year: data.year
      }
    });
    return CreateVehicleInfoResult.Success;
  }

  async deleteVehicleInfo(ids: readonly number[]): Promise<number> {
    const result = await this.prisma.vehicleInfo.deleteMany({
      where: { id: { in: [...ids] } }
    });
    return result.count;
  }
}

export enum CreateVehicleInfoResult {
  Success = 'Success',
  ErrorAlreadyExists = 'ErrorAlreadyExists'
}
