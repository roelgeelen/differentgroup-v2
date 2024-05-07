export interface IVehicle {
  id: string;
  asset_id: string;
  alias: string;
  manufacturer: {name:string};
  model: {name:string};
  license_plate: {number:string};
  location: {latitude: number, longitude: number, in_movement: boolean, course: number, speed: number, timestamp: Date};
  organization: {id: string, name:string};
}
