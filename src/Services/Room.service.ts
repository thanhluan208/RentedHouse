import { isString } from "lodash";
import { baseRoomApi } from "../Constants/api";
import { removeAllDot } from "../Helpers";
import { GuestInitValue } from "../Pages/Guest/components/AddGuestButton";
import { RoomInitValues } from "../Pages/HouseDetail/components/AddRoomButton";
import httpServices from "./http.services";

interface AddNewGuestPayload extends Omit<GuestInitValue, "dob" | "gender"> {
  dob?: Date;
  gender?: string;
}

class roomServices {
  parsePayloadCreateRoom(room: RoomInitValues) {
    return {
      house: room.house,
      name: room.name,
      price: Number(removeAllDot(room.price)),
      maxGuest: room.maxGuest,
      size: room.size,
      status: isString(room?.status)
        ? room?.status.toUpperCase()
        : room?.status?.value?.toUpperCase(),
      guests: room.guests,
      electricityFee: Number(removeAllDot(room.electricityFee)),
      waterFee: Number(removeAllDot(room.waterFee)),
      internetFee: Number(removeAllDot(room.internetFee)),
      livingExpense: Number(removeAllDot(room.livingExpense)),
      parkingFee: Number(removeAllDot(room.parkingFee)),
      expenditure: room.expenditures?.map((expenditure) => {
        return {
          name: expenditure.name,
          price: Number(removeAllDot(expenditure.price + "")),
          unit: expenditure.unit,
          unitPrice: Number(removeAllDot(expenditure.unitPrice + "")),
          quantity: expenditure.quantity,
        };
      }),
    };
  }

  createRoom(room: RoomInitValues) {
    const payload = this.parsePayloadCreateRoom(room);
    return httpServices.axios.post(baseRoomApi, payload);
  }

  removeGuest(roomId: string, guestId: string) {
    return httpServices.axios.post(`${baseRoomApi}/${roomId}/remove-guest`, {
      guestId,
    });
  }

  deleteRoom(roomId: string) {
    return httpServices.axios.delete(`${baseRoomApi}/${roomId}`);
  }

  addNewGuest(roomId: string, payload: AddNewGuestPayload) {
    console.log("Add new guest", payload, roomId);
    // return httpServices.axios.post(`${baseRoomApi}/${roomId}/add-guest`, payload);
  }

  getRoomByHouse(houseId: string) {
    return httpServices.axios.get(`${baseRoomApi}?house=${houseId}`);
  }

  getListRoom() {
    return httpServices.axios.get(baseRoomApi);
  }

  updateRoom(id: string, room: RoomInitValues) {
    if (!id) return;
    const payload = this.parsePayloadCreateRoom(room);
    return httpServices.axios.patch(`${baseRoomApi}/${id}`, payload);
  }
}

const RoomServices = new roomServices();
export default RoomServices;
