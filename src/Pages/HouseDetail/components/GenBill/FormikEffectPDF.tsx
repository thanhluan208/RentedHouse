import { useFormikContext } from "formik";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect, useRef } from "react";
import { isString } from "lodash";
import { BillQuantityType } from "../../../../Interfaces/common";
import { v4 as uuid } from "uuid";

const FormikEffectPDF = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const isFirst = useRef(true);
  const { room } = values;
  //! Function
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!isString(room) && room?.price) {
      if (
        room.price &&
        values.bill.every((item) => item.name !== "Tiền phòng")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Tiền phòng",
          price: room.price,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.price,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (
        room.electricityFee &&
        values.bill.every((item) => item.name !== "Tiền điện")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Tiền điện",
          price: room.electricityFee,
          quantity: 1,
          unit: "kWh",
          unitPrice: room.electricityFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (
        room.internetFee &&
        values.bill.every((item) => item.name !== "Tiền internet")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Tiền internet",
          price: room.internetFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.internetFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (
        room.waterFee &&
        values.bill.every((item) => item.name !== "Tiền nước")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Tiền nước",
          price: room.waterFee,
          quantity: 1,
          unit: "m3",
          unitPrice: room.waterFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (
        room.livingExpense &&
        values.bill.every((item) => item.name !== "Phí sinh hoạt")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Phí sinh hoạt",
          price: room.livingExpense,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.livingExpense,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (
        room.parkingFee &&
        values.bill.every((item) => item.name !== "Tiền đỗ xe")
      ) {
        values.bill.push({
          id: uuid(),
          name: "Tiền đỗ xe",
          price: room.parkingFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.parkingFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      setFieldValue("bill", values.bill);
    }
  }, [room]);

  //! Render
  return null;
};

export default FormikEffectPDF;
