import { baseHouseApi } from "../Constants/api";
import { OptionCommon } from "../Interfaces/common";
import httpServices from "./http.services";

export interface CreateHouse {
  id?: string;
  name: string;
  address: string;
  city?: OptionCommon;
  district?: OptionCommon;
  commune?: OptionCommon;
  status: HouseStatusEnum;
}

export enum HouseStatusEnum {
  AVAILABLE = "AVAILABLE",
  FULL = "FULL",
  UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
}

class houseServices {
  createHouse(payload: CreateHouse) {
    return httpServices.axios.post(baseHouseApi, payload);
  }

  getHouseList() {
    return httpServices.axios.get(baseHouseApi);
  }

  getHouseDetail(id: string) {
    return httpServices.axios.get(`${baseHouseApi}/${id}`);
  }
}

const HouseServices = new houseServices();
export default HouseServices;
