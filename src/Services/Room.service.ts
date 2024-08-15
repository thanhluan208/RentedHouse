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
      price: removeAllDot(room.price),
      maxGuest: room.maxGuest,
      size: room.size,
      status: room.status.value.toUpperCase(),
      guests: room.guests,
      electricityFee: removeAllDot(room.electricityFee),
      waterFee: removeAllDot(room.waterFee),
      internetFee: removeAllDot(room.internetFee),
      livingExpense: removeAllDot(room.livingExpense),
      parkingFee: removeAllDot(room.parkingFee),
      expenditure: room.expenditures?.map((expenditure) => {
        return {
          name: expenditure.name,
          price: removeAllDot(expenditure.price + ''),
          unit: expenditure.unit,
          unitPrice: removeAllDot(expenditure.unitPrice + ''),
          quantity: expenditure.quantity,
        };
      }),
    };
  }

  createRoom(room: RoomInitValues) {
    console.log("Room created", this.parsePayloadCreateRoom(room));
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
}

const RoomServices = new roomServices();
export default RoomServices;
