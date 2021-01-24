import { IsNotEmpty, IsUppercase, Max, Min } from 'class-validator';

export class CreateVehicleInfoRequest {
  @IsNotEmpty()
  @IsUppercase()
  readonly make: string;

  @IsNotEmpty()
  @IsUppercase()
  readonly model: string;

  @IsNotEmpty()
  @Min(1900)
  @Max(2021)
  readonly year: number;
}
