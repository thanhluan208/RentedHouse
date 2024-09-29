import { useCallback, useEffect, useState } from "react";
import BillServices from "../Services/Bill.service";
import { AxiosResponse } from "axios";

const useGetTotalBill = (filters: any, isTrigger = true) => {
  const [data, setData] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    const nextFiters = {
      ...filters,
      isExpense: filters.isExpense === "all" ? undefined : filters.isExpense,
      startDate: filters.startDate?.toDate() || undefined,
      endDate: filters.endDate?.toDate() || undefined,
    }
    return BillServices.getTotalBill(nextFiters);
  }, [filters]);

  const transformResponse = useCallback((response?: AxiosResponse<number>) => {
    if (response) {
      setData(response.data);
    }
  }, []);

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
  }, [isTrigger, callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetTotalBill;
