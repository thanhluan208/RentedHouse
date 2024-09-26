import { OptionCommon } from "../../Interfaces/common";
import { HouseStatusEnum } from "../../Services/House.service";

export interface House {
  _id: string;
  name: string;
  status: HouseStatusEnum;
  city: OptionCommon;
  commune: OptionCommon;
  district: OptionCommon;
  address: string;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Room {
  _id: string;
  name: string;
  status: string;
  price: number;
  size: number;
  maxGuest: number;
  guests: Guest[];
  electricityFee: number;
  internetFee: number;
  waterFee: number;
  livingExpense: number;
  parkingFee: number;
  expenditure: Expenditure[];
  house: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Expenditure {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  price: number;
  _id: string;
}

export interface Guest {
  _id: string;
  name: string;
  contract: any[];
  __v: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface CommonFilter  {
  page: number;
  pageSize: number;
  [key: string]: any;
}