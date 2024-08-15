import { useCallback, useEffect, useState } from "react";
import BillServices from "../Services/Bill.service";
import { BillQuantityType, BillStatus } from "../Interfaces/common";
import { AxiosResponse } from "axios";
import { Guest, RoomDetail } from "./useGetRoomDetail";
import { CommonFilter } from "../Pages/Home/interface";

export interface BillResponse {
  _id: string;
  status: BillStatus;
  room: RoomDetail;
  guest: Guest;
  startDate: Date;
  endDate: Date;
  contents: Content[];
  images: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  proves?: string[];
  payDate?: Date;
  __v: number;
}

export interface Content {
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  type: BillQuantityType;
  price: number;
  _id: string;
  quantityStart?: number;
  quantityEnd?: number;
}

const useGetListBill = (params: CommonFilter, isTrigger = true) => {
  const [data, setData] = useState<BillResponse[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    return BillServices.getListBill(params);
  }, [params]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<BillResponse[]>) => {
      if (response) {
        setData(response.data);
      }
    },
    []
  );

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
  }, [isTrigger,callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListBill;
