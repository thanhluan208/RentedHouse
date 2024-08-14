import { useFormikContext } from "formik";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect } from "react";
import { isString } from "lodash";
import { BillQuantityType } from "../../../../Interfaces/common";

const FormikEffectPDF = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const { room } = values;
  //! Function
  useEffect(() => {
    const newBill = []
    if (!isString(room) && room?.price) {
      if (room.price) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Tiền phòng",
          price: room.price,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.price,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (room.electricityFee) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Tiền điện",
          price: room.electricityFee,
          quantity: 1,
          unit: "kWh",
          unitPrice: room.electricityFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (room.internetFee) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Tiền internet",
          price: room.internetFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.internetFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (room.waterFee) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Tiền nước",
          price: room.waterFee,
          quantity: 1,
          unit: "m3",
          unitPrice: room.waterFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (room.livingExpense) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Phí sinh hoạt",
          price: room.livingExpense,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.livingExpense,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      if (room.parkingFee) {
        newBill.push({
          id: `${newBill.length + 1}`,
          name: "Tiền đỗ xe",
          price: room.parkingFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.parkingFee,
          type: BillQuantityType.MONTH,
          status: "unpaid",
        });
      }

      setFieldValue("bill", newBill);
    }
  }, [room]);

  //! Render
  return null;
};

export default FormikEffectPDF;
