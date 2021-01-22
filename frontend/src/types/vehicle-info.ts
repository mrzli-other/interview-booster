export interface VehicleInfo {
  // readonly id: string;
  readonly _id: {
    readonly $oid: string;
  }
  readonly make: string;
  readonly model: string;
  readonly year: number;
}

export type AddVehicleInfoData = Readonly<Omit<VehicleInfo, '_id'>>;
