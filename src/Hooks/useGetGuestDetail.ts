import { useCallback, useEffect, useState } from "react";
import GuestService from "../Services/Guest.service";
import { AxiosResponse } from "axios";
import { OptionCommon } from "../Interfaces/common";

export interface GuestDetail {
  _id: string;
  name: string;
  gender: string;
  phone: string;
  dob: Date;
  city: OptionCommon;
  commune: OptionCommon;
  district: OptionCommon;
  address: string;
  contract: any[];
  room: string;
  house: string;
  citizenIdFront?: string;
  citizenIdBack?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const useGetGuestDetail = (id: string, isTrigger = true) => {
  const [data, setData] = useState<GuestDetail | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return GuestService.getGuestDetail(id);
  }, [id]);

  const transformResponse = useCallback((response?: AxiosResponse<any>) => {
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

export default useGetGuestDetail;
