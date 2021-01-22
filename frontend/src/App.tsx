import React from 'react';
import { VehicleInfoScreen } from './components/VehicleInfoScreen';
import vehicleInfosRaw from './data/VehicleInfo.json';
import { VehicleInfo } from './types/vehicle-info';

export function App() {
  const vehicleInfos: readonly VehicleInfo[] = vehicleInfosRaw as readonly VehicleInfo[];

  return (
    <div style={{ height: '100vh' }}>
      <VehicleInfoScreen
        vehicleInfos={vehicleInfos}
        onAddVehicle={() => {}}
        onDeleteVehicles={(ids: readonly string[]) => {}}
      />
    </div>
  );
}
