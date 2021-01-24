import axios from 'axios';
import {
  CreateVehicleInfoData, CreateVehicleInfoResult,
  DeleteVehicleInfosData,
  VehicleInfo, VehicleInfoFilterData
} from '../types/vehicle-info';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

export async function getVehicleInfoCount(
  filterData: VehicleInfoFilterData
): Promise<number> {
  const params = new URLSearchParams();
  if (filterData.make) {
    params.append('make', filterData.make);
  }
  if (filterData.model) {
    params.append('model', filterData.model);
  }
  if (filterData.year) {
    params.append('year', filterData.year.toString());
  }

  const response = await api.get<number>('/vehicle-info/num-vehicle-infos', { params });
  return response.data;
}

export async function getVehicleInfos(
  offset: number,
  limit: number,
  filterData: VehicleInfoFilterData
): Promise<readonly VehicleInfo[]> {
  const params = new URLSearchParams();
  params.append('offset', offset.toString());
  params.append('limit', limit.toString());
  if (filterData.make) {
    params.append('make', filterData.make);
  }
  if (filterData.model) {
    params.append('model', filterData.model);
  }
  if (filterData.year) {
    params.append('year', filterData.year.toString());
  }

  const response = await api.get<readonly VehicleInfo[]>('/vehicle-info/vehicle-infos', { params });
  return response.data;
}

export async function createVehicleInfo(data: CreateVehicleInfoData): Promise<CreateVehicleInfoResult> {
  try {
    await api.post<any>('/vehicle-info/create-vehicle-info', data); // 'any' sucks, but good enough for this example
    return { success: true, errors: [] };
  } catch (e) {
    const data = e.response.data;
    return {
      success: false,
      errors: Array.isArray(data.message) ? data.message : [data.message] // again, bad, should be a consistent type
    };
  }
}

export async function deleteVehicleInfos(data: DeleteVehicleInfosData): Promise<number> {
  const response = await api.delete<number>('/vehicle-info/delete-vehicle-infos', { data });
  return response.data;
}
