import { Timestamp } from "firebase/firestore";

export interface House {
  district: District;
  name: string;
  commune: Commune;
  address: string;
  city: CommonOption;
  id: string;
  status: CommonOption;
  rooms: string[] | [];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommonOption {
  label: string;
  value: string;
}

export interface Commune {
  value: string;
  label: string;
  idDistrict: string;
}

export interface District {
  label: string;
  idCity: string;
  value: string;
}
