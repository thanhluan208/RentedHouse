import { useCallback, useEffect, useState } from "react";
import { House } from "../Pages/Home/interface";
import HouseServices from "../Services/House.services";
import { AxiosResponse } from "axios";

const useGetHouse = (id: string, isTrigger = true) => {
  const [data, setData] = useState<House | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return HouseServices.getHouseDetail(id);
  }, [id]);

  const transformResponse = useCallback((response?: AxiosResponse<House>) => {
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

export default useGetHouse;
