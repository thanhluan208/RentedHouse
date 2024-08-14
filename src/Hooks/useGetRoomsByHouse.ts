import { useCallback, useEffect, useState } from "react";
import { RoomDetail } from "./useGetRoomDetail";
import RoomServices from "../Services/Room.service";
import { AxiosResponse } from "axios";

const useGetRoomsByHouse = (houseId?: string, isTrigger = true) => {
  const [data, setData] = useState<RoomDetail[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!houseId) return Promise.resolve([]);
    return RoomServices.getRoomByHouse(houseId);
  }, [houseId]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<RoomDetail[]>) => {
      if (response) {
        setData(response.data);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response as any);
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
            transformResponse(response as any);
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
