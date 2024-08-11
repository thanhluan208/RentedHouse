import { useCallback, useEffect, useState } from "react";
import FirebaseServices from "../Services/Firebase.service";

export interface Room {
  price: string;
  name: string;
  prize: number;
  status: Status;
  size: string;
  house_id: string;
  guests: string[];
  id: string;
}

export interface Status {
  value: string;
  label: string;
}

const useGetListRoomOfHouse = (ids: string[], isTrigger = true) => {
  const [data, setData] = useState<Room[] | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!ids) return;

    const promises = ids.map((id) => {
      return FirebaseServices.getRoomDetail(id);
    });

    return Promise.all(promises);
  }, [ids]);

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

export default useGetListRoomOfHouse;
