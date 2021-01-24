import { Module } from '@nestjs/common';
import { VehicleInfoController } from './vehicle-info.controller';
import { PrismaService } from './prisma.service';
import { VehicleInfoService } from './vehicle-info.service';
import { CustomParseIntPipe } from './pipes/custom-parse-int-pipe';

@Module({
  imports: [],
  controllers: [
    VehicleInfoController
  ],
  providers: [
    VehicleInfoService,
    PrismaService,
    CustomParseIntPipe
  ],
})
export class AppModule {}
