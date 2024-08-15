import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";
import { HouseStatusEnum } from "../Services/House.services";

export interface RoomDetail {
  _id: string;
  name: string;
  status: HouseStatusEnum;
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
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  price: number;
  _id?: string;
}

export interface Guest {
  _id: string;
  name: string;
  gender: string;
  phone: string;
  dob: Date;
  city: City;
  commune: City;
  district: City;
  address: string;
  contract: string[];
  room: string;
  house: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  citizenIdBack: string;
  citizenIdFront: string;
}

export interface City {
  value: string;
  label: string;
  _id: string;
}

const useGetRoomDetail = (id: string, isTrigger = true) => {
  const [data, setData] = useState<RoomDetail | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return FirebaseServices.getRoomDetail(id);
  }, [id]);

  const transformResponse = useCallback((response: any) => {
    if (response) {
      setData(response);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    let shouldSetData = true;

    if (isTrigger) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        shouldSetData = false;
      };
    }
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetRoomDetail;
