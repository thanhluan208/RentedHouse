import { DocumentReference } from "firebase/firestore";
import { RoomInitValues } from "../Pages/HouseDetail/components/AddRoomButton";
import { removeNullAndUndefinedFromObject } from "../Helpers";

class roomModel {
  parsedPayloadAddRoom(
    payload: RoomInitValues,
    houseRef: DocumentReference
  ) {
    return removeNullAndUndefinedFromObject({
        house: houseRef,
        name: payload.name,
        price: payload.price,
        size: payload.size,
        maxGuest: payload.maxGuest,
        status: payload.status,
        electricityFee: payload.electricityFee,
        waterFee: payload.waterFee,
        internetFee: payload.internetFee,
        livingExpense: payload.livingExpense,
        parkingFee: payload.parkingFee,
      });
  }
}


const RoomModel = new roomModel();
export default RoomModel;