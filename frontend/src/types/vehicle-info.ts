export interface VehicleInfo {
  readonly id: number;
  readonly make: string;
  readonly model: string;
  readonly year: number;
}

export type CreateVehicleInfoData = Readonly<Omit<VehicleInfo, 'id'>>;

export interface DeleteVehicleInfosData {
  readonly ids: readonly number[];
}

export interface CreateVehicleInfoResult {
  readonly success: boolean;
  readonly errors: readonly string[];
}
