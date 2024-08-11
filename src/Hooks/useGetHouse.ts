import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";
import { House } from "../Pages/Home/interface";



const useGetHouse = (id: string, isTrigger = true) => {
  const [data, setData] = useState<House | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return FirebaseServices.getHouseDetail(id);
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

export default useGetHouse;
