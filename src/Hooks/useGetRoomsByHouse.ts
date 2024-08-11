import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";
import { RoomDetail } from "./useGetRoomDetail";

const useGetRoomsByHouse = (houseId?: string, isTrigger = true) => {
  const [data, setData] = useState<RoomDetail[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!houseId) return Promise.resolve([]);
    return FirebaseServices.getRoomByHouse(houseId);
  }, []);

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

export default useGetRoomsByHouse;
