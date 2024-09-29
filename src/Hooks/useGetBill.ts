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
  isExpense: boolean;
  scheduler?: string;
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

const useGetListBill = (
  params: CommonFilter,
  isTrigger = true,
  loadMore = false
) => {
  const [data, setData] = useState<BillResponse[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(true);

  const callApi = useCallback(() => {
    const nextparams = {
      ...params,
      isExpense: params.isExpense === "all" ? undefined : params.isExpense,
      startDate: params.startDate?.toDate() || undefined,
      endDate: params.endDate?.toDate() || undefined,
    };
    return BillServices.getListBill(nextparams);
  }, [params]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<BillResponse[]>, loadMore = false) => {
      if (response) {
        if (loadMore) {
          return setData((prev) => {
            const nextData = [...prev, ...response.data];
            if (nextData.length === prev.length) {
              setHasMore(false);
            }
            return nextData;
          });
        }
        setData(response.data);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    if (!hasMore) return;
    try {
      const response = await callApi();
      transformResponse(response, loadMore);
    } catch (error: any) {
      setError(error);
    }
  }, [callApi, hasMore, loadMore]);

  useEffect(() => {
    let shouldSetData = true;

    if (isTrigger && hasMore) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response, loadMore);
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
  }, [isTrigger, callApi, loadMore, hasMore]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListBill;
