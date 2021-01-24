import {
  BadRequestException,
  Body,
  Controller, DefaultValuePipe, Delete,
  Get, ParseIntPipe,
  Post,
  Query, ValidationPipe
} from '@nestjs/common';
import {
  CreateVehicleInfoResult,
  VehicleInfoService
} from './vehicle-info.service';
import { VehicleInfo } from './types/vehicle-info';
import { DeleteManyRequest } from './types/delete-many-request';
import { CustomParseIntPipe } from './pipes/custom-parse-int-pipe';
import { CreateVehicleInfoRequest } from './types/create-vehicle-info-request';

@Controller('vehicle-info')
export class VehicleInfoController {
  constructor(
    private readonly vehicleInfoService: VehicleInfoService
  ) {
  }

  @Get('num-vehicle-infos')
  async getVehicleInfoCount(): Promise<number> {
    return this.vehicleInfoService.count();
  }

  @Get('vehicle-infos')
  async getVehicleInfos(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('make') make: string | undefined,
    @Query('model') model: string | undefined,
    @Query('year', CustomParseIntPipe) year: number | undefined
  ): Promise<readonly VehicleInfo[]> {
    return this.vehicleInfoService.vehicleInfos(
      { offset, limit },
      { make, model, year }
    );
  }

  @Post('create-vehicle-info')
  async createVehicleInfo(@Body(ValidationPipe) data: CreateVehicleInfoRequest): Promise<void> {
    const result = await this.vehicleInfoService.createVehicleInfo(data);
    if (result === CreateVehicleInfoResult.ErrorAlreadyExists) {
      throw new BadRequestException(null, 'Item with make/model/year already exists.')
    }
  }

  @Delete('delete-vehicle-infos')
  async deleteVehicleInfos(@Body(ValidationPipe) data: DeleteManyRequest): Promise<number> {
    return this.vehicleInfoService.deleteVehicleInfo(data.ids);
  }
}
