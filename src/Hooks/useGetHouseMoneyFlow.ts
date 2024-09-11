import { useCallback, useEffect, useState } from "react";
import HouseServices from "@/Services/House.services";
import { AxiosResponse } from "axios";

export interface MoneyFlowResponse {
  content: string;
  january: MonthData;
  february: MonthData;
  march: MonthData;
  april: MonthData;
  may: MonthData;
  june: MonthData;
  july: MonthData;
  august: MonthData;
  september: MonthData;
  october: MonthData;
  november: MonthData;
  december: MonthData;
  _id: string;
  id?: string;
}

export interface MonthData {
  income: number;
  expense: number;
}

const useGetHouseMoneyFlow = (id: string, year: string, isTrigger = true) => {
  const [data, setData] = useState<MoneyFlowResponse[] | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return HouseServices.getHouseMoneyFlow(id, year);
  }, [id, year]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<MoneyFlowResponse[]>) => {
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
  }, [callApi]);

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

export default useGetHouseMoneyFlow;
