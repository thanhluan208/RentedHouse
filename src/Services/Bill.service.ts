import { cloneDeep } from "lodash";
import { baseBillApi } from "../Constants/api";
import { removeAllDot } from "../Helpers";
import { PDFInitValues } from "../Pages/HouseDetail/components/GenBill/CreateBillButton";
import httpServices from "./http.services";
import { BillResponse } from "../Hooks/useGetBill";
import moment from "moment";
import { BillQuantityType } from "../Interfaces/common";
import { CommonFilter } from "../Pages/Home/interface";
import queryString from "query-string";

export interface PayBill {
  proves: string[];
  payDate: Date;
}

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
      isExpense: payload.isExpense
    };
  };

  parseResponseBill = (response: BillResponse) => {
    return {
      id: response._id,
      room: response.room,
      guest: response.guest,
      fromDate: moment(response.startDate),
      toDate: moment(response.endDate),
      images: response.images,
      status: response.status,
      bill: response.contents.map((item, index) => {
        if (item.type === BillQuantityType.MONTH) {
          return {
            id: index + 1,
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            price: item.price,
            type: item.type,
          };
        } else {
          return {
            id: index + 1,
            name: item.name,
            unit: item.unit,
            startMonthQuantity: item.quantityStart,
            endMonthQuantity: item.quantityEnd,
            unitPrice: item.unitPrice,
            price: item.price,
            type: item.type,
          };
        }
      }),
      isExpense: response.isExpense
    };
  };

  createBill = (payload: PDFInitValues) => {
    const billPayload = this.parsePayloadCreateBill(cloneDeep(payload));
    return httpServices.post(baseBillApi, billPayload);
  };

  updateBill = (payload: PDFInitValues) => {
    const billPayload = this.parsePayloadCreateBill(cloneDeep(payload));
    return httpServices.put(`${baseBillApi}/${payload?.id}`, billPayload);
  };

  getListBill = (filters: CommonFilter) => {
    return httpServices.axios.get(
      `${baseBillApi}?${queryString.stringify(filters)}`
    );
  };

  payBill = (billId: string, payload: PayBill) => {
    return httpServices.post(`${baseBillApi}/${billId}/pay`, payload);
  };

  deleteBill = (billId: string) => {
    return httpServices.delete(`${baseBillApi}/${billId}`);
  };

  getTotalBill = (filters: any) => {
    return httpServices.get(
      `${baseBillApi}/total?${queryString.stringify(filters)}`
    );
  };

  uploadImage = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return httpServices.post(`${baseBillApi}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  genPDf = (billId: string) => {
    return httpServices.get(`${baseBillApi}/${billId}/generatePdf`);
  };
}

const BillServices = new billServices();
export default BillServices;
