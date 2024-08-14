import { useCallback, useEffect, useState } from "react";
import { GuestDetail } from "./useGetGuestDetail";
import GuestService from "../Services/Guest.service";
import { AxiosResponse } from "axios";

const useGetListGuest = (houseId: string, isTrigger = true) => {
  const [data, setData] = useState<GuestDetail[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    return GuestService.getGuestByHouse(houseId);
  }, [houseId]);

  const transformResponse = useCallback(
    (response: AxiosResponse<GuestDetail[]>) => {
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

export default useGetListGuest;
