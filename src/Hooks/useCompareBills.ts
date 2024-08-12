import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";
import { Bill } from "../Interfaces/common";

export interface GuestBill {
  id: string;
  billDetails: Bill[];
  fromDate?: number;
  toDate?: number;
  guest: string;
  room: string;
  total?: number;
}

type Params = {
  roomId: string;
  fromDate: number;
};

const useGetCompareBills = (params: Params, options: any) => {
  const [data, setData] = useState<GuestBill[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!params) return;
    return FirebaseServices.getBillsCompare(params);
  }, [params]);

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

    if (options.isTrigger) {
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
  }, [options.isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetCompareBills;
