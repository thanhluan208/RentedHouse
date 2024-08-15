import { baseGuestApi } from "../Constants/api";
import { GuestInitValue } from "../Pages/Guest/components/AddGuestButton";
import httpServices from "./http.services";

interface AddNewGuestPayload extends Omit<GuestInitValue, "dob" | "gender"> {
  dob?: Date;
  gender?: string;
}

class guestService {
  createGuest(payload: AddNewGuestPayload) {
    return httpServices.axios.post(baseGuestApi, payload);
  }

  getGuestDetail(id: string) {
    return httpServices.axios.get(`${baseGuestApi}/${id}`);
  }

  updateGuestInfo(id: string, payload: AddNewGuestPayload) {
    return httpServices.axios.patch(`${baseGuestApi}/${id}`, payload);
  }

  getGuestByHouse(houseId: string) {
    return httpServices.axios.get(`${baseGuestApi}?house=${houseId}`);
  }

  getListGuest() {
    return httpServices.axios.get(baseGuestApi);
  }
}

const GuestService = new guestService();
export default GuestService;
