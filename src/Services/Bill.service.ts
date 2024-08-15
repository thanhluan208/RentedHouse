import { cloneDeep } from "lodash";
import { baseBillApi } from "../Constants/api";
import { removeAllDot } from "../Helpers";
import { PDFInitValues } from "../Pages/HouseDetail/components/GenBill/GenPdfButton";
import httpServices from "./http.services";

class billServices {
  parsePayloadCreateBill = (payload: PDFInitValues) => {
    return {
      room: payload.room?._id,
      guest: payload.guest?._id,
      startDate: payload.fromDate?.toDate(),
      endDate: payload.toDate?.toDate(),
      contents: payload.bill?.map((item) => {
        return {
          name: item.name,
          unit: item.unit,
          quantity: item.quantity,
          quantityStart: item.startMonthQuantity,
          quantityEnd: item.endMonthQuantity,
          unitPrice: +removeAllDot(item.unitPrice + ""),
          price: +removeAllDot(item.price + ""),
          type: item.type,
        };
      }),
      images: payload.images,
    };
  };

  createBill = (payload: PDFInitValues) => {
    console.log("Bill created", this.parsePayloadCreateBill(cloneDeep(payload)));
    const billPayload = this.parsePayloadCreateBill(cloneDeep(payload));
    return httpServices.post(baseBillApi, billPayload);
  };
}

const BillServices = new billServices();
export default BillServices;
