import { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import SchedulerServices from "@/Services/Scheduler.service";
import { Room } from "@/Pages/Home/interface";

export interface SchedulerResponse {
  _id: string;
  type: string;
  owner: string;
  bills: Bill[];
  isActive: boolean;
  targetMail: string;
  endRule: string;
  cronString: string;
  history: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Bill {
  _id: string;
  status: string;
  room: Room;
  guest: string;
  startDate: Date;
  endDate: Date;
  contents: Content[];
  images: any[];
  owner: string;
  proves: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  payDate: Date;
  isExpense: boolean;
  scheduler: string;
}

export interface Content {
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  type: string;
  price: number;
  _id: string;
}

const useGetListScheduler = (isTrigger = true) => {
  const [data, setData] = useState<SchedulerResponse[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    return SchedulerServices.getSchedulerList();
  }, []);

  const transformResponse = useCallback(
    (response: AxiosResponse<SchedulerResponse[]>) => {
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
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListScheduler;
