import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";
import { RoomInitValues } from "../Pages/HouseDetail/components/AddRoomButton";
import { Timestamp } from "firebase/firestore";

export interface RoomDetail extends RoomInitValues {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const useGetRoomDetail = (id: string, isTrigger = true) => {
  const [data, setData] = useState<RoomDetail | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return FirebaseServices.getRoomDetail(id);
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

export default useGetRoomDetail;
